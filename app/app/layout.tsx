"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { isDemo } from "@/lib/demo";
import { BottomNav } from "@/components/BottomNav";
import { DemoBanner } from "@/components/DemoBanner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CurrencyProvider } from "@/lib/currency-context";
import { IconBox, IconSettings } from "@/components/icons";
import logoFull from "@/public/logo-full.png";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  async function handleLogout() {
    if (!isDemo()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  }

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gray-50 pb-28">
        <DemoBanner />
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
          <Link href="/app" className="flex items-center">
            <Image src={logoFull} alt="Boutik" width={48} height={48} className="h-12 w-12" priority />
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitcher className="mr-1" />
            <Link
              href="/app/produits"
              aria-label={t("myProducts")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <IconBox className="h-5 w-5" />
            </Link>
            <Link
              href="/app/compte"
              aria-label={t("myAccount")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <IconSettings className="h-5 w-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              {t("logout")}
            </button>
          </div>
        </header>

        <main key={pathname} className="page-transition mx-auto max-w-md px-4 py-4">
          {children}
        </main>

        <BottomNav />
      </div>
    </CurrencyProvider>
  );
}
