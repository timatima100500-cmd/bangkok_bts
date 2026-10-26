import SiteLayout from "@/components/SiteLayout";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="en" analytics={process.env.NEXT_PUBLIC_GA_ID && (
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
  )}>{children}</SiteLayout>;
}
