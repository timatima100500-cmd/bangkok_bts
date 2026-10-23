"use client";

import { useLang } from "@/components/LanguageProvider";
import type { Station } from "@/data/stations";
import { getStationTips } from "@/lib/stationTips";

export default function StationTips({ from, to }: { from: Station; to: Station }) {
  const { lang, t } = useLang();
  const tips = getStationTips(from, to);

  return (
    <section className="panel station-tips" aria-label={t("aroundStation")}>
      <div className="mb-4 flex items-center gap-3">
        <span className="tip-icon" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
        <div>
          <h2 className="text-base font-semibold">{t("aroundStation")}</h2>
          <p className="mt-0.5 text-xs text-muted">{t("localHighlights")}</p>
        </div>
      </div>
      {tips.length ? (
        <ul className="space-y-3">
          {tips.map(({ station, attraction }) => (
            <li key={attraction.id} className="tip-item">
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-muted">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: station.color }} aria-hidden />
                {station.code} · {lang === "ru" ? station.nameRu : station.nameEn}
              </p>
              <p className="text-sm leading-relaxed">
                {t("stationTip")
                  .replace("{place}", attraction.name[lang])
                  .replace("{station}", lang === "ru" ? station.nameRu : station.nameEn)}
              </p>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm leading-relaxed text-muted">{t("noStationTips")}</p>}
    </section>
  );
}
