/* ===========================================================
   Activities · אֲתַגְּרֵי הָאוֹתִיּוֹת — פעילויות ארוכות של זיהוי אותיות.
   כל פעילות = כמה שלבים ברצף, ומסתיימת ב-App.finishActivity.
   מתחברות למנוע הקיים דרך Object.assign על window.Activities.
   =========================================================== */
(function () {
  const g = UI.g;

  /* ---------- כלים ---------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const strip = s => s.replace(/[֑-ׇ]/g, "");
  /* המסך עדיין חי? מונע טיימר של מסך ישן שמדלג שלב */
  const alive = node => !!node && document.body.contains(node);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* פיצול מילה מנוקדת ליחידות "אות + הניקוד שלה" */
  function units(word) {
    const out = [];
    for (const c of word) {
      if (/[֑-ׇ]/.test(c) && out.length) out[out.length - 1].full += c;
      else out.push({ ch: c, full: c });
    }
    return out;
  }

  /* מנוע שלבים: כל שלב מקבל ctx וקורא ctx.next() כשסיים */
  function run(act, steps, reward) {
    let i = 0;
    const ctx = {
      total: steps.length,
      get cur() { return i; },
      next() {
        if (i >= steps.length) return App.finishActivity(act, reward);
        const fn = steps[i++];
        fn(ctx);
      }
    };
    ctx.next();
  }

  function stage(ctx, title, inner) {
    const dots = Array.from({ length: ctx.total }, (_, k) =>
      `<span class="sdot ${k < ctx.cur - 1 ? "on" : ""} ${k === ctx.cur - 1 ? "cur" : ""}"></span>`).join("");
    UI.show(`${UI.topbar()}
      <div class="activity">
        <div class="stage-bar">${dots}<span class="stage-txt">שָׁלָב ${ctx.cur} מִתּוֹךְ ${ctx.total}</span></div>
        <h2 class="act-title nikud">${title}</h2>
        <div id="inner">${inner}</div>
      </div>`);
    return document.getElementById("inner");
  }

  /* שאלה אמריקאית — תמיד עם ערבוב סדר */
  function ask(box, q, options, answerIdx, onDone, cfg) {
    cfg = cfg || {};
    const order = shuffle(options.map((_, i) => i));
    const shown = order.map(i => options[i]);
    const ans = order.indexOf(answerIdx);
    box.innerHTML = `<div class="q-card">
      ${q ? `<div class="q-text nikud">${q}</div>` : ""}
      <div class="q-options ${cfg.row ? "row" : ""} ${cfg.tight ? "tight" : ""}"></div>
      <div class="q-feedback"></div></div>`;
    const opts = box.querySelector(".q-options"), fb = box.querySelector(".q-feedback");
    shown.forEach((o, i) => {
      const b = UI.el(`<button class="opt-btn ${cfg.cls || ""}">${o}</button>`);
      b.onclick = () => {
        if (b.classList.contains("locked")) return;
        if (i === ans) {
          b.classList.add("correct"); UI.chime(true);
          opts.querySelectorAll("button").forEach(x => x.classList.add("locked"));
          fb.innerHTML = `<span class="ok">${g("מְצֻיָּן! 🎉", "מְצֻיֶּנֶת! 🎉")}</span>`;
          setTimeout(() => { if (alive(fb)) onDone(); }, 650);
        } else {
          b.classList.add("wrong"); UI.chime(false);
          fb.innerHTML = `<span class="retry">${cfg.hint || g("כִּמְעַט! הִסְתַּכֵּל שׁוּב 💪", "כִּמְעַט! הִסְתַּכְּלִי שׁוּב 💪")}</span>`;
          setTimeout(() => b.classList.remove("wrong"), 600);
        }
      };
      opts.appendChild(b);
    });
  }

  /* ==========================================================
     1. הָאוֹתִיּוֹת הַתְּאוֹמוֹת — הבחנה בין אותיות דומות
     ========================================================== */
  function twins(act) {
    const pairs = act.data.pairs;
    const steps = [];
    pairs.forEach(p => {
      steps.push(ctx => meet(ctx, p));
      steps.push(ctx => sift(ctx, p));
      steps.push(ctx => realWord(ctx, p));
    });
    run(act, steps, act.data.reward || 14);

    /* שלב א: מכירים את ההבדל */
    function meet(ctx, p) {
      const box = stage(ctx, `👀 ${p.an} אוֹ ${p.bn}?`,
        `<div class="twin-row">
           <button class="twin-card" data-c="${p.a}"><span class="twin-ch">${p.a}</span><span class="twin-name nikud">${p.an}</span></button>
           <button class="twin-card" data-c="${p.b}"><span class="twin-ch">${p.b}</span><span class="twin-name nikud">${p.bn}</span></button>
         </div>
         <div class="tip-card nikud">💡 ${p.tip}</div>
         <p class="hint">${g("הַקֵּשׁ עַל כָּל אַחַת כְּדֵי לִשְׁמֹעַ", "הַקִּישִׁי עַל כָּל אַחַת כְּדֵי לִשְׁמֹעַ")}</p>
         <button class="btn primary big" id="go" disabled>${g("הֵבַנְתִּי, קָדִימָה!", "הֵבַנְתִּי, קָדִימָה!")}</button>`);
      Speech.say(p.tip);
      const heard = new Set();
      box.querySelectorAll(".twin-card").forEach(b => b.onclick = () => {
        const nm = b.dataset.c === p.a ? p.an : p.bn;
        Speech.say(nm); b.classList.add("tapped"); heard.add(b.dataset.c);
        if (heard.size === 2) document.getElementById("go").disabled = false;
      });
      document.getElementById("go").onclick = ctx.next;
    }

    /* שלב ב: לסמן רק את האות המבוקשת מתוך ערבוביה */
    function sift(ctx, p) {
      const target = Math.random() < .5 ? p.a : p.b;
      const other = target === p.a ? p.b : p.a;
      const tName = target === p.a ? p.an : p.bn;
      const n = 12, tCount = 5;
      const cells = shuffle(Array.from({ length: n }, (_, i) => i < tCount ? target : other));
      const box = stage(ctx, `🎯 סַמְּנוּ רַק אֶת הָאוֹת ${tName}`,
        `<p class="hint nikud">יֵשׁ כָּאן ${tCount} פְּעָמִים ${tName}. מָצְאוּ אֶת כֻּלָּן!</p>
         <div class="sift-count">נִמְצְאוּ <b id="fnd">0</b> מִתּוֹךְ ${tCount}</div>
         <div class="sift-grid">${cells.map(c => `<button class="sift-cell" data-c="${c}">${c}</button>`).join("")}</div>`);
      Speech.say(`סמנו רק את האות ${tName}`);
      let found = 0;
      box.querySelectorAll(".sift-cell").forEach(b => b.onclick = () => {
        if (b.classList.contains("hit")) return;
        if (b.dataset.c === target) {
          b.classList.add("hit"); UI.chime(true); found++;
          document.getElementById("fnd").textContent = found;
          if (found === tCount) { State.addLight(2); setTimeout(() => { if (alive(b)) ctx.next(); }, 600); }
        } else {
          b.classList.add("miss"); UI.chime(false);
          setTimeout(() => b.classList.remove("miss"), 400);
        }
      });
    }

    /* שלב ג: איזו מילה באמת קיימת */
    function realWord(ctx, p) {
      const w = pick(p.words);
      const box = stage(ctx, `📖 ${g("אֵיזוֹ מִלָּה נְכוֹנָה?", "אֵיזוֹ מִלָּה נְכוֹנָה?")}`,
        `<div class="word-pic">${w.emoji}</div><div id="q"></div>`);
      Speech.say(w.real);
      ask(document.getElementById("q"),
        `${g("אֵיזוֹ מִלָּה כְּתוּבָה נָכוֹן?", "אֵיזוֹ מִלָּה כְּתוּבָה נָכוֹן?")} <button class="speak-mini" onclick="Speech.say('${strip(w.real)}')">🔊</button>`,
        [`<span class="nikud big-opt">${w.real}</span>`, `<span class="nikud big-opt">${w.fake}</span>`], 0,
        () => { State.addLight(2); ctx.next(); },
        { row: true, hint: `💡 ${p.tip}` });
    }
  }

  /* ==========================================================
     2. סֵדֶר הָאָלֶף־בֵּית
     ========================================================== */
  function abc(act) {
    const L = window.LETTERS;
    run(act, [chain, after, before, missing], act.data.reward || 16);

    /* שלב א: להקיש על כל 22 האותיות לפי הסדר */
    function chain(ctx) {
      const cells = shuffle(L.map((l, i) => ({ ...l, i })));
      const box = stage(ctx, "🔤 מַסְלוּל הָאָלֶף־בֵּית",
        `<p class="hint nikud">הַקִּישׁוּ עַל הָאוֹתִיּוֹת לְפִי הַסֵּדֶר, מֵאָלֶף וְעַד תָּו.</p>
         <div class="abc-next nikud">הַבָּאָה בַּתּוֹר: <b id="want">אָלֶף</b></div>
         <div class="abc-grid">${cells.map(c => `<button class="abc-cell" data-i="${c.i}">${c.ch}</button>`).join("")}</div>
         <div class="abc-line" id="line"></div>`);
      let need = 0;
      box.querySelectorAll(".abc-cell").forEach(b => b.onclick = () => {
        if (b.disabled) return;
        if (+b.dataset.i === need) {
          b.disabled = true; b.classList.add("done"); UI.chime(true);
          Speech.say(L[need].name);
          document.getElementById("line").appendChild(UI.el(`<span class="abc-chip">${L[need].ch}</span>`));
          need++;
          if (need === L.length) { State.addLight(4); setTimeout(() => { if (alive(b)) ctx.next(); }, 700); }
          else document.getElementById("want").textContent = L[need].name;
        } else { b.classList.add("miss"); UI.chime(false); setTimeout(() => b.classList.remove("miss"), 400); }
      });
    }

    function neighbour(ctx, dir) {
      const label = dir > 0 ? "אַחֲרֵי" : "לִפְנֵי";
      let round = 0;
      const total = 4;
      go();
      function go() {
        if (round >= total) { State.addLight(3); return ctx.next(); }
        round++;
        const lo = dir > 0 ? 0 : 1, hi = dir > 0 ? L.length - 1 : L.length;
        const idx = lo + Math.floor(Math.random() * (hi - lo));
        const target = L[idx + dir];
        const others = shuffle(L.filter(x => x.ch !== target.ch)).slice(0, 2);
        const box = stage(ctx, `➡️ מִי בָּא ${label}?`,
          `<div class="abc-ask nikud">מִי בָּא ${label} הָאוֹת <b class="abc-big">${L[idx].ch}</b>?</div>
           <div class="abc-round">סִבּוּב ${round} מִתּוֹךְ ${total}</div><div id="q"></div>`);
        Speech.say(`מי בא ${label} האות ${L[idx].name}`);
        ask(document.getElementById("q"), "",
          [target, ...others].map(o => `<span class="opt-letter">${o.ch}</span>`), 0, go, { row: true, tight: true });
      }
    }
    function after(ctx) { neighbour(ctx, 1); }
    function before(ctx) { neighbour(ctx, -1); }

    /* שלב ד: החוליה החסרה בשרשרת */
    function missing(ctx) {
      let round = 0; const total = 4;
      go();
      function go() {
        if (round >= total) { State.addLight(3); return ctx.next(); }
        round++;
        const start = Math.floor(Math.random() * (L.length - 3));
        const chain4 = L.slice(start, start + 4);
        const hole = 1 + Math.floor(Math.random() * 2);
        const target = chain4[hole];
        const others = shuffle(L.filter(x => x.ch !== target.ch)).slice(0, 2);
        const box = stage(ctx, "🧩 הַחֻלְיָה הַחֲסֵרָה",
          `<div class="chain-row">${chain4.map((c, i) =>
             `<span class="chain-cell ${i === hole ? "hole" : ""}">${i === hole ? "?" : c.ch}</span>`).join("")}</div>
           <div class="abc-round">סִבּוּב ${round} מִתּוֹךְ ${total}</div><div id="q"></div>`);
        ask(document.getElementById("q"), `${g("אֵיזוֹ אוֹת חֲסֵרָה?", "אֵיזוֹ אוֹת חֲסֵרָה?")}`,
          [target, ...others].map(o => `<span class="opt-letter">${o.ch}</span>`), 0, go, { row: true, tight: true });
      }
    }
  }

  /* ==========================================================
     3. צַיָּד הָאוֹת בְּתוֹךְ מִשְׁפָּט
     ========================================================== */
  function hunt(act) {
    const texts = act.data.texts;
    run(act, texts.map(t => ctx => round(ctx, t)), act.data.reward || 13);

    function round(ctx, t) {
      const words = t.text.split(" ");
      const total = [...strip(t.text)].filter(c => c === t.target).length;
      const lname = (window.LETTERS.find(l => l.ch === t.target) || {}).name || t.target;
      const html = words.map((w, wi) =>
        `<span class="ht-word">${units(w).map((u, ui) =>
          `<span class="ht-l ${u.ch === t.target ? "is-t" : ""}" data-w="${wi}" data-i="${ui}">${u.full}</span>`).join("")}</span>`).join(" ");
      const fin = (window.FINAL_WORDS.find(f => f.base === t.target) || {}).ch;
      const note = fin && strip(t.text).indexOf(fin) >= 0
        ? `<p class="hint nikud warn">שִׂימוּ לֵב: ${fin} הִיא הָאָחוֹת הַסּוֹפִית, לֹא אוֹתָהּ צוּרָה.</p>` : "";
      const box = stage(ctx, `🔍 צוּד אֶת הָאוֹת ${lname}`,
        `<p class="hint nikud">הַקִּישׁוּ עַל כָּל ${lname} שֶׁמִּסְתַּתֶּרֶת בַּמִּשְׁפָּט.</p>${note}
         <div class="hunt-count">נִמְצְאוּ <b id="fnd">0</b> מִתּוֹךְ ${total}</div>
         <div class="hunt-text nikud">${html}</div>
         <button class="speak-mini" id="hear">🔊 ${g("קְרָא לִי אֶת הַמִּשְׁפָּט", "קִרְאִי לִי אֶת הַמִּשְׁפָּט")}</button>`);
      document.getElementById("hear").onclick = () => Speech.say(t.text);
      Speech.say(`צוד את האות ${lname}`);
      let found = 0;
      box.querySelectorAll(".ht-l").forEach(sp => sp.onclick = () => {
        if (sp.classList.contains("hit")) return;
        if (sp.classList.contains("is-t")) {
          sp.classList.add("hit"); UI.chime(true); found++;
          document.getElementById("fnd").textContent = found;
          if (found === total) { State.addLight(3); setTimeout(() => { if (alive(sp)) ctx.next(); }, 700); }
        } else {
          sp.classList.add("miss"); UI.chime(false);
          setTimeout(() => sp.classList.remove("miss"), 400);
        }
      });
    }
  }

  /* ==========================================================
     4. הָאוֹתִיּוֹת הַסּוֹפִיּוֹת
     ========================================================== */
  function finals(act) {
    const F = window.FINAL_WORDS;
    run(act, [meet, match, spot, spell], act.data.reward || 16);

    function meet(ctx) {
      const box = stage(ctx, "✋ חָמֵשׁ אוֹתִיּוֹת שֶׁמּוֹתְחוֹת רֶגֶל",
        `<p class="hint nikud">חָמֵשׁ אוֹתִיּוֹת מְשַׁנּוֹת צוּרָה כְּשֶׁהֵן מַגִּיעוֹת לְסוֹף הַמִּלָּה. הַקִּישׁוּ עַל כָּל אַחַת.</p>
         <div class="fin-list">${F.map(f => `<button class="fin-card" data-c="${f.ch}">
            <span class="fin-pair"><b>${f.base}</b> ⟵ <b class="fin-big">${f.ch}</b></span>
            <span class="fin-name nikud">${f.name}</span>
            <span class="fin-word nikud">${f.emoji} ${f.word}</span></button>`).join("")}</div>
         <button class="btn primary big" id="go" disabled>${g("הֵבַנְתִּי!", "הֵבַנְתִּי!")}</button>`);
      const heard = new Set();
      box.querySelectorAll(".fin-card").forEach(b => b.onclick = () => {
        const f = F.find(x => x.ch === b.dataset.c);
        Speech.say(`${f.name}. ${strip(f.word)}`); b.classList.add("tapped"); heard.add(f.ch);
        if (heard.size === F.length) document.getElementById("go").disabled = false;
      });
      document.getElementById("go").onclick = ctx.next;
    }

    function match(ctx) {
      let i = 0;
      go();
      function go() {
        if (i >= F.length) { State.addLight(3); return ctx.next(); }
        const f = F[i++];
        const others = shuffle(F.filter(x => x.ch !== f.ch)).slice(0, 2);
        const box = stage(ctx, "🔗 מִי הָאָחוֹת שֶׁלָּהּ?",
          `<div class="fin-focus">${f.ch}</div>
           <div class="abc-round">${i} מִתּוֹךְ ${F.length}</div><div id="q"></div>`);
        Speech.say(f.name);
        ask(document.getElementById("q"),
          `${g("אֵיזוֹ אוֹת רְגִילָה מִתְחַבֵּאת כָּאן?", "אֵיזוֹ אוֹת רְגִילָה מִתְחַבֵּאת כָּאן?")}`,
          [f, ...others].map(o => `<span class="opt-letter">${o.base}</span>`), 0, go, { row: true, tight: true });
      }
    }

    function spot(ctx) {
      let i = 0;
      go();
      function go() {
        if (i >= F.length) { State.addLight(3); return ctx.next(); }
        const f = F[i++];
        const others = shuffle(F.filter(x => x.ch !== f.ch)).slice(0, 2);
        const box = stage(ctx, "👁️ אֵיזוֹ מִלָּה נִגְמֶרֶת בָּהּ?",
          `<div class="fin-focus">${f.ch}</div>
           <div class="abc-round">${i} מִתּוֹךְ ${F.length}</div><div id="q"></div>`);
        ask(document.getElementById("q"),
          `${g("אֵיזוֹ מִלָּה נִגְמֶרֶת בָּאוֹת הַזֹּאת?", "אֵיזוֹ מִלָּה נִגְמֶרֶת בָּאוֹת הַזֹּאת?")}`,
          [f, ...others].map(o => `<span class="nikud big-opt">${o.emoji} ${o.word}</span>`), 0, go, { row: true });
      }
    }

    function spell(ctx) {
      let i = 0;
      go();
      function go() {
        if (i >= F.length) { State.addLight(4); return ctx.next(); }
        const f = F[i++];
        const bad = f.word.replace(f.ch, f.base);
        const box = stage(ctx, "✍️ אֵיךְ כּוֹתְבִים נָכוֹן?",
          `<div class="word-pic">${f.emoji}</div>
           <div class="abc-round">${i} מִתּוֹךְ ${F.length}</div><div id="q"></div>`);
        Speech.say(strip(f.word));
        ask(document.getElementById("q"),
          `${g("אֵיזוֹ כְּתִיבָה נְכוֹנָה?", "אֵיזוֹ כְּתִיבָה נְכוֹנָה?")} <button class="speak-mini" onclick="Speech.say('${strip(f.word)}')">🔊</button>`,
          [`<span class="nikud big-opt">${f.word}</span>`, `<span class="nikud big-opt">${bad}</span>`], 0, go,
          { row: true, hint: "💡 בְּסוֹף מִלָּה הָאוֹת מוֹתַחַת רֶגֶל." });
      }
    }
  }

  /* ==========================================================
     5. בּוֹנִים מִלָּה מֵאוֹתִיּוֹת (מִיָּמִין לִשְׂמֹאל)
     ========================================================== */
  function build(act) {
    const words = act.data.words;
    run(act, words.map(w => ctx => round(ctx, w)), act.data.reward || 15);

    function round(ctx, w) {
      const us = units(w.w);
      const tiles = shuffle(us.map((u, i) => ({ ...u, i })));
      const box = stage(ctx, "🧱 בּוֹנִים אֶת הַמִּלָּה",
        `<div class="word-pic">${w.emoji}</div>
         <p class="hint nikud">מַתְחִילִים מִיָּמִין! הַקִּישׁוּ עַל הָאוֹתִיּוֹת לְפִי הַסֵּדֶר.</p>
         <div class="build-slots">${us.map(() => `<span class="build-slot"></span>`).join("")}</div>
         <div class="build-tiles">${tiles.map(t => `<button class="build-tile nikud" data-i="${t.i}">${t.full}</button>`).join("")}</div>
         <button class="speak-mini" id="hear">🔊 ${g("שְׁמַע אֶת הַמִּלָּה", "שִׁמְעִי אֶת הַמִּלָּה")}</button>`);
      const say = () => Speech.say(strip(w.w));
      document.getElementById("hear").onclick = say; say();
      const slots = box.querySelectorAll(".build-slot");
      let need = 0;
      box.querySelectorAll(".build-tile").forEach(b => b.onclick = () => {
        if (b.disabled) return;
        if (+b.dataset.i === need) {
          b.disabled = true; b.classList.add("used"); UI.chime(true);
          slots[need].textContent = us[need].full;
          slots[need].classList.add("filled");
          need++;
          if (need === us.length) {
            State.addWordsRead(1); State.addLight(3);
            setTimeout(() => { Speech.say(strip(w.w)); }, 200);
            setTimeout(() => { if (alive(b)) ctx.next(); }, 1100);
          }
        } else { b.classList.add("miss"); UI.chime(false); setTimeout(() => b.classList.remove("miss"), 400); }
      });
    }
  }

  /* ==========================================================
     6. אוֹתָהּ אוֹת, בְּגָדִים אֲחֵרִים (זיהוי בגופנים שונים)
     ========================================================== */
  const FONTS = [
    { css: '"Frank Ruhl Libre",serif', name: "סֵפֶר" },
    { css: '"David Libre",serif', name: "תָּנָ״ךְ" },
    { css: '"Rubik",sans-serif', name: "מָסָךְ" },
    { css: '"Secular One",sans-serif', name: "כּוֹתֶרֶת" },
    { css: '"Suez One",serif', name: "שֶׁלֶט" },
    { css: '"Heebo",sans-serif', name: "עִתּוֹן" }
  ];
  function dress(act) {
    const L = window.LETTERS;
    run(act, [show, quiz, quiz, pairsStep], act.data.reward || 13);

    function show(ctx) {
      const picks = shuffle(L).slice(0, 4);
      const box = stage(ctx, "👕 אוֹתָהּ אוֹת, בְּגָדִים אֲחֵרִים",
        `<p class="hint nikud">כָּל אוֹת נִרְאֵית קְצָת אַחֶרֶת בְּכָל סֵפֶר וְשֶׁלֶט, אֲבָל הִיא אוֹתָהּ אוֹת. הַקִּישׁוּ עַל כָּל שׁוּרָה.</p>
         ${picks.map(l => `<button class="dress-row" data-n="${l.name}">
            ${FONTS.slice(0, 4).map(f => `<span class="dress-ch" style="font-family:${f.css}">${l.ch}</span>`).join("")}
            <span class="dress-name nikud">${l.name}</span></button>`).join("")}
         <button class="btn primary big" id="go" disabled>${g("הֵבַנְתִּי!", "הֵבַנְתִּי!")}</button>`);
      const heard = new Set();
      box.querySelectorAll(".dress-row").forEach(b => b.onclick = () => {
        Speech.say(b.dataset.n); b.classList.add("tapped"); heard.add(b.dataset.n);
        if (heard.size === picks.length) document.getElementById("go").disabled = false;
      });
      document.getElementById("go").onclick = ctx.next;
    }

    function quiz(ctx) {
      let i = 0; const total = 4;
      go();
      function go() {
        if (i >= total) { State.addLight(3); return ctx.next(); }
        i++;
        const target = pick(L);
        const others = shuffle(L.filter(x => x.ch !== target.ch)).slice(0, 2);
        const fs = shuffle(FONTS).slice(0, 3);
        const box = stage(ctx, "🕵️ מִי מִתְחַפֶּשֶׂת?",
          `<div class="abc-round">סִבּוּב ${i} מִתּוֹךְ ${total}</div><div id="q"></div>`);
        Speech.say(`איפה האות ${target.name}`);
        ask(document.getElementById("q"),
          `אֵיפֹה הָאוֹת <b>${target.name}</b>? <button class="speak-mini" onclick="Speech.say('${target.name}')">🔊</button>`,
          [target, ...others].map((o, k) => `<span class="opt-letter" style="font-family:${fs[k].css}">${o.ch}</span>`),
          0, go, { row: true, tight: true });
      }
    }

    function pairsStep(ctx) {
      const picks = shuffle(L).slice(0, 4);
      const fA = FONTS[0], fB = FONTS[3];
      const right = shuffle(picks), left = shuffle(picks);
      const box = stage(ctx, "🤝 מְחַבְּרִים זוּגוֹת",
        `<p class="hint nikud">כָּל אוֹת בַּטּוּר הַיְּמָנִי מוֹפִיעָה גַּם בַּשְּׂמָאלִי, בִּלְבוּשׁ אַחֵר. הַקִּישׁוּ אַחַת וְאָז אֶת הַתְּאוֹמָה שֶׁלָּהּ.</p>
         <div class="pair-cols">
           <div class="pair-col">${right.map(l => `<button class="pair-cell" data-c="${l.ch}" style="font-family:${fA.css}">${l.ch}</button>`).join("")}</div>
           <div class="pair-col">${left.map(l => `<button class="pair-cell" data-c="${l.ch}" data-side="b" style="font-family:${fB.css}">${l.ch}</button>`).join("")}</div>
         </div>`);
      let sel = null, done = 0;
      box.querySelectorAll(".pair-cell").forEach(b => b.onclick = () => {
        if (b.disabled) return;
        if (!sel) { sel = b; b.classList.add("sel"); Speech.say((L.find(x => x.ch === b.dataset.c) || {}).name || ""); return; }
        if (sel === b) { sel.classList.remove("sel"); sel = null; return; }
        if (sel.dataset.side === b.dataset.side) { sel.classList.remove("sel"); sel = b; b.classList.add("sel"); return; }
        if (sel.dataset.c === b.dataset.c) {
          [sel, b].forEach(x => { x.disabled = true; x.classList.remove("sel"); x.classList.add("matched"); });
          UI.chime(true); sel = null; done++;
          if (done === picks.length) { State.addLight(3); setTimeout(() => { if (alive(b)) ctx.next(); }, 600); }
        } else {
          b.classList.add("miss"); UI.chime(false);
          const s = sel; sel = null;
          setTimeout(() => { b.classList.remove("miss"); s.classList.remove("sel"); }, 450);
        }
      });
    }
  }

  Object.assign(window.Activities, { twins, abc, hunt, finals, build, dress });
})();
