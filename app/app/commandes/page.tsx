"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { listOrders, updateOrderStatus } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { useCurrency } from "@/lib/currency-context";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderSkeletonList } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { IconReceipt } from "@/components/icons";
import type { Order, OrderStatus } from "@/lib/types";

export default function CommandesPage() {
  const { currency } = useCurrency();
  const locale = useLocale();
  const t = useTranslations("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "toutes">("toutes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const FILTERS: { value: OrderStatus | "toutes"; label: string }[] = [
    { value: "toutes", label: t("filterAll") },
    { value: "en_attente", label: t("filterPending") },
    { value: "impaye", label: t("filterUnpaid") },
    { value: "paye", label: t("filterPaid") },
  ];

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  const filtered = filter === "toutes" ? orders : orders.filter((o) => o.status === filter);

  async function changeStatus(id: string, status: OrderStatus) {
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setUpdatingId(id);
    setError(null);
    try {
      await updateOrderStatus(id, status);
    } catch {
      setOrders(previous);
      setError(t("statusUpdateError"));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-900">{t("title")}</h1>
      </div>

      <ButtonLink href="/app/commandes/nouvelle">{t("newOrder")}</ButtonLink>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par statut">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`min-h-[44px] rounded-full px-4 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
              filter === f.value ? "bg-brand-700 text-white" : "border border-gray-200 bg-white text-gray-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <OrderSkeletonList rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconReceipt className="h-10 w-10 text-gray-400" />}
          title={t("emptyTitle")}
          description={t("emptyDesc")}
          action={<ButtonLink href="/app/commandes/nouvelle">{t("newOrder")}</ButtonLink>}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((o) => (
            <Card key={o.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Avatar name={o.client_name} className="h-9 w-9 text-sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{o.client_name}</p>
                    <p className="text-xs text-gray-500">{o.client_phone}</p>
                  </div>
                </div>
                <StatusBadge
                  status={o.status}
                  disabled={updatingId === o.id}
                  onChange={(status) => changeStatus(o.id, status)}
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">{formatDate(o.created_at, locale)}</p>
                <p className="text-sm font-bold text-gray-900">{formatPrice(o.total, currency)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
