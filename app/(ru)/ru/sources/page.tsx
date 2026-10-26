import { pageMetadata } from "@/lib/site";
import SourcesPage from "@/components/pages/SourcesPage";

export const metadata = pageMetadata("ru", "/sources", "Источники", "Источники тарифных таблиц BTS.", false);

export default function Page() {
  return <SourcesPage lang="ru" />;
}
