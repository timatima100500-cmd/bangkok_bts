import DirectoryPage from "@/components/pages/DirectoryPage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = pageMetadata("ru", "/routes", siteCopy.ru.routes, siteCopy.ru.intro);
export default function Page() { return <DirectoryPage lang="ru" section="routes" />; }
