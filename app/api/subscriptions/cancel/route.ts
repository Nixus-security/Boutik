import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("payment_provider, stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!subscription) {
    return NextResponse.json({ error: "Aucun abonnement" }, { status: 404 });
  }

  if (subscription.payment_provider === "stripe" && subscription.stripe_subscription_id) {
    // Annulation immédiate côté Stripe : le webhook customer.subscription.deleted
    // mettra ensuite la table subscriptions à jour (source de vérité).
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
  } else {
    // Flutterwave = paiement unique 30 jours, pas de prélèvement récurrent à annuler côté eux :
    // on repasse directement le compte en gratuit (pas de remboursement).
    const admin = createAdminClient();
    await admin
      .from("subscriptions")
      .update({ plan: "gratuit", status: "canceled", updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
  }

  return NextResponse.json({ ok: true });
}
