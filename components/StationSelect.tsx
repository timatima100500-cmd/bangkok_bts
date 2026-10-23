"use client";

import { useMemo, useRef, useState } from "react";
import { LINE_COLORS, type BTSLine, type Station } from "@/data/stations";
import { useLang } from "@/components/LanguageProvider";
import { LINE_LABEL_KEYS } from "@/lib/i18n";
import { getStationGroups, SELECTOR_LINES } from "@/lib/stationOptions";

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
  const [line, setLine] = useState<BTSLine | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const primary = (s: Station) => (lang === "ru" ? s.nameRu : s.nameEn);
  const secondary = (s: Station) => (lang === "ru" ? s.nameEn : s.nameRu);

  const groups = useMemo(() => getStationGroups(query, line), [query, line]);

  const row = (s: Station) => (
    <>
      <span
        className="h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: s.color }}
        aria-hidden
      />
      <span className="w-8 shrink-0 font-mono text-xs font-semibold text-muted">
        {s.code}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-medium">{primary(s)}</span>
        <span className="mt-0.5 block break-words text-xs text-muted">
          {secondary(s)}
        </span>
      </span>
    </>
  );

  return (
    <div className="relative w-full">
      <label className="station-label">
        {label}
      </label>

      {open ? (
        <div
          className="station-menu flex flex-col"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
          }}
        >
          <div
            role="group"
            aria-label={t("filterByLine")}
            className="grid grid-cols-2 gap-2 border-b border-border p-2"
          >
            {[null, ...SELECTOR_LINES].map((option) => (
              <button
                key={option ?? "all"}
                type="button"
                aria-pressed={line === option}
                onClick={() => setLine(option)}
                className="line-filter flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-border px-2 py-2 text-left text-xs font-medium hover:bg-accent-soft"
              >
                {option && (
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: LINE_COLORS[option] }}
                    aria-hidden
                  />
                )}
                {option ? t(LINE_LABEL_KEYS[option]) : t("allLines")}
              </button>
            ))}
          </div>
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchStation")}
            aria-label={t("searchStation")}
            className="min-h-12 w-full bg-transparent px-3 py-3 text-base placeholder:text-muted"
          />
          <ul className="max-h-64 overflow-y-auto border-t border-border">
            {groups.length === 0 && (
              <li className="px-4 py-2.5 text-sm text-muted">
                {t("noResults")}
              </li>
            )}
            {groups.map((group) => (
              <li key={group.line}>
                <div
                  className="sticky top-0 z-10 border-b border-border bg-surface px-3 py-2 text-xs font-semibold"
                  style={{ borderLeft: `4px solid ${LINE_COLORS[group.line]}` }}
                >
                  {t(LINE_LABEL_KEYS[group.line])}
                </div>
                <ul>
                  {group.stations.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          onChange(s);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="flex min-h-14 w-full items-center gap-2 px-3 py-3 text-left hover:bg-accent-soft"
                      >
                        {row(s)}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setLine(null);
            setQuery("");
            setOpen(true);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
          className="station-field flex w-full items-center gap-2 px-3 py-3 text-left text-base"
        >
          {value ? (
            row(value)
          ) : (
            <span className="text-sm text-muted">{t("selectStation")}</span>
          )}
        </button>
      )}
    </div>
  );
}
