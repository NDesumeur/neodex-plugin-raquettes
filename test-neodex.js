// lancé par le test « local » de NeoDex : une nouvelle partie, le plein écran et la place prise par le terrain (avec NEO_SHOTS : garde une image du jeu)
module.exports = async ({ pj, sleep }) => {
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'raquettes-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await pj(`document.getElementById('gNew').click(), 0`); await sleep(1500);
  for (const k of ['ArrowUp', 'ArrowDown']) { await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`); await sleep(300); await pj(`document.dispatchEvent(new KeyboardEvent('keyup', {key: '${k}', bubbles: true})), 0`); }
  await shot('1-partie');
  // à deux : la flèche bouge la raquette de droite, pas celle de gauche ; un bonus 2 lance une deuxième balle et la raquette G grandit
  await pj(`(() => { const s = document.getElementById('rqLvl'); s.value = 'duo'; s.dispatchEvent(new Event('change')); return 0; })()`); await sleep(200);
  const R = code => pj(`(() => { const T = document.getElementById('gc').__rq, rq = T.st(); ${code} })()`);
  await R(`rq.mode = 'play'; rq.ball.wait = 9999; return 0;`);
  const a0 = await R('return [rq.py, rq.ay];');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true})), 0`); await sleep(300); await pj(`document.dispatchEvent(new KeyboardEvent('keyup', {key: 'ArrowDown', bubbles: true})), 0`);
  const a1 = await R('return [rq.py, rq.ay];');
  if (!(a1[1] > a0[1] + 10) || a1[0] !== a0[0]) throw new Error('à deux : ' + JSON.stringify([a0, a1]));
  await R(`rq.ball = {x: 150, y: 100, vx: 2, vy: .4, wait: 0, spin: .8, last: 1}; rq.item = {x: 158, y: 101, k: 'multi', t: 600}; rq.bigR = 600; return 0;`); await sleep(400);
  await R(`rq.item = {x: 120, y: 60, k: 'big', t: 600}; return 0;`); await sleep(100); await shot('3-deux-joueurs-bonus');
  if (!await R('return !!rq.extra;')) throw new Error('pas de deuxième balle');
  await pj(`(() => { const s = document.getElementById('rqLvl'); s.value = '1'; s.dispatchEvent(new Event('change')); return 0; })()`); await sleep(200);
  if (await R('return T.rqs.duo || rq.duo;')) throw new Error('le retour contre l’ordinateur ne marche pas');
  await pj(`document.getElementById('rqFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await shot('2-plein-ecran');
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l’écran');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'nouvelle partie · à deux · bonus · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
