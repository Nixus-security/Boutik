# Hyperframes Composition Brief: Boutik

## Objective
Create a short launch-style brag video for Boutik.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: vertical — 1080x1920
- Duration: 18 seconds

## Source Material
- Project root: `C:\Users\antho\Desktop\Boutik\BOUTIK`
- Primary files read: `app/app/produits/page.tsx`, `app/app/produits/nouveau/page.tsx`, `app/app/catalogue/page.tsx`, `app/api/catalogue/image/route.tsx`, `app/page.tsx`, `tailwind.config.ts`, `app/layout.tsx`
- Product name: Boutik
- Tagline / strongest claim: "Gère ta boutique WhatsApp en 2 minutes par jour."
- Key UI or visual moment to recreate: the generated catalogue image — rounded green product cards (photo chip, name, price) inside a phone-shaped "story" preview, built live from `app/api/catalogue/image/route.tsx`
- Copy that must appear verbatim:
  - "Vide."
  - "Ajouter un produit"
  - "Notre catalogue"
  - "Commande directement sur WhatsApp"
  - "Gère ta boutique WhatsApp en 2 minutes par jour."

## Creative Direction
- Tone preset: default
- Creative direction: a small shop owner's empty stock quietly turning into a sellable WhatsApp catalogue, no drama, just satisfying speed
- Interpretation: playful but not silly — clean cuts, confident pacing, the brand's own green carries the energy instead of jokes or chaos
- Angle: speed and simplicity — empty list to finished, shareable catalogue in one unbroken flow
- Hook: empty "Mes produits" screen, word "Vide." slams in
- Outro / punchline: catalogue fills the frame, WhatsApp share tapped, cut to wordmark + tagline
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: `#f9fafb` (app gray-50) for UI scenes; brand green gradient (`#1cb96c` → `#127847`) for the catalogue preview scene; `#0a0a0a`/near-black for the outro card
- Text: `#111827` (gray-900) on light scenes, white on green/dark scenes
- Accent: `#1cb96c` (brand-500), deep accent `#127847` (brand-700)
- Display font: Baloo 2 (rounded, bold, brand's real font) — fallback `system-ui, sans-serif`
- Body font: same, Baloo 2 / system-ui
- Visual references from the project: rounded-2xl white cards with soft borders (`components/ui/Card.tsx`), pill-shaped primary buttons (brand-500 fill, white text), the storefront + chat-bubble logo mark (green, from `public/logo-icon.png`)

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Empty state — 2.5s — empty "Mes produits" list + "Vide." slam-in
2. Add product with photo — 4s — photo tile fills, name/price type in, Enregistrer tapped
3. Catalogue builds live — 6s — green story preview, cards arrive one by one, "Chez Fatou" header settles
4. Share to WhatsApp — 3.5s — full catalogue fills frame, share button tapped, confirm flash
5. Outro — 2s — cut to black, wordmark + tagline

## Audio
- Audio role: warm bed with light motion-matched accents
- Audio arc: soft entrance under the hook, gentle rise through the catalogue-build scene, fade to quiet under the outro
- Music: bundled `happy-beats-business-moves` track (pick one instrumental, upbeat, commerce-appropriate; avoid the busiest/most cluttered volume)
- Music treatment: low under scene 1, natural level through scenes 2-4, fade out during scene 5 — no swell on the logo
- Music cue guidance: use the bundled preset cues if present for this track; target one strong cue near the start of scene 3 (catalogue reveal) and one near the start of scene 4 (share payoff); card arrivals in scene 3 should snap to alternating beats, not every beat
- Audio-reactive treatment: subtle — the catalogue card grid's entrance stagger may lightly track beat strength; nothing else reacts to audio
- Audio-coupled moments:
  - Scene 2 photo tile fill — soft interface/shutter tick
  - Scene 2 name typing — light key ticks
  - Scene 3 card arrivals — soft card-place SFX per card, alternating beats
  - Scene 4 share tap — one clean confirm tone
- SFX selection guidance: pick low high-frequency-risk sounds for repeated moments (card arrivals); one clear but restrained confirm tone on the share tap; no sound on the outro card
- SFX analysis guidance: use `skills/brag/assets/sfx/sfx-analysis.md` if present when selecting exact files
- Exact SFX choice: Hyperframes chooses filenames, timestamps, density, and volume based on the implemented animation
- Audio files: copy the chosen music and any selected SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core` (composition contract + `data-*` timing), `hyperframes-animation` (motion), `hyperframes-creative` (design spec, beats, audio-reactive), `hyperframes-keyframes` (seek-safe keyframes), and `hyperframes-cli` (lint/check/render). /brag is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project.
- Keep all text readable in the final render.
- Keep the video within 15-25 seconds.
- Include the planned music/SFX layer unless audio was explicitly disabled or documented as intentionally silent.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints. Hyperframes decides exact animation timing and should ignore cues that hurt readability, scene pacing, or the product story.
- Major reveals may move toward nearby strong cues within about 0.15s. Smaller entrances may align to nearby beat points within about 0.10s. Use only 1-3 strong cue locks in this video.
- Use SFX to support motion and interaction: card sounds for card-like reveals, short announcement cues for major payoffs, key/click sounds for text or user actions, and restraint when the edit is already busy.
- Honor planned music treatment such as fade-outs, ducking, beat-aligned reveals, or letting a final SFX ring over the music, using the best Hyperframes-supported implementation.
- When music is present and the treatment is not `none`, consider the Hyperframes audio-reactive workflow: extract audio data and use RMS/frequency bands for subtle, brand-specific motion. Good targets are glow, depth, background warmth, card presence, title emphasis, or other existing visual elements. Avoid waveform/equalizer visuals, musical-note graphics, generic particle systems, strobing, or heavy pulsing.
- Use local assets for audio and any required runtime/media dependencies when possible.
- Run `hyperframes check` before render — it is brag's single gate.
