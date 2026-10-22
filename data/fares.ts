// BTS Green Line fares, structured as of the 2025-11-01 change.
//
// Calculation layers (first match wins):
// 1) FARE_MATRIX — optional exact station-pair overrides (code → code → THB).
// 2) Core concession (Mo Chit–On Nut, National Stadium–Wongwian Yai):
//    fare by station count, BTSC table effective 2023-01-01 (17–47 THB).
// 3) BMA extensions (Mo Chit–Khu Khot, On Nut–Kheha, Wongwian Yai–Bang Wa):
//    distance-based 17–45 THB since 2025-11-01; approximated per station here
//    until the official distance table is published in machine-readable form.
// 4) Cross-zone trips: core + extension fares summed, capped at 65 THB.

export type FareMatrix = Record<string, Record<string, number>>;

/** Exact per-pair overrides. Fill from the official BTS fare chart. */
export const FARE_MATRIX: FareMatrix = {};

/**
 * Core concession fare by number of stations travelled.
 * Source: BTSC announcement (30 Nov 2022), effective 2023-01-01.
 */
export const CORE_FARE_BY_STATIONS: Readonly<Record<number, number>> = {
  1: 17,
  2: 25,
  3: 28,
  4: 32,
  5: 35,
  6: 40,
  7: 43,
};

/** 8+ stations within the core concession. */
export const CORE_FARE_MAX = 47;

/** Extension section pricing (2025-11-01). */
export const EXT_FARE_BASE = 17;
/** First N extension stations cost only the base fare. */
export const EXT_FARE_FREE_STATIONS = 2;
/** Baht per extension station beyond the first N. */
export const EXT_FARE_PER_STATION = 2;
export const EXT_FARE_MAX = 45;

/** Hard cap for any single journey crossing core + extensions. */
export const COMBINED_FARE_MAX = 65;

export const FARE_NOTES = {
  currency: "THB",
  effective: "2025-11-01",
  /** True while extension fares are approximated per station. */
  approximate: true,
  sources: [
    "https://www.nationthailand.com/news/general/40057166",
    "https://isranews.org/article/isranews-other-news/114071-isranews-1000-518.html",
    "https://thestandard.co/bts-green-line-extension-new-fare",
  ],
};
