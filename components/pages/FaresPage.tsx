import Link from "next/link";
import type { FareValue } from "@/lib/fareModel";
import { getFareTable } from "@/lib/fareTables";
import { siteCopy, sitePath } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

const copy = {
  en: {
    heading: "BTS fare tables", core: "Green Line core", extension: "Green Line extension model",
    gold: "Gold Line", count: "Stations travelled", amount: "Fare", status: "Status",
    cap: "Combined Green Line cap", recorded: "Recorded in this dataset",
    effective: "Model effective from", sources: "See fare sources",
    historical: "Historical reference", approximate: "Approximate model", verified: "Verified",
    goldNote: "Flat fare estimate for a Gold Line journey.",
  },
  ru: {
    heading: "Таблицы тарифов BTS", core: "Основной участок зелёных линий", extension: "Модель расширений зелёных линий",
    gold: "Золотая линия", count: "Число станций", amount: "Стоимость", status: "Статус",
    cap: "Лимит для зелёных линий", recorded: "Добавлено в набор данных",
    effective: "Модель действует с", sources: "Источники тарифов",
    historical: "Архивное значение", approximate: "Приблизительная модель", verified: "Проверено",
    goldNote: "Оценка фиксированной стоимости поездки по Золотой линии.",
  },
} as const;

function FareRows({ fares, maximum, lang }: { fares: Readonly<Record<number, FareValue>>; maximum: FareValue; lang: Lang }) {
  const c = copy[lang];
  const entries = Object.entries(fares).map(([count, value]) => [Number(count), value] as const).sort((a, b) => a[0] - b[0]);
  const rows: Array<{ count: string; value: FareValue }> = [
    ...entries.map(([count, value]) => ({ count: String(count), value })),
    { count: `${entries.at(-1)![0] + 1}+`, value: maximum },
  ];

  return <table className="w-full text-left text-sm">
    <thead><tr className="border-b border-border"><th scope="col" className="py-2 pr-2">{c.count}</th><th scope="col" className="py-2 pr-2">{c.amount}</th><th scope="col" className="py-2">{c.status}</th></tr></thead>
    <tbody>{rows.map(({ count, value }) => <tr key={count} className="border-b border-border last:border-0">
      <th scope="row" className="py-2 pr-2 font-medium tabular-nums">{count}</th>
      <td className="py-2 pr-2 tabular-nums">{value.amount} {value.currency}</td>
      <td className="py-2 text-muted">{c[value.accuracy]}</td>
    </tr>)}</tbody>
  </table>;
}

export default function FaresPage({ lang }: { lang: Lang }) {
  const table = getFareTable("bts", new Date());
  const c = copy[lang];

  return <article className="space-y-6 py-8">
    <h1 className="text-3xl font-semibold">{c.heading}</h1>
    <p className="text-sm text-muted">{siteCopy[lang].fareCaution}</p>
    <p className="text-sm text-muted">{c.effective}: <time dateTime={table.effectiveFrom}>{table.effectiveFrom}</time> · {c.recorded}: <time dateTime={table.FARE_NOTES.recordedAt}>{table.FARE_NOTES.recordedAt}</time></p>
    <section className="panel space-y-3">
      <h2 className="text-xl font-semibold">{c.core}</h2>
      <FareRows fares={table.CORE_FARE_BY_STATIONS} maximum={table.CORE_FARE_MAX} lang={lang} />
    </section>
    <section className="panel space-y-3">
      <h2 className="text-xl font-semibold">{c.extension}</h2>
      <FareRows fares={table.EXT_FARE_BY_STATIONS} maximum={table.EXT_FARE_MAX} lang={lang} />
      <p className="text-sm text-muted">{c.cap}: {table.COMBINED_FARE_MAX.amount} {table.COMBINED_FARE_MAX.currency} ({c[table.COMBINED_FARE_MAX.accuracy]})</p>
    </section>
    <section className="panel space-y-2">
      <h2 className="text-xl font-semibold">{c.gold}</h2>
      <p className="text-2xl font-semibold tabular-nums">{table.GOLD_LINE_FARE.amount} {table.GOLD_LINE_FARE.currency}</p>
      <p className="text-sm text-muted">{c.goldNote} {c[table.GOLD_LINE_FARE.accuracy]}.</p>
    </section>
    <Link className="inline-block py-2 text-accent underline" href={sitePath(lang, "/sources")}>{c.sources} →</Link>
  </article>;
}
