import { createElement } from "react";
import type { ContentLang } from "@/lib/contentLoader";
import type { AffiliatePartner } from "@/lib/affiliates";

export default function AffiliateDisclosure({ lang, affiliates }: { lang: ContentLang; affiliates: AffiliatePartner[] }) {
  if (affiliates.length === 0) return null;
  return createElement("p", { className: "rounded-xl border border-border p-4 text-sm text-muted" },
    lang === "ru"
      ? "На этой странице есть партнёрские ссылки. Если вы перейдёте по ним и совершите покупку, мы можем получить комиссию."
      : "This page contains affiliate links. If you follow them and make a purchase, we may earn a commission.");
}
