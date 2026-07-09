// Vitality Thrive service worker. Minimal + health-safe: network-first so patients always see
// fresh data, cache is only the static app shell for offline/installability. NEVER caches POSTs
// or Convex API calls (no stale PHI, no cached auth/payment mutations).
const CACHE = 'vitality-thrive-v1';
const SHELL = [
  '/portal.html', '/portal-login.html', '/handbook-render.js',
  '/assets/logo-icon.png', '/assets/icon-192.png', '/assets/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                    // never touch auth/pay/data mutations
  const url = new URL(req.url);
  if (url.hostname.includes('convex')) return;         // never cache API / PHI data calls
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy).catch(() => {}));
        return res;
      })
      .catch(() => caches.match(req))                  // offline -> serve the cached shell
  );
});
