import { getAllFareSources, getAllFareTables } from "@/lib/fareTables";
import type { Lang } from "@/lib/i18n";

const copy = {
  en: {
    heading: "Fare sources", intro: "Sources attached to the versioned fare tables. Some are archive references or model inputs, not current operator confirmations.",
    table: "Fare table", urlMissing: "Public URL not recorded",
    official: "Official", archive: "Archive", model: "Model",
  },
  ru: {
    heading: "Источники тарифов", intro: "Источники из версий тарифных таблиц. Некоторые относятся к архиву или расчётной модели и не подтверждают актуальный тариф оператора.",
    table: "Тарифная таблица", urlMissing: "Публичный URL не указан",
    official: "Официальный", archive: "Архив", model: "Модель",
  },
} as const;

export default function SourcesPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const tables = getAllFareTables();
  const sources = getAllFareSources();

  return <article className="space-y-6 py-8">
    <h1 className="text-3xl font-semibold">{c.heading}</h1>
    <p className="text-sm text-muted">{c.intro}</p>
    <p className="text-sm text-muted">{c.table}: {tables.map((table) => table.effectiveFrom).join(", ")}</p>
    <ul className="space-y-3">{sources.map((source) => <li key={`${source.id}|${source.url ?? ""}|${source.document ?? ""}`} className="panel space-y-2">
      <h2 className="font-semibold">{source.title}</h2>
      <p className="text-sm text-muted">{c[source.kind]}</p>
      {source.url ? <a className="break-all text-sm text-accent underline" href={source.url}>{source.url}</a> : <p className="text-sm text-muted">{c.urlMissing}</p>}
    </li>)}</ul>
  </article>;
}
