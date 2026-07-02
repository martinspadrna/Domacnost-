const CACHE_PREFIX = 'domacnost-plus-';
const CACHE_NAME = `${CACHE_PREFIX}v0-1-346`;
const APP_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './icon-assets.css',
  './shopping.css',
  './utils.js',
  './shopping-utils.js',
  './shopping-render.js',
  './shopping-actions.js',
  './weather.js',
  './notes.js',
  './warranty.js',
  './hdo.js',
  './waste.js',
  './finance.js',
  './pool.js',
  './contracts.js',
  './subscriptions.js',
  './calendar.js',
  './pwa.js',
  './app.js',
  './sw.js',
  './manifest.webmanifest',
  './icons/favicon.ico',
  './icons/apple-touch-icon.png',
  './icons/apple-touch-icon-precomposed.png',
  './icons/domacnost-plus-icon-16.png',
  './icons/domacnost-plus-icon-32.png',
  './icons/domacnost-plus-icon-120.png',
  './icons/domacnost-plus-icon-152.png',
  './icons/domacnost-plus-icon-167.png',
  './icons/domacnost-plus-icon-180.png',
  './icons/domacnost-plus-icon-192.png',
  './icons/domacnost-plus-icon-384.png',
  './icons/domacnost-plus-icon-512.png',
  './icons/domacnost-plus-maskable-192.png',
  './icons/domacnost-plus-maskable-512.png'
];

const CORE_FALLBACKS = {
  '/index.html': './index.html',
  '/app.js': './app.js',
  '/styles.css': './styles.css',
  '/sw.js': './sw.js',
  '/icon-assets.css': './icon-assets.css',
  '/shopping.css': './shopping.css',
  '/utils.js': './utils.js',
  '/shopping-utils.js': './shopping-utils.js',
  '/shopping-render.js': './shopping-render.js',
  '/shopping-actions.js': './shopping-actions.js'
};

const RUNTIME_CACHE_PATHS = [
  '/icons/icon-themes/',
  '/icons/module-icons/'
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
  // Prefix filter — smažeme jen NAŠE zastaralé cache klíče. Cizí cache
  // z jiných PWA na stejném originu (např. jiná appka nasazená na
  // stejném Vercel účtu / testovací příklady) musí zůstat nedotčené.
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function cacheNetworkResponse(request, response) {
  if (!response || response.status >= 400) return response;
  const clone = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
  return response;
}

function matchCached(request, fallbackKey) {
  return caches.match(request, { ignoreSearch: true }).then((cached) => cached || (fallbackKey ? caches.match(fallbackKey) : null));
}

function isRuntimeStaticAsset(pathname) {
  return RUNTIME_CACHE_PATHS.some((prefix) => pathname.includes(prefix));
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin) return;

  const isManifest = requestUrl.pathname.endsWith('/manifest.webmanifest');
  const isInstallIcon = requestUrl.pathname.includes('/icons/') && /apple-touch-icon|favicon|domacnost-plus-icon|maskable/.test(requestUrl.pathname);

  if (isManifest || isInstallIcon) {
    event.respondWith(
      fetch(event.request)
        .then((response) => cacheNetworkResponse(event.request, response))
        .catch(() => matchCached(event.request, null))
    );
    return;
  }

  const isNavigation = event.request.mode === 'navigate' || requestUrl.pathname.endsWith('/');
  const isCoreAppFile = /\/(index\.html|app\.js|styles\.css|icon-assets\.css|shopping\.css|shopping-utils\.js|shopping-render\.js|shopping-actions\.js|sw\.js)$/.test(requestUrl.pathname);

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

  if (isRuntimeStaticAsset(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => cacheNetworkResponse(event.request, response));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || fetch(event.request))
  );
});
