import DirectoryPage from "@/components/pages/DirectoryPage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = pageMetadata("en", "/stations", siteCopy.en.stations, siteCopy.en.intro);
export default function Page() { return <DirectoryPage lang="en" section="stations" />; }
