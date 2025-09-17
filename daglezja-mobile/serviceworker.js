const CACHE_NAME = "sw-cache-daglezja-mobile-v7";
const PATHS_TO_CACHE = [

  "/",
  "index.html",
  "/index.html",

  "app-daglezja-mobile-v1/app/index.html",
  "/app-daglezja-mobile-v1/app/index.html",

  "serviceworker.js",

  "runtime.js",
  "polyfills.js",
  "main.js",

  "styles.css",
  "manifest.json",
  "favicon.ico",

  "material-symbols-outlined-font.woff2",

  "assets/qr.png",
  "assets/confetti.js",

  "assets/icons/icon-48x48.png",
  "assets/icons/icon-72x72.png",
  "assets/icons/icon-96x96.png",
  "assets/icons/icon-128x128.png",
  "assets/icons/icon-144x144.png",
  "assets/icons/icon-152x152.png",
  "assets/icons/icon-192x192.png",
  "assets/icons/icon-384x384.png",
  "assets/icons/icon-512x512.png"
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
