import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { affiliates, type AffiliatePartner } from "@/lib/affiliates";

export type ContentLang = "en" | "ru";
export type ContentCollection = "guides" | "airport" | "stations" | "pages";
export type ContentSource = { url: string; title: string; accessed: string };
export type ContentFrontmatter = {
  title: string;
  description: string;
  slug: string;
  lang: ContentLang;
  verified: boolean;
  verified_on: string | null;
  sources: ContentSource[];
  affiliates: AffiliatePartner[];
  noindex: boolean;
};
export type ContentEntry = ContentFrontmatter & { html: string; filePath: string; collection: ContentCollection };

const languages: ContentLang[] = ["en", "ru"];
const collections: ContentCollection[] = ["guides", "airport", "stations", "pages"];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const slugPattern = /^_?[a-z0-9]+(?:-[a-z0-9]+)*$/;
const contentRoot = path.join(process.cwd(), "content");

function normalizeDate(value: unknown): string | null {
  const date = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  return typeof date === "string" && datePattern.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date ? date : null;
}

function validUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function parseContent(raw: string, filePath: string, lang: ContentLang, collection: ContentCollection): ContentEntry {
  try {
    const { data, content } = matter(raw);
    const invalid = (field: string) => { throw new Error(`invalid frontmatter field "${field}"`); };
    if (typeof data.title !== "string" || !data.title.trim()) invalid("title");
    if (typeof data.description !== "string" || !data.description.trim() || data.description.length > 155) invalid("description");
    if (typeof data.slug !== "string" || !slugPattern.test(data.slug) || data.slug !== path.basename(filePath, ".md")) invalid("slug");
    if (data.lang !== lang) invalid("lang");
    if (typeof data.verified !== "boolean") invalid("verified");
    const verifiedOn = data.verified_on === null ? null : normalizeDate(data.verified_on);
    if (data.verified_on !== null && !verifiedOn) invalid("verified_on");
    if (data.verified && !verifiedOn) invalid("verified_on");
    if (!Array.isArray(data.sources) || !data.sources.every((source: unknown) => {
      if (typeof source !== "object" || source === null || Array.isArray(source)) return false;
      const item = source as Record<string, unknown>;
      return validUrl(item.url) && typeof item.title === "string" && !!item.title.trim() && !!normalizeDate(item.accessed);
    })) invalid("sources");
    if (!Array.isArray(data.affiliates) || !data.affiliates.every((partner: unknown) => typeof partner === "string" && Object.hasOwn(affiliates, partner))) invalid("affiliates");
    if (typeof data.noindex !== "boolean") invalid("noindex");
    const html = marked.parse(content, {
      async: false,
      walkTokens(token) { if (token.type === "html") throw new Error("raw HTML is not allowed in markdown"); },
    }) as string;
    return {
      ...data,
      verified_on: verifiedOn,
      sources: data.sources.map((source: ContentSource) => ({ ...source, accessed: normalizeDate(source.accessed)! })),
      noindex: !data.verified || data.noindex,
      html, filePath, collection,
    } as ContentEntry;
  } catch (error) {
    throw new Error(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function getContentEntries(lang: ContentLang, collection: ContentCollection): ContentEntry[] {
  const directory = path.join(contentRoot, lang, collection);
  let files: string[];
  try { files = readdirSync(directory).filter((file) => file.endsWith(".md")); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return files.map((file) => {
    const filePath = path.join(directory, file);
    return parseContent(readFileSync(filePath, "utf8"), filePath, lang, collection);
  });
}

export function getAllContent(): ContentEntry[] {
  return languages.flatMap((lang) => collections.flatMap((collection) => getContentEntries(lang, collection)));
}

export function getContentEntry(lang: ContentLang, collection: ContentCollection, slug: string): ContentEntry | undefined {
  return getContentEntries(lang, collection).find((entry) => entry.slug === slug);
}

export function getContentParams(lang: ContentLang, collection: ContentCollection): { slug: string }[] {
  return getContentEntries(lang, collection).map(({ slug }) => ({ slug }));
}

export function getIndexableContent(): ContentEntry[] {
  return getAllContent().filter((entry) => !entry.noindex && !entry.slug.startsWith("_") && (entry.collection === "airport" || entry.collection === "guides"));
}
