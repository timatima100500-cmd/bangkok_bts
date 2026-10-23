import type { FareSource, FareValue } from "@/lib/fareModel";

// The operator's matrix displayed fares for 22 October 2026.
export const effectiveFrom = "2026-10-22";
export const sources: FareSource[] = [{
  id: "srtet-red-fares-2026-10-22", kind: "official", title: "SRTET Red Line adult fare matrix, 22 October 2026",
  url: "https://www.srtet.co.th/en/fare-information",
}];
export const approximate = false;

const value = (amount: number): FareValue => ({
  amount, currency: "THB", accuracy: "verified", source: sources[0],
  effectiveFrom: null, recordedAt: "2026-10-23", verifiedAt: "2026-10-23",
});

// Adult fare rows RN01–RN08, columns from the same station through RN08.
// SRTET publishes the complete matrix. Stations beyond Don Mueang are out of scope.
const adultRows = [
  [12, 16, 19, 20, 23, 27, 30, 33],
  [12, 15, 17, 19, 23, 26, 29],
  [12, 14, 16, 20, 23, 26],
  [12, 14, 19, 22, 25],
  [12, 17, 20, 23],
  [12, 15, 18],
  [12, 15],
  [12],
] as const;

export function fareForPair(fromCode: string, toCode: string): FareValue {
  const a = Number(fromCode.slice(2)) - 1;
  const b = Number(toCode.slice(2)) - 1;
  if (!/^RN0[1-8]$/.test(fromCode) || !/^RN0[1-8]$/.test(toCode)) {
    throw new RangeError(`Red Line fare unavailable for ${fromCode} → ${toCode}`);
  }
  return value(adultRows[Math.min(a, b)][Math.abs(a - b)]);
}
