/* Service worker PVK : permet l'installation comme une appli.
   Stratégie « réseau d'abord » : on affiche toujours la dernière version en ligne ;
   la copie gardée ne sert que si le téléphone est hors connexion. */
const CACHE = 'pvk-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return; // Firebase, TMDB… : pas touché
  e.respondWith(
    fetch(req).then(rep => {
      const copie = rep.clone();
      caches.open(CACHE).then(c => c.put(req, copie)).catch(() => {});
      return rep;
    }).catch(() => caches.match(req).then(r => r || caches.match('./')))
  );
});
