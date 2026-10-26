import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES } from "@/data/guides";
import { getMetroStationByCode } from "@/data/metroStations";
import { siteCopy, sitePath, stationName, pageMetadata } from "@/lib/site";
import type { Lang } from "@/lib/i18n";
import { getContentEntry } from "@/lib/contentLoader";
import MarkdownPage, { markdownMetadata } from "@/components/pages/MarkdownPage";

export function guideMetadata(slug: string, lang: Lang) {
  if (getContentEntry(lang, "guides", slug)) return markdownMetadata(lang, "guides", slug);
  const guide = GUIDES.find((candidate) => candidate.slug === slug);
  return guide ? pageMetadata(lang, `/guides/${slug}`, guide.title[lang], guide.text[lang], false) : {};
}

export default function GuidePage({ slug, lang }: { slug: string; lang: Lang }) {
  if (getContentEntry(lang, "guides", slug)) return <MarkdownPage lang={lang} collection="guides" slug={slug} />;
  const guide = GUIDES.find((candidate) => candidate.slug === slug);
  if (!guide) notFound();
  const station = getMetroStationByCode(guide.stationCode)!;
  const c = siteCopy[lang];
  return <article className="space-y-6 py-8">
    <p className="eyebrow">{c.guides}</p>
    <h1 className="text-3xl font-semibold leading-snug">{guide.title[lang]}</h1>
    <p className="leading-relaxed">{guide.text[lang]}</p>
    <p className="rounded-xl border border-border p-4 text-sm text-muted">{c.guideDraft}</p>
    <Link className="block py-2 text-accent underline" href={sitePath(lang, `/stations/${station.code}`)}>{c.station}: {stationName(station, lang)} ({station.code}) →</Link>
    <Link className="block py-2 text-accent underline" href={`${sitePath(lang)}#calculator`}>{c.calculator} →</Link>
  </article>;
}
