# Hyperframes Composition Brief: Boutik — Import Excel & Relance WhatsApp

## Objective
A short explainer video showing exactly how two Boutik features work: Excel stock import, and one-tap WhatsApp payment reminders.

## Output
- Composition directory: `brag-output-2026-09-17-171629/composition/`
- Rendered video: `brag-output-2026-09-17-171629/brag.mp4`
- Format: vertical — 1080x1920
- Duration: 19 seconds

## Source Material
- Project root: `C:\Users\antho\Desktop\Boutik\BOUTIK`
- Primary files read: `app/app/produits/import/page.tsx`, `components/ExcelUploader.tsx`, `components/ProductTable.tsx`, `app/app/relances/page.tsx`, `lib/whatsapp.ts`
- Product name: Boutik
- Copy that must appear verbatim:
  - "Importer mon stock"
  - "Choisir un fichier Excel (.xlsx)"
  - "Enregistrer" (button, with a count)
  - "Relancer un client qui n'a pas payé" (bridge card, our own label for this scene)
  - "Impayé depuis 6 jours"
  - "Relancer"
  - The real relance message from `relanceMessage()`: "Bonjour Aïcha, petit rappel concernant votre commande de 15 000 FCFA qui reste impayée. Merci de bien vouloir régler dès que possible 🙏"

## Creative Direction
- Tone preset: app-store
- Creative direction: two-step tutorial, clean and confident, no jokes
- Interpretation: smooth reveals, short readable step labels, restrained motion — reads as a product demo
- Angle: show exactly how each feature works end-to-end, using real UI and real copy
- Hook: "2 trucs qui font gagner du temps"
- Outro: "Importe. Vends. Relance. Tout depuis ton téléphone."
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - A "launch hype" climax transition — this is calm explainer content

## Visual Identity
- Background: `#f9fafb` for UI scenes; `#127847` → `#124e32` green gradient for label/outro cards
- Text: `#111827` on light scenes, white on green scenes
- Accent: `#1cb96c` / `#127847`
- Font: system-ui, bold weights
- Visual references: rounded-2xl white cards, dashed upload box, pill buttons, WhatsApp-green chat bubble for the message reveal

## Storyboard
Use the storyboard in `brag-plan.md` as the creative contract.

Scene summary:
1. Hook — 2.2s — "2 trucs qui font gagner du temps"
2. Import: pick file — 3.5s — upload box, simulated tap, loading state
3. Import: preview & save — 4s — parsed table, one row corrected, save confirmed
4. Bridge — 1.6s — "Relancer un client qui n'a pas payé"
5. Relance: tap & message reveal — 5.2s — unpaid client card, tap Relancer, real message bubble
6. Outro — 2.5s — logo lockup + "Importe. Vends. Relance. Tout depuis ton téléphone."

## Audio
- Audio role: warm, low, steady bed — explainer not hype
- Audio arc: soft fade in, flat through both demos, gentle fade out — no swells anywhere
- Music: bundled `happy-beats-business-moves` track, kept at a lower ceiling than a launch video
- Music treatment: no beat-locking required; clarity over rhythm
- Audio-reactive treatment: none
- Audio-coupled moments:
  - Scene 2 file picked — soft tick
  - Scene 3 save tap — confirm tick
  - Scene 5 relance tap — soft tick
  - Scene 5 message bubble arrival — one distinct, restrained tone
- SFX selection guidance: sparse, low high-frequency-risk sounds; no dense sequences
- Exact SFX choice: Hyperframes chooses filenames/timestamps based on the implemented animation
- Audio files: copy chosen music/SFX into `composition/assets/`

## Hyperframes Instructions
Load `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli` domain skills. Follow native Hyperframes conventions (multi-scene crossfade transitions per `hyperframes-animation/transitions`, spring/power3 entrances, no bouncy `back.out` as a default).

Requirements:
- Show real UI/copy from both features — this is the entire point of the video.
- Keep all text readable; scenes with more copy (the message bubble) need enough settled hold time.
- Keep total duration 15-25s.
- Every scene uses a transition (crossfade is the primary here — calm, explainer tone). No bold "zoom-through" climax this time; nothing in this content needs a launch-style hit.
- Include the planned low, steady music bed and sparse SFX.
- Run `hyperframes check` before render — it is brag's single gate.
