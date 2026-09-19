# Graph Report - BOUTIK  (2026-09-17)

## Corpus Check
- Corpus is ~24,574 words - fits in a single context window. You may not need a graph.

## Summary
- 350 nodes · 726 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.8)
- Token cost: 387,595 input · 0 output

## Community Hubs (Navigation)
- App Shell & Marketing Pages
- App Feature Page Shells
- Project Dependencies
- Catalogue Image Generation
- Dashboard & Orders Data
- Form Handlers & Actions
- Catalogue & Import Handlers
- Anti-Vibecoding Design Directives
- TypeScript Config
- Excel Import Pipeline
- Supabase Auth Middleware
- Brand Icon Mark (logo-icon)
- Next.js Security Headers
- Brand Logo (Transparent PNG)
- Brand Logo (Full)
- Brand Logo (JPEG)
- App Icon Mark

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 25 edges
2. `react` - 21 edges
3. `isDemo()` - 19 edges
4. `compilerOptions` - 16 edges
5. `formatPrice()` - 13 edges
6. `Boutik` - 13 edges
7. `listProducts()` - 12 edges
8. `CataloguePage()` - 11 edges
9. `ComptePage()` - 9 edges
10. `RelancesPage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Tailwind CSS` --semantically_similar_to--> `Tailwind CSS`  [INFERRED] [semantically similar]
  CLAUDE.md → README.md
- `Anti-AI Slop Copywriting Directives` --conceptually_related_to--> `Boutik`  [INFERRED]
  CLAUDE.md → README.md
- `CataloguePage()` --calls--> `listProducts()`  [EXTRACTED]
  app/app/catalogue/page.tsx → lib/data/products.ts
- `CataloguePage()` --calls--> `getAccount()`  [EXTRACTED]
  app/app/catalogue/page.tsx → lib/data/profile.ts
- `CataloguePage()` --calls--> `formatPrice()`  [EXTRACTED]
  app/app/catalogue/page.tsx → lib/format.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Boutik Technology Stack** — readme_nextjs, readme_tailwind_css, readme_supabase, readme_vercel_og, readme_sheetjs_xlsx [EXTRACTED 1.00]
- **Boutik Project-Wide Directive Sections** — claude_anti_vibecoding_ui_directives, claude_anti_ai_slop_copywriting_directives, claude_devsecops_security_directives, claude_accessibility_ux_directives, readme_boutik [INFERRED 0.85]

## Communities (18 total, 2 thin omitted)

### Community 0 - "App Shell & Marketing Pages"
Cohesion: 0.06
Nodes (34): app_globals, planLabels, baloo, metadata, viewport, LandingPage(), metadata, Plan (+26 more)

### Community 1 - "App Feature Page Shells"
Cohesion: 0.12
Nodes (26): LineItem, CommandesPage(), FILTERS, planLabels, Avatar(), colorFor(), PALETTE, Button (+18 more)

### Community 2 - "Project Dependencies"
Cohesion: 0.05
Nodes (40): dependencies, next, react, react-dom, sharp, @supabase/ssr, @supabase/supabase-js, @vercel/og (+32 more)

### Community 3 - "Catalogue Image Generation"
Cohesion: 0.10
Nodes (25): formatPrice(), POST(), runtime, BORDER_IDS, Format, SHAPE_IDS, THEME_IDS, BorderId (+17 more)

### Community 4 - "Dashboard & Orders Data"
Cohesion: 0.11
Nodes (22): DashboardPage(), DemoBanner(), labels, StatusBadge(), styles, listOrders(), NewOrderInput, DemoProfile (+14 more)

### Community 5 - "Form Handlers & Actions"
Cohesion: 0.14
Nodes (24): NouvelleCommandePage(), handleSubmit(), ComptePage(), handleLogout(), handlePasswordSubmit(), handleProfileSubmit(), AppLayout(), handleLogout() (+16 more)

### Community 6 - "Catalogue & Import Handlers"
Cohesion: 0.11
Nodes (17): CataloguePage(), handleLogoChange(), handleShare(), ImportPage(), handleSave(), NouveauProduitPage(), handlePhotoChange(), handleSubmit() (+9 more)

### Community 7 - "Anti-Vibecoding Design Directives"
Cohesion: 0.09
Nodes (24): Extended Design, UX & Accessibility Directives, Anti-AI Slop Copywriting Directives, Anti-Vibecoding UI & Design Directives, DevSecOps Security Directives, DOMPurify, Horizontal Scrolling Prohibition, prefers-reduced-motion, React (+16 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Excel Import Pipeline"
Cohesion: 0.26
Nodes (11): ExcelUploader(), handleFile(), IconClose(), IconUpload(), ProductTable(), COLUMN_ALIASES, matchColumn(), normalizeHeader() (+3 more)

### Community 10 - "Supabase Auth Middleware"
Cohesion: 0.27
Nodes (6): updateSession(), config, middleware(), ref_next_headers, ref_next_server, @supabase/ssr

### Community 11 - "Brand Icon Mark (logo-icon)"
Cohesion: 0.70
Nodes (5): Boutik (small-business app brand), Flat, single-color (dark green), minimalist vector icon style, Boutik icon-only logo mark (green shop + chat bubble hybrid glyph), Speech/chat bubble silhouette motif, Storefront/shop awning silhouette motif

### Community 12 - "Next.js Security Headers"
Cohesion: 0.40
Nodes (3): csp, nextConfig, securityHeaders

### Community 13 - "Brand Logo (Transparent PNG)"
Cohesion: 0.60
Nodes (5): Boutik logo (transparent PNG), Single solid forest/pine green brand color (no gradient) on transparent background, Shop-and-chat pictorial mark (storefront awning fused with a speech bubble with three dots), Concept: small-business storefront + customer messaging/chat, visually merged into one icon, "Boutik" wordmark, bold rounded sans-serif, solid forest-green fill

### Community 14 - "Brand Logo (Full)"
Cohesion: 0.60
Nodes (5): logo-full.png (Boutik full brand logo asset), Brand concept: small local shop/storefront combined with messaging/chat, implying a shop-plus-communication (order/chat) product for small businesses, Monochrome dark forest-green (#1E6B4F-ish) on white/transparent background color scheme, Storefront + speech-bubble icon mark (storefront/awning shape merged with a chat bubble containing three dots, flat green silhouette, no outline/gradient), "Boutik" wordmark set in a bold, rounded, geometric sans-serif typeface below the icon

### Community 15 - "Brand Logo (JPEG)"
Cohesion: 1.00
Nodes (3): Boutik (small-business app brand identity), Boutik logo mark (shop awning + chat bubble icon), "Boutik" wordmark, bold rounded sans-serif, dark green

## Ambiguous Edges - Review These
- `Supabase` → `Mode Démo (Demo Mode)`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to

## Knowledge Gaps
- **109 isolated node(s):** `runtime`, `Format`, `THEME_IDS`, `SHAPE_IDS`, `BORDER_IDS` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 142 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Supabase` and `Mode Démo (Demo Mode)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `react` connect `App Feature Page Shells` to `App Shell & Marketing Pages`, `Project Dependencies`, `Catalogue Image Generation`, `Dashboard & Orders Data`, `Excel Import Pipeline`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `next` connect `App Shell & Marketing Pages` to `Project Dependencies`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `runtime`, `Format`, `THEME_IDS` to the rest of the system?**
  _109 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Shell & Marketing Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.055904961565338925 - nodes in this community are weakly interconnected._
- **Should `App Feature Page Shells` be split into smaller, more focused modules?**
  _Cohesion score 0.1202020202020202 - nodes in this community are weakly interconnected._
- **Should `Project Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._