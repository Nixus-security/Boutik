"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { getAccount } from "@/lib/data/profile";
import { formatPrice } from "@/lib/format";
import { waMeLink } from "@/lib/whatsapp";
import { fileToResizedDataUrl } from "@/lib/image-resize";
import { useCurrency } from "@/lib/currency-context";
import {
  BORDERS,
  type BorderId,
  CATALOGUE_THEMES,
  SHAPES,
  type ShapeId,
  type ThemeId,
} from "@/lib/catalogue-themes";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconClose, IconImage } from "@/components/icons";
import type { Product } from "@/lib/types";

type Format = "story" | "liste";

const STYLE_KEY = "boutik_catalogue_style";
const LOGO_KEY = "boutik_catalogue_logo";

const THEME_IDS = Object.keys(CATALOGUE_THEMES) as ThemeId[];
const SHAPE_IDS = Object.keys(SHAPES) as ShapeId[];
const BORDER_IDS = Object.keys(BORDERS) as BorderId[];

export default function CataloguePage() {
  const { currency } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<Format>("story");
  const [theme, setTheme] = useState<ThemeId>("vert");
  const [shape, setShape] = useState<ShapeId>("arrondi");
  const [border, setBorder] = useState<BorderId>("aucune");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("Ma boutique");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STYLE_KEY);
      if (saved) {
        const style = JSON.parse(saved);
        if (THEME_IDS.includes(style.theme)) setTheme(style.theme);
        if (SHAPE_IDS.includes(style.shape)) setShape(style.shape);
        if (BORDER_IDS.includes(style.border)) setBorder(style.border);
      }
      const savedLogo = localStorage.getItem(LOGO_KEY);
      if (savedLogo) setLogo(savedLogo);
    } catch {
      // préférences illisibles, on garde les valeurs par défaut
    }

    getAccount()
      .then((account) => {
        if (account.businessName) setBusinessName(account.businessName);
      })
      .catch(() => {
        // nom de boutique par défaut conservé si le profil est indisponible
      });

    listProducts()
      .then((p) => {
        setProducts(p);
        setSelected(new Set(p.map((x) => x.id)));
      })
      .catch(() => setError("Impossible de charger tes produits. Réessaie dans un instant."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(STYLE_KEY, JSON.stringify({ theme, shape, border }));
  }, [theme, shape, border]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleLogoChange(file: File) {
    setUploadingLogo(true);
    setLogoError(null);
    try {
      const resized = await fileToResizedDataUrl(file, 200, "png");
      setLogo(resized);
      localStorage.setItem(LOGO_KEY, resized);
    } catch {
      setLogoError("Impossible d'utiliser cette image. Essaie un autre fichier.");
    } finally {
      setUploadingLogo(false);
    }
  }

  function removeLogo() {
    setLogo(null);
    localStorage.removeItem(LOGO_KEY);
  }

  // Génère l'image côté serveur à chaque changement (produits, style, logo…).
  useEffect(() => {
    const items = products
      .filter((p) => selected.has(p.id))
      .map((p) => ({ name: p.name, price: p.price, photo: p.photo_url }));

    if (items.length === 0) {
      setImageBlob(null);
      return;
    }

    const controller = new AbortController();
    setGenerating(true);
    setError(null);

    fetch("/api/catalogue/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, theme, shape, border, business: businessName, currency, items, logo }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Génération impossible");
        return res.blob();
      })
      .then((blob) => setImageBlob(blob))
      .catch((e) => {
        if (e.name !== "AbortError") setError("Impossible de générer l'aperçu. Réessaie.");
      })
      .finally(() => setGenerating(false));

    return () => controller.abort();
  }, [products, selected, format, theme, shape, border, logo, businessName, currency]);

  useEffect(() => {
    if (!imageBlob) {
      setImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageBlob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageBlob]);

  function handleDownload() {
    if (!imageBlob) return;
    setDownloading(true);
    try {
      const url = URL.createObjectURL(imageBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `catalogue-${format}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    if (!imageBlob) return;
    setSharing(true);
    try {
      const file = new File([imageBlob], "catalogue.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Mon catalogue",
          text: `Découvrez le catalogue de ${businessName}`,
        });
        return;
      }
      window.open(waMeLink("", `Découvrez le catalogue de ${businessName} (image en pièce jointe)`), "_blank");
    } catch {
      // partage annulé ou indisponible, on ne fait rien
    } finally {
      setSharing(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="aspect-[9/16] w-full max-w-[260px]" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <p className="text-sm font-medium text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<IconImage className="h-10 w-10 text-gray-400" />}
        title="Pas encore de produits"
        description="Importe ton stock pour générer ton premier catalogue."
        action={<ButtonLink href="/app/produits/import">Importer un fichier Excel</ButtonLink>}
      />
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-900">Mon catalogue</h1>
        <Link href="/app/produits" className="text-sm font-semibold text-brand-700 underline">
          Voir mes produits
        </Link>
      </div>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2" role="group" aria-label="Format du catalogue">
        <FormatButton active={format === "story"} onClick={() => setFormat("story")} label="Statut (9:16)" />
        <FormatButton active={format === "liste"} onClick={() => setFormat("liste")} label="Catalogue classique" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Catalogue ${businessName} : ${selected.size} produit(s) avec prix, prêt pour WhatsApp`}
            className={format === "story" ? "mx-auto max-h-[480px]" : "w-full"}
          />
        ) : (
          <Skeleton className={format === "story" ? "mx-auto aspect-[9/16] max-h-[480px] w-[270px]" : "aspect-[4/5] w-full"} />
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-3">
        <p className="text-sm font-semibold text-gray-700">Personnaliser le design</p>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Couleurs</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Couleur du catalogue">
            {THEME_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                aria-pressed={theme === id}
                aria-label={CATALOGUE_THEMES[id].label}
                title={CATALOGUE_THEMES[id].label}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${
                  theme === id ? "border-gray-900" : "border-transparent"
                }`}
              >
                <span
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: CATALOGUE_THEMES[id].swatch }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Forme des cadres</p>
          <div className="flex gap-2" role="group" aria-label="Forme des cadres">
            {SHAPE_IDS.map((id) => (
              <ChoiceChip key={id} active={shape === id} onClick={() => setShape(id)} label={SHAPES[id].label} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Bordure</p>
          <div className="flex gap-2" role="group" aria-label="Bordure des cadres">
            {BORDER_IDS.map((id) => (
              <ChoiceChip key={id} active={border === id} onClick={() => setBorder(id)} label={BORDERS[id].label} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Mon logo</p>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            aria-label="Choisir un logo"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoChange(file);
              e.target.value = "";
            }}
          />
          <div className="flex items-center gap-3">
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element -- aperçu d'un data URL local, next/image ne s'applique pas ici
              <img src={logo} alt="Logo de ta boutique" className="h-11 w-11 rounded-xl object-cover" />
            )}
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={uploadingLogo}
              className="min-h-[44px] flex-1 rounded-xl border border-dashed border-gray-300 px-3 text-xs font-semibold text-gray-600 disabled:opacity-60"
            >
              {uploadingLogo ? "Import…" : logo ? "Changer le logo" : "Ajouter mon logo"}
            </button>
            {logo && (
              <button
                type="button"
                onClick={removeLogo}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-500 active:bg-gray-100"
                aria-label="Retirer le logo"
              >
                <IconClose className="h-4 w-4" />
              </button>
            )}
          </div>
          {logoError && (
            <p className="mt-2 text-xs font-medium text-red-700" role="alert">
              {logoError}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={handleDownload} disabled={!imageBlob || generating} loading={downloading}>
          Télécharger l'image
        </Button>
        <Button variant="secondary" onClick={handleShare} disabled={!imageBlob || generating} loading={sharing}>
          Partager sur WhatsApp
        </Button>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">
          Produits inclus ({selected.size}/{products.length})
        </p>
        <div className="space-y-2">
          {products.map((p) => (
            <label
              key={p.id}
              className="flex min-h-[44px] items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
            >
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => toggle(p.id)}
                className="h-5 w-5 accent-brand-500"
              />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                {p.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- data URL local, next/image ne s'applique pas ici
                  <img src={p.photo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <IconImage className="h-4 w-4 text-gray-400" aria-hidden="true" />
                )}
              </div>
              <span className="flex-1 text-sm font-medium text-gray-900">{p.name}</span>
              <span className="text-sm font-bold text-brand-700">{formatPrice(p.price, currency)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormatButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] flex-1 rounded-xl border px-3 py-2 text-xs font-semibold ${
        active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

function ChoiceChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] flex-1 rounded-xl border px-2 py-2 text-xs font-semibold ${
        active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}
