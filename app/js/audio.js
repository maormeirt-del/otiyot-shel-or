/* ===========================================================
   Audio — הקראה (TTS חינמי מהדפדפן) + הקלטה עצמית (מקומי).
   אפס API. אפס טוקנים. speechSynthesis + MediaRecorder.
   הקלטות נשמרות ב-IndexedDB (מקומי במכשיר בלבד).
   =========================================================== */
window.Speech = (function () {
  let heVoice = null;
  function pickVoice() {
    const voices = speechSynthesis.getVoices() || [];
    heVoice = voices.find(v => /he|iw|hebrew/i.test(v.lang)) ||
              voices.find(v => /he|iw|hebrew/i.test(v.name)) || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  // הסרת ניקוד עוזרת למנועי TTS רבים לבטא נכון
  function strip(t) { return (t || "").replace(/[֑-ׇ]/g, ""); }

  function say(text, opts) {
    opts = opts || {};
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(opts.keepNikud ? text : strip(text));
    u.lang = "he-IL";
    if (heVoice) u.voice = heVoice;
    u.rate = opts.rate || 0.85;   // קצב איטי לילדים
    u.pitch = opts.pitch || 1.05;
    speechSynthesis.speak(u);
  }
  function stop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
  function available() { return 'speechSynthesis' in window; }
  return { say, stop, available };
})();

/* ---------- הקלטה עצמית מקומית ---------- */
window.Recorder = (function () {
  let mediaRec = null, chunks = [], stream = null;

  async function start() {
    if (!navigator.mediaDevices) throw new Error("no-mic");
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];
    mediaRec = new MediaRecorder(stream);
    mediaRec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    mediaRec.start();
  }
  function stop() {
    return new Promise(resolve => {
      if (!mediaRec) return resolve(null);
      mediaRec.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        if (stream) stream.getTracks().forEach(t => t.stop());
        resolve(blob);
      };
      mediaRec.stop();
    });
  }
  function supported() {
    return !!(navigator.mediaDevices && window.MediaRecorder);
  }
  return { start, stop, supported };
})();

/* ---------- אחסון הקלטות ב-IndexedDB (מקומי) ---------- */
window.RecStore = (function () {
  const DB = "aor_recordings", STORE = "recs";
  function open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function put(key, blob) {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(blob, key);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  }
  async function get(key) {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, "readonly");
      const rq = tx.objectStore(STORE).get(key);
      rq.onsuccess = () => res(rq.result || null);
      rq.onerror = () => rej(rq.error);
    });
  }
  return { put, get };
})();
