"use client";

import { useLang } from "@/components/LanguageProvider";
import type { Lang } from "@/lib/i18n";

const OPTIONS: Lang[] = ["en", "th"];

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      className="flex overflow-hidden rounded-lg border border-border text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={
            lang === option
              ? "min-h-11 min-w-11 bg-foreground px-3 py-2 uppercase text-background"
              : "min-h-11 min-w-11 px-3 py-2 uppercase text-foreground/60 hover:bg-foreground/5"
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}
