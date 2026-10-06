"use client";

import { createClient } from "@/lib/supabase/client";
import { isDemo } from "@/lib/demo";
import { CATALOGUE_MONTHLY_LIMIT, type PlanSlug } from "@/lib/plans";

export type CatalogueUsage = {
  count: number;
  limit: number | null;
};

function monthStartIso(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export async function getCatalogueUsage(plan: PlanSlug): Promise<CatalogueUsage> {
  const limit = CATALOGUE_MONTHLY_LIMIT[plan];
  if (isDemo()) return { count: 0, limit: null };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { count: 0, limit };

  const { count, error } = await supabase
    .from("catalogue_generations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", monthStartIso());

  if (error) throw error;
  return { count: count ?? 0, limit };
}

/**
 * Enregistre un catalogue téléchargé/partagé. Renvoie false si la limite mensuelle du forfait est atteinte.
 * Passe par l'API (pas un insert Supabase direct) : le plan réel et le compte réel sont revérifiés
 * côté serveur, pour qu'on ne puisse pas contourner la limite en appelant Supabase directement.
 */
export async function recordCatalogueUsage(_plan: PlanSlug): Promise<boolean> {
  if (isDemo()) return true;

  const res = await fetch("/api/catalogue/usage", { method: "POST" });
  if (!res.ok) return false;
  const data = await res.json();
  return data.allowed === true;
}
