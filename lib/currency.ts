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
