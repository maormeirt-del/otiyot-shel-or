/* ===========================================================
   אוֹתִיּוֹת שֶׁל אוֹר — מאגר האותיות
   כל אות: צורה, שם, צליל-פתיחה, מילת-דוגמה, אימוג'י
   הכל מנוקד. אין תלות חיצונית.
   =========================================================== */
window.LETTERS = [
  { ch: "א", name: "אָלֶף",  sound: "אַה",  example: "אַרְיֵה",  emoji: "🦁" },
  { ch: "ב", name: "בֵּית",  sound: "בּ",   example: "בַּיִת",   emoji: "🏠" },
  { ch: "ג", name: "גִּימֶל", sound: "גּ",  example: "גָּמָל",   emoji: "🐫" },
  { ch: "ד", name: "דָּלֶת", sound: "דּ",   example: "דֶּגֶל",   emoji: "🚩" },
  { ch: "ה", name: "הֵא",    sound: "הְ",   example: "הַר",      emoji: "⛰️" },
  { ch: "ו", name: "וָו",    sound: "וְ",   example: "וֶרֶד",    emoji: "🌹" },
  { ch: "ז", name: "זַיִן",  sound: "זְ",   example: "זְאֵב",    emoji: "🐺" },
  { ch: "ח", name: "חֵית",   sound: "חְ",   example: "חַלָּה",   emoji: "🍞" },
  { ch: "ט", name: "טֵית",   sound: "טְ",   example: "טַלִּית",  emoji: "🕊️" },
  { ch: "י", name: "יוֹד",   sound: "יְ",   example: "יֶלֶד",    emoji: "🧒" },
  { ch: "כ", name: "כַּף",   sound: "כּ",   example: "כֶּתֶר",   emoji: "👑" },
  { ch: "ל", name: "לָמֶד",  sound: "לְ",   example: "לֵב",      emoji: "❤️" },
  { ch: "מ", name: "מֵם",    sound: "מְ",   example: "מַיִם",    emoji: "💧" },
  { ch: "נ", name: "נוּן",   sound: "נְ",   example: "נֵר",      emoji: "🕯️" },
  { ch: "ס", name: "סָמֶךְ", sound: "סְ",   example: "סֵפֶר",    emoji: "📖" },
  { ch: "ע", name: "עַיִן",  sound: "עַה",  example: "עֵץ",      emoji: "🌳" },
  { ch: "פ", name: "פֵּא",   sound: "פּ",   example: "פֶּרַח",   emoji: "🌸" },
  { ch: "צ", name: "צָדִי",  sound: "צְ",   example: "צִפּוֹר",  emoji: "🐦" },
  { ch: "ק", name: "קוֹף",   sound: "קְ",   example: "קֶשֶׁת",   emoji: "🌈" },
  { ch: "ר", name: "רֵישׁ",  sound: "רְ",   example: "רַכֶּבֶת", emoji: "🚂" },
  { ch: "ש", name: "שִׁין",  sound: "שׁ",   example: "שֶׁמֶשׁ",  emoji: "☀️" },
  { ch: "ת", name: "תָּו",   sound: "תּ",   example: "תּוֹרָה",  emoji: "📜" }
];

/* חמש אותיות סופיות — לשלב מתקדם */
window.FINAL_LETTERS = [
  { ch: "ך", base: "כ", name: "כַף סוֹפִית" },
  { ch: "ם", base: "מ", name: "מֵם סוֹפִית" },
  { ch: "ן", base: "נ", name: "נוּן סוֹפִית" },
  { ch: "ף", base: "פ", name: "פֵּא סוֹפִית" },
  { ch: "ץ", base: "צ", name: "צָדִי סוֹפִית" }
];

/* ניקוד הבסיס להוראת הברות */
window.NIKUD = [
  { mark: "ַ",  name: "פַּתָּח",  vowel: "a", demo: "בַ" },
  { mark: "ָ",  name: "קָמָץ",   vowel: "a", demo: "בָ" },
  { mark: "ֵ",  name: "צֵירֶה",  vowel: "e", demo: "בֵ" },
  { mark: "ֶ",  name: "סֶגּוֹל",  vowel: "e", demo: "בֶ" },
  { mark: "ִ",  name: "חִירִיק", vowel: "i", demo: "בִ" },
  { mark: "ֹ",  name: "חוֹלָם",  vowel: "o", demo: "בֹ" },
  { mark: "ֻ",  name: "קֻבּוּץ",  vowel: "u", demo: "בֻ" },
  { mark: "ְ",  name: "שְׁוָא",   vowel: "",  demo: "בְ" }
];
