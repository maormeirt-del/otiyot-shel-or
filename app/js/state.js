/* ===========================================================
   State — פרופיל + התקדמות + ארנק אוֹר + חנות + דרגות.
   הכל ב-localStorage. אפס שרת.
   light      = יתרה להוצאה בחנות
   lightTotal = סך כל האור שנאסף אי-פעם (לדרגות ולמדליות)
   =========================================================== */
window.State = (function () {
  const PKEY = "aor_profile";
  const GKEY = "aor_progress";

  function loadProfile() { try { return JSON.parse(localStorage.getItem(PKEY)); } catch (e) { return null; } }
  function saveProfile(p) { localStorage.setItem(PKEY, JSON.stringify(p)); }

  function defaultProgress() {
    return {
      light: 0, lightTotal: 0,
      done: {}, achievements: [],
      streak: { count: 0, last: null },
      wordsRead: 0, realWorld: {},
      owned: { "c-gold": true, "bg-cream": true },
      equipped: { color: "c-gold", hat: null, pet: null, prop: null, bg: "bg-cream" },
      chest: { last: null },
      daily: { date: null, activities: 0, light: 0, claimed: false, arcadeSec: 0 },
      readDays: {},
      bestCombo: 0,
      happy: 60,
      lastWorld: "w0"
    };
  }
  function loadProgress() {
    try {
      const p = JSON.parse(localStorage.getItem(GKEY));
      if (!p) return defaultProgress();
      const d = defaultProgress();
      const merged = Object.assign(d, p);
      merged.owned = Object.assign(d.owned, p.owned || {});
      merged.equipped = Object.assign(d.equipped, p.equipped || {});
      merged.chest = Object.assign(d.chest, p.chest || {});
      merged.daily = Object.assign(d.daily, p.daily || {});
      merged.readDays = p.readDays || {};
      if (merged.lightTotal < merged.light) merged.lightTotal = merged.light; // migration
      return merged;
    } catch (e) { return defaultProgress(); }
  }
  function today() { return new Date().toISOString().slice(0, 10); }
  function rollDaily() {
    if (progress.daily.date !== today()) {
      progress.daily = { date: today(), activities: 0, light: 0, claimed: false, arcadeSec: 0 };
    }
  }
  function arcadeTick(n) { rollDaily(); progress.daily.arcadeSec = (progress.daily.arcadeSec || 0) + n; saveProgress(progress); }
  function arcadeSecLeft() { rollDaily(); return 600 - (progress.daily.arcadeSec || 0); }
  function saveProgress(p) { localStorage.setItem(GKEY, JSON.stringify(p)); }

  let profile = loadProfile();
  let progress = loadProgress();

  /* --- אוֹר --- מרכז אחד שמוסיף אור + מעדכן יומי */
  function gainLight(n) {
    rollDaily();
    progress.light += n; progress.lightTotal += n; progress.daily.light += n;
  }
  function addLight(n) { gainLight(n); saveProgress(progress); checkMilestones(); }
  function spend(n) {
    if (progress.light < n) return false;
    progress.light -= n; saveProgress(progress); return true;
  }

  function markDone(id, lightReward) {
    const first = !progress.done[id];
    progress.done[id] = true;
    if (first) {
      rollDaily(); progress.daily.activities += 1;
      progress.happy = Math.min(100, (progress.happy || 60) + 4);  // לימוד משמח את נֵרִי
      if (lightReward) gainLight(lightReward);
    }
    saveProgress(progress);
    if (first) { touchStreak(); checkMilestones(); }
    return first;
  }
  function isDone(id) { return !!progress.done[id]; }
  function addWordsRead(n) { progress.wordsRead += n; saveProgress(progress); checkMilestones(); }

  /* --- משימה יומית --- */
  const MISSION = { activities: 2, light: 20, reward: 25 };
  function dailyMission() {
    rollDaily();
    const d = progress.daily;
    const met = d.activities >= MISSION.activities && d.light >= MISSION.light;
    return { goalA: MISSION.activities, goalL: MISSION.light,
             activities: d.activities, light: d.light, met, claimed: d.claimed, reward: MISSION.reward };
  }
  function claimMission() {
    const m = dailyMission();
    if (!m.met || m.claimed) return 0;
    progress.daily.claimed = true;
    gainLight(MISSION.reward);
    saveProgress(progress); checkMilestones();
    return MISSION.reward;
  }
  function readCombo(best) {
    if (best > (progress.bestCombo || 0)) { progress.bestCombo = best; saveProgress(progress); }
  }

  /* --- חנות --- */
  function owns(id) { return !!progress.owned[id]; }
  function buy(item) {
    if (owns(item.id)) return "owned";
    if (!spend(item.cost)) return "broke";
    progress.owned[item.id] = true;
    if (item.slot !== "furniture") equip(item);   // רהיט מופיע בחדר; השאר נלבש מיד
    saveProgress(progress); checkMilestones();
    return "ok";
  }
  function raiseHappy(n) { progress.happy = Math.min(100, (progress.happy || 60) + n); saveProgress(progress); }
  function equip(item) {
    progress.equipped[item.slot] = item.id;
    saveProgress(progress);
    UI && UI.applyBackground && UI.applyBackground();
  }
  function equipped(slot) { return progress.equipped[slot]; }
  function ownedCount() { return Object.keys(progress.owned).length; }

  /* --- דרגה --- */
  function rank() { return window.rankFor(progress.lightTotal); }
  function nextRank() { return window.nextRank(progress.lightTotal); }

  /* --- רֶצֶף יָמִים --- */
  function touchStreak() {
    const td = today();
    progress.readDays[td] = true;            // ללוח האור
    if (progress.streak.last === td) { saveProgress(progress); return; }
    const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    progress.streak.count = (progress.streak.last === yest) ? progress.streak.count + 1 : 1;
    progress.streak.last = td;
    saveProgress(progress);
  }

  /* --- תיבת אוצר יומית --- */
  function chestReady() {
    const today = new Date().toISOString().slice(0, 10);
    return progress.chest.last !== today;
  }
  function openChest() {
    progress.chest.last = today();
    const reward = 8 + Math.floor(Math.random() * 18); // 8–25 אור
    gainLight(reward);
    // 25% — גם פריט חינם שעוד אין לו
    let freeItem = null;
    if (Math.random() < 0.25) {
      const pool = window.SHOP_ALL.filter(x => !owns(x.id) && x.cost > 0 && x.cost <= 60);
      if (pool.length) { freeItem = pool[Math.floor(Math.random() * pool.length)]; progress.owned[freeItem.id] = true; }
    }
    saveProgress(progress); checkMilestones();
    return { light: reward, item: freeItem };
  }

  /* --- מדליות (רִגְעֵי גַּאֲוָה) --- */
  function storiesDone() { return Object.keys(progress.done).filter(k => k.startsWith("story-")).length; }
  const MILESTONES = [
    { id: "first-story",  test: p => storiesDone() >= 1,   title: "הַסִּפּוּר הָרִאשׁוֹן!", emoji: "📖", tier: "bronze" },
    { id: "stories-5",    test: p => storiesDone() >= 5,   title: "5 סִפּוּרִים!",        emoji: "📚", tier: "silver" },
    { id: "stories-10",   test: p => storiesDone() >= 10,  title: "10 סִפּוּרִים!",       emoji: "🏛️", tier: "gold" },
    { id: "100-words",    test: p => p.wordsRead >= 100,   title: "100 מִלִּים!",        emoji: "💯", tier: "bronze" },
    { id: "500-words",    test: p => p.wordsRead >= 500,   title: "500 מִלִּים!",        emoji: "🌟", tier: "silver" },
    { id: "1000-words",   test: p => p.wordsRead >= 1000,  title: "1,000 מִלִּים!",      emoji: "🏆", tier: "gold" },
    { id: "no-nikud",     test: p => Object.keys(p.done).some(k => k.startsWith("story-no-nikud")), title: "קְרִיאָה בְּלִי נִקּוּד!", emoji: "🦅", tier: "gold" },
    { id: "week-streak",  test: p => p.streak.count >= 7,  title: "שָׁבוּעַ הַתְמָדָה!",   emoji: "🔥", tier: "silver" },
    { id: "light-200",    test: p => p.lightTotal >= 200,  title: "200 אוֹר!",           emoji: "✨", tier: "bronze" },
    { id: "light-500",    test: p => p.lightTotal >= 500,  title: "500 אוֹר!",           emoji: "💫", tier: "silver" },
    { id: "light-1000",   test: p => p.lightTotal >= 1000, title: "1,000 אוֹר!",         emoji: "🌞", tier: "gold" },
    { id: "first-buy",    test: p => ownedCount() > 2,     title: "קְנִיָּה רִאשׁוֹנָה!",  emoji: "🛍️", tier: "bronze" },
    { id: "collector",    test: p => ownedCount() >= 7,    title: "אַסְפָן אָמִתִּי!",     emoji: "💎", tier: "silver" },
    { id: "fashionista",  test: p => ownedCount() >= 14,   title: "מְעַצֵּב הַלֶּהָבוֹת!", emoji: "🎨", tier: "gold" }
  ];
  let newlyEarned = [];
  function checkMilestones() {
    MILESTONES.forEach(m => {
      if (!progress.achievements.includes(m.id) && m.test(progress)) {
        progress.achievements.push(m.id); newlyEarned.push(m);
      }
    });
    saveProgress(progress);
  }
  function popMilestone() { return newlyEarned.shift(); }
  function milestoneById(id) { return MILESTONES.find(m => m.id === id); }
  function allMilestones() { return MILESTONES; }

  function reset() {
    localStorage.removeItem(PKEY); localStorage.removeItem(GKEY);
    profile = null; progress = defaultProgress(); newlyEarned = [];
  }

  /* --- לוח האור (יומן רצף) --- */
  function last14Days() {
    const out = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      out.push({ date: d, read: !!progress.readDays[d] });
    }
    return out;
  }

  return {
    get profile() { return profile; },
    setProfile(p) { profile = p; saveProfile(p); },
    get progress() { return progress; },
    saveProgress: () => saveProgress(progress),
    addLight, spend, markDone, isDone, addWordsRead, touchStreak,
    owns, buy, equip, equipped, ownedCount, raiseHappy,
    rank, nextRank, chestReady, openChest, storiesDone,
    dailyMission, claimMission, readCombo, last14Days, arcadeTick, arcadeSecLeft,
    popMilestone, milestoneById, allMilestones, reset,
    markRealWorld(id) { progress.realWorld[id] = true; addLight(3); }
  };
})();
