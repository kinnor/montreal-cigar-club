import { json, validate, rateLimited, store, clientIp } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  const v = validate(body, 'rsvp');
  if (!v.ok) return json({ ok: false, error: v.error }, v.error === 'spam' ? 200 : 422);
  if (await rateLimited(env, clientIp(request), 'rsvp', 5, 3600)) return json({ ok: false, error: 'rate' }, 429);
  const id = await store(env, request, v.data);
  return json({ ok: true, id });
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { Allow: 'POST' });
