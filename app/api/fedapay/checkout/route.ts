import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createFedapayPaymentLink, FEDAPAY_PLAN_PRICES } from "@/lib/fedapay";
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

  let link: { transactionId: number; paymentUrl: string };
  try {
    link = await createFedapayPaymentLink({
      amount: FEDAPAY_PLAN_PRICES[parsed.data.plan],
      description: `Abonnement ${parsed.data.plan}`,
      callbackUrl: `${siteUrl}/app/compte?abonnement=succes`,
      customerEmail: user.email,
    });
  } catch {
    return NextResponse.json({ error: "Impossible de créer le paiement" }, { status: 502 });
  }

  const admin = createAdminClient();
  const saved = await createPaymentIntent(admin, {
    provider: "fedapay",
    externalId: String(link.transactionId),
    userId: user.id,
    plan: parsed.data.plan,
  });
  if (!saved) {
    return NextResponse.json({ error: "Impossible de créer le paiement" }, { status: 502 });
  }

  return NextResponse.json({ url: link.paymentUrl });
}
