"use client";

import { useRef, useState } from "react";
import { parseInventoryFile, type ParsedRow } from "@/lib/excel";
import { IconUpload } from "@/components/icons";

export function ExcelUploader({ onParsed }: { onParsed: (rows: ParsedRow[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const rows = await parseInventoryFile(file);
      if (rows.length === 0) {
        setError("Aucune ligne trouvée dans ce fichier.");
        return;
      }
      onParsed(rows);
    } catch (e) {
      setError("Impossible de lire ce fichier. Vérifie que c'est bien un fichier Excel (.xlsx).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        aria-label="Choisir un fichier Excel"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        aria-busy={loading || undefined}
        className="flex min-h-[44px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 px-6 py-10 text-center active:bg-brand-100 disabled:opacity-60"
      >
        <IconUpload className="h-8 w-8 text-brand-600" />
        <span className="text-sm font-semibold text-brand-700">
          {loading ? "Lecture du fichier…" : "Choisir un fichier Excel (.xlsx)"}
        </span>
        <span className="text-xs text-gray-500">Colonnes : nom, prix, quantité, catégorie</span>
      </button>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
