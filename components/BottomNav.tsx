"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconClock, IconHome, IconImage, IconPlus, IconReceipt } from "@/components/icons";

const items = [
  { href: "/app", labelKey: "home" as const, icon: IconHome },
  { href: "/app/catalogue", labelKey: "catalogue" as const, icon: IconImage },
  { href: "/app/commandes", labelKey: "orders" as const, icon: IconReceipt },
  { href: "/app/relances", labelKey: "reminders" as const, icon: IconClock },
];

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav
      aria-label={t("mainNav")}
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <Link
        href="/app/produits/nouveau"
        aria-label={t("newProduct")}
        className="absolute left-1/2 top-0 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg ring-4 ring-white active:bg-brand-600"
      >
        <IconPlus className="h-6 w-6" />
      </Link>
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${
                  active ? "text-brand-600" : "text-gray-500"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
