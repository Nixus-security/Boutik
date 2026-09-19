"use client";

import { useEffect, useState } from "react";
import { listOrders, markRelanceSent, updateOrderStatus } from "@/lib/data/orders";
import { daysSince, formatPrice } from "@/lib/format";
import { useCurrency } from "@/lib/currency-context";
import { relanceMessage, waMeLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelanceSkeletonList } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { IconCheckCircle } from "@/components/icons";
import type { Order } from "@/lib/types";

const THRESHOLD_KEY = "boutik_relance_days";

/** Priorité de relance : jamais relancé d'abord, puis relancé il y a le plus longtemps. */
function relancePriority(o: Order): number {
  return o.last_relance_at ? daysSince(o.last_relance_at) : Infinity;
}

export default function RelancesPage() {
  const { currency } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [threshold, setThreshold] = useState(3);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sequence, setSequence] = useState<{ list: Order[]; index: number } | null>(null);

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

  function relanceHref(o: Order) {
    return waMeLink(
      o.client_phone,
      relanceMessage({ clientName: o.client_name, amount: formatPrice(o.total, currency), daysOverdue: daysSince(o.created_at) })
    );
  }

  function recordRelance(o: Order) {
    const now = new Date().toISOString();
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, last_relance_at: now } : x)));
    markRelanceSent(o.id).catch(() => {
      // best-effort : le message WhatsApp est déjà parti, on ne bloque pas l'UI pour ça
    });
  }

  function startSequence() {
    if (toRelance.length === 0) return;
    setSequence({ list: toRelance, index: 0 });
    const first = toRelance[0];
    recordRelance(first);
    window.open(relanceHref(first), "_blank");
  }

  function nextInSequence() {
    if (!sequence) return;
    const nextIndex = sequence.index + 1;
    if (nextIndex >= sequence.list.length) {
      setSequence(null);
      return;
    }
    setSequence({ ...sequence, index: nextIndex });
    const next = sequence.list[nextIndex];
    recordRelance(next);
    window.open(relanceHref(next), "_blank");
  }

  const toRelance = orders
    .filter((o) => o.status === "impaye" && daysSince(o.created_at) >= threshold)
    .sort((a, b) => relancePriority(b) - relancePriority(a));

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
        <>
          {sequence ? (
            <Card className="flex items-center justify-between gap-3 border-brand-200 bg-brand-50">
              <div>
                <p className="text-sm font-semibold text-brand-800">
                  Relance {sequence.index + 1}/{sequence.list.length} · {sequence.list[sequence.index].client_name}
                </p>
                <p className="text-xs text-brand-700">Envoie le message dans WhatsApp, puis reviens ici.</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" className="text-xs" onClick={() => setSequence(null)}>
                  Arrêter
                </Button>
                <Button className="text-xs" onClick={nextInSequence}>
                  Suivant
                </Button>
              </div>
            </Card>
          ) : (
            toRelance.length > 1 && (
              <Button variant="secondary" onClick={startSequence}>
                Tout relancer ({toRelance.length})
              </Button>
            )
          )}

          <div className="space-y-2">
            {toRelance.map((o) => (
              <Card key={o.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={o.client_name} className="h-9 w-9 text-sm" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{o.client_name}</p>
                      <p className="text-xs text-red-700">Impayé depuis {daysSince(o.created_at)} jour(s)</p>
                      <p className="text-xs text-gray-500">
                        {o.last_relance_at
                          ? `Relancé il y a ${daysSince(o.last_relance_at)} jour(s)`
                          : "Jamais relancé"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatPrice(o.total, currency)}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={relanceHref(o)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => recordRelance(o)}
                    className="flex min-h-[44px] items-center justify-center rounded-xl bg-brand-500 px-3 text-xs font-bold text-white active:bg-brand-600"
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
        </>
      )}
    </div>
  );
}
