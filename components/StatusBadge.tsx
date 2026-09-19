"use client";

import { useTranslations } from "next-intl";
import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  en_attente: "bg-amber-500 text-white",
  paye: "bg-brand-500 text-white",
  impaye: "bg-red-500 text-white",
};

const labelKeys: Record<OrderStatus, "pending" | "paid" | "unpaid"> = {
  en_attente: "pending",
  paye: "paid",
  impaye: "unpaid",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const t = useTranslations("newOrder");

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {t(labelKeys[status])}
    </span>
  );
}
