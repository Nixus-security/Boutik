import type { OrderStatus } from "@/lib/types";

const labels: Record<OrderStatus, string> = {
  en_attente: "En attente",
  paye: "Payé",
  impaye: "Impayé",
};

const styles: Record<OrderStatus, string> = {
  en_attente: "bg-amber-500 text-white",
  paye: "bg-brand-500 text-white",
  impaye: "bg-red-500 text-white",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
