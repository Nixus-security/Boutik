export const CURRENCIES = [
  { code: "FCFA", label: "Franc CFA (FCFA)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "USD", label: "Dollar américain (USD)" },
  { code: "GBP", label: "Livre sterling (GBP)" },
  { code: "CAD", label: "Dollar canadien (CAD)" },
  { code: "NGN", label: "Naira (NGN)" },
  { code: "GHS", label: "Cedi (GHS)" },
  { code: "MAD", label: "Dirham marocain (MAD)" },
] as const;

export const DEFAULT_CURRENCY = "FCFA";

export function isKnownCurrency(value: string): boolean {
  return CURRENCIES.some((c) => c.code === value);
}

// Taux statiques approximatifs : combien de FCFA vaut 1 unité de la devise.
// L'EUR est fixe (arrimage FCFA/EUR à 655,957). Les autres sont approximatifs
// et doivent être mis à jour périodiquement si besoin de plus de précision.
export const FCFA_PER_UNIT: Record<string, number> = {
  FCFA: 1,
  EUR: 655.957,
  USD: 610,
  GBP: 770,
  CAD: 450,
  NGN: 0.4,
  GHS: 40,
  MAD: 61,
};

export function convertAmount(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  const fromRate = FCFA_PER_UNIT[from] ?? 1;
  const toRate = FCFA_PER_UNIT[to] ?? 1;
  return amount * (fromRate / toRate);
}

export function conversionFactor(from: string, to: string): number {
  if (from === to) return 1;
  const fromRate = FCFA_PER_UNIT[from] ?? 1;
  const toRate = FCFA_PER_UNIT[to] ?? 1;
  return fromRate / toRate;
}
