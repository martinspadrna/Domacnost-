const CACHE_NAME = 'domacnost-plus-v0-1-41';
const APP_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './favicon.ico',
  './favicon-16.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  './apple-touch-icon-precomposed.png',
  './assets/domacnost-plus-icon-16-v0-1-41.png',
  './assets/domacnost-plus-icon-32-v0-1-41.png',
  './assets/domacnost-plus-icon-120-v0-1-41.png',
  './assets/domacnost-plus-icon-152-v0-1-41.png',
  './assets/domacnost-plus-icon-167-v0-1-41.png',
  './assets/domacnost-plus-icon-180-v0-1-41.png',
  './assets/domacnost-plus-icon-192-v0-1-41.png',
  './assets/domacnost-plus-icon-384-v0-1-41.png',
  './assets/domacnost-plus-icon-512-v0-1-41.png',
  './assets/domacnost-plus-icon-1024-v0-1-41.png',
  './assets/domacnost-plus-maskable-192-v0-1-41.png',
  './assets/domacnost-plus-maskable-512-v0-1-41.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin) return;

  const isManifest = requestUrl.pathname.endsWith('/manifest.webmanifest');
  const isInstallIcon = /apple-touch-icon|favicon|domacnost-plus-icon|maskable-icon|icon-/.test(requestUrl.pathname);

  if (isManifest || isInstallIcon) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  const isNavigation = event.request.mode === 'navigate' || requestUrl.pathname.endsWith('/');
  const isCoreAppFile = /\/(index\.html|app\.js|styles\.css|sw\.js)$/.test(requestUrl.pathname);

  if (isNavigation || isCoreAppFile) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match('./index.html')))
  );
});
