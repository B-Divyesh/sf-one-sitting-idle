const CACHE = 'last-light-v4';
const SHELL = ['/', '/demo/', '/privacy/', '/terms/', '/404.html', '/favicon.svg', '/apple-touch-icon.png', '/assets/the-last-light-social.jpg', '/assets/lighthouse-notebook-960.avif', '/assets/lighthouse-notebook-960.webp', '/assets/lighthouse-notebook.jpg'];

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
  const pathname = new URL(event.request.url).pathname;
  const isStaticAsset = pathname.startsWith('/assets/') || ['script', 'style', 'image', 'font'].includes(event.request.destination);
  event.respondWith((async () => {
    // Vite preview/SWA can add `Vary: Origin`; this worker itself fetched the
    // precache without that request header. It is still safe to ignore Vary
    // here because this cache contains only same-origin, public app assets.
    const cached = await caches.match(event.request, { ignoreSearch: isNavigation, ignoreVary: true });
    if (cached) {
      // A previous worker could have cached a static-host HTML fallback under
      // an asset URL. Do not let that poisoned entry survive an update.
      if (isStaticAsset && cached.headers.get('content-type')?.includes('text/html')) return offlineResponse();
      return cached;
    }
    try {
      const response = await fetch(event.request);
      // A static host's navigation fallback can return the app document with
      // a 200 for an unknown /assets/* URL. That is just as fatal as doing so
      // offline: an ES module receives HTML and fails its MIME check. Keep
      // document fallbacks exclusive to navigations, even while online.
      if (isStaticAsset && response.headers.get('content-type')?.includes('text/html')) return offlineResponse();
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
