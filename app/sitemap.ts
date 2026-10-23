import type { MetadataRoute } from "next";
import { publicUrl } from "@/lib/site";
import { getIndexableContent } from "@/lib/contentLoader";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: publicUrl("en") },
    { url: publicUrl("ru") },
    ...getIndexableContent().map((entry) => ({
      url: publicUrl(entry.lang, `/${entry.collection === "guides" ? "get-to" : "airport"}/${entry.slug}`),
    })),
  ];
}
