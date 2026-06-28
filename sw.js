
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", event => {
  const url = event.request.url;

  // Interceptar peticiones a /nc-proxy?url=...
  if (url.includes('/nc-proxy?')) {
    const target = new URL(url).searchParams.get('url');
    if (target) {
      event.respondWith(
        fetch(target, {
          credentials: 'include',
          headers: {
            'User-Agent':      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36',
            'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer':         new URL(target).origin + '/',
          }
        }).then(async resp => {
          const body = await resp.arrayBuffer();
          return new Response(body, {
            status: resp.status,
            headers: {
              'Content-Type':                resp.headers.get('content-type') || 'text/html; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            }
          });
        }).catch(err => new Response('Error SW: ' + err.message, { status: 500 }))
      );
      return;
    }
  }

  // Todo lo demás — pasar directo sin caché
  event.respondWith(fetch(event.request));
});