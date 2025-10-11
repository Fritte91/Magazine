const CACHE_NAME = 'now-or-never-v2.1';
const STATIC_CACHE = 'static-v2.1';
const DYNAMIC_CACHE = 'dynamic-v2.1';

// Only cache static assets, not HTML files
const urlsToCache = [
  '/styles.css',
  '/script.js',
  '/image/brandLogo.png',
  '/image/MagazineCover.jpg',
  '/image/Cover.webp',
  '/image/PHONOTYPE.webp',
  '/image/protest.webp'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Opened static cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // For HTML files, always fetch fresh from network (no caching)
  if (request.destination === 'document' || 
      url.pathname === '/' || 
      url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Don't cache HTML files to ensure fresh content
          return response;
        })
        .catch(() => {
          // Fallback to cache only if network fails completely
          return caches.match(request);
        })
    );
    return;
  }
  
  // For static assets (CSS, JS, images), use cache-first strategy
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        
        // If not in cache, fetch from network and cache it
        return fetch(request).then(fetchResponse => {
          // Don't cache if not successful
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          
          // Clone the response
          const responseToCache = fetchResponse.clone();
          
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, responseToCache);
          });
          
          return fetchResponse;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});