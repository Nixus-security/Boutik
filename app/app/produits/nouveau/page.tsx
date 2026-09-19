"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createProducts } from "@/lib/data/products";
import { fileToResizedDataUrl } from "@/lib/image-resize";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconImage } from "@/components/icons";

export default function NouveauProduitPage() {
  const router = useRouter();
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
      setPhotoError("Impossible d'utiliser cette image. Essaie un autre fichier.");
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
      setError("Vérifie le nom et le prix du produit.");
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
      setError("Impossible d'enregistrer ce produit. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      <h1 className="text-xl font-extrabold text-gray-900">Ajouter un produit</h1>

      <div>
        <p className="mb-1 block text-sm font-medium text-gray-700">Photo</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          aria-label="Choisir une photo du produit"
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
              <img src={photo} alt="Aperçu du produit" className="h-full w-full object-cover" />
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
            {uploadingPhoto ? "Import…" : photo ? "Changer la photo" : "Ajouter une photo"}
          </button>
        </div>
        {photoError && (
          <p className="mt-2 text-xs font-medium text-red-700" role="alert">
            {photoError}
          </p>
        )}
      </div>

      <Input
        label="Nom du produit"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex : Pagne wax 6 yards"
        required
      />

      <Input
        label="Prix"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Ex : 15000"
        required
      />

      <Input
        label="Stock"
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Ex : 10"
      />

      <Input
        label="Catégorie (optionnel)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Ex : Vêtements"
      />

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={saving} disabled={uploadingPhoto}>
        Enregistrer le produit
      </Button>
    </form>
  );
}
