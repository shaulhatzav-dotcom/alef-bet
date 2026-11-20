/* שאול הצב - אלף בית: עולם 1, היער (v3, 20/11)
   One wide forest panorama (art/worlds/forest-v2, Grok). Shaul walks right to left; each letter hides
   next to the thing its word names, and only the next letter in order sparkles.
   Voice: audio/<key>.mp3 when it exists (ElevenLabs, Noa); until then the browser's Hebrew voice.
*/
'use strict';

// worlds (stages), played in order. 20/11: world 2 = Grandma's farm (art/worlds/farm-v2, morning), letters ו–י
const WORLDS = [
  { id:'forest', img:'img/world-forest.jpg', ar:2128/912, ground:0.93, title:'אלף בית ביער', intro:'intro', finale:'finale',
    letters:[
      { id:'alef',  ch:'א', color:'#e63946', wordPlain:'ארנב' },
      { id:'bet',   ch:'ב', color:'#f77f00', wordPlain:'בלוט' },
      { id:'gimel', ch:'ג', color:'#2a9d8f', wordPlain:'גשר'  },
      { id:'dalet', ch:'ד', color:'#4361ee', wordPlain:'דב'   },
      { id:'he',    ch:'ה', color:'#9b5de5', wordPlain:'הר'   },
    ],
    // where each letter hides (fractions of the panorama), right to left
    spots:[
      [0.85,0.47],   // behind the bunny, on the dark trunk
      [0.60,0.72],   // on the stump under the acorns
      [0.40,0.69],   // under the bridge
      [0.15,0.72],   // at the bear's honey pot
      [0.15,0.40],   // at the foot of the mountain, in the dark trees
    ] },
  { id:'farm', img:'img/world-farm.jpg', ar:2128/912, ground:0.93, title:'אלף בית בחווה', intro:'intro_farm', finale:'finale_farm',
    letters:[
      { id:'vav',   ch:'ו', color:'#e63946', wordPlain:'ורד'      },
      { id:'zayin', ch:'ז', color:'#f77f00', wordPlain:'זחל'      },
      { id:'het',   ch:'ח', color:'#2a9d8f', wordPlain:'חתול'     },
      { id:'tet',   ch:'ט', color:'#4361ee', wordPlain:'טרקטור'   },
      { id:'yod',   ch:'י', color:'#9b5de5', wordPlain:'יונה'     },
    ],
    spots:[
      [0.81,0.55],   // in the dark leaves of the rose bush
      [0.675,0.74],  // on the fence post under the caterpillar
      [0.50,0.72],   // in the hay bale under the sleeping cat
      [0.31,0.64],   // in the tractor's dark grille
      [0.12,0.29],   // in the dovecote window, under the dove
    ] },
];
let W = WORLDS[0], WORLD = W, LETTERS = W.letters, SCENES = W.spots.map(s=>({spot:s}));
function setWorld(i){
  W = WORLD = WORLDS[i]; state.w = i; LETTERS = W.letters; SCENES = W.spots.map(s=>({spot:s}));
  rainbow($('#celebRow'), LETTERS.map(L=>L.ch).join(''));
}
const IMG_AR = WORLDS[0].ar;   // all panoramas are 2128x912

// every voice line, with niqqud (the same text goes to ElevenLabs)
const LINES = {
  intro:    'שָׁלוֹם! זֶה שַׁאוּל הַצָּב. חָמֵשׁ אוֹתִיּוֹת הִתְחַבְּאוּ בַּיַּעַר, וְשַׁאוּל צָרִיךְ עֶזְרָה לִמְצֹא אוֹתָן. רוֹאִים מַשֶּׁהוּ נוֹצֵץ? גְּעוּ בּוֹ!',
  // 20/11 the user: "עושה" doesn't sound right -> "זֹאת הָאוֹת ..."
  l_alef:   'זֹאת הָאוֹת אָלֶף! אַ, כְּמוֹ אַרְנָב!',
  l_bet:    'זֹאת הָאוֹת בֵּית! בַּ, כְּמוֹ בַּלּוּט!',
  l_gimel:  'זֹאת הָאוֹת גִּימֶל! גֶּ, כְּמוֹ גֶּשֶׁר!',
  l_dalet:  'זֹאת הָאוֹת דָּלֶת! דֹּ, כְּמוֹ דֹּב!',
  l_he:     'זֹאת הָאוֹת הֵא! הַ, כְּמוֹ הַר!',
  onward:   'מַמְשִׁיכִים בַּשְּׁבִיל! גְּעוּ בַּחֵץ.',
  look:     'מָה נוֹצֵץ פֹּה?',
  hint:     'אוּלַי מַשֶּׁהוּ מִתְחַבֵּא שָׁם?',
  goFind:   'הִתְקַדְּמוּ עַד שֶׁתִּרְאוּ מַשֶּׁהוּ מְנַצְנֵץ!',   // the sparkle is off screen (phone held upright)
  allFound: 'יֵשׁ! מְצָאתֶם אֶת כָּל הָאוֹתִיּוֹת! עַכְשָׁיו מִשְׂחָק קָטָן.',
  q_alef:   'אֵיפֹה הָאוֹת אָלֶף?',
  q_bet:    'אֵיפֹה הָאוֹת בֵּית?',
  q_gimel:  'אֵיפֹה הָאוֹת גִּימֶל?',
  q_dalet:  'אֵיפֹה הָאוֹת דָּלֶת?',
  q_he:     'אֵיפֹה הָאוֹת הֵא?',
  yes1:     'נָכוֹן מְאוֹד!',
  yes2:     'כָּל הַכָּבוֹד!',
  yes3:     'יוֹפִי!',
  tryAgain: 'כִּמְעַט! נְנַסֶּה שׁוּב.',
  // 20/11 the user: at the end of stage 1 add "כל הכבוד הצלחתם אתם עוברים לשלב הבא"
  finale:   'אָלֶף, בֵּית, גִּימֶל, דָּלֶת, הֵא! שַׁאוּל, סַבְתָּא וְכָל הַחֲבֵרִים שְׂמֵחִים. כָּל הַכָּבוֹד, הִצְלַחְתֶּם! אַתֶּם עוֹבְרִים לַשָּׁלָב הַבָּא!',
  // world 2: Grandma's farm
  intro_farm:  'בֹּקֶר טוֹב! שַׁאוּל הִגִּיעַ לַחַוָּה שֶׁל סַבְתָּא. גַּם כָּאן הִתְחַבְּאוּ חָמֵשׁ אוֹתִיּוֹת. רוֹאִים מַשֶּׁהוּ נוֹצֵץ? גְּעוּ בּוֹ!',
  l_vav:    'זֹאת הָאוֹת וָו! וֶ, כְּמוֹ וֶרֶד!',
  l_zayin:  'זֹאת הָאוֹת זַיִן! זַ, כְּמוֹ זַחַל!',     // 20/11 the user: not זבוב
  l_het:    'זֹאת הָאוֹת חֵית! חָ, כְּמוֹ חָתוּל!',
  l_tet:    'זֹאת הָאוֹת טֵית! טְ, כְּמוֹ טְרַקְטוֹר!',
  l_yod:    'זֹאת הָאוֹת יוּד! יוֹ, כְּמוֹ יוֹנָה!',
  q_vav:    'אֵיפֹה הָאוֹת וָו?',
  q_zayin:  'אֵיפֹה הָאוֹת זַיִן?',
  q_het:    'אֵיפֹה הָאוֹת חֵית?',
  q_tet:    'אֵיפֹה הָאוֹת טֵית?',
  q_yod:    'אֵיפֹה הָאוֹת יוּד?',
  finale_farm: 'הִצְלַחְתֶּם! וָו, זַיִן, חֵית, טֵית, יוּד! סַבְתָּא וְכָל הַחֲיוֹת בַּחַוָּה שְׂמֵחוֹת. כָּל הַכָּבוֹד!',
};

const $ = s => document.querySelector(s);
const sceneEl = $('#scene'), shaulEl = $('#shaul');
const state = { w:0, n:0, found:new Set(), x:0, target:null, busy:true, lastLine:null, idleTimer:null, sw:0, sh:0, top:0, camX:0, quiz:null, canGo:false };

/* ---------------- voice ---------------- */
const audioCache = {};
let heVoice = null;
function pickVoice(){ const v = window.speechSynthesis ? speechSynthesis.getVoices() : []; heVoice = v.find(x=>/^(he|iw)/i.test(x.lang)) || null; }
if (window.speechSynthesis){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function stopVoice(){
  Object.values(audioCache).forEach(a=>{ a.pause(); a.currentTime=0; a.onended=null; });
  if (window.speechSynthesis) speechSynthesis.cancel();
}
function say(key){
  stopVoice(); state.lastLine = key;
  const text = LINES[key] || '';
  const fallbackMs = 900 + text.length*65;
  return new Promise(resolve=>{
    let doneOnce=false; const done=()=>{ if(!doneOnce){ doneOnce=true; resolve(); } };
    const a = audioCache[key];
    if (a){ a.currentTime=0; a.onended=done; a.play().catch(()=>setTimeout(done,fallbackMs)); setTimeout(done, (a.duration||10)*1000+800); return; }
    if (window.speechSynthesis && heVoice){
      const u = new SpeechSynthesisUtterance(text); u.voice=heVoice; u.lang=heVoice.lang; u.rate=.85; u.pitch=1.15;
      u.onend=done; u.onerror=done; setTimeout(done, fallbackMs+2500);
      speechSynthesis.speak(u); return;
    }
    setTimeout(done, fallbackMs);
  });
}
function loadAudio(){
  Object.keys(LINES).forEach(k=>{ const a=new Audio(`audio/${k}.mp3`); a.preload='auto'; a.oncanplaythrough=()=>{ audioCache[k]=a; }; });
}

/* small synthesized sounds */
let actx=null;
function blip(freqs, dur=.12, type='sine', vol=.16){
  try{
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    let t = actx.currentTime;
    freqs.forEach(f=>{ const o=actx.createOscillator(), g=actx.createGain(); o.type=type; o.frequency.value=f;
      g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur); o.connect(g).connect(actx.destination); o.start(t); o.stop(t+dur); t+=dur*.75; });
  }catch(e){}
}
const sfx = { found:()=>blip([523,659,784,1047,1319],.14,'triangle'), rustle:()=>blip([300,420,360],.06,'triangle',.06),
              yes:()=>blip([659,784,1047],.15,'triangle'), no:()=>blip([330,262],.16,'sine',.08), step:()=>blip([200],.04,'sine',.025),
              whoosh:()=>blip([400,600,800,1000],.07,'sine',.05) };

/* ---------------- scene geometry ---------------- */
const vw=()=>window.innerWidth, vh=()=>window.innerHeight;
function layout(){
  let sh = vh(), sw = sh*IMG_AR;
  if (sw < vw()){ sw = vw(); sh = sw/IMG_AR; }
  const f = state.sw ? state.x/state.sw : null;
  state.sw = sw; state.sh = sh; state.top = Math.min(0, (vh()-sh)*0.6);
  sceneEl.style.width = sw+'px'; sceneEl.style.height = sh+'px';
  if (f!==null) state.x = f*sw;
  document.documentElement.style.setProperty('--spotW', (sh*0.3)+'px');
  document.documentElement.style.setProperty('--peek', (sh*0.3*0.55)+'px');
  $('#riser').style.fontSize = (sh*0.26)+'px';
  placeShaul(); camera(true);
}
function placeShaul(){
  const h = state.sh*0.34;
  shaulEl.style.height = h+'px';
  shaulEl.style.left = state.x+'px';
  shaulEl.style.top = (WORLD.ground*state.sh - h)+'px';
}
// the camera looks a little ahead of Shaul (to the left, the way he walks), so the hiding place next to him stays in view
function camFor(x){ return Math.min(0, Math.max(vw()-state.sw, vw()/2 - (x - state.sh*0.12))); }
function camera(instant){
  const target = camFor(state.x);
  state.camX = instant ? target : state.camX + (target-state.camX)*.1;
  sceneEl.style.transform = `translate(${state.camX}px, ${state.top}px)`;
}
function face(dir){ shaulEl.style.setProperty('--face', dir); }   // -1 = looking left (the image looks right)

function loadScene(n){
  state.n = n; state.nudged = false; const S = SCENES[n], L = LETTERS[n];
  sceneEl.style.backgroundImage = `url(${WORLD.img})`;
  const box = $('#spots'); box.innerHTML='';
  const s = document.createElement('div'); s.className='spot';
  s.style.left = (S.spot[0]*100)+'%'; s.style.top = (S.spot[1]*100)+'%';
  s.innerHTML = `<div class="glow"></div><div class="peek" style="--c:${L.color}">${L.ch}</div>`;
  for(let k=0;k<5;k++){ const f=document.createElement('div'); f.className='fly';
    f.style.left=(20+Math.random()*60)+'%'; f.style.top=(20+Math.random()*60)+'%'; f.style.animationDelay=(k*.6)+'s'; f.style.animationDuration=(2.4+Math.random()*1.6)+'s'; s.appendChild(f); }
  s.addEventListener('pointerdown', e=>{ e.stopPropagation(); onSpot(); });
  box.appendChild(s);
  $('#riser').className=''; $('#riser').textContent='';
  $('#nextBtn').classList.remove('show'); state.canGo=false;
}

/* ---------------- walking ---------------- */
let lastT=0, stepAcc=0, arrive=null;
function loop(t){
  const dt = Math.min(.05,(t-lastT)/1000||0); lastT=t;
  if (state.target!==null){
    const speed = Math.max(200, state.sh*0.42);
    const d = state.target - state.x;
    if (Math.abs(d) < 3){ state.x=state.target; state.target=null; shaulEl.classList.remove('walk'); const f=arrive; arrive=null; f&&f(); }
    else { state.x += Math.sign(d)*Math.min(Math.abs(d), speed*dt); shaulEl.classList.add('walk'); face(d>0?1:-1);
      stepAcc+=dt; if(stepAcc>.32){stepAcc=0; sfx.step();} }
    placeShaul();
  }
  camera(false);
  requestAnimationFrame(loop);
}
function walkTo(x, then, free){
  const lo = free ? -state.sw*0.2 : state.sw*0.07, hi = free ? state.sw*1.2 : state.sw*0.93;
  state.target = Math.max(lo, Math.min(hi, x)); arrive=then||null; resetIdle();
}
$('#stage').addEventListener('pointerdown', e=>{ if (!state.busy) walkTo(e.clientX - state.camX); });

/* ---------------- finding a letter ---------------- */
async function onSpot(){
  if (state.busy) return;
  const S = SCENES[state.n], L = LETTERS[state.n], spotEl = $('.spot');
  if (state.found.has(L.id)) return;
  state.busy = true; clearHint();
  walkTo(S.spot[0]*state.sw + state.sh*0.14, async ()=>{
    face(-1); sfx.rustle();
    const r = $('#riser'); r.style.setProperty('--c', L.color); r.textContent = L.ch;
    r.style.left = (S.spot[0]*100)+'%'; r.style.top = (S.spot[1]*100)+'%';
    spotEl.classList.add('done');
    requestAnimationFrame(()=>r.classList.add('up'));
    sfx.found(); shaulEl.classList.add('happy'); setTimeout(()=>shaulEl.classList.remove('happy'),1400);
    await wait(1300);
    await showCard(L);
    r.classList.remove('up');
    state.found.add(L.id); const slot=$('#slot-'+L.id); slot.classList.add('got');
    if (state.found.size===LETTERS.length){ await wait(500); await say('allFound'); startQuiz(); return; }
    loadScene(state.n+1);   // same panorama: the next hiding place starts to sparkle
    state.busy=false; say(lookLine()); resetIdle();
  });
}
async function showCard(L){
  const ov=$('#found'), card=$('#foundCard');
  card.style.setProperty('--c',L.color);
  $('#fLetter').textContent=L.ch;
  $('#fPic').innerHTML = `<img src="img/word-${L.id}.jpg" alt="${L.wordPlain}">`;
  $('#fWord').innerHTML = `<b>${L.wordPlain[0]}</b>${L.wordPlain.slice(1)}`;
  card.style.animation='none'; card.offsetHeight; card.style.animation='';
  ov.classList.add('show');
  ov.onpointerdown = ()=> say('l_'+L.id);   // tap the card = hear it again
  await say('l_'+L.id); await wait(1200);
  ov.classList.remove('show'); ov.onpointerdown=null;
}

/* ---------------- going on to the next place ---------------- */
$('#nextBtn').addEventListener('pointerdown', e=>{ e.stopPropagation(); goNext(); });
function goNext(){
  if (!state.canGo) return;
  state.canGo=false; state.busy=true; $('#nextBtn').classList.remove('show');
  walkTo(-state.sw*0.1, async ()=>{
    sfx.whoosh(); $('#fade').classList.add('on'); await wait(650);
    loadScene(state.n+1);
    state.x = state.sw*1.08; placeShaul(); camera(true);
    await wait(150); $('#fade').classList.remove('on');
    walkTo(state.sw*0.8, ()=>{ face(-1); state.busy=false; say(lookLine()); resetIdle(); }, true);
  }, true);
}

/* idle hint: after 9s the hiding place glows harder, the letter peeks out, Shaul says so */
function clearHint(){ document.querySelectorAll('.spot.hint').forEach(s=>s.classList.remove('hint')); }
// is the sparkle on screen once the camera settles on Shaul?
function spotOnScreen(){
  const cam = camFor(state.target ?? state.x);
  const sx = SCENES[state.n].spot[0]*state.sw + cam;
  return sx > vw()*0.08 && sx < vw()*0.92;
}
function lookLine(){ return spotOnScreen() ? 'look' : 'goFind'; }
function resetIdle(){
  clearTimeout(state.idleTimer); clearHint();
  state.idleTimer = setTimeout(()=>{
    if (state.busy) return;
    if (state.canGo){ say('onward'); resetIdle(); return; }
    const S = SCENES[state.n];
    if (!spotOnScreen() && !state.nudged){ state.nudged = true; say('goFind'); resetIdle(); return; }   // first: tell them to walk on
    $('.spot').classList.add('hint');
    if (!spotOnScreen()) walkTo(S.spot[0]*state.sw + state.sh*0.25);   // still stuck: Shaul walks there himself
    say('hint');
  }, 9000);
}

/* ---------------- quiz ---------------- */
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function startQuiz(){
  clearTimeout(state.idleTimer);
  state.quiz = { order:shuffle([...LETTERS]), n:0, locked:false };
  const st=$('#stars'); st.innerHTML=''; LETTERS.forEach(()=>{ const s=document.createElement('span'); s.textContent='⭐'; st.appendChild(s); });
  $('#quiz').classList.add('show'); nextQ();
}
async function nextQ(){
  const q=state.quiz; if (q.n>=q.order.length) return celebrate();
  const T=q.order[q.n];
  const opts = shuffle([T, ...shuffle(LETTERS.filter(L=>L!==T)).slice(0,2)]);
  const box=$('#choices'); box.innerHTML='';
  opts.forEach(L=>{ const b=document.createElement('button'); b.className='choice'; b.textContent=L.ch; b.style.setProperty('--c',L.color);
    b.setAttribute('aria-label', L.wordPlain); b.onpointerdown=()=>answer(b,L,T); box.appendChild(b); });
  q.locked=true; await say('q_'+T.id); q.locked=false;
}
async function answer(btn,L,T){
  const q=state.quiz; if (q.locked || btn.classList.contains('no')) return;
  q.locked=true;
  if (L===T){
    btn.classList.add('yes'); sfx.yes(); $('#stars').children[q.n].classList.add('on');
    await say('yes'+(1+Math.floor(Math.random()*3))); await wait(300);
    q.n++; nextQ();
  } else {
    btn.classList.add('no'); sfx.no();          // no losing: the wrong letter just fades
    await say('tryAgain'); await say('q_'+T.id); q.locked=false;
  }
}
$('#earBtn').addEventListener('pointerdown', ()=>{ const q=state.quiz; if(q && q.n<q.order.length) say('q_'+q.order[q.n].id); });

/* ---------------- celebrate ---------------- */
function celebrate(){
  $('#quiz').classList.remove('show');
  const ov=$('#celebrate'); ov.classList.add('show');
  sfx.found(); setTimeout(sfx.yes,600);
  const colors=['#e63946','#f77f00','#ffd23f','#2a9d8f','#4361ee','#9b5de5'];
  for(let i=0;i<90;i++){ const c=document.createElement('div'); c.className='confetti';
    c.style.left=Math.random()*100+'%'; c.style.background=colors[i%colors.length];
    c.style.animationDuration=(2.5+Math.random()*2.5)+'s'; c.style.animationDelay=(Math.random()*1.5)+'s'; ov.appendChild(c);
    setTimeout(()=>c.remove(),7000); }
  const next = WORLDS[state.w+1];
  $('#nextWorldBtn').classList.toggle('show', !!next);
  if (next) $('#nextWorldBtn').style.backgroundImage = `url(${next.img})`;
  say(W.finale);
}

/* ---------------- start / reset ---------------- */
function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
function rainbow(el, text){
  const colors=['#e63946','#f77f00','#ffd23f','#2a9d8f','#4361ee','#9b5de5'];
  let i=0; el.innerHTML = [...text].map(ch=> ch===' ' ? '<span>&nbsp;</span>' : `<span style="color:${colors[(i++)%colors.length]}">${ch}</span>`).join('');
}
function buildHud(){
  const hud=$('#hud'); hud.innerHTML='';
  LETTERS.forEach(L=>{ const d=document.createElement('div'); d.className='slot'; d.id='slot-'+L.id; d.textContent=L.ch; d.style.setProperty('--c',L.color); hud.appendChild(d); });
}
function reset(){
  stopVoice(); clearTimeout(state.idleTimer);
  state.found.clear(); state.target=null; state.quiz=null; state.busy=true;
  document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('show'));
  buildHud(); loadScene(0); state.x = state.sw*0.93; face(-1); layout();
}
async function begin(w){
  if (typeof w === 'number' && w !== state.w){ setWorld(w); reset(); }
  $('#start').classList.remove('show');
  try{ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); actx.resume(); }catch(e){}
  state.busy=false;   // kids tap right away; let them walk while Shaul talks
  await wait(500); await say(W.intro);
  if (!state.found.size && !spotOnScreen() && state.lastLine===W.intro) say('goFind');   // only if the kid hasn't walked there already
  resetIdle();
}
// start screen: one big ▶ that always starts at the forest (21/11 the user: the farm opens only after finishing the forest)
$('#playBtn').addEventListener('pointerdown', ()=> begin(0));
$('#againBtn').addEventListener('pointerdown', ()=>{ reset(); begin(); });
$('#nextWorldBtn').addEventListener('pointerdown', async ()=>{
  stopVoice(); sfx.whoosh(); $('#fade').classList.add('on'); await wait(600);
  setWorld(state.w+1); reset(); await wait(100); $('#fade').classList.remove('on'); begin();
});
$('#homeBtn').addEventListener('pointerdown', e=>{ e.stopPropagation(); reset(); $('#start').classList.add('show'); });
$('#soundBtn').addEventListener('pointerdown', e=>{ e.stopPropagation(); if(state.lastLine) say(state.lastLine); });
window.addEventListener('resize', layout);

(function init(){
  rainbow($('#titlePlank'), 'אלף בית');
  setWorld(0);
  // warm the cache so walking into the next place never shows an empty frame
  WORLDS.forEach(w=> [w.img, ...w.letters.map(L=>`img/word-${L.id}.jpg`)].forEach(src=>{ const i=new Image(); i.src=src; }));
  layout(); reset(); $('#start').classList.add('show');
  requestAnimationFrame(loop); loadAudio();
})();
