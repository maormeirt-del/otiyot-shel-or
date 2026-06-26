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
        ${parshaCard()}
        ${State.chestReady() ? `<button class="chest-banner" onclick="App.chest()">🎁 תִּיבַת הָאוֹצָר הַיּוֹמִית מְחַכָּה! לַחֵץ לִפְתֹּחַ</button>` : ""}
        <div class="map-title">🗺️ מַסַּע הָאוֹר <span class="skip-hint">כָּל הַשְּׁלַבִּים פְּתוּחִים — בְּחַר לְאָן לִקְפֹּץ!</span></div>
        ${buildAdventureMap()}
        <div class="home-actions">
          <button class="tile" onclick="App.go('shop')"><span>🛍️</span>חֲנוּת</button>
          <button class="tile" onclick="App.room()"><span>🏠</span>חֶדֶר נֵרִי</button>
          <button class="tile" onclick="App.coloringStudio()"><span>🎨</span>צְבִיעָה</button>
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

  /* --- אתגר הפרשה (שבועי) --- */
  function parshaCard() {
    const p = window.PARSHA.current();
    const done = State.isDone("parsha-" + p.label);
    return `<button class="parsha-banner ${done ? 'done' : ''}" onclick="App.parshaChallenge()">
      <span class="pb-icon">📜</span>
      <span class="pb-text"><b>אֶתְגַּר הַשָּׁבוּעַ</b><br><span class="nikud">פָּרָשַׁת ${p.label}</span></span>
      <span class="pb-go">${done ? '✓' : '←'}</span></button>`;
  }
  function parshaChallenge() {
    const p = window.PARSHA.current(), c = window.PARSHA.challengeFor(p.label);
    const done = State.isDone("parsha-" + p.label);
    UI.show(`${UI.topbar()}
      <div class="parsha-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <div class="parsha-card">
          <div class="parsha-title">📜 פָּרָשַׁת ${p.label}</div>
          <div class="parsha-theme nikud">${c.theme}</div>
          <div class="parsha-midda">מִדָּה: ${c.value}</div>
          <div class="parsha-wordbox">
            <div class="hint">${g("הַמִּלָּה שֶׁל הַשָּׁבוּעַ — הַקֵּשׁ לִשְׁמֹעַ:", "הַמִּלָּה שֶׁל הַשָּׁבוּעַ — הַקִּישִׁי לִשְׁמֹעַ:")}</div>
            <button class="parsha-word nikud" onclick="Speech.say('${c.word}')">${c.word} 🔊</button>
          </div>
          <div class="parsha-task">
            <div class="pt-label">🎯 הָאֶתְגָּר שֶׁלְּךָ:</div>
            <div class="nikud">${c.task}</div>
          </div>
          ${done
            ? `<div class="parsha-doneflag">✓ ${g("הִשְׁלַמְתָּ אֶת אֶתְגַּר הַשָּׁבוּעַ!", "הִשְׁלַמְתְּ אֶת אֶתְגַּר הַשָּׁבוּעַ!")}</div>`
            : `<button class="btn primary big" onclick="App.completeParsha('${p.label}')">${g("עָשִׂיתִי אֶת הָאֶתְגָּר! ✓", "עָשִׂיתִי אֶת הָאֶתְגָּר! ✓")}</button>`}
        </div>
      </div>`);
  }
  function completeParsha(label) {
    const first = State.markDone("parsha-" + label, 15);
    UI.sparkle(); UI.chime(true);
    if (first) setTimeout(() => Speech.say(`כל הכבוד ${UI.name()}!`), 350);
    parshaChallenge();
    setTimeout(() => UI.celebrateMilestones(), 300);
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
        <button class="btn primary room-cta" onclick="App.room()">🏠 ${g("בּוֹא לַחֶדֶר שֶׁל נֵרִי", "בּוֹאִי לַחֶדֶר שֶׁל נֵרִי")} ←</button>
        ${shopSection("צִבְעֵי לֶהָבָה 🎨", "color")}
        ${shopSection("כּוֹבָעִים וַאֲבִיזָרִים 🎩", "hat")}
        ${shopSection("חֲפָצִים שֶׁנֵּרִי מַחֲזִיק ✋", "prop")}
        ${shopSection("חֲבֵרִים 🐾", "pet")}
        ${shopSection("רָהִיטִים לַחֶדֶר 🏠", "furniture")}
        ${shopSection("רְקָעִים 🌌", "bg")}
      </div>`);
  }
  function shopSection(title, slot) {
    const items = window.SHOP_ALL.filter(x => x.slot === slot);
    return `<div class="shop-section"><h3>${title}</h3>
      <div class="shop-grid">${items.map(shopCard).join("")}</div></div>`;
  }
  function shopCard(it) {
    const owned = State.owns(it.id), isFurn = it.slot === "furniture";
    const equip = !isFurn && State.equipped(it.slot) === it.id;
    let preview;
    if (it.slot === "color") preview = `<span class="sw sw-color" style="background:linear-gradient(135deg,${it.stops[0]},${it.stops[2]})"></span>`;
    else if (it.slot === "bg") preview = `<span class="sw sw-bg" style="background:${it.css}"></span>`;
    else preview = `<span class="sw sw-emoji">${it.emoji}</span>`;
    let action;
    if (isFurn) action = owned ? `<span class="own-tag">בַּחֶדֶר ✓</span>` : `<button class="btn small primary" onclick="App.buyItem('${it.id}')">✨ ${it.cost}</button>`;
    else if (equip) action = `<span class="own-tag">לָבוּשׁ ✓</span>`;
    else if (owned) action = `<button class="btn small" onclick="App.equipItem('${it.id}')">לִלְבֹּשׁ</button>`;
    else action = `<button class="btn small primary" onclick="App.buyItem('${it.id}')">✨ ${it.cost}</button>`;
    return `<div class="shop-card ${(equip || (isFurn && owned)) ? 'equipped' : ''}">${preview}
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
          <button class="pg-card hot" onclick="App.gameFluency()"><span class="pg-emoji">🎵</span>
            <span><b>קְרִיאָה שׁוֹטֶפֶת</b><br><small>קְרָא אִתִּי בְּקֶצֶב — וְתִזְרֹם!</small></span></button>
          <button class="pg-card" onclick="App.gameWheel()"><span class="pg-emoji">🎡</span>
            <span><b>גַּלְגַּל הָאוֹתִיּוֹת</b><br><small>אוֹת + נִקּוּד = הֲבָרָה. שַׁנֵּה וְשָׁמַע!</small></span></button>
          <button class="pg-card" onclick="App.gameTrace()"><span class="pg-emoji">✍️</span>
            <span><b>כְּתִיבַת אוֹתִיּוֹת</b><br><small>עֲקֹב עַל הָאוֹת עִם הָאֶצְבַּע!</small></span></button>
          <button class="pg-card" onclick="App.gameOpeningSound()"><span class="pg-emoji">👂</span>
            <span><b>צְלִיל פּוֹתֵחַ</b><br><small>אֵיזוֹ מִלָּה מַתְחִילָה בַּצְּלִיל?</small></span></button>
          <button class="pg-card" onclick="App.gameClosingSound()"><span class="pg-emoji">👂</span>
            <span><b>צְלִיל סוֹגֵר</b><br><small>אֵיזוֹ מִלָּה נִגְמֶרֶת בַּצְּלִיל?</small></span></button>
          <button class="pg-card" onclick="App.gameSyllables()"><span class="pg-emoji">👏</span>
            <span><b>סְפִירַת הֲבָרוֹת</b><br><small>כַּמָּה הֲבָרוֹת בַּמִּלָּה?</small></span></button>
          <button class="pg-card" onclick="App.gameLetterHunt()"><span class="pg-emoji">🎯</span>
            <span><b>צַיָּד הָאוֹתִיּוֹת</b><br><small>הַקֵּשׁ עַל הָאוֹת הַנְּכוֹנָה מַהֵר!</small></span></button>
          <button class="pg-card" onclick="App.gameWordBubbles()"><span class="pg-emoji">🫧</span>
            <span><b>בּוּעוֹת מִלִּים</b><br><small>אֵיזוֹ מִלָּה מַתְאִימָה לַתְּמוּנָה?</small></span></button>
        </div>
      </div>`);
  }

  /* קריאה שוטפת — קריוקי + קריאה חוזרת + הקלטה (בונה שטף) */
  function gameFluency() {
    const passages = window.FLUENCY;
    let pi = 0;
    for (let i = 0; i < passages.length; i++) { if (!State.isDone("fluency-" + passages[i].id)) { pi = i; break; } }
    let stars = 0;
    function render() {
      stars = 0;
      const p = passages[pi];
      let wi = 0;
      const linesHtml = p.lines.map(line =>
        `<div class="fl-line nikud">${line.split(" ").map(w => `<span class="fl-word" data-i="${wi++}">${w}</span>`).join(" ")}</div>`
      ).join("");
      UI.show(`${UI.topbar()}
        <div class="fluency-view">
          <button class="back" onclick="App.playground()">→ חֲזָרָה</button>
          <h2>🎵 קְרִיאָה שׁוֹטֶפֶת</h2>
          <div class="fl-title nikud">${p.title}</div>
          <div class="fl-stars" id="flstars">${starHtml(0)}</div>
          <div class="fl-text" id="fltext">${linesHtml}</div>
          <div class="fl-actions">
            <button class="btn primary" id="along">🎵 ${g("קְרָא אִתִּי", "קִרְאִי אִתִּי")}</button>
            <button class="btn" id="solo">🙋 ${g("עַכְשָׁו תּוֹרְךָ", "עַכְשָׁו תּוֹרֵךְ")}</button>
          </div>
          <div id="flbottom"></div>
          <button class="btn ghost" id="flnext">פִּסְקָה אַחֶרֶת ←</button>
        </div>`);
      const words = () => UI.screen().querySelectorAll(".fl-word");
      const fullText = p.lines.join(" ");
      document.getElementById("along").onclick = () => {
        words().forEach(w => w.classList.remove("lit"));
        const ws = words();
        Speech.sayHighlight(fullText,
          idx => ws.forEach((w, k) => w.classList.toggle("lit", k === idx)),
          () => ws.forEach(w => w.classList.remove("lit")));
      };
      document.getElementById("solo").onclick = () => {
        Speech.stop(); words().forEach(w => w.classList.remove("lit"));
        document.getElementById("flbottom").innerHTML =
          `<p class="hint">${g("קְרָא בְּקוֹל בָּרוּר וְזוֹרֵם. סִיַּמְתָּ?", "קִרְאִי בְּקוֹל בָּרוּר וְזוֹרֵם. סִיַּמְתְּ?")}</p>
           <button class="btn primary big" id="didread">⭐ ${g("קָרָאתִי!", "קָרָאתִי!")}</button>
           <button class="btn ghost" id="flrec">🔴 ${g("הַקְלֵט אֶת עַצְמְךָ", "הַקְלִיטִי אֶת עַצְמֵךְ")}</button>
           <div id="flrecbox"></div>`;
        document.getElementById("didread").onclick = () => {
          stars++; document.getElementById("flstars").innerHTML = starHtml(stars); UI.chime(true);
          if (stars >= 3) master();
          else UI.toast(g("יָפֶה! עוֹד פַּעַם וְתִהְיֶה אַלּוּף שֶׁטֶף 🌟", "יָפֶה! עוֹד פַּעַם וְתִהְיִי אַלּוּפַת שֶׁטֶף 🌟"));
        };
        wireRec(p);
      };
      document.getElementById("flnext").onclick = () => { Speech.stop(); pi = (pi + 1) % passages.length; render(); };
    }
    function master() {
      const p = passages[pi];
      State.markDone("fluency-" + p.id, 12);
      UI.sparkle(); UI.chime(true);
      setTimeout(() => Speech.say(`כל הכבוד ${UI.name()}! קראת בשטף!`), 350);
      UI.toast(g("🏆 אַלּוּף שֶׁטֶף! קָרָאתָ 3 פְּעָמִים!", "🏆 אַלּוּפַת שֶׁטֶף! קָרָאתְ 3 פְּעָמִים!"));
      setTimeout(() => UI.celebrateMilestones(), 300);
      setTimeout(() => { pi = (pi + 1) % passages.length; render(); }, 1600);
    }
    function starHtml(n) { return [0, 1, 2].map(i => `<span class="fl-star ${i < n ? 'on' : ''}">★</span>`).join(""); }
    function wireRec(p) {
      const btn = document.getElementById("flrec"); if (!btn || !Recorder.supported()) { if (btn) btn.style.display = "none"; return; }
      let recording = false;
      btn.onclick = async () => {
        if (!recording) { try { await Recorder.start(); recording = true; btn.textContent = "⏹️ עֲצֹר"; btn.classList.add("recording"); } catch (e) { UI.toast("אֵין מִיקְרוֹפוֹן"); } }
        else {
          const blob = await Recorder.stop(); recording = false; btn.textContent = "🔴 הַקְלֵט שׁוּב"; btn.classList.remove("recording");
          if (!blob || !blob.size) { UI.toast(g("הַהַקְלָטָה לֹא נִקְלְטָה, נַסֵּה שׁוּב 🎙️", "הַהַקְלָטָה לֹא נִקְלְטָה, נַסִּי שׁוּב 🎙️")); return; }
          RecStore.get("first-fl-" + p.id).then(f => { if (!f) RecStore.put("first-fl-" + p.id, blob); });
          RecStore.put("last-fl-" + p.id, blob);
          document.getElementById("flrecbox").innerHTML = `<audio controls src="${URL.createObjectURL(blob)}"></audio>
            <p class="ok">${g("נִשְׁמַעְתָּ זוֹרֵם! 🌟", "נִשְׁמַעְתְּ זוֹרֶמֶת! 🌟")}</p>`;
        }
      };
    }
    render();
  }

  /* גלגל האותיות — אות + ניקוד = הברה (בהשראת Alef Bet Wheel) */
  function gameWheel() {
    const letters = window.LETTERS;
    const nikud = window.NIKUD.filter(n => n.mark !== "ְ"); // 7 תנועות
    let li = 1, ni = 0;
    const heard = new Set();
    const syll = () => letters[li].ch + nikud[ni].mark;
    const say = () => Speech.say(syll(), { keepNikud: true });
    function track() { heard.add(syll()); if (heard.size > 0 && heard.size % 6 === 0) { State.addLight(3); UI.toast("✨ +3 אוֹר עַל הַחֲקִירָה!"); } }
    function render() {
      UI.show(`${UI.topbar()}
        <div class="wheel-view">
          <button class="back" onclick="App.playground()">→ חֲזָרָה</button>
          <h2>🎡 גַּלְגַּל הָאוֹתִיּוֹת</h2>
          <p class="hint">${g("שַׁנֵּה אוֹת וְנִקּוּד — וְשָׁמַע אֵיךְ זֶה נִשְׁמָע!", "שַׁנִּי אוֹת וְנִקּוּד — וְשִׁמְעִי אֵיךְ זֶה נִשְׁמָע!")}</p>
          <div class="wheel-display nikud">${syll()}</div>
          <button class="speak-big" id="hear">🔊 ${g("שְׁמַע", "שִׁמְעִי")}</button>
          <div class="wheel-row">
            <button class="wheel-arrow" data-a="l-">▶</button>
            <div class="wheel-cur"><span class="wc-big nikud">${letters[li].ch}</span><small>${letters[li].name}</small></div>
            <button class="wheel-arrow" data-a="l+">◀</button>
          </div>
          <div class="wheel-row">
            <button class="wheel-arrow" data-a="n-">▶</button>
            <div class="wheel-cur"><span class="wc-big nikud">${nikud[ni].demo}</span><small>${nikud[ni].name}</small></div>
            <button class="wheel-arrow" data-a="n+">◀</button>
          </div>
        </div>`);
      document.getElementById("hear").onclick = say;
      UI.screen().querySelectorAll(".wheel-arrow").forEach(b => b.onclick = () => {
        const a = b.dataset.a;
        if (a === "l+") li = (li + 1) % letters.length;
        if (a === "l-") li = (li - 1 + letters.length) % letters.length;
        if (a === "n+") ni = (ni + 1) % nikud.length;
        if (a === "n-") ni = (ni - 1 + nikud.length) % nikud.length;
        track(); render(); say();
      });
    }
    render(); say();
  }

  /* מודעות פונולוגית — צליל פותח/סוגר (בהשראת "בהצלחה בכיתה א'") */
  function firstLetter(word) { return word.replace(/[֑-ׇ]/g, "")[0]; }
  function lastLetter(word) {
    const b = word.replace(/[֑-ׇ]/g, ""); const c = b[b.length - 1];
    const f = window.FINAL_LETTERS.find(x => x.ch === c); return f ? f.base : c;
  }
  function gameOpeningSound() { soundGame("first"); }
  function gameClosingSound() { soundGame("last"); }
  function soundGame(which) {
    const isFirst = which === "first";
    const title = isFirst ? "צְלִיל פּוֹתֵחַ" : "צְלִיל סוֹגֵר";
    const verb = isFirst ? "מַתְחִילָה" : "נִגְמֶרֶת";
    const getL = isFirst ? firstLetter : lastLetter;
    let score = 0, round = 0, total = 8;
    function next() {
      if (round >= total) return endGame(title, score, Math.max(3, score * 2));
      round++;
      const sh = window.WORDS.slice().sort(() => Math.random() - .5);
      const chosen = [], used = new Set();
      for (const w of sh) { const L = getL(w.w); if (L && !used.has(L)) { used.add(L); chosen.push({ w: w.w, emoji: w.emoji, L }); } if (chosen.length === 3) break; }
      const target = chosen[Math.floor(Math.random() * chosen.length)];
      const tl = window.LETTERS.find(l => l.ch === target.L);
      UI.show(`<div class="game">
        <div class="game-top"><span>${round}/${total}</span><span>✨ <b>${score}</b></span></div>
        <p class="hint">${g("אֵיזוֹ מִלָּה " + verb + " בַּצְּלִיל הַזֶּה?", "אֵיזוֹ מִלָּה " + verb + " בַּצְּלִיל הַזֶּה?")}</p>
        <button class="phon-target nikud" id="pt">${target.L} <small>🔊</small></button>
        <div class="emoji-options">${chosen.map(c => `<button class="emoji-opt" data-ok="${c.L === target.L}">${c.emoji}</button>`).join("")}</div>
        <button class="btn ghost" onclick="App.playground()">סִיּוּם</button>
      </div>`);
      const say = () => Speech.say(tl ? tl.name : target.L);
      document.getElementById("pt").onclick = say; say();
      UI.screen().querySelectorAll(".emoji-opt").forEach(b => b.onclick = () => {
        if (b.dataset.ok === "true") { b.classList.add("correct"); score++; UI.chime(true); setTimeout(next, 600); }
        else { b.classList.add("wrong"); UI.chime(false); setTimeout(() => b.classList.remove("wrong"), 400); }
      });
    }
    next();
  }

  /* ספירת הברות (בהשראת "בהצלחה בכיתה א'") */
  const SYL_WORDS = [
    { w: "דָּג", emoji: "🐟", n: 1 }, { w: "עֵץ", emoji: "🌳", n: 1 }, { w: "פִּיל", emoji: "🐘", n: 1 },
    { w: "יָד", emoji: "✋", n: 1 }, { w: "אֵשׁ", emoji: "🔥", n: 1 },
    { w: "אַבָּא", emoji: "👨", n: 2 }, { w: "שֶׁמֶשׁ", emoji: "☀️", n: 2 }, { w: "כֶּלֶב", emoji: "🐶", n: 2 },
    { w: "בַּיִת", emoji: "🏠", n: 2 }, { w: "פַּרְפַּר", emoji: "🦋", n: 2 }, { w: "צִפּוֹר", emoji: "🐦", n: 2 },
    { w: "סֵפֶר", emoji: "📖", n: 2 }, { w: "חָתוּל", emoji: "🐱", n: 2 }, { w: "פֶּרַח", emoji: "🌸", n: 2 },
    { w: "מְכוֹנִית", emoji: "🚗", n: 3 }, { w: "רַכֶּבֶת", emoji: "🚂", n: 3 }, { w: "תַּפּוּחַ", emoji: "🍎", n: 3 },
    { w: "בָּנָנָה", emoji: "🍌", n: 3 }, { w: "שׁוֹקוֹלָד", emoji: "🍫", n: 3 }
  ];
  function gameSyllables() {
    let score = 0, round = 0, total = 8;
    function next() {
      if (round >= total) return endGame("סְפִירַת הֲבָרוֹת", score, Math.max(3, score * 2));
      round++;
      const w = SYL_WORDS[Math.floor(Math.random() * SYL_WORDS.length)];
      UI.show(`<div class="game">
        <div class="game-top"><span>${round}/${total}</span><span>✨ <b>${score}</b></span></div>
        <button class="speak-big" id="hw">🔊 ${g("שְׁמַע", "שִׁמְעִי")}</button>
        <div class="syl-word">${w.emoji}<div class="big-word nikud">${w.w}</div></div>
        <p class="hint">${g("כַּמָּה הֲבָרוֹת בַּמִּלָּה? (טְפֹחַ פַּעַם לְכָל הֲבָרָה)", "כַּמָּה הֲבָרוֹת בַּמִּלָּה? (טִפְחִי פַּעַם לְכָל הֲבָרָה)")}</p>
        <div class="syl-nums">${[1, 2, 3].map(n => `<button class="syl-num" data-n="${n}">${n}</button>`).join("")}</div>
        <button class="btn ghost" onclick="App.playground()">סִיּוּם</button>
      </div>`);
      document.getElementById("hw").onclick = () => Speech.say(w.w); Speech.say(w.w);
      UI.screen().querySelectorAll(".syl-num").forEach(b => b.onclick = () => {
        if (+b.dataset.n === w.n) { b.classList.add("correct"); score++; UI.chime(true); setTimeout(next, 650); }
        else { b.classList.add("wrong"); UI.chime(false); setTimeout(() => b.classList.remove("wrong"), 400); }
      });
    }
    next();
  }

  /* כתיבת אותיות — trace באצבע (בהשראת "הכנה לכיתה א'") */
  function gameTrace() {
    const letters = window.LETTERS;
    let idx = 0;
    function render() {
      const l = letters[idx];
      UI.show(`${UI.topbar()}
        <div class="trace-view">
          <button class="back" onclick="App.playground()">→ חֲזָרָה</button>
          <h2>✍️ כְּתִיבַת אוֹתִיּוֹת</h2>
          <button class="speak-mini" id="sayL">🔊 ${l.name}</button>
          <p class="hint">${g("עֲקֹב עַל הָאוֹת עִם הָאֶצְבַּע, וְאָז בְּדֹק", "עִקְבִי עַל הָאוֹת עִם הָאֶצְבַּע, וְאָז בִּדְקִי")}</p>
          <div class="trace-stage">
            <canvas id="tg" class="trace-canvas" width="300" height="300"></canvas>
            <canvas id="tc" class="trace-canvas draw" width="300" height="300"></canvas>
          </div>
          <div class="trace-actions">
            <button class="btn" id="clr">🧽 נַקֵּה</button>
            <button class="btn primary" id="chk">בְּדֹק ✓</button>
            <button class="btn ghost" id="nxt">הַבָּא ←</button>
          </div>
        </div>`);
      Speech.say(l.name);
      document.getElementById("sayL").onclick = () => Speech.say(l.name);
      const guide = document.getElementById("tg"), draw = document.getElementById("tc");
      drawGuideLetter(guide.getContext("2d"), l.ch, 300, 300, "#e7dcc4");
      setupTrace(draw);
      document.getElementById("clr").onclick = () => draw.getContext("2d").clearRect(0, 0, 300, 300);
      document.getElementById("chk").onclick = () => checkTrace(draw, l.ch);
      document.getElementById("nxt").onclick = () => { idx = (idx + 1) % letters.length; render(); };
    }
    render();
  }
  function drawGuideLetter(ctx, ch, W, H, color) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.floor(H * 0.78)}px "Frank Ruhl Libre","David Libre",serif`;
    ctx.fillText(ch, W / 2, H * 0.52);
  }
  function setupTrace(canvas) {
    const W = canvas.width, H = canvas.height, ctx = canvas.getContext("2d");
    ctx.lineWidth = 24; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#f97e16";
    let drawing = false;
    const pos = e => { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: (t.clientX - r.left) * (W / r.width), y: (t.clientY - r.top) * (H / r.height) }; };
    canvas.addEventListener("pointerdown", e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); });
    canvas.addEventListener("pointermove", e => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); });
    window.addEventListener("pointerup", () => { drawing = false; });
  }
  function checkTrace(canvas, ch) {
    const W = canvas.width, H = canvas.height;
    const drawn = canvas.getContext("2d").getImageData(0, 0, W, H).data;
    const off = document.createElement("canvas"); off.width = W; off.height = H;
    drawGuideLetter(off.getContext("2d"), ch, W, H, "#000");
    const mask = off.getContext("2d").getImageData(0, 0, W, H).data;
    let total = 0, covered = 0;
    for (let i = 3; i < mask.length; i += 4) { if (mask[i] > 40) { total++; if (drawn[i] > 40) covered++; } }
    const pct = total ? covered / total : 0;
    if (pct >= 0.4) {
      UI.chime(true); UI.sparkle(); State.addLight(4);
      UI.toast(g("יָפֶה מְאֹד! כָּתַבְתָּ אֶת הָאוֹת ✍️", "יָפֶה מְאֹד! כָּתַבְתְּ אֶת הָאוֹת ✍️"));
    } else {
      UI.chime(false);
      UI.toast(g("כִּמְעַט! נַסֵּה לַעֲקֹב עַל כָּל הָאוֹת", "כִּמְעַט! נַסִּי לַעֲקֹב עַל כָּל הָאוֹת"));
    }
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
            const done = State.isDone("story-" + s.id), wid = s.level === 6 ? "w6" : s.level === 5 ? "w5" : "w4";
            return `<div class="album-card ${done ? 'got' : 'locked'}" ${done ? `onclick="App.openActivity('${wid}','story-${s.id}')"` : ""}>
              <div class="album-emoji">${done ? s.emoji : '❓'}</div>
              <div class="album-name nikud">${done ? s.title : '???'}</div>
              <div class="album-midda">${done ? s.valueLabel : ''}</div></div>`;
          }).join("")}
        </div>
        <p class="hint">${g("כָּל סִפּוּר שֶׁתְּסַיֵּם נֶחְשָׂף בָּאַלְבּוֹם — וְאֶפְשָׁר לִקְרֹא אוֹתוֹ שׁוּב!", "כָּל סִפּוּר שֶׁתְּסַיְּמִי נֶחְשָׂף בָּאַלְבּוֹם — וְאֶפְשָׁר לִקְרֹא אוֹתוֹ שׁוּב!")}</p>
      </div>`);
  }

  /* ====================== הַחֶדֶר שֶׁל נֵרִי ====================== */
  function posStyle(p) { return Object.keys(p).map(k => `${k}:${p[k]}`).join(";"); }
  function room() {
    const furn = window.SHOP.furniture.filter(f => State.owns(f.id));
    const happy = State.progress.happy || 60;
    UI.show(`${UI.topbar()}
      <div class="room-view">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <h2>🏠 הַחֶדֶר שֶׁל נֵרִי</h2>
        <div class="happy-bar">
          <span>😊 ${happy >= 85 ? g("נֵרִי מְאֻשָּׁר!", "נֵרִי מְאֻשָּׁר!") : g("נֵרִי שָׂמֵחַ", "נֵרִי שָׂמֵחַ")}</span>
          <div class="happy-track"><span style="width:${happy}%"></span></div>
        </div>
        <div class="room">
          ${furn.map(f => `<span class="room-item" style="${posStyle(f.pos)}">${f.emoji}</span>`).join("")}
          <div class="room-neri" id="roomneri">${UI.neri(120)}</div>
          ${furn.length === 0 ? `<div class="room-hint nikud">הַחֶדֶר רֵיק... קְנֵה רָהִיטִים בַּחֲנוּת! 🛋️</div>` : ""}
        </div>
        <div class="care-grid">
          <button class="care-btn" onclick="App.careNeri('play')"><span>🤹</span>שַׂחֵק</button>
          <button class="care-btn" onclick="App.careNeri('walk')"><span>🚶</span>טַיֵּל</button>
          <button class="care-btn" onclick="App.careNeri('pet')"><span>❤️</span>לַטֵּף</button>
          <button class="care-btn" onclick="App.gameFluency()"><span>📖</span>קְרָא לוֹ</button>
        </div>
        <button class="btn primary" onclick="App.go('shop')">🛍️ ${g("קְנֵה עוֹד דְּבָרִים", "קְנִי עוֹד דְּבָרִים")}</button>
      </div>`);
  }
  function careNeri(action) {
    State.raiseHappy(12); UI.chime(true);
    const n = document.getElementById("roomneri");
    if (n) { n.classList.remove("bounce"); void n.offsetWidth; n.classList.add("bounce"); }
    const msgs = {
      play: g("אֵיזֶה כֵּיף לְשַׂחֵק! 🎉", "אֵיזֶה כֵּיף לְשַׂחֵק! 🎉"),
      walk: g("טִיּוּל נֶחְמָד! 🚶", "טִיּוּל נֶחְמָד! 🚶"),
      pet:  g("נֵרִי אוֹהֵב אוֹתְךָ ❤️", "נֵרִי אוֹהֵב אוֹתָךְ ❤️")
    };
    UI.toast(msgs[action] || "נֵרִי שָׂמֵחַ!");
    const bar = document.querySelector(".happy-track span"); if (bar) bar.style.width = (State.progress.happy || 60) + "%";
  }

  /* ====================== סְטוּדִיוֹ צְבִיעָה ====================== */
  const PALETTE = ["#ff5a5a", "#ff9f43", "#ffd93d", "#6bcb77", "#4d96ff", "#9b5de5",
                   "#ff6fae", "#8d5524", "#2bb88a", "#333333", "#a0e7e5", "#ffffff"];
  function coloringStudio() {
    UI.show(`${UI.topbar()}
      <div class="coloring-studio">
        <button class="back" onclick="App.go('home')">→ חֲזָרָה</button>
        <h2>🎨 סְטוּדִיוֹ צְבִיעָה</h2>
        <p class="hint">${g("בְּחַר תְּמוּנָה וְצָבַע אוֹתָהּ בְּלַחִיצָה!", "בַּחֲרִי תְּמוּנָה וְצִבְעִי אוֹתָהּ בְּלַחִיצָה!")}</p>
        <div class="coloring-grid">
          ${window.COLORING.map(p => `<button class="coloring-card ${State.isDone('color-' + p.id) ? 'done' : ''}" onclick="App.colorPic('${p.id}')">
            <div class="cthumb">${p.svg}</div><div class="cname nikud">${p.name}</div></button>`).join("")}
        </div>
      </div>`);
  }
  function colorPic(id) {
    const pic = window.COLORING.find(p => p.id === id);
    let sel = PALETTE[0];
    UI.show(`${UI.topbar()}
      <div class="color-view">
        <button class="back" onclick="App.coloringStudio()">→ חֲזָרָה לַסְּטוּדִיוֹ</button>
        <button class="color-name nikud" onclick="Speech.say('${pic.word}')">${pic.name} 🔊</button>
        <div class="color-stage" id="cstage">${pic.svg}</div>
        <div class="palette" id="pal">
          ${PALETTE.map((c, i) => `<button class="swatch ${i === 0 ? 'sel' : ''}" style="background:${c}" data-c="${c}"></button>`).join("")}
        </div>
        <div class="color-actions">
          <button class="btn" id="cclear">🧽 ${g("נַקֵּה", "נַקִּי")}</button>
          <button class="btn primary" id="cdone">${g("סִיַּמְתִּי! ✓", "סִיַּמְתִּי! ✓")}</button>
        </div>
      </div>`);
    const stage = document.getElementById("cstage");
    function wirePaint() { stage.querySelectorAll(".fillable").forEach(el => el.onclick = () => { el.setAttribute("fill", sel); UI.chime(true); }); }
    wirePaint();
    document.getElementById("pal").querySelectorAll(".swatch").forEach(b => b.onclick = () => {
      sel = b.dataset.c;
      document.querySelectorAll(".swatch").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
    });
    document.getElementById("cclear").onclick = () => stage.querySelectorAll(".fillable").forEach(el => el.setAttribute("fill", "#fff"));
    document.getElementById("cdone").onclick = () => {
      const first = State.markDone("color-" + id, 8);
      UI.sparkle(); UI.chime(true);
      UI.toast(g("יָפֶה מְאֹד! צַיָּר אֲמִתִּי 🎨", "יָפֶה מְאֹד! צַיֶּרֶת אֲמִתִּית 🎨"));
      setTimeout(() => UI.celebrateMilestones(), 300);
      coloringStudio();
    };
  }

  /* ====================== ראוטר ====================== */
  function go(where) {
    Speech.stop();
    if (where === "home") home();
    else if (where === "parent") parent();
    else if (where === "shop") shop();
    else if (where === "room") room();
    else if (where === "coloring") coloringStudio();
    else home();
  }

  return { boot, go, home, onboarding, openWorld, openActivity, finishActivity,
           realWorld, doRealWorld, achievements, parent, confirmReset,
           shop, buyItem, equipItem, chest, claimMission, room, careNeri, coloringStudio, colorPic,
           playground, gameFluency, gameWheel, gameOpeningSound, gameClosingSound, gameSyllables, gameTrace,
           gameLetterHunt, gameWordBubbles, album,
           parshaChallenge, completeParsha };
})();

window.addEventListener("DOMContentLoaded", () => App.boot());
