import { FARE_MATRIX } from "@/data/fares";
import {
  STATIONS,
  STATIONS_BY_LINE,
  type BTSLine,
  type Station,
} from "@/data/stations";

/**
 * Simplified fare model (stub):
 * BTS single-journey fares run 17–65 THB in ~3 THB steps by distance.
 * Until the real tariff matrix is loaded, we approximate by station count:
 * 17 THB base + 3 THB per additional stop, capped at 65 THB.
 */
const BASE_FARE = 17;
const FARE_STEP = 3;
const MAX_FARE = 65;

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
  /** True when the value came from FARE_MATRIX, false when approximated */
  exact: boolean;
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

  const stops = path
    .slice(0, -1)
    .filter((s, i) => !isInterchangeEdge(s, path[i + 1])).length;
  const transfers = path
    .slice(0, -1)
    .filter((s, i) => s.line !== path[i + 1].line).length;

  const lines: BTSLine[] = [];
  for (const s of path) {
    if (lines[lines.length - 1] !== s.line) lines.push(s.line);
  }

  const exactFare =
    FARE_MATRIX[from.code]?.[to.code] ?? FARE_MATRIX[to.code]?.[from.code];

  return {
    from,
    to,
    fare: exactFare ?? Math.min(MAX_FARE, BASE_FARE + FARE_STEP * (stops - 1)),
    exact: exactFare !== undefined,
    minutes: Math.round(stops * MINUTES_PER_STOP + transfers * MINUTES_PER_TRANSFER),
    stops,
    transfers,
    lines,
    path,
  };
}
