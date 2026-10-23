import StationPage, { stationMetadata } from "@/components/pages/StationPage";
import { METRO_STATIONS } from "@/data/metroStations";
type Props = { params: Promise<{ code: string }> };
export function generateStaticParams() { return [...new Set(METRO_STATIONS.map((station) => station.code))].map((code) => ({ code })); }
export async function generateMetadata({ params }: Props) { return stationMetadata((await params).code, "ru"); }
export default async function Page({ params }: Props) { return <StationPage code={(await params).code} lang="ru" />; }
