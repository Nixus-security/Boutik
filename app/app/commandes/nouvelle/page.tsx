"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listProducts } from "@/lib/data/products";
import { createOrder } from "@/lib/data/orders";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { OrderStatus, PaymentMethod, Product } from "@/lib/types";

type LineItem = { product_id: string | null; product_name: string; quantity: number; unit_price: number };

export default function NouvelleCommandePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<LineItem[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [status, setStatus] = useState<OrderStatus>("en_attente");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile_money");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listProducts().then(setProducts);
  }, []);

  function addProduct(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === productId);
      if (existing) {
        return prev.map((i) => (i.product_id === productId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product_id: product.id, product_name: product.name, quantity: 1, unit_price: product.price }];
    });
  }

  function updateQuantity(index: number, quantity: number) {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, quantity } : it)));
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Ajoute au moins un produit à la commande.");
      return;
    }

    setSaving(true);
    try {
      await createOrder({ client_name: clientName, client_phone: clientPhone, status, payment_method: paymentMethod, items });
      router.push("/app/commandes");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-4" noValidate>
      <h1 className="text-xl font-extrabold text-gray-900">Nouvelle commande</h1>

      <div className="space-y-3">
        <Input label="Nom du client" required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ex : Aïcha Koné" />
        <Input
          label="Téléphone (WhatsApp)"
          required
          type="tel"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="Ex : 07 09 12 34 56"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="product-picker">
          Produits commandés
        </label>
        {products.length > 0 && (
          <select
            id="product-picker"
            onChange={(e) => {
              if (e.target.value) addProduct(e.target.value);
              e.target.value = "";
            }}
            defaultValue=""
            className="min-h-[44px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
          >
            <option value="" disabled>
              + Ajouter un produit
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatPrice(p.price)})
              </option>
            ))}
          </select>
        )}

        {items.length > 0 && (
          <div className="mt-3 space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3">
                <span className="flex-1 text-sm font-medium text-gray-900">{item.product_name}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(i, item.quantity - 1)}
                  aria-label={`Diminuer la quantité de ${item.product_name}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600 active:bg-gray-200"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(i, item.quantity + 1)}
                  aria-label={`Augmenter la quantité de ${item.product_name}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600 active:bg-gray-200"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700" id="payment-method-label">
          Moyen de paiement
        </p>
        <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="payment-method-label">
          <ChoiceButton active={paymentMethod === "mobile_money"} onClick={() => setPaymentMethod("mobile_money")} label="Mobile Money" />
          <ChoiceButton active={paymentMethod === "cash"} onClick={() => setPaymentMethod("cash")} label="Cash" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700" id="payment-status-label">
          Statut du paiement
        </p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="payment-status-label">
          <ChoiceButton active={status === "en_attente"} onClick={() => setStatus("en_attente")} label="En attente" />
          <ChoiceButton active={status === "paye"} onClick={() => setStatus("paye")} label="Payé" />
          <ChoiceButton active={status === "impaye"} onClick={() => setStatus("impaye")} label="Impayé" />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
        <span className="text-sm font-semibold text-brand-800">Total</span>
        <span className="text-lg font-extrabold text-brand-800">{formatPrice(total)}</span>
      </div>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={saving}>
        Enregistrer la commande
      </Button>
    </form>
  );
}

function ChoiceButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-semibold ${
        active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}
