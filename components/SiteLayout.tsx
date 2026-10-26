import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import LanguageProvider from "@/components/LanguageProvider";
import SiteHeader from "@/components/SiteHeader";
import type { Lang } from "@/lib/i18n";
import { siteCopy } from "@/lib/site";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function SiteLayout({
  children,
  lang,
  analytics,
}: Readonly<{
  children: React.ReactNode;
  lang: Lang;
  analytics?: React.ReactNode;
}>) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider lang={lang}>
            <div className="site-shell flex flex-col bg-background text-foreground">
              <SiteHeader />
              <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 pb-16">
                {children}
              </main>
              <footer className="border-t border-border px-5 py-6 text-center text-xs text-muted">{siteCopy[lang].independent}</footer>
            </div>
          </LanguageProvider>
        </ThemeProvider>
        {analytics}
      </body>
    </html>
  );
}
