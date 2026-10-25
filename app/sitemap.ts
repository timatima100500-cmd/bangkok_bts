import type { MetadataRoute } from "next";
import { publicUrl } from "@/lib/site";
import { getContentEntry, getIndexableContent } from "@/lib/contentLoader";
import { METRO_STATIONS } from "@/data/metroStations";
import { GUIDES } from "@/data/guides";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const stationPaths = [...new Set(METRO_STATIONS.map((station) => station.code))]
    .map((code) => `/stations/${code}/`);
  const staticPaths = ["/", "/stations/", "/fares/", "/guides/", "/about/", "/sources/"];
  const guideUrls = GUIDES.flatMap((guide) => (["en", "ru"] as const).flatMap((lang) =>
    getContentEntry(lang, "guides", guide.slug)?.noindex ? [] : [{ url: publicUrl(lang, `/guides/${guide.slug}/`) }],
  ));
  const entries = [
    ...[...staticPaths, ...stationPaths].flatMap((path) => [
      { url: publicUrl("en", path) },
      { url: publicUrl("ru", path) },
    ]),
    ...guideUrls,
    ...getIndexableContent().map((entry) => ({
      url: publicUrl(entry.lang, `/${entry.collection === "guides" ? "guides" : "airport"}/${entry.slug}/`),
    })),
  ];
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
