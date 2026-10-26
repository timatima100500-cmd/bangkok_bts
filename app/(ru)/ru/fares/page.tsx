import FaresPage from "@/components/pages/FaresPage";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("ru", "/fares", "Тарифы BTS", "Архивные тарифы BTS и приблизительная модель расширений с источниками и датами.", false);

export default function Page() { return <FaresPage lang="ru" />; }
