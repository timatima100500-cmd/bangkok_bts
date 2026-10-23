import GuidePage, { guideMetadata } from "@/components/pages/GuidePage";
import { GUIDES } from "@/data/guides";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return GUIDES.map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: Props) { return guideMetadata((await params).slug, "en"); }
export default async function Page({ params }: Props) { return <GuidePage slug={(await params).slug} lang="en" />; }
