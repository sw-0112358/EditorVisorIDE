
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", event => {
  const url = event.request.url;

  if (url.includes('/nc-proxy?')) {
    const target = new URL(url).searchParams.get('url');
    if (target) {
      event.respondWith(
        fetch(target, {
          credentials: 'include',
          headers: {
            'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
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
        }).catch(err => new Response('Error SW: ' + err.message + ' | target: ' + target, { status: 500 }))
      );
      return;
    }
  }

  event.respondWith(fetch(event.request));
});