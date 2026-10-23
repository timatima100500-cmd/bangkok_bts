import type { ContentLang } from "@/lib/contentLoader";

export default function VerifiedBadge({ date, lang }: { date: string | null; lang: ContentLang }) {
  if (!date) return <p className="text-sm text-muted">{lang === "ru" ? "Черновик: факты ещё не проверены" : "Draft: facts have not yet been verified"}</p>;
  return <p className="text-sm text-muted">{lang === "ru" ? "Проверено" : "Verified"}: <time dateTime={date}>{date}</time></p>;
}
