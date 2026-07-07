"use client";
import { useLang } from "@/lib/i18n";

// Minimal EN | ไทย switch. `light` renders for dark/transparent backgrounds.
export default function LangToggle({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useLang();

  const active = light ? "text-white" : "text-[#0A0A0A]";
  const inactive = light
    ? "text-white/50 hover:text-white/80"
    : "text-[#8A8680] hover:text-[#0A0A0A]";

  return (
    <div className="flex items-center gap-1.5 font-sans text-[11px] tracking-[1px] select-none">
      <button
        onClick={() => setLang("en")}
        className={`press uppercase transition-colors duration-200 ${lang === "en" ? active : inactive}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span className={light ? "text-white/30" : "text-[#E8E4DC]"}>/</span>
      <button
        onClick={() => setLang("th")}
        className={`press transition-colors duration-200 ${lang === "th" ? active : inactive}`}
        aria-pressed={lang === "th"}
      >
        ไทย
      </button>
    </div>
  );
}
