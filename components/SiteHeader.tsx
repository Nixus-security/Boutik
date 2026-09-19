"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import logoFull from "@/public/logo-full.png";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <Image src={logoFull} alt="Boutik" width={48} height={48} className="h-12 w-12" priority />
      </Link>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <Link
          href="/connexion"
          className="flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {t("login")}
        </Link>
      </div>
    </header>
  );
}
