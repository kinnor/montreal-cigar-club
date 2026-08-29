/**
 * MONTREAL CIGAR CLUB — bilingual dictionary (EN / FR-CA)
 * Elements opt in with data-i18n="key" (textContent), data-i18n-html="key" (innerHTML),
 * data-i18n-placeholder / data-i18n-aria. Blocks with data-lang="en|fr" are shown/hidden.
 */
window.I18N = {
  en: {
    'age.kicker': 'Private Members Society',
    'age.title': 'Are you 18 or older?',
    'age.body': 'This website presents tobacco products intended for adults only. Under Quebec law you must be at least 18 years old to enter.',
    'age.yes': 'Yes — I am 18 or older',
    'age.no': 'No — take me away',
    'age.note': 'Your answer is stored on this device only.',

    'bar.vault': 'VAULT OPTIMAL', 'bar.vault1': 'Vault 1:', 'bar.audioOff': 'Audio: OFF', 'bar.audioOn': 'Audio: ON (vinyl room tone)', 'bar.members': 'Members',

    'nav.humidor': 'The Humidor', 'nav.pairing': 'Pairing Engine', 'nav.events': 'Events', 'nav.vault': 'The Vault', 'nav.membership': 'Membership', 'nav.about': 'About', 'nav.cta': 'Request Access',

    'hero.kicker': 'Private Members Society · Montreal',
    'hero.title': 'The Apex of Canadian <br><span class="text-gold-gradient">Cigar Excellence</span>',
    'hero.sub': 'Exclusive Access · Curator Selection · Private Humidor Allocations',
    'hero.cta1': 'Explore The Humidor', 'hero.cta2': 'Apply For Allocation',
    'hero.stat1': 'Point Average', 'hero.stat2': 'Aged Spanish Cedar', 'hero.stat3': 'Founder Lockers', 'hero.stat4': 'Bespoke Tastings',

    'humidor.kicker': "Curator's Reserve",
    'humidor.title': 'The <span class="text-gold-gradient">Masterpiece</span> Cabinet',
    'humidor.sub': 'Hand-selected vitolas aged to perfection under continuous climate telemetry.',
    'cigar.wrapper': 'Wrapper:', 'cigar.format': 'Format:', 'cigar.body': 'Body:', 'cigar.dossier': 'View Tasting Dossier',
    'cigar.padron.kicker': 'Nicaraguan Puro', 'cigar.padron.desc': 'Aged for four full years. Delivers signature waves of bittersweet dark cocoa, roasted espresso bean, black pepper, and sweet damp earth.', 'cigar.padron.wrapper': 'Nicaraguan Sun Grown Maduro', 'cigar.padron.format': 'Box-Pressed Robusto / Petit Corona', 'cigar.padron.body': 'Medium-Full to Full',
    'cigar.epc.badge': '#1 CIGAR OF THE YEAR · 96 PTS', 'cigar.epc.kicker': 'Tercio-Aged Wrapper', 'cigar.epc.desc': 'Wrapper leaves aged in palm-bark tercios for two years. A masterclass of aristocratic finesse, sweet cedar, baking spices, caramel, and citrus zest.', 'cigar.epc.wrapper': 'Nicaraguan Tercios Aged', 'cigar.epc.format': 'Soft Box-Pressed Toro / Robusto', 'cigar.epc.body': 'Medium to Medium-Full',
    'cigar.myfather.badge': '#1 CIGAR OF THE YEAR · 97 PTS', 'cigar.myfather.kicker': 'Nicaraguan Oscuro', 'cigar.myfather.desc': "Created in tribute to Don Pepín García's father. A jet-black Oscuro leaf enveloping full-bodied notes of cracked black pepper, dark raisins, and espresso.", 'cigar.myfather.wrapper': 'Habano Oscuro (Nicaragua)', 'cigar.myfather.body': 'Full & Decadent',

    'pairing.kicker': 'Interactive Harmonizer',
    'pairing.title': 'The <span class="text-amber-gradient">Pairing Selector</span>',
    'pairing.sub': 'Select your vitola, rare spirit, and vintage jazz soundtrack to compose an aromatic harmony.',
    'pairing.l1': '1. Select Vitola', 'pairing.l2': '2. Select Spirit', 'pairing.l3': '3. Select Jazz',
    'pairing.spirit.diplomatico': 'Diplomático Reserva Exclusiva Rum', 'pairing.spirit.lagavulin': 'Lagavulin 16 Year (Islay Scotch)',
    'pairing.synergy': 'Aromatic Synergy', 'pairing.c1': 'Cigar Palate', 'pairing.c2': 'Spirit Harmonizer', 'pairing.c3': 'Acoustic Atmosphere',

    'events.kicker': 'Salons & Soirées',
    'events.title': 'The <span class="text-gold-gradient">2026 Season</span>',
    'events.sub': 'Private reserves, vintage rum pairings, and analog vinyl jazz — overlooking the illuminated Mount Royal skyline.',
    'events.rsvp': 'RSVP',
    'events.e1.month': 'Sep 2026', 'events.e1.title': 'Soirée Dégustation — Penthouse Edition', 'events.e1.desc': 'E.P. Carrillo Encore with Rémy Martin XO. Oscar Peterson on vinyl. Twenty guests, one skyline.', 'events.e1.place': 'Private penthouse, downtown Montreal', 'events.e1.cap': '20 guests',
    'events.e2.month': 'Oct 2026', 'events.e2.title': 'Maduro & Rum — Autumn Salon', 'events.e2.desc': 'Padrón 1964 Maduro against Diplomático Reserva Exclusiva. Miles Davis, Kind of Blue, first pressing.', 'events.e2.place': 'Golden Square Mile salon', 'events.e2.cap': '16 guests',
    'events.e3.month': 'Nov 2026', 'events.e3.title': 'Islay Night — Peat & Oscuro', 'events.e3.desc': "My Father Le Bijou 1922 with Lagavulin 16. Chet Baker, late and quiet. Founders' lockers open for the evening.", 'events.e3.place': 'The Vault, members only', 'events.e3.cap': '12 guests',
    'events.note': 'Dates are confirmed to members by invitation. Guests are vetted; seating is strictly limited.',

    'vault.kicker': 'Private Humidor Vault',
    'vault.title': 'Fifty Lockers. <span class="text-gold-gradient">One Climate.</span>',
    'vault.sub': 'Bespoke Spanish-cedar lockers, each with its own sensor, held at 19–20 °C and 68–70 % RH, monitored around the clock.',
    'vault.optimal': 'Optimal', 'vault.temp': 'Temperature', 'vault.rh': 'Humidity', 'vault.lockers': 'Lockers',
    'vault.cedar': 'Spanish cedar, 2019 harvest', 'vault.vintage': 'Vintage & pre-embargo reserve', 'vault.founders': "Founders' allocation",
    'vault.f1.t': 'Per-locker telemetry', 'vault.f1.d': 'Every locker carries its own temperature and humidity probe; members may consult readings in the portal.',
    'vault.f2.t': 'Discreet access', 'vault.f2.d': 'Personal key and passcode. Concierge retrieval available during salons and by appointment.',
    'vault.f3.t': 'Allocation delivery', 'vault.f3.d': 'Member allocations rest in the vault for a minimum of 30 days before release — never shipped fresh.',

    'member.kicker': 'The Inner Circle',
    'member.title': 'Membership & <span class="text-gold-gradient">Privileges</span>',
    'member.sub': 'By invitation and selective committee vetting only.', 'member.year': 'CAD / Year',
    'member.t1.kicker': 'Social & Tasting Access', 'member.t1.b1': 'Guaranteed access to all quarterly private tasting salons', 'member.t1.b2': 'Curated member allocations of rare & limited vitolas', 'member.t1.b3': 'Digital concierge & private tasting reservations', 'member.t1.b4': 'One guest per salon, subject to vetting', 'member.t1.cta': 'Apply For Le Cercle',
    'member.t2.badge': 'Limited to 50 Lockers', 'member.t2.kicker': 'Private Humidor Vault', 'member.t2.b1': '<strong>Bespoke Spanish cedar humidor locker</strong> with individual sensors', 'member.t2.b2': 'VIP priority access to pre-embargo & vintage cigar box allocations', 'member.t2.b3': 'Reciprocal private club privileges in London, Geneva, and New York', 'member.t2.b4': 'Complimentary guest passes for all private rooftop events', 'member.t2.b5': 'Everything in Le Cercle', 'member.t2.cta': 'Apply For Founder Vault',
    'member.how1.t': '1. Apply', 'member.how1.d': 'A confidential inquiry — name, contact, and a word about your palate.',
    'member.how2.t': '2. Conversation', 'member.how2.d': 'A founding member meets you over a cigar. No forms, no interviews.',
    'member.how3.t': '3. Committee', 'member.how3.d': 'The committee decides within thirty days. Discretion in both directions.',

    'about.kicker': 'The Club',
    'about.title': 'Montreal, <span class="text-gold-gradient">by the Mountain</span>',
    'about.p1': 'The Montreal Cigar Club was founded in 2026 by a small circle of collectors who wanted one thing: a room in this city where a serious cigar, a serious pour, and serious music could be enjoyed without hurry.',
    'about.p2': 'We source directly — Estelí, the Dominican Republic, and the Canadian domestic market — and rest every stick in Spanish cedar before it reaches a member. The club is bilingual, private, and unapologetically Montréalais: the fleur-de-lis on our crest is not decoration.',
    'about.founder1.t': 'Founding Curator', 'about.founder1.d': 'Selection, sourcing, and the vault. Twenty years of collecting, three continents.',
    'about.founder2.t': 'Music & Salons', 'about.founder2.d': 'Programs each evening from an analog jazz collection; runs the room.',
    'about.founder3.t': 'Committee', 'about.founder3.d': 'Three founding members vet every application. Decisions are unanimous or not at all.',
    'about.quote': '"Nothing better than the Montreal Cigar Club." — a member, to a friend in Meissen',

    'footer.addr': 'Golden Square Mile · Montreal, Quebec, Canada',
    'footer.age': 'Strictly 18+ (legal age in Quebec). Members-only society.',
    'footer.privacy': 'Privacy', 'footer.terms': 'Terms',
    'footer.legal': 'Tobacco products are harmful. This site does not sell tobacco and is intended for adults 18+ only.',
    'footer.copy': '© 2026 Montreal Cigar Club. All rights reserved.',

    'apply.kicker': 'Private Vetting', 'apply.title': 'Membership Application', 'apply.sub': 'Please complete the confidential inquiry below.',
    'apply.name': 'Full legal name', 'apply.email': 'Confidential email', 'apply.phone': 'Telephone (optional)', 'apply.tier': 'Desired tier',
    'apply.tier2': 'Le Fondateur — $4,500 CAD (private vault locker)', 'apply.notes': 'Preferred vitolas / notes',
    'apply.age': 'I confirm that I am at least 18 years old and consent to being contacted about my application.',
    'apply.submit': 'Submit Confidential Application',

    'rsvp.kicker': 'Salon Invitation', 'rsvp.title': 'Request a Seat', 'rsvp.guests': 'Seats', 'rsvp.member': 'Member ID (if any)', 'rsvp.notes': 'Dietary notes / message',
    'rsvp.age': 'I confirm that all guests are at least 18 years old.', 'rsvp.submit': 'Request Invitation',

    'dossier.kicker': 'Tasting Dossier',
    'login.title': 'Member Vault Portal', 'login.soon': 'The member portal opens with the first salon of the season. Founding members receive their key and passcode by hand.', 'login.contact': 'Contact the Vault',

    'form.sending': 'Sending…', 'form.ok.apply': 'Received. The Membership Committee will review your application with strict discretion and reply within thirty days.',
    'form.ok.rsvp': 'Received. If a seat is available, the concierge will confirm by email.',
    'form.err': 'Something went wrong. Please try again, or write to concierge@montrealcigarclub.ca.',
    'form.invalid': 'Please complete the required fields.', 'form.rate': 'Too many requests from this connection. Please try again later.',

    'legal.back': '← Back to the club'
  },

  fr: {
    'age.kicker': 'Société privée réservée aux membres',
    'age.title': 'Avez-vous 18 ans ou plus?',
    'age.body': 'Ce site présente des produits du tabac destinés exclusivement aux adultes. Au Québec, vous devez avoir au moins 18 ans pour y accéder.',
    'age.yes': 'Oui — j’ai 18 ans ou plus',
    'age.no': 'Non — quitter le site',
    'age.note': 'Votre réponse est conservée sur cet appareil seulement.',

    'bar.vault': 'CAVE OPTIMALE', 'bar.vault1': 'Cave 1 :', 'bar.audioOff': 'Audio : ARRÊT', 'bar.audioOn': 'Audio : MARCHE (ambiance vinyle)', 'bar.members': 'Membres',

    'nav.humidor': 'Le humidor', 'nav.pairing': 'Moteur d’accords', 'nav.events': 'Événements', 'nav.vault': 'La cave', 'nav.membership': 'Adhésion', 'nav.about': 'À propos', 'nav.cta': 'Demander l’accès',

    'hero.kicker': 'Société privée · Montréal',
    'hero.title': 'Le sommet de l’excellence <br><span class="text-gold-gradient">du cigare au Canada</span>',
    'hero.sub': 'Accès exclusif · Sélection du curateur · Allocations privées en humidor',
    'hero.cta1': 'Découvrir le humidor', 'hero.cta2': 'Demander une allocation',
    'hero.stat1': 'Note moyenne', 'hero.stat2': 'Cèdre espagnol vieilli', 'hero.stat3': 'Casiers fondateurs', 'hero.stat4': 'Dégustations sur mesure',

    'humidor.kicker': 'Réserve du curateur',
    'humidor.title': 'Le cabinet des <span class="text-gold-gradient">chefs-d’œuvre</span>',
    'humidor.sub': 'Des vitoles choisies à la main et vieillies à la perfection sous télémétrie climatique continue.',
    'cigar.wrapper': 'Cape :', 'cigar.format': 'Format :', 'cigar.body': 'Corps :', 'cigar.dossier': 'Voir le dossier de dégustation',
    'cigar.padron.kicker': 'Puro nicaraguayen', 'cigar.padron.desc': 'Vieilli quatre années complètes. Des vagues signature de cacao noir doux-amer, de grain d’espresso torréfié, de poivre noir et de terre humide sucrée.', 'cigar.padron.wrapper': 'Maduro nicaraguayen cultivé au soleil', 'cigar.padron.format': 'Robusto / Petit Corona pressé en boîte', 'cigar.padron.body': 'Moyen-corsé à corsé',
    'cigar.epc.badge': 'CIGARE DE L’ANNÉE · 96 PTS', 'cigar.epc.kicker': 'Cape vieillie en tercios', 'cigar.epc.desc': 'Feuilles de cape vieillies deux ans en tercios d’écorce de palmier. Une leçon de finesse aristocratique : cèdre doux, épices à pâtisserie, caramel et zeste d’agrumes.', 'cigar.epc.wrapper': 'Nicaraguayenne vieillie en tercios', 'cigar.epc.format': 'Toro / Robusto légèrement pressé', 'cigar.epc.body': 'Moyen à moyen-corsé',
    'cigar.myfather.badge': 'CIGARE DE L’ANNÉE · 97 PTS', 'cigar.myfather.kicker': 'Oscuro nicaraguayen', 'cigar.myfather.desc': 'Créé en hommage au père de Don Pepín García. Une cape Oscuro d’un noir de jais enveloppant des notes corsées de poivre noir concassé, de raisins secs et d’espresso.', 'cigar.myfather.wrapper': 'Habano Oscuro (Nicaragua)', 'cigar.myfather.body': 'Corsé et décadent',

    'pairing.kicker': 'Harmoniseur interactif',
    'pairing.title': 'Le <span class="text-amber-gradient">sélecteur d’accords</span>',
    'pairing.sub': 'Choisissez votre vitole, votre spiritueux rare et votre bande sonore jazz pour composer une harmonie aromatique.',
    'pairing.l1': '1. Choisir la vitole', 'pairing.l2': '2. Choisir le spiritueux', 'pairing.l3': '3. Choisir le jazz',
    'pairing.spirit.diplomatico': 'Rhum Diplomático Reserva Exclusiva', 'pairing.spirit.lagavulin': 'Lagavulin 16 ans (scotch d’Islay)',
    'pairing.synergy': 'Synergie aromatique', 'pairing.c1': 'Palais du cigare', 'pairing.c2': 'Spiritueux harmonisant', 'pairing.c3': 'Atmosphère acoustique',

    'events.kicker': 'Salons et soirées',
    'events.title': 'La <span class="text-gold-gradient">saison 2026</span>',
    'events.sub': 'Réserves privées, accords de rhums millésimés et jazz sur vinyle — avec vue sur le mont Royal illuminé.',
    'events.rsvp': 'Réserver',
    'events.e1.month': 'Sept. 2026', 'events.e1.title': 'Soirée dégustation — édition penthouse', 'events.e1.desc': 'E.P. Carrillo Encore et Rémy Martin XO. Oscar Peterson sur vinyle. Vingt convives, une seule skyline.', 'events.e1.place': 'Penthouse privé, centre-ville de Montréal', 'events.e1.cap': '20 convives',
    'events.e2.month': 'Oct. 2026', 'events.e2.title': 'Maduro et rhum — salon d’automne', 'events.e2.desc': 'Padrón 1964 Maduro face au Diplomático Reserva Exclusiva. Miles Davis, Kind of Blue, premier pressage.', 'events.e2.place': 'Salon du Mille carré doré', 'events.e2.cap': '16 convives',
    'events.e3.month': 'Nov. 2026', 'events.e3.title': 'Nuit d’Islay — tourbe et Oscuro', 'events.e3.desc': 'My Father Le Bijou 1922 avec Lagavulin 16. Chet Baker, tard et en douceur. Les casiers des fondateurs sont ouverts pour la soirée.', 'events.e3.place': 'La cave, membres seulement', 'events.e3.cap': '12 convives',
    'events.note': 'Les dates sont confirmées aux membres sur invitation. Les invités sont vérifiés ; les places sont strictement limitées.',

    'vault.kicker': 'Cave à cigares privée',
    'vault.title': 'Cinquante casiers. <span class="text-gold-gradient">Un seul climat.</span>',
    'vault.sub': 'Des casiers sur mesure en cèdre espagnol, chacun muni de son capteur, maintenus à 19–20 °C et 68–70 % HR, surveillés jour et nuit.',
    'vault.optimal': 'Optimal', 'vault.temp': 'Température', 'vault.rh': 'Humidité', 'vault.lockers': 'Casiers',
    'vault.cedar': 'Cèdre espagnol, récolte 2019', 'vault.vintage': 'Réserve millésimée et pré-embargo', 'vault.founders': 'Allocation des fondateurs',
    'vault.f1.t': 'Télémétrie par casier', 'vault.f1.d': 'Chaque casier possède sa propre sonde de température et d’humidité ; les membres peuvent consulter les relevés dans le portail.',
    'vault.f2.t': 'Accès discret', 'vault.f2.d': 'Clé personnelle et code d’accès. Retrait par le concierge pendant les salons et sur rendez-vous.',
    'vault.f3.t': 'Remise des allocations', 'vault.f3.d': 'Les allocations reposent en cave au moins 30 jours avant leur remise — jamais expédiées fraîches.',

    'member.kicker': 'Le cercle intime',
    'member.title': 'Adhésion et <span class="text-gold-gradient">privilèges</span>',
    'member.sub': 'Sur invitation et après examen sélectif du comité seulement.', 'member.year': 'CAD / an',
    'member.t1.kicker': 'Accès social et dégustations', 'member.t1.b1': 'Accès garanti à tous les salons de dégustation privés trimestriels', 'member.t1.b2': 'Allocations de vitoles rares et limitées, sélectionnées pour les membres', 'member.t1.b3': 'Concierge numérique et réservations de dégustations privées', 'member.t1.b4': 'Un invité par salon, sous réserve de vérification', 'member.t1.cta': 'Postuler au Cercle',
    'member.t2.badge': 'Limité à 50 casiers', 'member.t2.kicker': 'Cave à cigares privée', 'member.t2.b1': '<strong>Casier humidor sur mesure en cèdre espagnol</strong> avec capteurs individuels', 'member.t2.b2': 'Accès prioritaire VIP aux allocations de boîtes millésimées et pré-embargo', 'member.t2.b3': 'Privilèges réciproques dans des clubs privés à Londres, Genève et New York', 'member.t2.b4': 'Laissez-passer pour invités à tous les événements privés sur les toits', 'member.t2.b5': 'Tous les avantages du Cercle', 'member.t2.cta': 'Postuler à la cave des fondateurs',
    'member.how1.t': '1. Candidature', 'member.how1.d': 'Une demande confidentielle — nom, coordonnées et un mot sur votre palais.',
    'member.how2.t': '2. Conversation', 'member.how2.d': 'Un membre fondateur vous rencontre autour d’un cigare. Ni formulaire, ni entrevue.',
    'member.how3.t': '3. Comité', 'member.how3.d': 'Le comité tranche dans les trente jours. Discrétion dans les deux sens.',

    'about.kicker': 'Le club',
    'about.title': 'Montréal, <span class="text-gold-gradient">au pied de la montagne</span>',
    'about.p1': 'Le Club de Cigare de Montréal a été fondé en 2026 par un petit cercle de collectionneurs qui ne voulaient qu’une chose : un lieu, dans cette ville, où savourer sans hâte un grand cigare, un grand verre et une grande musique.',
    'about.p2': 'Nous nous approvisionnons directement — Estelí, la République dominicaine et le marché canadien — et chaque cigare repose dans le cèdre espagnol avant d’atteindre un membre. Le club est bilingue, privé et résolument montréalais : la fleur de lys de notre blason n’est pas une décoration.',
    'about.founder1.t': 'Curateur fondateur', 'about.founder1.d': 'Sélection, approvisionnement et la cave. Vingt ans de collection, trois continents.',
    'about.founder2.t': 'Musique et salons', 'about.founder2.d': 'Programme chaque soirée à partir d’une collection de jazz analogique ; tient la salle.',
    'about.founder3.t': 'Comité', 'about.founder3.d': 'Trois membres fondateurs examinent chaque candidature. Les décisions sont unanimes, ou ne sont pas.',
    'about.quote': '« Rien de mieux que le Club de Cigare de Montréal. » — un membre, à un ami de Meissen',

    'footer.addr': 'Mille carré doré · Montréal (Québec) Canada',
    'footer.age': 'Réservé aux 18 ans et plus (âge légal au Québec). Société privée réservée aux membres.',
    'footer.privacy': 'Confidentialité', 'footer.terms': 'Conditions',
    'footer.legal': 'Les produits du tabac sont nocifs. Ce site ne vend pas de tabac et s’adresse uniquement aux adultes de 18 ans et plus.',
    'footer.copy': '© 2026 Club de Cigare de Montréal. Tous droits réservés.',

    'apply.kicker': 'Examen privé', 'apply.title': 'Demande d’adhésion', 'apply.sub': 'Veuillez remplir la demande confidentielle ci-dessous.',
    'apply.name': 'Nom légal complet', 'apply.email': 'Courriel confidentiel', 'apply.phone': 'Téléphone (facultatif)', 'apply.tier': 'Niveau souhaité',
    'apply.tier2': 'Le Fondateur — 4 500 $ CAD (casier privé en cave)', 'apply.notes': 'Vitoles préférées / notes',
    'apply.age': 'Je confirme avoir au moins 18 ans et j’accepte d’être contacté au sujet de ma demande.',
    'apply.submit': 'Envoyer la demande confidentielle',

    'rsvp.kicker': 'Invitation au salon', 'rsvp.title': 'Demander une place', 'rsvp.guests': 'Places', 'rsvp.member': 'No de membre (le cas échéant)', 'rsvp.notes': 'Restrictions alimentaires / message',
    'rsvp.age': 'Je confirme que tous les invités ont au moins 18 ans.', 'rsvp.submit': 'Demander une invitation',

    'dossier.kicker': 'Dossier de dégustation',
    'login.title': 'Portail des membres', 'login.soon': 'Le portail des membres ouvre avec le premier salon de la saison. Les membres fondateurs reçoivent leur clé et leur code en main propre.', 'login.contact': 'Écrire à la cave',

    'form.sending': 'Envoi…', 'form.ok.apply': 'Bien reçu. Le comité d’adhésion examinera votre demande en toute discrétion et vous répondra dans les trente jours.',
    'form.ok.rsvp': 'Bien reçu. Si une place est disponible, le concierge confirmera par courriel.',
    'form.err': 'Une erreur est survenue. Veuillez réessayer ou écrire à concierge@montrealcigarclub.ca.',
    'form.invalid': 'Veuillez remplir les champs obligatoires.', 'form.rate': 'Trop de demandes depuis cette connexion. Veuillez réessayer plus tard.',

    'legal.back': '← Retour au club'
  }
};

(function () {
  const KEY = 'mcc_lang';
  function detect() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'fr' || q === 'en') return q;
    try { const s = localStorage.getItem(KEY); if (s === 'fr' || s === 'en') return s; } catch (e) {}
    return (navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }
  function t(key, lang) {
    const d = window.I18N[lang] || window.I18N.en;
    return key in d ? d[key] : (window.I18N.en[key] !== undefined ? window.I18N.en[key] : null);
  }
  function apply(lang) {
    document.documentElement.lang = lang === 'fr' ? 'fr-CA' : 'en-CA';
    document.querySelectorAll('[data-i18n]').forEach(el => { const v = t(el.getAttribute('data-i18n'), lang); if (v !== null) el.textContent = v; });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { const v = t(el.getAttribute('data-i18n-html'), lang); if (v !== null) el.innerHTML = v; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const v = t(el.getAttribute('data-i18n-placeholder'), lang); if (v !== null) el.placeholder = v; });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { const v = t(el.getAttribute('data-i18n-aria'), lang); if (v !== null) el.setAttribute('aria-label', v); });
    document.querySelectorAll('[data-lang]').forEach(el => { el.hidden = el.getAttribute('data-lang') !== lang; });
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) btn.textContent = lang === 'fr' ? 'EN' : 'FR';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('mcc:lang', { detail: { lang } }));
  }
  window.MCC_I18N = {
    get lang() { return document.documentElement.lang.startsWith('fr') ? 'fr' : 'en'; },
    t: (key) => t(key, window.MCC_I18N.lang),
    set: apply,
    toggle: () => apply(window.MCC_I18N.lang === 'fr' ? 'en' : 'fr'),
    init: () => apply(detect())
  };
})();
