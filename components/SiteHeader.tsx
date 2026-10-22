"use client";

import { useLang } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  const { t } = useLang();

  return (
    <header className="flex items-center justify-between px-5 py-4 sm:px-6">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background"
          aria-hidden
        >
          BTS
        </span>
        <span className="text-sm font-semibold tracking-tight">
          {t("appTitle")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
