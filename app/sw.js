/* Service Worker — network-first כדי שעדכונים תמיד יגיעו, עם fallback אופליין.
   אפס תלות חיצונית. */
const CACHE = "aor-v13";
const ASSETS = [
  "./", "./index.html",
  "./css/style.css", "./fonts/fonts.css",
  "./fonts/secular-one-400.woff2", "./fonts/rubik-500.woff2", "./fonts/rubik-700.woff2",
  "./fonts/rubik-900.woff2", "./fonts/heebo-400.woff2", "./fonts/heebo-500.woff2",
  "./fonts/heebo-700.woff2", "./fonts/heebo-800.woff2", "./fonts/frank-ruhl-libre-400.woff2",
  "./fonts/frank-ruhl-libre-700.woff2", "./fonts/frank-ruhl-libre-900.woff2",
  "./fonts/david-libre-400.woff2", "./fonts/david-libre-700.woff2", "./fonts/suez-one-400.woff2",
  "./manifest.json", "./assets/icon.svg",
  "./data/letters.js", "./data/words.js", "./data/stories.js", "./data/stories-extra.js",
  "./data/stories-extra2.js", "./data/stories-extra3.js", "./data/stories-long.js",
  "./data/stories-long2.js", "./data/shop.js",
  "./data/parsha.js", "./data/fluency.js", "./data/coloring.js", "./data/grades.js", "./data/curriculum.js",
  "./js/state.js", "./js/audio.js", "./js/ui.js", "./js/activities.js", "./js/app.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* network-first: תמיד מנסה רשת (גרסה טרייה), נופל למטמון רק כשאין אינטרנט */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
  );
});
