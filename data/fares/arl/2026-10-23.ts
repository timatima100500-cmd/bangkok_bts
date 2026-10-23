import type { FareSource, FareValue } from "@/lib/fareModel";

// Snapshot version date; the operator has not confirmed a current effective date.
export const effectiveFrom = "2026-10-23";
export const sources: FareSource[] = [{
  id: "srt-arl-fare-chart", kind: "model", title: "Stop-count model from SRT Airport Rail Link fare chart (historical publication; current validity unverified)",
  url: "https://www.railway.co.th/RailwayMiddleFile/NewsAndActImg/63/G08.pdf",
}];
export const approximate = true;

// Official SRT chart gives the Suvarnabhumi row as 15, 20, 25, 30, 35,
// 40, 45 THB for one to seven stops. Applying it to other pairs is a model.
// TODO(verify): confirm current AERA1 fares and a complete pairwise chart.
const model = (amount: number): FareValue => ({
  amount, currency: "THB", accuracy: "approximate", source: sources[0],
  effectiveFrom: null, recordedAt: "2026-10-23", verifiedAt: null,
});

export const fareByStops: Readonly<Record<number, FareValue>> = Object.fromEntries(
  Array.from({ length: 7 }, (_, index) => [index + 1, model(15 + 5 * index)]),
);

export function fareForStops(stops: number): FareValue {
  return fareByStops[Math.min(Math.max(stops, 1), 7)];
}
