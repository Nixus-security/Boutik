-- Boutik — schéma Supabase
-- À exécuter dans Supabase Studio > SQL Editor

create extension if not exists "pgcrypto";

-- Profil business (1 par utilisateur)
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  business_name text,
  phone text,
  currency text not null default 'FCFA',
  relance_days int not null default 3,
  created_at timestamptz not null default now()
);

-- Produits
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  price numeric not null default 0,
  stock int not null default 0,
  category text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Commandes
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  total numeric not null default 0,
  status text not null default 'en_attente' check (status in ('en_attente', 'paye', 'impaye')),
  payment_method text not null default 'cash' check (payment_method in ('mobile_money', 'cash')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- Lignes de commande
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric not null default 0
);

-- Row Level Security : chaque utilisateur ne voit que ses données
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "profiles: owner read" on profiles for select using (auth.uid() = id);
create policy "profiles: owner insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles: owner update" on profiles for update using (auth.uid() = id);

create policy "products: owner all" on products for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "orders: owner all" on orders for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "order_items: owner all" on order_items for all
  using (exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()))
  with check (exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

-- Crée automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, business_name)
  values (new.id, new.raw_user_meta_data->>'business_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
