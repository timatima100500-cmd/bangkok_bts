import SiteLayout from "@/components/SiteLayout";

export default function RussianLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="ru">{children}</SiteLayout>;
}
