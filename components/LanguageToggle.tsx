"use client";

import { useLang } from "@/components/LanguageProvider";
import type { Lang } from "@/lib/i18n";

const OPTIONS: Lang[] = ["en", "th"];

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      className="segmented-control flex shrink-0"
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className="segment min-w-11 uppercase"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
