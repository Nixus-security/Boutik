"use client";

import { createClient } from "@/lib/supabase/client";
import { demoStore, isDemo } from "@/lib/demo";
import { DEFAULT_CURRENCY, conversionFactor } from "@/lib/currency";
import { resolveActivePlan, type PlanSlug } from "@/lib/plans";

export type Account = {
  email: string | null;
  businessName: string;
  phone: string;
  currency: string;
  plan: PlanSlug;
};

export async function getAccount(): Promise<Account> {
  if (isDemo()) {
    const profile = demoStore.getProfile();
    return {
      email: null,
      businessName: profile.business_name ?? "",
      phone: profile.phone ?? "",
      currency: profile.currency || DEFAULT_CURRENCY,
      plan: "gratuit",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const [{ data, error }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("business_name, phone, currency").eq("id", user.id).single(),
    supabase.from("subscriptions").select("plan, status, current_period_end").eq("user_id", user.id).maybeSingle(),
  ]);
  if (error) throw error;

  const plan = resolveActivePlan(subscription);

  return {
    email: user.email ?? null,
    businessName: data?.business_name ?? "",
    phone: data?.phone ?? "",
    currency: data?.currency || DEFAULT_CURRENCY,
    plan,
  };
}

export async function updateAccount(patch: { businessName: string; phone: string; currency: string }): Promise<void> {
  if (isDemo()) {
    demoStore.setProfile({ business_name: patch.businessName || null, phone: patch.phone || null, currency: patch.currency });
    return;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const { error } = await supabase
    .from("profiles")
    .update({ business_name: patch.businessName || null, phone: patch.phone || null, currency: patch.currency })
    .eq("id", user.id);
  if (error) throw error;
}

export async function convertAccountCurrency(fromCurrency: string, toCurrency: string): Promise<void> {
  const factor = conversionFactor(fromCurrency, toCurrency);
  if (factor === 1) return;

  if (isDemo()) {
    demoStore.convertPrices(factor);
    return;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const { error } = await supabase.rpc("convert_user_currency", { p_user_id: user.id, p_factor: factor });
  if (error) throw error;
}

export async function changePassword(newPassword: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
