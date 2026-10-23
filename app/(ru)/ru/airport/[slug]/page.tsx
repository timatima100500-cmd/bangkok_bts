import MarkdownPage, { markdownMetadata } from "@/components/pages/MarkdownPage";
import { getContentParams } from "@/lib/contentLoader";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getContentParams("ru", "airport"); }
export async function generateMetadata({ params }: Props) { return markdownMetadata("ru", "airport", (await params).slug); }
export default async function Page({ params }: Props) { return <MarkdownPage lang="ru" collection="airport" slug={(await params).slug} />; }
