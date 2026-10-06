import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
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

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: existing?.stripe_customer_id ?? undefined,
    customer_email: existing?.stripe_customer_id ? undefined : user.email,
    client_reference_id: user.id,
    line_items: [{ price: STRIPE_PRICE_IDS[parsed.data.plan], quantity: 1 }],
    success_url: `${siteUrl}/app/compte?abonnement=succes`,
    cancel_url: `${siteUrl}/tarifs`,
    metadata: { user_id: user.id, plan: parsed.data.plan },
    subscription_data: { metadata: { user_id: user.id, plan: parsed.data.plan } },
  });

  return NextResponse.json({ url: session.url });
}
