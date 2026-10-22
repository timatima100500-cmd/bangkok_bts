// Fare matrix stub.
// TODO: replace with the real BTS Suksamran fares (distance-based, 16–62 THB
// single journey) once verified against official BTS sources.
// Shape: FARE_MATRIX[fromId][toId] = price in THB.

export type FareMatrix = Record<string, Record<string, number>>;

export const FARE_MATRIX: FareMatrix = {
  // Stub: flat 42 THB between any two distinct stations for now.
};

export const DEFAULT_FARE = 42;

export const FARE_NOTES = {
  currency: "THB",
  lastVerified: null as string | null,
};
