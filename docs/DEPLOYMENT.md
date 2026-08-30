# Deployment — Cloudflare Pages + Workers

Canonical domain: **montrealcigarclub.ca** · Redirect domains: **montrealcigarclub.com**, **mtlcigarclub.ca**, **mtlcigarclub.com** (301 → canonical)
Both zones are on Cloudflare Registrar, so DNS/SSL/Pages/Workers live in one account.

## Layout

| Path | Purpose |
|------|---------|
| `web_root/` | Static site (Pages build output directory) |
| `web_root/_headers` | Security + cache headers (CSP, HSTS, nosniff, frame-ancestors) |
| `web_root/_redirects` | Clean section routes + legacy asset paths |
| `wrangler.toml` | Pages project config (`montreal-cigar-club`, compat `2026-08-01`) |
| `workers/redirect/` | Worker that 301s `mtlcigarclub.ca/*` and `mtlcigarclub.com/*` → `https://montrealcigarclub.ca/*` |
| `scripts/check-site.mjs` | Pre-deploy integrity check (`npm run check`) |

## 1. Pre-flight

```bash
npm run check          # refs resolve, ids unique, i18n pairs, meta, asset sizes
npm run dev            # http://localhost:8080 — click through, zero console errors
```

## 2. Authenticate wrangler

Either `npx wrangler login`, or run commands through the helper that injects
`CLOUDFLARE_API_TOKEN` from `secrets/` (token value is never printed):

```powershell
powershell -ExecutionPolicy Bypass -File scripts/with-secrets.ps1 npx wrangler whoami
```

## 3. Deploy the site (Pages)

```bash
# first time only
npx wrangler pages project create montreal-cigar-club --production-branch=main

# every release
npx wrangler pages deploy web_root --project-name=montreal-cigar-club
```

Output ends with a `*.pages.dev` URL — verify it before attaching domains.
Pushing to `main` on GitHub can also trigger builds if you connect the repo under
*Workers & Pages → montreal-cigar-club → Settings → Builds* (build command: none, output dir: `web_root`).

## 4. Attach the canonical domain

Dashboard → **Workers & Pages → montreal-cigar-club → Custom domains → Set up a custom domain**

1. Add `montrealcigarclub.ca` — Cloudflare creates the CNAME automatically because the zone is in the same account. Wait for status **Active** (SSL issues in ~1–5 min).
2. Optionally add `www.montrealcigarclub.ca` the same way, then add a Redirect Rule `www → apex` (see §5, same pattern).

## 5. Redirect `mtlcigarclub.ca` / `mtlcigarclub.com` → `montrealcigarclub.ca`

Pages `_redirects` cannot match hostnames, so use **one** of these:

### Option A — Zone Redirect Rule (no code, recommended)

Dashboard → zone **mtlcigarclub.ca → Rules → Redirect Rules → Create rule** (repeat for zone **mtlcigarclub.com**)

| Field | Value |
|-------|-------|
| Name | `mtl → montrealcigarclub.ca` |
| When incoming requests match | Wildcard pattern — Request URL: `https://*mtlcigarclub.ca/*` |
| Then | Dynamic redirect, expression: `concat("https://montrealcigarclub.ca", http.request.uri.path)` (or wildcard target `https://montrealcigarclub.ca/${2}`) |
| Status code | **301** |
| Preserve query string | ✅ |

Prerequisite: the zone needs a **proxied** DNS record so requests reach Cloudflare:
`AAAA  @  100::  (Proxied)` and `AAAA  www  100::  (Proxied)`.

### Option B — Worker (in this repo)

```bash
# same DNS prerequisite as above (proxied placeholder records on mtlcigarclub.ca)
npx wrangler deploy --config workers/redirect/wrangler.toml
```

The Worker binds to routes `mtlcigarclub.ca/*`, `www.mtlcigarclub.ca/*`, `mtlcigarclub.com/*` and `www.mtlcigarclub.com/*`, preserves path + query, and returns 301 with `X-Robots-Tag: noindex`.

### Verify

```bash
curl -I https://mtlcigarclub.ca/pairing?x=1     # same for https://mtlcigarclub.com/
# HTTP/2 301  location: https://montrealcigarclub.ca/pairing?x=1
curl -I https://montrealcigarclub.ca/
# HTTP/2 200  content-security-policy: ...  strict-transport-security: ...
```

## 6. Email routing (optional)

Zone **montrealcigarclub.ca → Email → Email Routing**: enable, add destination address, create
`concierge@`, `admissions@`, `vault@` → forward to the destination. Cloudflare adds the MX/SPF records.

## Rollback

`Workers & Pages → montreal-cigar-club → Deployments → ⋯ → Rollback to this deployment`.

## 7. Forms, storage and the admin endpoint

| Piece | Where |
|-------|-------|
| Membership application → `POST /api/apply` | `functions/api/apply.js` |
| Event RSVP → `POST /api/rsvp` | `functions/api/rsvp.js` |
| Validation, honeypot, per-IP rate limit (5/h), storage, optional email | `functions/_lib.js` |
| Storage | KV namespace `MCC_SUBMISSIONS` (`86439abd…6344`), bound in `wrangler.toml` |
| Read submissions | `GET /api/admin/submissions?kind=apply|rsvp` with `Authorization: Bearer <ADMIN_TOKEN>` |

`ADMIN_TOKEN` is a Pages secret (set 2026-08-29; value in `secrets/mcc-admin-token.txt`). Rotate with:
`wrangler pages secret put ADMIN_TOKEN --project-name=montreal-cigar-club`

Fetch submissions from PowerShell (token read from the file, never echoed):
```powershell
$t = Get-Content secrets/mcc-admin-token.txt -Raw
Invoke-RestMethod -Headers @{ Authorization = "Bearer $t" } "https://montrealcigarclub.ca/api/admin/submissions?kind=apply" | ConvertTo-Json -Depth 5
```

**Email copies (optional):** enable Email Routing on `montrealcigarclub.ca`, verify a destination address, then
uncomment the `[[send_email]]` block and `MAIL_TO` in `wrangler.toml` and redeploy. Without it, submissions are
still stored in KV and readable via the admin endpoint.

## 8. Site features (2026-08-29 rebuild)

- Age gate (18+, Quebec) remembered per device for 30 days (`localStorage`)
- Full FR/EN: `js/i18n.js` dictionary, `data-i18n` attributes, `?lang=fr` deep link, preference persisted
- Sections: Humidor, Pairing Engine (bilingual notes), Events 2026 with RSVP, The Vault, Membership, About & Gallery
- Legal: `privacy.html` (Law 25 / PIPEDA) and `terms.html`, bilingual
- `robots.txt`, `sitemap.xml`, JSON-LD Organization, hreflang

## 9. Email notifications — one-time setup (Cloudflare Email Service)

Pages Functions cannot use the `send_email` binding, so the site calls the Email Sending REST API.

1. **Onboard the sending domain**: Dashboard → *Compute & AI → Email Service → Email Sending → Onboard domain → montrealcigarclub.ca → Add records and onboard* (adds SPF + DKIM automatically).
2. **Receive at `admissions@`** — ✅ DONE 2026-08-29: Email Routing on montrealcigarclub.ca forwards `concierge@`, `admissions@`, `vault@` → rossen.kinov@gmail.com (all Active).
3. **API token**: https://dash.cloudflare.com/profile/api-tokens → Create Token → Custom → permission **Account · Email Sending · Edit** (scope: this account) → copy it → run
   `powershell -ExecutionPolicy Bypass -File scripts/with-secrets.ps1 npx wrangler pages secret put EMAIL_API_TOKEN --project-name=montreal-cigar-club` and paste the token.
4. Redeploy (or the next deploy picks it up). Submit a test application; the record's `mail` field turns from `skipped` to `rest`.

Senders/recipients are set in `wrangler.toml` `[vars]`: `MAIL_TO` (committee inbox) and `MAIL_FROM` (must be on the onboarded domain).

**Gotcha (verified 2026-08-30):** Email Sending returns `10203 email.sending_disabled` when the recipient is an address on a domain that uses Cloudflare Email Routing (e.g. `admissions@montrealcigarclub.ca`). Point `MAIL_TO` at the *verified destination* (the Gmail address) instead — `admissions@` still forwards inbound mail from applicants; the site's notifications simply go to the inbox directly. Status 2026-08-30: token installed, domain onboarded, applicant acknowledgements delivering (`mail: rest`).

## 10. Stripe payments (membership dues) — one-time setup

Architecture mirrors the Accord & Harmony implementation: server-created **Stripe hosted Checkout** sessions,
a **signature-verified webhook**, and payment records — adapted to Pages Functions + KV and Stripe's REST API
(no SDK/build step). Prices live server-side in `functions/_stripe.js` (`DUES`): Cercle $1,850 / Fondateur $4,500 CAD.

| Piece | Where |
|---|---|
| Payment page (bilingual, tier + reference) | `web_root/dues.html` → https://montrealcigarclub.ca/dues |
| Create Checkout session | `POST /api/pay/create` (`functions/api/pay/create.js`, rate-limited 10/h/IP) |
| Success-page confirmation | `GET /api/pay/status?session_id=…` |
| Webhook (source of truth) | `POST /api/pay/webhook` — verifies `Stripe-Signature`, stores `pay:paid:…` in KV, emails the committee |

**Setup:**
1. Stripe Dashboard (stripe.com) → create/use the club account → **Developers → API keys** → copy the **Secret key** (`sk_live_…`; use `sk_test_…` first to test).
2. Save it to `secrets/mcc-stripe-secret-key.txt`, then:
   `powershell -ExecutionPolicy Bypass -File scripts/with-secrets.ps1 npx wrangler pages secret put STRIPE_SECRET_KEY --project-name=montreal-cigar-club` (paste/pipe the key)
3. **Developers → Webhooks → Add endpoint**: URL `https://montrealcigarclub.ca/api/pay/webhook`, event `checkout.session.completed` → copy the **Signing secret** (`whsec_…`) → save to `secrets/mcc-stripe-webhook-secret.txt` → `wrangler pages secret put STRIPE_WEBHOOK_SECRET …` the same way.
4. Redeploy (secrets bind on the next deployment). Test with Stripe test keys + card `4242 4242 4242 4242`.

Until the secrets exist, `/dues` shows "Online payment is not yet activated" (API returns 503) — safe to ship.
Payment records: `pay:paid:*` keys in KV `MCC_SUBMISSIONS`; pending sessions auto-expire after 48 h.
