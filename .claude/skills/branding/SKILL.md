---
name: branding
description: Montreal Cigar Club brand system — palette, typography, logo usage, bilingual EN/FR copy and voice, image asset preparation. Use when the user runs /branding.
---

# Branding

Keep the site, flyers, and copy consistent with the club's identity.

## Brand System

| Element | Spec |
|---------|------|
| Concept | Midnight Obsidian — near-black ground, 24K brushed-gold accents, emerald status highlights |
| Palette | `--bg-obsidian #07080a`, `--bg-card #0e1015`, `--gold-primary #d4af37`, `--gold-light #f5df95`, `--gold-dark #99751e`, `--amber-glow #e5a93c`, muted text `#94a3b8` (source of truth: `styles.css` `:root`) |
| Typography | Cinzel (display / headings), Cormorant Garamond (editorial serif), Plus Jakarta Sans (UI/body) |
| Logos | `Montreal_Cigar_Club_Logo_Royal_Gold.jpg` (primary crest), `Montreal_Cigar_Club_Logo_Emerald_Seal.jpg` (secondary seal) |
| Motifs | Crossed cigars, fleur-de-lis crown, Mount Royal / Notre-Dame skyline, vinyl & jazz |
| Names | **Montreal Cigar Club** (EN) / **Club de Cigare de Montréal** (FR); short form MTL Cigar Club |

## Voice

- Understated luxury: confident, warm, never loud. No exclamation marks in site copy.
- Montreal-proud: reference the city (Mount Royal, Plateau, Oscar Peterson) rather than generic "elite lifestyle" tropes.
- French is a first-class language, not a translation pass. Use Quebec-appropriate French (e.g. « dégustation », « humidor », « fumoir »), typographic apostrophes and « guillemets ».
- No health, relaxation, or status-benefit claims about tobacco (regulated). Talk craft, provenance, pairing, company.

## Usage Patterns

1. **`/branding copy <section>`** — Write or polish EN + FR copy for a section; return both languages side by side, ready for `data-en` / `data-fr`
2. **`/branding review`** — Audit fragments and `styles.css` for off-palette colours, wrong fonts, missing FR, tonal drift
3. **`/branding assets`** — Produce web-ready images into `assets/` from the root JPGs (resize ≤ 1600 px wide, WebP + JPG fallback, ≤ 300 KB, favicon set from the crest)
4. **`/branding flyer <event>`** — Draft an event flyer brief (or use the `design` skill) matching the existing `Montreal_Cigar_Club_Event_Advertisement.jpg`

## Rules

- Never introduce a new colour outside the palette without adding it to `styles.css` `:root` and noting why
- Any new user-facing text ships in both languages or not at all
- Log brand decisions (logo choice, tagline, domain redirect direction) with `/remember`
