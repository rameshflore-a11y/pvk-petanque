/* ===================== FIREBASE — SYNC MEMBRES ===================== */
var db = null;
var fbAuth = null;
var authEnCours = false; // connexion/inscription manuelle en cours
(function() {
  try {
    if (typeof firebase === 'undefined') return;
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBUgYyG7dG0ecBpc8Pnr4AuWFn8yhc42dQ",
        authDomain: "pvk-petanque.firebaseapp.com",
        databaseURL: "https://pvk-petanque-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "pvk-petanque",
        storageBucket: "pvk-petanque.firebasestorage.app",
        messagingSenderId: "331977904647",
        appId: "1:331977904647:web:cb7b3f8d30826c01a410a2"
      });
    }
    db = firebase.database();
    fbAuth = firebase.auth();
  } catch(e) { console.warn('Firebase:', e.message); }
})();

// Champs de profil qu'un membre peut écrire lui-même (les règles Firebase l'imposent aussi)
const CHAMPS_PROFIL = ['id','email','prenom','nom','tel','naissance','adresse','fonction','inscritLe'];

// Profil écrit par le membre lui-même (jamais le rôle, l'abonnement ni les paiements)
function fbSaveProfil(user) {
  if (!db) return Promise.reject(new Error('hors ligne'));
  var copy = {};
  CHAMPS_PROFIL.forEach(function(k){ if (user[k] !== undefined && user[k] !== null) copy[k] = user[k]; });
  return Promise.all([
    db.ref('users/' + user.id).update(copy),
    db.ref('annuaire/' + user.id).update(ficheAnnuaire(user))
  ]);
}
// Fiche publique de l'annuaire : pas d'adresse, pas de date de naissance, pas d'email
function ficheAnnuaire(u) {
  return { prenom: u.prenom || '', nom: u.nom || '', tel: u.tel || '', fonction: u.fonction || 'Membre' };
}
// Lire une liste Firebase (news, agenda, annuaire) — callback(null) si refusé / hors ligne
function fbList(path, callback) {
  if (!db) { callback(null); return; }
  db.ref(path).once('value')
    .then(function(snap) {
      var list = [];
      snap.forEach(function(child) { var v = child.val() || {}; v.id = child.key; list.push(v); });
      callback(list);
    })
    .catch(function(e) { console.warn(path + ':', e.message); callback(null); });
}

// Écriture admin : abonnement (validation)
function fbSyncUser(user) {
  if (!db) return;
  try { db.ref('users/' + user.id + '/abonnement').set(user.abonnement || null); } catch(e) {}
}

// Paiements mensuels : users/<id>/paiements/<AAAA-MM> = true
function fbSetPaiement(userId, mois, paye) {
  if (!db) return Promise.reject(new Error('hors ligne'));
  return db.ref('users/' + userId + '/paiements/' + mois).set(paye ? true : null);
}
function fbLoadPaiements(userId, callback) {
  if (!db) { callback(null); return; }
  db.ref('users/' + userId + '/paiements').once('value')
    .then(function(snap) { callback(snap.val() || {}); })
    .catch(function() { callback(null); });
}

// Charger tous les membres depuis Firebase (admin uniquement) — callback(null) en cas d'échec
function fbLoadAllUsers(callback) {
  if (!db) { callback(null); return; }
  Promise.all([db.ref('users').once('value'), db.ref('admins').once('value')])
    .then(function(res) {
      var admins = res[1].val() || {};
      var list = [];
      res[0].forEach(function(child) {
        var u = child.val() || {};
        u.id = u.id || child.key;
        delete u.password;
        u.role = admins[u.id] ? 'admin' : 'membre';
        list.push(u);
      });
      callback(list);
    })
    .catch(function(e) { console.warn('Chargement membres:', e.message); callback(null); });
}

// Charger le profil du membre connecté (+ savoir s'il est admin)
function fbLoadProfil(authUser) {
  return Promise.all([
    db.ref('users/' + authUser.uid).once('value'),
    db.ref('admins/' + authUser.uid).once('value')
  ]).then(function(res) {
    var u = res[0].val() || { id: authUser.uid, email: estEmailTechnique(authUser.email) ? '' : authUser.email, prenom: '', nom: '' };
    u.id = authUser.uid;
    delete u.password;
    u.estAdmin = !!res[1].val();          // vrai rôle (ne change pas en « vue membre »)
    u.role = u.estAdmin ? 'admin' : 'membre';
    return u;
  });
}

/* ===================== STOCKAGE localStorage ===================== */

/* ===================== DONNÉES ===================== */



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




/* ===================== ÉTAT ===================== */
let currentUser = null;
let currentPage = 'login';
let agendaMode = 'club';

const BUREAU_FONCTIONS = ['Président','Vice-Président','Secrétaire','Trésorier','Capitaine'];

const getUsers       = () => { try { return JSON.parse(localStorage.getItem('pvk_users')||'[]'); } catch { return []; } };
const saveUsers      = u  => localStorage.setItem('pvk_users', JSON.stringify(u));
const getCurrentUser = () => { try { return JSON.parse(localStorage.getItem('pvk_current')||'null'); } catch { return null; } };
const saveCurrentUser= u  => localStorage.setItem('pvk_current', JSON.stringify(u));

/* ===================== SAISON & COTISATION ===================== */
const SAISON_COURANTE = '2026-2027';
const SAISON_EXPIRE   = 'Sans date de fin';
const COTISATION_MOIS = 5;   // € par mois
const COTISATION_AN   = 60;  // € par an
// Mois suivis : novembre et décembre 2026, puis tous les mois de 2027
const MOIS_COTISATION = ['2026-11','2026-12'].concat(
  ['01','02','03','04','05','06','07','08','09','10','11','12'].map(function(m){ return '2027-' + m; })
);
const MOIS_NOMS = ['Janv','Févr','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'];

/* ===================== HELPERS ===================== */
const initials = (p, n) => ((p||'?')[0]+(n||'?')[0]).toUpperCase();

function getSaison(d) { return SAISON_COURANTE; }
function getExpiry(saison) { return SAISON_EXPIRE; }
function formatDateFr(iso) {
  if (!iso) return '—';
  var p = iso.split('-');
  return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
}

/* ===================== FINANCE (paiements mensuels) ===================== */
function paiementsResume(p) {
  p = p || {};
  var payes = MOIS_COTISATION.filter(function(m){ return p[m]; }).length;
  return { payes: payes, total: MOIS_COTISATION.length,
           montant: payes * COTISATION_MOIS,
           reste: (MOIS_COTISATION.length - payes) * COTISATION_MOIS };
}
// editable = true → cases à cocher (admin) ; false → lecture seule (adhérent)
function buildGrilleMois(p, userId, editable) {
  p = p || {};
  var annees = {};
  MOIS_COTISATION.forEach(function(m) {
    var y = m.split('-')[0];
    (annees[y] = annees[y] || []).push(m);
  });
  return Object.keys(annees).map(function(y) {
    return '<div class="fin-annee"><div class="fin-annee-titre">' + y + '</div><div class="fin-grille">' +
      annees[y].map(function(m) {
        var ok = !!p[m];
        var nom = MOIS_NOMS[parseInt(m.split('-')[1], 10) - 1];
        if (editable) {
          return '<label class="fin-mois' + (ok ? ' paye' : '') + '">' +
            '<input type="checkbox"' + (ok ? ' checked' : '') +
            ' onchange="adminTogglePaiement(\'' + userId + '\',\'' + m + '\',this.checked)"/>' +
            '<span>' + nom + '</span></label>';
        }
        return '<div class="fin-mois' + (ok ? ' paye' : '') + '"><span class="fin-check">' + (ok ? '✓' : '·') + '</span><span>' + nom + '</span></div>';
      }).join('') + '</div></div>';
  }).join('');
}
function buildResumeHtml(p) {
  var r = paiementsResume(p);
  return '<div class="fin-resume">' +
    '<span class="fin-pill ' + (r.payes ? 'ok' : 'du') + '">' + (r.payes ? '✓ ' : '') + r.payes + '/' + r.total + ' mois · ' + r.montant + ' €</span>' +
    (r.reste > 0 ? '<span class="fin-pill du">Reste ' + r.reste + ' €</span>' : '<span class="fin-pill ok">À jour 🎉</span>') +
    '</div>';
}
function getPaiementDate() {
  const n = new Date();
  return `${String(n.getDate()).padStart(2,'0')}/${String(n.getMonth()+1).padStart(2,'0')}/${n.getFullYear()}`;
}
// Pas de date de fin : un adhérent est actif tant que l'admin ne l'a pas désactivé
function isAbonnementActif(user) {
  return !!(user && user.abonnement && user.abonnement.statut === 'actif');
}
function daysUntilExpiry(user) { return isAbonnementActif(user) ? 99999 : -999; }
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
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== CONTRÔLE D'ACCÈS ===== */
// Pages libres à tous les membres connectés (payants ou non)
const FREE_PAGES = ['accueil','club','agenda','actualites','adhesion','abonnement','profil'];
// Pages réservées aux adhérents actifs
const MEMBER_PAGES = ['contacts','carte','membres'];
// Page admin uniquement
const ADMIN_PAGES = ['admin'];

function canAccess(page) {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  if (FREE_PAGES.includes(page)) return true;
  if (MEMBER_PAGES.includes(page) && isAbonnementActif(currentUser)) return true;
  return false;
}

/* ===================== NETTOYAGE localStorage ===================== */
// Les anciennes versions gardaient des mots de passe en clair sur le téléphone : on les efface.
function nettoyerAnciennesDonnees() {
  try {
    var users = getUsers().filter(function(u){ return u.id !== 'admin'; });
    users.forEach(function(u){ delete u.password; });
    saveUsers(users);
    var cur = getCurrentUser();
    if (cur && cur.password) localStorage.removeItem('pvk_current');
  } catch(e) {}
}

/* ===================== AUTH ===================== */
function switchTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabRegister').classList.toggle('active', tab==='register');
  document.getElementById('formLogin').classList.toggle('hidden', tab!=='login');
  document.getElementById('formRegister').classList.toggle('hidden', tab!=='register');
}

/* Identifiant de connexion : le numéro de portable.
   Firebase exige un email : on fabrique une adresse technique à partir du numéro
   (ex. 0612345678@tel.pvk-petanque.firebaseapp.com). Elle ne reçoit jamais de courrier. */
const DOMAINE_TEL = 'tel.pvk-petanque.firebaseapp.com';
function normaliserPortable(tel) {
  var d = (tel || '').replace(/\D/g, '');
  if (d.indexOf('0033') === 0) d = d.slice(4);
  if (d.indexOf('33') === 0 && d.length === 11) d = d.slice(2);
  if (d.length === 9) d = '0' + d;
  return d;
}
function identifiantVersEmailAuth(saisie) {
  saisie = (saisie || '').trim().toLowerCase();
  if (saisie.indexOf('@') >= 0) return saisie;          // compte créé avec un email (ex. admin)
  return normaliserPortable(saisie) + '@' + DOMAINE_TEL;
}
function estEmailTechnique(email) { return !!email && email.slice(-DOMAINE_TEL.length) === DOMAINE_TEL; }

function messageErreurAuth(err) {
  var c = (err && err.code) || '';
  if (c === 'auth/email-already-in-use') return 'Ce numéro de portable est déjà inscrit. Utilisez « Connexion ».';
  if (c === 'auth/invalid-email') return 'Numéro de portable ou email invalide.';
  if (c === 'auth/weak-password') return 'Mot de passe trop court (6 caractères minimum).';
  if (c === 'auth/user-not-found' || c === 'auth/wrong-password' || c === 'auth/invalid-credential' || c === 'auth/invalid-login-credentials')
    return 'Portable ou mot de passe incorrect.';
  if (c === 'auth/too-many-requests') return 'Trop de tentatives. Réessayez dans quelques minutes.';
  if (c === 'auth/network-request-failed') return 'Pas de connexion internet.';
  return 'Erreur : ' + ((err && err.message) || 'inconnue');
}

function ouvrirSession(authUser) {
  return fbLoadProfil(authUser).then(function(u) {
    currentUser = u; saveCurrentUser(u);
    var users = getUsers(), i = users.findIndex(function(x){ return x.id === u.id; });
    if (i < 0) users.push(u); else users[i] = u;
    saveUsers(users);
    enterApp();
  });
}

function doLogin(e) {
  e.preventDefault();
  if (!fbAuth) { showError('loginError', 'Service indisponible. Vérifiez votre connexion.'); return; }
  var email = identifiantVersEmailAuth(document.getElementById('loginEmail').value);
  var pass  = document.getElementById('loginPassword').value;
  showError('loginError', '⏳ Connexion en cours…');
  authEnCours = true;
  fbAuth.signInWithEmailAndPassword(email, pass)
    .then(function(cred) { return ouvrirSession(cred.user); })
    .catch(function(err) { showError('loginError', messageErreurAuth(err)); })
    .then(function() { authEnCours = false; });
}

function motDePasseOublie() {
  var saisie = document.getElementById('loginEmail').value.trim().toLowerCase();
  if (!saisie) { showError('loginError', 'Saisissez d\'abord votre portable ou email ci-dessus.'); return; }
  if (saisie.indexOf('@') < 0) {
    openModal('Mot de passe oublié', '<p>Pour un compte créé avec le numéro de portable, contactez l\'administrateur du club : il supprimera votre compte et vous pourrez vous réinscrire avec le même numéro.</p>');
    return;
  }
  var email = saisie;
  if (!fbAuth) { showError('loginError', 'Service indisponible.'); return; }
  fbAuth.sendPasswordResetEmail(email)
    .then(function() { showToast('📧 Email de réinitialisation envoyé à ' + email); })
    .catch(function(err) { showError('loginError', messageErreurAuth(err)); });
}

function doRegister(e) {
  e.preventDefault();
  const email   = document.getElementById('regEmail').value.trim().toLowerCase(); // facultatif, pour le contact
  const pass    = document.getElementById('regPassword').value;
  const prenom  = document.getElementById('regPrenom').value.trim();
  const nom     = document.getElementById('regNom').value.trim();
  const tel     = document.getElementById('regTel').value.trim();
  const fonction= document.getElementById('regFonction').value;
  const adresse = document.getElementById('regAdresse').value.trim();
  const naissance = document.getElementById('regNaissance').value; // AAAA-MM-JJ
  // Champs obligatoires
  if (!nom || !prenom || !tel || !adresse || !naissance) {
    showError('regError', 'Merci de remplir : nom, prénom, portable, adresse et date de naissance.'); return;
  }
  if (!/^(?:\+33\s?|0)[67](?:[\s.-]?\d{2}){4}$/.test(tel)) {
    showError('regError', 'Numéro de portable invalide (ex : 06 12 34 56 78).'); return;
  }
  var dn = new Date(naissance);
  if (isNaN(dn.getTime()) || dn > new Date() || dn.getFullYear() < 1900) {
    showError('regError', 'Date de naissance invalide.'); return;
  }
  if (!fbAuth) { showError('regError', 'Service indisponible. Vérifiez votre connexion.'); return; }
  showError('regError', '⏳ Création du compte…');
  authEnCours = true;
  fbAuth.createUserWithEmailAndPassword(identifiantVersEmailAuth(tel), pass)
    .then(function(cred) {
      var profil = { id: cred.user.uid, email: email || '', prenom: prenom, nom: nom, tel: tel, naissance: naissance,
                     fonction: fonction || 'Membre', adresse: adresse, inscritLe: getPaiementDate() };
      return fbSaveProfil(profil).then(function() { return ouvrirSession(cred.user); });
    })
    .then(function() { showToast('✅ Compte créé ! L\'administrateur va valider votre adhésion.'); })
    .catch(function(err) { showError('regError', messageErreurAuth(err)); })
    .then(function() { authEnCours = false; });
}

function logout() {
  currentUser = null; localStorage.removeItem('pvk_current');
  if (fbAuth) fbAuth.signOut().catch(function(){});
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
  // Bascule « Vue membre » (réservée aux vrais admins)
  const vueMembre = !!currentUser.estAdmin && currentUser.role !== 'admin';
  document.getElementById('vueMembreItem').classList.toggle('hidden', !currentUser.estAdmin);
  document.getElementById('vueMembreLabel').textContent = vueMembre ? 'Revenir en vue admin' : 'Vue membre';
  document.getElementById('vueMembreIcon').textContent  = vueMembre ? '⚙️' : '👁️';
  document.getElementById('bandeauVueMembre').classList.toggle('hidden', !vueMembre);
}

// L'admin voit l'appli exactement comme un membre (sans les outils admin), puis revient
function basculerVueMembre() {
  if (!currentUser || !currentUser.estAdmin) return;
  currentUser.role = currentUser.role === 'admin' ? 'membre' : 'admin';
  updateSidebar();
  closeSidebar();
  showPage('accueil');
  showToast(currentUser.role === 'admin' ? '⚙️ Retour en vue admin' : '👁️ Vue membre : vous voyez l\'appli comme un adhérent');
}

function nav(page) { showPage(page); closeSidebar(); }

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(`page-${page}`);
  if (el) el.classList.add('active');
  const navMap = { accueil:'navAccueil', agenda:'navAgenda', actualites:'navActus', membres:'navMembres', profil:'navProfil' };
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
    case 'contacts':   break;
    case 'adhesion':   break;
    case 'carte':      renderCarte(); break;
    case 'abonnement': renderAbonnement(); break;
    case 'membres':    renderMembres(); break;
    case 'profil':     renderProfil(); break;
    case 'admin':      renderAdmin(); break;
  }
}

/* ===================== ACCUEIL ===================== */
function renderAccueil() {
  if (!currentUser) return;
  document.getElementById('welcomeName').textContent = `Bonjour, ${currentUser.prenom} !`;
  const isAdmin = currentUser.role === 'admin';
  document.getElementById('counterSimple').classList.toggle('hidden', isAdmin);
  document.getElementById('counterAdmin').classList.toggle('hidden', !isAdmin);
  if (isAdmin) {
    const users  = getUsers();
    const actifs = users.filter(u => isAbonnementActif(u));
    document.getElementById('cntTotalA').textContent  = users.length;
    document.getElementById('cntActifs').textContent  = actifs.length;
    document.getElementById('cntExpires').textContent = users.length - actifs.length;
  } else {
    document.getElementById('cntTotal').textContent = '—';
    if (isAbonnementActif(currentUser)) {
      fbList('annuaire', function(l) {
        if (l) document.getElementById('cntTotal').textContent = l.filter(m => m.actif).length;
      });
    }
  }
  // Statut perso
  const actif = isAbonnementActif(currentUser);
  const sc = document.getElementById('statusCard');
  sc.className = `status-card${actif?'':' expired'}`;
  document.getElementById('statusIcon').textContent = actif ? '✅' : '❌';
  document.getElementById('statusVal').textContent  = actif ? 'Actif' : 'Inactif';
  document.getElementById('statusExpiry').textContent = actif ? 'Adhésion sans date de fin' : 'En attente de validation par l\'administrateur';
  // Aperçu actualités
  const preview = document.getElementById('newsPreview');
  preview.innerHTML = '<p class="vide">⏳ Chargement…</p>';
  chargerNews(function(list) {
    preview.innerHTML = list === null ? '<p class="vide">Actualités indisponibles.</p>'
      : list.length ? list.slice(0,2).map(n => buildNewsCard(n, true)).join('')
      : '<p class="vide">Aucune actualité pour le moment.</p>';
  });
}

/* ===================== CLUB ===================== */
function renderClub() {
  const c = document.getElementById('bureauList');
  if (!canAccess('membres')) { c.innerHTML = '<p class="vide">Le bureau est visible par les adhérents.</p>'; return; }
  c.innerHTML = '<p class="vide">⏳ Chargement…</p>';
  fbList('annuaire', function(list) {
    if (list === null) { c.innerHTML = '<p class="vide">Bureau indisponible.</p>'; return; }
    const bureau = list.filter(u => u.actif && BUREAU_FONCTIONS.includes(u.fonction||''))
      .sort((a,b) => BUREAU_FONCTIONS.indexOf(a.fonction) - BUREAU_FONCTIONS.indexOf(b.fonction));
    c.innerHTML = bureau.map(u => `
      <div class="membre-card" style="cursor:default">
        <div class="membre-avatar gold">${initials(u.prenom,u.nom)}</div>
        <div class="membre-info">
          <div class="membre-name">${escapeHtml(u.prenom)} ${escapeHtml(u.nom)}</div>
          <span class="membre-fonction bureau">${escapeHtml(u.fonction)}</span>
          ${u.tel?`<div class="membre-row"><span>📞</span><a href="tel:${escapeHtml(u.tel)}" class="link-red">${escapeHtml(u.tel)}</a></div>`:''}
        </div>
      </div>`).join('') || '<p class="vide">Aucun membre du bureau enregistré.</p>';
  });
}

/* ===================== ACTUALITÉS (Firebase, gérées par l'admin) ===================== */
const NEWS_TYPES = { info:'Info', annonce:'Annonce', tournoi:'Tournoi', urgent:'Urgent' };

function chargerNews(callback) {
  fbList('news', function(list) {
    if (list) list.sort((a,b) => (b.ts||0) - (a.ts||0));
    callback(list);
  });
}
function buildNewsCard(n, apercu) {
  const type = NEWS_TYPES[n.type] ? n.type : 'info';
  const body = escapeHtml(n.body || '');
  const isAdmin = currentUser && currentUser.role === 'admin';
  return `<div class="news-card"${apercu?' style="margin-bottom:10px"':''}>
    <div class="news-accent"></div>
    <span class="news-badge ${type}">${NEWS_TYPES[type]}</span>
    <div class="news-title">${escapeHtml(n.title || '')}</div>
    <div class="news-body">${apercu && body.length > 110 ? body.substring(0,110) + '…' : body.replace(/\n/g,'<br/>')}</div>
    <div class="news-date">📅 ${escapeHtml(n.date || '')}</div>
    ${!apercu && isAdmin ? `<button class="admin-btn del mt-8" onclick="adminSupprimerNews('${n.id}')">🗑️ Supprimer</button>` : ''}
  </div>`;
}
function renderActualites() {
  const isAdmin = currentUser && currentUser.role === 'admin';
  document.getElementById('newsAdminForm').classList.toggle('hidden', !isAdmin);
  const c = document.getElementById('newsContainer');
  c.innerHTML = '<p class="vide">⏳ Chargement…</p>';
  chargerNews(function(list) {
    c.innerHTML = list === null ? '<p class="vide">Actualités indisponibles (connexion ?).</p>'
      : list.length ? list.map(n => buildNewsCard(n, false)).join('')
      : '<p class="vide">Aucune actualité pour le moment.</p>';
  });
}
function adminPublierNews() {
  if (!currentUser || currentUser.role !== 'admin' || !db) return;
  const title = document.getElementById('newsTitre').value.trim();
  const body  = document.getElementById('newsTexte').value.trim();
  const type  = document.getElementById('newsType').value;
  if (!title || !body) { showToast('⚠️ Titre et texte obligatoires'); return; }
  const now = new Date();
  db.ref('news').push({ title: title.slice(0,150), body: body.slice(0,2000), type: type, ts: now.getTime(),
                        date: now.toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) })
    .then(function() {
      document.getElementById('newsTitre').value = ''; document.getElementById('newsTexte').value = '';
      showToast('✅ Actualité publiée'); renderActualites();
    })
    .catch(function() { showToast('⚠️ Publication impossible'); });
}
function adminSupprimerNews(id) {
  if (!confirm('Supprimer cette actualité ?')) return;
  db.ref('news/' + id).remove().then(function(){ showToast('🗑️ Actualité supprimée'); renderActualites(); })
    .catch(function(){ showToast('⚠️ Suppression impossible'); });
}

/* ===================== AGENDA ===================== */
const MOIS_LONGS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const AGENDA_FRANCE_COMPLET = [...AGENDA_FRANCE, ...AGENDA_CIVIL];
function dateEvenement(ev) { return new Date(ev.year, MOIS_LONGS.indexOf(ev.month), ev.day); }
function aVenir(list) {
  const auj = new Date(); auj.setHours(0,0,0,0);
  return list.filter(ev => dateEvenement(ev) >= auj).sort((a,b) => dateEvenement(a) - dateEvenement(b));
}

function switchAgenda(mode) {
  agendaMode = mode;
  const ids = { club:'tabAgendaClub', france:'tabAgendaFr', inde:'tabAgendaInde' };
  Object.keys(ids).forEach(m => {
    document.getElementById(ids[m])?.classList.toggle('active', m === mode);
  });
  renderAgenda();
}

function renderAgenda() {
  const isAdmin = currentUser && currentUser.role === 'admin';
  document.getElementById('agendaAdminForm').classList.toggle('hidden', !(isAdmin && agendaMode === 'club'));
  const c = document.getElementById('agendaContainer');
  if (agendaMode !== 'club') {
    afficherAgenda(aVenir(agendaMode === 'inde' ? AGENDA_INDE : AGENDA_FRANCE_COMPLET), false);
    return;
  }
  c.innerHTML = '<p class="vide">⏳ Chargement…</p>';
  fbList('agenda', function(list) {
    if (list === null) { c.innerHTML = '<p class="vide">Agenda indisponible (connexion ?).</p>'; return; }
    const evs = list.map(e => {
      const p = (e.date || '').split('-');
      return { id: e.id, day: +p[2], month: MOIS_LONGS[+p[1]-1], year: +p[0],
               name: e.name || '', detail: e.detail || '', type: e.type || 'special' };
    }).filter(e => e.month);
    afficherAgenda(aVenir(evs), isAdmin);
  });
}

function afficherAgenda(data, avecSuppression) {
  const typeLabel = { tournoi:'Tournoi', special:'Événement', ferie:'Jour Férié', vacances:'Vacances 🏫', admin:'Démarche', impot:'Fiscal', election:'Élection', entrainement:'Entraînement', reunion:'Réunion' };
  let lastMonth = '';
  document.getElementById('agendaContainer').innerHTML = data.length ? data.map(ev => {
    let h = '';
    const m = ev.month + ev.year;
    if (m !== lastMonth) { lastMonth = m; h = `<div class="cal-month">${ev.month} ${ev.year}</div>`; }
    return `${h}<div class="cal-event">
      <div class="cal-date"><div class="cal-day">${ev.day}</div><div class="cal-mo">${ev.month.substring(0,3)}</div></div>
      <div class="cal-info"><div class="cal-name">${escapeHtml(ev.name)}</div><div class="cal-detail">${escapeHtml(ev.detail)}</div>
        ${avecSuppression ? `<button class="admin-btn del mt-8" onclick="adminSupprimerEvenement('${ev.id}')">🗑️ Supprimer</button>` : ''}</div>
      <span class="cal-type ${ev.type}">${typeLabel[ev.type]||ev.type}</span>
    </div>`;
  }).join('') : '<p class="vide">Aucun événement à venir.</p>';
}

function adminAjouterEvenement() {
  if (!currentUser || currentUser.role !== 'admin' || !db) return;
  const date   = document.getElementById('evDate').value;
  const name   = document.getElementById('evTitre').value.trim();
  const detail = document.getElementById('evDetail').value.trim();
  const type   = document.getElementById('evType').value;
  if (!date || !name) { showToast('⚠️ Date et titre obligatoires'); return; }
  db.ref('agenda').push({ date: date, name: name.slice(0,120), detail: detail.slice(0,300), type: type, ts: Date.now() })
    .then(function() {
      ['evDate','evTitre','evDetail'].forEach(id => document.getElementById(id).value = '');
      showToast('✅ Événement ajouté'); renderAgenda();
    })
    .catch(function() { showToast('⚠️ Ajout impossible'); });
}
function adminSupprimerEvenement(id) {
  if (!confirm('Supprimer cet événement ?')) return;
  db.ref('agenda/' + id).remove().then(function(){ showToast('🗑️ Événement supprimé'); renderAgenda(); })
    .catch(function(){ showToast('⚠️ Suppression impossible'); });
}

/* ===================== MON PROFIL ===================== */
function renderProfil() {
  if (!currentUser) return;
  document.getElementById('pfPrenom').value    = currentUser.prenom || '';
  document.getElementById('pfNom').value       = currentUser.nom || '';
  document.getElementById('pfTel').value       = currentUser.tel || '';
  document.getElementById('pfNaissance').value = currentUser.naissance || '';
  document.getElementById('pfAdresse').value   = currentUser.adresse || '';
  document.getElementById('pfEmail').value     = currentUser.email || '';
}
function enregistrerProfil(e) {
  e.preventDefault();
  if (!currentUser) return;
  const maj = {
    prenom:    document.getElementById('pfPrenom').value.trim(),
    nom:       document.getElementById('pfNom').value.trim(),
    naissance: document.getElementById('pfNaissance').value,
    adresse:   document.getElementById('pfAdresse').value.trim(),
    email:     document.getElementById('pfEmail').value.trim().toLowerCase()
  };
  if (!maj.prenom || !maj.nom || !maj.adresse || !maj.naissance) { showToast('⚠️ Nom, prénom, adresse et date de naissance obligatoires'); return; }
  const dn = new Date(maj.naissance);
  if (isNaN(dn.getTime()) || dn > new Date() || dn.getFullYear() < 1900) { showToast('⚠️ Date de naissance invalide'); return; }
  const nouveau = Object.assign({}, currentUser, maj);
  fbSaveProfil(nouveau).then(function() {
    currentUser = nouveau; saveCurrentUser(nouveau);
    const users = getUsers(), i = users.findIndex(u => u.id === nouveau.id);
    if (i >= 0) { users[i] = Object.assign(users[i], maj); saveUsers(users); }
    updateSidebar();
    showToast('✅ Profil enregistré');
  }).catch(function() { showToast('⚠️ Enregistrement impossible (connexion ?)'); });
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
  document.getElementById('mcStatus').innerHTML   = ok ? '<span class="badge-active">✓ ACTIF</span>' : '<span class="badge-active badge-expired">✗ INACTIF</span>';
  document.getElementById('mcValidity').textContent = ok ? 'Valide — sans date de fin' : 'En attente de validation';
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
  document.getElementById('aboStatut').textContent = actif ? '✅ Actif' : '❌ Inactif';
  document.getElementById('aboStatut').style.color = actif ? '#22c55e' : '#ef4444';
  document.getElementById('aboSaison').textContent  = abo?.saison || '—';
  document.getElementById('aboPaiement').textContent= abo?.paiement || '—';
  document.getElementById('aboExpire').textContent  = 'Sans date de fin';
  document.getElementById('renewSection').classList.toggle('hidden', actif);
  renderMesPaiements(currentUser.paiements);
  // Rafraîchir depuis Firebase (l'admin a pu cocher des mois depuis un autre appareil)
  fbLoadPaiements(currentUser.id, function(p) {
    if (p === null || !currentUser) return;
    currentUser.paiements = p; saveCurrentUser(currentUser);
    var users = getUsers(), idx = users.findIndex(function(u){ return u.id === currentUser.id; });
    if (idx >= 0) { users[idx].paiements = p; saveUsers(users); }
    if (currentPage === 'abonnement') renderMesPaiements(p);
  });
}

function renderMesPaiements(p) {
  var card = document.getElementById('mesPaiementsCard');
  if (!card) return;
  // L'admin est aussi adhérent : il voit ses propres paiements comme tout le monde
  document.getElementById('mesPaiements').innerHTML = buildGrilleMois(p, null, false);
}

function renewSubscription() {
  var users=getUsers(), idx=users.findIndex(function(u){return u.id===currentUser.id;}); if(idx<0)return;
  var saison=getSaison(new Date());
  users[idx].abonnement={saison:saison,paiement:getPaiementDate(),expire:getExpiry(saison),statut:'actif'};
  saveUsers(users); currentUser=users[idx]; saveCurrentUser(currentUser);
  showToast('✅ Abonnement renouvelé !'); renderAbonnement();
}

/* ===================== MEMBRES (annuaire Firebase) ===================== */
let membreFilter = 'tous';
let annuaireCache = [];

function renderMembres() {
  const actif = canAccess('membres');
  document.getElementById('membresAccessMsg').classList.toggle('hidden', actif);
  document.getElementById('membresContent').classList.toggle('hidden', !actif);
  if (!actif) return;
  document.getElementById('membresContainer').innerHTML = '<div class="membres-empty">⏳ Chargement…</div>';
  fbList('annuaire', function(list) {
    if (list === null) { document.getElementById('membresContainer').innerHTML = '<div class="membres-empty">Annuaire indisponible (connexion ?).</div>'; return; }
    annuaireCache = list.filter(u => u.actif);
    renderMembreStats();
    filterMembres();
  });
}

function renderMembreStats() {
  const bureau = annuaireCache.filter(u => BUREAU_FONCTIONS.includes(u.fonction||'')).length;
  document.getElementById('membreStats').innerHTML = `
    <div class="mstat actif"><span class="mstat-val">${annuaireCache.length}</span><span class="mstat-lbl">Adhérents</span></div>
    <div class="mstat bureau"><span class="mstat-val">${bureau}</span><span class="mstat-lbl">Bureau</span></div>
  `;
}

function setMembreFilter(f) {
  membreFilter = f;
  ['tous','bureau'].forEach(x => {
    document.getElementById('filter'+x.charAt(0).toUpperCase()+x.slice(1))?.classList.toggle('active', x===f);
  });
  filterMembres();
}

function filterMembres() {
  const q = (document.getElementById('membreSearch')?.value||'').toLowerCase();
  let users = annuaireCache.slice();
  if (membreFilter === 'bureau') users = users.filter(u => BUREAU_FONCTIONS.includes(u.fonction||''));
  if (q) users = users.filter(u => `${u.prenom} ${u.nom} ${u.fonction||''} ${u.tel||''}`.toLowerCase().includes(q));
  users.sort((a,b) => {
    const ai = BUREAU_FONCTIONS.indexOf(a.fonction||''), bi = BUREAU_FONCTIONS.indexOf(b.fonction||'');
    if (ai !== -1 && bi === -1) return -1;
    if (ai === -1 && bi !== -1) return 1;
    if (ai !== -1 && bi !== -1) return ai - bi;
    return `${a.nom}${a.prenom}`.localeCompare(`${b.nom}${b.prenom}`);
  });
  const c = document.getElementById('membresContainer');
  c.innerHTML = users.length ? users.map(buildMembreCard).join('') : '<div class="membres-empty">Aucun membre trouvé.</div>';
}

function buildMembreCard(u) {
  const isBureau = BUREAU_FONCTIONS.includes(u.fonction||'');
  const tel = escapeHtml(u.tel || '');
  return `
  <div class="membre-detail-card">
    <div class="mdc-header">
      <div class="mdc-avatar ${isBureau?'gold':''}">${initials(u.prenom, u.nom)}</div>
      <div class="mdc-identity">
        <div class="mdc-name">${escapeHtml(u.prenom||'')} ${escapeHtml(u.nom||'')}</div>
        <div class="mdc-meta"><span class="membre-fonction ${isBureau?'bureau':''}">${escapeHtml(u.fonction||'Membre')}</span></div>
      </div>
    </div>
    ${tel ? `<div class="mdc-contacts">
      <a href="tel:${tel}" class="mdc-contact-row">
        <div class="mdc-contact-icon tel">📞</div>
        <div class="mdc-contact-info"><div class="mdc-contact-label">Portable</div><div class="mdc-contact-val">${tel}</div></div>
        <div class="mdc-contact-action">Appeler</div>
      </a></div>` : ''}
  </div>`;
}

/* ===================== ADMIN ===================== */
function renderAdmin() {
  if (!currentUser || currentUser.role !== 'admin') return;
  // Charger depuis Firebase pour voir TOUS les membres
  document.getElementById('adminMembersContainer').innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:16px">⏳ Chargement des membres…</p>';
  fbLoadAllUsers(function(fbUsers) {
    if (fbUsers === null) {
      showToast('⚠️ Impossible de charger les membres (droits ou connexion)');
      renderAdminWithUsers(getUsers());
      return;
    }
    saveUsers(fbUsers);
    renderAdminWithUsers(fbUsers);
    synchroniserAnnuaire(fbUsers);
  });
}

// Garder l'annuaire aligné sur les profils et les statuts (écriture admin)
function synchroniserAnnuaire(users) {
  if (!db) return;
  var maj = {};
  users.forEach(function(u) {
    if (!u.prenom && !u.nom) return;
    var f = ficheAnnuaire(u);
    Object.keys(f).forEach(function(k){ maj['annuaire/' + u.id + '/' + k] = f[k]; });
    maj['annuaire/' + u.id + '/actif'] = isAbonnementActif(u);
  });
  if (Object.keys(maj).length) db.ref().update(maj).catch(function(e){ console.warn('annuaire:', e.message); });
}


function renderAdminWithUsers(users) {
  var actifs  = users.filter(function(u){ return isAbonnementActif(u); });
  var expires = users.filter(function(u){ return !isAbonnementActif(u); });
  document.getElementById('statTotal').textContent   = users.length;
  document.getElementById('statActifs').textContent  = actifs.length;
  document.getElementById('statExpires').textContent = expires.length;
  var encaisse = users.reduce(function(s, u){ return s + paiementsResume(u.paiements).montant; }, 0);
  document.getElementById('statCA').textContent      = encaisse + '€';
  renderAdminFinance(users);
  document.getElementById('adminMembersContainer').innerHTML = users.map(function(u) {
    var ok = isAbonnementActif(u);
    return '<div class="admin-member">' +
      '<div class="admin-avatar">' + initials(u.prenom, u.nom) + '</div>' +
      '<div class="admin-member-info">' +
        '<div class="admin-member-name">' + u.prenom + ' ' + u.nom + '</div>' +
        '<div class="admin-member-email">' + (u.tel ? '📞 ' + u.tel : '') + (u.email ? (u.tel ? ' · ' : '') + u.email : '') + '</div>' +
      '</div>' +
      '<span class="admin-badge ' + (ok?'actif':'expire') + '">' + (ok?'Actif':'Inactif') + '</span>' +
      '<div class="admin-actions">' +
        (!ok ? '<button class="admin-btn valid" title="Valider" onclick="adminValidate(\'' + u.id + '\')">✓</button>'
             : (u.role !== 'admin' ? '<button class="admin-btn pause" title="Désactiver" onclick="adminDesactiver(\'' + u.id + '\')">⏸</button>' : '')) +
        (u.role !== 'admin' ? '<button class="admin-btn del" onclick="adminDelete(\'' + u.id + '\')">✕</button>' : '') +
      '</div></div>';
  }).join('');
}
/* ----- Suivi des cotisations (admin uniquement) ----- */
function renderAdminFinance(users) {
  var c = document.getElementById('adminFinanceContainer');
  if (!c) return;
  var q = (document.getElementById('financeSearch')?.value || '').toLowerCase();
  // Tous les adhérents, y compris l'admin (il paie aussi sa cotisation)
  var list = users.filter(function(u){ return u.prenom || u.nom; })
    .filter(function(u){ return !q || (u.prenom + ' ' + u.nom).toLowerCase().includes(q); })
    .sort(function(a, b){ return (a.nom + a.prenom).localeCompare(b.nom + b.prenom); });
  if (!list.length) { c.innerHTML = '<p class="fin-vide">Aucun adhérent.</p>'; return; }
  c.innerHTML = list.map(function(u) {
    return '<div class="card fin-card" id="fin-' + u.id + '">' +
      '<div class="fin-head"><div class="admin-avatar">' + initials(u.prenom, u.nom) + '</div>' +
      '<div class="fin-ident"><div class="admin-member-name">' + u.prenom + ' ' + u.nom + '</div>' +
      '<div class="fin-meta">📞 ' + (u.tel || '—') + ' · 🎂 ' + formatDateFr(u.naissance) + '</div>' +
      '<div class="fin-meta">📍 ' + (u.adresse || '—') + '</div></div></div>' +
      buildGrilleMois(u.paiements, u.id, true) +
      '</div>';
  }).join('');
}
function filterFinance() { renderAdminFinance(getUsers()); }

function adminTogglePaiement(userId, mois, paye) {
  if (!currentUser || currentUser.role !== 'admin') return;
  var users = getUsers(), idx = users.findIndex(function(u){ return u.id === userId; });
  if (idx < 0) return;
  var p = Object.assign({}, users[idx].paiements || {});
  if (paye) p[mois] = true; else delete p[mois];
  fbSetPaiement(userId, mois, paye).then(function() {
    users[idx].paiements = p; saveUsers(users);
    var nom = MOIS_NOMS[parseInt(mois.split('-')[1], 10) - 1] + ' ' + mois.split('-')[0];
    showToast(paye ? '✅ ' + nom + ' payé' : '↩️ ' + nom + ' décoché');
    renderAdminWithUsers(users);
  }).catch(function() {
    showToast('⚠️ Enregistrement impossible (connexion ?)');
    renderAdminWithUsers(getUsers());
  });
}

function adminValidate(id){
  var users=getUsers(), idx=users.findIndex(function(u){return u.id===id;}); if(idx<0)return;
  var saison=getSaison(new Date());
  users[idx].abonnement={saison:saison,paiement:getPaiementDate(),expire:getExpiry(saison),statut:'actif'};
  saveUsers(users);
  fbSyncUser(users[idx]); // Sync Firebase
  if (currentUser && currentUser.id === id) { currentUser.abonnement = users[idx].abonnement; saveCurrentUser(currentUser); updateSidebar(); }
  if (db) db.ref('annuaire/' + id).update(Object.assign(ficheAnnuaire(users[idx]), { actif: true })).catch(function(){});
  showToast('✅ Adhésion validée'); renderAdmin();
}
function adminDesactiver(id){
  var users=getUsers(), idx=users.findIndex(function(u){return u.id===id;}); if(idx<0)return;
  if(!confirm('Désactiver ' + users[idx].prenom + ' ' + users[idx].nom + ' ? Il garde son compte et ses paiements, mais n\'a plus accès aux rubriques adhérents.'))return;
  users[idx].abonnement = Object.assign({}, users[idx].abonnement || {}, { statut:'inactif' });
  saveUsers(users);
  fbSyncUser(users[idx]);
  if (db) db.ref('annuaire/' + id + '/actif').set(false).catch(function(){});
  showToast('⏸ Adhérent désactivé'); renderAdmin();
}

function adminDelete(id){
  if(!confirm('Supprimer ce membre ? (son profil et ses paiements seront effacés)'))return;
  saveUsers(getUsers().filter(function(u){return u.id!==id;}));
  if(db) try { db.ref('users/'+id).remove(); db.ref('annuaire/'+id).remove(); } catch(e) {} // Supprimer Firebase
  showToast('🗑️ Membre supprimé'); renderAdmin();
}

/* ===================== UTILITAIRES ===================== */
function shareCard(){
  if(navigator.share) navigator.share({title:'Carte membre PVK',text:`${currentUser.prenom} ${currentUser.nom} — Pétanque Vetri Kazhagam`});
  else showToast('📋 Partagez votre carte membre !');
}
function scrollToSubmit() {
  var btn = document.getElementById('submitRegBtn');
  if (btn) btn.scrollIntoView({ behavior:'smooth', block:'center' });
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
  nettoyerAnciennesDonnees();
  if (!fbAuth) return;
  // Firebase garde la session : reconnexion automatique si le membre ne s'est pas déconnecté
  fbAuth.onAuthStateChanged(function(authUser) {
    if (authUser && !currentUser && !authEnCours) {
      ouvrirSession(authUser).catch(function(e){ console.warn(e); });
    }
  });
});
