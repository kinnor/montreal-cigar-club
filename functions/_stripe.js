/**
 * Stripe integration for Pages Functions — REST API via fetch (no SDK/build step),
 * same architecture as the Accord & Harmony implementation (hosted Checkout + verified webhook),
 * with KV in place of D1 for payment records.
 *
 * Secrets (wrangler pages secret put <NAME> --project-name=montreal-cigar-club):
 *   STRIPE_SECRET_KEY      sk_live_… or sk_test_…
 *   STRIPE_WEBHOOK_SECRET  whsec_…   (from the webhook endpoint config)
 */

/** Server-side price table — never trust amounts from the client. CAD, in cents. */
export const DUES = {
  cercle: { amount: 185000, name: { en: 'Montreal Cigar Club — Le Cercle membership (1 year)', fr: 'Club de Cigare de Montréal — Adhésion Le Cercle (1 an)' } },
  fondateur: { amount: 450000, name: { en: 'Montreal Cigar Club — Le Fondateur membership (1 year, private vault locker)', fr: 'Club de Cigare de Montréal — Adhésion Le Fondateur (1 an, casier privé)' } },
};

export const stripeConfigured = (env) => Boolean(env.STRIPE_SECRET_KEY);

const form = (obj) => {
  const p = new URLSearchParams();
  const walk = (prefix, v) => {
    if (v === undefined || v === null) return;
    if (typeof v === 'object') { for (const [k, x] of Object.entries(v)) walk(prefix ? `${prefix}[${k}]` : k, x); }
    else p.append(prefix, String(v));
  };
  walk('', obj);
  return p;
};

async function stripeRequest(env, method, path, body) {
  const r = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body ? form(body) : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error && data.error.message ? data.error.message : `stripe ${r.status}`);
  return data;
}

/** Create a hosted Checkout Session for membership dues. Returns { id, url }. */
export async function createDuesCheckout(env, { tier, email, name, ref, lang }) {
  const dues = DUES[tier];
  const site = 'https://montrealcigarclub.ca';
  const session = await stripeRequest(env, 'POST', '/checkout/sessions', {
    mode: 'payment',
    customer_email: email,
    client_reference_id: ref || undefined,
    locale: lang === 'fr' ? 'fr-CA' : 'en',
    line_items: { 0: { quantity: 1, price_data: { currency: 'cad', unit_amount: dues.amount, product_data: { name: dues.name[lang === 'fr' ? 'fr' : 'en'] } } } },
    success_url: `${site}/dues?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/dues?canceled=1`,
    metadata: { tier, ref: ref || '', member_name: name, lang: lang === 'fr' ? 'fr' : 'en' },
    payment_intent_data: { metadata: { tier, ref: ref || '' } },
  });
  return { id: session.id, url: session.url };
}

export const getSession = (env, id) => stripeRequest(env, 'GET', `/checkout/sessions/${encodeURIComponent(id)}`);

/** Verify a Stripe webhook signature (Stripe-Signature: t=…,v1=…). Returns the parsed event or null. */
export async function verifyWebhook(env, request, rawBody) {
  const header = request.headers.get('Stripe-Signature') || '';
  const parts = Object.fromEntries(header.split(',').map(s => s.split('=', 2)).filter(a => a.length === 2));
  const t = parts.t, v1 = header.split(',').filter(s => s.startsWith('v1=')).map(s => s.slice(3));
  if (!t || !v1.length || !env.STRIPE_WEBHOOK_SECRET) return null;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return null;          // 5-minute tolerance
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.STRIPE_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${rawBody}`));
  const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');
  const match = v1.some(sig => sig.length === expected.length && timingSafeEqual(sig, expected));
  if (!match) return null;
  try { return JSON.parse(rawBody); } catch { return null; }
}

function timingSafeEqual(a, b) {
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
