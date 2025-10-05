// ERTUNO PWA Service Worker
const CACHE_NAME = 'ertuno-pwa-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/site.webmanifest',
  '/favicon.svg',
  // Add other critical assets here
];

// Install event
self.addEventListener('install', (event) => {
  console.log('ERTUNO SW: Installing...');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        await cache.addAll(STATIC_FILES);
        console.log('ERTUNO SW: Static files cached');
      } catch (error) {
        console.error('ERTUNO SW: Failed to cache static files:', error);
      }
    })()
  );
  
  // Force the waiting service worker to become the active one
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('ERTUNO SW: Activating...');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
      
      // Take control of all clients immediately
      await self.clients.claim();
    })()
  );
});

// Fetch event - Network first with cache fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try network first
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        console.log('ERTUNO SW: Network failed, trying cache...', event.request.url);
        
        // Try cache fallback
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // For navigation requests, return offline page
        if (event.request.mode === 'navigate') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }
        
        // Return error for other requests
        throw error;
      }
    })()
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline actions (optional)
self.addEventListener('sync', (event) => {
  console.log('ERTUNO SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Add background sync logic here
      Promise.resolve()
    );
  }
});

// Push notifications (optional)
self.addEventListener('push', (event) => {
  console.log('ERTUNO SW: Push event received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New message from ERTUNO',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/favicon.svg'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ERTUNO', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('ERTUNO SW: Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});