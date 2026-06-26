/* ===========================================================
   UI — עזרי תצוגה, טקסט מותאם-מגדר, הדמות נֵרִי, אפקטים.
   =========================================================== */
window.UI = (function () {

  /* טקסט מותאם מגדר: g("ברוך הבא","ברוכה הבאה") */
  function g(male, female) {
    return (State.profile && State.profile.gender === "girl") ? female : male;
  }

  function name() { return (State.profile && State.profile.name) || g("חָבֵר", "חֲבֵרָה"); }

  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }
  function screen() { return document.getElementById("screen"); }
  function show(html) { screen().innerHTML = html; screen().scrollTop = 0; }

  /* הדמות נֵרִי — להבה (SVG מוטמע). opts.plain = ללא אביזרים (המורה נֵרִי).
     אחרת לובש את הצבע/הכובע/החבר שהילד קנה. */
  function neri(size, opts) {
    opts = opts || {}; size = size || 90;
    const has = !opts.plain && State.profile && window.shopItem;
    const colorItem = has ? window.shopItem(State.equipped("color")) : null;
    const stops = (colorItem && colorItem.stops) || ["#fff6cf", "#ffd24a", "#ff8a1f"];
    const gid = "fg" + Math.random().toString(36).slice(2, 8);
    const hat = has && State.equipped("hat") ? window.shopItem(State.equipped("hat")) : null;
    const pet = has && State.equipped("pet") ? window.shopItem(State.equipped("pet")) : null;
    const svg = `<svg class="neri" viewBox="0 0 100 130" width="${size}" height="${size * 1.3}" aria-label="נרי">
      <defs><radialGradient id="${gid}" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${stops[0]}"/>
        <stop offset="45%" stop-color="${stops[1]}"/>
        <stop offset="100%" stop-color="${stops[2]}"/>
      </radialGradient></defs>
      <ellipse cx="50" cy="118" rx="26" ry="7" fill="rgba(255,180,60,.25)"/>
      <rect x="38" y="78" width="24" height="40" rx="6" fill="#3a5ba0"/>
      <rect x="38" y="78" width="24" height="10" rx="5" fill="#5a7fd0"/>
      <path class="flame" d="M50 8 C66 30 70 44 64 60 C61 70 56 74 50 74 C44 74 39 70 36 60 C30 44 34 30 50 8 Z" fill="url(#${gid})"/>
      <circle cx="44" cy="44" r="3.2" fill="#3a2a10"/>
      <circle cx="56" cy="44" r="3.2" fill="#3a2a10"/>
      <path d="M44 53 Q50 58 56 53" stroke="#3a2a10" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    </svg>`;
    const hatHtml = hat ? `<span class="neri-hat" style="font-size:${Math.round(size * .42)}px">${hat.emoji}</span>` : "";
    const petHtml = pet ? `<span class="neri-pet" style="font-size:${Math.round(size * .4)}px">${pet.emoji}</span>` : "";
    return `<span class="neri-wrap" style="width:${size}px;height:${Math.round(size * 1.3)}px">${svg}${hatHtml}${petHtml}</span>`;
  }

  /* רקע מסך לפי הפריט שנקנה */
  function applyBackground() {
    if (!State.profile || !window.shopItem) return;
    const item = window.shopItem(State.equipped("bg"));
    document.body.style.background = (item && item.css) ? item.css : "";
    document.body.style.backgroundAttachment = "fixed";
  }

  /* פס דרגה — מניצוץ ועד שמש */
  function rankBar() {
    const r = State.rank(), nx = State.nextRank(), total = State.progress.lightTotal;
    const pct = nx ? Math.round((total - r.min) / (nx.min - r.min) * 100) : 100;
    return `<div class="rank-bar">
      <div class="rank-now">${r.emoji} <b>${r.name}</b></div>
      <div class="rank-track"><span style="width:${pct}%"></span></div>
      <div class="rank-next">${nx ? `עוֹד ${nx.min - total} אוֹר ל${nx.emoji}${nx.name}` : "הִגַּעְתָּ לַשִּׂיא! ☀️"}</div>
    </div>`;
  }

  /* בועת דיבור של נרי */
  function neriSays(text, size) {
    return `<div class="neri-row">${neri(size || 72)}
      <div class="bubble">${text}</div></div>`;
  }

  /* פס עליון: בית · דרגה · אור · רצף · חנות */
  function topbar() {
    const p = State.progress, r = State.rank();
    const chest = State.chestReady() ? `<button class="icon-btn chest-ready" onclick="App.chest()" title="תיבת אוצר">🎁</button>` : "";
    return `<div class="topbar">
      <button class="icon-btn" onclick="App.go('home')" title="בית">🏠</button>
      <button class="rank-pill" onclick="App.achievements()" title="${r.name}">${r.emoji}</button>
      <div class="light-pill">✨ <b>${p.light}</b></div>
      <div class="streak-pill">🔥 ${p.streak.count}</div>
      ${chest}
      <button class="icon-btn" onclick="App.go('shop')" title="חנות">🛍️</button>
    </div>`;
  }

  /* פיזור ניצוצות אור (חגיגה) */
  function sparkle() {
    const layer = document.getElementById("fx");
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("div");
      s.className = "spark";
      s.textContent = ["✨", "⭐", "🌟", "💛"][i % 4];
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDelay = (Math.random() * .4) + "s";
      s.style.fontSize = (16 + Math.random() * 18) + "px";
      layer.appendChild(s);
      setTimeout(() => s.remove(), 1600);
    }
  }

  /* צליל הצלחה קצר (Web Audio — חינם, בלי קבצים) */
  let actx = null;
  function chime(ok) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = ok ? [523, 659, 784] : [330, 247];
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), g2 = actx.createGain();
        o.frequency.value = f; o.type = "sine";
        o.connect(g2); g2.connect(actx.destination);
        const t = actx.currentTime + i * 0.12;
        g2.gain.setValueAtTime(0.0001, t);
        g2.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.start(t); o.stop(t + 0.24);
      });
    } catch (e) {}
  }

  /* טוסט קצר */
  function toast(msg) {
    const t = el(`<div class="toast">${msg}</div>`);
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("in"), 10);
    setTimeout(() => { t.classList.remove("in"); setTimeout(() => t.remove(), 300); }, 1800);
  }

  /* חגיגת אבן-דרך אם יש */
  function celebrateMilestones() {
    let m, shown = false;
    while ((m = State.popMilestone())) {
      showMilestoneCard(m); shown = true;
    }
    return shown;
  }

  function showMilestoneCard(m) {
    sparkle(); chime(true);
    const ov = el(`<div class="overlay">
      <div class="proud-card">
        <div class="proud-emoji">${m.emoji}</div>
        <div class="proud-badge">רֶגַע שֶׁל גַּאֲוָה</div>
        <h2>${m.title}</h2>
        <p>${g("כָּל הַכָּבוֹד! הִדְלַקְתָּ עוֹד אוֹר.", "כָּל הַכָּבוֹד! הִדְלַקְתְּ עוֹד אוֹר.")}</p>
        <div class="proud-name">${name()}</div>
        <div class="proud-actions">
          <button class="btn" onclick="UI.printCard(this)">🖨️ הַדְפֵּס/שְׁמֹר</button>
          <button class="btn primary" onclick="this.closest('.overlay').remove()">יֵשׁ! מַמְשִׁיךְ</button>
        </div>
      </div></div>`);
    document.body.appendChild(ov);
  }
  function printCard(btn) {
    const card = btn.closest(".proud-card").outerHTML;
    const w = window.open("", "_blank", "width=600,height=700");
    w.document.write(`<html dir="rtl"><head><meta charset="utf-8"><title>רגע של גאווה</title>
      <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#fff8ec}
      .proud-card{text-align:center;border:4px solid #ffd24a;border-radius:24px;padding:40px;max-width:420px}
      .proud-emoji{font-size:80px}.proud-badge{color:#c97a12;font-weight:700}.proud-name{font-size:26px;margin-top:10px;color:#3a5ba0}
      button{display:none}</style></head><body>${card}</body></html>`);
    w.document.close(); setTimeout(() => w.print(), 400);
  }

  return { g, name, el, screen, show, neri, neriSays, topbar, sparkle, chime, toast,
           celebrateMilestones, showMilestoneCard, printCard, applyBackground, rankBar };
})();
