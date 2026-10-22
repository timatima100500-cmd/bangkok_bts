"use client";

import { useState } from "react";
import StationSelect from "@/components/StationSelect";
import { calculateFare, FareError, type FareResult } from "@/lib/calculateFare";
import type { Station } from "@/data/stations";

export default function Home() {
  const [from, setFrom] = useState<Station | null>(null);
  const [to, setTo] = useState<Station | null>(null);
  const [result, setResult] = useState<FareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate() {
    setError(null);
    setResult(null);

    if (!from || !to) {
      setError("Select both origin and destination stations");
      return;
    }

    try {
      setResult(calculateFare(from.id, to.id));
    } catch (e) {
      setError(e instanceof FareError ? e.message : "Failed to calculate fare");
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <StationSelect label="From" value={from} onChange={setFrom} />
      <StationSelect label="To" value={to} onChange={setTo} />

      <button
        type="button"
        onClick={handleCalculate}
        className="w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
      >
        Calculate Fare
      </button>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-1 rounded-xl border border-border px-4 py-4">
          <p className="text-sm text-foreground/60">
            {result.from.nameEn} ({result.from.code}) → {result.to.nameEn} (
            {result.to.code})
          </p>
          <p className="text-3xl font-semibold">
            {result.fare} <span className="text-base font-normal">THB</span>
          </p>
          {!result.exact && (
            <p className="text-xs text-foreground/40">
              Stub price — fare matrix not loaded yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
