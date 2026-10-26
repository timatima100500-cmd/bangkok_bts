import DirectoryPage from "@/components/pages/DirectoryPage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = pageMetadata("ru", "/guides", siteCopy.ru.guides, siteCopy.ru.intro, false);
export default function Page() { return <DirectoryPage lang="ru" section="guides" />; }
