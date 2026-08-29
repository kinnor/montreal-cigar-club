/**
 * Shared helpers for Pages Functions (Cloudflare Workers runtime).
 *
 * Storage : KV binding MCC_SUBMISSIONS (wrangler.toml)
 * Email   : Cloudflare Email Service — sends a committee notification to MAIL_TO and an
 *           acknowledgement to the applicant. Two transports, tried in order:
 *             1. `send_email` binding named EMAIL            (wrangler.toml [[send_email]])
 *             2. REST API with secret EMAIL_API_TOKEN         (wrangler pages secret put EMAIL_API_TOKEN)
 *           Both require montrealcigarclub.ca to be onboarded to Email Sending.
 *           If neither is configured, submissions are still stored in KV (never lost).
 */
export const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ACCOUNT_ID = 'e4c48055274fc0fb73481be9032561fb';
const DEFAULT_FROM = 'admissions@montrealcigarclub.ca';
const SITE = 'https://montrealcigarclub.ca';

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

/** Persist to KV under sub:<kind>:<iso>:<rand>, then notify (errors never block the response) */
export async function store(env, request, data) {
  const ref = crypto.randomUUID().slice(0, 8).toUpperCase();
  const id = `sub:${data.kind}:${new Date().toISOString()}:${ref.toLowerCase()}`;
  const record = {
    ...data,
    id, ref: `MCC-${ref}`,
    status: 'received',                     // received → conversation → committee → accepted | declined | waitlist
    receivedAt: new Date().toISOString(),
    ip: request.headers.get('CF-Connecting-IP') || '',
    country: request.headers.get('CF-IPCountry') || '',
    ua: (request.headers.get('User-Agent') || '').slice(0, 200),
  };
  if (env.MCC_SUBMISSIONS) await env.MCC_SUBMISSIONS.put(id, JSON.stringify(record));
  const mail = { committee: 'skipped', applicant: 'skipped' };
  try { mail.committee = await sendMail(env, committeeMessage(env, record)); } catch (e) { mail.committee = 'error: ' + (e.message || e); }
  try { mail.applicant = await sendMail(env, applicantMessage(env, record)); } catch (e) { mail.applicant = 'error: ' + (e.message || e); }
  if (env.MCC_SUBMISSIONS) await env.MCC_SUBMISSIONS.put(id, JSON.stringify({ ...record, mail }));
  return record.ref;
}

export function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || '0.0.0.0';
}

/* ---------------------------------------------------------------- email transport */
async function sendMail(env, msg) {
  if (!msg || !msg.to) return 'skipped';
  const from = { email: env.MAIL_FROM || DEFAULT_FROM, name: 'Montreal Cigar Club' };
  if (env.EMAIL && typeof env.EMAIL.send === 'function') {
    await env.EMAIL.send({ to: msg.to, from, replyTo: msg.replyTo, subject: msg.subject, text: msg.text, html: msg.html });
    return 'binding';
  }
  if (env.EMAIL_API_TOKEN) {
    const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID || ACCOUNT_ID}/email/sending/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.EMAIL_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: msg.to, from: { address: from.email, name: from.name }, reply_to: msg.replyTo, subject: msg.subject, text: msg.text, html: msg.html }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok || body.success === false) throw new Error(`rest ${r.status}: ${(body.errors || []).map(e => e.message).join('; ')}`);
    return 'rest';
  }
  return 'skipped';
}

/* ---------------------------------------------------------------- messages */
const TIER = { cercle: 'Le Cercle — $1,850 CAD / year', fondateur: 'Le Fondateur — $4,500 CAD / year (private vault locker)' };

function committeeMessage(env, r) {
  const to = env.MAIL_TO; if (!to) return null;
  const isApply = r.kind === 'apply';
  const subject = isApply
    ? `[MCC ${r.ref}] Membership application — ${r.name} (${r.tier === 'fondateur' ? 'Fondateur' : 'Cercle'})`
    : `[MCC ${r.ref}] RSVP — ${r.name} × ${r.guests} — ${r.event}`;
  const rows = isApply
    ? [['Reference', r.ref], ['Name', r.name], ['Email', r.email], ['Telephone', r.phone || '—'], ['Desired tier', TIER[r.tier]], ['Language', r.lang.toUpperCase()], ['Notes / vitolas', r.notes || '—']]
    : [['Reference', r.ref], ['Event', r.event], ['Name', r.name], ['Email', r.email], ['Seats', String(r.guests)], ['Member ID', r.member || '—'], ['Language', r.lang.toUpperCase()], ['Notes', r.notes || '—']];
  rows.push(['Received', r.receivedAt], ['Country / IP', `${r.country} / ${r.ip}`]);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nNext step: ${isApply ? 'assign a founding member for the conversation (target: within 7 days).' : 'confirm or waitlist the seat with the concierge.'}\nAdmin: ${SITE}/api/admin/submissions?kind=${r.kind}`;
  const html = `<div style="font-family:Georgia,serif;color:#111;max-width:640px">
    <p style="font-size:11px;letter-spacing:.2em;color:#a07b1c;text-transform:uppercase">Montreal Cigar Club · ${isApply ? 'Membership application' : 'Salon RSVP'}</p>
    <h2 style="margin:0 0 12px">${esc(r.name)} <span style="font-weight:normal;color:#666">— ${esc(r.ref)}</span></h2>
    <table cellpadding="6" style="border-collapse:collapse;font-size:14px">${rows.map(([k, v]) => `<tr><td style="color:#666;border-bottom:1px solid #eee;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table>
    <p style="font-size:13px;color:#444">Next step: ${isApply ? 'assign a founding member for the conversation (target: within 7 days).' : 'confirm or waitlist the seat with the concierge.'}</p>
    <p style="font-size:12px;color:#888">Reply to this email to write to the applicant directly.</p></div>`;
  return { to, replyTo: r.email, subject, text, html };
}

function applicantMessage(env, r) {
  if (!env.MAIL_TO) return null;                       // acknowledgements only once the club mailbox is live
  const fr = r.lang === 'fr';
  const isApply = r.kind === 'apply';
  const subject = isApply
    ? (fr ? `Votre demande d’adhésion — ${r.ref}` : `Your membership application — ${r.ref}`)
    : (fr ? `Votre demande de place — ${r.ref}` : `Your seat request — ${r.ref}`);
  const body = isApply ? (fr
    ? `Bonjour ${r.name},\n\nNous avons bien reçu votre demande d’adhésion (référence ${r.ref}) pour le niveau « ${TIER[r.tier]} ».\n\nVoici comment se déroule l’admission :\n1. Examen préliminaire — dans les 7 jours, un membre fondateur vous écrit pour proposer une rencontre.\n2. Conversation — une rencontre informelle autour d’un cigare, à Montréal. Ni formulaire, ni entrevue.\n3. Comité — les trois membres fondateurs décident à l’unanimité. Réponse dans les 30 jours suivant la rencontre.\n4. Accueil — si la réponse est favorable : contrat d’adhésion, cotisation, remise de votre clé et de votre code lors du premier salon.\n\nTout échange demeure strictement confidentiel. Pour toute question : admissions@montrealcigarclub.ca\n\nLe comité d’adhésion\nClub de Cigare de Montréal — ${SITE}`
    : `Dear ${r.name},\n\nWe have received your membership application (reference ${r.ref}) for “${TIER[r.tier]}”.\n\nHow admission works:\n1. Preliminary review — within 7 days a founding member writes to propose a meeting.\n2. Conversation — an informal meeting over a cigar, in Montreal. No forms, no interview.\n3. Committee — the three founding members decide unanimously. Answer within 30 days of the meeting.\n4. Welcome — if accepted: membership agreement, dues, and your key and passcode handed over at the first salon.\n\nEverything is strictly confidential. Questions: admissions@montrealcigarclub.ca\n\nThe Membership Committee\nMontreal Cigar Club — ${SITE}`)
  : (fr
    ? `Bonjour ${r.name},\n\nNous avons bien reçu votre demande de ${r.guests} place(s) (référence ${r.ref}) pour : ${r.event}.\n\nLes places sont strictement limitées ; le concierge confirmera par courriel. Tous les convives doivent avoir 18 ans ou plus.\n\nLe concierge\nClub de Cigare de Montréal — ${SITE}`
    : `Dear ${r.name},\n\nWe have received your request for ${r.guests} seat(s) (reference ${r.ref}) for: ${r.event}.\n\nSeating is strictly limited; the concierge will confirm by email. All guests must be 18 or older.\n\nThe Concierge\nMontreal Cigar Club — ${SITE}`);
  const html = `<div style="font-family:Georgia,serif;color:#111;max-width:640px;line-height:1.55"><p style="font-size:11px;letter-spacing:.2em;color:#a07b1c;text-transform:uppercase">Montreal Cigar Club</p>${body.split('\n\n').map(p => `<p style="white-space:pre-wrap">${esc(p)}</p>`).join('')}</div>`;
  return { to: r.email, replyTo: env.MAIL_TO, subject, text: body, html };
}
