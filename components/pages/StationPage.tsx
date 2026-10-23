import Link from "next/link";
import { notFound } from "next/navigation";
import { getMetroStationByCode, METRO_STATIONS, METRO_STATIONS_BY_LINE } from "@/data/metroStations";
import { METRO_LINES } from "@/data/transit";
import { getAttractionsByStationId } from "@/data/attractions";
import { siteCopy, sitePath, stationName, pageMetadata } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

export function stationMetadata(code: string, lang: Lang) {
  const station = getMetroStationByCode(code);
  return station ? pageMetadata(lang, `/stations/${station.code}`, `${stationName(station, lang)} (${station.code})`, `${siteCopy[lang].station}: ${stationName(station, lang)}. ${siteCopy[lang].neighbours}.`, true) : {};
}

export default function StationPage({ code, lang }: { code: string; lang: Lang }) {
  const station = getMetroStationByCode(code);
  if (!station) notFound();
  const c = siteCopy[lang];
  const memberships = METRO_STATIONS.filter((candidate) => candidate.code === station.code);
  const attractions = getAttractionsByStationId(station.code);
  return <article className="space-y-6 py-8">
    <p className="eyebrow">{c.station} · {station.code}</p>
    <h1 className="text-3xl font-semibold">{stationName(station, lang)}</h1>
    <p className="text-sm text-muted">{c.draft}</p>
    {memberships.map((membership) => {
      const line = METRO_LINES.find((candidate) => candidate.id === membership.line)!;
      const stations = METRO_STATIONS_BY_LINE[line.id];
      const index = stations.findIndex((candidate) => candidate.code === station.code);
      const neighbours = [stations[index - 1], stations[index + 1]].filter(Boolean);
      return <section key={line.id} className="panel space-y-3">
        <h2 className="border-l-4 pl-3 text-lg font-semibold" style={{ borderColor: line.color }}>{lang === "ru" ? line.nameRu : line.nameEn}</h2>
        <p className="text-sm">{c.operator}: {membership.operator.toUpperCase()} · {membership.operatorType}</p>
        <h3 className="font-semibold">{c.neighbours}</h3>
        <ul>{neighbours.map((neighbour) => <li key={neighbour.code}><Link className="inline-block py-2 text-accent underline" href={sitePath(lang, `/stations/${neighbour.code}`)}>{neighbour.code} · {stationName(neighbour, lang)}</Link></li>)}</ul>
        <a className="inline-block py-2 text-sm text-accent underline" href={line.referenceUrl}>{c.operator} →</a>
      </section>;
    })}
    <section className="panel space-y-3">
      <h2 className="text-lg font-semibold">{c.coordinates}</h2>
      <p className="text-sm text-muted">{station.coordinateStatus === "verified" && station.lat != null && station.lng != null ? `${station.lat}, ${station.lng}` : station.coordinateStatus === "missing" ? c.missingCoordinates : c.unverifiedCoordinates}</p>
    </section>
    {attractions.length > 0 && <section className="panel space-y-3">
      <h2 className="text-lg font-semibold">{c.nearby}</h2>
      <ul className="space-y-2">{attractions.map((attraction) => <li key={attraction.id}>{attraction.name[lang]}</li>)}</ul>
    </section>}
  </article>;
}
