import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("en", "/about", "About", "About this independent Bangkok metro guide.", true);

export default function Page() {
  return <article className="space-y-3 py-8">
    <h1 className="text-3xl font-semibold">About</h1>
    <p>This page is being prepared.</p>
  </article>;
}
