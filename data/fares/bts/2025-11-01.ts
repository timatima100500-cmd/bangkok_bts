import type { FareSource, FareValue } from "@/lib/fareModel";

/** Legacy values are retained for compatibility, not presented as live verified prices. */
export const FARE_SOURCES: Record<"archive" | "model" | "extensions" | "extensionHistory" | "extensionReport", FareSource> = {
  archive: {
    id: "bts-sjt-2024", title: "BTS single journey fare chart, 2 January 2024",
    kind: "archive",
  },
  model: {
    id: "bts-legacy-model", title: "Legacy BTS calculator estimate (not revalidated with the operator)",
    kind: "model", document: "data/fares.ts",
  },
  extensions: {
    id: "bts-extensions-2025-model", title: "BTS extension fare model; 2025 change reported by The Nation",
    kind: "model", url: "https://www.nationthailand.com/news/general/40057166",
  },
  extensionHistory: {
    id: "bts-extensions-historical-context", title: "Isranews report on previous BTS fare change",
    kind: "archive", url: "https://isranews.org/article/isranews-other-news/114071-isranews-1000-518.html",
  },
  extensionReport: {
    id: "bts-extensions-standard-report", title: "The Standard report linked in the earlier fare notes; availability unverified",
    kind: "archive", url: "https://thestandard.co/bts-green-line-extension-new-fare",
  },
};

const historical = (amount: number): FareValue => ({
  amount, currency: "THB", accuracy: "historical", source: FARE_SOURCES.archive,
  effectiveFrom: "2023-01-01", recordedAt: "2026-10-23", verifiedAt: null,
});
const estimate = (amount: number): FareValue => ({
  amount, currency: "THB", accuracy: "approximate", source: FARE_SOURCES.model,
  effectiveFrom: null, recordedAt: "2026-10-23", verifiedAt: null,
});
const extensionEstimate = (amount: number): FareValue => ({
  ...estimate(amount), source: FARE_SOURCES.extensions, effectiveFrom: "2025-11-01",
});

export type FareMatrix = Record<string, Record<string, FareValue>>;

export const FARE_MATRIX: FareMatrix = {
  N8: { N24: extensionEstimate(45) },
  E9: { E23: extensionEstimate(45) },
  N9: { N5: extensionEstimate(45) },
  // Legacy core anchors from an unavailable 2024 chart; current validity is unverified.
  // TODO(verify): find the official BTS fare table before using these as current fares.
  CEN: { E1: historical(17), E9: historical(47) },
  E1: { E2: historical(17) },
  E2: { E3: historical(17) },
  E3: { E4: historical(17) },
  E4: { E5: historical(17) },
  E5: { E6: historical(17) },
  E6: { E7: historical(17), E9: historical(28) },
  E7: { E8: historical(17) },
  E8: { E9: historical(17) },
  S2: { S3: historical(17) },
};

/**
 * Core concession fare by number of stations travelled.
 * Source: BTSC announcement (30 Nov 2022), effective 2023-01-01.
 */
export const CORE_FARE_BY_STATIONS: Readonly<Record<number, FareValue>> = {
  1: historical(17),
  2: historical(25),
  3: historical(28),
  4: historical(32),
  5: historical(35),
  6: historical(40),
  7: historical(43),
};

/** 8+ stations within the core concession. */
export const CORE_FARE_MAX = historical(47);

/**
 * Legacy extension model by station count, anchored to the 2025-11-01 change.
 * The linked reports do not establish these per-station amounts.
 * TODO(verify): compare every amount with the official BTS distance table.
 * The original calibration keeps Thong Lo→Bang Na at 47 THB.
 */
export const EXT_FARE_BY_STATIONS: Readonly<Record<number, FareValue>> = {
  1: extensionEstimate(17),
  2: extensionEstimate(17),
  3: extensionEstimate(18),
  4: extensionEstimate(19),
  5: extensionEstimate(21),
  6: extensionEstimate(23),
  7: extensionEstimate(25),
  8: extensionEstimate(27),
  9: extensionEstimate(29),
  10: extensionEstimate(31),
  11: extensionEstimate(33),
  12: extensionEstimate(35),
  13: extensionEstimate(37),
  14: extensionEstimate(39),
  15: extensionEstimate(41),
  16: extensionEstimate(43),
};

export const EXT_FARE_MAX = extensionEstimate(45);

/** Hard cap for any single journey crossing core + extensions. */
export const COMBINED_FARE_MAX = extensionEstimate(65);

/** Legacy Gold Line flat-fare estimate; current official validity is unverified. */
export const GOLD_LINE_FARE = estimate(16);

export const ZERO_FARE = estimate(0);

export const FARE_NOTES = {
  currency: "THB",
  approximate: true,
  effective: "2025-11-01",
  recordedAt: "2026-10-23",
  sources: Object.values(FARE_SOURCES),
};

export const effectiveFrom = FARE_NOTES.effective;
export const sources = FARE_NOTES.sources;
export const approximate = FARE_NOTES.approximate;
