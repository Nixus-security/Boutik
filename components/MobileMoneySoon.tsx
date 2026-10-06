"use client";

import { useTranslations } from "next-intl";
import { IconPhone } from "@/components/icons";

export function MobileMoneySoon({ className = "" }: { className?: string }) {
  const t = useTranslations("pricing");

  return (
    <div
      className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-gray-400 bg-gray-50 px-4 text-sm font-semibold text-gray-700 ${className}`}
    >
      <IconPhone className="h-4 w-4" aria-hidden="true" />
      {t("mobileMoneySoon")}
    </div>
  );
}
