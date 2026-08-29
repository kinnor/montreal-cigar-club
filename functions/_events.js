/**
 * Event catalogue + seat accounting (KV). Single source of truth for bookable salons.
 * Seats are reserved at RSVP time (status "requested") so the page can show availability;
 * the concierge confirms or releases them by editing the record (see docs/MEMBERSHIP_PROCESS.md).
 */
export const EVENTS = {
  'penthouse-2026-09-25': { date: '2026-09-25', time: '19:00', capacity: 20, title: { en: 'Soirée Dégustation — Penthouse Edition', fr: 'Soirée dégustation — édition penthouse' } },
  'maduro-rum-2026-10-23': { date: '2026-10-23', time: '19:30', capacity: 16, title: { en: 'Maduro & Rum — Autumn Salon', fr: 'Maduro et rhum — salon d’automne' } },
  'islay-2026-11-27':      { date: '2026-11-27', time: '20:00', capacity: 12, title: { en: 'Islay Night — Peat & Oscuro', fr: 'Nuit d’Islay — tourbe et Oscuro' } },
};

const seatKey = (id) => `seats:${id}`;

export async function seatsTaken(env, id) {
  if (!env.MCC_SUBMISSIONS) return 0;
  return Number(await env.MCC_SUBMISSIONS.get(seatKey(id))) || 0;
}

/** Reserve `n` seats if available. Returns { ok, taken, remaining } */
export async function reserveSeats(env, id, n) {
  const ev = EVENTS[id];
  if (!ev) return { ok: false, error: 'unknown_event' };
  const taken = await seatsTaken(env, id);
  if (taken + n > ev.capacity) return { ok: false, error: 'full', taken, remaining: Math.max(0, ev.capacity - taken) };
  if (env.MCC_SUBMISSIONS) await env.MCC_SUBMISSIONS.put(seatKey(id), String(taken + n));
  return { ok: true, taken: taken + n, remaining: ev.capacity - taken - n };
}

export async function availability(env) {
  const out = {};
  for (const [id, ev] of Object.entries(EVENTS)) {
    const taken = await seatsTaken(env, id);
    const past = new Date(ev.date + 'T23:59:59-04:00') < new Date();
    out[id] = { date: ev.date, time: ev.time, capacity: ev.capacity, taken, remaining: Math.max(0, ev.capacity - taken), full: taken >= ev.capacity, past };
  }
  return out;
}
