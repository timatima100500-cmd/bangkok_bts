import HomePage from "@/components/pages/HomePage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = pageMetadata("en", "/", siteCopy.en.title, siteCopy.en.intro);
export default function Page() { return <HomePage lang="en" />; }
