import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CATALOGUE_MONTHLY_LIMIT, resolveActivePlan } from "@/lib/plans";

function monthStartIso(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

// Source de vérité côté serveur pour le quota mensuel de catalogues (produits/orders sont en
// RLS "owner all", donc un client pourrait insérer directement dans catalogue_generations sans
// passer par ici : cette route sert à vérifier le plan réel + le compte réel avant d'enregistrer,
// pour que l'UI (et un utilisateur qui bidouille les requêtes) ne puisse pas juste dire "autorisé".
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const plan = resolveActivePlan(subscription);
  const limit = CATALOGUE_MONTHLY_LIMIT[plan];

  if (limit !== null) {
    const { count, error: countError } = await supabase
      .from("catalogue_generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStartIso());

    if (countError) {
      return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
    if ((count ?? 0) >= limit) {
      return NextResponse.json({ allowed: false });
    }
  }

  const { error: insertError } = await supabase.from("catalogue_generations").insert({ user_id: user.id });
  if (insertError) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }

  return NextResponse.json({ allowed: true });
}
