"use client";

import { createClient } from "@/lib/supabase/client";
import { demoStore, isDemo } from "@/lib/demo";
import { orderInputSchema } from "@/lib/schemas";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

export type NewOrderInput = {
  client_name: string;
  client_phone: string;
  status: OrderStatus;
  payment_method: Order["payment_method"];
  items: { product_name: string; product_id: string | null; quantity: number; unit_price: number }[];
};

const ORDER_COLUMNS = "id, user_id, client_name, client_phone, total, status, payment_method, created_at, paid_at";
const ORDER_ITEM_COLUMNS = "id, order_id, product_id, product_name, quantity, unit_price";

/** Additionne les quantités par produit (une commande peut avoir plusieurs lignes du même produit). */
function quantitiesByProduct(items: { product_id: string | null; quantity: number }[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of items) {
    if (!item.product_id) continue;
    map.set(item.product_id, (map.get(item.product_id) ?? 0) + item.quantity);
  }
  return map;
}

export async function listOrders(): Promise<Order[]> {
  if (isDemo()) return demoStore.getOrders();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`${ORDER_COLUMNS}, items:order_items(${ORDER_ITEM_COLUMNS})`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as Order[];
}

export async function createOrder(rawInput: NewOrderInput): Promise<Order> {
  const parsed = orderInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Commande invalide");
  }
  const input = parsed.data;
  const total = input.items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  if (isDemo()) {
    const orderId = `demo-o-${Date.now()}`;
    const order: Order = {
      id: orderId,
      user_id: "demo",
      client_name: input.client_name,
      client_phone: input.client_phone,
      total,
      status: input.status,
      payment_method: input.payment_method,
      created_at: new Date().toISOString(),
      paid_at: input.status === "paye" ? new Date().toISOString() : null,
      items: input.items.map((it, i) => ({
        id: `demo-i-${Date.now()}-${i}`,
        order_id: orderId,
        product_id: it.product_id,
        product_name: it.product_name,
        quantity: it.quantity,
        unit_price: it.unit_price,
      })),
    };
    demoStore.addOrder(order);
    demoStore.decrementStock(quantitiesByProduct(input.items));
    return order;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      client_name: input.client_name,
      client_phone: input.client_phone,
      total,
      status: input.status,
      payment_method: input.payment_method,
      paid_at: input.status === "paye" ? new Date().toISOString() : null,
    })
    .select(ORDER_COLUMNS)
    .single();

  if (orderError) throw orderError;

  const itemRows = input.items.map((it) => ({
    order_id: orderRow.id,
    product_id: it.product_id,
    product_name: it.product_name,
    quantity: it.quantity,
    unit_price: it.unit_price,
  }));

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .insert(itemRows)
    .select(ORDER_ITEM_COLUMNS);

  if (itemsError) throw itemsError;

  // Décrémente le stock produit par produit. Best-effort : la commande est déjà enregistrée,
  // on ne fait pas échouer la création pour un souci sur cette étape secondaire.
  for (const [productId, quantity] of quantitiesByProduct(input.items)) {
    try {
      await supabase.rpc("decrement_product_stock", { p_product_id: productId, p_quantity: quantity });
    } catch {
      // décrément best-effort : la commande est déjà enregistrée
    }
  }

  return { ...orderRow, items: items as OrderItem[] } as Order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const paid_at = status === "paye" ? new Date().toISOString() : null;

  if (isDemo()) {
    demoStore.updateOrder(id, { status, paid_at });
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.from("orders").update({ status, paid_at }).eq("id", id);
  if (error) throw error;
}
