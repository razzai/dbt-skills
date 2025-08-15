const CACHE_NAME = 'dbt-companion-cache-v1';
const CACHE_ASSETS = [
  './', // Caches the main HTML file
  'manifest.json' // Caches the app manifest
];

// Call Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(CACHE_ASSETS);
      })
      .catch(err => console.log('Service Worker: Cache open failed', err))
  );
});

// Call Activate Event
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');
  // Remove old caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => {
        if (response) {
          return response; // Found in cache
        }
        return fetch(e.request); // Not found, fetch from network
      })
      .catch(() => {
        // This is a fallback for offline use, though not needed for this app.
      })
  );
});
