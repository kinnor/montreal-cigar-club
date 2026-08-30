import { json, rateLimited, clientIp } from '../../_lib.js';
import { DUES, stripeConfigured, createDuesCheckout } from '../../_stripe.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** POST /api/pay/create {tier, email, name, ref?, lang?} → { url } (Stripe hosted Checkout) */
export async function onRequestPost({ request, env }) {
  if (!stripeConfigured(env)) return json({ ok: false, error: 'payments_not_configured' }, 503);
  let b; try { b = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  const tier = b.tier === 'fondateur' ? 'fondateur' : b.tier === 'cercle' ? 'cercle' : null;
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase().slice(0, 160) : '';
  const name = typeof b.name === 'string' ? b.name.trim().slice(0, 120) : '';
  const ref = typeof b.ref === 'string' ? b.ref.trim().toUpperCase().slice(0, 20) : '';
  if (!tier) return json({ ok: false, error: 'tier' }, 422);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'email' }, 422);
  if (name.length < 2) return json({ ok: false, error: 'name' }, 422);
  if (ref && !/^MCC-[A-Z0-9]{4,12}$/.test(ref)) return json({ ok: false, error: 'ref' }, 422);
  if (await rateLimited(env, clientIp(request), 'pay', 10, 3600)) return json({ ok: false, error: 'rate' }, 429);
  try {
    const { id, url } = await createDuesCheckout(env, { tier, email, name, ref, lang: b.lang });
    if (env.MCC_SUBMISSIONS) await env.MCC_SUBMISSIONS.put(`pay:pending:${id}`, JSON.stringify({
      sessionId: id, tier, email, name, ref, amount: DUES[tier].amount, currency: 'CAD',
      createdAt: new Date().toISOString(), ip: clientIp(request),
    }), { expirationTtl: 86400 * 2 });
    return json({ ok: true, url });
  } catch (e) {
    return json({ ok: false, error: 'stripe', detail: String(e.message || e).slice(0, 200) }, 502);
  }
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { Allow: 'POST' });
