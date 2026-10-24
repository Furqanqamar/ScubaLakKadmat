// Cache only fingerprinted original images requested by a visitor. No prefetching,
// HTML caching or video interception; native video range requests stay intact.
const CACHE_NAME = 'scuba-lak-original-images-v1';
const MAX_IMAGES = 100;
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || request.headers.has('range') || !/\/media\/originals\/[\w-]+-[a-f0-9]{12}\.webp$/.test(url.pathname)) return;
  event.respondWith((async () => {
    let cache;
    try {
      cache = await caches.open(CACHE_NAME);
      const existing = await cache.match(request);
      if (existing) return existing;
    } catch { /* Storage restrictions must not block the image request. */ }
    const response = await fetch(request);
    if (cache && response.ok && response.type === 'basic') {
      const copy = response.clone();
      event.waitUntil((async () => {
        await cache.put(request, copy);
        const keys = await cache.keys();
        await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_IMAGES)).map(key => cache.delete(key)));
      })().catch(() => undefined));
    }
    return response;
  })());
});
