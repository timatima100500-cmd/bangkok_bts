"use client";

import { useLang } from "@/components/LanguageProvider";
import { usePathname } from "next/navigation";

const OPTIONS = ["en", "ru"] as const;

export default function LanguageToggle() {
  const { lang } = useLang();
  const pathname = usePathname();
  const basePath = pathname.replace(/^\/ru(?=\/|$)/, "") || "/";

  return (
    <div
      className="segmented-control flex shrink-0"
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((option) => (
        <a
          key={option}
          href={option === "ru" ? `/ru${basePath === "/" ? "" : basePath}` : basePath}
          hrefLang={option}
          aria-current={lang === option ? "page" : undefined}
          className="segment flex min-w-11 items-center justify-center uppercase"
        >
          {option}
        </a>
      ))}
    </div>
  );
}
