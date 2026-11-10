/* PVK — MODE DÉMO : appli complète avec de faux membres, rien n'est enregistré, aucune donnée réelle. */
(function(){
  // Le mode démo n'écrit jamais dans les données de l'appli réelle sur ce téléphone
  try {
    var S = Storage.prototype, g = S.getItem, s = S.setItem, r = S.removeItem;
    var k = function(x){ return (typeof x === 'string' && x.indexOf('pvk_') === 0 && x !== 'pvk_demo') ? 'pvkdemo_' + x.slice(4) : x; };
    S.getItem = function(x){ return g.call(this, k(x)); };
    S.setItem = function(x, v){ return s.call(this, k(x), v); };
    S.removeItem = function(x){ return r.call(this, k(x)); };
  } catch (e) {}

  var store = {admins:{}}, cur=null, listeners=[], accounts={}, denied=[];
  window.__denied=denied;
  function isAdmin(){ return cur && store.admins && store.admins[cur.uid]===true; }
  var SELF=['id','email','prenom','nom','tel','naissance','adresse','fonction','inscritLe'];
  function actif(){ return cur && store.users && store.users[cur.uid] && store.users[cur.uid].abonnement && store.users[cur.uid].abonnement.statut==='actif'; }
  function canRead(p){ var s=p.split('/').filter(Boolean); if(!cur) return false;
    if(s[0]==='annuaire'||s[0]==='presences') return isAdmin()||actif();
    if(['news','agenda','films','config','festivals'].includes(s[0])) return true;
    if(s[0]==='admins') return s.length===1? isAdmin() : (s[1]===cur.uid||isAdmin());
    if(s[0]==='users') return s.length===1? isAdmin() : (s[1]===cur.uid||isAdmin());
    return false; }
  function canWrite(p){ var s=p.split('/').filter(Boolean); if(!cur) return false;
    if(['news','agenda','films','config','festivals'].includes(s[0])) return isAdmin();
    if(s[0]==='annuaire' && s.length>=2){ if(isAdmin()) return true; return s[1]===cur.uid && s.length===3 && ['prenom','nom','tel','fonction'].includes(s[2]); }
    if(s[0]==='presences'){ if(isAdmin()) return true; return s.length===3 && s[2]===cur.uid && actif(); }
    if(s.length===0) return isAdmin();
    if(s[0]==='users' && s.length>=2){ if(isAdmin()) return true; return s[1]===cur.uid && s.length===3 && SELF.includes(s[2]); }
    return false; }
  function deny(op,p){ denied.push(op+' '+p); return Promise.reject(Object.assign(new Error('PERMISSION_DENIED'),{code:'PERMISSION_DENIED'})); }
  function get(path){ var o=store; for (var p of path.split('/').filter(Boolean)){ if(o==null) return null; o=o[p]; } return o===undefined?null:o; }
  function setP(path,val){ var parts=path.split('/').filter(Boolean); var o=store; for(var i=0;i<parts.length-1;i++){ o[parts[i]]=o[parts[i]]||{}; o=o[parts[i]]; } if(val===null) delete o[parts[parts.length-1]]; else o[parts[parts.length-1]]=JSON.parse(JSON.stringify(val)); }
  function snap(v){ return { val:function(){return v;}, forEach:function(cb){ if(v) Object.keys(v).forEach(function(k){ cb({key:k,val:function(){return JSON.parse(JSON.stringify(v[k]));}}); }); } }; }
  function ref(path){ return {
    set:function(v){ return canWrite(path)? (setP(path,v),Promise.resolve()) : deny('set',path); },
    update:function(v){ var base=path?path+'/':''; var ks=Object.keys(v); for(var k of ks) if(!canWrite(base+k)) return deny('update',base+k); ks.forEach(function(k){ setP(base+k, v[k]); }); return Promise.resolve(); },
    remove:function(){ return canWrite(path)? (setP(path,null),Promise.resolve()) : deny('remove',path); },
    push:function(v){ var k='k'+Math.random().toString(36).slice(2,8); return this.child(k).set(v); },
    child:function(k){ return ref(path+'/'+k); },
    once:function(){ return canRead(path)? Promise.resolve(snap(JSON.parse(JSON.stringify(get(path))))) : deny('read',path); },
  }; }
  function fire(){ setTimeout(function(){ listeners.forEach(function(l){ l(cur); }); },0); }
  var auth = {
    createUserWithEmailAndPassword:function(e,p){ if(accounts[e]) return Promise.reject({code:'auth/email-already-in-use'}); if(p.length<6) return Promise.reject({code:'auth/weak-password'}); accounts[e]={uid:'uid_'+Object.keys(accounts).length, email:e, p:p}; cur={uid:accounts[e].uid,email:e}; fire(); return Promise.resolve({user:cur}); },
    signInWithEmailAndPassword:function(e,p){ var a=accounts[e]; if(!a||a.p!==p) return Promise.reject({code:'auth/invalid-credential'}); cur={uid:a.uid,email:e}; fire(); return Promise.resolve({user:cur}); },
    signOut:function(){ cur=null; fire(); return Promise.resolve(); },
    onAuthStateChanged:function(cb){ listeners.push(cb); setTimeout(function(){cb(cur);},0); },
    sendPasswordResetEmail:function(){ return Promise.resolve(); }
  };
  window.__store=store; window.__accounts=accounts;
  window.firebase = { apps:[], initializeApp:function(){ this.apps=[1]; }, database:function(){ return { ref:function(p){ return ref(p||''); } }; }, auth:function(){ return auth; } };

  // ---- Données de démonstration ----
  var d = new Date(), iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  var plus = function(n){ var x = new Date(); x.setDate(x.getDate() + n); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
  var uid = 'demo';
  accounts['demo@demo.pvk'] = { uid: uid, email: 'demo@demo.pvk', p: 'demo' };
  var mois = ['2026-11','2026-12','2027-01','2027-02','2027-03','2027-04'], pay = {}; pay[mois[0]] = true;
  store.users = {}; store.users[uid] = { id: uid, prenom: 'Invité', nom: 'Démo', tel: '06 00 00 00 00', naissance: '1980-01-01', adresse: 'Osny',
    fonction: 'Membre', inscritLe: iso, abonnement: { statut: 'actif' }, paiements: pay };
  var noms = [['Rajan','Ramassamy'],['Anand','Selvam'],['Bala','Murugan'],['Vijay','Kannan'],['Suresh','Pillai'],['Mohan','Das'],['Arun','Prakash'],['Karthik','Raman'],['Senthil','Nathan'],['Kumar','Raja']];
  store.annuaire = {};
  noms.forEach(function(n, i){ store.annuaire['m' + i] = { prenom: n[0], nom: n[1], tel: '06 00 00 00 0' + i, fonction: 'Membre', actif: true }; });
  store.annuaire[uid] = { prenom: 'Invité', nom: 'Démo', tel: '06 00 00 00 00', fonction: 'Membre', actif: true };
  store.presences = {}; store.presences[iso] = { m0: { nom: 'Rajan Ramassamy', ts: 1 }, m2: { nom: 'Bala Murugan', ts: 2 }, m3: { nom: 'Vijay Kannan', ts: 3 }, m7: { nom: 'Karthik Raman', ts: 4 } };
  var dateFr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  store.news = {
    n1: { title: 'Bienvenue dans la démo !', body: 'Ceci est une démonstration de l\'appli du club Pétanque Vetri Kazhagam. Les membres et les actualités sont fictifs.', type: 'annonce', ts: Date.now(), date: dateFr },
    n2: { title: 'Tournoi amical samedi', body: 'Exemple d\'actualité : tournoi en doublettes, inscription sur place à 14h.', type: 'tournoi', ts: Date.now() - 1000, date: dateFr }
  };
  store.agenda = { a1: { date: plus(5), name: '🏆 Tournoi amical (exemple)', detail: 'Doublettes · terrain d\'Osny', type: 'tournoi', ts: 1 },
                   a2: { date: plus(12), name: '🍛 Repas du club (exemple)', detail: 'Après la partie', type: 'special', ts: 2 } };
  store.films = { f1: { titre: 'Film tamoul (exemple)', langue: 'ta', resume: 'Exemple de fiche : affiche, résumé, cinémas et lien pour réserver.', cinemas: ['Cinéma près de chez vous'], ts: 2 },
                  f2: { titre: 'Film hindi (exemple)', langue: 'hi', resume: 'Exemple de fiche : affiche, résumé, cinémas et lien pour réserver.', cinemas: ['Cinéma près de chez vous'], ts: 1 } };
  store.config = {};
  cur = { uid: uid, email: 'demo@demo.pvk' };   // connecté automatiquement

  window.quitterDemo = function(){ try { sessionStorage.removeItem('pvk_demo'); } catch (e) {} location.href = location.pathname; };
  document.addEventListener('DOMContentLoaded', function(){
    var b = document.createElement('div');
    b.className = 'bandeau-demo';
    b.innerHTML = '👀 Mode démo · rien n\'est enregistré <button onclick="quitterDemo()">Quitter</button>';
    document.body.appendChild(b);
    document.body.classList.add('mode-demo');
  });
})();
