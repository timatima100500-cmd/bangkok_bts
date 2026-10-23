import { pageMetadata } from "@/lib/site";
import SourcesPage from "@/components/pages/SourcesPage";

export const metadata = pageMetadata("ru", "/sources", "Источники", "Источники тарифных таблиц BTS.", true);

export default function Page() {
  return <SourcesPage lang="ru" />;
}
