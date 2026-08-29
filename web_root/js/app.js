/**
 * MONTREAL CIGAR CLUB — Interactive Application Logic
 * Pairing Engine, Dynamic Telemetry, Audio Synthesis, and Multilingual Support
 */

document.addEventListener('DOMContentLoaded', () => {
  initPairingEngine();
  initHumidorTelemetry();
  initAudioPlayer();
  initLanguageToggle();
  initModals();
  initMobileMenu();
  if (window.lucide) lucide.createIcons();
});

/* ==========================================================================
   1. SIGNATURE PAIRING ENGINE (Cigar + Spirit + Jazz)
   ========================================================================== */
const pairingDatabase = {
  "padron_remy_oscar": {
    harmony: "Dark Cacao & Velvet Swing",
    cigarNote: "Heavy cocoa, roasted espresso, and black pepper from the 4-year aged Maduro wrapper.",
    spiritNote: "Candied orange peel, ripe figs, and opulent French oak tannins from Rémy Martin XO.",
    jazzNote: "Oscar Peterson’s buoyant Montreal piano lines balance the dense Nicaraguan body with melodic elegance.",
    score: "99 / 100 — Masterclass Pairing"
  },
  "padron_diplomatico_miles": {
    harmony: "Molasses Ember & Smoky Nocturne",
    cigarNote: "Earthy, robust chocolate sweetness and signature dense smoke output.",
    spiritNote: "Toffee, caramelized brown sugar, and dark honey from 12-year pot still rum.",
    jazzNote: "Miles Davis' muted trumpet in 'Kind of Blue' mirrors the slow, meditative burn of the Maduro.",
    score: "98 / 100 — Transcendent Harmony"
  },
  "epc_remy_billevans": {
    harmony: "Tercio Cedar & Aristocratic Nuance",
    cigarNote: "Aged palm-bark fermentation yields sweet cedar, cinnamon, and delicate citrus zest.",
    spiritNote: "Velvety floral bouquet, toasted hazelnuts, and lingering dried apricot.",
    jazzNote: "Bill Evans' subtle harmonic voicings on 'Waltz for Debby' complement the Encore's refined finesse.",
    score: "99 / 100 — Connoisseur Gold"
  },
  "epc_diplomatico_coltrane": {
    harmony: "Baking Spice & Tenor Resonance",
    cigarNote: "Layered complexity with nutmeg, toasted almond, and sweet tobacco leaf.",
    spiritNote: "Silky dark molasses, oak vanillin, and rich dried plums.",
    jazzNote: "Coltrane’s soaring saxophone mirrors the rich, evolving mid-palate intensity of the Encore.",
    score: "97 / 100 — Deep Soul Connection"
  },
  "myfather_lagavulin_chet": {
    harmony: "Peat, Pepper & Melancholy Romance",
    cigarNote: "Dark Nicaraguan Oscuro delivers spicy black pepper, dark raisins, and earthy depth.",
    spiritNote: "Intense Islay peat smoke, iodine, sweet maritime sea salt, and malted barley.",
    jazzNote: "Chet Baker's whisper-soft trumpet and vulnerable vocals create an intimate late-night atmosphere.",
    score: "98 / 100 — Autumn Velvet"
  }
};

function initPairingEngine() {
  const cigarSelect = document.getElementById('select-cigar');
  const spiritSelect = document.getElementById('select-spirit');
  const jazzSelect = document.getElementById('select-jazz');
  const harmonyTitle = document.getElementById('pairing-harmony-title');
  const cigarDesc = document.getElementById('pairing-cigar-desc');
  const spiritDesc = document.getElementById('pairing-spirit-desc');
  const jazzDesc = document.getElementById('pairing-jazz-desc');
  const scoreBadge = document.getElementById('pairing-score-badge');

  if (!cigarSelect || !spiritSelect || !jazzSelect) return;

  function updatePairing() {
    const key = `${cigarSelect.value}_${spiritSelect.value}_${jazzSelect.value}`;
    const defaultData = {
      harmony: "Curated Bespoke Symphony",
      cigarNote: "Rich artisan leaf aged to perfection in our private Montreal humidor vault.",
      spiritNote: "Aged spirit offering warm caramel, oak structure, and velvety finish.",
      jazzNote: "Classic analog acoustic jazz from legendary Montreal and international vinyl masters.",
      score: "96 / 100 — Harmonious"
    };

    const data = pairingDatabase[key] || defaultData;

    harmonyTitle.style.opacity = '0';
    setTimeout(() => {
      harmonyTitle.textContent = data.harmony;
      cigarDesc.textContent = data.cigarNote;
      spiritDesc.textContent = data.spiritNote;
      jazzDesc.textContent = data.jazzNote;
      scoreBadge.textContent = data.score;
      harmonyTitle.style.opacity = '1';
    }, 200);
  }

  cigarSelect.addEventListener('change', updatePairing);
  spiritSelect.addEventListener('change', updatePairing);
  jazzSelect.addEventListener('change', updatePairing);
}

/* ==========================================================================
   2. LIVE HUMIDOR CLIMATE TELEMETRY
   ========================================================================== */
function initHumidorTelemetry() {
  const tempElem = document.getElementById('telemetry-temp');
  const rhElem = document.getElementById('telemetry-rh');

  if (!tempElem || !rhElem) return;

  setInterval(() => {
    const temp = (19.4 + Math.random() * 0.4).toFixed(1);
    const rh = (68.9 + Math.random() * 0.5).toFixed(1);
    tempElem.textContent = `${temp}°C`;
    rhElem.textContent = `${rh}% RH`;
  }, 4000);
}

/* ==========================================================================
   3. AMBIENT LOUNGE AUDIO & SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let isPlaying = false;
let noiseNode = null;
let gainNode = null;

function initAudioPlayer() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioText = document.getElementById('audio-toggle-text');
  const eqBars = document.querySelectorAll('.eq-bar');

  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startVinylAudio();
      isPlaying = true;
      audioText.textContent = "Audio: ON (Oscar Peterson Trio)";
      eqBars.forEach(bar => bar.style.animationPlayState = 'running');
    } else {
      stopVinylAudio();
      isPlaying = false;
      audioText.textContent = "Audio: OFF";
      eqBars.forEach(bar => bar.style.animationPlayState = 'paused');
    }
  });
}

function startVinylAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Create warm vinyl ambient crackle / jazz drone
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.012;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm jazz room acoustics
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    whiteNoise.start(0);
  } catch (e) {
    console.log("AudioContext initialized upon user gesture.");
  }
}

function stopVinylAudio() {
  if (audioCtx) {
    audioCtx.close();
  }
}

/* ==========================================================================
   4. BILINGUAL LANGUAGE SWITCHER (EN / FR)
   ========================================================================== */
function initLanguageToggle() {
  const langBtn = document.getElementById('lang-toggle-btn');
  if (!langBtn) return;

  let currentLang = 'EN';
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'EN' ? 'FR' : 'EN';
    langBtn.textContent = currentLang === 'EN' ? 'FR / EN' : 'EN / FR';
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = currentLang === 'EN' ? el.getAttribute('data-en') : el.getAttribute('data-fr');
    });
  });
}

/* ==========================================================================
   5. LUXURY MODALS (Cigar Details, Membership, Concierge)
   ========================================================================== */
function initModals() {
  const modals = document.querySelectorAll('.modal-backdrop');
  const closeBtns = document.querySelectorAll('.modal-close');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modals.forEach(m => m.classList.add('hidden'));
    });
  });

  window.addEventListener('click', (e) => {
    modals.forEach(m => {
      if (e.target === m) m.classList.add('hidden');
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('hidden');
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
    btn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    btn.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="w-5 h-5"></i>';
    if (window.lucide) lucide.createIcons();
  };
  btn.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}
