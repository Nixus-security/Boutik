import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function planFromSubscription(subscription: Stripe.Subscription): string {
  return (subscription.metadata?.plan as string | undefined) ?? "gratuit";
}

function periodEndFromSubscription(subscription: Stripe.Subscription): string | null {
  const periodEnd = subscription.items.data[0]?.current_period_end;
  return periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id ?? session.metadata?.user_id;
      if (!userId || !session.subscription || !session.customer) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: planFromSubscription(subscription),
        status: subscription.status,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        current_period_end: periodEndFromSubscription(subscription),
        updated_at: new Date().toISOString(),
      });
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.user_id;
      if (!userId) break;

      const isActive = subscription.status === "active" || subscription.status === "trialing";

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: isActive ? planFromSubscription(subscription) : "gratuit",
        status: subscription.status,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        current_period_end: periodEndFromSubscription(subscription),
        updated_at: new Date().toISOString(),
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
