"use client";

import { useLang } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  const { t } = useLang();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
      <div className="flex w-full min-w-0 items-center gap-2.5">
        <Logo className="h-8 w-8 shrink-0" />
        <span className="text-sm font-semibold tracking-tight">
          {t("appTitle")}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
