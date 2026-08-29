# 03 — Domains & Cloudflare Infrastructure
**Montreal Cigar Club — Cloudflare Edge Setup**

---

## 1. Registered Domain Assets

| Registered Domain | Registrar | Status | Strategic Role |
| :--- | :--- | :--- | :--- |
| **montrealcigarclub.ca** | **Cloudflare Registrar** | ✅ **Active / Owned** | **Primary Canonical Domain** (*Official Web Identity*) |
| **mtlcigarclub.ca** | **Cloudflare Registrar** | ✅ **Active / Owned** | **Short URL / Fast Redirect** (*Mobile & marketing shortcut*) |

---

## 2. Cloudflare Edge Architecture

### A. Hosting on Cloudflare Pages
* **Platform:** Cloudflare Pages (Free Tier).
* **Benefits:**
  * Zero-latency global edge network with instant Montreal edge caching.
  * Unlimited bandwidth and automated SSL / TLS 1.3 certificates.
  * Direct continuous deployment from Git repository.

### B. URL Redirection Rules (301 Permanent)
* **Rule:** https://mtlcigarclub.ca/* ➔ https://montrealcigarclub.ca/
* **Canonical Host:** All traffic standardizes on https://montrealcigarclub.ca.

### C. Free Cloudflare Email Routing
Enables branded, professional incoming addresses without paid Google Workspace or Microsoft 365 mailboxes:
* concierge@montrealcigarclub.ca ➔ *Forward to Owner Email*
* dmissions@montrealcigarclub.ca ➔ *Forward to Owner Email*
* ault@montrealcigarclub.ca ➔ *Forward to Owner Email*
