import MarkdownPage, { markdownMetadata } from "@/components/pages/MarkdownPage";
import { getContentParams } from "@/lib/contentLoader";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getContentParams("ru", "guides"); }
export async function generateMetadata({ params }: Props) { return markdownMetadata("ru", "guides", (await params).slug); }
export default async function Page({ params }: Props) { return <MarkdownPage lang="ru" collection="guides" slug={(await params).slug} />; }
