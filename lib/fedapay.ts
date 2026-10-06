import { FedaPay, Transaction, Webhook } from "fedapay";

// XOF (zone UEMOA). Mêmes montants que les autres intégrations (voir lib/flutterwave.ts).
export const FEDAPAY_PLAN_PRICES: Record<"essentiel" | "pro", number> = {
  essentiel: 2000,
  pro: 6500,
};

function configureFedapay() {
  FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY!);
  FedaPay.setEnvironment(process.env.FEDAPAY_ENVIRONMENT || "live");
}

export async function createFedapayPaymentLink(params: {
  amount: number;
  description: string;
  callbackUrl: string;
  customerEmail: string;
}): Promise<{ transactionId: number; paymentUrl: string }> {
  configureFedapay();

  const transaction = await Transaction.create({
    description: params.description,
    amount: params.amount,
    currency: { iso: "XOF" },
    callback_url: params.callbackUrl,
    customer: { email: params.customerEmail },
  });

  const { url } = await transaction.generateToken();

  return { transactionId: transaction.id, paymentUrl: url };
}

/**
 * FedaPay ne garantit pas le contenu exact du payload webhook selon les intégrations : on
 * revérifie toujours la transaction via l'API (Transaction.retrieve) avant de faire confiance
 * à quoi que ce soit, même après une signature valide — même principe que Flutterwave.
 */
export async function retrieveFedapayTransaction(transactionId: number | string) {
  configureFedapay();
  return Transaction.retrieve(transactionId);
}

export function verifyFedapayWebhookSignature(rawBody: string, signatureHeader: string): unknown {
  return Webhook.constructEvent(rawBody, signatureHeader, process.env.FEDAPAY_WEBHOOK_SECRET!);
}
