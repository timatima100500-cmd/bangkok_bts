"use client";

import { useLang } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { siteCopy, sitePath } from "@/lib/site";

export default function SiteHeader() {
  const { lang } = useLang();
  const c = siteCopy[lang];

  return (
    <header className="site-header">
      <div className="flex items-center justify-between gap-3">
        <Link href={sitePath(lang)} className="flex min-w-0 items-center gap-3">
          <Logo className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <p className="eyebrow">Bangkok</p>
            <p className="mt-0.5 text-sm font-semibold leading-snug tracking-tight">{c.title}</p>
          </div>
        </Link>
        <LanguageToggle />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap gap-3 text-sm" aria-label={lang === "ru" ? "Навигация" : "Navigation"}>
          <Link className="py-2 text-accent" href={`${sitePath(lang)}#calculator`}>BTS</Link>
          <Link className="py-2 text-accent" href={sitePath(lang, "/stations")}>{c.stations}</Link>
          <Link className="py-2 text-accent" href={sitePath(lang, "/routes")}>{c.routes}</Link>
          <Link className="py-2 text-accent" href={sitePath(lang, "/guides")}>{c.guides}</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
