import { METRO_STATIONS } from "@/data/metroStations";
import { METRO_LINES, type MetroLineId } from "@/data/transit";

export const SELECTOR_LINES: MetroLineId[] = METRO_LINES.map((line) => line.id);

/** Keep one selectable entry for Siam, which is shared by two lines. */
const UNIQUE_STATIONS = METRO_STATIONS.filter(
  (station, index, stations) =>
    stations.findIndex((candidate) => candidate.code === station.code) === index,
);

export function getStationGroups(query: string, line: MetroLineId | null = null) {
  const search = query.trim().toLowerCase();

  return SELECTOR_LINES.filter((candidate) => !line || candidate === line)
    .map((candidate) => ({
      line: candidate,
      stations: UNIQUE_STATIONS.filter(
        (station) =>
          station.line === candidate &&
          [
            station.code, station.nameEn, station.nameTh,
            station.nameRu, station.nameZh, station.line,
          ].some((name) => name?.toLowerCase().includes(search)),
      ),
    }))
    .filter((group) => group.stations.length > 0);
}
