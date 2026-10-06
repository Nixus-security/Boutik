import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { flwFetch, FLW_PLAN_PRICES } from "@/lib/flutterwave";
import { createAdminClient } from "@/lib/supabase/admin";
import { activateSubscription, claimPaymentIntent, releasePaymentIntent } from "@/lib/payment-intents";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("verif-hash");
  const secret = process.env.FLW_WEBHOOK_HASH;
  if (!signature || !secret || !safeEqual(signature, secret)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const event = await req.json().catch(() => null);
  const txId = event?.data?.id;
  if (event?.event !== "charge.completed" || !txId) {
    return NextResponse.json({ received: true });
  }

  // Ne jamais faire confiance au payload webhook seul : on revérifie la transaction auprès de Flutterwave.
  const verifyRes = await flwFetch(`/transactions/${txId}/verify`);
  const verified = await verifyRes.json().catch(() => null);
  const tx = verified?.data;

  if (tx?.status !== "successful" || tx?.currency !== "XOF" || !tx?.tx_ref) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();
  const txRef = String(tx.tx_ref);

  // Réclamation atomique : un rejeu ou une livraison en double ne passe jamais ce point deux fois.
  const intent = await claimPaymentIntent(admin, "flutterwave", txRef);
  if (!intent) {
    return NextResponse.json({ received: true });
  }

  if (Number(tx.amount) < FLW_PLAN_PRICES[intent.plan]) {
    return NextResponse.json({ received: true });
  }

  const activated = await activateSubscription(admin, {
    userId: intent.user_id,
    plan: intent.plan,
    provider: "flutterwave",
    extra: { flw_tx_ref: txRef, flw_transaction_id: String(tx.id) },
  });

  if (!activated) {
    await releasePaymentIntent(admin, "flutterwave", txRef);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
