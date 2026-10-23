import { getStationByCode } from "@/data/stations";
import { getMetroStationByCode } from "@/data/metroStations";
import { calculateFare } from "@/lib/calculateFare";

export function getRouteContent(pair: string) {
  const match = /^([A-Z0-9]+)-([A-Z0-9]+)$/.exec(pair.toUpperCase());
  if (!match || match[1] === match[2]) return null;
  const from = getMetroStationByCode(match[1]);
  const to = getMetroStationByCode(match[2]);
  if (!from || !to) return null;
  const btsFrom = getStationByCode(from.code);
  const btsTo = getStationByCode(to.code);
  return {
    from, to, pair: `${from.code}-${to.code}`,
    result: btsFrom && btsTo ? calculateFare(btsFrom, btsTo) : null,
  };
}
