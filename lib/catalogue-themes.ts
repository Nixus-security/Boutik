import { z } from "zod";

export const themeIdSchema = z.enum(["vert", "bleu", "orange", "violet", "noir", "rose"]);
export type ThemeId = z.infer<typeof themeIdSchema>;

export const shapeIdSchema = z.enum(["carre", "arrondi", "tres_arrondi"]);
export type ShapeId = z.infer<typeof shapeIdSchema>;

export const borderIdSchema = z.enum(["aucune", "fine", "epaisse"]);
export type BorderId = z.infer<typeof borderIdSchema>;

export type CatalogueTheme = {
  label: string;
  swatch: string;
  bgGradient: string;
  cardBg: string;
  headerColor: string;
  subheaderColor: string;
  priceColor: string;
  nameColor: string;
  chipBg: string;
  borderColor: string;
  footerBg: string;
  footerColor: string;
};

export const CATALOGUE_THEMES: Record<ThemeId, CatalogueTheme> = {
  vert: {
    label: "Vert",
    swatch: "#1cb96c",
    bgGradient: "linear-gradient(160deg, #0f3d29 0%, #1cb96c 55%, #7ce7ab 100%)",
    cardBg: "#ffffff",
    headerColor: "#ffffff",
    subheaderColor: "#eafff2",
    priceColor: "#129756",
    nameColor: "#111827",
    chipBg: "#eefdf3",
    borderColor: "#bdf0d3",
    footerBg: "rgba(255,255,255,0.15)",
    footerColor: "#ffffff",
  },
  bleu: {
    label: "Bleu",
    swatch: "#1d5fae",
    bgGradient: "linear-gradient(160deg, #0b2545 0%, #1d5fae 55%, #7fb9f0 100%)",
    cardBg: "#ffffff",
    headerColor: "#ffffff",
    subheaderColor: "#e6f0ff",
    priceColor: "#1d5fae",
    nameColor: "#111827",
    chipBg: "#eaf3ff",
    borderColor: "#bcd9f7",
    footerBg: "rgba(255,255,255,0.15)",
    footerColor: "#ffffff",
  },
  orange: {
    label: "Orange",
    swatch: "#e2661a",
    bgGradient: "linear-gradient(160deg, #6b2b0a 0%, #e2661a 55%, #ffb066 100%)",
    cardBg: "#fffaf4",
    headerColor: "#ffffff",
    subheaderColor: "#fff1e0",
    priceColor: "#c2410c",
    nameColor: "#1f2937",
    chipBg: "#fff1e0",
    borderColor: "#ffd4a3",
    footerBg: "rgba(255,255,255,0.18)",
    footerColor: "#ffffff",
  },
  violet: {
    label: "Violet",
    swatch: "#7c3aed",
    bgGradient: "linear-gradient(160deg, #2e1065 0%, #7c3aed 55%, #e0aaff 100%)",
    cardBg: "#ffffff",
    headerColor: "#ffffff",
    subheaderColor: "#f3e8ff",
    priceColor: "#7c3aed",
    nameColor: "#111827",
    chipBg: "#f3e8ff",
    borderColor: "#dcc4fb",
    footerBg: "rgba(255,255,255,0.16)",
    footerColor: "#ffffff",
  },
  noir: {
    label: "Noir",
    swatch: "#262626",
    bgGradient: "linear-gradient(160deg, #0a0a0a 0%, #262626 55%, #525252 100%)",
    cardBg: "#ffffff",
    headerColor: "#ffffff",
    subheaderColor: "#e5e5e5",
    priceColor: "#b8860b",
    nameColor: "#111827",
    chipBg: "#f5f5f5",
    borderColor: "#d4d4d4",
    footerBg: "rgba(255,255,255,0.12)",
    footerColor: "#ffffff",
  },
  rose: {
    label: "Rose",
    swatch: "#db2777",
    bgGradient: "linear-gradient(160deg, #831843 0%, #db2777 55%, #f9a8d4 100%)",
    cardBg: "#fff5f9",
    headerColor: "#ffffff",
    subheaderColor: "#ffe4ef",
    priceColor: "#be185d",
    nameColor: "#1f2937",
    chipBg: "#ffe4ef",
    borderColor: "#fbcfe8",
    footerBg: "rgba(255,255,255,0.18)",
    footerColor: "#ffffff",
  },
};

export const SHAPES: Record<ShapeId, { label: string; cardRadius: number; chipRadius: number }> = {
  carre: { label: "Carré", cardRadius: 4, chipRadius: 4 },
  arrondi: { label: "Arrondi", cardRadius: 20, chipRadius: 12 },
  tres_arrondi: { label: "Très arrondi", cardRadius: 36, chipRadius: 20 },
};

export const BORDERS: Record<BorderId, { label: string; width: number }> = {
  aucune: { label: "Aucune", width: 0 },
  fine: { label: "Fine", width: 2 },
  epaisse: { label: "Épaisse", width: 6 },
};
