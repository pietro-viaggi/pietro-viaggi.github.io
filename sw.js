/* Service worker di "I miei viaggi" — generato in fase di build (vedi vite.config.ts).
 * - Precache della "shell" dell'app (HTML, JS, CSS, font, icone): l'app si apre anche offline.
 * - Navigazioni: prima la rete (così una nuova versione arriva subito), poi la cache se offline.
 * - /assets/* con hash nel nome: cache-first (immutabili).
 * - Mappe, tile, routing e geocoding (domini esterni) passano sempre dalla rete.
 * - Aggiornamento: ogni build cambia VERSION → il browser installa il nuovo SW, che si attiva subito
 *   (skipWaiting + clients.claim) e cancella le cache vecchie; la pagina mostra "Nuova versione disponibile".
 */
const VERSION = '01ff1d0e6835';
const CACHE = 'viaggi-' + VERSION;
const PRECACHE = [
 "./",
 "./index.html",
 "./assets/index-Cdy0uCC5.js",
 "./assets/array-utils-flat-BL8Cekj1.js",
 "./assets/get-attribute-from-layouts-Dd2gixpo.js",
 "./assets/gpu-data-evaluator-DlNjxs5v.js",
 "./assets/player-CsNLNJ7o.js",
 "./assets/rolldown-runtime-BWaJ3C7D.js",
 "./assets/sampleRoutes-Dd_EwmAv.js",
 "./assets/searoute-js-CxZB2jMd.js",
 "./assets/webgl-CVCgKz39.js",
 "./assets/webgl-device-BBzpoNpq.js",
 "./assets/webgpu-Crp-sJuI.js",
 "./assets/world-110m-CWAz-g9T.js",
 "./assets/index-DvWTXGVx.css",
 "./assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2",
 "./assets/inter-cyrillic-wght-normal-DqGufNeO.woff2",
 "./assets/inter-greek-ext-wght-normal-DlzME5K_.woff2",
 "./assets/inter-greek-wght-normal-CkhJZR-_.woff2",
 "./assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2",
 "./assets/inter-latin-wght-normal-Dx4kXJAl.woff2",
 "./assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2",
 "./manifest.webmanifest",
 "./icons/apple-touch-icon.png",
 "./icons/favicon-32.png",
 "./icons/favicon-64.png",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./icons/icon-maskable-512.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('viaggi-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // risorse esterne: solo rete
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const c = await caches.open(CACHE); c.put('./index.html', res.clone());
        return res;
      } catch {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && url.pathname.includes('/assets/')) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
    return res;
  })());
});
