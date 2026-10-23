import Link from "next/link";
import FareCalculator from "@/components/FareCalculator";
import type { Lang } from "@/lib/i18n";
import { siteCopy, sitePath } from "@/lib/site";

export default function HomePage({ lang }: { lang: Lang }) {
  const c = siteCopy[lang];
  return <div className="space-y-6 py-8">
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>
      <p className="leading-relaxed text-muted">{c.intro}</p>
    </header>
    <nav className="flex flex-wrap gap-3">
      {["stations", "routes", "guides"].map((section) => <Link key={section} className="control-button px-4 text-sm" href={sitePath(lang, `/${section}`)}>{c[section as "stations" | "routes" | "guides"]}</Link>)}
    </nav>
    <FareCalculator />
  </div>;
}
