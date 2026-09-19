"use client";

import { useEffect, useState } from "react";
import { listOrders } from "@/lib/data/orders";
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

const FILTERS: { value: OrderStatus | "toutes"; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "en_attente", label: "En attente" },
  { value: "impaye", label: "Impayées" },
  { value: "paye", label: "Payées" },
];

export default function CommandesPage() {
  const { currency } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "toutes">("toutes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch(() => setError("Impossible de charger tes commandes. Réessaie dans un instant."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "toutes" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-900">Commandes</h1>
      </div>

      <ButtonLink href="/app/commandes/nouvelle">Nouvelle commande</ButtonLink>

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
            className={`min-h-[44px] rounded-full px-4 text-xs font-semibold ${
              filter === f.value ? "bg-brand-500 text-white" : "border border-gray-200 bg-white text-gray-600"
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
          title="Aucune commande"
          description="Ajoute ta première commande."
          action={<ButtonLink href="/app/commandes/nouvelle">Nouvelle commande</ButtonLink>}
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
                <StatusBadge status={o.status} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">{formatDate(o.created_at)}</p>
                <p className="text-sm font-bold text-gray-900">{formatPrice(o.total, currency)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
