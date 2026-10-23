import Link from "next/link";
import { METRO_LINES } from "@/data/transit";
import { METRO_STATIONS_BY_LINE } from "@/data/metroStations";
import { GUIDES, FEATURED_ROUTES } from "@/data/guides";
import { getRouteContent } from "@/lib/content";
import { siteCopy, sitePath, stationName } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

export type DirectorySection = "stations" | "routes" | "guides";

export default function DirectoryPage({ lang, section }: { lang: Lang; section: DirectorySection }) {
  const c = siteCopy[lang];
  return <div className="space-y-6 py-8">
    <h1 className="text-3xl font-semibold">{c[section]}</h1>
    {section === "stations" && METRO_LINES.map((line) => (
      <section key={line.id} className="panel space-y-3">
        <h2 className="border-l-4 pl-3 text-lg font-semibold" style={{ borderColor: line.color }}>{lang === "ru" ? line.nameRu : line.nameEn}</h2>
        <p className="text-sm text-muted">{line.dataStatus === "scaffold" ? c.scaffold : c.available}</p>
        {line.dataStatus === "scaffold" ? <a href={line.referenceUrl} className="inline-block py-2 text-sm text-accent underline">{c.operator} →</a> : (
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {METRO_STATIONS_BY_LINE[line.id].map((station) => <li key={station.id}><Link className="block py-2 text-sm text-accent underline" href={sitePath(lang, `/stations/${station.code}`)}>{station.code} · {stationName(station, lang)}</Link></li>)}
          </ul>
        )}
      </section>
    ))}
    {section === "routes" && <ul className="panel space-y-3">{FEATURED_ROUTES.map((pair) => {
      const route = getRouteContent(pair)!;
      return <li key={pair}><Link className="block py-2 text-accent underline" href={sitePath(lang, `/routes/${pair}`)}>{stationName(route.from, lang)} → {stationName(route.to, lang)}</Link></li>;
    })}</ul>}
    {section === "guides" && <ul className="panel space-y-3">{GUIDES.map((guide) => <li key={guide.slug}><Link className="block py-2 text-accent underline" href={sitePath(lang, `/guides/${guide.slug}`)}>{guide.title[lang]}</Link></li>)}</ul>}
  </div>;
}
