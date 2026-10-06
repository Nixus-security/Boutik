export const PLAN_SLUGS = ["gratuit", "essentiel", "pro"] as const;
export type PlanSlug = (typeof PLAN_SLUGS)[number];

/** null = illimité */
export const CATALOGUE_MONTHLY_LIMIT: Record<PlanSlug, number | null> = {
  gratuit: 1,
  essentiel: 5,
  pro: null,
};

export const RELANCES_MIN_PLAN: PlanSlug[] = ["essentiel", "pro"];
export const STATS_MIN_PLAN: PlanSlug[] = ["pro"];

/**
 * Détermine le forfait réel à partir de la ligne `subscriptions`. Vérifie aussi
 * `current_period_end` : pour Flutterwave (paiement unique 30 jours, pas de webhook de
 * renouvellement/expiration), c'est la seule chose qui coupe l'accès après la période payée —
 * sans ce check, le statut reste "active" indéfiniment même si le client n'a payé qu'une fois.
 */
export function resolveActivePlan(
  subscription: { plan: string; status: string; current_period_end: string | null } | null | undefined
): PlanSlug {
  if (!subscription) return "gratuit";

  const statusActive = subscription.status === "active" || subscription.status === "trialing";
  const notExpired = !subscription.current_period_end || new Date(subscription.current_period_end) > new Date();
  if (!statusActive || !notExpired) return "gratuit";

  return PLAN_SLUGS.includes(subscription.plan as PlanSlug) ? (subscription.plan as PlanSlug) : "gratuit";
}
