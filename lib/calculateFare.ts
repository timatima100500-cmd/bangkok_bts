import { FARE_MATRIX, DEFAULT_FARE } from "@/data/fares";
import { STATIONS, getStationById, type Station } from "@/data/stations";

export interface FareResult {
  from: Station;
  to: Station;
  /** Price in THB */
  fare: number;
  /** True when the value came from FARE_MATRIX, false when fallback used */
  exact: boolean;
}

export class FareError extends Error {}

/**
 * Stub fare calculation.
 * Uses FARE_MATRIX when an exact pair is present, otherwise falls back to
 * DEFAULT_FARE. Replace with real distance-based logic later.
 */
export function calculateFare(fromId: string, toId: string): FareResult {
  const from = getStationById(fromId);
  const to = getStationById(toId);

  if (!from) throw new FareError(`Unknown station id: ${fromId}`);
  if (!to) throw new FareError(`Unknown station id: ${toId}`);
  if (from.id === to.id) throw new FareError("Origin and destination are the same station");

  const fare = FARE_MATRIX[from.id]?.[to.id] ?? FARE_MATRIX[to.id]?.[from.id];

  return {
    from,
    to,
    fare: fare ?? DEFAULT_FARE,
    exact: fare !== undefined,
  };
}

/** All stations, for select UIs. */
export { STATIONS };
