/**
 * MONTREAL CIGAR CLUB — Interactive Application Logic
 * Age gate · Pairing engine · Humidor telemetry · Vinyl room tone · FR/EN · Modals · Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  window.MCC_I18N.init();
  initAgeGate();
  initPairingEngine();
  initHumidorTelemetry();
  initAudioPlayer();
  initLanguageToggle();
  initModals();
  initMobileMenu();
  initDossiers();
  initForms();
  if (window.lucide) lucide.createIcons();
});

const L = (k) => window.MCC_I18N.t(k) || '';

/* ==========================================================================
   0. AGE GATE (18+, Quebec) — remembered on this device for 30 days
   ========================================================================== */
function initAgeGate() {
  const gate = document.getElementById('age-gate');
  if (!gate) return;
  const KEY = 'mcc_age_ok';
  let ok = false;
  try { const ts = Number(localStorage.getItem(KEY) || 0); ok = ts && (Date.now() - ts) < 30 * 864e5; } catch (e) {}
  if (ok) return;
  gate.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  const yes = document.getElementById('age-yes');
  yes.focus();
  yes.addEventListener('click', () => {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    gate.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  });
}

/* ==========================================================================
   1. SIGNATURE PAIRING ENGINE (Cigar + Spirit + Jazz) — bilingual
   ========================================================================== */
const pairingDatabase = {
  padron_remy_oscar: {
    en: { harmony: 'Dark Cacao & Velvet Swing', cigar: 'Heavy cocoa, roasted espresso, and black pepper from the 4-year aged Maduro wrapper.', spirit: 'Candied orange peel, ripe figs, and opulent French oak tannins from Rémy Martin XO.', jazz: 'Oscar Peterson’s buoyant Montreal piano lines balance the dense Nicaraguan body with melodic elegance.', score: 'Masterclass Pairing' },
    fr: { harmony: 'Cacao noir et swing de velours', cigar: 'Cacao dense, espresso torréfié et poivre noir de la cape Maduro vieillie quatre ans.', spirit: 'Écorce d’orange confite, figues mûres et tanins opulents de chêne français du Rémy Martin XO.', jazz: 'Le piano allègre et montréalais d’Oscar Peterson équilibre le corps nicaraguayen dense avec une élégance mélodique.', score: 'Accord magistral' }
  },
  padron_diplomatico_miles: {
    en: { harmony: 'Molasses Ember & Smoky Nocturne', cigar: 'Earthy, robust chocolate sweetness and signature dense smoke output.', spirit: 'Toffee, caramelized brown sugar, and dark honey from 12-year pot-still rum.', jazz: 'Miles Davis’ muted trumpet on “Kind of Blue” mirrors the slow, meditative burn of the Maduro.', score: 'Transcendent Harmony' },
    fr: { harmony: 'Braise de mélasse et nocturne fumé', cigar: 'Douceur chocolatée, terreuse et robuste ; fumée dense caractéristique.', spirit: 'Caramel au beurre, cassonade caramélisée et miel sombre d’un rhum de 12 ans distillé en alambic.', jazz: 'La trompette bouchée de Miles Davis sur « Kind of Blue » reflète la combustion lente et méditative du Maduro.', score: 'Harmonie transcendante' }
  },
  epc_remy_billevans: {
    en: { harmony: 'Tercio Cedar & Aristocratic Nuance', cigar: 'Aged palm-bark fermentation yields sweet cedar, cinnamon, and delicate citrus zest.', spirit: 'Velvety floral bouquet, toasted hazelnuts, and lingering dried apricot.', jazz: 'Bill Evans’ subtle harmonic voicings on “Waltz for Debby” complement the Encore’s refined finesse.', score: 'Connoisseur Gold' },
    fr: { harmony: 'Cèdre de tercio et nuance aristocratique', cigar: 'La fermentation en écorce de palmier donne un cèdre doux, de la cannelle et un zeste d’agrumes délicat.', spirit: 'Bouquet floral velouté, noisettes grillées et abricot sec persistant.', jazz: 'Les voicings subtils de Bill Evans sur « Waltz for Debby » accompagnent la finesse raffinée de l’Encore.', score: 'Or du connaisseur' }
  },
  epc_diplomatico_coltrane: {
    en: { harmony: 'Baking Spice & Tenor Resonance', cigar: 'Layered complexity with nutmeg, toasted almond, and sweet tobacco leaf.', spirit: 'Silky dark molasses, oak vanillin, and rich dried plums.', jazz: 'Coltrane’s soaring saxophone mirrors the rich, evolving mid-palate intensity of the Encore.', score: 'Deep Soul Connection' },
    fr: { harmony: 'Épices à pâtisserie et résonance de ténor', cigar: 'Complexité en couches : muscade, amande grillée et feuille de tabac sucrée.', spirit: 'Mélasse sombre et soyeuse, vanilline de chêne et pruneaux riches.', jazz: 'Le saxophone ascendant de Coltrane reflète l’intensité riche et évolutive de l’Encore en milieu de bouche.', score: 'Lien d’âme profond' }
  },
  myfather_lagavulin_chet: {
    en: { harmony: 'Peat, Pepper & Melancholy Romance', cigar: 'Dark Nicaraguan Oscuro delivers spicy black pepper, dark raisins, and earthy depth.', spirit: 'Intense Islay peat smoke, iodine, sweet maritime sea salt, and malted barley.', jazz: 'Chet Baker’s whisper-soft trumpet and vulnerable vocals create an intimate late-night atmosphere.', score: 'Autumn Velvet' },
    fr: { harmony: 'Tourbe, poivre et romance mélancolique', cigar: 'L’Oscuro nicaraguayen livre un poivre noir épicé, des raisins secs foncés et une profondeur terreuse.', spirit: 'Fumée de tourbe d’Islay intense, iode, sel marin doux et orge maltée.', jazz: 'La trompette feutrée et la voix fragile de Chet Baker créent une atmosphère intime de fin de soirée.', score: 'Velours d’automne' }
  },
  _default: {
    en: { harmony: 'Curated Bespoke Symphony', cigar: 'Rich artisan leaf aged to perfection in our private Montreal humidor vault.', spirit: 'Aged spirit offering warm caramel, oak structure, and a velvety finish.', jazz: 'Classic analog acoustic jazz from Montreal and international vinyl masters.', score: 'Harmonious' },
    fr: { harmony: 'Symphonie sur mesure', cigar: 'Feuille artisanale riche, vieillie à la perfection dans notre cave privée de Montréal.', spirit: 'Spiritueux vieilli aux notes de caramel chaud, de chêne et de finale veloutée.', jazz: 'Jazz acoustique analogique classique, de Montréal et des grands vinyles internationaux.', score: 'Harmonieux' }
  }
};

function initPairingEngine() {
  const sel = ['select-cigar', 'select-spirit', 'select-jazz'].map(id => document.getElementById(id));
  if (sel.some(s => !s)) return;
  const [harmony, cigar, spirit, jazz, score] = ['pairing-harmony-title', 'pairing-cigar-desc', 'pairing-spirit-desc', 'pairing-jazz-desc', 'pairing-score-badge'].map(id => document.getElementById(id));
  function update() {
    const key = sel.map(s => s.value).join('_');
    const d = (pairingDatabase[key] || pairingDatabase._default)[window.MCC_I18N.lang];
    harmony.style.opacity = '0';
    setTimeout(() => {
      harmony.textContent = d.harmony; cigar.textContent = d.cigar; spirit.textContent = d.spirit; jazz.textContent = d.jazz; score.textContent = d.score;
      harmony.style.opacity = '1';
    }, 180);
  }
  sel.forEach(s => s.addEventListener('change', update));
  document.addEventListener('mcc:lang', update);
  update();
}

/* ==========================================================================
   2. HUMIDOR CLIMATE TELEMETRY (illustrative readings)
   ========================================================================== */
function initHumidorTelemetry() {
  const temp = document.getElementById('telemetry-temp');
  const rh = document.getElementById('telemetry-rh');
  const vaults = document.querySelectorAll('[data-vault-temp]');
  const vaultsRh = document.querySelectorAll('[data-vault-rh]');
  const tick = () => {
    const t = (19.4 + Math.random() * 0.4).toFixed(1), h = (68.9 + Math.random() * 0.5).toFixed(1);
    if (temp) temp.textContent = `${t}°C`;
    if (rh) rh.textContent = `${h}% RH`;
    vaults.forEach((el, i) => el.textContent = `${(19.3 + i * 0.1 + Math.random() * 0.3).toFixed(1)}°C`);
    vaultsRh.forEach((el, i) => el.textContent = `${(68.8 + i * 0.2 + Math.random() * 0.4).toFixed(1)}%`);
  };
  setInterval(tick, 4000);
}

/* ==========================================================================
   3. AMBIENT VINYL ROOM TONE (starts only on user gesture)
   ========================================================================== */
let audioCtx = null, isPlaying = false;
function initAudioPlayer() {
  const btn = document.getElementById('audio-toggle-btn');
  const txt = document.getElementById('audio-toggle-text');
  const bars = document.querySelectorAll('.eq-bar');
  if (!btn) return;
  bars.forEach(b => b.style.animationPlayState = 'paused');
  const render = () => { txt.textContent = L(isPlaying ? 'bar.audioOn' : 'bar.audioOff'); btn.setAttribute('aria-pressed', String(isPlaying)); };
  btn.addEventListener('click', () => {
    if (!isPlaying) { startVinylAudio(); isPlaying = true; bars.forEach(b => b.style.animationPlayState = 'running'); }
    else { stopVinylAudio(); isPlaying = false; bars.forEach(b => b.style.animationPlayState = 'paused'); }
    render();
  });
  document.addEventListener('mcc:lang', render);
}
function startVinylAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
    const size = audioCtx.sampleRate * 2;
    const buf = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
    const out = buf.getChannelData(0);
    for (let i = 0; i < size; i++) out[i] = (Math.random() * 2 - 1) * 0.012;
    const src = audioCtx.createBufferSource(); src.buffer = buf; src.loop = true;
    const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 400;
    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    src.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination); src.start(0);
  } catch (e) { /* audio unavailable */ }
}
function stopVinylAudio() { if (audioCtx) { audioCtx.close(); audioCtx = null; } }

/* ==========================================================================
   4. LANGUAGE TOGGLE
   ========================================================================== */
function initLanguageToggle() {
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) btn.addEventListener('click', () => window.MCC_I18N.toggle());
}

/* ==========================================================================
   5. MODALS (focus-managed, Esc to close)
   ========================================================================== */
let lastFocus = null;
function initModals() {
  const modals = document.querySelectorAll('.modal-backdrop');
  document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', closeModals));
  window.addEventListener('click', e => modals.forEach(m => { if (e.target === m) closeModals(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });
  document.querySelectorAll('[data-apply-tier]').forEach(b => b.addEventListener('click', () => {
    const t = document.getElementById('apply-tier'); if (t) t.value = b.getAttribute('data-apply-tier');
    openModal('modal-apply');
  }));
  document.querySelectorAll('[data-rsvp]').forEach(b => b.addEventListener('click', () => {
    const ev = b.getAttribute('data-rsvp');
    document.getElementById('rsvp-event').value = ev;
    document.getElementById('rsvp-event-label').textContent = ev;
    openModal('modal-rsvp');
  }));
}
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  lastFocus = document.activeElement;
  m.classList.remove('hidden');
  const f = m.querySelector('input:not([type=hidden]):not(.hidden), select, textarea, button:not(.modal-close), a');
  if (f) setTimeout(() => f.focus(), 30);
}
function closeModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
window.openModal = openModal;

/* ==========================================================================
   6. MOBILE NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  const setOpen = (open) => {
    menu.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));
    btn.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="w-5 h-5"></i>';
    if (window.lucide) lucide.createIcons();
  };
  btn.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

/* ==========================================================================
   7. TASTING DOSSIERS (replaces alert())
   ========================================================================== */
const dossiers = {
  padron: {
    title: 'Padrón 1964 Anniversary',
    en: { rows: [['Origin', 'Estelí, Nicaragua'], ['Blend', '100 % Nicaraguan puro, aged 4+ years'], ['Vitolas', 'Principe 4½" × 46 · Exclusivo 5½" × 50'], ['Rating', '94 pts — Cigar Aficionado'], ['Allocation', 'Vault 1 · members’ standing allocation']], notes: 'Open, effortless draw with thick, velvety smoke. Dark chocolate, roasted coffee bean, black pepper, damp earth and sweet molasses through a long finish.' },
    fr: { rows: [['Origine', 'Estelí, Nicaragua'], ['Assemblage', 'Puro 100 % nicaraguayen, vieilli 4 ans et plus'], ['Vitoles', 'Principe 4½ po × 46 · Exclusivo 5½ po × 50'], ['Note', '94 pts — Cigar Aficionado'], ['Allocation', 'Cave 1 · allocation courante des membres']], notes: 'Tirage ouvert et sans effort, fumée épaisse et veloutée. Chocolat noir, grain de café torréfié, poivre noir, terre humide et mélasse sucrée sur une longue finale.' }
  },
  epc: {
    title: 'E.P. Carrillo Encore',
    en: { rows: [['Origin', 'Dominican Republic (Tabacalera La Alianza)'], ['Blend', '100 % Nicaraguan puro; wrapper cured in palm-bark tercios'], ['Vitolas', 'Majestic 5⅜" × 52 · Celestial 6⅛" × 50'], ['Rating', '96 pts — #1 Cigar of the Year 2018, Cigar Aficionado'], ['Allocation', 'Vault 2 · Curator’s Reserve']], notes: 'Sweet cedar, cinnamon and nutmeg, caramel, citrus zest and creamy espresso. Medium to medium-full; the club’s house pour pairing is Rémy Martin XO.' },
    fr: { rows: [['Origine', 'République dominicaine (Tabacalera La Alianza)'], ['Assemblage', 'Puro 100 % nicaraguayen ; cape affinée en tercios d’écorce de palmier'], ['Vitoles', 'Majestic 5⅜ po × 52 · Celestial 6⅛ po × 50'], ['Note', '96 pts — Cigare de l’année 2018, Cigar Aficionado'], ['Allocation', 'Cave 2 · Réserve du curateur']], notes: 'Cèdre doux, cannelle et muscade, caramel, zeste d’agrumes et espresso crémeux. Moyen à moyen-corsé ; l’accord maison du club est le Rémy Martin XO.' }
  },
  myfather: {
    title: 'My Father Le Bijou 1922',
    en: { rows: [['Origin', 'Estelí, Nicaragua (My Father Cigars)'], ['Blend', 'Nicaraguan Habano Oscuro wrapper over Nicaraguan fillers'], ['Vitola', 'Torpedo box-pressed 6⅛" × 52'], ['Rating', '97 pts — #1 Cigar of the Year 2015, Cigar Aficionado'], ['Allocation', 'Vault 3 · Founders’ allocation']], notes: 'Full-bodied and decadent: dark cacao, raisins, cracked black pepper and rich espresso. Rest it at least six months in the vault before lighting.' },
    fr: { rows: [['Origine', 'Estelí, Nicaragua (My Father Cigars)'], ['Assemblage', 'Cape Habano Oscuro nicaraguayenne sur tripe nicaraguayenne'], ['Vitole', 'Torpedo pressé en boîte 6⅛ po × 52'], ['Note', '97 pts — Cigare de l’année 2015, Cigar Aficionado'], ['Allocation', 'Cave 3 · Allocation des fondateurs']], notes: 'Corsé et décadent : cacao noir, raisins secs, poivre noir concassé et espresso riche. Laissez-le reposer au moins six mois en cave avant de l’allumer.' }
  }
};
function initDossiers() {
  document.querySelectorAll('[data-dossier]').forEach(b => b.addEventListener('click', () => {
    const d = dossiers[b.getAttribute('data-dossier')]; if (!d) return;
    const loc = d[window.MCC_I18N.lang];
    document.getElementById('dossier-title').textContent = d.title;
    document.getElementById('dossier-body').innerHTML = loc.rows.map(([k, v]) =>
      `<div class="flex justify-between gap-4 border-b border-slate-800 pb-2"><dt class="text-slate-400 text-xs uppercase tracking-wider shrink-0">${k}</dt><dd class="text-slate-200 text-right">${v}</dd></div>`).join('');
    document.getElementById('dossier-notes').textContent = loc.notes;
    openModal('modal-dossier');
  }));
}

/* ==========================================================================
   8. FORMS → Cloudflare Pages Functions (/api/apply, /api/rsvp)
   ========================================================================== */
function initForms() {
  bindForm('form-apply', '/api/apply', 'form.ok.apply');
  bindForm('form-rsvp', '/api/rsvp', 'form.ok.rsvp');
}
function bindForm(id, endpoint, okKey) {
  const form = document.getElementById(id);
  if (!form) return;
  const status = form.querySelector('.form-status');
  const btn = form.querySelector('button[type=submit]');
  const show = (msg, kind) => {
    status.textContent = msg;
    status.className = 'form-status text-sm rounded px-3 py-2 ' + (kind === 'ok' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/60 text-red-300 border border-red-500/30');
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); show(L('form.invalid'), 'err'); return; }
    const data = Object.fromEntries(new FormData(form).entries());
    data.lang = window.MCC_I18N.lang;
    btn.disabled = true; const label = btn.textContent; btn.textContent = L('form.sending');
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (r.status === 429) { show(L('form.rate'), 'err'); }
      else if (!r.ok) { show(L('form.err'), 'err'); }
      else { show(L(okKey), 'ok'); form.reset(); setTimeout(closeModals, 3500); }
    } catch (err) { show(L('form.err'), 'err'); }
    finally { btn.disabled = false; btn.textContent = label; }
  });
}
