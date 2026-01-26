
const CACHE_NAME = 'anantsec-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/gallery.html',
  '/blog.html',
  '/resume.html',
  '/certificates.html',
  '/writeups.html',
  '/assets/css/style.css',
  '/assets/css/index.css',
  '/assets/css/about.css',
  '/assets/js/main.js',
  '/assets/js/index.js',
  '/404.html' // make sure this file exists so SW can return a fallback
];

// Install - cache same-origin assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(err => {
        console.error('SW install/caching failed:', err);
      })
  );
});

// Activate - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.map(name => cacheWhitelist.indexOf(name) === -1 ? caches.delete(name) : null)
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch - only intercept same-origin requests (do not fetch cross-origin CDNs)
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // If request is cross-origin, let the browser handle it (avoid CSP/connect-src issues)
  if (url.origin !== location.origin) {
    return; // do not call event.respondWith — browser will fetch normally
  }

  // For same-origin requests, respond from cache-first, then network (and cache response)
  event.respondWith(
    caches.match(req).then(cachedResp => {
      if (cachedResp) return cachedResp;

      return fetch(req)
        .then(networkResp => {
          // Only cache OK responses
          if (!networkResp || networkResp.status !== 200) {
            return networkResp;
          }
          const respToCache = networkResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, respToCache));
          return networkResp;
        })
        .catch(err => {
          // If fetch fails, return cached fallback or 404.html if present
          return caches.match(req) // attempt again
            .then(r => r || caches.match('/404.html') || new Response('Offline', { status: 503 }));
        });
    })
  );
});
