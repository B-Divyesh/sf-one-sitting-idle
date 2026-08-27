const CACHE = 'last-light-v2';
const SHELL = ['/', '/privacy/', '/terms/', '/favicon.svg', '/assets/lighthouse-notebook-960.avif', '/assets/lighthouse-notebook-960.webp', '/assets/lighthouse-notebook.jpg'];

async function precacheShell() {
  const cache = await caches.open(CACHE);
  // The built JS/CSS filenames are content-hashed by Vite. Read the installed
  // document once so this hand-written worker precaches exactly those assets.
  const documentResponse = await fetch('/', { cache: 'reload' });
  if (!documentResponse.ok) throw new Error('Could not precache the app shell');
  const documentText = await documentResponse.clone().text();
  await Promise.all([
    cache.put('/', documentResponse.clone()),
    cache.put('/index.html', documentResponse.clone())
  ]);
  const assets = [...documentText.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => new URL(match[1], self.location.origin))
    .filter((url) => url.origin === self.location.origin)
    .map((url) => url.pathname + url.search);
  const urls = [...new Set([...SHELL, ...assets])];
  await Promise.all(urls.filter((url) => url !== '/').map(async (url) => {
    const response = await fetch(url, { cache: 'reload' });
    if (response.ok) await cache.put(url, response);
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheShell());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  const isNavigation = event.request.mode === 'navigate';
  event.respondWith((async () => {
    // Vite preview/SWA can add `Vary: Origin`; this worker itself fetched the
    // precache without that request header. It is still safe to ignore Vary
    // here because this cache contains only same-origin, public app assets.
    const cached = await caches.match(event.request, { ignoreSearch: isNavigation, ignoreVary: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) void caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
      return response;
    } catch {
      // Only documents may use the HTML app shell. Returning it for a module
      // request produces a MIME error and prevents a later offline reload.
      if (isNavigation) return (await caches.match('/', { ignoreSearch: true })) ?? offlineResponse();
      return offlineResponse();
    }
  })());
});

function offlineResponse() {
  return new Response('Offline resource unavailable.', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
