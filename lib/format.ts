export function formatPrice(value: number, currency = "FCFA") {
  return `${Math.round(value).toLocaleString("fr-FR")} ${currency}`;
}

export function formatDate(iso: string, locale = "fr") {
  return new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function daysSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
