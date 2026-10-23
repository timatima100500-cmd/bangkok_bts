import type { MetadataRoute } from "next";
import { publicUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Only the calculator home pages are ready for indexing. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: publicUrl("en") },
    { url: publicUrl("ru") },
  ];
}
