/*
* Script service worker paling basic
* referensi: https://googlechrome.github.io/samples/service-worker/basic/
*/

// Kalau ada update di service worker, ganti nama cache-nya
const PRECACHE = 'precache-v2.3';
const RUNTIME = 'runtime';

// List url yang mau di precache
const PRECACHE_URLS = [
  // HTML
  'index.html',
  './', // alias untuk index.html
  '404.html',
  '404/index.html',
  './404', // alias untuk 404.html
  'bookmark/index.html',
  './bookmark', // alias untuk bookmark.html
  'detail/index.html',
  './detail', // alias untuk detail.html
  // style
  'style.css',
  // js
  'js/utils.js',
  'js/api.js',
  'js/components/NavBar.jsx',
  'js/pages/BookmarkPage.jsx',
  'js/pages/DetailPage.jsx',
  'js/pages/HomePage.jsx',
  'js/app.jsx',
  // images
  'images/arrow-left.svg',
  'images/bookmark-blue.svg',
  'images/bookmark-white.svg',
  'images/bookmark.svg',
  'images/circle-loading-black.svg',
  'images/home-blue.svg',
  'images/home.svg',
  'images/logo192.png',
  'images/logo512.png',
  'images/refresh.svg',
];

const PRECACHE_EXTERNAL_URLS = [
  'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css',
  'https://unpkg.com/react@17/umd/react.production.min.js',
  'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/axios/dist/axios.min.js',
];

// Di trigger waktu PWA pertama kali diinstal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => {
        const urls = [...PRECACHE_URLS, ...PRECACHE_EXTERNAL_URLS]
        cache.addAll(urls)
      })
      .then(self.skipWaiting())
  );
});

// Handler activate untuk cleanup caches
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            // Return true kalau cache-nya mau dihapus
            return !currentCaches.includes(cacheName);
          })
          .map(cacheName => {
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch di intercept biar bisa ngambil dari cache dulu
self.addEventListener('fetch', event => {
  // Strategy: cache first
  // Skip request selain dari origin dan unpkg.com
  if (
    event.request.url.startsWith(self.location.origin) ||
    event.request.url.startsWith('https://unpkg.com')
  ) {
    event.respondWith(
      caches.match(event.request, {ignoreSearch: true}).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse
        }
        return putToRuntimeCache(event.request);
      })
    );
  }

  // Strategy: stale while revalidate
  // Cuma buat api di homepage aja + image poster
  else if (
    event.request.url.startsWith('https://api.jikan.moe/v3/top/anime') ||
    event.request.url.startsWith('https://cdn.myanimelist.net/images/anime')
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const request = putToRuntimeCache(event.request);
        return cachedResponse || request;
      })
    )
  }

  // Strategy: network first with fallback to cache
  // Cuma buat api di detail page aja (yang sudah ditambah ke bookmark)
  else if (
    event.request.url.startsWith('https://api.jikan.moe/v3/anime')
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return putToRuntimeCache(event.request).catch(() => cachedResponse);
        }
        return fetch(event.request)
      })
    )
  }
});

function putToRuntimeCache(request) {
  return caches.open(RUNTIME).then(cache => {
    return fetch(request).then(response => {
      return cache.put(request, response.clone()).then(() => response);
    });
  })
}

// Coba bikin gimana caranya bikin fallback offline untuk 404.html :D
