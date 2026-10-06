import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { flwFetch, FLW_PLAN_PRICES } from "@/lib/flutterwave";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPaymentIntent } from "@/lib/payment-intents";
import { rateLimit } from "@/lib/rate-limit";

const checkoutSchema = z.object({
  plan: z.enum(["essentiel", "pro"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const limit = rateLimit(`checkout:${user.id}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Trop de tentatives" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const txRef = `boutik_${user.id}_${parsed.data.plan}_${Date.now()}`;

  const saved = await createPaymentIntent(createAdminClient(), {
    provider: "flutterwave",
    externalId: txRef,
    userId: user.id,
    plan: parsed.data.plan,
  });
  if (!saved) {
    return NextResponse.json({ error: "Impossible de créer le paiement" }, { status: 502 });
  }

  const res = await flwFetch("/payments", {
    method: "POST",
    body: JSON.stringify({
      tx_ref: txRef,
      amount: FLW_PLAN_PRICES[parsed.data.plan],
      currency: "XOF",
      redirect_url: `${siteUrl}/app/compte?abonnement=succes`,
      customer: { email: user.email },
      customizations: { title: "Boutik", description: `Abonnement ${parsed.data.plan}` },
      meta: { user_id: user.id, plan: parsed.data.plan },
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || data?.status !== "success" || !data?.data?.link) {
    return NextResponse.json({ error: "Impossible de créer le paiement" }, { status: 502 });
  }

  return NextResponse.json({ url: data.data.link });
}
