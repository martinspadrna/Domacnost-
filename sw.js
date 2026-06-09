const CACHE_NAME = 'domacnost-plus-v0-1-148';
const APP_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './sw.js',
  './manifest.webmanifest',
  './assets/icons/favicon.ico',
  './assets/icons/favicon-16.png',
  './assets/icons/favicon-32.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/apple-touch-icon-precomposed.png',
  './assets/icons/domacnost-plus-icon-16.png',
  './assets/icons/domacnost-plus-icon-32.png',
  './assets/icons/domacnost-plus-icon-120.png',
  './assets/icons/domacnost-plus-icon-152.png',
  './assets/icons/domacnost-plus-icon-167.png',
  './assets/icons/domacnost-plus-icon-180.png',
  './assets/icons/domacnost-plus-icon-192.png',
  './assets/icons/domacnost-plus-icon-384.png',
  './assets/icons/domacnost-plus-icon-512.png',
  './assets/icons/domacnost-plus-icon-1024.png',
  './assets/icons/domacnost-plus-maskable-192.png',
  './assets/icons/domacnost-plus-maskable-512.png',
  './assets/module-icons/calendar.png',
  './assets/module-icons/packages.png',
  './assets/module-icons/shopping.png',
  './assets/module-icons/coupons.png',
  './assets/module-icons/hdo.png',
  './assets/module-icons/waste.png',
  './assets/module-icons/tasks.png',
  './assets/module-icons/notes.png',
  './assets/module-icons/devices.png',
  './assets/module-icons/warranties.png',
  './assets/module-icons/polishHolidays.png',
  './assets/module-icons/garage.png',
  './assets/module-icons/contracts.png',
  './assets/module-icons/finance.png',
  './assets/module-icons/subscriptions.png',
  './assets/module-icons/cameras.png',
  './assets/module-icons/settings.png',
  './assets/module-icons/homecare.png',
  './assets/module-icons/home.png',
  './assets/module-icons/weather.png',
  './assets/module-icons/more.png'
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
