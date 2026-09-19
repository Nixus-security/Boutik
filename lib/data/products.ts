"use client";

import { createClient } from "@/lib/supabase/client";
import { demoStore, isDemo } from "@/lib/demo";
import { productInputSchema } from "@/lib/schemas";
import type { NewProduct, Product } from "@/lib/types";

const PRODUCT_COLUMNS = "id, user_id, name, price, stock, category, photo_url, created_at";

export async function listProducts(): Promise<Product[]> {
  if (isDemo()) return demoStore.getProducts();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getProductCount(): Promise<number> {
  if (isDemo()) return demoStore.getProducts().length;

  const supabase = createClient();
  const { count, error } = await supabase.from("products").select("id", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

export async function createProducts(newProducts: NewProduct[]): Promise<Product[]> {
  const validated = newProducts.map((p) => {
    const result = productInputSchema.safeParse(p);
    if (!result.success) {
      throw new Error(`Produit invalide : ${result.error.issues[0]?.message ?? "données incorrectes"}`);
    }
    return result.data;
  });

  if (isDemo()) {
    const created: Product[] = validated.map((p, i) => ({
      ...p,
      id: `demo-${Date.now()}-${i}`,
      user_id: "demo",
      created_at: new Date().toISOString(),
    }));
    demoStore.addProducts(created);
    return created;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const rows = validated.map((p) => ({ ...p, user_id: user.id }));
  const { data, error } = await supabase.from("products").insert(rows).select(PRODUCT_COLUMNS);
  if (error) throw error;
  return data as Product[];
}

export async function deleteProduct(id: string): Promise<void> {
  if (isDemo()) {
    demoStore.setProducts(demoStore.getProducts().filter((p) => p.id !== id));
    return;
  }
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
