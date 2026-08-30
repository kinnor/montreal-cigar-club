import { json } from '../../_lib.js';
import { verifyWebhook } from '../../_stripe.js';

/**
 * POST /api/pay/webhook — Stripe webhook (configure in the Stripe dashboard:
 * endpoint https://montrealcigarclub.ca/api/pay/webhook, event checkout.session.completed;
 * put the signing secret in STRIPE_WEBHOOK_SECRET).
 * On completed payment: persist a permanent record in KV and email the committee.
 */
export async function onRequestPost({ request, env }) {
  const raw = await request.text();
  const event = await verifyWebhook(env, request, raw);
  if (!event) return json({ ok: false, error: 'bad_signature' }, 400);

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    const meta = s.metadata || {};
    const record = {
      kind: 'payment',
      sessionId: s.id,
      paymentIntent: s.payment_intent || '',
      status: s.payment_status,                        // 'paid'
      amount: s.amount_total, currency: (s.currency || 'cad').toUpperCase(),
      tier: meta.tier || '', ref: meta.ref || '', name: meta.member_name || '',
      email: (s.customer_details && s.customer_details.email) || s.customer_email || '',
      paidAt: new Date().toISOString(),
    };
    if (env.MCC_SUBMISSIONS) {
      await env.MCC_SUBMISSIONS.put(`pay:paid:${record.paidAt}:${s.id.slice(-8)}`, JSON.stringify(record));
      await env.MCC_SUBMISSIONS.delete(`pay:pending:${s.id}`).catch(() => {});
    }
    await notifyCommittee(env, record).catch(() => {});
  }
  return json({ ok: true, received: true });
}

async function notifyCommittee(env, r) {
  if (!env.EMAIL_API_TOKEN || !env.MAIL_TO) return;
  const amount = `$${(r.amount / 100).toLocaleString('en-CA')} ${r.currency}`;
  const lines = [
    `Membership dues received: ${amount}`,
    `Tier: ${r.tier || 'unknown'}`,
    `Member: ${r.name || 'unknown'} <${r.email}>`,
    r.ref ? `Application reference: ${r.ref}` : 'No application reference given',
    `Stripe session: ${r.sessionId}`,
    `Payment intent: ${r.paymentIntent}`,
    '',
    'Next step (MEMBERSHIP_PROCESS §6): countersign the agreement, schedule the first salon, prepare key/passcode' + (r.tier === 'fondateur' ? ' and assign a locker.' : '.'),
  ].join('\n');
  await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID || 'e4c48055274fc0fb73481be9032561fb'}/email/sending/send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.EMAIL_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: env.MAIL_TO,
      from: { address: env.MAIL_FROM || 'admissions@montrealcigarclub.ca', name: 'Montreal Cigar Club' },
      subject: `[MCC] Dues paid — ${r.name || r.email} (${r.tier}) ${amount}`,
      text: lines,
    }),
  });
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { Allow: 'POST' });
