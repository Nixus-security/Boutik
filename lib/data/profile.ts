"use client";

import { createClient } from "@/lib/supabase/client";
import { demoStore, isDemo } from "@/lib/demo";
import { PLAN_SLUGS, type PlanSlug } from "@/lib/plans";

export type Account = {
  email: string | null;
  businessName: string;
  phone: string;
  plan: PlanSlug;
};

export async function getAccount(): Promise<Account> {
  if (isDemo()) {
    const profile = demoStore.getProfile();
    return { email: null, businessName: profile.business_name ?? "", phone: profile.phone ?? "", plan: "gratuit" };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const { data, error } = await supabase
    .from("profiles")
    .select("business_name, phone")
    .eq("id", user.id)
    .single();
  if (error) throw error;

  const metaPlan = user.user_metadata?.plan;
  const plan: PlanSlug = PLAN_SLUGS.includes(metaPlan) ? metaPlan : "gratuit";

  return {
    email: user.email ?? null,
    businessName: data?.business_name ?? "",
    phone: data?.phone ?? "",
    plan,
  };
}

export async function updateAccount(patch: { businessName: string; phone: string }): Promise<void> {
  if (isDemo()) {
    demoStore.setProfile({ business_name: patch.businessName || null, phone: patch.phone || null });
    return;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const { error } = await supabase
    .from("profiles")
    .update({ business_name: patch.businessName || null, phone: patch.phone || null })
    .eq("id", user.id);
  if (error) throw error;
}

export async function changePassword(newPassword: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
