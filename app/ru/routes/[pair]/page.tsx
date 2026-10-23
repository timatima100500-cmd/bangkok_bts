import RoutePage, { routeMetadata } from "@/components/pages/RoutePage";
import { FEATURED_ROUTES } from "@/data/guides";
type Props = { params: Promise<{ pair: string }> };
export function generateStaticParams() { return FEATURED_ROUTES.map((pair) => ({ pair })); }
export async function generateMetadata({ params }: Props) { return routeMetadata((await params).pair, "ru"); }
export default async function Page({ params }: Props) { return <RoutePage pair={(await params).pair} lang="ru" />; }
