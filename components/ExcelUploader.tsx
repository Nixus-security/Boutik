"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MAX_IMPORT_ROWS, parseInventoryFile, TooManyRowsError, type ParsedRow } from "@/lib/excel";
import { IconUpload } from "@/components/icons";

export function ExcelUploader({ onParsed }: { onParsed: (rows: ParsedRow[]) => void }) {
  const t = useTranslations("productImport");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const rows = await parseInventoryFile(file);
      if (rows.length === 0) {
        setError(t("emptyFile"));
        return;
      }
      onParsed(rows);
    } catch (e) {
      if (e instanceof TooManyRowsError) {
        setError(t("tooManyRows", { count: e.count, max: MAX_IMPORT_ROWS }));
      } else {
        setError(t("readError"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv,.ods"
        className="hidden"
        aria-label={t("chooseFile")}
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
        className="flex min-h-[44px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 px-6 py-10 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:bg-brand-100 disabled:opacity-60"
      >
        <IconUpload className="h-8 w-8 text-brand-600" />
        <span className="text-sm font-semibold text-brand-700">
          {loading ? t("reading") : t("chooseFileLabel")}
        </span>
        <span className="text-xs text-gray-500">{t("columnsHint")}</span>
      </button>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
