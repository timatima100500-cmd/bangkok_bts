import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("ru", "/404", "Страница не найдена", "Запрошенная страница недоступна.", true);

export default function Page() {
  return <article className="space-y-3 py-8">
    <h1 className="text-3xl font-semibold">Страница не найдена</h1>
    <Link href="/ru/" className="text-accent underline">Главная</Link>
  </article>;
}
