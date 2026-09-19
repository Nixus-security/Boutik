"use client";

import { useEffect, useState } from "react";
import { listOrders, updateOrderStatus } from "@/lib/data/orders";
import { daysSince, formatPrice } from "@/lib/format";
import { useCurrency } from "@/lib/currency-context";
import { relanceMessage, waMeLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { buttonBaseClass, buttonVariantClasses } from "@/components/ui/button-styles";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelanceSkeletonList } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { IconCheckCircle } from "@/components/icons";
import type { Order } from "@/lib/types";

const THRESHOLD_KEY = "boutik_relance_days";

export default function RelancesPage() {
  const { currency } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [threshold, setThreshold] = useState(3);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(THRESHOLD_KEY);
    if (saved) setThreshold(Number(saved));
    listOrders()
      .then(setOrders)
      .catch(() => setError("Impossible de charger tes commandes. Réessaie dans un instant."))
      .finally(() => setLoading(false));
  }, []);

  function saveThreshold(value: number) {
    const safeValue = Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
    setThreshold(safeValue);
    localStorage.setItem(THRESHOLD_KEY, String(safeValue));
  }

  async function markPaid(id: string) {
    setMarkingId(id);
    setError(null);
    try {
      await updateOrderStatus(id, "paye");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "paye" } : o)));
    } catch {
      setError("Impossible de mettre à jour cette commande. Réessaie.");
    } finally {
      setMarkingId(null);
    }
  }

  const toRelance = orders
    .filter((o) => o.status === "impaye" && daysSince(o.created_at) >= threshold)
    .sort((a, b) => daysSince(b.created_at) - daysSince(a.created_at));

  return (
    <div className="space-y-4 pb-4">
      <h1 className="text-xl font-extrabold text-gray-900">À relancer aujourd'hui</h1>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <Card className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-gray-700" htmlFor="relance-threshold">
          Relancer après (jours)
        </label>
        <input
          id="relance-threshold"
          type="number"
          min={1}
          value={threshold}
          onChange={(e) => saveThreshold(Number(e.target.value))}
          className="min-h-[44px] w-16 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm"
        />
      </Card>

      {loading ? (
        <RelanceSkeletonList rows={3} />
      ) : toRelance.length === 0 ? (
        <EmptyState
          icon={<IconCheckCircle className="h-10 w-10 text-brand-500" />}
          title="Rien à relancer"
          description="Tous les paiements sont à jour."
        />
      ) : (
        <div className="space-y-2">
          {toRelance.map((o) => (
            <Card key={o.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={o.client_name} className="h-9 w-9 text-sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{o.client_name}</p>
                    <p className="text-xs text-red-700">Impayé depuis {daysSince(o.created_at)} jour(s)</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900">{formatPrice(o.total, currency)}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={waMeLink(
                    o.client_phone,
                    relanceMessage({ clientName: o.client_name, amount: formatPrice(o.total, currency) })
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className={`${buttonBaseClass} ${buttonVariantClasses.primary} text-xs`}
                >
                  Relancer
                </a>
                <Button
                  variant="secondary"
                  className="text-xs"
                  loading={markingId === o.id}
                  onClick={() => markPaid(o.id)}
                >
                  Marquer payé
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
