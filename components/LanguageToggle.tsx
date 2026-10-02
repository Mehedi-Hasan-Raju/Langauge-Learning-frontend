"use client";

import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
      <button
        onClick={() => setLanguage("bn")}
        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
          language === "bn"
            ? "bg-gradient-to-r from-red-500 to-amber-400 text-white shadow-lg"
            : "text-slate-400 hover:text-white"
        }`}
      >
        বাংলা
      </button>

      <button
        onClick={() => setLanguage("en")}
        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
          language === "en"
            ? "bg-gradient-to-r from-red-500 to-amber-400 text-white shadow-lg"
            : "text-slate-400 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}