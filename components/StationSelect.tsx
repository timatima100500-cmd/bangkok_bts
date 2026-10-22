"use client";

import { useMemo, useRef, useState } from "react";
import { STATIONS, type Station } from "@/data/stations";
import { useLang } from "@/components/LanguageProvider";

/** One entry per physical station (CEN appears on two lines). */
const UNIQUE_STATIONS = STATIONS.filter(
  (s, i, arr) => arr.findIndex((x) => x.code === s.code) === i,
);

interface StationSelectProps {
  label: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
}

export default function StationSelect({
  label,
  value,
  onChange,
}: StationSelectProps) {
  const { lang, t } = useLang();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const primary = (s: Station) => (lang === "th" ? s.nameTh : s.nameEn);
  const secondary = (s: Station) => (lang === "th" ? s.nameEn : s.nameTh);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return UNIQUE_STATIONS;
    return UNIQUE_STATIONS.filter((s) =>
      [s.code, s.nameEn, s.nameTh, s.line].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [query]);

  const row = (s: Station) => (
    <>
      <span
        className="h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: s.color }}
        aria-hidden
      />
      <span className="w-10 shrink-0 font-mono text-xs text-foreground/60">
        {s.code}
      </span>
      <span className="truncate text-sm">{primary(s)}</span>
      <span className="ml-auto shrink-0 truncate text-xs text-foreground/40">
        {secondary(s)}
      </span>
    </>
  );

  return (
    <div className="relative w-full">
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground/50">
        {label}
      </label>

      {open ? (
        <div className="flex flex-col rounded-xl border border-border bg-background shadow-lg">
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setOpen(false)}
            placeholder={t("searchStation")}
            className="w-full rounded-t-xl bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-foreground/40"
          />
          <ul className="max-h-64 overflow-y-auto border-t border-border">
            {filtered.length === 0 && (
              <li className="px-4 py-2.5 text-sm text-foreground/50">
                {t("noResults")}
              </li>
            )}
            {filtered.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-foreground/5"
                >
                  {row(s)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm hover:border-foreground/30"
        >
          {value ? (
            row(value)
          ) : (
            <span className="text-foreground/40">{t("selectStation")}</span>
          )}
        </button>
      )}
    </div>
  );
}
