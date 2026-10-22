"use client";

import { useState } from "react";
import StationSelect from "@/components/StationSelect";
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
    <div className="mt-6 space-y-4">
      <div className="space-y-3 rounded-2xl border border-border p-4">
        <StationSelect label={t("from")} value={from} onChange={setFrom} />

        <button
          type="button"
          onClick={handleSwap}
          aria-label={t("swap")}
          title={t("swap")}
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-xl text-foreground/60 hover:text-foreground"
        >
          ⇅
        </button>
        <StationSelect label={t("to")} value={to} onChange={setTo} />
      </div>

      <button
        type="button"
        onClick={handleCalculate}
        className="min-h-12 w-full rounded-xl bg-foreground px-4 py-3 text-base font-semibold text-background transition-opacity hover:opacity-90 active:opacity-80"
      >
        {t("calculate")}
      </button>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500"
        >
          {error}
        </p>
      )}

      {result && (
        <section className="space-y-5 rounded-2xl border border-border p-4">
          {/* Route */}
          <div className="flex flex-col gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: result.from.color }}
                  aria-hidden
                />
                <span className="min-w-0 break-words text-sm font-medium">
                  {nameOf(result.from)}
                </span>
                <span className="shrink-0 font-mono text-xs text-foreground/40">
                  {result.from.code}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: result.to.color }}
                  aria-hidden
                />
                <span className="min-w-0 break-words text-sm font-medium">
                  {nameOf(result.to)}
                </span>
                <span className="shrink-0 font-mono text-xs text-foreground/40">
                  {result.to.code}
                </span>
              </div>
            </div>

            {/* Lines used */}
            <div className="flex flex-wrap gap-1.5">
              {result.lines.map((line) => (
                <span
                  key={line}
                  className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-foreground/70"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: LINE_COLORS[line] }}
                    aria-hidden
                  />
                  {lineName(line)}
                </span>
              ))}
            </div>
          </div>

          {/* Fare */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
              {t("fare")}
            </p>
            <p className="mt-1 text-5xl font-semibold tracking-tight tabular-nums">
              {result.fare}
              <span className="ml-2 text-lg font-normal text-foreground/60">
                THB
              </span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
            <div className="min-w-0 px-2 py-3 text-center">
              <p className="text-lg font-semibold tabular-nums">
                {result.minutes}
                <span className="ml-1 text-xs font-normal text-foreground/50">
                  {t("minutes")}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-foreground/50">
                {t("travelTime")}
              </p>
            </div>
            <div className="min-w-0 px-2 py-3 text-center">
              <p className="text-lg font-semibold tabular-nums">
                {result.stops}
              </p>
              <p className="mt-0.5 text-xs text-foreground/50">{t("stops")}</p>
            </div>
            <div className="min-w-0 px-2 py-3 text-center">
              <p className="text-lg font-semibold tabular-nums">
                {result.transfers}
              </p>
              <p className="mt-0.5 text-xs text-foreground/50">
                {result.transfers === 1 ? t("transfer") : t("transfers")}
              </p>
            </div>
          </div>

          {!result.exact && (
            <p className="text-xs text-foreground/40">{t("estimate")}</p>
          )}
        </section>
      )}
    </div>
  );
}
