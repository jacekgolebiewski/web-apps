const CACHE_NAME = "sw-cache-daglezja-mobile-v8";
const PATHS_TO_CACHE = [

  "/web-apps/daglezja-mobile/",
  "/web-apps/daglezja-mobile/index.html",

  "/web-apps/daglezja-mobile/serviceworker.js",

  "/web-apps/daglezja-mobile/runtime.js",
  "/web-apps/daglezja-mobile/polyfills.js",
  "/web-apps/daglezja-mobile/main.js",

  "/web-apps/daglezja-mobile/styles.css",
  "/web-apps/daglezja-mobile/manifest.json",
  "/web-apps/daglezja-mobile/favicon.ico",

  "/web-apps/daglezja-mobile/material-symbols-outlined-font.woff2",

  "/web-apps/daglezja-mobile/assets/qr.png",
  "/web-apps/daglezja-mobile/assets/confetti.js",

  "/web-apps/daglezja-mobile/assets/icons/icon-48x48.png",
  "/web-apps/daglezja-mobile/assets/icons/icon-72x72.png",
  "/web-apps/daglezja-mobile/assets/icons/icon-96x96.png",
  "/web-apps/daglezja-mobile/assets/icons/icon-128x128.png",
  "/web-apps/daglezja-mobile/assets/icons/icon-144x144.png",
  "/web-apps/daglezja-mobile/assets/icons/icon-152x152.png",
  "/web-apps/daglezja-mobile/assets/icons/icon-192x192.png",
  "/web-apps/daglezja-mobile/assets/icons/icon-384x384.png",
  "/web-apps/daglezja-mobile/assets/icons/icon-512x512.png"
];


self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        let addResult;
        try {
          addResult = await cache.addAll(PATHS_TO_CACHE);
        } catch (err) {
          console.error('sw: cache.addAll');
          for (let pathToCache of PATHS_TO_CACHE) {
            try {
              addResult = await cache.add(pathToCache);
            } catch (err) {
              console.warn('sw: cache.add fail details', pathToCache);
              console.warn(err);
            }
          }
        }

        return addResult;
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }));
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  // zrobienie match na event.request.url nie działało na urządzeniu zebra
  console.log(event.request);
  event.respondWith(
    caches.match(event.request, {ignoreVary: true, ignoreSearch: true})
      .then(function (response) {
        if (response) {
          console.log('Getting from cache')
          console.log(response)
          return response;
        } else {
          console.log('Fetching')
          console.log('Fetching')
          return fetch(event.request)
        }
      })
  );
});
