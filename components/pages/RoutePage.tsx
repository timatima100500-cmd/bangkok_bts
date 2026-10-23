import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import FareDetails from "@/components/FareDetails";
import { getRouteContent } from "@/lib/content";
import { siteCopy, sitePath, stationName, pageMetadata } from "@/lib/site";
import { translations, type Lang } from "@/lib/i18n";

export function routeMetadata(pair: string, lang: Lang) {
  const route = getRouteContent(pair);
  if (!route) return {};
  const title = `${stationName(route.from, lang)} → ${stationName(route.to, lang)}`;
  return pageMetadata(lang, `/routes/${route.pair}`, title, `${title}. ${siteCopy[lang].estimated}, ${siteCopy[lang].itinerary}.`, true);
}

export default function RoutePage({ pair, lang }: { pair: string; lang: Lang }) {
  const route = getRouteContent(pair);
  if (!route) notFound();
  if (pair !== route.pair) permanentRedirect(sitePath(lang, `/routes/${route.pair}`));
  const c = siteCopy[lang];
  const result = route.result;
  return <article className="space-y-6 py-8">
    <p className="eyebrow">{c.route}</p>
    <h1 className="text-3xl font-semibold leading-snug">{stationName(route.from, lang)} → {stationName(route.to, lang)}</h1>
    <p className="text-sm text-muted">{c.draft}</p>
    {result ? <>
      <section className="panel space-y-4">
        <p className="fare-amount">{result.fare}<span className="ml-3 text-lg tracking-normal">THB</span></p>
        <p className="text-sm text-muted">~{result.minutes} {translations[lang].minutes} · {result.stops} {translations[lang].stops} · {result.transfers} {translations[lang].transfers}</p>
        <FareDetails pricing={result.pricing} lang={lang} />
      </section>
      <section className="panel space-y-3">
        <h2 className="text-lg font-semibold">{c.itinerary}</h2>
        <ol className="space-y-2">{result.path.map((station) => <li key={`${station.line}:${station.code}`} className="border-l-4 pl-3" style={{ borderColor: station.color }}><Link className="inline-block py-2 text-accent underline" href={sitePath(lang, `/stations/${station.code}`)}>{station.code} · {stationName(station, lang)}</Link></li>)}</ol>
      </section>
    </> : <p className="panel">{c.unavailable}</p>}
    <Link className="inline-block py-2 text-accent underline" href={`${sitePath(lang)}#calculator`}>{c.calculator} →</Link>
  </article>;
}
