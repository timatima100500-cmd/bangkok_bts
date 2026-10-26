import SiteLayout from "@/components/SiteLayout";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RussianLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="ru" analytics={process.env.NEXT_PUBLIC_GA_ID && (
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
  )}>{children}</SiteLayout>;
}
