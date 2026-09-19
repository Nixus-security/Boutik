import * as XLSX from "xlsx";

export type ParsedRow = {
  name: string;
  price: number;
  stock: number;
  category: string;
  photo_url: string;
  error: string | null;
};

const COLUMN_ALIASES: Record<string, string[]> = {
  name: ["nom produit", "nom", "produit", "article", "name"],
  price: ["prix", "prix unitaire", "price"],
  stock: ["quantite stock", "quantité stock", "quantite", "quantité", "stock", "qte", "qty"],
  category: ["categorie", "catégorie", "category", "type"],
  photo_url: ["photo", "image", "photo url", "image url"],
};

function normalizeHeader(h: string) {
  return h
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function matchColumn(headers: string[], field: string): string | null {
  const aliases = COLUMN_ALIASES[field].map(normalizeHeader);
  for (const h of headers) {
    if (aliases.includes(normalizeHeader(h))) return h;
  }
  return null;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  const cleaned = String(value ?? "")
    .replace(/[^\d.,-]/g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export async function parseInventoryFile(file: File): Promise<ParsedRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", codepage: 65001 });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  if (rows.length === 0) return [];

  const headers = Object.keys(rows[0]);
  const nameCol = matchColumn(headers, "name");
  const priceCol = matchColumn(headers, "price");
  const stockCol = matchColumn(headers, "stock");
  const categoryCol = matchColumn(headers, "category");
  const photoCol = matchColumn(headers, "photo_url");

  return rows.map((row) => {
    const name = nameCol ? String(row[nameCol]).trim() : "";
    const price = priceCol ? toNumber(row[priceCol]) : 0;
    const stock = stockCol ? Math.round(toNumber(row[stockCol])) : 0;
    const category = categoryCol ? String(row[categoryCol]).trim() : "";
    const photo_url = photoCol ? String(row[photoCol]).trim() : "";

    let error: string | null = null;
    if (!name) error = "Nom manquant";
    else if (price <= 0) error = "Prix invalide";

    return { name, price, stock, category, photo_url, error };
  });
}
