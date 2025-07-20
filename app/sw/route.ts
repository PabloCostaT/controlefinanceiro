import { NextResponse } from "next/server"

export async function GET() {
  const swContent = `
// Service Worker para Controle Financeiro PWA
const CACHE_NAME = 'finance-app-v1.0.0'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'
const IMAGE_CACHE = 'images-v1'

// Recursos críticos para cache
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Recursos estáticos para cache
const STATIC_RESOURCES = [
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/_next/static/media/'
]

// Install - Cache recursos críticos
self.addEventListener('install', (event) => {
  console.log('SW: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching critical resources')
        return cache.addAll(CRITICAL_RESOURCES)
      })
      .catch(error => {
        console.error('SW: Install failed', error)
      })
  )
  
  self.skipWaiting()
})

// Activate - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('SW: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  self.clients.claim()
})

// Fetch - Estratégias de cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return
  
  // Cache First para recursos estáticos
  if (STATIC_RESOURCES.some(resource => url.pathname.includes(resource))) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchResponse => {
          const responseClone = fetchResponse.clone()
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, responseClone)
          })
          return fetchResponse
        })
      })
    )
    return
  }
  
  // Cache First para imagens
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchResponse => {
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone()
            caches.open(IMAGE_CACHE).then(cache => {
              cache.put(request, responseClone)
            })
          }
          return fetchResponse
        }).catch(() => {
          // Fallback para imagem offline
          return caches.match('/icons/icon-192x192.png')
        })
      })
    )
    return
  }
  
  // Network First para API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone)
          })
        }
        return response
      }).catch(() => {
        return caches.match(request)
      })
    )
    return
  }
  
  // Stale While Revalidate para páginas
  if (request.destination === 'document') {
    event.respondWith(
      caches.match(request).then(response => {
        const fetchPromise = fetch(request).then(networkResponse => {
          if (networkResponse.ok) {
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, networkResponse.clone())
            })
          }
          return networkResponse
        }).catch(() => {
          return caches.match('/offline.html')
        })
        
        return response || fetchPromise
      })
    )
    return
  }
  
  // Default: Network First
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Push Notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/icon-192x192.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Controle Financeiro', options)
  )
})

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync function
async function doBackgroundSync() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    // Implementar lógica de sincronização
    console.log('SW: Background sync completed')
  } catch (error) {
    console.error('SW: Background sync failed', error)
  }
}

// Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})
`

  return new NextResponse(swContent, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  })
}
