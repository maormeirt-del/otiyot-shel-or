/* ===========================================================
   אוֹתִיּוֹת שֶׁל אוֹר — מסלול הלימוד ("מַסַּע הָאוֹר")
   6 עולמות. כל עולם = תחנה במפה. בכל עולם פעילויות.
   הפעילויות נבנות דינמית מהמאגרים (letters/words/stories).
   =========================================================== */
window.CURRICULUM = {
  worlds: [
    {
      id: "w0", title: "עוֹלַם הָאוֹתִיּוֹת", icon: "🔤", level: 0,
      subtitle: "מַכִּירִים אֶת כָּל הָאוֹתִיּוֹת",
      build: () => window.LETTERS.map((l, i) => ({
        id: "letter-" + l.ch, type: "letter", title: l.name, data: l
      }))
    },
    {
      id: "w1", title: "עוֹלַם הַנִּקּוּד", icon: "🎵", level: 1,
      subtitle: "אוֹת + נִקּוּד = הֲבָרָה",
      build: () => {
        const bases = ["ב", "ל", "מ", "ש", "ר", "נ", "ת"];
        return bases.map(b => ({
          id: "syl-" + b, type: "syllable", title: "הֲבָרוֹת שֶׁל " + b, data: { base: b }
        }));
      }
    },
    {
      id: "w2", title: "עוֹלַם הַמִּלִּים הַקְּצָרוֹת", icon: "📝", level: 2,
      subtitle: "קוֹרְאִים מִלִּים שְׁלֵמוֹת",
      build: () => chunk(window.WORDS.filter(w => w.level === 2), 6).map((grp, i) => ({
        id: "words2-" + i, type: "word", title: "מִלִּים — חֵלֶק " + (i + 1), data: { words: grp }
      }))
    },
    {
      id: "w3", title: "עוֹלַם הַמִּלִּים הַגְּדוֹלוֹת", icon: "📚", level: 3,
      subtitle: "מִלִּים אֲרֻכּוֹת וְעֶרְכִּיּוֹת",
      build: () => chunk(window.WORDS.filter(w => w.level === 3), 6).map((grp, i) => ({
        id: "words3-" + i, type: "word", title: "מִלִּים — חֵלֶק " + (i + 1), data: { words: grp }
      }))
    },
    {
      id: "w4", title: "עוֹלַם הַסִּפּוּרִים", icon: "📖", level: 4,
      subtitle: "קוֹרְאִים סִפּוּר שָׁלֵם עִם מִדָּה",
      build: () => window.STORIES.filter(s => s.level === 4).map(s => ({
        id: "story-" + s.id, type: "story", title: s.title, data: s
      }))
    },
    {
      id: "w5", title: "עוֹלַם הַקְּרִיאָה הַחָפְשִׁית", icon: "🦅", level: 5,
      subtitle: "סִפּוּרִים בְּלִי נִקּוּד — קוֹרְאִים לְבַד!",
      build: () => window.STORIES.filter(s => s.level === 5).map(s => ({
        id: "story-" + s.id, type: "story", title: s.title, data: s
      }))
    },
    {
      id: "w6", title: "עוֹלַם הַסִּפּוּרִים הָאֲרֻכִּים", icon: "📚", level: 6,
      subtitle: "סִפּוּרִים גְּדוֹלִים — הַרְבֵּה יוֹתֵר אוֹר! ✨",
      build: () => window.STORIES.filter(s => s.level === 6).map(s => ({
        id: "story-" + s.id, type: "story", title: s.title, data: s
      }))
    }
  ]
};

/* עזר: חיתוך מערך לקבוצות */
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

/* מַשִּׂימוֹת "קְרִיאָה בָּעוֹלָם הָאֲמִיתִּי" — גֶּשֶׁר אֶל מִחוּץ לַמָּסָךְ */
window.REAL_WORLD_TASKS = [
  { id: "rw1", emoji: "🏠", text: "מִצְאוּ בַּבַּיִת מִלָּה שֶׁמַּתְחִילָה בָּאוֹת בּ." },
  { id: "rw2", emoji: "🪧", text: "בַּדֶּרֶךְ, חַפְּשׂוּ שֶׁלֶט עִם הָאוֹת שׁ." },
  { id: "rw3", emoji: "📖", text: "בַּקְּשׁוּ מֵאַבָּא אוֹ אִמָּא לִבְחֹר מִלָּה אַחַת מִסֵּפֶר וְלִקְרֹא אוֹתָהּ." },
  { id: "rw4", emoji: "🥫", text: "מִצְאוּ בַּמִּטְבָּח אֲרִיזָה, וְנַסּוּ לִקְרֹא אֶת הַשֵּׁם שֶׁעָלֶיהָ." },
  { id: "rw5", emoji: "🚗", text: "בַּנְּסִיעָה, קִרְאוּ מִסְפָּר אֶחָד מֵעַל חֲנוּת." },
  { id: "rw6", emoji: "🕯️", text: "בְּעֶרֶב שַׁבָּת, קִרְאוּ בְּקוֹל אֶת הַמִּלָּה 'שַׁבָּת'." },
  { id: "rw7", emoji: "👵", text: "סַפְּרוּ לְסַבָּא אוֹ סַבְתָּא סִפּוּר שֶׁקְּרָאתֶם הַיּוֹם." }
];
