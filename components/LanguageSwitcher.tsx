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
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${locale === "fr" ? "bg-brand-700 text-white" : "text-gray-600"}`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${locale === "en" ? "bg-brand-700 text-white" : "text-gray-600"}`}
      >
        EN
      </button>
    </div>
  );
}
