---
name: webdev
description: Montreal Cigar Club website — preview index.html locally, build features (pairing engine, telemetry, audio, FR/EN, modals, RSVP, membership tiers) and fix bugs. Use when the user runs /webdev.
---

# Web Development

Develop and debug the Montreal Cigar Club website.

## Site Architecture

| File | Role |
|------|------|
| `index.html` | Single-page site: Tailwind play CDN + inline `tailwind.config`, Lucide, Google Fonts; concierge bar (telemetry, audio, FR/EN, Members), hero, vitola dossier cards, pairing harmonizer, RSVP, membership tiers, vault login modal |
| `styles.css` | Design tokens (`--bg-obsidian`, `--gold-primary`, …), typography classes, eq-bar animation |
| `app.js` | `initPairingEngine`, `initHumidorTelemetry`, `initAudioPlayer`, `initLanguageToggle`, `initModals`, `openModal` |

Known issue: `index.html` is saved as UTF-16 (likely PowerShell `Out-File`). Convert to UTF-8 (no BOM) before deploy — browsers cope, but grep/Python tooling and Cloudflare Pages text handling expect UTF-8.

## Usage Patterns

1. **`/webdev`** — Status: file encoding, console errors, missing assets, open issues
2. **`/webdev check`** — Validate `index.html`: UTF-8 encoding, unique IDs, every `data-en` has a `data-fr`, all `getElementById` targets in `app.js` exist, no root JPGs linked
3. **`/webdev run`** — `python -m http.server 8080`, open in the browser, check console for errors, screenshot
4. **`/webdev <feature or bug>`** — Implement or fix what the user describes

## Development Standards

1. **`index.html` is the source.** Edit it directly; keep structure sectioned with HTML comments so it stays navigable.
2. **Tailwind play CDN is for prototyping.** Before production deploy, either accept the CDN (with the console warning) or add a Tailwind CLI build — ask the user; don't switch unilaterally.
3. **Bilingual by construction.** Every visible string gets `data-en` and `data-fr`. French copy must be real French, not machine-literal — see `/branding`.
4. **Images from `assets/` only.** Root JPGs are ~1 MB originals; produce resized WebP/JPG (≤ 300 KB, with `width`/`height` and `alt`) into `assets/`.
5. **Responsive + accessible.** Mobile-first, semantic landmarks, focus states on gold buttons, `prefers-reduced-motion` for the eq-bar/telemetry animations, modals trap focus and close on Esc.
6. **Audio never autoplays.** The vinyl player starts only on user click (browser policy + etiquette).
7. **No secrets client-side.** RSVP/login/email go through a Pages Function or Worker (`/deploy` covers this). `secrets/` is off-limits.
8. **Age gate + no health claims.** Tobacco marketing rules apply (see `CLAUDE.md` rule 4).

## Debugging Workflow

1. Reproduce in the browser (local server, DevTools console + network)
2. Read the relevant `index.html` / `app.js` section before hypothesizing
3. Fix root cause
4. Re-verify in the browser; for non-obvious bugs use the debugger agent
