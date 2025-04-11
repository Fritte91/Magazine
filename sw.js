const CACHE_NAME = 'now-or-never-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/image/brandLogo.png',
  // Add other important assets
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
}); 