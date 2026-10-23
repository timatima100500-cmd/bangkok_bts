"use client";

import { useAppearance } from "@/components/AppearanceProvider";
import { useLang } from "@/components/LanguageProvider";

export default function DesignToggle() {
  const { design, setDesign } = useAppearance();
  const { t } = useLang();

  return (
    <div className="segmented-control flex flex-1" role="group" aria-label={t("appearance")}>
      {(["classic", "modern"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={design === option}
          onClick={() => setDesign(option)}
          className="segment flex-1"
        >
          {option === "classic" ? "Classic" : "Modern"}
        </button>
      ))}
    </div>
  );
}
