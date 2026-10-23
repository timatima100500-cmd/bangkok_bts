import FaresPage from "@/components/pages/FaresPage";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("en", "/fares", "BTS fare tables", "Historical BTS fares and approximate extension model with sources and dates.", true);

export default function Page() { return <FaresPage lang="en" />; }
