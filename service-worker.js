const CACHE_NAME = 'expense-tracker-v1';
const isExpenseTracker = self.location.pathname.includes('/expense-tracker');
const basePath = isExpenseTracker ? '/expense-tracker' : '';

const urlsToCache = [
    `${basePath}/`,
    `${basePath}/index.html`,
    `${basePath}/static/js/main.chunk.js`
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => 
            cache.addAll(['/expense-tracker/', '/expense-tracker/index.html'])
        )
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});