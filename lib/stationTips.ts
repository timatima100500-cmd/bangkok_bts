import { getAttractionsByStationId, type Attraction } from "@/data/attractions";
import type { MetroStation } from "@/data/transit";

export interface StationTip {
  station: MetroStation;
  attraction: Attraction;
}

/** Destination first, then origin; never invent points for stations with no data. */
export function getStationTips(from: MetroStation, to: MetroStation): StationTip[] {
  const seen = new Set<string>();
  return [to, from].flatMap((station) =>
    getAttractionsByStationId(station.code).flatMap((attraction) => {
      if (seen.has(attraction.id)) return [];
      seen.add(attraction.id);
      return [{ station, attraction }];
    }),
  ).slice(0, 2);
}
