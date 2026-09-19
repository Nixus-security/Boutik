export const PLAN_SLUGS = ["gratuit", "essentiel", "pro"] as const;
export type PlanSlug = (typeof PLAN_SLUGS)[number];
