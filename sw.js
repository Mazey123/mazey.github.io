/* Минимальный Service Worker учебного сайта «PWA.Учебник».
   Кэширует статический app shell (CSS/JS/иконки) и HTML-страницы
   по мере их посещения, чтобы сайт оставался доступен офлайн. */

const CACHE_NAME = 'pwa-uchebnik-v1';
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/script.js',
  './images/logo.svg',
  './images/favicon.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
