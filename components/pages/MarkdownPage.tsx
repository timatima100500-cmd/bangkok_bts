import { notFound } from "next/navigation";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import SourcesList from "@/components/SourcesList";
import VerifiedBadge from "@/components/VerifiedBadge";
import { getContentEntry, type ContentCollection, type ContentLang } from "@/lib/contentLoader";
import { pageMetadata } from "@/lib/site";

function pagePath(collection: ContentCollection, slug: string) {
  return `/${collection === "guides" ? "get-to" : collection}/${slug}`;
}

export function markdownMetadata(lang: ContentLang, collection: "airport" | "guides", slug: string) {
  const entry = getContentEntry(lang, collection, slug);
  if (!entry) return {};
  const path = pagePath(collection, slug);
  const metadata = pageMetadata(lang, path, entry.title, entry.description, entry.noindex);
  const otherLang = lang === "en" ? "ru" : "en";
  if (!getContentEntry(otherLang, collection, slug)) {
    metadata.alternates = { canonical: metadata.alternates?.canonical };
  }
  return metadata;
}

export default function MarkdownPage({ lang, collection, slug }: { lang: ContentLang; collection: "airport" | "guides"; slug: string }) {
  const entry = getContentEntry(lang, collection, slug);
  if (!entry) notFound();
  return <article className="space-y-6 py-8">
    <h1 className="text-3xl font-semibold leading-snug">{entry.title}</h1>
    <VerifiedBadge date={entry.verified ? entry.verified_on : null} lang={lang} />
    <div className="markdown-body break-words" dangerouslySetInnerHTML={{ __html: entry.html }} />
    <SourcesList sources={entry.sources} lang={lang} />
    <AffiliateDisclosure affiliates={entry.affiliates} lang={lang} />
  </article>;
}
