"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { listProducts } from "@/lib/data/products";
import { listOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/format";
import { useCurrency } from "@/lib/currency-context";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Order, Product } from "@/lib/types";

type Period = "today" | "7d" | "30d" | "all";

const LOW_STOCK_THRESHOLD = 5;

function periodStartMs(period: Period): number {
  const now = new Date();
  if (period === "all") return 0;
  if (period === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }
  const days = period === "7d" ? 7 : 30;
  return now.getTime() - days * 24 * 60 * 60 * 1000;
}

export default function StatistiquesPage() {
  const { currency } = useCurrency();
  const t = useTranslations("stats");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState<Period>("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listProducts(), listOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  const periodOrders = useMemo(() => {
    const start = periodStartMs(period);
    return orders.filter((o) => new Date(o.created_at).getTime() >= start);
  }, [orders, period]);

  const revenue = useMemo(
    () => periodOrders.filter((o) => o.status === "paye").reduce((sum, o) => sum + o.total, 0),
    [periodOrders]
  );
  const paidCount = periodOrders.filter((o) => o.status === "paye").length;
  const unpaidCount = periodOrders.filter((o) => o.status === "impaye").length;
  const averageOrderValue = paidCount > 0 ? revenue / paidCount : 0;

  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const lowStock = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).sort((a, b) => a.stock - b.stock);

  const topProducts = useMemo(() => {
    const byProduct = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const order of periodOrders) {
      for (const item of order.items) {
        const key = item.product_id ?? item.product_name;
        const current = byProduct.get(key) ?? { name: item.product_name, quantity: 0, revenue: 0 };
        current.quantity += item.quantity;
        current.revenue += item.quantity * item.unit_price;
        byProduct.set(key, current);
      }
    }
    return [...byProduct.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }, [periodOrders]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm font-medium text-red-700" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <h1 className="text-xl font-extrabold text-gray-900">{t("title")}</h1>

      <div className="flex gap-2 overflow-x-auto" role="group" aria-label={t("title")}>
        <PeriodChip active={period === "today"} onClick={() => setPeriod("today")} label={t("periodToday")} />
        <PeriodChip active={period === "7d"} onClick={() => setPeriod("7d")} label={t("period7d")} />
        <PeriodChip active={period === "30d"} onClick={() => setPeriod("30d")} label={t("period30d")} />
        <PeriodChip active={period === "all"} onClick={() => setPeriod("all")} label={t("periodAll")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label={t("revenue")} value={formatPrice(revenue, currency)} highlight />
        <StatCard label={t("ordersCount")} value={String(paidCount)} />
        <StatCard label={t("unpaidCount")} value={String(unpaidCount)} />
        <StatCard label={t("averageOrderValue")} value={formatPrice(averageOrderValue, currency)} />
      </div>

      <Card className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">{t("stockSection")}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-lg font-extrabold text-gray-900">{totalStockUnits}</p>
            <p className="text-xs text-gray-500">{t("totalStockUnits")}</p>
          </div>
          <div>
            <p className="text-lg font-extrabold text-gray-900">{formatPrice(inventoryValue, currency)}</p>
            <p className="text-xs text-gray-500">{t("inventoryValue")}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="mb-2 text-xs font-semibold text-gray-700">
            {t("lowStockTitle")}
            {lowStock.length > 0 ? ` (${lowStock.length})` : ""}
          </p>
          {lowStock.length === 0 ? (
            <p className="text-xs text-gray-500">{t("lowStockEmpty")}</p>
          ) : (
            <div className="space-y-1.5">
              {lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <span className="truncate text-gray-700">{p.name}</span>
                  <span className="shrink-0 font-semibold text-red-600">{t("lowStockUnits", { count: p.stock })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">{t("topProductsSection")}</p>
        {topProducts.length === 0 ? (
          <p className="text-xs text-gray-500">{t("topProductsEmpty")}</p>
        ) : (
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.name + i} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">{t("unitsSold", { count: p.quantity })}</p>
                </div>
                <p className="shrink-0 text-sm font-bold text-brand-700">{formatPrice(p.revenue, currency)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <Card className={highlight ? "border-brand-200 bg-brand-50" : undefined}>
      <p className={`text-lg font-extrabold ${highlight ? "text-brand-800" : "text-gray-900"}`}>{value}</p>
      <p className={`mt-1 text-xs ${highlight ? "text-brand-700" : "text-gray-500"}`}>{label}</p>
    </Card>
  );
}

function PeriodChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] shrink-0 rounded-full px-4 text-xs font-semibold ${
        active ? "bg-brand-500 text-white" : "border border-gray-200 bg-white text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
