/* ===========================================================
   חנות האור + דרגות. הילד קונה אביזרים לנֵרִי בנקודות אוֹר.
   slot: צבע-להבה / כובע / חבר / רקע. אפשר להחזיק רבים, ללבוש אחד לכל slot.
   =========================================================== */
window.SHOP = {
  /* צבעי להבה — משנים את צבע נֵרִי */
  colors: [
    { id: "c-gold",    name: "זָהָב",    cost: 0,   stops: ["#fff6cf", "#ffd24a", "#ff8a1f"], free: true },
    { id: "c-blue",    name: "תְּכֵלֶת",  cost: 30,  stops: ["#e8f6ff", "#7cc8ff", "#2e7fd6"] },
    { id: "c-green",   name: "יָרֹק",     cost: 30,  stops: ["#eaffe8", "#8fe87c", "#2eae5a"] },
    { id: "c-purple",  name: "סָגֹל",     cost: 45,  stops: ["#f6e8ff", "#c89cff", "#8a4fd6"] },
    { id: "c-pink",    name: "וָרֹד",     cost: 45,  stops: ["#ffe8f3", "#ff9cc8", "#e64f9a"] },
    { id: "c-rainbow", name: "קֶשֶׁת",    cost: 120, stops: ["#ffd24a", "#7cc8ff", "#ff6fae"], rainbow: true },
    { id: "c-fire",    name: "אֵשׁ",     cost: 60,  stops: ["#fff0c0", "#ff8a3c", "#e2342f"] },
    { id: "c-aqua",    name: "אַקְוָה",   cost: 60,  stops: ["#e8fffb", "#7cf0e0", "#16b0a0"] },
    { id: "c-royal",   name: "מַלְכוּתִי", cost: 80,  stops: ["#fff0fb", "#d49cff", "#7a2fd6"] }
  ],
  /* כובעים — אימוג'י מעל הלהבה */
  hats: [
    { id: "h-crown",  name: "כֶּתֶר",       cost: 60,  emoji: "👑" },
    { id: "h-kippa",  name: "כִּפָּה",      cost: 25,  emoji: "🧢" },
    { id: "h-grad",   name: "כּוֹבַע סִיּוּם", cost: 50, emoji: "🎓" },
    { id: "h-party",  name: "כּוֹבַע מְסִבָּה", cost: 35, emoji: "🎉" },
    { id: "h-star",   name: "כּוֹכָב",      cost: 40,  emoji: "⭐" },
    { id: "h-flower", name: "פֶּרַח",       cost: 30,  emoji: "🌸" },
    { id: "h-glasses", name: "מִשְׁקָפַיִם", cost: 30, emoji: "👓" },
    { id: "h-bow",    name: "פַּפְיוֹן",    cost: 25,  emoji: "🎀" },
    { id: "h-scarf",  name: "צָעִיף",       cost: 30,  emoji: "🧣" },
    { id: "h-tophat", name: "מִגְבַּעַת",    cost: 45,  emoji: "🎩" },
    { id: "h-cowboy", name: "כּוֹבַע בּוֹקֵר", cost: 45, emoji: "🤠" },
    { id: "h-wings",  name: "כְּנָפַיִם",    cost: 75,  emoji: "🪽" }
  ],
  /* חברים — חיית מחמד קטנה ליד נֵרִי */
  pets: [
    { id: "p-dog",  name: "כַּלְבְּלָב",  cost: 70,  emoji: "🐶" },
    { id: "p-cat",  name: "חֲתַלְתּוּל",  cost: 70,  emoji: "🐱" },
    { id: "p-bird", name: "צִפּוֹר",      cost: 55,  emoji: "🐦" },
    { id: "p-fish", name: "דָּגִיג",      cost: 55,  emoji: "🐠" },
    { id: "p-bfly", name: "פַּרְפַּר",    cost: 65,  emoji: "🦋" },
    { id: "p-turtle", name: "צָב",        cost: 60,  emoji: "🐢" }
  ],
  /* רקעים — רקע מסך הבית */
  backgrounds: [
    { id: "bg-cream",  name: "אוֹר יוֹם",   cost: 0,  free: true, css: "radial-gradient(1200px 600px at 50% -10%,#fffdf6,#fff8ec)" },
    { id: "bg-night",  name: "שָׁמַיִם",     cost: 50, css: "linear-gradient(160deg,#1a2a5e,#3a5ba0 70%,#6a85c0)" },
    { id: "bg-sea",    name: "יָם",         cost: 50, css: "linear-gradient(160deg,#bdeaff,#7cc8ff 70%,#4fa8e6)" },
    { id: "bg-garden", name: "גַּן פּוֹרֵחַ", cost: 60, css: "linear-gradient(160deg,#eaffe0,#bdf0a0 70%,#8fd87c)" },
    { id: "bg-sunset", name: "שְׁקִיעָה",    cost: 60, css: "linear-gradient(160deg,#ffe9c0,#ffb36b 60%,#ff8a6b)" }
  ],
  /* חפצים שנֵרִי מחזיק */
  props: [
    { id: "pr-book",    name: "סֵפֶר",        cost: 25, emoji: "📖" },
    { id: "pr-balloon", name: "בָּלוֹן",       cost: 25, emoji: "🎈" },
    { id: "pr-ball",    name: "כַּדּוּר",      cost: 30, emoji: "⚽" },
    { id: "pr-flower",  name: "פֶּרַח",        cost: 25, emoji: "🌷" },
    { id: "pr-wand",    name: "שַׁרְבִיט קֶסֶם", cost: 55, emoji: "🪄" },
    { id: "pr-flag",    name: "דֶּגֶל",        cost: 30, emoji: "🚩" },
    { id: "pr-icecream",name: "גְּלִידָה",      cost: 30, emoji: "🍦" },
    { id: "pr-teddy",   name: "דֻּבִּי",       cost: 45, emoji: "🧸" }
  ],
  /* רהיטים לחדר של נֵרִי — כל פריט שקונים מופיע בחדר */
  furniture: [
    { id: "fn-bed",    name: "מִטָּה",            cost: 40, emoji: "🛏️", pos: { bottom: "7%",  left: "6%"  } },
    { id: "fn-table",  name: "שֻׁלְחָן",           cost: 35, emoji: "🪑", pos: { bottom: "7%",  right: "8%" } },
    { id: "fn-shelf",  name: "כּוֹנְנִית סְפָרִים", cost: 50, emoji: "📚", pos: { top: "12%",   left: "7%"  } },
    { id: "fn-plant",  name: "עָצִיץ",            cost: 30, emoji: "🪴", pos: { bottom: "7%",  left: "40%" } },
    { id: "fn-lamp",   name: "מְנוֹרָה",           cost: 35, emoji: "💡", pos: { top: "9%",    right: "10%"} },
    { id: "fn-picture",name: "תְּמוּנָה",          cost: 30, emoji: "🖼️", pos: { top: "10%",   left: "40%" } },
    { id: "fn-rug",    name: "שָׁטִיחַ",           cost: 30, emoji: "🟫", pos: { bottom: "3%",  left: "33%" } },
    { id: "fn-window", name: "חַלּוֹן",            cost: 40, emoji: "🪟", pos: { top: "9%",    left: "22%" } },
    { id: "fn-clock",  name: "שָׁעוֹן",            cost: 30, emoji: "🕐", pos: { top: "8%",    left: "60%" } },
    { id: "fn-tv",     name: "מָסָךְ",             cost: 60, emoji: "📺", pos: { top: "28%",   right: "8%" } },
    { id: "fn-cake",   name: "עוּגָה",            cost: 35, emoji: "🎂", pos: { bottom: "8%",  left: "58%" } },
    { id: "fn-toys",   name: "אַרְגַּז צַעֲצוּעִים", cost: 40, emoji: "🪀", pos: { bottom: "8%", right: "32%" } }
  ]
};

/* כל הפריטים בערימה אחת לחיפוש לפי id */
window.SHOP_ALL = []
  .concat(window.SHOP.colors.map(x => ({ ...x, slot: "color" })))
  .concat(window.SHOP.hats.map(x => ({ ...x, slot: "hat" })))
  .concat(window.SHOP.pets.map(x => ({ ...x, slot: "pet" })))
  .concat(window.SHOP.props.map(x => ({ ...x, slot: "prop" })))
  .concat(window.SHOP.backgrounds.map(x => ({ ...x, slot: "bg" })))
  .concat(window.SHOP.furniture.map(x => ({ ...x, slot: "furniture" })));

window.shopItem = id => window.SHOP_ALL.find(x => x.id === id);

/* ----- דרגות אוֹר ----- מניצוץ ועד שמש */
window.RANKS = [
  { id: "spark",      name: "נִיצוֹץ",    emoji: "✨", min: 0 },
  { id: "candle",     name: "נֵר",        emoji: "🕯️", min: 60 },
  { id: "torch",      name: "לַפִּיד",    emoji: "🔥", min: 160 },
  { id: "lantern",    name: "פָּנָס",     emoji: "🏮", min: 320 },
  { id: "menorah",    name: "מְנוֹרָה",   emoji: "🕎", min: 550 },
  { id: "lighthouse", name: "מִגְדַּלּוֹר", emoji: "🗼", min: 850 },
  { id: "sun",        name: "שֶׁמֶשׁ",    emoji: "☀️", min: 1300 }
];
window.rankFor = total => {
  let r = window.RANKS[0];
  for (const x of window.RANKS) if (total >= x.min) r = x;
  return r;
};
window.nextRank = total => window.RANKS.find(x => x.min > total) || null;
