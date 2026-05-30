const CACHE_NAME = 'expense-tracker-v1';
const urlsToCache = ['/', '/index.html', '/static/js/main.chunk.js'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
});