import { STATIONS } from "@/data/stations";
import { METRO_LINES, type MetroLineId, type MetroStation } from "@/data/transit";

/** Fill each scaffold with sourced stations before adding it to a route graph. */
export const ADDITIONAL_STATIONS: Record<Exclude<MetroLineId, "sukhumvit" | "silom" | "gold">, MetroStation[]> = {
  "mrt-blue": [],
  "airport-rail-link": [],
  "red-dark": [],
};

export const METRO_STATIONS: MetroStation[] = [...STATIONS, ...Object.values(ADDITIONAL_STATIONS).flat()];
export const METRO_STATIONS_BY_LINE = Object.fromEntries(
  METRO_LINES.map((line) => [line.id, METRO_STATIONS.filter((station) => station.line === line.id)]),
) as Record<MetroLineId, MetroStation[]>;

export function getMetroStationByCode(code: string) {
  return METRO_STATIONS.find((station) => station.code === code.toUpperCase());
}
