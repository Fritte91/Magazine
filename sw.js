const CACHE_NAME = 'now-or-never-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/image/brandLogo.png',
  '/image/MagazineCover.jpg',
  '/image/Cover.webp',
  '/image/PHONOTYPE.webp',
  '/image/protest.webp',
  '/journal-article-waves.html',
  '/journal-article-legends.html',
  '/journal-article-understanding.html',
  '/stories.html',
  '/thank-you.html'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we have a cached version, return it but also fetch from network to update cache
        if (response) {
          // For HTML files, always try to fetch fresh content
          if (event.request.url.includes('.html') || event.request.url.includes('/')) {
            fetch(event.request).then(fetchResponse => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
            }).catch(() => {
              // If network fails, continue with cached version
            });
          }
          return response;
        }
        // If no cached version, fetch from network and cache it
        return fetch(event.request).then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
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
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 