import { STATIONS, type BTSLine } from "@/data/stations";

export const SELECTOR_LINES: BTSLine[] = ["sukhumvit", "silom", "gold"];

/** Keep one selectable entry for Siam, which is shared by two lines. */
const UNIQUE_STATIONS = STATIONS.filter(
  (station, index, stations) =>
    stations.findIndex((candidate) => candidate.code === station.code) === index,
);

export function getStationGroups(query: string, line: BTSLine | null = null) {
  const search = query.trim().toLowerCase();

  return SELECTOR_LINES.filter((candidate) => !line || candidate === line)
    .map((candidate) => ({
      line: candidate,
      stations: UNIQUE_STATIONS.filter(
        (station) =>
          station.line === candidate &&
          [
            station.code, station.nameEn, station.nameTh,
            station.nameZh, station.nameRu, station.line,
          ].some((name) => name.toLowerCase().includes(search)),
      ),
    }))
    .filter((group) => group.stations.length > 0);
}
