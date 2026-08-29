/**
 * Shared helpers for Pages Functions (Cloudflare Workers runtime).
 * Storage: KV binding MCC_SUBMISSIONS (configured in wrangler.toml).
 * Optional email: set MAIL_TO + a Cloudflare "send_email" binding named EMAIL to receive copies.
 */
export const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

/** Validate a submission; returns { ok, data } or { ok:false, error } */
export function validate(body, kind) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'bad_json' };
  if (clip(body.website, 10)) return { ok: false, error: 'spam' };               // honeypot filled
  const name = clip(body.name, 120), email = clip(body.email, 160).toLowerCase();
  if (name.length < 2) return { ok: false, error: 'name' };
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'email' };
  if (!['on', 'true', true, '1'].includes(body.age)) return { ok: false, error: 'age' };
  const data = { kind, name, email, lang: body.lang === 'fr' ? 'fr' : 'en', notes: clip(body.notes, 2000) };
  if (kind === 'apply') {
    data.phone = clip(body.phone, 40);
    data.tier = body.tier === 'fondateur' ? 'fondateur' : 'cercle';
  } else {
    data.event = clip(body.event, 160);
    if (!data.event) return { ok: false, error: 'event' };
    data.guests = body.guests === '2' ? 2 : 1;
    data.member = clip(body.member, 40);
  }
  return { ok: true, data };
}

/** Simple per-IP rate limit via KV: max `limit` per `windowSec` */
export async function rateLimited(env, ip, kind, limit = 5, windowSec = 3600) {
  if (!env.MCC_SUBMISSIONS) return false;
  const key = `rl:${kind}:${ip}`;
  const n = Number(await env.MCC_SUBMISSIONS.get(key)) || 0;
  if (n >= limit) return true;
  await env.MCC_SUBMISSIONS.put(key, String(n + 1), { expirationTtl: windowSec });
  return false;
}

/** Persist to KV under sub:<kind>:<iso>:<rand> and optionally email a copy */
export async function store(env, request, data) {
  const id = `sub:${data.kind}:${new Date().toISOString()}:${crypto.randomUUID().slice(0, 8)}`;
  const record = {
    ...data,
    id,
    receivedAt: new Date().toISOString(),
    ip: request.headers.get('CF-Connecting-IP') || '',
    country: request.headers.get('CF-IPCountry') || '',
    ua: (request.headers.get('User-Agent') || '').slice(0, 200),
  };
  if (env.MCC_SUBMISSIONS) await env.MCC_SUBMISSIONS.put(id, JSON.stringify(record));
  await notify(env, record).catch(() => {});
  return id;
}

async function notify(env, r) {
  if (!env.EMAIL || !env.MAIL_TO) return;
  const subject = r.kind === 'apply' ? `[MCC] Membership application — ${r.name} (${r.tier})` : `[MCC] RSVP — ${r.name} × ${r.guests} — ${r.event}`;
  const lines = Object.entries(r).map(([k, v]) => `${k}: ${v}`).join('\n');
  const from = env.MAIL_FROM || 'concierge@montrealcigarclub.ca';
  const raw = `From: Montreal Cigar Club <${from}>\r\nTo: ${env.MAIL_TO}\r\nReply-To: ${r.email}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${lines}\r\n`;
  await env.EMAIL.send({ from, to: env.MAIL_TO, raw });   // send_email binding (Cloudflare Email Service)
}

export function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || '0.0.0.0';
}
