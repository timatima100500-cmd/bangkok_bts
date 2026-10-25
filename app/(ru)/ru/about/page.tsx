import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("ru", "/about", "О проекте", "О независимом гиде по метро Бангкока.", false);

export default function Page() {
  return <article className="space-y-3 py-8">
    <h1 className="text-3xl font-semibold">О проекте</h1>
    <p>Страница готовится.</p>
  </article>;
}
