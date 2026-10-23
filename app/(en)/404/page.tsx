import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("en", "/404", "Page not found", "The requested page is unavailable.", true);

export default function Page() {
  return <article className="space-y-3 py-8">
    <h1 className="text-3xl font-semibold">Page not found</h1>
    <Link href="/" className="text-accent underline">Home</Link>
  </article>;
}
