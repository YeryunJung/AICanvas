/* eslint-disable */
// install event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('font-cache').then((cache) => {
      return cache.addAll([
        'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindExtraBold.woff',
        'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindRegular.woff',
        'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff',
      ]);
    }),
  );
});

// activate event
self.addEventListener('activate', (e) => {
  // console.log('[Service Worker] actived', e);
});

// fetch event
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    }),
  );
});

// update event
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
