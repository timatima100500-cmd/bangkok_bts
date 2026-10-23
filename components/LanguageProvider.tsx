"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { translations, type Lang, type TKey } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  t: (key: TKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export default function LanguageProvider({
  children,
  lang = "en",
}: {
  children: ReactNode;
  lang?: Lang;
}) {
  const t = (key: TKey) => translations[lang][key];

  return (
    <LangContext.Provider value={{ lang, t }}>
      {children}
    </LangContext.Provider>
  );
}
