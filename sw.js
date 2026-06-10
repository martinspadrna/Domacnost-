const CACHE_NAME = 'domacnost-plus-v0-1-182';
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
  './assets/module-icons/more.png',
  './assets/icon-themes/clay-3d/calendar.png',
  './assets/icon-themes/clay-3d/cameras.png',
  './assets/icon-themes/clay-3d/contracts.png',
  './assets/icon-themes/clay-3d/coupons.png',
  './assets/icon-themes/clay-3d/devices.png',
  './assets/icon-themes/clay-3d/finance.png',
  './assets/icon-themes/clay-3d/garage.png',
  './assets/icon-themes/clay-3d/hdo.png',
  './assets/icon-themes/clay-3d/home.png',
  './assets/icon-themes/clay-3d/homecare.png',
  './assets/icon-themes/clay-3d/more.png',
  './assets/icon-themes/clay-3d/notes.png',
  './assets/icon-themes/clay-3d/packages.png',
  './assets/icon-themes/clay-3d/polishHolidays.png',
  './assets/icon-themes/clay-3d/settings.png',
  './assets/icon-themes/clay-3d/shopping.png',
  './assets/icon-themes/clay-3d/subscriptions.png',
  './assets/icon-themes/clay-3d/tasks.png',
  './assets/icon-themes/clay-3d/warranties.png',
  './assets/icon-themes/clay-3d/waste.png',
  './assets/icon-themes/clay-3d/weather.png',
  './assets/icon-themes/duotone-fresh/calendar.png',
  './assets/icon-themes/duotone-fresh/cameras.png',
  './assets/icon-themes/duotone-fresh/contracts.png',
  './assets/icon-themes/duotone-fresh/coupons.png',
  './assets/icon-themes/duotone-fresh/devices.png',
  './assets/icon-themes/duotone-fresh/finance.png',
  './assets/icon-themes/duotone-fresh/garage.png',
  './assets/icon-themes/duotone-fresh/hdo.png',
  './assets/icon-themes/duotone-fresh/home.png',
  './assets/icon-themes/duotone-fresh/homecare.png',
  './assets/icon-themes/duotone-fresh/more.png',
  './assets/icon-themes/duotone-fresh/notes.png',
  './assets/icon-themes/duotone-fresh/packages.png',
  './assets/icon-themes/duotone-fresh/polishHolidays.png',
  './assets/icon-themes/duotone-fresh/settings.png',
  './assets/icon-themes/duotone-fresh/shopping.png',
  './assets/icon-themes/duotone-fresh/subscriptions.png',
  './assets/icon-themes/duotone-fresh/tasks.png',
  './assets/icon-themes/duotone-fresh/warranties.png',
  './assets/icon-themes/duotone-fresh/waste.png',
  './assets/icon-themes/duotone-fresh/weather.png',
  './assets/icon-themes/isometric-micro/calendar.png',
  './assets/icon-themes/isometric-micro/cameras.png',
  './assets/icon-themes/isometric-micro/contracts.png',
  './assets/icon-themes/isometric-micro/coupons.png',
  './assets/icon-themes/isometric-micro/devices.png',
  './assets/icon-themes/isometric-micro/finance.png',
  './assets/icon-themes/isometric-micro/garage.png',
  './assets/icon-themes/isometric-micro/hdo.png',
  './assets/icon-themes/isometric-micro/home.png',
  './assets/icon-themes/isometric-micro/homecare.png',
  './assets/icon-themes/isometric-micro/more.png',
  './assets/icon-themes/isometric-micro/notes.png',
  './assets/icon-themes/isometric-micro/packages.png',
  './assets/icon-themes/isometric-micro/polishHolidays.png',
  './assets/icon-themes/isometric-micro/settings.png',
  './assets/icon-themes/isometric-micro/shopping.png',
  './assets/icon-themes/isometric-micro/subscriptions.png',
  './assets/icon-themes/isometric-micro/tasks.png',
  './assets/icon-themes/isometric-micro/warranties.png',
  './assets/icon-themes/isometric-micro/waste.png',
  './assets/icon-themes/isometric-micro/weather.png',
  './assets/icon-themes/sticker-ui/calendar.png',
  './assets/icon-themes/sticker-ui/cameras.png',
  './assets/icon-themes/sticker-ui/contracts.png',
  './assets/icon-themes/sticker-ui/coupons.png',
  './assets/icon-themes/sticker-ui/devices.png',
  './assets/icon-themes/sticker-ui/finance.png',
  './assets/icon-themes/sticker-ui/garage.png',
  './assets/icon-themes/sticker-ui/hdo.png',
  './assets/icon-themes/sticker-ui/home.png',
  './assets/icon-themes/sticker-ui/homecare.png',
  './assets/icon-themes/sticker-ui/more.png',
  './assets/icon-themes/sticker-ui/notes.png',
  './assets/icon-themes/sticker-ui/packages.png',
  './assets/icon-themes/sticker-ui/polishHolidays.png',
  './assets/icon-themes/sticker-ui/settings.png',
  './assets/icon-themes/sticker-ui/shopping.png',
  './assets/icon-themes/sticker-ui/subscriptions.png',
  './assets/icon-themes/sticker-ui/tasks.png',
  './assets/icon-themes/sticker-ui/warranties.png',
  './assets/icon-themes/sticker-ui/waste.png',
  './assets/icon-themes/sticker-ui/weather.png',
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
