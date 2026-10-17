/* ===========================================================
   Audio — הקראה (TTS חינמי מהדפדפן) + הקלטה עצמית (מקומי).
   אפס API. אפס טוקנים. speechSynthesis + MediaRecorder.
   הקלטות נשמרות ב-IndexedDB (מקומי במכשיר בלבד).
   =========================================================== */
window.Speech = (function () {
  const has = 'speechSynthesis' in window;
  let heVoice = null;
  function pickVoice() {
    const voices = speechSynthesis.getVoices() || [];
    // רק קול עברי אמיתי. קול זר (למשל Shelley) שותק על טקסט עברי.
    heVoice = voices.find(v => /^(he|iw)([-_]|$)/i.test(v.lang)) ||
              voices.find(v => /hebrew|עברית|carmit|כרמית/i.test(v.name)) || null;
  }
  if (has) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  // הסרת ניקוד עוזרת למנועי TTS רבים לבטא נכון
  function strip(t) { return (t || "").replace(/[֑-ׇ]/g, ""); }

  /* שחרור הקול בנגיעה הראשונה: אייפון לא משמיע הקראה עד שהיא התחילה מתוך נגיעה,
     ובלי audioSession=playback מתג השקט משתיק את הצלילים. */
  let unlocked = false;
  function unlock() {
    if (unlocked) return; unlocked = true;
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    if (window.UI && UI.wakeAudio) UI.wakeAudio();
    if (has && !speechSynthesis.speaking && !speechSynthesis.pending) {
      try { const w = new SpeechSynthesisUtterance(" "); w.volume = 0; speechSynthesis.speak(w); } catch (e) {}
    }
    ["pointerdown", "touchend", "keydown"].forEach(ev => document.removeEventListener(ev, unlock, true));
  }
  ["pointerdown", "touchend", "keydown"].forEach(ev => document.addEventListener(ev, unlock, true));

  /* השמעה בטוחה: בספארי speak מיד אחרי cancel נבלע, וכרום באנדרואיד נתקע לפעמים.
     current מחזיק את ההקראה כדי שלא תיאסף לפני onend. */
  let current = null, gen = 0;
  function play(u) {
    const my = ++gen;
    current = u;
    let started = false;
    const prevStart = u.onstart;
    u.onstart = e => { started = true; prevStart && prevStart(e); };
    const go = () => {
      if (my !== gen) return;
      if (speechSynthesis.paused) speechSynthesis.resume();
      speechSynthesis.speak(u);
      // שומר: אם לא התחיל תוך 1.5 שנ׳ (המנוע נתקע), מאפסים ומנסים פעם אחת נוספת
      setTimeout(() => {
        if (my !== gen || started) return;
        speechSynthesis.cancel();
        setTimeout(() => { if (my === gen && !started) speechSynthesis.speak(u); }, 80);
      }, 1500);
    };
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      setTimeout(go, 60);
    } else go();
  }
  function make(text, rate, pitch) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = heVoice ? heVoice.lang : "he-IL";
    if (heVoice) u.voice = heVoice;
    u.rate = rate; u.pitch = pitch;
    return u;
  }

  function say(text, opts) {
    opts = opts || {};
    if (!has) return;
    play(make(opts.keepNikud ? text : strip(text), opts.rate || 0.85, opts.pitch || 1.05));  // קצב איטי לילדים
  }
  function stop() { gen++; if (has) speechSynthesis.cancel(); }
  function available() { return has; }

  /* קריאה עם הדגשת מילה (קריוקי). onWord(index) נקרא לכל מילה. */
  function wordStarts(clean) {
    const starts = []; let inWord = false;
    for (let i = 0; i < clean.length; i++) {
      const sp = /\s/.test(clean[i]);
      if (!sp && !inWord) { starts.push(i); inWord = true; }
      if (sp) inWord = false;
    }
    return starts;
  }
  function sayHighlight(text, onWord, onEnd) {
    const clean = strip(text);
    const words = clean.split(/\s+/).filter(Boolean);
    if (!has) {  // אין TTS — מדגיש לפי טיימר בלבד
      let i = 0; const t = setInterval(() => { if (i >= words.length) { clearInterval(t); onEnd && onEnd(); return; } onWord && onWord(i++); }, 480);
      return;
    }
    const u = make(clean, 0.8, 1.05);
    const starts = wordStarts(clean);
    let usedBoundary = false, timer = null, ti = 0;
    u.onboundary = e => {
      if (e.charIndex == null) return;
      usedBoundary = true; if (timer) { clearInterval(timer); timer = null; }
      let idx = 0; for (let k = 0; k < starts.length; k++) { if (starts[k] <= e.charIndex) idx = k; else break; }
      onWord && onWord(idx);
    };
    u.onend = () => { if (timer) clearInterval(timer); onEnd && onEnd(); };
    play(u);
    // גיבוי: אם onboundary לא נתמך, מדגישים לפי טיימר
    timer = setInterval(() => {
      if (usedBoundary) { clearInterval(timer); timer = null; return; }
      if (ti >= words.length) { clearInterval(timer); return; }
      onWord && onWord(ti++);
    }, 430);
  }

  return { say, stop, available, sayHighlight };
})();

/* ---------- הקלטה עצמית מקומית ---------- */
window.Recorder = (function () {
  let mediaRec = null, chunks = [], stream = null;

  async function start() {
    if (!navigator.mediaDevices || !window.MediaRecorder) throw new Error("no-mic");
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];
    // בחירת פורמט שהדפדפן באמת תומך בו (קריטי לאייפון/ספארי)
    let opts = {};
    if (MediaRecorder.isTypeSupported) {
      const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
      const mt = types.find(t => MediaRecorder.isTypeSupported(t));
      if (mt) opts.mimeType = mt;
    }
    try { mediaRec = new MediaRecorder(stream, opts); }
    catch (e) { mediaRec = new MediaRecorder(stream); }
    mediaRec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    mediaRec.start();
  }
  function stop() {
    return new Promise(resolve => {
      if (!mediaRec) return resolve(null);
      mediaRec.onstop = () => {
        const type = (mediaRec && mediaRec.mimeType) ? mediaRec.mimeType : "audio/webm";
        const blob = new Blob(chunks, { type });
        if (stream) stream.getTracks().forEach(t => t.stop());
        resolve(blob);
      };
      try { mediaRec.stop(); } catch (e) { resolve(null); }
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
