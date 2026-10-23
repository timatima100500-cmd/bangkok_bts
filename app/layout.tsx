import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import LanguageProvider from "@/components/LanguageProvider";
import SiteHeader from "@/components/SiteHeader";
import AppearanceProvider from "@/components/AppearanceProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BTS Bangkok Fare Calculator",
  description: "Calculate BTS SkyTrain fares between stations in Bangkok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <AppearanceProvider>
              <div className="phone-shell flex flex-col bg-background text-foreground">
                <SiteHeader />
                <main className="w-full min-w-0 flex-1 px-4 pb-16">
                  {children}
                </main>
              </div>
            </AppearanceProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
