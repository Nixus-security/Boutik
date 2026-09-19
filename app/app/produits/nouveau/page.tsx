"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createProducts } from "@/lib/data/products";
import { fileToResizedDataUrl } from "@/lib/image-resize";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconImage } from "@/components/icons";

export default function NouveauProduitPage() {
  const router = useRouter();
  const t = useTranslations("productForm");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePhotoChange(file: File) {
    setUploadingPhoto(true);
    setPhotoError(null);
    try {
      const resized = await fileToResizedDataUrl(file, 500);
      setPhoto(resized);
    } catch {
      setPhotoError(t("photoError"));
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceValue = Number(price);
    const stockValue = Number(stock);
    if (!name.trim() || !Number.isFinite(priceValue) || priceValue <= 0) {
      setError(t("validationError"));
      return;
    }

    setSaving(true);
    try {
      await createProducts([
        {
          name: name.trim(),
          price: priceValue,
          stock: Number.isFinite(stockValue) && stockValue >= 0 ? Math.round(stockValue) : 0,
          category: category.trim() || null,
          photo_url: photo,
        },
      ]);
      router.push("/app/produits");
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      <h1 className="text-xl font-extrabold text-gray-900">{t("addTitle")}</h1>

      <div>
        <p className="mb-1 block text-sm font-medium text-gray-700">{t("photo")}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          aria-label={t("photoAria")}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePhotoChange(file);
            e.target.value = "";
          }}
        />
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- aperçu d'un data URL local
              <img src={photo} alt={t("photoAlt")} className="h-full w-full object-cover" />
            ) : (
              <IconImage className="h-6 w-6 text-gray-400" aria-hidden="true" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="min-h-[44px] flex-1 rounded-xl border border-dashed border-gray-300 px-3 text-xs font-semibold text-gray-600 disabled:opacity-60"
          >
            {uploadingPhoto ? t("importing") : photo ? t("changePhoto") : t("addPhoto")}
          </button>
        </div>
        {photoError && (
          <p className="mt-2 text-xs font-medium text-red-700" role="alert">
            {photoError}
          </p>
        )}
      </div>

      <Input
        label={t("name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("namePlaceholder")}
        required
      />

      <Input
        label={t("price")}
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder={t("pricePlaceholder")}
        required
      />

      <Input
        label={t("stock")}
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder={t("stockPlaceholder")}
      />

      <Input
        label={t("category")}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder={t("categoryPlaceholder")}
      />

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={saving} disabled={uploadingPhoto}>
        {t("submitAdd")}
      </Button>
    </form>
  );
}
