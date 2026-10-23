"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Design = "classic" | "modern";
const AppearanceContext = createContext<{
  design: Design;
  setDesign: (design: Design) => void;
} | null>(null);

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("AppearanceProvider is required");
  return context;
}

export default function AppearanceProvider({ children }: { children: ReactNode }) {
  const [design, setDesignState] = useState<Design>("classic");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bts-design");
      if (saved === "classic" || saved === "modern") setDesignState(saved);
    } catch { /* Keep the default when storage is unavailable. */ }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.design = design;
  }, [design]);

  function setDesign(next: Design) {
    setDesignState(next);
    try { localStorage.setItem("bts-design", next); } catch { /* Selection still works. */ }
  }

  return (
    <AppearanceContext.Provider value={{ design, setDesign }}>
      {children}
    </AppearanceContext.Provider>
  );
}
