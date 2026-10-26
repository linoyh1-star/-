// Machmetzi service worker: makes the app installable and usable offline.
const CACHE = "machmetzi-v3";
const SHELL = ["./", "./index.html", "./manifest.webmanifest?v=2", "./icon-v2.svg", "./mascot.svg", "./icon-v2-180.png", "./icon-v2-192.png", "./icon-v2-512.png"];
const CDN = ["unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("machmetzi-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Versioned libraries and fonts: cache first.
  if (CDN.includes(url.hostname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    })));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // The page itself: network first, so updates arrive; cache when offline.
  if (req.mode === "navigate" || url.pathname.endsWith(".html")) {
    e.respondWith(fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html"))));
    return;
  }

  // Other local files: serve from cache, refresh in the background.
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
