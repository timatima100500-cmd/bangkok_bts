import { pageMetadata } from "@/lib/site";
import SourcesPage from "@/components/pages/SourcesPage";

export const metadata = pageMetadata("en", "/sources", "Sources", "Sources attached to BTS fare tables.", true);

export default function Page() {
  return <SourcesPage lang="en" />;
}
