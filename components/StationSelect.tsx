"use client";

import { useMemo, useRef, useState } from "react";
import { STATIONS, type Station } from "@/data/stations";

interface StationSelectProps {
  label: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
  placeholder?: string;
}

export default function StationSelect({
  label,
  value,
  onChange,
  placeholder = "Select station…",
}: StationSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STATIONS;
    return STATIONS.filter((s) =>
      [s.code, s.nameEn, s.nameTh, s.line].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [query]);

  return (
    <div className="relative w-full">
      <label className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
      </label>

      {open ? (
        <div className="flex flex-col rounded-xl border border-border bg-background">
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setOpen(false)}
            placeholder="Search by code or name…"
            className="w-full rounded-t-xl bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-foreground/40"
          />
          <ul className="max-h-64 overflow-y-auto border-t border-border">
            {filtered.length === 0 && (
              <li className="px-4 py-2.5 text-sm text-foreground/50">
                No stations found
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
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: s.color }}
                    aria-hidden
                  />
                  <span className="w-10 shrink-0 font-mono text-xs text-foreground/60">
                    {s.code}
                  </span>
                  <span className="truncate text-sm">{s.nameEn}</span>
                  <span className="ml-auto shrink-0 text-xs text-foreground/40">
                    {s.nameTh}
                  </span>
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
            inputRef.current?.focus();
          }}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-left text-sm hover:border-foreground/30"
        >
          {value ? (
            <>
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: value.color }}
                aria-hidden
              />
              <span className="w-10 shrink-0 font-mono text-xs text-foreground/60">
                {value.code}
              </span>
              <span className="truncate">{value.nameEn}</span>
              <span className="ml-auto shrink-0 text-xs text-foreground/40">
                {value.nameTh}
              </span>
            </>
          ) : (
            <span className="text-foreground/40">{placeholder}</span>
          )}
        </button>
      )}
    </div>
  );
}
