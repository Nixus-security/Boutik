import type { Order, Product } from "@/lib/types";

const DEMO_COOKIE = "boutik_demo";
const PRODUCTS_KEY = "boutik_demo_products";
const ORDERS_KEY = "boutik_demo_orders";
const PROFILE_KEY = "boutik_demo_profile";

type DemoProfile = { business_name: string | null; phone: string | null };

const SEED_PROFILE: DemoProfile = { business_name: "Ma boutique démo", phone: null };

const SEED_PRODUCTS: Product[] = [
  {
    id: "demo-p1",
    user_id: "demo",
    name: "Pagne wax 6 yards",
    price: 15000,
    stock: 12,
    category: "Tissus",
    photo_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-p2",
    user_id: "demo",
    name: "Huile de coco 500ml",
    price: 3500,
    stock: 30,
    category: "Beauté",
    photo_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-p3",
    user_id: "demo",
    name: "Sac à main cuir",
    price: 22000,
    stock: 5,
    category: "Accessoires",
    photo_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-p4",
    user_id: "demo",
    name: "Baskets unisexe 42",
    price: 18000,
    stock: 8,
    category: "Chaussures",
    photo_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-p5",
    user_id: "demo",
    name: "Savon noir artisanal",
    price: 2000,
    stock: 50,
    category: "Beauté",
    photo_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-p6",
    user_id: "demo",
    name: "Robe wax femme",
    price: 12500,
    stock: 10,
    category: "Vêtements",
    photo_url: null,
    created_at: new Date().toISOString(),
  },
];

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

const SEED_ORDERS: Order[] = [
  {
    id: "demo-o1",
    user_id: "demo",
    client_name: "Aïcha Koné",
    client_phone: "0709123456",
    total: 15000,
    status: "impaye",
    payment_method: "mobile_money",
    created_at: daysAgo(6),
    paid_at: null,
    items: [{ id: "i1", order_id: "demo-o1", product_id: "demo-p1", product_name: "Pagne wax 6 yards", quantity: 1, unit_price: 15000 }],
  },
  {
    id: "demo-o2",
    user_id: "demo",
    client_name: "Moussa Diop",
    client_phone: "0771234567",
    total: 7000,
    status: "impaye",
    payment_method: "cash",
    created_at: daysAgo(4),
    paid_at: null,
    items: [{ id: "i2", order_id: "demo-o2", product_id: "demo-p2", product_name: "Huile de coco 500ml", quantity: 2, unit_price: 3500 }],
  },
  {
    id: "demo-o3",
    user_id: "demo",
    client_name: "Fatou Ndiaye",
    client_phone: "0655987654",
    total: 22000,
    status: "paye",
    payment_method: "mobile_money",
    created_at: daysAgo(2),
    paid_at: daysAgo(1),
    items: [{ id: "i3", order_id: "demo-o3", product_id: "demo-p3", product_name: "Sac à main cuir", quantity: 1, unit_price: 22000 }],
  },
  {
    id: "demo-o4",
    user_id: "demo",
    client_name: "Jean-Paul Mbeki",
    client_phone: "0612345678",
    total: 18000,
    status: "en_attente",
    payment_method: "mobile_money",
    created_at: daysAgo(1),
    paid_at: null,
    items: [{ id: "i4", order_id: "demo-o4", product_id: "demo-p4", product_name: "Baskets unisexe 42", quantity: 1, unit_price: 18000 }],
  },
];

export function isDemo(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${DEMO_COOKIE}=1`));
}

export function enterDemo() {
  document.cookie = `${DEMO_COOKIE}=1; path=/; max-age=${60 * 60 * 24}`;
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS));
  }
}

export function exitDemo() {
  document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0`;
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(ORDERS_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

export const demoStore = {
  getProducts(): Product[] {
    if (typeof localStorage === "undefined") return SEED_PRODUCTS;
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : SEED_PRODUCTS;
  },
  setProducts(products: Product[]) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },
  addProducts(newOnes: Product[]) {
    const current = demoStore.getProducts();
    demoStore.setProducts([...current, ...newOnes]);
  },
  getOrders(): Order[] {
    if (typeof localStorage === "undefined") return SEED_ORDERS;
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : SEED_ORDERS;
  },
  setOrders(orders: Order[]) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },
  addOrder(order: Order) {
    const current = demoStore.getOrders();
    demoStore.setOrders([order, ...current]);
  },
  updateOrder(id: string, patch: Partial<Order>) {
    const current = demoStore.getOrders();
    demoStore.setOrders(current.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  },
  getProfile(): DemoProfile {
    if (typeof localStorage === "undefined") return SEED_PROFILE;
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : SEED_PROFILE;
  },
  setProfile(patch: Partial<DemoProfile>) {
    const current = demoStore.getProfile();
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...patch }));
  },
};
