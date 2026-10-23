import MarkdownPage, { markdownMetadata } from "@/components/pages/MarkdownPage";
import { getContentParams } from "@/lib/contentLoader";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getContentParams("en", "airport"); }
export async function generateMetadata({ params }: Props) { return markdownMetadata("en", "airport", (await params).slug); }
export default async function Page({ params }: Props) { return <MarkdownPage lang="en" collection="airport" slug={(await params).slug} />; }
