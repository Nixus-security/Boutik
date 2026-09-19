"use client";

import type { ParsedRow } from "@/lib/excel";
import { IconClose } from "@/components/icons";

export function ProductTable({
  rows,
  onChange,
  onRemove,
}: {
  rows: ParsedRow[];
  onChange: (index: number, patch: Partial<ParsedRow>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`rounded-xl border p-3 ${row.error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
        >
          <div className="flex items-start justify-between gap-2">
            <input
              value={row.name}
              onChange={(e) => onChange(i, { name: e.target.value, error: e.target.value ? null : "Nom manquant" })}
              placeholder="Nom du produit"
              aria-label="Nom du produit"
              className="min-h-[44px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold"
            />
            <button
              onClick={() => onRemove(i)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 active:bg-gray-100"
              aria-label="Supprimer la ligne"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-[11px] text-gray-500" htmlFor={`price-${i}`}>
                Prix
              </label>
              <input
                id={`price-${i}`}
                type="number"
                value={row.price}
                onChange={(e) => onChange(i, { price: Number(e.target.value) })}
                className="min-h-[44px] w-full rounded-lg border border-gray-200 px-2 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-500" htmlFor={`stock-${i}`}>
                Stock
              </label>
              <input
                id={`stock-${i}`}
                type="number"
                value={row.stock}
                onChange={(e) => onChange(i, { stock: Number(e.target.value) })}
                className="min-h-[44px] w-full rounded-lg border border-gray-200 px-2 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-500" htmlFor={`category-${i}`}>
                Catégorie
              </label>
              <input
                id={`category-${i}`}
                value={row.category}
                onChange={(e) => onChange(i, { category: e.target.value })}
                className="min-h-[44px] w-full rounded-lg border border-gray-200 px-2 py-2 text-sm"
              />
            </div>
          </div>
          {row.error && (
            <p className="mt-2 text-xs font-medium text-red-700" role="alert">
              {row.error}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
