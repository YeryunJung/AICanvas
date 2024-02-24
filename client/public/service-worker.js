/* eslint-disable */
const CACHE_NAME = 'ai-canvas-cache-v1';
const immutableRequests = [
  'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindExtraBold.woff',
  'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindRegular.woff',
  'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff',
];

// install event
self.addEventListener('install', (e) => {
  console.log('서비스워커 설치!');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const newImmutableRequests = [];
      return Promise.all(
        immutableRequests.map((url) => {
          return caches.match(url).then((response) => {
            if (response) {
              return cache.put(url, response);
            } else {
              newImmutableRequests.push(url);
              return Promise.resolve();
            }
          });
        }),
      ).then(() => {
        return cache.addAll(newImmutableRequests);
      });
    }),
  );
});

// activate event
self.addEventListener('activate', (e) => {
  console.log('[Service Worker] actived', e);
});

// fetch event
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        console.log('이미 캐싱된 리소스', response);
        return response;
      }
      return fetch(e.request);
    }),
  );
});

// update event
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
