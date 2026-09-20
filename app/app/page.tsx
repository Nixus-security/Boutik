"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getProductCount } from "@/lib/data/products";
import { listOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/format";
import { useCurrency } from "@/lib/currency-context";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconBox, IconChart, IconImage, IconPlus, IconUpload } from "@/components/icons";
import type { Order } from "@/lib/types";

export default function DashboardPage() {
  const { currency } = useCurrency();
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [productCount, setProductCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getProductCount(), listOrders()])
      .then(([count, o]) => {
        setProductCount(count);
        setOrders(o);
      })
      .catch(() => setError(tCommon("genericLoadError")))
      .finally(() => setLoading(false));
  }, []);

  const unpaid = orders.filter((o) => o.status === "impaye");
  const unpaidTotal = unpaid.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">{t("greeting")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link href="/app/produits">
          <Card className="active:bg-gray-50">
            {loading ? (
              <Skeleton className="h-8 w-10" />
            ) : (
              <p className="text-2xl font-extrabold text-gray-900">{productCount}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">{t("productsInStock")}</p>
          </Card>
        </Link>
        <Card>
          {loading ? (
            <Skeleton className="h-8 w-10" />
          ) : (
            <p className="text-2xl font-extrabold text-red-600">{unpaid.length}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{t("unpaidOrders")}</p>
        </Card>
      </div>

      {!loading && unpaid.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm font-semibold text-red-800">
            {t("unpaidSummary", { amount: formatPrice(unpaidTotal, currency), count: unpaid.length })}
          </p>
          <Link href="/app/relances" className="mt-2 inline-block text-sm font-semibold text-red-700 underline">
            {t("seeReminders")}
          </Link>
        </Card>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">{t("quickActions")}</p>
        <div className="space-y-2">
          <QuickAction
            href="/app/statistiques"
            icon={IconChart}
            title={t("seeStats")}
            desc={t("seeStatsDesc")}
          />
          <QuickAction
            href="/app/produits"
            icon={IconBox}
            title={t("seeProducts")}
            desc={t("seeProductsDesc")}
          />
          <QuickAction
            href="/app/produits/import"
            icon={IconUpload}
            title={t("importStock")}
            desc={t("importStockDesc")}
          />
          <QuickAction
            href="/app/catalogue"
            icon={IconImage}
            title={t("generateCatalogue")}
            desc={t("generateCatalogueDesc")}
          />
          <QuickAction
            href="/app/commandes/nouvelle"
            icon={IconPlus}
            title={t("newOrder")}
            desc={t("newOrderDesc")}
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: (props: { className?: string }) => JSX.Element;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-3 active:bg-gray-50">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <span className="text-gray-400" aria-hidden="true">
          ›
        </span>
      </Card>
    </Link>
  );
}
