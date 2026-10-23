"use client";

import { useState } from "react";
import StationSelect from "@/components/StationSelect";
import StationTips from "@/components/StationTips";
import { useLang } from "@/components/LanguageProvider";
import {
  calculateFare,
  FareError,
  type FareResult,
} from "@/lib/calculateFare";
import type { TKey } from "@/lib/i18n";
import { playSuccessChime } from "@/lib/sound";
import { LINE_COLORS, type BTSLine, type Station } from "@/data/stations";
import { LINE_LABEL_KEYS } from "@/lib/i18n";

export default function Home() {
  const { lang, t } = useLang();
  const [from, setFrom] = useState<Station | null>(null);
  const [to, setTo] = useState<Station | null>(null);
  const [result, setResult] = useState<FareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nameOf = (s: Station) => (lang === "th" ? s.nameTh : s.nameEn);
  const lineName = (line: BTSLine) => t(LINE_LABEL_KEYS[line]);

  function runCalculation(
    nextFrom: Station | null,
    nextTo: Station | null,
  ): FareResult | null {
    if (!nextFrom || !nextTo) return null;
    setError(null);
    try {
      return calculateFare(nextFrom, nextTo);
    } catch (e) {
      if (e instanceof FareError) {
        const key: TKey =
          e.code === "sameStation" ? "errorSame" : "errorNoRoute";
        setError(t(key));
        return null;
      }
      throw e;
    }
  }

  function handleCalculate() {
    setError(null);
    setResult(null);

    if (!from || !to) {
      setError(t("errorSelectBoth"));
      return;
    }
    const next = runCalculation(from, to);
    setResult(next);
    if (next) playSuccessChime();
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
    setError(null);
    if (from && to) setResult(runCalculation(to, from));
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="pt-7 pb-1">
        <p className="eyebrow mb-2">BTS Skytrain</p>
        <h1 className="text-[30px] font-semibold leading-tight tracking-tight">{t("whereTo")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("journeyIntro")}</p>
      </div>

      <section className="panel space-y-4" aria-label={t("journey")}>
        <h2 className="text-sm font-semibold">{t("journey")}</h2>
        <StationSelect label={t("from")} value={from} onChange={(station) => {
          setFrom(station); setResult(null); setError(null);
        }} />
        <div className="swap-divider">
          <button
            type="button"
            onClick={handleSwap}
            aria-label={t("swap")}
            title={t("swap")}
            className="control-button h-11 w-11 text-xl"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M8 4v16m-4-4 4 4 4-4M16 20V4m-4 4 4-4 4 4" />
            </svg>
          </button>
        </div>
        <StationSelect label={t("to")} value={to} onChange={(station) => {
          setTo(station); setResult(null); setError(null);
        }} />
        <button type="button" onClick={handleCalculate} className="primary-button">
          {t("calculate")}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 12h16m-6-6 6 6-6 6" />
          </svg>
        </button>
      </section>

      {error && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        {result && (
          <section className="panel fare-card space-y-5" aria-label={t("fare")}>
            <div className="fare-heading">
              <p className="text-sm font-semibold text-muted">{t("fare")}</p>
              <p className="fare-amount mt-2">
                {result.fare}
                <span className="ml-3 text-lg font-medium tracking-normal text-muted">THB</span>
              </p>
            </div>

            <div className="space-y-3">
              {[result.from, result.to].map((station, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="route-code shrink-0" style={{ borderBottom: `3px solid ${station.color}` }}>{station.code}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted">{index === 0 ? t("from") : t("to")}</p>
                    <p className="break-words text-sm font-semibold">{nameOf(station)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {result.lines.map((line) => (
                <span key={line} className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs text-muted">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: LINE_COLORS[line] }} aria-hidden />
                  {lineName(line)}
                </span>
              ))}
            </div>

            <div className="fare-stats grid grid-cols-3 divide-x divide-border py-3">
              <div className="min-w-0 px-2 text-center">
                <p className="text-xl font-semibold tabular-nums">
                  {result.minutes}<span className="ml-1 text-xs font-normal text-muted">{t("minutes")}</span>
                </p>
                <p className="mt-1 text-xs text-muted">{t("travelTime")}</p>
              </div>
              <div className="min-w-0 px-2 text-center">
                <p className="text-xl font-semibold tabular-nums">{result.stops}</p>
                <p className="mt-1 text-xs text-muted">{t("stops")}</p>
              </div>
              <div className="min-w-0 px-2 text-center">
                <p className="text-xl font-semibold tabular-nums">{result.transfers}</p>
                <p className="mt-1 text-xs text-muted">{result.transfers === 1 ? t("transfer") : t("transfers")}</p>
              </div>
            </div>
            {!result.exact && <p className="text-xs leading-relaxed text-muted">{t("estimate")}</p>}
          </section>
        )}
      </div>

      {result ? <StationTips from={result.from} to={result.to} /> : (
        <div className="network-note">
          <div className="mb-4 flex justify-center gap-1.5" aria-hidden>
            {Object.values(LINE_COLORS).map((color) => <span key={color} className="h-1.5 w-10 rounded-full" style={{ backgroundColor: color }} />)}
          </div>
          <p className="text-sm font-semibold">{t("network")}</p>
          <p className="mx-auto mt-2 max-w-64 text-xs leading-relaxed text-muted">{t("networkHint")}</p>
        </div>
      )}
    </div>
  );
}
