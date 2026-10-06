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
  paid_at timestamptz,
  last_relance_at timestamptz
);

-- Pour une base déjà créée avant l'ajout de cette colonne (sans effet si elle existe déjà).
alter table orders add column if not exists last_relance_at timestamptz;

-- Lignes de commande
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric not null default 0
);

-- Abonnements Stripe (une ligne par utilisateur, mise à jour par le webhook)
create table if not exists subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'gratuit',
  status text not null default 'inactive',
  payment_provider text not null default 'stripe',
  stripe_customer_id text,
  stripe_subscription_id text,
  flw_tx_ref text,
  flw_transaction_id text,
  fedapay_transaction_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- Si la table existe déjà (déploiement précédent), ajoute les colonnes manquantes :
-- alter table subscriptions add column if not exists payment_provider text not null default 'stripe';
-- alter table subscriptions add column if not exists flw_tx_ref text;
-- alter table subscriptions add column if not exists flw_transaction_id text;
-- alter table subscriptions add column if not exists fedapay_transaction_id text;

-- FedaPay ne renvoie pas de metadata custom fiable sur ses transactions : on garde nous-mêmes
-- la correspondance (transaction FedaPay -> user/plan) créée au moment du checkout, pour que le
-- webhook puisse retrouver qui payer sans dépendre d'un champ non documenté côté FedaPay.
create table if not exists payment_intents (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  plan text not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Si la table existe déjà : alter table payment_intents add column if not exists processed_at timestamptz;
-- processed_at est posé de façon atomique par le webhook : une intention ne peut activer un abonnement qu'une fois.
create unique index if not exists payment_intents_provider_external_idx on payment_intents (provider, external_id);
alter table payment_intents enable row level security;
-- Pas de policy client : lu/écrit uniquement via service_role (routes checkout + webhook).

-- Un enregistrement par catalogue téléchargé/partagé : sert à appliquer la limite mensuelle du forfait.
create table if not exists catalogue_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists catalogue_generations_user_created_idx on catalogue_generations (user_id, created_at);

-- Row Level Security : chaque utilisateur ne voit que ses données
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table subscriptions enable row level security;
alter table catalogue_generations enable row level security;

create policy "profiles: owner read" on profiles for select using (auth.uid() = id);
create policy "profiles: owner insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles: owner update" on profiles for update using (auth.uid() = id);

create policy "products: owner all" on products for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "orders: owner all" on orders for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Lecture seule côté utilisateur : seule l'API webhook (service role) écrit ici.
create policy "subscriptions: owner read" on subscriptions for select using (auth.uid() = user_id);

-- Insert + lecture seulement : jamais de update/delete, pour qu'un utilisateur ne puisse pas
-- effacer ses propres lignes d'usage et remettre à zéro son quota mensuel de catalogues.
drop policy if exists "catalogue_generations: owner all" on catalogue_generations;
create policy "catalogue_generations: owner read" on catalogue_generations for select using (auth.uid() = user_id);
create policy "catalogue_generations: owner insert" on catalogue_generations for insert with check (auth.uid() = user_id);

create policy "order_items: owner all" on order_items for all
  using (exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()))
  with check (exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

-- Plafond dur de produits par compte : bloque l'insert au niveau base, donc valable quel que
-- soit le chemin (import Excel par lot, ou appel direct à Supabase qui contournerait tout
-- plafond côté client comme celui de lib/excel.ts).
create or replace function public.enforce_product_limit()
returns trigger as $$
begin
  if (select count(*) from products where user_id = new.user_id) >= 5000 then
    raise exception 'Limite de produits atteinte (5000 maximum par compte)';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists enforce_product_limit_trigger on products;
create trigger enforce_product_limit_trigger
  before insert on products
  for each row execute procedure public.enforce_product_limit();

-- Décrémente le stock d'un produit lors d'une vente (jamais sous 0).
-- Pas de "security definer" : s'exécute avec les droits de l'appelant, donc la policy RLS
-- "products: owner all" s'applique normalement (un utilisateur ne peut décrémenter que son stock).
create or replace function public.decrement_product_stock(p_product_id uuid, p_quantity int)
returns void as $$
begin
  update products
  set stock = greatest(0, stock - p_quantity)
  where id = p_product_id;
end;
$$ language plpgsql;

-- Convertit tous les prix d'un utilisateur (produits, commandes, lignes de commande)
-- en multipliant par un facteur, lors d'un changement de devise du compte.
-- Pas de "security definer" : s'exécute avec les droits de l'appelant, donc les policies RLS
-- "products: owner all" / "orders: owner all" / "order_items: owner all" s'appliquent normalement.
create or replace function public.convert_user_currency(p_user_id uuid, p_factor numeric)
returns void as $$
begin
  update products
  set price = round(price * p_factor, 2)
  where user_id = p_user_id;

  update orders
  set total = round(total * p_factor, 2)
  where user_id = p_user_id;

  update order_items
  set unit_price = round(unit_price * p_factor, 2)
  where order_id in (select id from orders where user_id = p_user_id);
end;
$$ language plpgsql;

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
