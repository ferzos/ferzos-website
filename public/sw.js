const CACHE_NAME = "ferzos-pwa-v1";
const OFFLINE_URL = "/offline.html";
const START_URL = "/optimal-stopping";

async function cacheResponse(request, response) {
  if (response.ok) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    } catch (error) {
      console.warn("Failed to cache response:", error);
    }
  }
  return response;
}

async function matchCached(request) {
  try {
    return await caches.match(request);
  } catch (error) {
    console.warn("Failed to read cached response:", error);
    return undefined;
  }
}

async function precacheStartRoute() {
  try {
    const response = await fetch(START_URL);
    if (!response.ok) return;

    const html = await response.clone().text();
    await cacheResponse(START_URL, response);

    const assets = [...new Set(html.match(/\/_next\/static\/[^"'\s<>\\]+/g) || [])];
    await Promise.allSettled(
      assets.map((asset) => fetch(asset).then((assetResponse) => cacheResponse(asset, assetResponse))),
    );
  } catch (error) {
    console.warn("Failed to precache the start route:", error);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(precacheStartRoute)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("ferzos-pwa-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(async () => (await matchCached(request)) || (await matchCached(OFFLINE_URL))),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      matchCached(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => cacheResponse(request, response)),
      ),
    );
  }
});