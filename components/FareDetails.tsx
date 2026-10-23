import type { Lang } from "@/lib/i18n";
import type { JourneyFare } from "@/lib/fareModel";
import { siteCopy } from "@/lib/site";

export default function FareDetails({ pricing, lang }: { pricing: JourneyFare; lang: Lang }) {
  const c = siteCopy[lang];
  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">{pricing.approximate ? c.estimated : c.verified}: {pricing.amount === null ? c.unavailable : `${pricing.amount} THB`}</p>
      {pricing.legs.length > 1 && <p className="text-xs leading-relaxed text-muted">{c.separateTickets}</p>}
      <details className="rounded-xl border border-border p-3">
        <summary className="cursor-pointer font-medium">{c.sources}</summary>
        <ul className="mt-3 space-y-4 text-xs leading-relaxed text-muted">
          {pricing.legs.map((leg, index) => (
            <li key={index}>
              <p className="font-semibold text-foreground">{leg.fromCode} → {leg.toCode} · {leg.fareSystem}: {leg.amount === null ? c.unavailable : `${leg.amount} THB`}</p>
              {leg.values.map((value, valueIndex) => (
                <div key={valueIndex} className="mt-2 space-y-1">
                  <p>{value.amount} THB · {value.accuracy === "historical" ? c.historical : value.accuracy === "verified" ? c.verified : c.approximate}</p>
                  <p>{value.source.url ? <a href={value.source.url} className="underline">{value.source.title}</a> : value.source.title}</p>
                  <p>{c.recorded}: <time dateTime={value.recordedAt}>{value.recordedAt}</time> · {c.effective}: {value.effectiveFrom ?? c.unconfirmed} · {c.verified}: {value.verifiedAt ?? c.unconfirmed}</p>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </details>
      {pricing.approximate && <p className="text-xs leading-relaxed text-muted">{c.fareCaution}</p>}
    </div>
  );
}
