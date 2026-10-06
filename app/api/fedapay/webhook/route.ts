import { NextRequest, NextResponse } from "next/server";
import { FEDAPAY_PLAN_PRICES, retrieveFedapayTransaction, verifyFedapayWebhookSignature } from "@/lib/fedapay";
import { createAdminClient } from "@/lib/supabase/admin";
import { activateSubscription, claimPaymentIntent, releasePaymentIntent } from "@/lib/payment-intents";

function extractTransactionId(event: unknown): number | string | null {
  const e = event as Record<string, unknown>;
  const candidates = [
    (e?.data as Record<string, unknown> | undefined)?.id,
    (e?.entity as Record<string, unknown> | undefined)?.id,
    e?.object_id,
  ];
  const found = candidates.find((v) => v !== undefined && v !== null);
  return (found as number | string | undefined) ?? null;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-fedapay-signature");
  const rawBody = await req.text();

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: unknown;
  try {
    event = verifyFedapayWebhookSignature(rawBody, signature);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const transactionId = extractTransactionId(event);
  if (transactionId === null) {
    return NextResponse.json({ received: true });
  }

  // Ne jamais faire confiance au payload webhook seul (même signé) : on revérifie la
  // transaction directement auprès de l'API FedaPay avant de faire quoi que ce soit.
  const transaction = await retrieveFedapayTransaction(transactionId).catch(() => null);
  if (!transaction || !transaction.wasPaid()) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();
  const externalId = String(transactionId);

  // Réclamation atomique : un rejeu ou une livraison en double ne passe jamais ce point deux fois.
  const intent = await claimPaymentIntent(admin, "fedapay", externalId);
  if (!intent) {
    return NextResponse.json({ received: true });
  }

  if (Number(transaction.amount) < FEDAPAY_PLAN_PRICES[intent.plan]) {
    return NextResponse.json({ received: true });
  }

  const activated = await activateSubscription(admin, {
    userId: intent.user_id,
    plan: intent.plan,
    provider: "fedapay",
    extra: { fedapay_transaction_id: externalId },
  });

  if (!activated) {
    // Rend l'intention réclamable pour que FedaPay réessaie la livraison.
    await releasePaymentIntent(admin, "fedapay", externalId);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
