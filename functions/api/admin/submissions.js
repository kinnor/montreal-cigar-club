import { json } from '../../_lib.js';

/**
 * GET /api/admin/submissions?kind=apply|rsvp&limit=100
 * Protected by ADMIN_TOKEN (set with: wrangler pages secret put ADMIN_TOKEN --project-name=montreal-cigar-club)
 * Send it as  Authorization: Bearer <token>
 */
export async function onRequestGet({ request, env }) {
  const auth = request.headers.get('Authorization') || '';
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.MCC_SUBMISSIONS) return json({ ok: false, error: 'no_storage' }, 500);
  const url = new URL(request.url);
  const kind = url.searchParams.get('kind');
  const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 500);
  const prefix = kind === 'apply' || kind === 'rsvp' ? `sub:${kind}:` : 'sub:';
  const list = await env.MCC_SUBMISSIONS.list({ prefix, limit });
  const items = await Promise.all(list.keys.map(async k => JSON.parse(await env.MCC_SUBMISSIONS.get(k.name))));
  items.sort((a, b) => (b.receivedAt || '').localeCompare(a.receivedAt || ''));
  return json({ ok: true, count: items.length, complete: list.list_complete, items });
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405, { Allow: 'GET' });
