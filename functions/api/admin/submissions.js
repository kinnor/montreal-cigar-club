import { json } from '../../_lib.js';
import { EVENTS, seatsTaken } from '../../_events.js';

/**
 * Admin API — protected by ADMIN_TOKEN (wrangler pages secret put ADMIN_TOKEN --project-name=montreal-cigar-club)
 *   GET  /api/admin/submissions?kind=apply|rsvp&limit=100      → list records, newest first
 *   POST /api/admin/submissions  {id, status, note?}            → update status (see docs/MEMBERSHIP_PROCESS.md)
 *        RSVP status "cancelled" or "declined" releases the reserved seats.
 * Header: Authorization: Bearer <ADMIN_TOKEN>
 */
const STATUSES = {
  apply: ['received', 'review', 'conversation', 'committee', 'accepted', 'waitlist', 'declined', 'member'],
  rsvp: ['received', 'confirmed', 'waitlist', 'cancelled', 'declined', 'attended'],
};
const RELEASES = new Set(['cancelled', 'declined']);

function authorized(request, env) {
  const auth = request.headers.get('Authorization') || '';
  return env.ADMIN_TOKEN && auth === `Bearer ${env.ADMIN_TOKEN}`;
}

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.MCC_SUBMISSIONS) return json({ ok: false, error: 'no_storage' }, 500);
  const url = new URL(request.url);
  const kind = url.searchParams.get('kind');
  const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 500);
  const prefix = kind === 'apply' || kind === 'rsvp' ? `sub:${kind}:` : 'sub:';
  const list = await env.MCC_SUBMISSIONS.list({ prefix, limit });
  const items = (await Promise.all(list.keys.map(async k => JSON.parse(await env.MCC_SUBMISSIONS.get(k.name) || 'null')))).filter(Boolean);
  items.sort((a, b) => (b.receivedAt || '').localeCompare(a.receivedAt || ''));
  const seats = {};
  for (const id of Object.keys(EVENTS)) seats[id] = { capacity: EVENTS[id].capacity, taken: await seatsTaken(env, id) };
  return json({ ok: true, count: items.length, complete: list.list_complete, seats, items });
}

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.MCC_SUBMISSIONS) return json({ ok: false, error: 'no_storage' }, 500);
  let body; try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  const id = typeof body.id === 'string' ? body.id : '';
  const rec = id.startsWith('sub:') ? JSON.parse(await env.MCC_SUBMISSIONS.get(id) || 'null') : null;
  if (!rec) return json({ ok: false, error: 'not_found' }, 404);
  const allowed = STATUSES[rec.kind] || [];
  if (!allowed.includes(body.status)) return json({ ok: false, error: 'bad_status', allowed }, 422);
  const prev = rec.status;
  rec.status = body.status;
  rec.history = [...(rec.history || []), { at: new Date().toISOString(), from: prev, to: body.status, note: typeof body.note === 'string' ? body.note.slice(0, 500) : undefined }];
  // seat accounting for salons
  if (rec.kind === 'rsvp' && rec.eventId && EVENTS[rec.eventId]) {
    const wasHeld = !RELEASES.has(prev), nowHeld = !RELEASES.has(body.status);
    if (wasHeld !== nowHeld) {
      const key = `seats:${rec.eventId}`;
      const taken = Number(await env.MCC_SUBMISSIONS.get(key)) || 0;
      await env.MCC_SUBMISSIONS.put(key, String(Math.max(0, taken + (nowHeld ? rec.guests : -rec.guests))));
    }
  }
  await env.MCC_SUBMISSIONS.put(id, JSON.stringify(rec));
  return json({ ok: true, id, status: rec.status });
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { Allow: 'GET, POST' });
