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
              ? "bg-foreground px-2.5 py-1.5 uppercase text-background"
              : "px-2.5 py-1.5 uppercase text-foreground/60 hover:bg-foreground/5"
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}
