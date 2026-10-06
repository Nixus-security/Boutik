"use client";

import { useTranslations } from "next-intl";
import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  en_attente: "bg-amber-700 text-white",
  paye: "bg-brand-700 text-white",
  impaye: "bg-red-600 text-white",
};

const labelKeys: Record<OrderStatus, "pending" | "paid" | "unpaid"> = {
  en_attente: "pending",
  paye: "paid",
  impaye: "unpaid",
};

const ORDERED_STATUSES: OrderStatus[] = ["en_attente", "impaye", "paye"];

export function StatusBadge({
  status,
  onChange,
  disabled,
}: {
  status: OrderStatus;
  onChange?: (status: OrderStatus) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("newOrder");

  if (!onChange) {
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>
        {t(labelKeys[status])}
      </span>
    );
  }

  return (
    <select
      aria-label={t("paymentStatus")}
      value={status}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className={`min-h-[44px] cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-60 ${styles[status]}`}
    >
      {ORDERED_STATUSES.map((s) => (
        <option key={s} value={s}>
          {t(labelKeys[s])}
        </option>
      ))}
    </select>
  );
}
