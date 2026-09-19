"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProduct, listProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { useCurrency } from "@/lib/currency-context";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductSkeletonList } from "@/components/ui/Skeleton";
import { IconBox, IconClose } from "@/components/icons";
import type { Product } from "@/lib/types";

export default function ProduitsPage() {
  const { currency } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    setLoading(true);
    setError(null);
    listProducts()
      .then(setProducts)
      .catch(() => setError("Impossible de charger tes produits. Réessaie dans un instant."))
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    setDeletingId(id);
    setError(null);
    try {
      await deleteProduct(id);
      reload();
    } catch {
      setError("Impossible de supprimer ce produit. Réessaie.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-900">Mes produits</h1>
        <span className="text-sm text-gray-500">{products.length}</span>
      </div>

      <div className="flex gap-2">
        <ButtonLink href="/app/produits/nouveau" className="flex-1">
          Ajouter un produit
        </ButtonLink>
        <ButtonLink href="/app/produits/import" variant="secondary" className="flex-1">
          Importer un Excel
        </ButtonLink>
      </div>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <ProductSkeletonList rows={4} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<IconBox className="h-10 w-10 text-gray-400" />}
          title="Aucun produit pour l'instant"
          description="Importe ton stock depuis un fichier Excel pour commencer."
          action={<ButtonLink href="/app/produits/import">Importer un fichier Excel</ButtonLink>}
        />
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <Card key={p.id} className="flex items-center gap-3">
              <Link href={`/app/produits/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  {p.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- data URL local, next/image ne s'applique pas ici
                    <img src={p.photo_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <IconBox className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.category || "Sans catégorie"} · Stock : {p.stock}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-brand-700">{formatPrice(p.price, currency)}</p>
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
                disabled={deletingId === p.id}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 active:bg-gray-100 disabled:opacity-50"
                aria-label={`Supprimer ${p.name}`}
              >
                <IconClose className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
