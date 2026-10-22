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

/**
 * Exact per-pair overrides (highest priority). Verified anchors:
 * - Mo Chit–Khu Khot / On Nut–Kheha: published 45 THB maximum extension fares
 * - Ha Yaek Lat Phrao–Ari: 45 THB (reported Nov 2025, crosses the zone
 *   boundary including the unbuilt N6 gap that station counts undershoot)
 * Fill further pairs from the official BTS fare chart as they are verified.
 */
export const FARE_MATRIX: FareMatrix = {
  N8: { N24: 45 },
  E9: { E23: 45 },
  N9: { N5: 45 },
};

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

/**
 * Extension section fare by number of extension stations travelled,
 * effective 2025-11-01 (17–45 THB by distance; approximated per station).
 * Calibrated so Thong Lo→Bang Na (core 3 + ext 4) matches the real ~47 THB.
 */
export const EXT_FARE_BY_STATIONS: Readonly<Record<number, number>> = {
  1: 17,
  2: 17,
  3: 18,
  4: 19,
  5: 21,
  6: 23,
  7: 25,
  8: 27,
  9: 29,
  10: 31,
  11: 33,
  12: 35,
  13: 37,
  14: 39,
  15: 41,
  16: 43,
};

export const EXT_FARE_MAX = 45;

/** Hard cap for any single journey crossing core + extensions. */
export const COMBINED_FARE_MAX = 65;

/** Gold Line (Krung Thon Buri–Khlong San) is a flat fare, any distance. */
export const GOLD_LINE_FARE = 16;

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
