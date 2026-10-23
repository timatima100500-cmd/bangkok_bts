import type { FareSource, FareValue } from "@/lib/fareModel";

export const effectiveFrom = "2026-07-03";
export const sources: FareSource[] = [{
  id: "bem-blue-2026-fares", kind: "model", title: "Stop-count model from BEM Blue Line fare announcement, effective 3 July 2026",
  url: "https://metro.bemplc.co.th/Metro-News-Detail?id=40995&lang=th",
}];
export const approximate = true;

// BEM publishes the 17–44 THB adult range here, but this source is not a
// pairwise fare table. Interpolate by stops; every generated amount is a model.
// TODO(verify): replace with the operator's full origin–destination matrix.
const model = (amount: number): FareValue => ({
  amount, currency: "THB", accuracy: "approximate", source: sources[0],
  effectiveFrom, recordedAt: "2026-10-23", verifiedAt: null,
});

export const fareByStops: Readonly<Record<number, FareValue>> = Object.fromEntries(
  Array.from({ length: 12 }, (_, index) => {
    const stops = index + 1;
    return [stops, model(Math.min(44, 17 + Math.round((stops - 1) * 27 / 11)))];
  }),
);

export function fareForStops(stops: number): FareValue {
  return fareByStops[Math.min(Math.max(stops, 1), 12)];
}
