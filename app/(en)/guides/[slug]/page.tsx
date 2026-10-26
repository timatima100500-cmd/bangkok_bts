import GuidePage, { guideMetadata } from "@/components/pages/GuidePage";
import { GUIDES } from "@/data/guides";
import { getContentParams } from "@/lib/contentLoader";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return [...new Set([...GUIDES.map((guide) => guide.slug), ...getContentParams("en", "guides").map((entry) => entry.slug)])].map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props) { return guideMetadata((await params).slug, "en"); }
export default async function Page({ params }: Props) { return <GuidePage slug={(await params).slug} lang="en" />; }
