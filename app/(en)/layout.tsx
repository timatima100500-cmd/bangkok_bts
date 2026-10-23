import SiteLayout from "@/components/SiteLayout";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="en">{children}</SiteLayout>;
}
