import HomePage from "@/components/pages/HomePage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = { ...pageMetadata("en", "/", siteCopy.en.title, siteCopy.en.intro), title: { absolute: siteCopy.en.title } };
export default function Page() { return <HomePage lang="en" />; }
