import type { ContentSource, ContentLang } from "@/lib/contentLoader";

export default function SourcesList({ sources, lang }: { sources: ContentSource[]; lang: ContentLang }) {
  if (sources.length === 0) return null;
  return <section className="space-y-2" aria-label={lang === "ru" ? "Источники" : "Sources"}>
    <h2 className="text-xl font-semibold">{lang === "ru" ? "Источники" : "Sources"}</h2>
    <ul className="space-y-2">{sources.map((source) => <li key={`${source.url}-${source.accessed}`}>
      <a className="break-words text-accent underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
      <span className="ml-2 text-sm text-muted">{lang === "ru" ? "Проверено" : "Accessed"}: {source.accessed}</span>
    </li>)}</ul>
  </section>;
}
