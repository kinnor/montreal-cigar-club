# Deployment — Cloudflare Pages + Workers

Canonical domain: **montrealcigarclub.ca** · Redirect domains: **mtlcigarclub.ca**, **mtlcigarclub.com** (301 → canonical)
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
