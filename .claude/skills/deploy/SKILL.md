---
name: deploy
description: Deploy the Montreal Cigar Club site to Cloudflare Pages, attach montrealcigarclub.ca + mtlcigarclub.ca (Cloudflare Registrar), set the 301 redirect, Email Routing, and Pages Functions for RSVP. Use when the user runs /deploy.
---

# Deploy

Ship the static site to Cloudflare Pages and manage domains.

## Instructions

When the user runs `/deploy`, load the `wrangler` skill (and `cloudflare` / `workers-best-practices` if writing Functions) before running any Cloudflare command — do not rely on memorised CLI syntax.

### Usage Patterns

1. **`/deploy`** — Pre-flight checklist (below) and current deployment status
2. **`/deploy preview`** — Build `index.html` and `wrangler pages deploy` to a preview branch
3. **`/deploy prod`** — Deploy to production after the checklist passes and the user confirms
4. **`/deploy domain`** — Attach `montrealcigarclub.ca` (primary) to the Pages project; add Redirect Rule `https://mtlcigarclub.ca/* → https://montrealcigarclub.ca/$1` (301); set up Email Routing for `concierge@`, `admissions@`, `vault@`. Both domains are already on Cloudflare Registrar (bought 2026-08-29) — no external nameserver changes needed
5. **`/deploy function <name>`** — Scaffold a Pages Function (`functions/api/<name>.js`) for RSVP or contact email, using **Cloudflare Email Service** (load `cloudflare-email-service` skill) with secrets bound via `wrangler pages secret put`, never inlined

### Pre-flight Checklist

- [ ] `index.html` saved as UTF-8 (no BOM)
- [ ] No references to `secrets/`, no API keys in any HTML/JS/CSS (`grep -ri "key\|token\|secret" *.html app.js`)
- [ ] All image paths resolve to `assets/`; no 1 MB root JPGs linked
- [ ] Every `data-en` has a matching `data-fr`
- [ ] Age gate present; no health/lifestyle-benefit claims
- [ ] Page loads with zero console errors on a local server
- [ ] `_headers` file with sensible security headers (CSP allowing Tailwind CDN, Lucide, Google Fonts; `X-Frame-Options`, `Referrer-Policy`)
- [ ] Redirect `mtlcigarclub.ca` → `montrealcigarclub.ca` verified with `curl -I`

### Authentication

Cloudflare and GitHub tokens live in `secrets/` and **must never be read or printed**. Run every wrangler / gh command through the helper, which injects them as env vars for that process only:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/with-secrets.ps1 npx wrangler whoami
powershell -ExecutionPolicy Bypass -File scripts/with-secrets.ps1 npx wrangler pages deploy . --project-name montrealcigarclub
gh repo create montrealcigarclub --private --source . --push   # gh keyring login (kinnor) works; add -GitHub to the helper only once the secrets/ token is refreshed
```

Verified 2026-08-29: `wrangler whoami` via the helper authenticates to the Cloudflare account (User API Token). The GitHub token file was invalid at that time.

If a token is missing or rejected, report the tool's error and ask the user to check the file in `secrets/` — do not open it yourself.

### Rules

- Production deploys and DNS changes are outward-facing: always confirm with the user first
- Record the Pages project name, production URL, and domain status in `memories.md` after each deploy
- If a deploy fails, show the exact wrangler output — never summarise it as "deployed"
