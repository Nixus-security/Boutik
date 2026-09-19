export type Product = {
  id: string;
  user_id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  photo_url: string | null;
  created_at: string;
};

export type NewProduct = Omit<Product, "id" | "user_id" | "created_at">;

export type OrderStatus = "en_attente" | "paye" | "impaye";
export type PaymentMethod = "mobile_money" | "cash";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  user_id: string;
  client_name: string;
  client_phone: string;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  created_at: string;
  paid_at: string | null;
  items: OrderItem[];
};

export type Profile = {
  id: string;
  business_name: string | null;
  phone: string | null;
  currency: string;
  relance_days: number;
};
