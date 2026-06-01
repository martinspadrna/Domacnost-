const CACHE_NAME = 'domacnost-plus-v0-1-57';
const APP_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './sw.js',
  './manifest.webmanifest',
  './favicon.ico',
  './favicon-16.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  './apple-touch-icon-precomposed.png',
  './assets/domacnost-plus-icon-16-v0-1-57.png',
  './assets/domacnost-plus-icon-32-v0-1-57.png',
  './assets/domacnost-plus-icon-120-v0-1-57.png',
  './assets/domacnost-plus-icon-152-v0-1-57.png',
  './assets/domacnost-plus-icon-167-v0-1-57.png',
  './assets/domacnost-plus-icon-180-v0-1-57.png',
  './assets/domacnost-plus-icon-192-v0-1-57.png',
  './assets/domacnost-plus-icon-384-v0-1-57.png',
  './assets/domacnost-plus-icon-512-v0-1-57.png',
  './assets/domacnost-plus-icon-1024-v0-1-57.png',
  './assets/domacnost-plus-maskable-192-v0-1-57.png',
  './assets/domacnost-plus-maskable-512-v0-1-57.png'
];

const CORE_FALLBACKS = {
  '/index.html': './index.html',
  '/app.js': './app.js',
  '/styles.css': './styles.css',
  '/sw.js': './sw.js'
};

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

function cacheNetworkResponse(request, response) {
  const clone = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
  return response;
}

function matchCached(request, fallbackKey) {
  return caches.match(request, { ignoreSearch: true }).then((cached) => cached || (fallbackKey ? caches.match(fallbackKey) : null));
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin) return;

  const isManifest = requestUrl.pathname.endsWith('/manifest.webmanifest');
  const isInstallIcon = /apple-touch-icon|favicon|domacnost-plus-icon|maskable-icon|icon-/.test(requestUrl.pathname);

  if (isManifest || isInstallIcon) {
    event.respondWith(
      fetch(event.request)
        .then((response) => cacheNetworkResponse(event.request, response))
        .catch(() => matchCached(event.request, null))
    );
    return;
  }

  const isNavigation = event.request.mode === 'navigate' || requestUrl.pathname.endsWith('/');
  const isCoreAppFile = /\/(index\.html|app\.js|styles\.css|sw\.js)$/.test(requestUrl.pathname);

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => cacheNetworkResponse(event.request, response))
        .catch(() => matchCached(event.request, './index.html').then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  if (isCoreAppFile) {
    const fallbackKey = CORE_FALLBACKS[requestUrl.pathname] || `.${requestUrl.pathname}`;
    event.respondWith(
      fetch(event.request)
        .then((response) => cacheNetworkResponse(event.request, response))
        .catch(() => matchCached(event.request, fallbackKey))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || fetch(event.request).catch(() => null))
  );
});
