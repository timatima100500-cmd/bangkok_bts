import DirectoryPage from "@/components/pages/DirectoryPage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = pageMetadata("en", "/guides", siteCopy.en.guides, siteCopy.en.intro, true);
export default function Page() { return <DirectoryPage lang="en" section="guides" />; }
