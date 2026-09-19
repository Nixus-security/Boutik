/** Normalise un numéro local (ex: "07 12 34 56 78") en format wa.me (chiffres uniquement). */
export function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function waMeLink(phone: string, message?: string) {
  const digits = normalizePhone(phone);
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function relanceMessage(params: {
  clientName: string;
  amount: string;
  businessName?: string;
}) {
  const { clientName, amount, businessName } = params;
  const signature = businessName ? ` (${businessName})` : "";
  return `Bonjour ${clientName}, petit rappel concernant votre commande de ${amount} qui reste impayée. Merci de bien vouloir régler dès que possible 🙏${signature}`;
}
