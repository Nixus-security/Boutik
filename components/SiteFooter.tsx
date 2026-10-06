"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-16 border-t border-gray-100 py-6 text-center text-xs text-gray-500">
      <nav aria-label={t("legalNav")} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link href="/confidentialite" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
          {t("privacy")}
        </Link>
        <Link href="/cgu" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
          {t("terms")}
        </Link>
      </nav>
      <p className="mt-2">{t("copyright", { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
