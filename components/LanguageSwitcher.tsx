"use client";

import { useLocale } from "next-intl";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();

  function setLocale(next: "fr" | "en") {
    if (next === locale) return;
    document.cookie = `boutik_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  }

  return (
    <div
      role="group"
      aria-label="Langue / Language"
      className={`inline-flex items-center rounded-full border border-gray-200 bg-white p-0.5 text-xs font-semibold ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale("fr")}
        aria-pressed={locale === "fr"}
        className={`min-h-[32px] rounded-full px-2.5 ${locale === "fr" ? "bg-brand-500 text-white" : "text-gray-600"}`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`min-h-[32px] rounded-full px-2.5 ${locale === "en" ? "bg-brand-500 text-white" : "text-gray-600"}`}
      >
        EN
      </button>
    </div>
  );
}
