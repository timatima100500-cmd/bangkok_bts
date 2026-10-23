import type { FareSource, FareValue } from "@/lib/fareModel";

/** Legacy values are retained for compatibility, not presented as live verified prices. */
export const FARE_SOURCES: Record<"archive" | "model", FareSource> = {
  archive: {
    id: "bts-sjt-2024", title: "BTS single journey fare chart, 2 January 2024",
    kind: "archive", document: "reference/old-src/fare_SJT_2JAN24.docx",
  },
  model: {
    id: "bts-legacy-model", title: "Legacy BTS calculator estimate (not revalidated with the operator)",
    kind: "model", document: "data/fares.ts",
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

export type FareMatrix = Record<string, Record<string, FareValue>>;

export const FARE_MATRIX: FareMatrix = {
  N8: { N24: estimate(45) },
  E9: { E23: estimate(45) },
  N9: { N5: estimate(45) },
  // Core-only anchors extracted from reference/old-src/fare_SJT_2JAN24.docx.
  // Checked in both directions against its 61-column chart (including future N6).
  // Historical references only; current validity has not been verified.
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
 * Legacy extension model by station count; not an official distance table.
 * The original calibration keeps Thong Lo→Bang Na at 47 THB.
 */
export const EXT_FARE_BY_STATIONS: Readonly<Record<number, FareValue>> = {
  1: estimate(17),
  2: estimate(17),
  3: estimate(18),
  4: estimate(19),
  5: estimate(21),
  6: estimate(23),
  7: estimate(25),
  8: estimate(27),
  9: estimate(29),
  10: estimate(31),
  11: estimate(33),
  12: estimate(35),
  13: estimate(37),
  14: estimate(39),
  15: estimate(41),
  16: estimate(43),
};

export const EXT_FARE_MAX = estimate(45);

/** Hard cap for any single journey crossing core + extensions. */
export const COMBINED_FARE_MAX = estimate(65);

/** Legacy Gold Line flat-fare estimate; current official validity is unverified. */
export const GOLD_LINE_FARE = estimate(16);

export const ZERO_FARE = estimate(0);

export const FARE_NOTES = {
  currency: "THB",
  approximate: true,
  recordedAt: "2026-10-23",
  sources: Object.values(FARE_SOURCES),
};
