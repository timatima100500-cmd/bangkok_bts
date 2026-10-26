import DirectoryPage from "@/components/pages/DirectoryPage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = pageMetadata("ru", "/stations", siteCopy.ru.stations, siteCopy.ru.intro, false);
export default function Page() { return <DirectoryPage lang="ru" section="stations" />; }
