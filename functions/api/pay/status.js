import { json } from '../../_lib.js';
import { stripeConfigured, getSession } from '../../_stripe.js';

/** GET /api/pay/status?session_id=cs_… → payment confirmation for the success page */
export async function onRequestGet({ request, env }) {
  if (!stripeConfigured(env)) return json({ ok: false, error: 'payments_not_configured' }, 503);
  const id = new URL(request.url).searchParams.get('session_id') || '';
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return json({ ok: false, error: 'session_id' }, 422);
  try {
    const s = await getSession(env, id);
    return json({
      ok: true,
      paid: s.payment_status === 'paid',
      amount: s.amount_total, currency: (s.currency || 'cad').toUpperCase(),
      tier: (s.metadata && s.metadata.tier) || '', ref: (s.metadata && s.metadata.ref) || '',
    }, 200, { 'Cache-Control': 'no-store' });
  } catch (e) {
    return json({ ok: false, error: 'stripe' }, 502);
  }
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { Allow: 'GET' });
