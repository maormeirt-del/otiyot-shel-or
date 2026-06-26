/* ===========================================================
   App — ראוטר ומסכים ראשיים. נֵרִי מלווה לאורך הדרך.
   =========================================================== */
window.App = (function () {
  const g = UI.g;

  function boot() {
    UI.applyBackground();
    if (!State.profile) onboarding(); else home();
  }

  /* ====================== כְּנִיסָה / בְּחִירַת בֵּן-בַּת ====================== */
  function onboarding() {
    UI.show(`<div class="onboard">
      <div class="hero-flame">${UI.neri(120)}</div>
      <h1 class="brand">אוֹתִיּוֹת שֶׁל אוֹר</h1>
      <p class="tagline">כָּל יֶלֶד יָכוֹל לִקְרֹא.</p>
      <div class="ob-card">
        <p class="ob-q">${UI.neriSays("שָׁלוֹם! אֲנִי נֵרִי. בּוֹאוּ נַתְחִיל מַסָּע שֶׁל אוֹר 🕯️", 64)}</p>
        <label class="ob-label">מִי מְשַׂחֵק?</label>
        <div class="gender-row">
          <button class="gender-btn" data-g="boy"><span class="ge">👦</span><span>בֵּן</span></button>
          <button class="gender-btn" data-g="girl"><span class="ge">👧</span><span>בַּת</span></button>
        </div>
        <label class="ob-label">אֵיךְ קוֹרְאִים לָךְ?</label>
        <input id="obName" class="ob-input" placeholder="הַשֵּׁם שֶׁלִּי..." maxlength="12">
        <button class="btn primary big" id="obStart" disabled>יֵשׁ! מַתְחִילִים ←</button>
      </div>
    </div>`);
    let chosen = null;
    S().querySelectorAll(".gender-btn").forEach(b => b.onclick = () => {
      S().querySelectorAll(".gender-btn").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel"); chosen = b.dataset.g; check();
    });
    const nameI = document.getElementById("obName");
    nameI.oninput = check;
    function check() {
      document.getElementById("obStart").disabled = !(chosen && nameI.value.trim());
    }
    document.getElementById("obStart").onclick = () => {
      State.setProfile({ name: nameI.value.trim(), gender: chosen, createdAt: Date.now() });
      UI.sparkle(); UI.chime(true);
      setTimeout(home, 500);
    };
  }
  const S = () => UI.screen();

  /* ====================== מַפַּת הַמַּסָּע ====================== */
  function home() {
    UI.show(`${UI.topbar()}
      <div class="home">
        <div class="hero-me">
          <button class="me-flame" onclick="App.go('shop')" title="לבוש את נֵרִי">${UI.neri(84)}<span class="me-edit">✏️</span></button>
          <div class="hero-me-info">
            ${UI.rankBar()}
            <div class="me-greet nikud">${g(`שָׁלוֹם ${UI.name()}! מוּכָן לְהַדְלִיק אוֹר?`, `שָׁלוֹם ${UI.name()}! מוּכָנָה לְהַדְלִיק אוֹר?`)}</div>
          </div>
        </div>
        ${missionCard()}
        ${State.chestReady() ? `<button class="chest-banner" onclick="App.chest()">🎁 תִּיבַת הָאוֹצָר הַיּוֹמִית מְחַכָּה! לַחֵץ לִפְתֹּחַ</button>` : ""}
        <div class="map-title">🗺️ מַסַּע הָאוֹר <span class="skip-hint">כָּל הַשְּׁלַבִּים פְּתוּחִים — בְּחַר לְאָן לִקְפֹּץ!</span></div>
        ${buildAdventureMap()}
        <div class="home-actions">
          <button class="tile" onclick="App.go('shop')"><span>🛍️</span>חֲנוּת</button>
          <button class="tile" onclick="App.playground()"><span>🕹️</span>מִשְׂחָקִים</button>
          <button class="tile" onclick="App.album()"><span>📔</span>אַלְבּוֹם</button>
          <button class="tile" onclick="App.realWorld()"><span>🌍</span>עוֹלָם</button>
          <button class="tile" onclick="App.achievements()"><span>🏅</span>מֶדַלְיוֹת</button>
          <button class="tile" onclick="App.go('parent')"><span>👪</span>הוֹרִים</button>
        </div>
      </div>`);
    UI.celebrateMilestones();
  }

  /* --- כרטיס המשימה היומית --- */
  function missionCard() {
    const m = State.dailyMission();
    const pA = Math.min(100, Math.round(m.activities / m.goalA * 100));
    const pL = Math.min(100, Math.round(m.light / m.goalL * 100));
    if (m.claimed) return `<div class="mission done">🎯 הַמְּשִׂימָה הַיּוֹמִית הֻשְׁלְמָה! נִתְרָאֶה מָחָר ✨</div>`;
    return `<div class="mission">
      <div class="mission-top">🎯 הַמְּשִׂימָה הַיּוֹמִית <span class="mission-reward">+${m.reward} אוֹר</span></div>
      <div class="mission-row"><span>פְּעִילֻיּוֹת ${m.activities}/${m.goalA}</span><div class="mini-bar"><span style="width:${pA}%"></span></div></div>
      <div class="mission-row"><span>אוֹר ${m.light}/${m.goalL}</span><div class="mini-bar"><span style="width:${pL}%"></span></div></div>
      ${m.met ? `<button class="btn primary small" onclick="App.claimMission()">קַבֵּל פְּרָס! 🎁</button>` : ``}
    </div>`;
  }
  function claimMission() {
    const r = State.claimMission();
    if (r) { UI.sparkle(); UI.chime(true); UI.toast(`+${r} אוֹר! מְשִׂימָה יוֹמִית ✓`); home(); setTimeout(() => UI.celebrateMilestones(), 300); }
  }

  /* --- מפת ההרפתקה (SVG מתפתל) --- */
  function buildAdventureMap() {
    const worlds = window.CURRICULUM.worlds, n = worlds.length, rec = recommendedWorld();
    const top0 = 64, gap = 122, H = top0 + (n - 1) * gap + 70;
    const x = i => (i % 2 === 0 ? 27 : 73);
    const y = i => top0 + i * gap;
    let d = `M ${x(0)} ${y(0)}`;
    for (let i = 1; i < n; i++) { const cy = (y(i - 1) + y(i)) / 2; d += ` C ${x(i - 1)} ${cy}, ${x(i)} ${cy}, ${x(i)} ${y(i)}`; }
    const nodes = worlds.map((w, i) => {
      const acts = w.build(), doneN = acts.filter(a => State.isDone(a.id)).length;
      const pct = Math.round(doneN / acts.length * 100);
      const done = pct === 100, isRec = i === rec;
      const r = 27, circ = 2 * Math.PI * r, off = circ * (1 - pct / 100);
      return `<button class="node ${isRec ? 'rec' : ''} ${done ? 'done' : ''}" style="left:${x(i)}%;top:${y(i)}px"
          onclick="App.openWorld('${w.id}')">
          <svg class="node-ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="${r}" class="ring-bg"/>
            <circle cx="32" cy="32" r="${r}" class="ring-fg" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/></svg>
          <span class="node-ico">${w.icon}</span>
          ${done ? '<span class="node-check">✓</span>' : ''}
          ${isRec ? `<span class="node-me">${UI.neri(34)}</span><span class="node-badge">אַתָּה כָּאן</span>` : ''}
          <span class="node-label nikud">${w.title}</span>
        </button>`;
    }).join("");
    return `<div class="adventure" style="height:${H}px">
      <span class="amb amb-sun">🌞</span><span class="amb amb-c1">☁️</span>
      <span class="amb amb-c2">☁️</span><span class="amb amb-s1">⭐</span>
      <span class="amb amb-s2">✨</span><span class="amb amb-tree">🌳</span>
      <svg class="path-svg" viewBox="0 0 100 ${H}" preserveAspectRatio="none">
        <path d="${d}" class="path-glow"/><path d="${d}" class="path-line"/></svg>${nodes}</div>`;
  }

  /* כל העולמות פתוחים — אפשר לדלג חופשי. מסמנים את המומלץ הבא. */
  function recommendedWorld() {
    const worlds = window.CURRICULUM.worlds;
    for (let i = 0; i < worlds.length; i++) {
      const acts = worlds[i].build();
      if (acts.some(a => !State.isDone(a.id))) return i;
    }
    return worlds.length - 1;
  }

  /* ====================== עוֹלָם בּוֹדֵד ====================== */
  function openWorld(wid) {
    const w = window.CURRICULUM.worlds.find(x => x.id === wid);
    const acts = w.build();
    UI.show(`${UI.topbar()}
      <div class="world-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה לַמַּפָּה</button>
        <div class="world-header"><span class="wh-icon">${w.icon}</span>
          <div><h2 class="nikud">${w.title}</h2><p class="nikud">${w.subtitle}</p></div></div>
        <div class="act-list">
          ${acts.map((a, i) => {
            const done = State.isDone(a.id);
            return `<button class="act-card ${done ? 'done' : ''}" onclick="App.openActivity('${wid}','${a.id}')">
              <span class="act-num">${done ? '✓' : i + 1}</span>
              <span class="act-name nikud">${a.title}</span>
              <span class="act-go">${done ? '🔁' : '←'}</span></button>`;
          }).join("")}
        </div>
      </div>`);
  }

  /* ====================== הַפְעָלַת פְּעִילוּת ====================== */
  function openActivity(wid, aid) {
    const w = window.CURRICULUM.worlds.find(x => x.id === wid);
    const act = w.build().find(a => a.id === aid);
    act._world = wid;
    Speech.stop();
    Activities[act.type](act);
  }

  function finishActivity(act, lightReward) {
    const first = State.markDone(act.id, lightReward);
    Speech.stop();
    UI.sparkle(); UI.chime(true);
    setTimeout(() => Speech.say(`כל הכבוד ${UI.name()}!`), 380);  // שבח אישי בקול
    UI.show(`<div class="done-screen">
      <div class="done-flame">${UI.neri(110)}</div>
      <h2>${g("כָּל הַכָּבוֹד!", "כָּל הַכָּבוֹד!")} 🎉</h2>
      <p class="nikud">${first ? g(`הִדְלַקְתָּ ${lightReward} נְקֻדּוֹת אוֹר!`, `הִדְלַקְתְּ ${lightReward} נְקֻדּוֹת אוֹר!`)
                              : g("חָזַרְתָּ לְתַרְגֵּל — כָּל הַכָּבוֹד!", "חָזַרְתְּ לְתַרְגֵּל — כָּל הַכָּבוֹד!")}</p>
      <div class="done-light">✨ ${State.progress.light} אוֹר</div>
      <div class="done-actions">
        <button class="btn primary big" onclick="App.openWorld('${act._world}')">הַמְשֵׁךְ ←</button>
        <button class="btn ghost" onclick="App.go('home')">🏠 לַמַּפָּה</button>
      </div>
    </div>`);
    setTimeout(() => UI.celebrateMilestones(), 400);
  }

  /* ====================== קְרִיאָה בָּעוֹלָם הָאֲמִיתִּי ====================== */
  function realWorld() {
    const tasks = window.REAL_WORLD_TASKS;
    UI.show(`${UI.topbar()}
      <div class="rw-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <h2>🌍 קְרִיאָה בָּעוֹלָם הָאֲמִיתִּי</h2>
        <p class="hint nikud">${g("צֵא מֵהַמָּסָךְ וְחַפֵּשׂ אוֹתִיּוֹת וּמִלִּים בַּחַיִּים. כְּשֶׁתַּצְלִיחַ — סַמֵּן!", "צְאִי מֵהַמָּסָךְ וְחַפְּשִׂי אוֹתִיּוֹת וּמִלִּים בַּחַיִּים. כְּשֶׁתַּצְלִיחִי — סַמְּנִי!")}</p>
        <div class="rw-list">
          ${tasks.map(t => {
            const done = State.progress.realWorld[t.id];
            return `<button class="rw-card ${done ? 'done' : ''}" onclick="App.doRealWorld('${t.id}')">
              <span class="rw-emoji">${t.emoji}</span><span class="rw-text nikud">${t.text}</span>
              <span class="rw-check">${done ? '✅' : '⬜'}</span></button>`;
          }).join("")}
        </div>
      </div>`);
  }
  function doRealWorld(id) {
    if (State.progress.realWorld[id]) return;
    State.markRealWorld(id); UI.chime(true); UI.sparkle();
    realWorld(); setTimeout(() => UI.celebrateMilestones(), 300);
  }

  /* ====================== רִגְעֵי גַּאֲוָה ====================== */
  function achievements() {
    const all = State.allMilestones(), have = State.progress.achievements;
    const gotN = have.length;
    UI.show(`${UI.topbar()}
      <div class="ach-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <h2>🏅 הַמֶּדַלְיוֹת שֶׁלִּי</h2>
        <div class="ach-rank">${UI.rankBar()}</div>
        <div class="calendar-card">
          <div class="cal-title">📅 לוּחַ הָאוֹר — רֶצֶף שֶׁל ${State.progress.streak.count} יָמִים 🔥</div>
          <div class="cal-row">${State.last14Days().map(d => `<span class="cal-day ${d.read ? 'lit' : ''}" title="${d.date}">${d.read ? '🕯️' : '·'}</span>`).join("")}</div>
        </div>
        <div class="ach-count">אָסַפְתָּ ${gotN} מִתּוֹךְ ${all.length} מֶדַלְיוֹת 🏆</div>
        <div class="ach-grid">
          ${all.map(m => {
            const got = have.includes(m.id);
            return `<div class="ach-card tier-${m.tier} ${got ? 'got' : 'locked'}" ${got ? `onclick="UI.showMilestoneCard(State.milestoneById('${m.id}'))"` : ""}>
              <div class="ach-emoji">${got ? m.emoji : '🔒'}</div>
              <div class="ach-title nikud">${m.title}</div>
              <div class="ach-tier">${got ? ({bronze:'🥉',silver:'🥈',gold:'🥇'}[m.tier]||'') : ''}</div></div>`;
          }).join("")}
        </div>
      </div>`);
  }

  /* ====================== מֶרְחַב הוֹרִים ====================== */
  function parent() {
    const p = State.progress;
    const totalActs = window.CURRICULUM.worlds.reduce((s, w) => s + w.build().length, 0);
    const doneActs = Object.keys(p.done).length;
    UI.show(`${UI.topbar()}
      <div class="parent-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <h2>👪 מֶרְחַב הוֹרִים</h2>
        <div class="stat-grid">
          <div class="stat"><b>${p.light}</b><span>נְקֻדּוֹת אוֹר</span></div>
          <div class="stat"><b>${p.wordsRead}</b><span>מִלִּים שֶׁנִּקְרְאוּ</span></div>
          <div class="stat"><b>${p.streak.count}</b><span>יְמֵי רֶצֶף</span></div>
          <div class="stat"><b>${doneActs}/${totalActs}</b><span>פְּעִילֻיּוֹת</span></div>
          <div class="stat"><b>${p.achievements.length}</b><span>אַבְנֵי דֶּרֶךְ</span></div>
        </div>
        <div class="parent-section">
          <h3>🎙️ הַהַקְלָטוֹת שֶׁל ${UI.name()}</h3>
          <p class="hint">הַשְׁווּ בֵּין הַהַקְלָטָה הָרִאשׁוֹנָה לָאַחֲרוֹנָה — תִּשְׁמְעוּ אֶת הַהֶבְדֵּל.</p>
          <div id="recList" class="rec-list">טוֹעֵן...</div>
        </div>
        <div class="parent-section">
          <h3>💡 טִיפּ לַהוֹרֶה</h3>
          <p class="nikud">הַמַּטָּרָה אֵינָהּ שֶׁהַיֶּלֶד יִקְרָא נָכוֹן — אֶלָּא שֶׁיִּפְתַּח סֵפֶר מֵרְצוֹנוֹ. שִׁבְחוּ אֶת הַמַּאֲמָץ, לֹא רַק אֶת הַתּוֹצָאָה.</p>
        </div>
        <div class="parent-section danger">
          <button class="btn ghost" onclick="App.confirmReset()">🗑️ אִתְחוּל פְּרוֹפִיל</button>
        </div>
      </div>`);
    loadRecList();
  }

  async function loadRecList() {
    const box = document.getElementById("recList");
    if (!box) return;
    const stories = window.STORIES;
    let html = "";
    for (const s of stories) {
      const first = await RecStore.get("first-" + s.id);
      const last = await RecStore.get("last-" + s.id);
      if (first || last) {
        html += `<div class="rec-item"><div class="rec-name nikud">${s.emoji} ${s.title}</div>`;
        if (first) html += `<div class="rec-a"><span>רִאשׁוֹנָה:</span><audio controls src="${URL.createObjectURL(first)}"></audio></div>`;
        if (last) html += `<div class="rec-a"><span>אַחֲרוֹנָה:</span><audio controls src="${URL.createObjectURL(last)}"></audio></div>`;
        html += `</div>`;
      }
    }
    box.innerHTML = html || `<p class="hint">עֲדַיִן אֵין הַקְלָטוֹת. בְּעוֹלַם הַסִּפּוּרִים אֶפְשָׁר לְהַקְלִיט.</p>`;
  }

  function confirmReset() {
    if (confirm("לְאַפֵּס אֶת כָּל הַהִתְקַדְּמוּת וְהַפְּרוֹפִיל?")) { State.reset(); boot(); }
  }

  /* ====================== חֲנוּת הָאוֹר ====================== */
  function shop() {
    UI.show(`${UI.topbar()}
      <div class="shop-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <div class="shop-head">
          <div class="shop-preview">${UI.neri(96)}</div>
          <div><h2>🛍️ חֲנוּת הָאוֹר</h2>
            <div class="shop-balance">יֵשׁ לְךָ ✨ <b>${State.progress.light}</b> אוֹר</div>
            <p class="hint">${g("קוֹרֵא וְאוֹסֵף אוֹר — וְקוֹנֶה אֲבִיזָרִים לְנֵרִי!", "קוֹרֵאת וְאוֹסֶפֶת אוֹר — וְקוֹנָה אֲבִיזָרִים לְנֵרִי!")}</p>
          </div>
        </div>
        ${shopSection("צִבְעֵי לֶהָבָה 🎨", "color")}
        ${shopSection("כּוֹבָעִים 🎩", "hat")}
        ${shopSection("חֲבֵרִים 🐾", "pet")}
        ${shopSection("רְקָעִים 🌌", "bg")}
      </div>`);
  }
  function shopSection(title, slot) {
    const items = window.SHOP_ALL.filter(x => x.slot === slot);
    return `<div class="shop-section"><h3>${title}</h3>
      <div class="shop-grid">${items.map(shopCard).join("")}</div></div>`;
  }
  function shopCard(it) {
    const owned = State.owns(it.id), equip = State.equipped(it.slot) === it.id;
    let preview;
    if (it.slot === "color") preview = `<span class="sw sw-color" style="background:linear-gradient(135deg,${it.stops[0]},${it.stops[2]})"></span>`;
    else if (it.slot === "bg") preview = `<span class="sw sw-bg" style="background:${it.css}"></span>`;
    else preview = `<span class="sw sw-emoji">${it.emoji}</span>`;
    let action;
    if (equip) action = `<span class="own-tag">לָבוּשׁ ✓</span>`;
    else if (owned) action = `<button class="btn small" onclick="App.equipItem('${it.id}')">לִלְבֹּשׁ</button>`;
    else action = `<button class="btn small primary" onclick="App.buyItem('${it.id}')">✨ ${it.cost}</button>`;
    return `<div class="shop-card ${equip ? 'equipped' : ''}">${preview}
      <div class="shop-name nikud">${it.name}</div>${action}</div>`;
  }
  function buyItem(id) {
    const it = window.shopItem(id), res = State.buy(it);
    if (res === "ok") { UI.chime(true); UI.sparkle(); UI.toast(g("קָנִיתָ! נֵרִי מְעֻדְכָּן ✨", "קָנִית! נֵרִי מְעֻדְכֶּנֶת ✨")); shop(); setTimeout(() => UI.celebrateMilestones(), 300); }
    else if (res === "broke") { UI.chime(false); UI.toast(g("אֵין מַסְפִּיק אוֹר — תַּמְשִׁיךְ לִקְרֹא! 📖", "אֵין מַסְפִּיק אוֹר — תַּמְשִׁיכִי לִקְרֹא! 📖")); }
  }
  function equipItem(id) { State.equip(window.shopItem(id)); UI.chime(true); shop(); }

  /* ====================== תִּיבַת אוֹצָר יוֹמִית ====================== */
  function chest() {
    if (!State.chestReady()) { UI.toast(g("כְּבָר פָּתַחְתָּ הַיּוֹם — בּוֹא מָחָר! 🎁", "כְּבָר פָּתַחְתְּ הַיּוֹם — בּוֹאִי מָחָר! 🎁")); return home(); }
    const reward = State.openChest();
    UI.sparkle(); UI.chime(true);
    UI.show(`<div class="chest-screen">
      <div class="chest-emoji">🎁</div>
      <h2>${g("פָּתַחְתָּ אֶת תִּיבַת הָאוֹצָר!", "פָּתַחְתְּ אֶת תִּיבַת הָאוֹצָר!")} ✨</h2>
      <div class="chest-reward">+${reward.light} אוֹר</div>
      ${reward.item ? `<div class="chest-item">${g("וְגַם מַתָּנָה", "וְגַם מַתָּנָה")}: <b>${reward.item.name}</b> ${reward.item.emoji || "🎨"}!</div>` : ""}
      <button class="btn primary big" onclick="App.go('home')">יֵשׁ! ←</button>
    </div>`);
    setTimeout(() => UI.celebrateMilestones(), 400);
  }

  /* ====================== מִגְרַשׁ הַמִּשְׂחָקִים ====================== */
  function playground() {
    UI.show(`${UI.topbar()}
      <div class="pg-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <h2>🕹️ מִגְרַשׁ הַמִּשְׂחָקִים</h2>
        <p class="hint nikud">${g("מִשְׂחָקִים מְהִירִים שֶׁמַּדְלִיקִים אוֹר! כָּל מִשְׂחָק = אוֹר.", "מִשְׂחָקִים מְהִירִים שֶׁמַּדְלִיקִים אוֹר! כָּל מִשְׂחָק = אוֹר.")}</p>
        <div class="pg-list">
          <button class="pg-card" onclick="App.gameLetterHunt()"><span class="pg-emoji">🎯</span>
            <span><b>צַיָּד הָאוֹתִיּוֹת</b><br><small>הַקֵּשׁ עַל הָאוֹת הַנְּכוֹנָה מַהֵר!</small></span></button>
          <button class="pg-card" onclick="App.gameWordBubbles()"><span class="pg-emoji">🫧</span>
            <span><b>בּוּעוֹת מִלִּים</b><br><small>אֵיזוֹ מִלָּה מַתְאִימָה לַתְּמוּנָה?</small></span></button>
        </div>
      </div>`);
  }

  /* משחק 1 — ציד אותיות (30 שניות) */
  function gameLetterHunt() {
    let score = 0, timeLeft = 30, target = null, timer;
    function pick() { target = window.LETTERS[Math.floor(Math.random() * window.LETTERS.length)]; }
    function grid() {
      const others = window.LETTERS.filter(l => l.ch !== target.ch).sort(() => Math.random() - .5).slice(0, 6);
      const cells = [target, target, ...others].sort(() => Math.random() - .5); // 2 מטרות
      return cells.map(c => `<button class="hunt-cell ${c.ch === target.ch ? 'is-target' : ''}">${c.ch}</button>`).join("");
    }
    function render() {
      UI.show(`<div class="game">
        <div class="game-top"><span>⏱️ <b id="t">${timeLeft}</b></span><span>🎯 ${g("מְצָא", "מִצְאִי")}: <b class="big-target">${target.ch}</b> <button class="speak-mini" onclick="Speech.say('${target.name}')">🔊</button></span><span>✨ <b id="sc">${score}</b></span></div>
        <div class="hunt-grid" id="hg">${grid()}</div>
        <button class="btn ghost" onclick="App.go('home')">סִיּוּם</button>
      </div>`);
      Speech.say(target.name);
      document.getElementById("hg").querySelectorAll(".hunt-cell").forEach(b => b.onclick = () => {
        if (b.classList.contains("is-target")) { score++; UI.chime(true); document.getElementById("sc").textContent = score; pick(); document.getElementById("hg").innerHTML = grid(); wire(); Speech.say(target.name); }
        else { b.classList.add("miss"); UI.chime(false); setTimeout(() => b.classList.remove("miss"), 300); }
      });
    }
    function wire() {
      document.getElementById("hg").querySelectorAll(".hunt-cell").forEach(b => b.onclick = () => {
        if (b.classList.contains("is-target")) { score++; UI.chime(true); document.getElementById("sc").textContent = score; pick(); document.getElementById("hg").innerHTML = grid(); wire(); Speech.say(target.name); }
        else { b.classList.add("miss"); UI.chime(false); setTimeout(() => b.classList.remove("miss"), 300); }
      });
    }
    pick(); render();
    timer = setInterval(() => {
      timeLeft--; const t = document.getElementById("t");
      if (t) t.textContent = timeLeft;
      if (timeLeft <= 0) { clearInterval(timer); endGame("צַיָּד הָאוֹתִיּוֹת", score, Math.max(3, Math.round(score * 1.5))); }
      else if (!t) clearInterval(timer); // עזב את המסך
    }, 1000);
  }

  /* משחק 2 — בועות מילים (10 סיבובים) */
  function gameWordBubbles() {
    let score = 0, round = 0, total = 10;
    function next() {
      if (round >= total) return endGame("בּוּעוֹת מִלִּים", score, Math.max(3, score * 2));
      round++;
      const w = window.WORDS[Math.floor(Math.random() * window.WORDS.length)];
      const others = window.WORDS.filter(x => x.w !== w.w).sort(() => Math.random() - .5).slice(0, 3);
      const opts = [w, ...others].sort(() => Math.random() - .5);
      UI.show(`<div class="game">
        <div class="game-top"><span>${round}/${total}</span><span>✨ <b>${score}</b></span></div>
        <div class="bubble-target">${w.emoji}</div>
        <p class="hint">${g("הַקֵּשׁ עַל הַמִּלָּה הַנְּכוֹנָה", "הַקִּישִׁי עַל הַמִּלָּה הַנְּכוֹנָה")}</p>
        <div class="bubbles">${opts.map((o, i) => `<button class="bubble-btn nikud" data-ok="${o.w === w.w}">${o.w}</button>`).join("")}</div>
        <button class="btn ghost" onclick="App.go('home')">סִיּוּם</button>
      </div>`);
      UI.screen().querySelectorAll(".bubble-btn").forEach(b => b.onclick = () => {
        if (b.dataset.ok === "true") { b.classList.add("pop"); score++; UI.chime(true); setTimeout(next, 500); }
        else { b.classList.add("miss"); UI.chime(false); setTimeout(() => b.classList.remove("miss"), 300); }
      });
    }
    next();
  }

  function endGame(name, score, light) {
    State.addLight(light); UI.sparkle(); UI.chime(true);
    UI.show(`<div class="done-screen">
      <div class="done-flame">${UI.neri(100)}</div>
      <h2>${name} 🎉</h2>
      <p>${g("הַנִּקּוּד שֶׁלְּךָ", "הַנִּקּוּד שֶׁלָּךְ")}: <b>${score}</b></p>
      <div class="done-light">✨ +${light} אוֹר</div>
      <div class="done-actions">
        <button class="btn primary big" onclick="App.playground()">עוֹד מִשְׂחָק ←</button>
        <button class="btn ghost" onclick="App.go('home')">🏠 לַמַּפָּה</button>
      </div>
    </div>`);
    setTimeout(() => UI.celebrateMilestones(), 400);
  }

  /* ====================== אַלְבּוֹם הַסִּפּוּרִים ====================== */
  function album() {
    const stories = window.STORIES;
    const haveN = stories.filter(s => State.isDone("story-" + s.id)).length;
    UI.show(`${UI.topbar()}
      <div class="album-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <h2>📔 אַלְבּוֹם הַסִּפּוּרִים</h2>
        <div class="ach-count">אָסַפְתָּ ${haveN} מִתּוֹךְ ${stories.length} סִפּוּרִים 📚</div>
        <div class="album-grid">
          ${stories.map(s => {
            const done = State.isDone("story-" + s.id), wid = s.level === 5 ? "w5" : "w4";
            return `<div class="album-card ${done ? 'got' : 'locked'}" ${done ? `onclick="App.openActivity('${wid}','story-${s.id}')"` : ""}>
              <div class="album-emoji">${done ? s.emoji : '❓'}</div>
              <div class="album-name nikud">${done ? s.title : '???'}</div>
              <div class="album-midda">${done ? s.valueLabel : ''}</div></div>`;
          }).join("")}
        </div>
        <p class="hint">${g("כָּל סִפּוּר שֶׁתְּסַיֵּם נֶחְשָׂף בָּאַלְבּוֹם — וְאֶפְשָׁר לִקְרֹא אוֹתוֹ שׁוּב!", "כָּל סִפּוּר שֶׁתְּסַיְּמִי נֶחְשָׂף בָּאַלְבּוֹם — וְאֶפְשָׁר לִקְרֹא אוֹתוֹ שׁוּב!")}</p>
      </div>`);
  }

  /* ====================== ראוטר ====================== */
  function go(where) {
    Speech.stop();
    if (where === "home") home();
    else if (where === "parent") parent();
    else if (where === "shop") shop();
    else home();
  }

  return { boot, go, home, onboarding, openWorld, openActivity, finishActivity,
           realWorld, doRealWorld, achievements, parent, confirmReset,
           shop, buyItem, equipItem, chest, claimMission,
           playground, gameLetterHunt, gameWordBubbles, album };
})();

window.addEventListener("DOMContentLoaded", () => App.boot());
