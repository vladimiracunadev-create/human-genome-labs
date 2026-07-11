const CACHE_NAME = "human-genome-labs-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./favicon.svg",
  "./assets/apps/web-lab/src/app.js",
  "./data/biology.json",
  "./data/modules.json",
  "./data/organism-profiles.json",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

// Stale-while-revalidate: sirve la caché al instante y revalida en segundo plano,
// para que un cambio de datos (p. ej. versiones del registro) llegue en la siguiente carga
// sin quedar congelado por la caché.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const network = fetch(event.request).then((response) => {
          if (response && response.ok) cache.put(event.request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
