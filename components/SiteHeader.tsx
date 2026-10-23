"use client";

import { useLang } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import DesignToggle from "@/components/DesignToggle";

export default function SiteHeader() {
  const { t } = useLang();

  return (
    <header className="site-header">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Logo className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <p className="eyebrow">Bangkok</p>
            <p className="mt-0.5 text-sm font-semibold leading-snug tracking-tight">{t("appTitle")}</p>
          </div>
        </div>
        <LanguageToggle />
      </div>
      <div className="mt-5 flex items-center gap-2">
        <DesignToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
