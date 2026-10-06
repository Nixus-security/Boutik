import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PRICE_IDS = {
  essentiel: process.env.STRIPE_PRICE_ESSENTIEL!,
  pro: process.env.STRIPE_PRICE_PRO!,
} as const;
