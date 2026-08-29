import { json } from '../_lib.js';
import { availability } from '../_events.js';

/** GET /api/events → seat availability per salon (public, cached 60 s at the edge) */
export async function onRequestGet({ env }) {
  return json({ ok: true, events: await availability(env) }, 200, { 'Cache-Control': 'public, max-age=60' });
}
export const onRequest = () => json({ ok: false, error: 'method' }, 405, { Allow: 'GET' });
