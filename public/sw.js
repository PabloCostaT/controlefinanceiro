// public/sw.js – Service Worker do Controle Financeiro PWA
const STATIC_CACHE = "static-v1"
const DYNAMIC_CACHE = "dynamic-v1"

const STATIC_ASSETS = [
  "/", // HTML inicial
  "/manifest.json",
  "/offline.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

// ---------- INSTALL ----------
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

// ---------- ACTIVATE ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE).map((k) => caches.delete(k))),
      ),
  )
  self.clients.claim()
})

// ---------- FETCH ----------
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Cache-first para arquivos estáticos
  if (STATIC_ASSETS.some((path) => url.pathname === path)) {
    event.respondWith(caches.match(request).then((resp) => resp || fetch(request)))
    return
  }

  // Network-first para API (exemplo)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const clone = resp.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone))
          return resp
        })
        .catch(() => caches.match(request)),
    )
    return
  }

  // Stale-while-revalidate para outras páginas
  event.respondWith(
    caches.match(request).then((cachedResp) => {
      const fetchPromise = fetch(request)
        .then((networkResp) => {
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, networkResp.clone()))
          return networkResp
        })
        .catch(() => caches.match("/offline.html"))
      return cachedResp || fetchPromise
    }),
  )
})
