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
  daysOverdue: number;
  businessName?: string;
}) {
  const { clientName, amount, daysOverdue, businessName } = params;
  const signature = businessName ? ` (${businessName})` : "";

  let body: string;
  if (daysOverdue >= 14) {
    body = `Bonjour ${clientName}, ceci est un dernier rappel : votre commande de ${amount} reste impayée depuis ${daysOverdue} jours. Merci de régulariser rapidement.`;
  } else if (daysOverdue >= 7) {
    body = `Bonjour ${clientName}, votre commande de ${amount} reste impayée depuis ${daysOverdue} jours. Merci de procéder au règlement dès que possible.`;
  } else {
    body = `Bonjour ${clientName}, petit rappel concernant votre commande de ${amount} qui reste impayée. Merci de bien vouloir régler dès que possible 🙏`;
  }

  return `${body}${signature}`;
}
