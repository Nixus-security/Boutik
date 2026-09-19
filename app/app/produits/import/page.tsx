"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ExcelUploader } from "@/components/ExcelUploader";
import { ProductTable } from "@/components/ProductTable";
import { Button } from "@/components/ui/Button";
import { createProducts } from "@/lib/data/products";
import type { ParsedRow } from "@/lib/excel";

export default function ImportPage() {
  const router = useRouter();
  const t = useTranslations("productImport");
  const [rows, setRows] = useState<ParsedRow[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validCount = rows?.filter((r) => !r.error).length ?? 0;

  function updateRow(index: number, patch: Partial<ParsedRow>) {
    setRows((prev) => prev!.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function removeRow(index: number) {
    setRows((prev) => prev!.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!rows) return;
    setError(null);
    setSaving(true);
    try {
      const valid = rows.filter((r) => !r.error);
      await createProducts(
        valid.map((r) => ({
          name: r.name,
          price: r.price,
          stock: r.stock,
          category: r.category || null,
          photo_url: r.photo_url || null,
        }))
      );
      router.push("/app/produits");
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  if (!rows) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
        <ExcelUploader onParsed={setRows} />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">{t("reviewTitle")}</h1>
        <p className="text-sm text-gray-500" aria-live="polite">
          {t("reviewSubtitle", { validCount, total: rows.length })}
        </p>
      </div>

      <ProductTable rows={rows} onChange={updateRow} onRemove={removeRow} />

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* Barre fixe (pas sticky) : sur mobile le contenu tient souvent tout juste dans la
          hauteur d'écran, donc un élément sticky n'a jamais l'occasion de se "coller" et
          reste couvert par le bouton "+" flottant de la navigation. */}
      <div className="h-32" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-24 z-10 mx-auto max-w-md px-4">
        <div className="space-y-2 rounded-xl bg-white p-3 shadow-lg">
          <Button onClick={handleSave} disabled={validCount === 0} loading={saving}>
            {t("submit", { count: validCount })}
          </Button>
          <Button variant="secondary" onClick={() => setRows(null)}>
            {t("restart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
