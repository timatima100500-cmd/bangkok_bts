import MarkdownPage, { markdownMetadata } from "@/components/pages/MarkdownPage";
import { getContentParams } from "@/lib/contentLoader";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getContentParams("en", "guides"); }
export async function generateMetadata({ params }: Props) { return markdownMetadata("en", "guides", (await params).slug); }
export default async function Page({ params }: Props) { return <MarkdownPage lang="en" collection="guides" slug={(await params).slug} />; }
