/* ===========================================================
   Activities — מנוע הפעילויות. כל סוג פעילות = פונקציה.
   כולן מסתיימות ב-App.finishActivity(act, lightReward).
   =========================================================== */
window.Activities = (function () {
  const S = () => UI.screen();
  const g = UI.g;
  let combo = 0;  // רצף תשובות נכונות (קומבו)

  /* ---------- כלי עזר לשאלה אמריקאית ---------- */
  function askMC(container, q, options, answerIdx, onCorrect) {
    container.innerHTML = `<div class="q-card">
      <div class="q-text">${q}</div>
      <div class="q-options"></div>
      <div class="q-feedback"></div></div>`;
    const opts = container.querySelector(".q-options");
    const fb = container.querySelector(".q-feedback");
    options.forEach((o, i) => {
      const b = UI.el(`<button class="opt-btn">${o}</button>`);
      b.onclick = () => {
        if (b.classList.contains("locked")) return;
        if (answerIdx == null || i === answerIdx) {
          b.classList.add("correct"); UI.chime(true);
          opts.querySelectorAll("button").forEach(x => x.classList.add("locked"));
          if (answerIdx != null) {
            combo++; State.readCombo(combo);
            if (combo >= 3) UI.toast(`🔥 ${combo} בָּרֶצֶף!`);
          }
          fb.innerHTML = `<span class="ok">${g("מְצֻיָּן! 🎉", "מְצֻיֶּנֶת! 🎉")}</span>`;
          setTimeout(onCorrect, 700);
        } else {
          combo = 0;
          b.classList.add("wrong"); UI.chime(false);
          fb.innerHTML = `<span class="retry">כִּמְעַט! נַסּוּ שׁוּב 💪</span>`;
          setTimeout(() => { b.classList.remove("wrong"); }, 600);
        }
      };
      opts.appendChild(b);
    });
  }

  /* ====================== אוֹתִיּוֹת ====================== */
  function letter(act) {
    const l = act.data;
    UI.show(`${UI.topbar()}
      <div class="activity">
        <button class="speak-big" id="hearL">🔊 שְׁמַע</button>
        <div class="big-letter">${l.ch}</div>
        <div class="letter-name">${l.name}</div>
        <div class="letter-example">${l.emoji} <span class="nikud">${l.example}</span></div>
        <p class="hint">${g("לָחַץ עַל הַכַּפְתּוֹר כְּדֵי לִשְׁמֹעַ אֶת הָאוֹת", "לַחֲצִי עַל הַכַּפְתּוֹר כְּדֵי לִשְׁמֹעַ אֶת הָאוֹת")}</p>
        <div id="step2"></div>
      </div>`);
    const say = () => Speech.say(`${l.name}. ${l.example}`);
    document.getElementById("hearL").onclick = say;
    say();
    // שלב 2: זיהוי
    setTimeout(() => {
      const others = window.LETTERS.filter(x => x.ch !== l.ch).sort(() => Math.random() - .5).slice(0, 2);
      const opts = [l, ...others].sort(() => Math.random() - .5);
      const box = document.getElementById("step2");
      box.innerHTML = `<button class="speak-mini" id="rep">🔊 שְׁמַע שׁוּב</button>`;
      const qbox = UI.el(`<div></div>`); box.appendChild(qbox);
      document.getElementById("rep").onclick = () => Speech.say(l.name);
      askMC(qbox, `אֵיזוֹ אוֹת זֹאת? <button class="speak-mini" onclick="Speech.say('${l.name}')">🔊</button>`,
        opts.map(o => `<span class="opt-letter">${o.ch}</span>`),
        opts.findIndex(o => o.ch === l.ch),
        () => App.finishActivity(act, 3));
    }, 900);
  }

  /* ====================== הֲבָרוֹת ====================== */
  function syllable(act) {
    const base = act.data.base;
    const sylls = window.NIKUD.filter(n => n.mark !== "ְ").map(n => ({
      txt: base + n.mark, name: n.name
    }));
    UI.show(`${UI.topbar()}
      <div class="activity">
        <h2 class="act-title">${g("הַקֵּשׁ עַל כָּל הֲבָרָה וְשִׁמְע", "הַקִּישִׁי עַל כָּל הֲבָרָה וְשִׁמְעִי")} 🎵</h2>
        <div class="syl-grid">
          ${sylls.map((s, i) => `<button class="syl-btn nikud" data-i="${i}">${s.txt}</button>`).join("")}
        </div>
        <div id="sylq"></div>
      </div>`);
    S().querySelectorAll(".syl-btn").forEach(b => {
      b.onclick = () => { Speech.say(sylls[b.dataset.i].txt, { keepNikud: true }); b.classList.add("tapped"); checkAll(); };
    });
    let answered = false;
    function checkAll() {
      if (answered) return;
      if ([...S().querySelectorAll(".syl-btn")].every(b => b.classList.contains("tapped"))) {
        answered = true;
        const target = sylls[Math.floor(Math.random() * sylls.length)];
        const opts = [target, ...sylls.filter(s => s !== target).sort(() => Math.random() - .5).slice(0, 2)].sort(() => Math.random() - .5);
        const box = document.getElementById("sylq");
        askMC(box,
          `אֵיזוֹ הֲבָרָה שָׁמַעְתָּ? <button class="speak-mini" onclick="Speech.say('${target.txt}',{keepNikud:true})">🔊 שְׁמַע</button>`,
          opts.map(o => `<span class="opt-letter nikud">${o.txt}</span>`),
          opts.findIndex(o => o === target),
          () => App.finishActivity(act, 4));
        setTimeout(() => Speech.say(target.txt, { keepNikud: true }), 400);
      }
    }
  }

  /* ====================== מִלִּים ====================== */
  function word(act) {
    const words = act.data.words.slice();
    let idx = 0;
    function showWord() {
      const w = words[idx];
      UI.show(`${UI.topbar()}
        <div class="activity">
          <div class="progress-dots">${words.map((_, i) => `<span class="dot ${i < idx ? 'on' : ''} ${i === idx ? 'cur' : ''}"></span>`).join("")}</div>
          <button class="speak-big" id="hearW">🔊 שְׁמַע</button>
          <div class="big-word nikud">${w.w}</div>
          <div id="wmatch"></div>
        </div>`);
      const say = () => Speech.say(w.w);
      document.getElementById("hearW").onclick = say; say();
      setTimeout(() => {
        const others = window.WORDS.filter(x => x.w !== w.w).sort(() => Math.random() - .5).slice(0, 2);
        const opts = [w, ...others].sort(() => Math.random() - .5);
        const box = document.getElementById("wmatch");
        box.innerHTML = `<p class="hint">${g("אֵיזוֹ תְּמוּנָה מַתְאִימָה לַמִּלָּה?", "אֵיזוֹ תְּמוּנָה מַתְאִימָה לַמִּלָּה?")}</p><div class="emoji-options"></div>`;
        const eo = box.querySelector(".emoji-options");
        opts.forEach((o, i) => {
          const b = UI.el(`<button class="emoji-opt">${o.emoji}</button>`);
          b.onclick = () => {
            if (o.w === w.w) {
              b.classList.add("correct"); UI.chime(true);
              State.addWordsRead(1);
              eo.querySelectorAll("button").forEach(x => x.disabled = true);
              setTimeout(() => { idx++; idx < words.length ? showWord() : App.finishActivity(act, 5); }, 650);
            } else { b.classList.add("wrong"); UI.chime(false); setTimeout(() => b.classList.remove("wrong"), 500); }
          };
          eo.appendChild(b);
        });
      }, 700);
    }
    showWord();
  }

  /* ====================== סִפּוּר (זרימה מלאה) ====================== */
  function story(act) {
    const s = act.data;
    const wordsCount = s.pages.join(" ").split(/\s+/).length;
    // מקדם-גיל: תוכן קל מהכיתה נותן פחות נקודות גם בצעדי ההבנה
    const mult = (window.App && App.gradeMult) ? App.gradeMult(s.level) : 1;
    const al = n => State.addLight(Math.max(1, Math.round(n * mult)));
    let page = 0;

    const steps = buildSteps(s);
    let stepI = 0;

    renderRead();

    /* --- קריאת הסיפור עמוד-עמוד --- */
    function renderRead() {
      const line = s.pages[page];
      const tokens = line.split(" ");
      UI.show(`${UI.topbar()}
        <div class="activity story">
          <div class="story-scene scene-${(s.id.charCodeAt(0) + s.id.length) % 6}">
            <span class="scene-deco d1">✨</span><span class="scene-deco d2">⭐</span><span class="scene-deco d3">☁️</span>
            <span class="scene-hero">${s.emoji}</span>
            <div class="scene-title nikud">${s.title}</div>
            <div class="scene-midda">מִדָּה: ${s.valueLabel}</div>
          </div>
          <div class="progress-dots">${s.pages.map((_, i) => `<span class="dot ${i < page ? 'on' : ''} ${i === page ? 'cur' : ''}"></span>`).join("")}</div>
          <div class="story-text ${s.level === 5 ? '' : 'nikud'}" id="storyText">
            ${tokens.map((t, i) => `<span class="rw" data-w="${i}">${t}</span>`).join(" ")}
          </div>
          <p class="hint">${g("הַקֵּשׁ עַל מִלָּה כְּדֵי לִשְׁמֹעַ אוֹתָהּ", "הַקִּישִׁי עַל מִלָּה כְּדֵי לִשְׁמֹעַ אוֹתָהּ")}</p>
          <div class="story-nav">
            <button class="btn" id="readAll">🔊 ${g("קְרָא לִי אֶת הָעַמּוּד", "קִרְאִי לִי אֶת הָעַמּוּד")}</button>
            ${page > 0 ? `<button class="btn ghost" id="prev">→ קוֹדֵם</button>` : ""}
            <button class="btn primary" id="next">${page < s.pages.length - 1 ? "הַבָּא ←" : g("סִיַּמְתִּי! ✓", "סִיַּמְתִּי! ✓")}</button>
          </div>
        </div>`);
      S().querySelectorAll(".rw").forEach(sp => sp.onclick = () => { Speech.say(sp.textContent); sp.classList.add("lit"); setTimeout(() => sp.classList.remove("lit"), 600); });
      document.getElementById("readAll").onclick = () => Speech.say(line);
      const nx = document.getElementById("next");
      if (document.getElementById("prev")) document.getElementById("prev").onclick = () => { page--; renderRead(); };
      nx.onclick = () => {
        if (page < s.pages.length - 1) { page++; renderRead(); }
        else { State.addWordsRead(wordsCount); nextStep(); }
      };
    }

    /* --- מנוע השלבים אחרי הקריאה --- */
    function nextStep() {
      if (stepI >= steps.length) {
        const big = s.reward || (s.level === 5 ? 25 : 18);
        return App.finishActivity(act, big);
      }
      steps[stepI++]();
    }

    function buildSteps(s) {
      const out = [];
      // הקלטה עצמית
      if (Recorder.supported()) out.push(() => stepRecord(s));
      // הבנת הנקרא — 4 רמות
      const c = s.comprehension;
      out.push(() => stepQ("מִי?", c.who, "1"));
      out.push(() => stepQ("מָה קָרָה?", c.what, "2"));
      out.push(() => stepCloze(s));                      // השלמת מילה חסרה (אוטומטי)
      out.push(() => stepQ("לָמָּה?", c.why, "3"));
      if (s.trueFalse) out.push(() => stepTrueFalse(s.trueFalse)); // נכון/לא נכון
      out.push(() => stepThink(c.think));
      if (s.sequence) out.push(() => stepSequence(s.sequence));
      if (s.emotion) out.push(() => stepEmotion(s.emotion));
      if (s.ending) out.push(() => stepEnding(s.ending));
      return out;
    }

    function frame(title, inner) {
      UI.show(`${UI.topbar()}<div class="activity"><h2 class="act-title">${title}</h2><div id="inner">${inner}</div></div>`);
      return document.getElementById("inner");
    }

    function stepRecord(s) {
      const readText = s.pages.map(p =>
        `<div class="rec-line ${s.level === 5 ? '' : 'nikud'}">${p.split(" ").map(t => `<span class="rw">${t}</span>`).join(" ")}</div>`
      ).join("");
      const box = frame("🎙️ " + g("עַכְשָׁו תּוֹרְךָ לִקְרֹא בְּקוֹל", "עַכְשָׁו תּוֹרֵךְ לִקְרֹא בְּקוֹל"),
        `<p class="hint">${g("קְרָא אֶת הַסִּפּוּר בְּקוֹל בָּרוּר — וְאָז שְׁמַע אֶת עַצְמְךָ!", "קִרְאִי אֶת הַסִּפּוּר בְּקוֹל בָּרוּר — וְאָז שִׁמְעִי אֶת עַצְמֵךְ!")}</p>
         <div class="rec-read">${readText}</div>
         <div class="rec-box">
           <button class="btn primary big" id="recBtn">🔴 הַתְחֵל הַקְלָטָה</button>
           <div id="recPlay"></div>
         </div>
         <button class="btn ghost" id="skipRec">דַּלֵּג ←</button>`);
      box.querySelectorAll(".rec-read .rw").forEach(sp => sp.onclick = () => {
        Speech.say(sp.textContent); sp.classList.add("lit"); setTimeout(() => sp.classList.remove("lit"), 600);
      });
      document.getElementById("skipRec").onclick = nextStep;
      let recording = false;
      const btn = document.getElementById("recBtn");
      btn.onclick = async () => {
        if (!recording) {
          try { await Recorder.start(); recording = true; btn.textContent = "⏹️ עֲצֹר"; btn.classList.add("recording"); }
          catch (e) { UI.toast("אֵין גִּישָׁה לְמִיקְרוֹפוֹן"); }
        } else {
          const blob = await Recorder.stop(); recording = false;
          btn.textContent = "🔴 הַקְלֵט שׁוּב"; btn.classList.remove("recording");
          if (!blob || !blob.size) { UI.toast(g("הַהַקְלָטָה לֹא נִקְלְטָה, נַסֵּה שׁוּב 🎙️", "הַהַקְלָטָה לֹא נִקְלְטָה, נַסִּי שׁוּב 🎙️")); return; }
          const url = URL.createObjectURL(blob);
          // שמירת ההקלטה הראשונה לזיכרון ההתקדמות
          RecStore.get("first-" + s.id).then(first => { if (!first) RecStore.put("first-" + s.id, blob); });
          RecStore.put("last-" + s.id, blob);
          document.getElementById("recPlay").innerHTML =
            `<audio controls src="${url}"></audio>
             <p class="ok">${g("מָה אַתָּה אוֹמֵר? נִשְׁמַעְתָּ נֶהְדָּר! 🌟", "מָה אַתְּ אוֹמֶרֶת? נִשְׁמַעְתְּ נֶהְדָּר! 🌟")}</p>
             <button class="btn primary" id="recNext">הַמְשֵׁךְ ←</button>`;
          document.getElementById("recNext").onclick = nextStep;
        }
      };
    }

    function stepQ(label, q, lvl) {
      const box = frame(`<span class="qlevel">רָמָה ${lvl}</span> ${label}`, "");
      askMC(box, q.q + ` <button class="speak-mini" onclick="Speech.say(this.dataset.t)" data-t="${q.q.replace(/"/g,'')}">🔊</button>`,
        q.options, q.answer, () => { al(2); nextStep(); });
    }

    function stepThink(t) {
      const box = frame(`<span class="qlevel">רָמָה 4</span> מָה אַתָּה חוֹשֵׁב?`,
        `<div class="think-card">
           <div class="think-q nikud">${t.q}</div>
           <p class="hint">${g("אֵין כָּאן תְּשׁוּבָה נְכוֹנָה — סַפֵּר לְמִי שֶׁלְּיָדְךָ מָה אַתָּה חוֹשֵׁב.", "אֵין כָּאן תְּשׁוּבָה נְכוֹנָה — סַפְּרִי לְמִי שֶׁלְּיָדֵךְ מָה אַתְּ חוֹשֶׁבֶת.")}</p>
           <button class="btn primary" id="thinkDone">${g("סִפַּרְתִּי ✓", "סִפַּרְתִּי ✓")}</button>
         </div>`);
      Speech.say(t.q);
      document.getElementById("thinkDone").onclick = () => { al(2); nextStep(); };
    }

    function stepSequence(seq) {
      const shuffled = seq.map((x, i) => ({ ...x, orig: i })).sort(() => Math.random() - .5);
      const box = frame("🔢 " + g("סַדֵּר לְפִי הַסֵּדֶר הַנָּכוֹן", "סַדְּרִי לְפִי הַסֵּדֶר הַנָּכוֹן"),
        `<p class="hint">${g("הַקֵּשׁ עַל הַתְּמוּנוֹת לְפִי הַסֵּדֶר שֶׁקָּרָה בַּסִּפּוּר", "הַקִּישִׁי עַל הַתְּמוּנוֹת לְפִי הַסֵּדֶר שֶׁקָּרָה בַּסִּפּוּר")}</p>
         <div class="seq-grid"></div><div class="seq-line"></div>`);
      const grid = box.querySelector(".seq-grid"), lineEl = box.querySelector(".seq-line");
      let need = 0;
      shuffled.forEach(item => {
        const b = UI.el(`<button class="seq-card"><span class="seq-emoji">${item.emoji}</span><span class="seq-txt nikud">${item.text}</span></button>`);
        b.onclick = () => {
          if (b.disabled) return;
          if (item.orig === need) {
            b.disabled = true; b.classList.add("picked"); UI.chime(true);
            lineEl.appendChild(UI.el(`<span class="seq-num">${need + 1}. ${item.emoji}</span>`));
            need++;
            if (need === seq.length) { setTimeout(() => { al(3); nextStep(); }, 500); }
          } else { b.classList.add("wrong"); UI.chime(false); setTimeout(() => b.classList.remove("wrong"), 500); }
        };
        grid.appendChild(b);
      });
    }

    function stepEmotion(em) {
      const box = frame("💗 " + g("אֵיךְ הִרְגִּישָׁה הַדְּמוּת?", "אֵיךְ הִרְגִּישָׁה הַדְּמוּת?"), "");
      askMC(box, em.q, em.options, em.answer, () => { al(2); nextStep(); });
    }

    function stepEnding(en) {
      const box = frame("✨ " + g("אֵיךְ הִמְשַׁכְתָּ אֶת הַסִּפּוּר?", "אֵיךְ הִמְשַׁכְתְּ אֶת הַסִּפּוּר?"), "");
      askMC(box, en.q, en.options, null, () => { al(2); nextStep(); }); // אין תשובה "נכונה"
    }

    /* השלמת מילה חסרה — נוצר אוטומטית מהסיפור (בדיקת הבנה בהקשר) */
    function stepCloze(s) {
      const bare = t => t.replace(/[֑-ׇ]/g, "").replace(/["'.,!?]/g, "");
      const pages = s.pages.map((p, i) => ({ p, i, n: p.split(" ").length }));
      const page = pages.filter(x => x.n >= 3).sort((a, b) => b.n - a.n)[0] || pages[0];
      const tokens = page.p.split(" ");
      let cands = tokens.map((t, i) => ({ t, i })).filter(x => x.i > 0 && bare(x.t).length >= 3);
      if (!cands.length) cands = tokens.map((t, i) => ({ t, i })).filter(x => x.i > 0);
      const pickTok = cands[Math.floor(Math.random() * cands.length)];
      const target = pickTok.t;
      const blanked = tokens.map((t, i) => i === pickTok.i ? '<span class="cloze-gap">______</span>' : t).join(" ");
      const pool = [...new Set(s.pages.join(" ").split(" "))].filter(t => t !== target && bare(t).length >= 2);
      const distract = pool.sort(() => Math.random() - .5).slice(0, 2);
      const opts = [target, ...distract].sort(() => Math.random() - .5);
      frame("🧩 " + g("הַשְׁלֵם אֶת הַמִּלָּה הַחֲסֵרָה", "הַשְׁלִימִי אֶת הַמִּלָּה הַחֲסֵרָה"),
        `<div class="cloze-sentence nikud">${blanked}</div><div id="clozeq"></div>`);
      askMC(document.getElementById("clozeq"), g("אֵיזוֹ מִלָּה מַתְאִימָה?", "אֵיזוֹ מִלָּה מַתְאִימָה?"),
        opts.map(o => `<span class="nikud">${o}</span>`), opts.indexOf(target),
        () => { al(3); nextStep(); });
    }

    /* נכון / לא נכון — בדיקת הבנה */
    function stepTrueFalse(list) {
      let i = 0;
      function ask() {
        if (i >= list.length) return nextStep();
        const item = list[i++];
        const box = frame("✅ " + g("נָכוֹן אוֹ לֹא נָכוֹן?", "נָכוֹן אוֹ לֹא נָכוֹן?"),
          `<div class="tf-statement nikud">"${item.s}"</div>
           <div class="tf-row">
             <button class="tf-btn yes" data-v="true">👍 נָכוֹן</button>
             <button class="tf-btn no" data-v="false">👎 לֹא נָכוֹן</button>
           </div><div class="tf-fb"></div>`);
        Speech.say(item.s);
        const fb = box.querySelector(".tf-fb");
        box.querySelectorAll(".tf-btn").forEach(b => b.onclick = () => {
          const v = b.dataset.v === "true";
          if (v === item.a) {
            b.classList.add("correct"); UI.chime(true); State.addLight(2);
            box.querySelectorAll(".tf-btn").forEach(x => x.disabled = true);
            fb.innerHTML = `<span class="ok">${g("כָּל הַכָּבוֹד! 🎉", "כָּל הַכָּבוֹד! 🎉")}</span>`;
            setTimeout(ask, 700);
          } else {
            b.classList.add("wrong"); UI.chime(false);
            fb.innerHTML = `<span class="retry">חֲשֹׁב שׁוּב 💭</span>`;
            setTimeout(() => b.classList.remove("wrong"), 500);
          }
        });
      }
      ask();
    }
  }

  return { letter, syllable, word, story };
})();
