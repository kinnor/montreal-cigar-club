import { json, validate, rateLimited, store, clientIp } from '../_lib.js';
import { EVENTS, reserveSeats } from '../_events.js';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  const v = validate(body, 'rsvp');
  if (!v.ok) return json({ ok: false, error: v.error }, v.error === 'spam' ? 200 : 422);
  const ev = EVENTS[v.data.event];
  if (!ev) return json({ ok: false, error: 'unknown_event' }, 422);
  if (await rateLimited(env, clientIp(request), 'rsvp', 5, 3600)) return json({ ok: false, error: 'rate' }, 429);
  const seats = await reserveSeats(env, v.data.event, v.data.guests);
  if (!seats.ok) return json({ ok: false, error: seats.error, remaining: seats.remaining }, 409);
  v.data.eventId = v.data.event;
  v.data.event = `${ev.title[v.data.lang]} (${ev.date} ${ev.time})`;
  const ref = await store(env, request, v.data);
  return json({ ok: true, ref, remaining: seats.remaining });
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { Allow: 'POST' });
