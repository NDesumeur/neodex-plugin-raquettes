// Raquettes : Un duel de raquettes contre l'ordinateur, sur un terrain de nuit. Le premier à 7 points gagne ; la balle accélère à chaque échange.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Raquettes</span><span class="hint">Souris ou ↑ ↓ · à deux : Z S à gauche, ↑ ↓ à droite · espace : commencer · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="320" height="200"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="rqFs">PLEIN ÉCRAN</button></div>
      <label class="row">Adversaire <select id="rqLvl" class="f"><option value="0">Facile</option><option value="1">Normal</option><option value="2">Difficile</option><option value="duo">2 joueurs</option></select></label>
      <div class="hint">Le bord de la raquette renvoie la balle en biais, le centre la renvoie droite.</div><div class="hint">La balle accélère à chaque échange : les longs échanges sont les plus durs.</div>
      <div class="hint">Frappe en bougeant ta raquette : la balle prend de l'effet et tourne en l'air.</div><div class="hint">Les bonus au milieu vont à celui qui a frappé la balle en dernier : raquette plus grande (une barre) ou deuxième balle (deux points).</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 480px;min-width:min(100%,320px);position:relative}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 320 / 200));max-width:none}
.gameBox canvas{image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(280px,calc((100vh - 170px) * 320 / 200)));height:auto;aspect-ratio:320/200}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "RAQUETTES", T: {"k": "#050c06", "k2": "#0c1a0e", "fill": "#142a18", "fillOn": "#1c3a22", "hl": "#24482a", "line": "#3a6a40", "acc": "#3fe0ff", "accL": "#c8f8ff", "accS": "#1a9ac0", "accD": "#06304a", "rivet": "#c8f8ff", "btn": "#24482a", "btnHi": "#5a9a5a", "btnLo": "#0c1a0e", "btnHov": "#2a5430", "btnHovHi": "#7aba7a", "text": "#f0fff0", "muted": "#b0d0a8", "acc2": "#ff4fa8", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#060e08", "bgDot": "#142a18", "bgDot2": "#0c1a0e", "spark": "#3a6a40", "spark2": "#ff4fa8", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", "kk........kk", "ka........bk", "ka........bk", "ka...kk...bk", "ka..kwwk..bk", "ka..kwwk..bk", "ka...kk...bk", "ka........bk", "ka........bk", "kk........kk", "............"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"], [/^PLEIN/, "full"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 320, H = 200, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Raquettes : un duel de raquettes contre l'ordinateur, sur un terrain de nuit. Le premier à 7 points gagne ; la balle accélère à chaque échange. ---------- */
const RQ = {PH: 26, PW: 4, LX: 14, RX: 302, TOP: 18, BOT: 190, WIN: 7};
const RQ_AI = [{n: 'Facile', sp: 1.6, err: 18, react: .45}, {n: 'Normal', sp: 2.4, err: 10, react: .6}, {n: 'Difficile', sp: 3.4, err: 4, react: .8}];
const rqs = gstore('raquettes', {lvl: 1, wins: 0, games: 0});
let rq = null;
function rqNew() { rq = Object.assign(rq || {tick: 0, raf: 0}, {mode: 'ready', me: 0, ai: 0, py: 104, ay: 104, ball: null, serve: 1, keys: {}, my: null, trail: [], flash: 0, endAt: 0, rally: 0, best: 0,
  duo: !!rqs.duo, extra: null, item: null, itemAt: 420, bigL: 0, bigR: 0, pv: 0, av: 0, aiErr: 0}); rqServe(); rqInfo(); }
function rqServe() { const d = rq.serve; rq.ball = {x: W / 2, y: (RQ.TOP + RQ.BOT) / 2, vx: 2.2 * d, vy: (Math.random() - .5) * 2.4, wait: 50, spin: 0, last: 0}; rq.extra = null; rq.rally = 0; rq.aim = rq.ball.y; }
const rqPH = dir => RQ.PH * ((dir > 0 ? rq.bigL : rq.bigR) > 0 ? 1.6 : 1);  // dir 1 : la raquette de gauche, -1 : celle de droite
function rqPaddle(b, x, y, dir, ph, vel) {  // la balle rebondit plus en biais quand elle touche le bord de la raquette ; une raquette qui bouge lui donne de l'effet
  if (b.y < y - ph / 2 - 2 || b.y > y + ph / 2 + 2) return false;
  const off = Math.max(-1, Math.min(1, (b.y - y) / (ph / 2))), sp = Math.min(6.5, Math.hypot(b.vx, b.vy) + .18);
  const a = off * 1.0; b.vx = Math.cos(a) * sp * dir; b.vy = Math.sin(a) * sp; b.x = x + dir * (RQ.PW + 3); rq.rally++; rq.best = Math.max(rq.best, rq.rally);
  b.spin = Math.max(-1, Math.min(1, (vel || 0) / 3.6)); b.last = dir; if (dir > 0 && RQ_AI[rqs.lvl]) rq.aiErr = (Math.random() - .5) * RQ_AI[rqs.lvl].err * 2;
  beep(dir > 0 ? 520 : 440, .04, 'square', 0, .06); rq.flash = 4; return true;
}
function rqUpdate() {
  const b = rq.ball, ai = RQ_AI[rqs.lvl];
  // ta raquette : souris (directe) ou flèches
  const py0 = rq.py, ay0 = rq.ay;
  if (rq.my != null) rq.py += (rq.my - rq.py) * .5; else rq.py += (rq.keys.down ? 3.6 : 0) - (rq.keys.up ? 3.6 : 0);
  rq.py = Math.max(RQ.TOP + rqPH(1) / 2, Math.min(RQ.BOT - rqPH(1) / 2, rq.py)); rq.pv = rq.py - py0;
  if (rq.bigL > 0) rq.bigL--; if (rq.bigR > 0) rq.bigR--;
  if (rq.item && --rq.item.t <= 0) rq.item = null;
  if (!rq.item && !(b.wait > 0) && --rq.itemAt <= 0) { rq.item = {x: W / 2 + (Math.random() - .5) * 80, y: RQ.TOP + 20 + Math.random() * (RQ.BOT - RQ.TOP - 40), k: Math.random() < .5 ? 'big' : 'multi', t: 600}; rq.itemAt = 420 + Math.random() * 300; }
  if (rq.duo) { rq.ay += (rq.keys.down2 ? 3.6 : 0) - (rq.keys.up2 ? 3.6 : 0); rq.ay = Math.max(RQ.TOP + rqPH(-1) / 2, Math.min(RQ.BOT - rqPH(-1) / 2, rq.ay)); rq.av = rq.ay - ay0; }
  else rqAI(b, ai, ay0);
  if (b.wait > 0) { b.wait--; return; }
  if (rqMove(b)) return; if (rq.extra && rqMove(rq.extra)) return;
  rq.trail.push([b.x, b.y]); if (rq.trail.length > 6) rq.trail.shift(); if (rq.flash) rq.flash--;
}
function rqAI(b, ai, ay0) {
  // l'ordinateur : il prévoit où la balle arrive (rebonds compris), avec une petite erreur, et ne réagit qu'à une partie du terrain
  const tg = [b, rq.extra].filter(q => q && q.vx > 0).sort((p, q) => q.x - p.x)[0];
  if (tg && tg.x > W * (1 - ai.react)) { if (rq.aimBall !== tg || rq.tick % 8 === 0) { let {x, y, vy, spin = 0} = tg; for (let i = 0; i < 900 && x < RQ.RX; i++) { vy = Math.max(-5, Math.min(5, vy + spin * .02)); spin *= .995; x += tg.vx / 3; y += vy / 3; if (y < RQ.TOP + 3 || y > RQ.BOT - 3) vy = -vy; } rq.aim = y + rq.aiErr; rq.aimBall = tg; } }
  else if (!tg) rq.aim = (RQ.TOP + RQ.BOT) / 2;
  rq.ay += Math.max(-ai.sp, Math.min(ai.sp, rq.aim - rq.ay)); rq.ay = Math.max(RQ.TOP + rqPH(-1) / 2, Math.min(RQ.BOT - rqPH(-1) / 2, rq.ay)); rq.av = rq.ay - ay0;
}
function rqTake(b) {  // le bonus va à celui qui a frappé la balle en dernier
  const it = rq.item; rq.item = null; beep(990, .15, 'triangle', 1480, .07);
  if (it.k === 'big') { if (b.last > 0) rq.bigL = 600; else rq.bigR = 600; }
  else if (!rq.extra) rq.extra = {x: b.x, y: b.y, vx: b.vx, vy: -b.vy || 1.5, spin: 0, last: b.last, wait: 0};
}
function rqMove(b) {  // une balle avance ; vrai si elle a donné un point
  for (let s = 0; s < 3; s++) {
    if (b.spin) { b.vy = Math.max(-5, Math.min(5, b.vy + b.spin * .02)); b.spin *= .995; }
    b.x += b.vx / 3; b.y += b.vy / 3;
    if (b.y < RQ.TOP + 3) { b.y = RQ.TOP + 3; b.vy = Math.abs(b.vy); beep(300, .02, 'square', 0, .04); } if (b.y > RQ.BOT - 3) { b.y = RQ.BOT - 3; b.vy = -Math.abs(b.vy); beep(300, .02, 'square', 0, .04); }
    if (b.vx < 0 && b.x <= RQ.LX + RQ.PW + 2 && b.x > RQ.LX - 2) rqPaddle(b, RQ.LX, rq.py, 1, rqPH(1), rq.pv);
    if (b.vx > 0 && b.x >= RQ.RX - 2 && b.x < RQ.RX + RQ.PW + 2) rqPaddle(b, RQ.RX, rq.ay, -1, rqPH(-1), rq.av);
    if (rq.item && b.last && Math.abs(b.x - rq.item.x) < 7 && Math.abs(b.y - rq.item.y) < 7) rqTake(b);
    if (b.x < -6 || b.x > W + 6) { const meWon = b.x > W; if (meWon) rq.me++; else rq.ai++; rq.serve = meWon ? -1 : 1; beep(meWon ? 880 : 180, .2, 'triangle', meWon ? 1320 : 90, .07); rq.point = {me: meWon, t: rq.tick};
      if (rq.me >= RQ.WIN || rq.ai >= RQ.WIN) { rq.mode = 'over'; rq.endAt = rq.tick; rqs.games++; if (rq.duo) { rqs.games--; rqs.duoGames = (rqs.duoGames || 0) + 1; } else { if (rq.me > rq.ai) rqs.wins++; best('raquettes' + rqs.lvl, rq.me - rq.ai); } saveGames(); rqInfo(); } else rqServe(); return true; }
  }
  return false;
}
const RQ_BG = cnv(W, H, b => {  // un terrain de nuit : gazon tramé, lignes blanches, filet en pointillés
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(b, y < RQ.TOP || y > RQ.BOT ? '#05010b' : (Math.floor(x / 20) % 2 ? '#1a4a2a' : '#1e5430'), x, y);
  px(b, '#c8e8c8', 6, RQ.TOP, W - 12, 1); px(b, '#c8e8c8', 6, RQ.BOT, W - 12, 1); for (let y = RQ.TOP + 3; y < RQ.BOT; y += 8) px(b, '#c8e8c8', W / 2 - 1, y, 2, 4);
  for (let y = RQ.TOP; y < RQ.BOT; y++) if ((y >> 1) % 2) { px(b, '#2a6a3a', 6, y, 1, 1); px(b, '#2a6a3a', W - 7, y, 1, 1); }
});
const RQ_DIG = {0: '###|#.#|#.#|#.#|###', 1: '.#.|##.|.#.|.#.|###', 2: '###|..#|###|#..|###', 3: '###|..#|###|..#|###', 4: '#.#|#.#|###|..#|..#', 5: '###|#..|###|..#|###', 6: '###|#..|###|#.#|###', 7: '###|..#|..#|..#|..#'};
const rqDigit = (n, x, y, col) => RQ_DIG[n].split('|').forEach((r, j) => [...r].forEach((c, i) => { if (c === '#') px(g, col, x + i * 4, y + j * 4, 4, 4); }));
function rqPad(x, y, col, hi, ph = RQ.PH) { ph = Math.round(ph); px(g, '#05010b', x - 1, y - ph / 2 - 1, RQ.PW + 2, ph + 2); px(g, col, x, y - ph / 2, RQ.PW, ph); px(g, hi, x, y - ph / 2, 1, ph); px(g, '#ffffff', x + 1, y - 1, RQ.PW - 2, 2); }
function rqDraw() {
  g.drawImage(RQ_BG, 0, 0);
  rqDigit(Math.min(7, rq.me), W / 2 - 34, 26, '#3a8a4a'); rqDigit(Math.min(7, rq.ai), W / 2 + 22, 26, '#3a8a4a');
  rqPad(RQ.LX, Math.round(rq.py), '#3fe0ff', '#c8f8ff', rqPH(1)); rqPad(RQ.RX, Math.round(rq.ay), '#ff4fa8', '#ffb0d8', rqPH(-1));
  if (rq.item && (rq.item.t > 120 || (rq.tick >> 3) % 2)) { const {x, y, k} = rq.item, X = Math.round(x) - 5, Y = Math.round(y) - 5; px(g, '#05010b', X - 1, Y - 1, 12, 12); px(g, '#ffd84a', X, Y, 10, 10); px(g, '#a8780a', X + 1, Y + 1, 8, 8);
    if (k === 'big') px(g, '#ffffff', X + 4, Y + 2, 2, 6); else { px(g, '#ffffff', X + 2, Y + 4, 2, 2); px(g, '#ffffff', X + 6, Y + 4, 2, 2); } }
  for (const q of [rq.extra]) if (q) { px(g, '#05010b', q.x - 3, q.y - 2, 6, 4); px(g, '#05010b', q.x - 2, q.y - 3, 4, 6); px(g, '#9affb0', q.x - 2, q.y - 2, 4, 4); px(g, '#ffffff', q.x - 2, q.y - 2, 1, 1); }
  const b = rq.ball; rq.trail.forEach(([x, y], i) => { g.globalAlpha = i / 12; px(g, '#fff4a0', x - 1, y - 1, 3, 3); g.globalAlpha = 1; });
  if (!(b.wait > 0 && Math.floor(b.wait / 6) % 2)) { px(g, '#05010b', b.x - 3, b.y - 2, 6, 4); px(g, '#05010b', b.x - 2, b.y - 3, 4, 6); px(g, rq.flash ? '#ffffff' : '#fff4a0', b.x - 2, b.y - 2, 4, 4); px(g, '#ffffff', b.x - 2, b.y - 2, 1, 1); if (Math.abs(b.spin || 0) > .2) px(g, '#ff8a3a', b.x - 1 + Math.round(Math.cos(rq.tick / 3) * 2), b.y - 1 + Math.round(Math.sin(rq.tick / 3) * 2), 1, 1); }
  pxFont(g, rq.duo ? 'J1' : 'TOI', 8, 11, '#3fe0ff', 6); pxFont(g, rq.duo ? 'J2' : RQ_AI[rqs.lvl].n.toUpperCase(), W - 8, 11, '#ff4fa8', 6, 'right'); if (rq.rally > 3) pxFont(g, rq.rally + ' échanges', W / 2, 11, '#c8e8c8', 6, 'center');
  if (rq.mode === 'ready') gameText(g, W, [['RAQUETTES', '#3fe0ff', 14], [rq.duo ? 'J1 : Z S (gauche) · J2 : ↑ ↓ (droite)' : 'Souris ou ↑ ↓ pour ta raquette (à gauche)', '#ffffff'], ['Premier à 7 points', '#c8e8c8'], ['Clic ou espace pour commencer', '#ffd84a']], 84);
  if (rq.mode === 'over' && rq.tick - rq.endAt > 30) gameText(g, W, [[rq.duo ? (rq.me > rq.ai ? 'J1 GAGNE !' : 'J2 GAGNE !') : rq.me > rq.ai ? 'GAGNÉ !' : 'PERDU', rq.duo ? (rq.me > rq.ai ? '#3fe0ff' : '#ff4fa8') : rq.me > rq.ai ? '#5fdf6a' : '#ff4a5a', 14], [rq.me + ' à ' + rq.ai + ' · plus long échange : ' + rq.best, '#ffffff'], ['Clic pour rejouer', '#ffd84a']], 94);
}
const rqGo = () => { if (rq.mode === 'ready') rq.mode = 'play'; else if (rq.mode === 'over' && rq.tick - rq.endAt > 30) { rqNew(); rq.mode = 'play'; } else if (rq.mode === 'pause') rq.mode = 'play'; };
cv.onpointermove = e => { if (rq) rq.my = cpos(e)[1]; };
cv.onpointerleave = () => { if (rq) rq.my = null; };
cv.onpointerdown = e => { e.preventDefault(); if (rq) rqGo(); };
document.addEventListener('keydown', e => {
  if (!keyOk(e) || !rq) return; const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const two = rq.duo && (k === 'ArrowUp' || k === 'ArrowDown');
  if (k === 'ArrowUp' || k === 'z' || k === 'w') { e.preventDefault(); rq.keys[two ? 'up2' : 'up'] = true; if (!two) rq.my = null; } if (k === 'ArrowDown' || k === 's') { e.preventDefault(); rq.keys[two ? 'down2' : 'down'] = true; if (!two) rq.my = null; }
  if (k === ' ' || k === 'Enter') { e.preventDefault(); rqGo(); } if (k === 'p' && rq.mode === 'play') rq.mode = 'pause';
});
document.addEventListener('keyup', e => { if (!rq) return; const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; const two = rq.duo && (k === 'ArrowUp' || k === 'ArrowDown'); if (k === 'ArrowUp' || k === 'z' || k === 'w') rq.keys[two ? 'up2' : 'up'] = false; if (k === 'ArrowDown' || k === 's') rq.keys[two ? 'down2' : 'down'] = false; });
function rqInfo() { const b = games.best['raquettes' + rqs.lvl]; showStats([['Victoires', rqs.wins + ' / ' + rqs.games], ['Meilleur écart (' + RQ_AI[rqs.lvl].n.toLowerCase() + ')', b != null ? (b > 0 ? '+' : '') + b : '—'], ['Parties à deux', rqs.duoGames || 0]]); $('rqLvl').value = rqs.duo ? 'duo' : rqs.lvl; }
$('gNew').onclick = () => { rqNew(); $('gNew').blur(); };
$('rqLvl').onchange = () => { const v = $('rqLvl').value; rqs.duo = v === 'duo'; if (!rqs.duo) rqs.lvl = +v; saveGames(); rqNew(); $('rqLvl').blur(); };
{  // vérification : l'ordinateur en difficile renvoie une balle droite, et une balle qui passe donne le point
  const keep = rq, kl = rqs.lvl, kg = {...rqs}; rq = null; rqNew(); rqs.lvl = 2; rq.mode = 'play'; rq.ball = {x: 200, y: 60, vx: 3, vy: 1.2, wait: 0}; rq.my = 104;
  for (let i = 0; i < 80 && rq.ball.vx > 0; i++) rqUpdate(); const returned = rq.ball.vx < 0;
  rq.ball = {x: 40, y: 30, vx: -4, vy: 0, wait: 0}; rq.my = 180; for (let i = 0; i < 40 && rq.ai === 0; i++) rqUpdate();
  // l'effet : frappe en descendant, la balle tourne et sa course plonge ; la grande raquette rattrape une balle au bord ; le bonus 2 lance une deuxième balle ; à deux, les flèches bougent la droite
  const bad = [], aiPt = rq.ai; rqs.duo = false; rqNew(); rq.mode = 'play'; rq.my = null; rq.keys.down = true; rq.py = 100; rq.ball = {x: 30, y: 112, vx: -3, vy: 0, wait: 0, spin: 0, last: 0};
  for (let i = 0; i < 20 && rq.ball.vx < 0; i++) rqUpdate(); rq.keys.down = false; const sp = rq.ball.spin, vy0 = rq.ball.vy; for (let i = 0; i < 10; i++) rqUpdate();
  if (!(sp > .5) || !(rq.ball.vy > vy0 + .3)) bad.push('effet ' + sp + ' ' + vy0 + ' → ' + rq.ball.vy);
  rqNew(); rq.mode = 'play'; rq.my = null; rq.py = 100; rq.bigL = 600; rq.ball = {x: 30, y: 119, vx: -3, vy: 0, wait: 0, spin: 0, last: 0}; for (let i = 0; i < 20 && rq.ball.vx < 0 && rq.ai === 0; i++) rqUpdate(); if (rq.ai || rq.ball.vx < 0) bad.push('grande raquette');
  rqNew(); rq.mode = 'play'; rq.item = {x: 160, y: 100, k: 'multi', t: 600}; rq.ball = {x: 150, y: 100, vx: 3, vy: 0, wait: 0, spin: 0, last: 1}; for (let i = 0; i < 6; i++) rqUpdate(); if (!rq.extra || rq.item) bad.push('deuxième balle');
  rqs.duo = true; rqNew(); rq.mode = 'play'; rq.ay = 100; rq.keys.down2 = true; rqUpdate(); if (rq.ay !== 103.6) bad.push('à deux : ' + rq.ay); rq.keys.down2 = false; rqUpdate(); if (rq.ay !== 103.6) bad.push('à deux, la droite bouge seule');
  console.assert(returned && aiPt === 1 && !bad.length, 'raquettes', {returned, aiPt, bad}); rq = keep; Object.assign(rqs, kg); rqs.lvl = kl;
}
cv.__rq = {st: () => rq, rqs};
$('rqFs').onclick = () => { $('rqFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
ctx.onOpen(() => { if (!rq) rqNew(); gameLoop(rq, 'raquettes', rqUpdate, rqDraw); rqInfo(); });

}
