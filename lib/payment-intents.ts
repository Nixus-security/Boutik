import type { createAdminClient } from "@/lib/supabase/admin";

type Admin = ReturnType<typeof createAdminClient>;
type Provider = "fedapay" | "flutterwave";
type Plan = "essentiel" | "pro";

export async function createPaymentIntent(
  admin: Admin,
  params: { provider: Provider; externalId: string; userId: string; plan: Plan }
): Promise<boolean> {
  const { error } = await admin.from("payment_intents").insert({
    provider: params.provider,
    external_id: params.externalId,
    user_id: params.userId,
    plan: params.plan,
  });
  return !error;
}

// Un seul UPDATE ... WHERE processed_at IS NULL ... RETURNING : atomique, donc une livraison
// webhook rejouée ou dupliquée ne peut jamais réclamer deux fois la même intention de paiement.
export async function claimPaymentIntent(
  admin: Admin,
  provider: Provider,
  externalId: string
): Promise<{ user_id: string; plan: Plan } | null> {
  const { data } = await admin
    .from("payment_intents")
    .update({ processed_at: new Date().toISOString() })
    .eq("provider", provider)
    .eq("external_id", externalId)
    .is("processed_at", null)
    .select("user_id, plan")
    .maybeSingle();
  return (data as { user_id: string; plan: Plan } | null) ?? null;
}

export async function releasePaymentIntent(admin: Admin, provider: Provider, externalId: string): Promise<void> {
  await admin
    .from("payment_intents")
    .update({ processed_at: null })
    .eq("provider", provider)
    .eq("external_id", externalId);
}

/** Ajoute 30 jours à partir de la fin de période encore valide (sinon à partir de maintenant). */
export async function activateSubscription(
  admin: Admin,
  params: { userId: string; plan: Plan; provider: Provider; extra: Record<string, unknown> }
): Promise<boolean> {
  const { data: existing } = await admin
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", params.userId)
    .maybeSingle();

  const now = new Date();
  const currentEnd = existing?.current_period_end ? new Date(existing.current_period_end) : null;
  const base = existing?.status === "active" && currentEnd && currentEnd > now ? currentEnd : now;
  const periodEnd = new Date(base);
  periodEnd.setDate(periodEnd.getDate() + 30);

  const { error } = await admin.from("subscriptions").upsert({
    user_id: params.userId,
    plan: params.plan,
    status: "active",
    payment_provider: params.provider,
    ...params.extra,
    current_period_end: periodEnd.toISOString(),
    updated_at: now.toISOString(),
  });
  return !error;
}
