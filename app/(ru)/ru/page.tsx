import HomePage from "@/components/pages/HomePage";
import { pageMetadata, siteCopy } from "@/lib/site";
export const metadata = { ...pageMetadata("ru", "/", siteCopy.ru.title, siteCopy.ru.intro), title: { absolute: siteCopy.ru.title } };
export default function Page() { return <HomePage lang="ru" />; }
