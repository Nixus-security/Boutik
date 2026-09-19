# Boutik

MVP d'une application web pour les micro-entrepreneurs qui vendent via WhatsApp (Côte d'Ivoire,
Sénégal, Gabon, Congo…). Importe ton stock Excel, génère ton catalogue en quelques secondes,
suis tes commandes et relance tes clients qui n'ont pas payé.

## Stack

- **Next.js 14** (App Router) + **Tailwind CSS**
- **Supabase** (base de données Postgres + authentification email/mot de passe)
- **@vercel/og** pour générer les images de catalogue (format Statut 9:16 et catalogue classique)
- **SheetJS (xlsx)** pour parser les fichiers Excel

## Lancer le projet en local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer un projet Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécute le contenu de [`supabase/schema.sql`](supabase/schema.sql) pour
   créer les tables (`profiles`, `products`, `orders`, `order_items`) et les règles de sécurité
   (Row Level Security : chaque utilisateur ne voit que ses propres données).
3. Dans **Project Settings > API**, récupère l'URL du projet et la clé `anon public`.

### 3. Configurer les variables d'environnement

Copie `.env.local.example` en `.env.local` et renseigne tes valeurs Supabase :

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Mode démo

Le bouton **"Tester sans compte"** sur la page d'accueil active un mode démo : des produits et
commandes d'exemple sont chargés dans le navigateur (`localStorage`), sans connexion à Supabase
ni création de compte. Utile pour montrer l'app sans configuration.

## Structure du projet

```
app/
  page.tsx                 Landing page
  connexion/ inscription/  Authentification Supabase
  app/                      Espace connecté (protégé par middleware)
    page.tsx                Tableau de bord
    produits/                Liste + import Excel
    catalogue/                Génération d'image de catalogue
    commandes/                 Suivi commandes + paiements
    relances/                   Clients à relancer
  api/catalogue/image/         Génération d'image via @vercel/og (edge runtime)
components/                 Composants UI réutilisables
lib/
  supabase/                 Clients Supabase (navigateur, serveur, middleware)
  data/                     Accès aux données (products, orders) — bascule auto démo/réel
  demo.ts                   Données et stockage du mode démo
  excel.ts                  Parsing des fichiers .xlsx
supabase/schema.sql         Schéma de base de données + policies RLS
```

## Ce qui n'est PAS encore fait (volontairement, prochaine étape)

- Intégration WhatsApp Cloud API (pour l'instant : liens `wa.me` + Web Share API)
- Intégration Mobile Money (pour l'instant : statut de paiement saisi manuellement)
- Upload de photos produit (le champ `photo_url` existe en base mais pas d'UI d'upload)

## Déploiement

Le projet est prêt pour un déploiement sur [Vercel](https://vercel.com) : connecte le repo,
renseigne les mêmes variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`) dans les paramètres du projet Vercel, puis déploie.
