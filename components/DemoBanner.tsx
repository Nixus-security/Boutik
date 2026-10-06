"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { exitDemo, isDemo } from "@/lib/demo";

export function DemoBanner() {
  const [demo, setDemo] = useState(false);
  const router = useRouter();
  const t = useTranslations("demo");

  useEffect(() => {
    setDemo(isDemo());
  }, []);

  if (!demo) return null;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-950">
      <span aria-hidden="true" />
      <span className="text-center">{t("banner")}</span>
      <button
        className="flex min-h-[44px] items-center justify-self-end whitespace-nowrap px-2 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-950"
        onClick={() => {
          exitDemo();
          router.push("/");
        }}
      >
        {t("exit")}
      </button>
    </div>
  );
}
