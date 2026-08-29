# CLAUDE.md — Montreal Cigar Club

Private members' cigar club in Montreal, Quebec (*Club de Cigare de Montréal*). This folder holds the brand assets, the research record, and the club website.

## Project Layout

| Path | Purpose |
|------|---------|
| `README.md` | Master project record — brand assets, domain strategy, cigar portfolio, sourcing/tax research, audio setup |
| `index.html` | The site — single page: concierge bar (telemetry, audio, FR/EN, Members), hero, vitola dossier cards, pairing harmonizer, RSVP, membership tiers, vault login modal. **Saved as UTF-16 — should be converted to UTF-8 before deploy.** |
| `styles.css` | Custom design system on top of Tailwind: Midnight Obsidian + 24K gold tokens, Cinzel / Cormorant Garamond / Plus Jakarta Sans |
| `app.js` | Pairing engine (cigar + spirit + jazz), humidor telemetry, vinyl audio player, FR/EN toggle, modals |
| `assets/` | Web-optimized images (currently empty — resize the root JPGs into here, never link the 1 MB originals) |
| `*.jpg` (root) | High-res logos (Royal Gold, Emerald Seal), event flyer, two website concept mockups |
| `secrets/` | API keys and tokens — **never read, print, or commit** (deny rules in `.claude/settings.local.json`, ignored in `.gitignore`). Consumed only via `scripts/with-secrets.ps1` |
| `scripts/with-secrets.ps1` | Runs a command with `CLOUDFLARE_API_TOKEN` / `GH_TOKEN` loaded from `secrets/` (values never displayed) |
| `memories.md` | Session memories saved via `/remember` |

## Tech Stack

- Static site, no bundler. Tailwind via play CDN (`cdn.tailwindcss.com`, config inline in `index.html`), Lucide icons via CDN, Google Fonts.
- Chosen visual concept: **Midnight Obsidian** (`Website_Concept_2_Midnight_Obsidian.jpg`).
- i18n: every user-facing string carries `data-en` / `data-fr`; `initLanguageToggle()` swaps them. New text must include both.
- Domains (purchased 2026-08-29, Cloudflare Registrar): **`montrealcigarclub.ca`** (primary), **`mtlcigarclub.ca`** and **`mtlcigarclub.com`** (both 301 redirect to primary; .com added later on 2026-08-29). No `.com` owned. Hosting: Cloudflare Pages; email via Cloudflare Email Routing (`concierge@`, `admissions@`, `vault@`). Preview locally with `python -m http.server 8080`.
- Cloudflare and GitHub tokens live in `secrets/` (user-authorised for tool access 2026-08-29). **Never read or print them.** Run tools through `scripts/with-secrets.ps1`, which loads them as env vars for the child process only:
  `powershell -ExecutionPolicy Bypass -File scripts/with-secrets.ps1 npx wrangler whoami`
  GitHub: `gh` is already logged in via keyring (account `kinnor`) — use it directly. The token in `secrets/rossen-kinov-git-hub-key.txt` was rejected by GitHub on 2026-08-29; pass `-GitHub` to the helper only after the user refreshes it.
- No git repo yet. If one is initialised, `secrets/` must stay ignored.

## Skills

| Skill | Use |
|-------|-----|
| `/webdev` | Site work — preview, features, bugs |
| `/deploy` | Cloudflare Pages deployment, `.ca` domains, redirect, email routing |
| `/branding` | Brand voice, palette, typography, bilingual copy, image assets |
| `/research` | Cigars, Montreal sourcing, Quebec tax / CBSA rules, domains, gear |
| `/remember` `/review` `/verify` | Memory, self-critique, fact-check pipelines |

## MCP Servers

memory (`mcp-montrealcigarclub-memory`), sequentialthinking, fetch, task-orchestrator (`mcp-montrealcigarclub-tasks`), filesystem (read-only mount of this folder).

## Rules

1. Follow the global quality standards (anti-hallucination, confidence levels, evidence before conclusions).
2. Prices, tax rules, and duty exemptions in `README.md` are dated research — re-verify before relying on them.
3. Nothing from `secrets/` may appear in site files, commits, or chat output. Tool access to GitHub/Cloudflare goes through `scripts/with-secrets.ps1` only — never `cat`, `Get-Content`, or echo a token. Any API-backed feature (RSVP form, member login, email) goes through a Cloudflare Worker / Pages Function with secrets bound server-side.
4. Tobacco marketing in Canada/Quebec is regulated (federal Tobacco and Vaping Products Act; Quebec Tobacco Control Act). Keep an age gate, no health or lifestyle-benefit claims, no promotion to minors. Flag anything borderline rather than shipping it.
5. Pairing scores in `app.js` ("99 / 100") are editorial flavour, not data — never cite them as facts.
6. Brand voice: understated luxury, bilingual EN/FR (French is not an afterthought — Quebec's Charter of the French Language applies to commercial sites), Montreal heritage (Mount Royal, fleur-de-lis, Oscar Peterson).
