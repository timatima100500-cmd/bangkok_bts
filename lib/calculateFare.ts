import { getFareTable } from "@/lib/fareTables";
import { sumFareLegs, type FareValue, type JourneyFare } from "@/lib/fareModel";
import {
  STATIONS,
  STATIONS_BY_LINE,
  type BTSLine,
  type Station,
} from "@/data/stations";

/**
 * Extension station groups used by the retained legacy model:
 * - Mo Chit–Khu Khot: N9–N24
 * - On Nut–Kheha: E10–E23
 * - Wongwian Yai–Bang Wa: S9–S12
 * Everything else (including the Gold Line) is treated as core concession.
 */
const EXTENSION_CODES = new Set<string>([
  ...range(9, 24).map((n) => `N${n}`),
  ...range(10, 23).map((n) => `E${n}`),
  ...range(9, 12).map((n) => `S${n}`),
]);

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/** Average travel time per stop / per transfer, in minutes. */
const MINUTES_PER_STOP = 2.5;
const MINUTES_PER_TRANSFER = 4;

export type FareErrorCode = "sameStation" | "noRoute";

export class FareError extends Error {
  code: FareErrorCode;
  constructor(code: FareErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

type NodeKey = string; // `${line}:${code}` — unique per line-station entry

const nodeKey = (s: Station): NodeKey => `${s.line}:${s.code}`;

const stationByKey = new Map<NodeKey, Station>(
  STATIONS.map((s) => [nodeKey(s), s]),
);

/** Physical interchanges that use different codes across lines. */
const INTERCHANGE_CODE_PAIRS: Array<[string, string]> = [["S7", "G1"]];

function buildGraph(): Map<NodeKey, Set<NodeKey>> {
  const graph = new Map<NodeKey, Set<NodeKey>>();

  const addEdge = (a: Station, b: Station) => {
    const ka = nodeKey(a);
    const kb = nodeKey(b);
    if (!graph.has(ka)) graph.set(ka, new Set());
    if (!graph.has(kb)) graph.set(kb, new Set());
    graph.get(ka)!.add(kb);
    graph.get(kb)!.add(ka);
  };

  // Consecutive stations within each line (lists are in travel order).
  for (const list of Object.values(STATIONS_BY_LINE)) {
    for (let i = 0; i < list.length - 1; i++) {
      addEdge(list[i], list[i + 1]);
    }
  }

  // Same code on two lines = same physical station (e.g. CEN/Siam).
  const byCode = new Map<string, Station[]>();
  for (const s of STATIONS) {
    const list = byCode.get(s.code) ?? [];
    list.push(s);
    byCode.set(s.code, list);
  }
  for (const list of byCode.values()) {
    for (let i = 0; i < list.length - 1; i++) addEdge(list[i], list[i + 1]);
  }

  // Cross-line interchanges with different codes (Krung Thon Buri S7 ↔ G1).
  for (const [codeA, codeB] of INTERCHANGE_CODE_PAIRS) {
    for (const a of byCode.get(codeA) ?? []) {
      for (const b of byCode.get(codeB) ?? []) addEdge(a, b);
    }
  }

  return graph;
}

const GRAPH = buildGraph();

export interface FareResult {
  from: Station;
  to: Station;
  /** Price in THB */
  fare: number;
  /** Only true for a currently verified fare, not merely a historical matrix entry. */
  exact: boolean;
  pricing: JourneyFare;
  /** Estimated travel time in minutes */
  minutes: number;
  /** Number of station-to-station hops */
  stops: number;
  /** Number of line changes */
  transfers: number;
  /** Lines used, in travel order */
  lines: BTSLine[];
  /** Full station-by-station path */
  path: Station[];
  /** Stops inside the core concession / extensions */
  zoneStops: { core: number; extension: number };
}

/** True when two nodes are the same physical station (an interchange hop). */
function isInterchangeEdge(a: Station, b: Station): boolean {
  if (a.code === b.code) return true;
  return INTERCHANGE_CODE_PAIRS.some(
    ([x, y]) =>
      (a.code === x && b.code === y) || (a.code === y && b.code === x),
  );
}

/** BFS shortest path by hop count between two line-station nodes. */
function findPath(from: Station, to: Station): Station[] | null {
  const start = nodeKey(from);
  const goal = nodeKey(to);

  const prev = new Map<NodeKey, NodeKey>();
  const visited = new Set<NodeKey>([start]);
  const queue: NodeKey[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === goal) break;

    for (const next of GRAPH.get(current) ?? []) {
      if (visited.has(next)) continue;
      visited.add(next);
      prev.set(next, current);
      queue.push(next);
    }
  }

  if (!visited.has(goal)) return null;

  const nodePath: NodeKey[] = [];
  for (let node: NodeKey | undefined = goal; node; node = prev.get(node)) {
    nodePath.unshift(node);
    if (node === start) break;
  }

  return nodePath
    .map((key) => stationByKey.get(key))
    .filter((s): s is Station => s !== undefined);
}

export function calculateFare(from: Station, to: Station): FareResult {
  if (from.code === to.code && from.line === to.line) {
    throw new FareError("sameStation", "Origin and destination are the same station");
  }

  const path = findPath(from, to);
  if (!path || path.length < 2) {
    throw new FareError("noRoute", "No route found between these stations");
  }

  const {
    FARE_MATRIX,
    CORE_FARE_BY_STATIONS,
    CORE_FARE_MAX,
    EXT_FARE_BY_STATIONS,
    EXT_FARE_MAX,
    COMBINED_FARE_MAX,
    GOLD_LINE_FARE,
    ZERO_FARE,
  } = getFareTable("bts", new Date());

  const stops = path
    .slice(0, -1)
    .filter((s, i) => !isInterchangeEdge(s, path[i + 1])).length;
  const transfers = path
    .slice(0, -1)
    .filter((s, i) => s.line !== path[i + 1].line).length;

  // Split stops between core concession and BMA extensions.
  const extensionStops = path
    .slice(0, -1)
    .filter(
      (s, i) =>
        !isInterchangeEdge(s, path[i + 1]) &&
        (EXTENSION_CODES.has(s.code) || EXTENSION_CODES.has(path[i + 1].code)),
    ).length;
  const coreStops = stops - extensionStops;

  const coreFare =
    coreStops === 0
      ? 0
      : coreStops >= 8
        ? CORE_FARE_MAX.amount
        : (CORE_FARE_BY_STATIONS[coreStops] ?? CORE_FARE_MAX).amount;
  const extensionFare =
    extensionStops === 0
      ? 0
      : Math.min(
          EXT_FARE_MAX.amount,
          (EXT_FARE_BY_STATIONS[extensionStops] ?? EXT_FARE_MAX).amount,
        );

  const lines: BTSLine[] = [];
  for (const s of path) {
    if (lines[lines.length - 1] !== s.line) lines.push(s.line);
  }

  const exactFare =
    FARE_MATRIX[from.code]?.[to.code] ?? FARE_MATRIX[to.code]?.[from.code];

  // Gold standalone trips use the retained flat-fare estimate. Mixed journeys
  // are split into separate ticketed legs below.
  const isGoldOnly = lines.length === 1 && lines[0] === "gold";

  let pricing: JourneyFare;
  if (lines.includes("gold") && !isGoldOnly) {
    // Gold requires its own ticket even though BTSC operates both services.
    // Split at paid-system boundaries; no global BTS cap across separate tickets.
    const segments: Station[][] = [];
    for (const station of path) {
      const last = segments[segments.length - 1];
      if (!last || last[0].fareSystem !== station.fareSystem) segments.push([station]);
      else last.push(station);
    }
    const legs = segments.filter((segment) => segment.length > 1).flatMap((segment) =>
      calculateFare(segment[0], segment[segment.length - 1]).pricing.legs,
    );
    pricing = sumFareLegs(legs.length ? legs : [{
      operator: from.operator, fareSystem: from.fareSystem,
      fromCode: from.code, toCode: to.code, amount: 0, values: [ZERO_FARE],
    }]);
  } else {
    const values: FareValue[] = exactFare ? [exactFare] : isGoldOnly ? [GOLD_LINE_FARE] : [
      ...(coreStops ? [CORE_FARE_BY_STATIONS[coreStops] ?? CORE_FARE_MAX] : []),
      ...(extensionStops ? [EXT_FARE_BY_STATIONS[extensionStops] ?? EXT_FARE_MAX] : []),
      ...(coreFare + extensionFare > COMBINED_FARE_MAX.amount ? [COMBINED_FARE_MAX] : []),
    ];
    const fare = exactFare?.amount ?? (isGoldOnly ? GOLD_LINE_FARE.amount
      : Math.min(COMBINED_FARE_MAX.amount, coreFare + extensionFare));
    pricing = sumFareLegs([{
      operator: from.operator, fareSystem: from.fareSystem,
      fromCode: from.code, toCode: to.code, amount: fare,
      values: values.length ? values : [ZERO_FARE],
    }]);
  }

  return {
    from,
    to,
    fare: pricing.amount!,
    exact: !pricing.approximate,
    pricing,
    minutes: Math.round(stops * MINUTES_PER_STOP + transfers * MINUTES_PER_TRANSFER),
    stops,
    transfers,
    lines,
    path,
    zoneStops: { core: coreStops, extension: extensionStops },
  };
}
