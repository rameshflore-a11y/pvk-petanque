/* ===================== STOCKAGE localStorage ===================== */

/* ===================== DONNÉES ===================== */

const NEWS = [
  { id:1, type:'urgent', accent:'', title:'🏆 Félicitations à nos champions !', body:"L'équipe A remporte le Tournoi Départemental 2025 ! Bravo à Ahmed, Pierre et Carlos pour cette magnifique victoire en finale.", date:'28 Mai 2025' },
  { id:2, type:'tournoi', accent:'gold', title:'Tournoi Interne Été — 14 Juin', body:'Le grand tournoi interne de l\'été aura lieu le 14 juin. Inscriptions ouvertes jusqu\'au 10 juin. Format doublettes, 16 équipes maximum.', date:'1 Juin 2025' },
  { id:3, type:'info', accent:'green', title:'Cotisations saison 2025-2026', body:'La nouvelle saison a commencé ! Pensez à régler votre cotisation de 49€ avant le 30 juin pour conserver votre accès complet.', date:'1 Juin 2025' },
  { id:4, type:'annonce', accent:'', title:'Nouveau terrain disponible', body:'Un troisième terrain est désormais disponible le week-end. Réservation via l\'application ou directement auprès du bureau.', date:'25 Mai 2025' },
  { id:5, type:'info', accent:'green', title:'Entraînement Spécial Débutants', body:'Chaque samedi matin de 10h à 12h, un entraînement spécial est organisé pour les nouveaux membres. Venez nombreux !', date:'20 Mai 2025' },
];

const AGENDA_CLUB = [
  { day:14, month:'Juin', year:2025, name:'Tournoi Interne Été', detail:'📍 Terrain A — 9h00 · Doublettes', type:'tournoi' },
  { day:21, month:'Juin', year:2025, name:'Fête de la Pétanque', detail:'🎉 Terrain principal — 15h00', type:'special' },
  { day:5,  month:'Juillet', year:2025, name:'Championnat Régional', detail:'📍 Stade Municipal — 8h30', type:'tournoi' },
  { day:19, month:'Juillet', year:2025, name:'Tournoi Mixte', detail:'📍 Terrain principal — 10h00', type:'tournoi' },
  { day:2,  month:'Août', year:2025, name:'Tournoi Vacances', detail:'📍 Terrain A & B — 9h00', type:'tournoi' },
  { day:6,  month:'Septembre', year:2025, name:'Reprise officielle', detail:'📍 Terrain principal — 10h00', type:'special' },
  { day:20, month:'Septembre', year:2025, name:'Coupe du Club', detail:'📍 Tous terrains — 9h00', type:'tournoi' },
  { day:18, month:'Octobre', year:2025, name:'Tournoi Automne', detail:'📍 Terrain A — 9h00 · Triplettes', type:'tournoi' },
  { day:1,  month:'Juin', year:2026, name:'Début saison 2026-2027', detail:'🎯 Renouvellement des adhésions', type:'special' },
];

const AGENDA_FRANCE = [
  // ── 2025 ──
  // Vacances scolaires Zone C (Paris / Île-de-France)
  { day:22, month:'Février',  year:2025, name:'🏫 Vacances Hiver — Zone C',    detail:'📚 Île-de-France · du 22 fév au 10 mars 2025', type:'vacances' },
  { day:10, month:'Mars',     year:2025, name:'🔔 Rentrée après Vacances Hiver',detail:'📚 Reprise des cours — Zone C Île-de-France', type:'vacances' },
  { day:26, month:'Avril',    year:2025, name:'🏫 Vacances Printemps — Zone C', detail:'📚 Île-de-France · du 26 avr au 12 mai 2025', type:'vacances' },
  { day:12, month:'Mai',      year:2025, name:'🔔 Rentrée après Vacances Printemps', detail:'📚 Reprise des cours — Zone C Île-de-France', type:'vacances' },
  { day:5,  month:'Juillet',  year:2025, name:'☀️ Grandes Vacances — Début',   detail:'📚 Vacances d\'été · du 5 juillet au 1er sept 2025', type:'vacances' },
  { day:2,  month:'Septembre',year:2025, name:'🔔 Rentrée Scolaire 2025-2026', detail:'📚 Reprise des cours — toutes zones', type:'vacances' },
  { day:18, month:'Octobre',  year:2025, name:'🏫 Vacances Toussaint — Zone C', detail:'📚 Île-de-France · du 18 oct au 3 nov 2025', type:'vacances' },
  { day:3,  month:'Novembre', year:2025, name:'🔔 Rentrée après Toussaint',     detail:'📚 Reprise des cours — Zone C Île-de-France', type:'vacances' },
  { day:20, month:'Décembre', year:2025, name:'🏫 Vacances Noël — Zone C',      detail:'📚 Île-de-France · du 20 déc 2025 au 5 jan 2026', type:'vacances' },
  // Jours fériés 2025
  { day:1,  month:'Janvier',  year:2025, name:"Jour de l'An 🎉",        detail:'🇫🇷 Jour férié national', type:'ferie' },
  { day:21, month:'Avril',    year:2025, name:'Lundi de Pâques 🐣',     detail:'🇫🇷 Pâques le 20 avril — férié le 21', type:'ferie' },
  { day:1,  month:'Mai',      year:2025, name:'Fête du Travail 🌹',     detail:'🇫🇷 Jour férié — manifestations syndicales', type:'ferie' },
  { day:8,  month:'Mai',      year:2025, name:'Victoire 1945 🕊️',       detail:'🇫🇷 Fin de la Seconde Guerre mondiale en Europe', type:'ferie' },
  { day:29, month:'Mai',      year:2025, name:'Ascension ✝️',           detail:'🇫🇷 Jeudi de l\'Ascension — jour férié', type:'ferie' },
  { day:9,  month:'Juin',     year:2025, name:'Lundi de Pentecôte 🕊️', detail:'🇫🇷 Jour de solidarité — jour férié', type:'ferie' },
  { day:14, month:'Juillet',  year:2025, name:'Fête Nationale 🎆',      detail:'🇫🇷 Défilé militaire · Feux d\'artifice · Bals', type:'ferie' },
  { day:15, month:'Août',     year:2025, name:'Assomption 🙏',          detail:'🇫🇷 Jour férié national', type:'ferie' },
  { day:1,  month:'Novembre', year:2025, name:'Toussaint 🕯️',          detail:'🇫🇷 Jour des défunts — cimetières ouverts', type:'ferie' },
  { day:11, month:'Novembre', year:2025, name:'Armistice 1918 🪖',      detail:'🇫🇷 Commémoration fin de la Grande Guerre', type:'ferie' },
  { day:25, month:'Décembre', year:2025, name:'Noël 🎄',               detail:'🇫🇷 Jour férié national', type:'ferie' },
  // ── 2026 ──
  // Vacances scolaires Zone C (Paris / Île-de-France)
  { day:5,  month:'Janvier',  year:2026, name:'🔔 Rentrée après Noël',          detail:'📚 Reprise des cours — Zone C Île-de-France', type:'vacances' },
  { day:21, month:'Février',  year:2026, name:'🏫 Vacances Hiver — Zone C',     detail:'📚 Île-de-France · du 21 fév au 9 mars 2026', type:'vacances' },
  { day:9,  month:'Mars',     year:2026, name:'🔔 Rentrée après Vacances Hiver', detail:'📚 Reprise des cours — Zone C Île-de-France', type:'vacances' },
  { day:25, month:'Avril',    year:2026, name:'🏫 Vacances Printemps — Zone C',  detail:'📚 Île-de-France · du 25 avr au 11 mai 2026', type:'vacances' },
  { day:11, month:'Mai',      year:2026, name:'🔔 Rentrée après Vacances Printemps', detail:'📚 Reprise des cours — Zone C Île-de-France', type:'vacances' },
  { day:4,  month:'Juillet',  year:2026, name:'☀️ Grandes Vacances — Début',    detail:'📚 Vacances d\'été · à partir du 4 juillet 2026', type:'vacances' },
  // Jours fériés 2026
  { day:1,  month:'Janvier',  year:2026, name:"Jour de l'An 🎉",        detail:'🇫🇷 Jour férié national', type:'ferie' },
  { day:6,  month:'Avril',    year:2026, name:'Lundi de Pâques 🐣',     detail:'🇫🇷 Pâques le 5 avril — férié le 6', type:'ferie' },
  { day:1,  month:'Mai',      year:2026, name:'Fête du Travail 🌹',     detail:'🇫🇷 Jour férié national', type:'ferie' },
  { day:8,  month:'Mai',      year:2026, name:'Victoire 1945 🕊️',       detail:'🇫🇷 Jour férié national', type:'ferie' },
  { day:14, month:'Mai',      year:2026, name:'Ascension ✝️',           detail:'🇫🇷 39 jours après Pâques — jour férié', type:'ferie' },
  { day:25, month:'Mai',      year:2026, name:'Lundi de Pentecôte 🕊️', detail:'🇫🇷 50 jours après Pâques — jour férié', type:'ferie' },
  { day:14, month:'Juillet',  year:2026, name:'Fête Nationale 🎆',      detail:'🇫🇷 Défilé militaire · Feux d\'artifice', type:'ferie' },
  { day:15, month:'Août',     year:2026, name:'Assomption 🙏',          detail:'🇫🇷 Jour férié national', type:'ferie' },
  { day:1,  month:'Novembre', year:2026, name:'Toussaint 🕯️',          detail:'🇫🇷 Jour des défunts', type:'ferie' },
  { day:11, month:'Novembre', year:2026, name:'Armistice 1918 🪖',      detail:'🇫🇷 Commémoration fin de la Grande Guerre', type:'ferie' },
  { day:25, month:'Décembre', year:2026, name:'Noël 🎄',               detail:'🇫🇷 Jour férié national', type:'ferie' },
];

const AGENDA_INDE = [
  // ── 2025 ──
  { day:14, month:'Janvier',   year:2025, name:'Pongal 🌾',                     detail:'🇮🇳 Fête des récoltes tamoule (Tai Pongal) — 4 jours du 14 au 17 jan', type:'ferie' },
  { day:14, month:'Janvier',   year:2025, name:'Makar Sankranti 🪁',            detail:'🇮🇳 Entrée du soleil dans le Capricorne — cerfs-volants', type:'ferie' },
  { day:26, month:'Janvier',   year:2025, name:"Fête de la République 🇮🇳",    detail:'🇮🇳 76e fête de la République de l\'Inde — New Delhi', type:'ferie' },
  { day:26, month:'Février',   year:2025, name:'Maha Shivaratri 🕉️',           detail:'🇮🇳 Grande nuit de Shiva — jeûne et prières nocturnes', type:'ferie' },
  { day:13, month:'Mars',      year:2025, name:'Holika Dahan 🔥',               detail:'🇮🇳 Bûcher de Holika la veille de Holi', type:'ferie' },
  { day:14, month:'Mars',      year:2025, name:'Holi 🎨',                       detail:'🇮🇳 Fête des couleurs — célébration du printemps', type:'ferie' },
  { day:30, month:'Mars',      year:2025, name:'Eid ul-Fitr 🌙',                detail:'🇮🇳 Fin du Ramadan — fête de la rupture du jeûne', type:'ferie' },
  { day:6,  month:'Avril',     year:2025, name:'Ram Navami 🙏',                 detail:'🇮🇳 Naissance du Seigneur Ram — 9e jour de Chaitra', type:'ferie' },
  { day:12, month:'Avril',     year:2025, name:'Hanuman Jayanti 🐒',            detail:'🇮🇳 Naissance du Seigneur Hanuman', type:'ferie' },
  { day:13, month:'Avril',     year:2025, name:'Baisakhi / Vaisakhi 🌾',        detail:'🇮🇳 Nouvel An sikh et punjabi — récolte du blé', type:'ferie' },
  { day:14, month:'Avril',     year:2025, name:'Puthandu 🎊 — Nouvel An Tamil', detail:'🇮🇳 Premier jour du mois tamoul Chithirai — Varusha Pirappu', type:'ferie' },
  { day:12, month:'Mai',       year:2025, name:'Buddha Purnima 🌕',             detail:'🇮🇳 Naissance, illumination et mort du Bouddha — pleine lune', type:'ferie' },
  { day:7,  month:'Juin',      year:2025, name:'Eid ul-Adha 🐑',                detail:'🇮🇳 Fête du sacrifice — fin du pèlerinage à La Mecque', type:'ferie' },
  { day:27, month:'Juin',      year:2025, name:'Rath Yatra 🛕',                 detail:'🇮🇳 Procession du char de Jagannath — Puri (Odisha)', type:'ferie' },
  { day:15, month:'Août',      year:2025, name:"Fête de l'Indépendance 🇮🇳",   detail:'🇮🇳 78e anniversaire de l\'indépendance de l\'Inde (1947)', type:'ferie' },
  { day:16, month:'Août',      year:2025, name:'Janmashtami 🎶',                detail:'🇮🇳 Naissance du Seigneur Krishna — minuit de célébration', type:'ferie' },
  { day:27, month:'Août',      year:2025, name:'Ganesh Chaturthi 🐘',           detail:'🇮🇳 Fête de Ganesh — 10 jours de festivités', type:'ferie' },
  { day:5,  month:'Septembre', year:2025, name:'Onam 🌺',                       detail:'🇮🇳 Fête nationale du Kerala — retour du roi Mahabali', type:'ferie' },
  { day:2,  month:'Octobre',   year:2025, name:'Gandhi Jayanti 🕊️',            detail:'🇮🇳 155e anniversaire du Mahatma Gandhi — journée mondiale de la non-violence', type:'ferie' },
  { day:2,  month:'Octobre',   year:2025, name:'Navratri — Début 💃',           detail:'🇮🇳 9 nuits de dévotion à la Déesse Durga (2 au 11 oct)', type:'ferie' },
  { day:12, month:'Octobre',   year:2025, name:'Dussehra / Vijayadasami ⚡',    detail:'🇮🇳 Victoire de Rama sur Ravana — le bien sur le mal', type:'ferie' },
  { day:20, month:'Octobre',   year:2025, name:'Diwali 🪔',                     detail:'🇮🇳 Fête des lumières — Lakshmi Puja (20-24 oct)', type:'ferie' },
  { day:5,  month:'Novembre',  year:2025, name:'Guru Nanak Jayanti 🌟',         detail:'🇮🇳 556e anniversaire du fondateur du Sikhisme', type:'ferie' },
  { day:25, month:'Décembre',  year:2025, name:'Noël 🎄',                       detail:'🇮🇳 Célébré dans tout le pays — Goa, Kerala, Tamil Nadu', type:'ferie' },
  // ── 2026 ──
  { day:14, month:'Janvier',   year:2026, name:'Pongal 🌾',                     detail:'🇮🇳 Nouvel An tamoul agricole — Tai Pongal (14-17 jan)', type:'ferie' },
  { day:26, month:'Janvier',   year:2026, name:"Fête de la République 🇮🇳",    detail:'🇮🇳 77e fête de la République de l\'Inde', type:'ferie' },
  { day:15, month:'Février',   year:2026, name:'Maha Shivaratri 🕉️',           detail:'🇮🇳 Grande nuit de Shiva — jeûne et veille nocturne', type:'ferie' },
  { day:3,  month:'Mars',      year:2026, name:'Holi 🎨',                       detail:'🇮🇳 Fête des couleurs — célébration du printemps', type:'ferie' },
  { day:20, month:'Mars',      year:2026, name:'Eid ul-Fitr 🌙',                detail:'🇮🇳 Fin du Ramadan (date approximative selon lune)', type:'ferie' },
  { day:14, month:'Avril',     year:2026, name:'Puthandu 🎊 — Nouvel An Tamil', detail:'🇮🇳 Premier jour du mois Chithirai — Varusha Pirappu 2026', type:'ferie' },
  { day:15, month:'Août',      year:2026, name:"Fête de l'Indépendance 🇮🇳",   detail:'🇮🇳 79e anniversaire de l\'indépendance de l\'Inde', type:'ferie' },
  { day:22, month:'Août',      year:2026, name:'Ganesh Chaturthi 🐘',           detail:'🇮🇳 Fête de Ganesh — 10 jours de festivités', type:'ferie' },
  { day:2,  month:'Octobre',   year:2026, name:'Gandhi Jayanti 🕊️',            detail:'🇮🇳 Anniversaire du Mahatma Gandhi', type:'ferie' },
  { day:11, month:'Octobre',   year:2026, name:'Navratri — Début 💃',           detail:'🇮🇳 9 nuits de dévotion à la Déesse Durga (11-19 oct)', type:'ferie' },
  { day:20, month:'Octobre',   year:2026, name:'Dussehra / Vijayadasami ⚡',    detail:'🇮🇳 Victoire du bien sur le mal — 10e jour de Navratri', type:'ferie' },
  { day:29, month:'Octobre',   year:2026, name:'Diwali 🪔',                     detail:'🇮🇳 Fête des lumières — Lakshmi Puja (29 oct - 2 nov)', type:'ferie' },
  { day:15, month:'Novembre',  year:2026, name:'Guru Nanak Jayanti 🌟',         detail:'🇮🇳 Anniversaire du fondateur du Sikhisme', type:'ferie' },
  { day:25, month:'Décembre',  year:2026, name:'Noël 🎄',                       detail:'🇮🇳 Célébré dans tout le pays', type:'ferie' },
];

const AGENDA_CIVIL = [
  { day:31, month:'Janvier', year:2026, name:"Date limite révision listes électorales", detail:'📋 Val d\'Oise — Inscription sur les listes électorales 2026', type:'admin' },
  { day:22, month:'Avril',   year:2026, name:'Déclaration d\'impôts (papier)', detail:'💰 Date limite envoi déclaration papier — Île-de-France', type:'impot' },
  { day:19, month:'Mai',     year:2026, name:'Déclaration d\'impôts en ligne (zone 1)', detail:'💰 Date limite déclaration en ligne — départements 1 à 19', type:'impot' },
  { day:26, month:'Mai',     year:2026, name:'Déclaration d\'impôts en ligne (zone 2)', detail:'💰 Date limite déclaration en ligne — départements 20 à 54', type:'impot' },
  { day:2,  month:'Juin',    year:2026, name:'Déclaration d\'impôts en ligne (zone 3)', detail:'💰 Date limite déclaration en ligne — Val d\'Oise (95) et autres', type:'impot' },
  { day:15, month:'Mars',    year:2026, name:'Élections Municipales — 1er tour', detail:'🗳️ Val d\'Oise · Apportez votre carte d\'identité', type:'election' },
  { day:22, month:'Mars',    year:2026, name:'Élections Municipales — 2ème tour', detail:'🗳️ Val d\'Oise · Si ballottage', type:'election' },
  { day:1,  month:'Avril',   year:2026, name:'Ouverture droits Pôle Emploi', detail:'📋 Vérification et renouvellement des droits CAF / France Travail', type:'admin' },
  { day:15, month:'Septembre',year:2026, name:'Rentrée scolaire Val d\'Oise', detail:'🎒 Rentrée des classes — académie de Versailles', type:'admin' },
  { day:1,  month:'Novembre', year:2026, name:'Passage heure d\'hiver', detail:'⏰ Reculer les montres d\'1 heure à 3h → 2h', type:'admin' },
];

const FILMS = [
  { titre:"Mission: Impossible – The Final Reckoning", genre:'Action / Espionnage', duree:'2h45', synopsis:"Ethan Hunt affronte une menace qui pourrait détruire toute civilisation. Le dernier chapitre de la saga Mission Impossible.", note:'⭐⭐⭐⭐½', couleur:'#1A1A2E', couleur2:'#C41E3A', emoji:'💣' },
  { titre:'Jurassic World Rebirth', genre:'Aventure / SF', duree:'2h10', synopsis:"Cinq ans après la chute de Jurassic World. Une nouvelle équipe part en mission secrète pour sauver l'espèce humaine.", note:'⭐⭐⭐⭐', couleur:'#1B4332', couleur2:'#52B788', emoji:'🦕' },
  { titre:'The Fantastic Four', genre:'Super-Héros / Action', duree:'2h05', synopsis:"Marvel présente ses quatre héros iconiques pour la première fois dans le MCU. Une aventure cosmique époustouflante.", note:'⭐⭐⭐⭐', couleur:'#1E3A5F', couleur2:'#FFD700', emoji:'🚀' },
  { titre:'Vaazha (Tamil Cinema)', genre:'Drame / Romance', duree:'2h20', synopsis:"Un film tamoul émouvant sur l'amour, la famille et les liens qui unissent deux familles de générations différentes.", note:'⭐⭐⭐⭐½', couleur:'#4A1942', couleur2:'#FF6B6B', emoji:'🌺' },
  { titre:'L\'Amour Ouf', genre:'Romance / Drame', duree:'2h30', synopsis:"Adèle Exarchopoulos et François Civil dans une histoire d'amour intense qui traverse les décennies dans la France du Nord.", note:'⭐⭐⭐⭐', couleur:'#2D1B69', couleur2:'#E040FB', emoji:'❤️' },
  { titre:'Karate Kid: Legends', genre:'Arts Martiaux / Famille', duree:'1h55', synopsis:"Li Fang se retrouve à New York où il rencontre Daniel LaRusso. Un nouveau chapitre de la légendaire saga Karate Kid.", note:'⭐⭐⭐½', couleur:'#7B3F00', couleur2:'#FFB300', emoji:'🥋' },
];

const EMPLOIS = [
  { poste:'Agent de sécurité', entreprise:'Securitas', lieu:'Cergy (95)', type:'CDI', detail:'Expérience souhaitée. Permis B requis. Horaires décalés. Salaire : 1 800€/mois.', date:'02/06/2025' },
  { poste:'Caissier(ère)', entreprise:'Carrefour Osny', lieu:'Osny (95520)', type:'CDI', detail:'Temps partiel 30h/semaine. Expérience en caisse souhaitée. Disponibilité week-ends.', date:'30/05/2025' },
  { poste:'Aide-soignant(e)', entreprise:'EHPAD Les Genêts', lieu:'Pontoise (95)', type:'CDI', detail:'Diplôme AS exigé. Travail en équipe soignante. Horaires tournants jour/nuit.', date:'28/05/2025' },
  { poste:'Chauffeur Livreur VL', entreprise:'DPD France', lieu:'Cergy (95)', type:'CDD 6 mois', detail:'Permis B 2 ans min. Livraison colis en zone Val d\'Oise. Salaire : 1 900€/mois.', date:'25/05/2025' },
  { poste:'Assistant administratif', entreprise:'Mairie d\'Osny', lieu:'Osny (95520)', type:'Contractuel', detail:'Bac+2 min. Maîtrise outils bureautiques. Accueil du public. 35h/semaine.', date:'20/05/2025' },
];

const RANKINGS_POINTS = [
  { name:'Ahmed Benali', sub:'24 parties', pts:847, games:'18V / 6D' },
  { name:'Pierre Durand', sub:'22 parties', pts:791, games:'16V / 6D' },
  { name:'Carlos Mendes', sub:'20 parties', pts:734, games:'14V / 6D' },
  { name:'Sophie Martin', sub:'18 parties', pts:698, games:'13V / 5D' },
  { name:'Jean-Marc Faure', sub:'21 parties', pts:654, games:'12V / 9D' },
  { name:'Fatima Oujda', sub:'16 parties', pts:612, games:'11V / 5D' },
];

/* ===================== ÉTAT ===================== */
let currentUser = null;
let currentPage = 'login';
let rankMode = 'points';
let agendaMode = 'club';

const BUREAU_FONCTIONS = ['Président','Vice-Président','Secrétaire','Trésorier','Capitaine'];

const getUsers       = () => { try { return JSON.parse(localStorage.getItem('pvk_users')||'[]'); } catch { return []; } };
const saveUsers      = u  => localStorage.setItem('pvk_users', JSON.stringify(u));
const getMessages    = () => { try { return JSON.parse(localStorage.getItem('pvk_chat')||'[]'); } catch { return []; } };
const saveMessages   = m  => localStorage.setItem('pvk_chat', JSON.stringify(m));
const getFilms       = () => { try { return JSON.parse(localStorage.getItem('pvk_films')||'[]'); } catch { return []; } };
const saveFilms      = f  => localStorage.setItem('pvk_films', JSON.stringify(f));
const getCurrentUser = () => { try { return JSON.parse(localStorage.getItem('pvk_current')||'null'); } catch { return null; } };
const saveCurrentUser= u  => localStorage.setItem('pvk_current', JSON.stringify(u));
const getCurrentUser = () => { try { return JSON.parse(localStorage.getItem('pvk_current') || 'null'); } catch { return null; } };
const saveCurrentUser= u => localStorage.setItem('pvk_current', JSON.stringify(u));

/* ===================== HELPERS ===================== */
const initials = (p, n) => ((p||'?')[0]+(n||'?')[0]).toUpperCase();

function getSaison(d) {
  const m = d.getMonth()+1, y = d.getFullYear();
  const s = m >= 6 ? y : y-1;
  return `${s}-${s+1}`;
}
function getExpiry(saison) { return `31/05/${parseInt(saison.split('-')[1])}`; }
function getPaiementDate() {
  const n = new Date();
  return `${String(n.getDate()).padStart(2,'0')}/${String(n.getMonth()+1).padStart(2,'0')}/${n.getFullYear()}`;
}
function isAbonnementActif(user) {
  if (!user?.abonnement) return false;
  const p = user.abonnement.expire.split('/');
  return new Date() <= new Date(+p[2], +p[1]-1, +p[0], 23, 59);
}
function daysUntilExpiry(user) {
  if (!user?.abonnement) return -999;
  const p = user.abonnement.expire.split('/');
  return Math.ceil((new Date(+p[2], +p[1]-1, +p[0], 23, 59) - new Date()) / 86400000);
}
function saisonProgress(user) {
  if (!user?.abonnement) return 0;
  const sp = user.abonnement.paiement.split('/');
  const ep = user.abonnement.expire.split('/');
  const start = new Date(+sp[2], +sp[1]-1, +sp[0]);
  const end   = new Date(+ep[2], +ep[1]-1, +ep[0]);
  return Math.min(100, Math.max(0, Math.round(((new Date()-start)/(end-start))*100)));
}
function generateId() { return 'U' + String(getUsers().length + 1).padStart(6, '0'); }
function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== CONTRÔLE D'ACCÈS ===== */
// Pages libres à tous les membres connectés (payants ou non)
const FREE_PAGES = ['accueil','club','agenda','actualites','adhesion','abonnement'];
// Pages réservées aux adhérents actifs
const MEMBER_PAGES = ['contacts','cinema','emplois','carte','membres','classement','chat'];
// Page admin uniquement
const ADMIN_PAGES = ['admin'];

function canAccess(page) {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  if (FREE_PAGES.includes(page)) return true;
  if (MEMBER_PAGES.includes(page) && isAbonnementActif(currentUser)) return true;
  return false;
}

/* ===================== DONNÉES INIT localStorage ===================== */
function initDefaultData() {
  const users = getUsers();
  if (users.find(u => u.email === 'admin@pvk.fr')) return;
  const saison = getSaison(new Date());
  const demos = [
    { id:'admin',   email:'admin@pvk.fr',          password:'admin123',   prenom:'Admin',     nom:'PVK',    tel:'06 00 00 00 00', fonction:'Président',     adresse:'Chaussée Jules César 95520 Osny', role:'admin' },
    { id:'U000002', email:'ahmed.benali@mail.fr',   password:'membre123',  prenom:'Ahmed',     nom:'Benali', tel:'06 11 22 33 44', fonction:'Vice-Président', adresse:'12 avenue des Boules, 95520 Osny', role:'membre' },
    { id:'U000003', email:'pierre.durand@mail.fr',  password:'membre123',  prenom:'Pierre',    nom:'Durand', tel:'06 22 33 44 55', fonction:'Secrétaire',     adresse:'5 rue du Cochonnet, 95520 Osny', role:'membre' },
    { id:'U000004', email:'sophie.martin@mail.fr',  password:'membre123',  prenom:'Sophie',    nom:'Martin', tel:'06 33 44 55 66', fonction:'Trésorier',      adresse:'8 allée des Champions, 95520 Osny', role:'membre' },
    { id:'U000005', email:'carlos.mendes@mail.fr',  password:'membre123',  prenom:'Carlos',    nom:'Mendes', tel:'06 44 55 66 77', fonction:'Capitaine',      adresse:'3 place de la Pétanque, 95520 Osny', role:'membre' },
    { id:'U000006', email:'fatima.oujda@mail.fr',   password:'membre123',  prenom:'Fatima',    nom:'Oujda',  tel:'06 55 66 77 88', fonction:'Membre',         adresse:'20 rue des Terrains, 95000 Cergy', role:'membre' },
    { id:'U000007', email:'jm.faure@mail.fr',       password:'membre123',  prenom:'Jean-Marc', nom:'Faure',  tel:'06 66 77 88 99', fonction:'Membre',         adresse:'15 boulevard du Sport, 95300 Pontoise', role:'membre' },
  ];
  demos.forEach(d => users.push(Object.assign({ inscritLe:'01/06/2025', abonnement:{ saison, paiement:'01/06/2025', expire:'31/05/2026', statut:'actif' } }, d)));
  saveUsers(users);
  if (!getMessages().length) {
    saveMessages([
      { id:'m1', userId:'U000002', userName:'Ahmed Benali',  text:'Bonjour à tous ! 👋', ts: Date.now()-3600000*5 },
      { id:'m2', userId:'U000003', userName:'Pierre Durand', text:'Salut ! On va bien jouer !', ts: Date.now()-3600000*4 },
      { id:'m3', userId:'U000004', userName:'Sophie Martin', text:'Entraînement demain 18h30 terrain B 📋', ts: Date.now()-1800000 },
    ]);
  }
}

/* ===================== AUTH ===================== */
function switchTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabRegister').classList.toggle('active', tab==='register');
  document.getElementById('formLogin').classList.toggle('hidden', tab!=='login');
  document.getElementById('formRegister').classList.toggle('hidden', tab!=='register');
}

function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPassword').value;
  const user  = getUsers().find(function(u){ return u.email === email && u.password === pass; });
  if (!user) { showError('loginError', 'Email ou mot de passe incorrect.'); return; }
  currentUser = user; saveCurrentUser(user); enterApp();
}

function doRegister(e) {
  e.preventDefault();
  const email   = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass    = document.getElementById('regPassword').value;
  const prenom  = document.getElementById('regPrenom').value.trim();
  const nom     = document.getElementById('regNom').value.trim();
  const tel     = document.getElementById('regTel').value.trim();
  const fonction= document.getElementById('regFonction').value;
  const adresse = document.getElementById('regAdresse').value.trim();
  var users = getUsers();
  if (users.find(function(u){ return u.email===email; })) { showError('regError', 'Cet email est déjà utilisé.'); return; }
  var saison = getSaison(new Date());
  var newUser = { id:'U'+Date.now(), email:email, password:pass, prenom:prenom, nom:nom, tel:tel, fonction:fonction||'Membre', adresse:adresse, role:'membre', inscritLe:getPaiementDate(), abonnement:{saison:saison,paiement:getPaiementDate(),expire:getExpiry(saison),statut:'actif'} };
  users.push(newUser); saveUsers(users);
  currentUser = newUser; saveCurrentUser(newUser);
  showToast('✅ Compte créé ! Bienvenue au club !');
  enterApp();
}

function logout() {
  currentUser = null; localStorage.removeItem('pvk_current');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('page-login').classList.remove('hidden');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  closeSidebar();
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg; el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

/* ===================== APP SHELL ===================== */
function enterApp() {
  document.getElementById('page-login').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  updateSidebar();
  showPage('accueil');
}

function updateSidebar() {
  if (!currentUser) return;
  document.getElementById('sidebarAvatar').textContent = initials(currentUser.prenom, currentUser.nom);
  document.getElementById('sidebarName').textContent   = `${currentUser.prenom} ${currentUser.nom}`;
  const actif = isAbonnementActif(currentUser);
  document.getElementById('sidebarRole').textContent   = currentUser.role==='admin' ? '⚙️ Administrateur' : actif ? '✅ Adhérent' : '⚠️ Non-payant';
  document.getElementById('adminMenuItem').classList.toggle('hidden', currentUser.role!=='admin');
}

function nav(page) { showPage(page); closeSidebar(); }

function showPage(page) {
  if (page !== 'chat' && chatTimer) { clearInterval(chatTimer); chatTimer = null; }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(`page-${page}`);
  if (el) el.classList.add('active');
  const navMap = { accueil:'navAccueil', agenda:'navAgenda', cinema:'navCinema', membres:'navMembres', chat:'navChat' };
  if (navMap[page]) document.getElementById(navMap[page])?.classList.add('active');
  currentPage = page;
  if (page !== 'login') renderPage(page);
  window.scrollTo(0,0);
}

function renderPage(page) {
  switch(page) {
    case 'accueil':    renderAccueil(); break;
    case 'club':       renderClub(); break;
    case 'actualites': renderActualites(); break;
    case 'agenda':     renderAgenda(); break;
    case 'cinema':     renderCinema(); break;
    case 'emplois':    renderEmplois(); break;
    case 'contacts':   break;
    case 'adhesion':   break;
    case 'carte':      renderCarte(); break;
    case 'abonnement': renderAbonnement(); break;
    case 'membres':    renderMembres(); break;
    case 'classement': renderClassement(); break;
    case 'chat':       renderChat(); break;
    case 'admin':      renderAdmin(); break;
  }
}

/* ===================== ACCUEIL ===================== */
function renderAccueil() {
  if (!currentUser) return;
  document.getElementById('welcomeName').textContent = `Bonjour, ${currentUser.prenom} !`;
  // Compteur
  const users  = getUsers();
  const actifs = users.filter(u => isAbonnementActif(u));
  const isAdmin = currentUser.role === 'admin';
  document.getElementById('counterSimple').classList.toggle('hidden', isAdmin);
  document.getElementById('counterAdmin').classList.toggle('hidden', !isAdmin);
  document.getElementById('cntTotal').textContent   = users.length;
  if (isAdmin) {
    document.getElementById('cntTotalA').textContent  = users.length;
    document.getElementById('cntActifs').textContent  = actifs.length;
    document.getElementById('cntExpires').textContent = users.length - actifs.length;
  }
  // Statut perso
  const actif = isAbonnementActif(currentUser);
  const days  = daysUntilExpiry(currentUser);
  const sc = document.getElementById('statusCard');
  sc.className = `status-card${actif?'':' expired'}`;
  document.getElementById('statusIcon').textContent = actif ? '✅' : '❌';
  document.getElementById('statusVal').textContent  = actif ? 'Actif' : 'Expiré';
  document.getElementById('statusExpiry').textContent = actif ? (days<=30?`⚠️ Expire dans ${days} jours`:`Expire le ${currentUser.abonnement?.expire||'—'}`) : `Expiré le ${currentUser.abonnement?.expire||'—'}`;
  // Aperçu actualités
  const preview = document.getElementById('newsPreview');
  {
    preview.innerHTML = NEWS.slice(0,2).map(n => `
      <div class="news-card" style="margin-bottom:10px">
        <div class="news-accent ${n.accent}"></div>
        <span class="news-badge ${n.type}">${n.type.charAt(0).toUpperCase()+n.type.slice(1)}</span>
        <div class="news-title">${n.title}</div>
        <div class="news-body">${n.body.substring(0,100)}…</div>
        <div class="news-date">📅 ${n.date}</div>
      </div>`).join('');
  }

}

/* ===================== CLUB ===================== */
function renderClub() {
  const users = getUsers();
  const bureau = users.filter(u => BUREAU_FONCTIONS.includes(u.fonction||''));
  document.getElementById('bureauList').innerHTML = bureau.map(u => `
    <div class="membre-card" style="cursor:default">
      <div class="membre-avatar gold">${initials(u.prenom,u.nom)}</div>
      <div class="membre-info">
        <div class="membre-name">${u.prenom} ${u.nom}</div>
        <span class="membre-fonction bureau">${u.fonction}</span>
        ${u.tel?`<div class="membre-row"><span>📞</span><a href="tel:${u.tel}" class="link-red">${u.tel}</a></div>`:''}
        ${u.email?`<div class="membre-row"><span>✉️</span><a href="mailto:${u.email}" class="link-red">${u.email}</a></div>`:''}
      </div>
    </div>`).join('') || '<p style="color:var(--text-muted);font-size:.88rem">Aucun membre du bureau enregistré.</p>';
}

/* ===================== ACTUALITÉS ===================== */
function renderActualites() {
  const actif = true; // accessible à tous les membres connectés
  document.getElementById('newsAccessMsg').classList.toggle('hidden', actif);
  document.getElementById('newsContainer').innerHTML = actif ? NEWS.map(n => `
    <div class="news-card">
      <div class="news-accent ${n.accent}"></div>
      <span class="news-badge ${n.type}">${n.type.charAt(0).toUpperCase()+n.type.slice(1)}</span>
      <div class="news-title">${n.title}</div>
      <div class="news-body">${n.body}</div>
      <div class="news-date">📅 ${n.date}</div>
    </div>`).join('') : '';
}

/* ===================== AGENDA ===================== */
function switchAgenda(mode) {
  agendaMode = mode;
  const ids = { club:'tabAgendaClub', france:'tabAgendaFr', inde:'tabAgendaInde', civil:'tabAgendaCivil' };
  Object.keys(ids).forEach(m => {
    document.getElementById(ids[m])?.classList.toggle('active', m === mode);
  });
  renderAgenda();
}

function renderAgenda() {
  const data = { club:AGENDA_CLUB, france:AGENDA_FRANCE, inde:AGENDA_INDE, civil:AGENDA_CIVIL }[agendaMode] || [];
  const typeLabel = { tournoi:'Tournoi', special:'Spécial', ferie:'Jour Férié', vacances:'Vacances 🏫', admin:'Démarche', impot:'Fiscal', election:'Élection', entrainement:'Entraînement' };
  let lastMonth = '';
  document.getElementById('agendaContainer').innerHTML = data.map(ev => {
    let h = '';
    if (ev.month !== lastMonth) { lastMonth = ev.month; h = `<div class="cal-month">${ev.month} ${ev.year}</div>`; }
    return `${h}<div class="cal-event">
      <div class="cal-date"><div class="cal-day">${ev.day}</div><div class="cal-mo">${ev.month.substring(0,3)}</div></div>
      <div class="cal-info"><div class="cal-name">${ev.name}</div><div class="cal-detail">${ev.detail}</div></div>
      <span class="cal-type ${ev.type}">${typeLabel[ev.type]||ev.type}</span>
    </div>`;
  }).join('');
}

/* ===================== CINÉMA ===================== */
async function renderCinema() {
  // Si des films ont été ajoutés par l'admin → on les affiche en priorité
  const filmsAdmin = getFilms();
  if (filmsAdmin.length > 0) { renderCinemaAdmin(); return; }
  const actif = canAccess('cinema');
  document.getElementById('cinemaAccessMsg').classList.toggle('hidden', actif);
  const c = document.getElementById('cinemaContainer');
  if (!actif) { c.innerHTML = ''; return; }

  // Si pas de clé TMDB → films statiques de démonstration
  if (!TMDB_KEY) {
    c.innerHTML = FILMS.map(f => `
      <div class="film-card">
        <div class="film-poster" style="background:linear-gradient(135deg,${f.couleur},${f.couleur2})">
          <span class="film-emoji">${f.emoji}</span>
        </div>
        <div class="film-info">
          <div class="film-titre">${f.titre}</div>
          <div class="film-meta"><span class="film-genre">${f.genre}</span> · ${f.duree}</div>
          <div class="film-synopsis">${f.synopsis}</div>
          <div class="film-note">${f.note}</div>
        </div>
      </div>`).join('');
    return;
  }

  // Avec clé TMDB → films indiens réels (tamoul + hindi + kannada + telugu)
  c.innerHTML = `<div class="cinema-loading">🎬 Chargement des films en cours…</div>`;
  try {
    const langues = ['ta','hi','te','kn']; // tamoul, hindi, télougou, kannada
    const fetches = langues.map(lang =>
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=${lang}&sort_by=popularity.desc&page=1`)
        .then(r => r.json())
    );
    const results = await Promise.all(fetches);
    // Fusionner + dédupliquer + trier par popularité
    const seen = new Set();
    const films = results.flatMap(r => r.results || [])
      .filter(f => { if (seen.has(f.id)) return false; seen.add(f.id); return f.poster_path; })
      .sort((a,b) => b.popularity - a.popularity)
      .slice(0, 20);

    if (!films.length) { c.innerHTML = '<div class="membres-empty">Aucun film trouvé.</div>'; return; }

    const langLabel = { ta:'Tamil', hi:'Hindi', te:'Telugu', kn:'Kannada', ml:'Malayalam' };
    c.innerHTML = films.map(f => {
      const note = f.vote_average ? '⭐ ' + f.vote_average.toFixed(1) + '/10' : '';
      const annee = f.release_date ? f.release_date.substring(0,4) : '';
      const lang  = langLabel[f.original_language] || f.original_language?.toUpperCase() || '';
      const synopsis = f.overview ? f.overview.substring(0,140)+'…' : 'Synopsis non disponible.';
      return `
      <div class="film-card">
        <img class="film-poster-img" src="${TMDB_IMG}${f.poster_path}" alt="${f.title}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
        <div class="film-poster-fallback" style="display:none">🎬</div>
        <div class="film-info">
          <div class="film-titre">${f.title}</div>
          ${f.original_title !== f.title ? `<div class="film-original">${f.original_title}</div>` : ''}
          <div class="film-meta">
            <span class="film-genre">${lang}</span>
            ${annee ? `· ${annee}` : ''}
          </div>
          <div class="film-synopsis">${synopsis}</div>
          ${note ? `<div class="film-note">${note}</div>` : ''}
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    c.innerHTML = `<div class="access-msg">⚠️ Impossible de charger les films. Vérifiez votre clé API TMDB.</div>`;
    // Fallback sur les films statiques
    setTimeout(() => renderCinemaStatic(), 300);
  }
}

function renderCinemaAdmin() {
  const actif = canAccess('cinema');
  const c = document.getElementById('cinemaContainer');
  if (!actif) return;
  const films = getFilms();
  c.innerHTML = `<div class="affiches-grid">${films.map(f => `
    <div class="affiche-item">
      <img src="${f.affiche}" loading="lazy" onerror="this.style.display='none'"/>
    </div>`).join('')}</div>`;
}

let filmImageBase64 = '';

function previewFilmImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  // Vérifier la taille (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showToast('⚠️ Image trop lourde. Max 2MB. Faites un screenshot plus petit.');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    filmImageBase64 = e.target.result;
    // Afficher l'aperçu
    const preview = document.getElementById('filmPreview');
    const placeholder = document.getElementById('filmUploadPlaceholder');
    preview.src = filmImageBase64;
    preview.classList.remove('hidden');
    placeholder.classList.add('hidden');
    showToast('✅ Image chargée !');
  };
  reader.readAsDataURL(file);
}

function adminAjouterFilm() {
  if (!filmImageBase64) { showToast('⚠️ Choisissez d\'abord une affiche'); return; }
  var films = getFilms();
  films.unshift({ id:'f'+Date.now(), affiche:filmImageBase64 });
  saveFilms(films);
  document.getElementById('filmImageInput').value = '';
  document.getElementById('filmPreview').classList.add('hidden');
  document.getElementById('filmUploadPlaceholder').classList.remove('hidden');
  filmImageBase64 = '';
  showToast('✅ Affiche ajoutée !');
  renderAdminFilms();
}

function renderAdminFilms() {
  const films = getFilms();
  const c = document.getElementById('adminFilmsContainer');
  if (!c) return;
  if (!films.length) { c.innerHTML = '<p style="color:var(--text-muted);font-size:.85rem;text-align:center;padding:8px">Aucun film ajouté pour l\'instant.</p>'; return; }
  c.innerHTML = `<div class="affiches-admin-grid">${films.map(f => `
    <div class="affiche-admin-item">
      <img src="${f.affiche}" onerror="this.style.display='none'"/>
      <button class="affiche-del-btn" onclick="supprimerFilm('${f.id}')">✕</button>
    </div>`).join('')}</div>`;
}

function supprimerFilm(id) {
  if (!confirm('Supprimer cette affiche ?')) return;
  saveFilms(getFilms().filter(function(f){return f.id!==id&&f.fbKey!==id;}));
  showToast('🗑️ Affiche supprimée'); renderAdminFilms();
}

function renderCinemaStatic() {
  const c = document.getElementById('cinemaContainer');
  c.innerHTML = FILMS.map(f => `
    <div class="film-card">
      <div class="film-poster" style="background:linear-gradient(135deg,${f.couleur},${f.couleur2})">
        <span class="film-emoji">${f.emoji}</span>
      </div>
      <div class="film-info">
        <div class="film-titre">${f.titre}</div>
        <div class="film-meta"><span class="film-genre">${f.genre}</span> · ${f.duree}</div>
        <div class="film-synopsis">${f.synopsis}</div>
        <div class="film-note">${f.note}</div>
      </div>
    </div>`).join('');
}

/* ===================== EMPLOIS ===================== */
function renderEmplois() {
  const actif = canAccess('emplois');
  document.getElementById('emploisAccessMsg').classList.toggle('hidden', actif);
  document.getElementById('emploisContainer').innerHTML = actif ? EMPLOIS.map(e => `
    <div class="emploi-card">
      <div class="emploi-header">
        <div><div class="emploi-poste">${e.poste}</div><div class="emploi-entreprise">${e.entreprise} · ${e.lieu}</div></div>
        <span class="emploi-type ${e.type.includes('CDI')?'cdi':e.type.includes('CDD')?'cdd':'autre'}">${e.type}</span>
      </div>
      <div class="emploi-detail">${e.detail}</div>
      <div class="emploi-date">Publié le ${e.date}</div>
    </div>`).join('') : '';
}

/* ===================== CARTE MEMBRE ===================== */
function renderCarte() {
  const actif = canAccess('carte');
  document.getElementById('carteAccessMsg').classList.toggle('hidden', actif);
  document.getElementById('carteContent').classList.toggle('hidden', !actif);
  if (!actif || !currentUser) return;
  document.getElementById('mcAvatar').textContent  = initials(currentUser.prenom, currentUser.nom);
  document.getElementById('mcName').textContent    = `${currentUser.prenom} ${currentUser.nom}`;
  document.getElementById('mcNum').textContent     = `#${currentUser.id}`;
  const ok = isAbonnementActif(currentUser);
  document.getElementById('mcStatus').innerHTML   = ok ? '<span class="badge-active">✓ ACTIF</span>' : '<span class="badge-active badge-expired">✗ EXPIRÉ</span>';
  document.getElementById('mcValidity').textContent = currentUser.abonnement ? `Valide du 01/06/${currentUser.abonnement.saison.split('-')[0]} au ${currentUser.abonnement.expire}` : '—';
  document.getElementById('cardEmail').textContent   = currentUser.email;
  document.getElementById('cardTel').textContent     = currentUser.tel || 'Non renseigné';
  document.getElementById('cardInscrit').textContent = `Inscrit le ${currentUser.inscritLe}`;
  renderQR();
}

function renderQR() {
  const qrDiv = document.getElementById('mcQr');
  const size = 40, cells = 7, cell = size/cells;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,size,size);
  const seed = (currentUser?.id||'U000001').split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const rng = i => ((seed*1664525+i*22695477)&0x7fffffff)%2;
  ctx.fillStyle = '#C41E3A';
  for (let r=0;r<cells;r++) for (let c=0;c<cells;c++) if (rng(r*cells+c)) ctx.fillRect(c*cell,r*cell,cell-.5,cell-.5);
  [[0,0],[0,4],[4,0]].forEach(([cr,cc])=>{
    ctx.fillStyle='#C41E3A'; ctx.fillRect(cc*cell,cr*cell,3*cell,3*cell);
    ctx.fillStyle='#fff';    ctx.fillRect(cc*cell+cell*.4,cr*cell+cell*.4,cell*1.2,cell*1.2);
    ctx.fillStyle='#C41E3A'; ctx.fillRect(cc*cell+cell,cr*cell+cell,cell,cell);
  });
  qrDiv.innerHTML=''; qrDiv.appendChild(canvas);
}

/* ===================== ABONNEMENT ===================== */
function renderAbonnement() {
  if (!currentUser) return;
  const actif = isAbonnementActif(currentUser);
  const abo   = currentUser.abonnement;
  document.getElementById('aboStatut').textContent = actif ? '✅ Actif' : '❌ Expiré';
  document.getElementById('aboStatut').style.color = actif ? '#22c55e' : '#ef4444';
  document.getElementById('aboSaison').textContent  = abo?.saison || '—';
  document.getElementById('aboPaiement').textContent= abo?.paiement || '—';
  document.getElementById('aboExpire').textContent  = abo?.expire || '—';
  const pct = saisonProgress(currentUser);
  document.getElementById('aboPercent').textContent     = pct+'%';
  document.getElementById('aboProgressFill').style.width= pct+'%';
  document.getElementById('aboAlert').classList.toggle('hidden', !(actif && daysUntilExpiry(currentUser)<=30));
  document.getElementById('renewSection').classList.toggle('hidden', actif);
}

function renewSubscription() {
  var users=getUsers(), idx=users.findIndex(function(u){return u.id===currentUser.id;}); if(idx<0)return;
  var saison=getSaison(new Date());
  users[idx].abonnement={saison:saison,paiement:getPaiementDate(),expire:getExpiry(saison),statut:'actif'};
  saveUsers(users); currentUser=users[idx]; saveCurrentUser(currentUser);
  showToast('✅ Abonnement renouvelé !'); renderAbonnement();
}

/* ===================== MEMBRES ===================== */
let membreFilter = 'tous';

function renderMembres() {
  const actif = canAccess('membres');
  document.getElementById('membresAccessMsg').classList.toggle('hidden', actif);
  document.getElementById('membresContent').classList.toggle('hidden', !actif);
  if (!actif) return;
  renderMembreStats();
  filterMembres();
}

function renderMembreStats() {
  const users  = getUsers();
  const actifs = users.filter(u => isAbonnementActif(u)).length;
  const bureau = users.filter(u => BUREAU_FONCTIONS.includes(u.fonction||'')).length;
  document.getElementById('membreStats').innerHTML = `
    <div class="mstat"><span class="mstat-val">${users.length}</span><span class="mstat-lbl">Total</span></div>
    <div class="mstat actif"><span class="mstat-val">${actifs}</span><span class="mstat-lbl">Adhérents</span></div>
    <div class="mstat expire"><span class="mstat-val">${users.length - actifs}</span><span class="mstat-lbl">Non-payants</span></div>
    <div class="mstat bureau"><span class="mstat-val">${bureau}</span><span class="mstat-lbl">Bureau</span></div>
  `;
}

function setMembreFilter(f) {
  membreFilter = f;
  ['tous','actifs','expires','bureau'].forEach(x => {
    document.getElementById('filter'+x.charAt(0).toUpperCase()+x.slice(1))?.classList.toggle('active', x===f);
  });
  filterMembres();
}

function filterMembres() {
  const q = (document.getElementById('membreSearch')?.value||'').toLowerCase();
  let users = getUsers();

  // Filtre statut
  if (membreFilter === 'actifs')  users = users.filter(u => isAbonnementActif(u));
  if (membreFilter === 'expires') users = users.filter(u => !isAbonnementActif(u));
  if (membreFilter === 'bureau')  users = users.filter(u => BUREAU_FONCTIONS.includes(u.fonction||''));

  // Filtre recherche
  if (q) users = users.filter(u =>
    `${u.prenom} ${u.nom} ${u.email||''} ${u.fonction||''} ${u.adresse||''} ${u.tel||''}`.toLowerCase().includes(q)
  );

  // Tri : bureau en premier, puis alphabétique
  users.sort((a,b) => {
    const ai = BUREAU_FONCTIONS.indexOf(a.fonction||'');
    const bi = BUREAU_FONCTIONS.indexOf(b.fonction||'');
    if (ai !== -1 && bi === -1) return -1;
    if (ai === -1 && bi !== -1) return 1;
    if (ai !== -1 && bi !== -1) return ai - bi;
    return `${a.nom}${a.prenom}`.localeCompare(`${b.nom}${b.prenom}`);
  });

  const c = document.getElementById('membresContainer');
  if (!users.length) {
    c.innerHTML = '<div class="membres-empty">Aucun membre trouvé.</div>';
    return;
  }
  c.innerHTML = users.map(u => buildMembreCard(u)).join('');
}

function buildMembreCard(u) {
  const ini      = initials(u.prenom, u.nom);
  const isBureau = BUREAU_FONCTIONS.includes(u.fonction||'');
  const ok       = isAbonnementActif(u);
  return `
  <div class="membre-detail-card">
    <!-- En-tête -->
    <div class="mdc-header">
      <div class="mdc-avatar ${isBureau?'gold':''}">${ini}</div>
      <div class="mdc-identity">
        <div class="mdc-name">${u.prenom} ${u.nom}</div>
        <div class="mdc-meta">
          <span class="membre-fonction ${isBureau?'bureau':''}">${u.fonction||'Membre'}</span>
          <span class="badge-sm ${ok?'actif':'expire'}">${ok?'Adhérent':'Non-payant'}</span>
        </div>
      </div>
    </div>
    <!-- Contacts -->
    <div class="mdc-contacts">
      ${u.tel ? `
      <a href="tel:${u.tel}" class="mdc-contact-row">
        <div class="mdc-contact-icon tel">📞</div>
        <div class="mdc-contact-info">
          <div class="mdc-contact-label">Téléphone</div>
          <div class="mdc-contact-val">${u.tel}</div>
        </div>
        <div class="mdc-contact-action">Appeler</div>
      </a>` : ''}
      ${u.email ? `
      <a href="mailto:${u.email}" class="mdc-contact-row">
        <div class="mdc-contact-icon mail">✉️</div>
        <div class="mdc-contact-info">
          <div class="mdc-contact-label">Email</div>
          <div class="mdc-contact-val">${u.email}</div>
        </div>
        <div class="mdc-contact-action">Écrire</div>
      </a>` : ''}
      ${u.adresse ? `
      <div class="mdc-contact-row">
        <div class="mdc-contact-icon addr">📍</div>
        <div class="mdc-contact-info">
          <div class="mdc-contact-label">Adresse</div>
          <div class="mdc-contact-val">${u.adresse}</div>
        </div>
      </div>` : ''}
    </div>
    <!-- Pied -->
    <div class="mdc-footer">
      <span>🎫 Membre depuis le ${u.inscritLe||'—'}</span>
      <span>💳 Saison ${u.abonnement?.saison||'—'}</span>
    </div>
  </div>`;
}

/* ===================== CLASSEMENT ===================== */
function switchRankTab(mode) {
  rankMode = mode;
  document.querySelectorAll('#page-classement .tab').forEach((t,i)=>t.classList.toggle('active',(i===0&&mode==='points')||(i===1&&mode==='victoires')));
  renderClassement();
}
function renderClassement() {
  const medals=['🥇','🥈','🥉'];
  const data=[...RANKINGS_POINTS].sort((a,b)=>rankMode==='points'?b.pts-a.pts:parseInt(b.games)-parseInt(a.games));
  document.getElementById('rankContainer').innerHTML=`<div class="rank-table">
    <div class="rank-header"><span>#</span><span>Joueur</span><span>${rankMode==='points'?'Pts':'V'}</span><span>Parties</span></div>
    ${data.map((r,i)=>`<div class="rank-row ${i<3?'top'+(i+1):''}">
      <div class="rank-pos">${i<3?medals[i]:i+1}</div>
      <div><div class="rank-name">${r.name}</div><div class="rank-sub">${r.sub}</div></div>
      <div class="rank-val pts">${rankMode==='points'?r.pts:r.games.split('V')[0].trim()}</div>
      <div class="rank-games">${r.games.split('/')[1]?.trim()||'—'}</div>
    </div>`).join('')}
  </div>`;
}

/* ===================== CHAT ===================== */
let chatTimer = null;

function renderChat() {
  const actif = canAccess('chat');
  document.getElementById('chatAccessMsg').classList.toggle('hidden', actif);
  document.getElementById('chatInputBar').classList.toggle('hidden', !actif);
  updateChatHeader();
  if (!actif) return;
  displayMessages();
  clearInterval(chatTimer);
  chatTimer = setInterval(displayMessages, 3000);
  setTimeout(scrollChatBottom, 200);
}
function updateChatHeader() {
  const actifs = getUsers().filter(function(u){ return isAbonnementActif(u); }).length;
  var el = document.getElementById('chatOnlineCount');
  if (el) el.textContent = actifs + ' adhérent' + (actifs>1?'s':'') + ' dans le club';
}
function displayMessages() {
  var msgs = getMessages();
  var c = document.getElementById('chatMessages');
  if (!c) return;
  if (!msgs.length) { c.innerHTML = '<div class="chat-empty">Soyez le premier à écrire ! 👋</div>'; return; }
  var html = '', lastDate = '';
  msgs.forEach(function(msg) {
    var d = new Date(msg.ts);
    var ds = d.toLocaleDateString('fr-FR',{day:'numeric',month:'long'});
    var ts = d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    if (ds !== lastDate) { html += '<div class="msg-date-sep">'+ds+'</div>'; lastDate = ds; }
    var isMe = msg.userId === (currentUser && currentUser.id);
    html += '<div class="msg-wrap '+(isMe?'me':'other')+'">'+(isMe?'':'<div class="msg-author">'+msg.userName+'</div>')+'<div class="msg-bubble">'+escapeHtml(msg.text)+'</div><div class="msg-time">'+ts+'</div></div>';
  });
  c.innerHTML = html; scrollChatBottom();
}
function scrollChatBottom(){ var c=document.getElementById('chatMessages'); if(c) c.scrollTop=c.scrollHeight; }
function sendMessage() {
  var input=document.getElementById('chatInput');
  var text=input&&input.value.trim();
  if(!text||!currentUser||!canAccess('chat'))return;
  var msgs=getMessages();
  msgs.push({id:'m'+Date.now(),userId:currentUser.id,userName:currentUser.prenom+' '+currentUser.nom,text:text,ts:Date.now()});
  saveMessages(msgs); input.value=''; displayMessages();
}
function chatKeyDown(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}

/* ===================== ADMIN ===================== */
function renderAdmin() {
  if (!currentUser||currentUser.role!=='admin') return;
  renderAdminFilms();
  const users=getUsers(), actifs=users.filter(u=>isAbonnementActif(u)), expires=users.filter(u=>!isAbonnementActif(u));
  document.getElementById('statTotal').textContent  = users.length;
  document.getElementById('statActifs').textContent = actifs.length;
  document.getElementById('statExpires').textContent= expires.length;
  document.getElementById('statCA').textContent     = (actifs.length*49)+'€';
  document.getElementById('adminMembersContainer').innerHTML = users.map(u=>{
    const ok=isAbonnementActif(u);
    return `<div class="admin-member">
      <div class="admin-avatar">${initials(u.prenom,u.nom)}</div>
      <div class="admin-member-info">
        <div class="admin-member-name">${u.prenom} ${u.nom}</div>
        <div class="admin-member-email">${u.email}</div>
      </div>
      <span class="admin-badge ${ok?'actif':'expire'}">${ok?'Actif':'Expiré'}</span>
      <div class="admin-actions">
        ${!ok?`<button class="admin-btn valid" onclick="adminValidate('${u.id}')">✓</button>`:''}
        ${u.role!=='admin'?`<button class="admin-btn del" onclick="adminDelete('${u.id}')">✕</button>`:''}
      </div>
    </div>`;
  }).join('');
}
function adminValidate(id){
  var users=getUsers(), idx=users.findIndex(function(u){return u.id===id;}); if(idx<0)return;
  var saison=getSaison(new Date());
  users[idx].abonnement={saison:saison,paiement:getPaiementDate(),expire:getExpiry(saison),statut:'actif'};
  saveUsers(users); showToast('✅ Abonnement validé'); renderAdmin();
}
function adminDelete(id){
  if(!confirm('Supprimer ce membre ?'))return;
  saveUsers(getUsers().filter(function(u){return u.id!==id;})); showToast('🗑️ Membre supprimé'); renderAdmin();
}

/* ===================== UTILITAIRES ===================== */
function shareCard(){
  if(navigator.share) navigator.share({title:'Carte membre PVK',text:`${currentUser.prenom} ${currentUser.nom} — Pétanque Vetri Kazhagam`});
  else showToast('📋 Partagez votre carte membre !');
}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sidebar-overlay').classList.toggle('active');}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('active');}
let toastTimer;
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.add('hidden'),3000);}
function openModal(title,body){document.getElementById('modalTitle').textContent=title;document.getElementById('modalBody').innerHTML=body;document.getElementById('modal').classList.remove('hidden');}
function closeModal(){document.getElementById('modal').classList.add('hidden');}

function refreshCurrentPage() {
  if (!currentPage || currentPage === 'login') return;
  switch(currentPage) {
    case 'accueil':    renderAccueil(); break;
    case 'club':       renderClub(); break;
    case 'membres':    renderMembres(); break;
    case 'admin':      renderAdmin(); break;
  }
}

/* ===================== INIT ===================== */
window.addEventListener('DOMContentLoaded', function() {
  initDefaultData();
  var saved = getCurrentUser();
  if (saved) {
    var users = getUsers();
    var fresh = users.find(function(u){ return u.id === saved.id; });
    if (fresh) { currentUser = fresh; saveCurrentUser(fresh); enterApp(); return; }
  }
});
