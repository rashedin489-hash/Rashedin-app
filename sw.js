const CACHE = 'rashedin-v22';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./profile.jpg','./splash.jpg','./robots.txt','./sitemap.xml','./googlee7769a6bf6c7de6d.html'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Live, shared data (rotating codes, top students) must always hit the
  // network fresh — never served from the cache, or it would freeze forever.
  if (e.request.url.indexOf('firebaseio.com') !== -1) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => new Response(null, { status: 503 })));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match('./index.html'))));
});
