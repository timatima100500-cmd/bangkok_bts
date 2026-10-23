import DirectoryPage from "@/components/pages/DirectoryPage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = pageMetadata("en", "/routes", siteCopy.en.routes, siteCopy.en.intro);
export default function Page() { return <DirectoryPage lang="en" section="routes" />; }
