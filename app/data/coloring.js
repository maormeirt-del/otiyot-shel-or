/* ===========================================================
   סטודיו צביעה — ציורי קו מקוריים (לא מוגן זכויות יוצרים).
   כל אזור עם class="fillable" נצבע בלחיצה. אפס תלות.
   =========================================================== */
window.COLORING = [
  {
    id: "cat", name: "חָתוּל", word: "חתול",
    svg: `<svg viewBox="0 0 220 220" class="cpic">
      <path class="fillable" d="M58 70 L74 28 L100 62 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <path class="fillable" d="M162 70 L146 28 L120 62 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="110" cy="185" rx="56" ry="30" fill="#fff" stroke="#444" stroke-width="3"/>
      <circle class="fillable" cx="110" cy="100" r="58" fill="#fff" stroke="#444" stroke-width="3"/>
      <circle cx="90" cy="92" r="7" fill="#333"/><circle cx="130" cy="92" r="7" fill="#333"/>
      <path class="fillable" d="M103 104 L117 104 L110 114 Z" fill="#fff" stroke="#444" stroke-width="2"/>
      <path d="M96 116 Q110 130 124 116" stroke="#444" stroke-width="3" fill="none" stroke-linecap="round"/>
      <line x1="55" y1="100" x2="82" y2="104" stroke="#444" stroke-width="2"/>
      <line x1="55" y1="112" x2="82" y2="112" stroke="#444" stroke-width="2"/>
      <line x1="138" y1="104" x2="165" y2="100" stroke="#444" stroke-width="2"/>
      <line x1="138" y1="112" x2="165" y2="112" stroke="#444" stroke-width="2"/></svg>`
  },
  {
    id: "car", name: "מְכוֹנִית", word: "מכונית",
    svg: `<svg viewBox="0 0 240 180" class="cpic">
      <path class="fillable" d="M25 125 L52 75 L150 75 L188 108 L215 112 L215 125 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <path class="fillable" d="M70 80 L96 80 L96 102 L58 102 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <path class="fillable" d="M106 80 L142 80 L165 102 L106 102 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <circle class="fillable" cx="75" cy="128" r="23" fill="#fff" stroke="#444" stroke-width="3"/>
      <circle class="fillable" cx="168" cy="128" r="23" fill="#fff" stroke="#444" stroke-width="3"/>
      <circle cx="75" cy="128" r="8" fill="#333"/><circle cx="168" cy="128" r="8" fill="#333"/></svg>`
  },
  {
    id: "flower", name: "פֶּרַח", word: "פרח",
    svg: `<svg viewBox="0 0 200 230" class="cpic">
      <rect class="fillable" x="93" y="105" width="14" height="95" fill="#fff" stroke="#444" stroke-width="3"/>
      <path class="fillable" d="M104 160 Q150 148 152 188 Q108 192 100 165 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="100" cy="55" rx="22" ry="32" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="100" cy="125" rx="22" ry="32" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="55" cy="90" rx="32" ry="22" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="145" cy="90" rx="32" ry="22" fill="#fff" stroke="#444" stroke-width="3"/>
      <circle class="fillable" cx="100" cy="90" r="24" fill="#fff" stroke="#444" stroke-width="3"/></svg>`
  },
  {
    id: "butterfly", name: "פַּרְפַּר", word: "פרפר",
    svg: `<svg viewBox="0 0 230 200" class="cpic">
      <ellipse class="fillable" cx="72" cy="68" rx="42" ry="36" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="158" cy="68" rx="42" ry="36" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="78" cy="138" rx="34" ry="30" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="152" cy="138" rx="34" ry="30" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="115" cy="105" rx="11" ry="48" fill="#fff" stroke="#444" stroke-width="3"/>
      <line x1="115" y1="62" x2="100" y2="38" stroke="#444" stroke-width="3" stroke-linecap="round"/>
      <line x1="115" y1="62" x2="130" y2="38" stroke="#444" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: "fish", name: "דָּג", word: "דג",
    svg: `<svg viewBox="0 0 240 180" class="cpic">
      <path class="fillable" d="M170 90 L218 52 L218 128 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <ellipse class="fillable" cx="105" cy="90" rx="72" ry="46" fill="#fff" stroke="#444" stroke-width="3"/>
      <path class="fillable" d="M88 48 L122 42 L110 76 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <circle cx="65" cy="80" r="8" fill="#333"/>
      <path d="M48 102 Q66 114 84 102" stroke="#444" fill="none" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: "flame", name: "נֵרִי", word: "נרי",
    svg: `<svg viewBox="0 0 160 230" class="cpic">
      <rect class="fillable" x="56" y="160" width="48" height="55" rx="8" fill="#fff" stroke="#444" stroke-width="3"/>
      <path class="fillable" d="M80 18 C116 65 122 96 106 132 C100 150 91 160 80 160 C69 160 60 150 54 132 C38 96 44 65 80 18 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <circle cx="70" cy="96" r="5" fill="#333"/><circle cx="90" cy="96" r="5" fill="#333"/>
      <path d="M68 110 Q80 120 92 110" stroke="#444" fill="none" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: "house", name: "בַּיִת", word: "בית",
    svg: `<svg viewBox="0 0 220 200" class="cpic">
      <rect class="fillable" x="50" y="92" width="120" height="90" fill="#fff" stroke="#444" stroke-width="3"/>
      <path class="fillable" d="M38 94 L110 35 L182 94 Z" fill="#fff" stroke="#444" stroke-width="3"/>
      <rect class="fillable" x="95" y="128" width="32" height="54" fill="#fff" stroke="#444" stroke-width="3"/>
      <rect class="fillable" x="60" y="108" width="28" height="28" fill="#fff" stroke="#444" stroke-width="3"/>
      <rect class="fillable" x="132" y="108" width="28" height="28" fill="#fff" stroke="#444" stroke-width="3"/></svg>`
  },
  {
    id: "balloon", name: "בָּלוֹן", word: "בלון",
    svg: `<svg viewBox="0 0 160 230" class="cpic">
      <ellipse class="fillable" cx="80" cy="82" rx="56" ry="66" fill="#fff" stroke="#444" stroke-width="3"/>
      <path class="fillable" d="M72 146 L88 146 L80 162 Z" fill="#fff" stroke="#444" stroke-width="2"/>
      <path d="M80 162 Q98 190 74 215" stroke="#444" fill="none" stroke-width="2"/></svg>`
  },
  {
    id: "star", name: "כּוֹכָב", word: "כוכב",
    svg: `<svg viewBox="0 0 220 210" class="cpic">
      <path class="fillable" d="M110 15 L138 80 L208 86 L155 132 L172 200 L110 162 L48 200 L65 132 L12 86 L82 80 Z" fill="#fff" stroke="#444" stroke-width="3"/></svg>`
  }
];
