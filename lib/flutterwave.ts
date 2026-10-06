const FLW_BASE_URL = "https://api.flutterwave.com/v3";

// XOF (zone UEMOA : Sénégal, Côte d'Ivoire, Mali, Togo, Bénin, Burkina Faso).
// XOF et XAF (Cameroun) sont indexés 1:1 sur l'euro (1€ = 655,957 FCFA), montants arrondis.
export const FLW_PLAN_PRICES: Record<"essentiel" | "pro", number> = {
  essentiel: 2000,
  pro: 6500,
};

export function flwFetch(path: string, init: RequestInit = {}) {
  return fetch(`${FLW_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}
