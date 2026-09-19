# Brag Plan: Boutik

## What is this app?
Boutik turns a small shop owner's stock into a shareable WhatsApp catalogue image, with orders and unpaid-client reminders — no website, no POS, just a phone and 2 minutes a day.

## The angle
The whole pitch is speed: empty product list → real catalogue with photos and prices, ready to paste into a WhatsApp status, in one unbroken flow. No dashboard tour, no feature grid — just watch the catalogue build itself in front of you.

## Hook (first 2-3 seconds)
Hard cut to a phone screen: an empty "Mes produits" list, one word on screen — "Vide." (Empty.) — then it starts filling.

## Key moments (the middle)
- A product card gets added with a real photo (the bracelet/product photo drops into the little thumbnail slot).
- Cut to the Catalogue tab: the live preview panel rebuilds in real time — green cards stacking in with name + price, one by one.
- The "Boutik" business name burns into the catalogue header (this is the exact real bug we shipped this session — business name flowing from account settings into the generated image).

## Outro / punchline
Catalogue image fills the frame, then the WhatsApp share button gets tapped — cut to black on the wordmark: "Boutik." + tagline card.

## User flow worth showing
1. Entry: produits list, one empty state.
2. Key action: add a product with a photo → switch to Catalogue tab, cards populate live.
3. Result: finished catalogue card, "Partager sur WhatsApp" tapped.

## Tone
- Preset: default
- Creative direction: a small shop owner's stock quietly turning into a sellable catalogue, no drama, just satisfying speed
- Interpretation: playful but not silly — clean cuts, confident pacing, the product's own green brand carries the energy instead of jokes or chaos.

## Format: vertical — 1080x1920
## Duration: 18s

## Visual identity (from the project)
- Background: `#f9fafb` (gray-50 app background) / catalogue bg gradient uses brand green tones
- Accent: `#1cb96c` (brand-500), deep accent `#127847` (brand-700)
- Text: `#111827`-ish (gray-900 headings), white on green cards
- Display font: Baloo 2 (rounded, bold — used app-wide including body)
- Body font: Baloo 2 (system-ui fallback stack)
- Strongest visual element: the generated catalogue card grid (rounded green cards, product photo chip, name, price) from `app/api/catalogue/image/route.tsx`

## Share copy (draft)
Ton stock devient un catalogue WhatsApp prêt à vendre, en quelques secondes.

## Audio direction
- Role: warm bed with light motion-matched accents
- Music: bundled `happy-beats-business-moves` track (upbeat, commerce-appropriate)
- Music treatment: starts under the hook at low volume, rises slightly into the catalogue-build scene, fades under the outro line
- Music cue guidance: use bundled preset cues if present; target 1 strong cue for the "product card added" moment and 1 for the catalogue-complete reveal; card-by-card catalogue reveal should snap to alternating beats, not every beat, to stay readable
- Audio-reactive treatment: subtle — the catalogue card grid's entrance stagger may lightly track beat strength, nothing else
- SFX posture: moderate — a soft card/chip-place sound per catalogue card arriving, one confirm tone on WhatsApp share
- Audio-coupled moments: catalogue cards arriving one by one (card-place SFX), photo drop into the product thumbnail (soft interface sound)
- Restraint rule: no music swell or sting on the outro logo card — let it land quiet

## Storyboard

### Scene 1 — Empty state — 2.5s
Phone-framed screen: "Mes produits" header, product count "0", empty state illustration + "Aucun produit pour l'instant." Word "Vide." slams in big over it.
Sequential/interaction: none
Audio intent: quiet anticipation, music bed fades in
Audio-coupled idea: none
Music: soft upbeat bed entering
Transition mood: clean → Scene 2

### Scene 2 — Add product with photo — 4s
"Ajouter un produit" form: photo tile fills with a real product photo (simulated tap on "Ajouter une photo"), name field types "Bracelet perles", price "5000" appears, Enregistrer button taps.
Sequential/interaction: yes — simulate: tap photo tile → photo fills → text types into name field → tap Enregistrer
Audio intent: satisfying, tactile
Audio-coupled idea: soft shutter/interface tick when photo fills; key ticks while name types
Transition mood: clean wipe → Scene 3

### Scene 3 — Catalogue builds live — 6s
Cut to Catalogue tab. Green story-format preview panel. Product cards stack in one by one (3-4 cards), each with photo chip, name, price — last one is the bracelet just added, business name "Chez Fatou" burns into the header above "Notre catalogue."
Sequential/interaction: yes — cards arrive one by one, business name text settles after
Audio intent: build, momentum
Audio-coupled idea: card-place SFX per card arrival, snapped to alternating beats
Music: bed rises slightly
Transition mood: soft wipe → Scene 4

### Scene 4 — Share to WhatsApp — 3.5s
Full catalogue image fills frame. Cursor/finger taps "Partager sur WhatsApp." Brief confirm flash.
Sequential/interaction: yes — simulate tap on share button
Audio intent: payoff, clean confirm
Audio-coupled idea: one confirm tone on tap
Transition mood: hard cut → Scene 5

### Scene 5 — Outro — 2s
Cut to black. Boutik wordmark (green, storefront+chat icon) + line: "Gère ta boutique WhatsApp en 2 minutes par jour."
Sequential/interaction: none
Audio intent: quiet landing, no swell
Audio-coupled idea: none
Music: fades out under this scene
Transition mood: hard cut (end)

**Music mood for this video:** upbeat, warm, commerce-appropriate — not corporate-generic
**Audio summary:** A soft upbeat bed carries the whole video, rising gently as the catalogue builds and fading to quiet under the wordmark outro; light card-place and interface SFX mark each product/catalogue-card arrival without ever crowding the visuals.
