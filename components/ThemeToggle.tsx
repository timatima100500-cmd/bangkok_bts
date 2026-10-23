"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLang } from "@/components/LanguageProvider";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="control-button h-[52px] w-24" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t(isDark ? "switchToLight" : "switchToDark")}
      className="control-button h-[52px] w-24 shrink-0 px-3 text-xs font-semibold"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {isDark ? <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" /> : <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </>}
      </svg>
      {t(isDark ? "dark" : "light")}
    </button>
  );
}
