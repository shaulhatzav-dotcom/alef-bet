/* שאול הצב - אלף בית: עולם 1, היער (v3, 20/11)
   One wide forest panorama (art/worlds/forest-v2, Grok). Shaul walks right to left; each letter hides
   next to the thing its word names, and only the next letter in order sparkles.
   Voice: audio/<key>.mp3 when it exists (ElevenLabs, Noa); until then the browser's Hebrew voice.
*/
'use strict';

// worlds (stages), played in order. 20/11: world 2 = Grandma's farm (art/worlds/farm-v2, morning), letters ו–י
const WORLDS = [
  { id:'forest', img:'img/world-forest.jpg', ar:2128/912, ground:0.93, title:'אלף בית ביער', intro:'intro', finale:'finale', reward:'clips/reward-forest.mp4',
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
  // 21/11: world 3 = winter (art/worlds/winter-v2, blue evening), letters כ–ס. The user: no Hanukkah, the game is for the whole year
  // -> ל = לחם (not לביבה), ס = סנאי (not סביבון); the panorama gets bread and a squirrel instead of latkes and a dreidel
  { id:'winter', img:'img/world-winter.jpg', ar:2128/912, ground:0.93, title:'אלף בית בחורף', intro:'intro_winter', finale:'finale_winter',
    letters:[
      { id:'kaf',    ch:'כ', color:'#e63946', wordPlain:'כובע'    },
      { id:'lamed',  ch:'ל', color:'#f77f00', wordPlain:'לחם'     },
      { id:'mem',    ch:'מ', color:'#2a9d8f', wordPlain:'מטריה'   },
      { id:'nun',    ch:'נ', color:'#4361ee', wordPlain:'נר'      },
      { id:'samekh', ch:'ס', color:'#9b5de5', wordPlain:'סנאי'    },
    ],
    spots:[
      [0.89,0.44],   // on the snowman's red hat
      [0.70,0.63],   // in the dark under the bread shelf
      [0.50,0.60],   // on the bench under the umbrella
      [0.30,0.67],   // in the stones under the candle lantern
      [0.14,0.72],   // in the squirrel's tree stump
    ] },
  // 21/11: world 4 = picnic in the garden (art/worlds/picnic-v2, sunny midday, the user's pick), 4 letters ע–ק.
  // Right to left the picture already has cake, butterfly on a sunflower, toy turtle by a sandbox, hedgehog by mushrooms.
  { id:'picnic', img:'img/world-picnic.jpg', ar:2128/912, ground:0.93, title:'אלף בית בפיקניק', intro:'intro_picnic', finale:'finale_picnic',
    letters:[
      { id:'ayin',  ch:'ע', color:'#e63946', wordPlain:'עוגה'   },
      { id:'pe',    ch:'פ', color:'#f77f00', wordPlain:'פרפר'   },
      { id:'tsadi', ch:'צ', color:'#2a9d8f', wordPlain:'צב'     },
      { id:'qof',   ch:'ק', color:'#9b5de5', wordPlain:'קיפוד'  },
    ],
    spots:[
      [0.87,0.66],   // on the checked cloth under the cake plate
      [0.64,0.66],   // in the flowers at the sunflower's foot (butterfly above)
      [0.34,0.64],   // at the sandbox corner, by the toy turtle's cart (0.42 left the turtle off screen)
      [0.10,0.68],   // by the hedgehog, under the mushrooms
    ] },
  // 21/11: world 5 = sky at dusk (art/worlds/sky-v1, the user's pick), the last letters ר ש ת. Ends the whole alef-bet.
  // Right to left: rocket on its wooden stand, the big setting sun, parrot on the tree branch.
  { id:'sky', img:'img/world-sky.jpg', ar:2128/912, ground:0.90, title:'אלף בית בשמיים', intro:'intro_sky', finale:'finale_sky',
    letters:[
      { id:'resh', ch:'ר', color:'#e63946', wordPlain:'רקטה' },
      { id:'shin', ch:'ש', color:'#f77f00', wordPlain:'שמש'  },
      { id:'tav',  ch:'ת', color:'#4361ee', wordPlain:'תוכי' },
    ],
    spots:[
      [0.85,0.70],   // on the rocket's wooden stand
      [0.46,0.66],   // at the foot of the setting sun
      [0.12,0.62],   // on the tree trunk under the parrot
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
  intro:    'שָׁלוֹם! זֶה שָׁאוּל הַצָּב. הָאוֹתִיּוֹת הִתְחַבְּאוּ בַּיַּעַר. רוֹאִים מַשֶּׁהוּ נוֹצֵץ? לַחֲצוּ עָלָיו!',   // 21/11 the user: "לחצו עליו", not "געו בו"
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
  finale:   'אָלֶף, בֵּית, גִּימֶל, דָּלֶת, הֵא! שָׁאוּל, סַבְתָּא וְכָל הַחֲבֵרִים שְׂמֵחִים. כָּל הַכָּבוֹד, הִצְלַחְתֶּם! אַתֶּם עוֹבְרִים לַשָּׁלָב הַבָּא!',
  // world 2: Grandma's farm
  intro_farm:  'בֹּקֶר טוֹב! רוֹאִים מַשֶּׁהוּ נוֹצֵץ? לַחֲצוּ עָלָיו!',
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
  // 21/11: kept the approved recording (a re-take with "אתם עוברים לשלב הבא" had errors); the ▶ to the next stage shows anyway
  finale_farm: 'הִצְלַחְתֶּם! וָו, זַיִן, חֵית, טֵית, יוּד! סַבְתָּא וְכָל הַחֲיוֹת בַּחַוָּה שְׂמֵחוֹת. כָּל הַכָּבוֹד!',
  // world 3: winter
  intro_winter: 'עֶרֶב טוֹב! שֶׁלֶג יוֹרֵד, וְשָׁאוּל עֲדַיִן מְחַפֵּשׂ אוֹתִיּוֹת. רוֹאִים מַשֶּׁהוּ נוֹצֵץ? לַחֲצוּ עָלָיו!',
  l_kaf:    'זֹאת הָאוֹת כַּף! כּוֹ, כְּמוֹ כּוֹבַע!',
  l_lamed:  'זֹאת הָאוֹת לָמֶד! לֶ, כְּמוֹ לֶחֶם!',
  l_mem:    'זֹאת הָאוֹת מֵם! מִ, כְּמוֹ מִטְרִיָּה!',
  l_nun:    'זֹאת הָאוֹת נוּן! נֵ, כְּמוֹ נֵר!',
  l_samekh: 'זֹאת הָאוֹת סָמֶךְ! סְ, כְּמוֹ סְנַאִי!',
  q_kaf:    'אֵיפֹה הָאוֹת כַּף?',
  q_lamed:  'אֵיפֹה הָאוֹת לָמֶד?',
  q_mem:    'אֵיפֹה הָאוֹת מֵם?',
  q_nun:    'אֵיפֹה הָאוֹת נוּן?',
  q_samekh: 'אֵיפֹה הָאוֹת סָמֶךְ?',
  finale_winter: 'הִצְלַחְתֶּם! כַּף, לָמֶד, מֵם, נוּן, סָמֶךְ! אֲפִלּוּ אִישׁ הַשֶּׁלֶג שָׂמֵחַ. כָּל הַכָּבוֹד!',
  // 21/11 world 4, picnic
  intro_picnic: 'צָהֳרַיִם טוֹבִים! הַיּוֹם יֵשׁ פִּיקְנִיק בַּגִּנָּה. רוֹאִים מַשֶּׁהוּ נוֹצֵץ? לַחֲצוּ עָלָיו!',
  l_ayin:   'זֹאת הָאוֹת עַיִן! עוּ, כְּמוֹ עוּגָה!',
  l_pe:     'זֹאת הָאוֹת פֵּא! פַּ, כְּמוֹ פַּרְפַּר!',
  // 21/11 the user: the letter is "צדיק", not "צדי"
  l_tsadi:  'זֹאת הָאוֹת צָדִיק! צָ, כְּמוֹ צָב!',
  l_qof:    'זֹאת הָאוֹת קוּף! קִי, כְּמוֹ קִיפּוֹד!',
  q_ayin:   'אֵיפֹה הָאוֹת עַיִן?',
  q_pe:     'אֵיפֹה הָאוֹת פֵּא?',
  q_tsadi:  'אֵיפֹה הָאוֹת צָדִיק?',
  q_qof:    'אֵיפֹה הָאוֹת קוּף?',
  finale_picnic: 'הִצְלַחְתֶּם! עַיִן, פֵּא, צָדִיק, קוּף! עַכְשָׁו אֶפְשָׁר לֶאֱכוֹל עוּגָה. כָּל הַכָּבוֹד!',
  // 21/11 world 5, sky (07 = "זאת האות" from l_resh + "תו" from q_tav + the rest of take D; 08 = take D + "כל הכבוד" from praise_1)
  intro_sky: 'לַיְלָה טוֹב! הַכּוֹכָבִים יוֹצְאִים, וְנִשְׁאֲרוּ עוֹד שָׁלוֹשׁ אוֹתִיּוֹת. רוֹאִים מַשֶּׁהוּ נוֹצֵץ? לַחֲצוּ עָלָיו!',
  l_resh:   'זֹאת הָאוֹת רֵישׁ! רָ, כְּמוֹ רָקֵטָה!',
  l_shin:   'זֹאת הָאוֹת שִׁין! שֶׁ, כְּמוֹ שֶׁמֶשׁ!',
  l_tav:    'זֹאת הָאוֹת תָּו! תּוּ, כְּמוֹ תּוּכִּי!',
  q_resh:   'אֵיפֹה הָאוֹת רֵישׁ?',
  q_shin:   'אֵיפֹה הָאוֹת שִׁין?',
  q_tav:    'אֵיפֹה הָאוֹת תָּו?',
  finale_sky: 'הִצְלַחְתֶּם! רֵישׁ, שִׁין, תָּו! מְצָאתֶם אֶת כָּל הָאוֹתִיּוֹת, מֵאָלֶף וְעַד תָּו! כָּל הַכָּבוֹד!',
  // 21/11 the user: a praise at the end of every world (after the finale), a different one each time
  praise_1: 'כָּל הַכָּבוֹד! אַתֶּם מַמְשִׁיכִים לַשָּׁלָב הַבָּא!',
  praise_2: 'כָּל הַכָּבוֹד! עֲלִיתֶם שָׁלָב!',
  praise_3: 'כָּל הַכָּבוֹד! אַתֶּם מִתְקַדְּמִים!',
};

const $ = s => document.querySelector(s);
const sceneEl = $('#scene'), shaulEl = $('#shaul');
const state = { w:0, n:0, found:new Set(), x:0, target:null, busy:true, lastLine:null, idleTimer:null, sw:0, sh:0, top:0, camX:0, quiz:null, canGo:false };

/* ---------------- voice ---------------- */
/* 21/11 iPhone had no narration: Safari never preloads <audio> (so the old per-line cache stayed empty) and it lets an
   audio element play only after a tap. Now ONE player is unlocked on the first tap and every line just swaps its src. */
const audioOK = {};                       // key -> false when the mp3 is missing (then the browser's TTS speaks)
const voice = new Audio(); voice.preload = 'auto'; voice.setAttribute('playsinline', '');
let unlockState = 0, sayToken = 0;       // 0 = not yet, 1 = trying, 2 = the player is allowed to play
function silentWav(){
  const n = 800, b = new Uint8Array(44 + n), v = new DataView(b.buffer), s = (o, t)=>[...t].forEach((c, i)=>b[o+i]=c.charCodeAt(0));
  s(0,'RIFF'); v.setUint32(4,36+n,true); s(8,'WAVEfmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
  v.setUint32(24,8000,true); v.setUint32(28,8000,true); v.setUint16(32,1,true); v.setUint16(34,8,true); s(36,'data'); v.setUint32(40,n,true);
  b.fill(128, 44); return URL.createObjectURL(new Blob([b], {type:'audio/wav'}));
}
function unlockAudio(){
  try{ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); actx.resume(); }catch(e){}
  if (unlockState || !voice.paused) return;            // never cut a line that is already playing
  unlockState = 1; voice.src = silentWav();
  voice.play().then(()=>{ unlockState = 2; }).catch(()=>{ unlockState = 0; });   // a tap that iOS doesn't count -> retry on the next one
}
['pointerdown','touchend','click'].forEach(ev=> window.addEventListener(ev, unlockAudio, {capture:true, passive:true}));
let heVoice = null;
function pickVoice(){ const v = window.speechSynthesis ? speechSynthesis.getVoices() : []; heVoice = v.find(x=>/^(he|iw)/i.test(x.lang)) || null; }
if (window.speechSynthesis){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function stopVoice(){
  sayToken++; voice.onended = null; voice.pause();
  if (window.speechSynthesis) speechSynthesis.cancel();
}
function say(key){
  stopVoice(); state.lastLine = key; const my = sayToken;
  const text = LINES[key] || '';
  const fallbackMs = 900 + text.length*65;
  return new Promise(resolve=>{
    let doneOnce=false; const done=()=>{ if(!doneOnce){ doneOnce=true; resolve(); } };
    const tts = ()=>{
      if (my !== sayToken) return done();
      if (window.speechSynthesis && heVoice){
        const u = new SpeechSynthesisUtterance(text); u.voice=heVoice; u.lang=heVoice.lang; u.rate=.85; u.pitch=1.15;
        u.onend=done; u.onerror=done; setTimeout(done, fallbackMs+2500);
        speechSynthesis.speak(u); return;
      }
      setTimeout(done, fallbackMs);
    };
    if (audioOK[key] === false) return tts();
    voice.onended = done;
    voice.onloadedmetadata = ()=>{ if (my === sayToken && isFinite(voice.duration)) setTimeout(done, voice.duration*1000 + 800); };
    voice.src = `audio/${key}.mp3`;
    voice.play().catch(()=>{ if (my === sayToken) setTimeout(done, fallbackMs); });
    setTimeout(done, 15000);              // never hang the game on a stuck file
  });
}
function loadAudio(){                     // warm the HTTP cache (and learn which lines have no mp3)
  Object.keys(LINES).forEach(k=> fetch(`audio/${k}.mp3`).then(r=>{ audioOK[k] = r.ok; return r.ok && r.blob(); }).catch(()=>{}));
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
// 21/11 the user: a 5-second reward clip per world (Grok, muted; the game keeps its own ta-da + praise).
// Landscape / desktop: the clip fills the screen while it plays, then shrinks into a card and the buttons appear.
// Portrait: it is a card from the start. A tap on the clip skips to the card. Worlds without a clip keep friends.png.
function rewardClip(ov){
  const card=$('#rewardCard'), vid=$('#rewardVid'), friends=ov.querySelector('.friends');
  clearTimeout(state.clipTimer); ov.classList.remove('vidFull');
  if (!W.reward){ card.hidden=true; vid.removeAttribute('src'); friends.hidden=false; return; }
  friends.hidden=true; card.hidden=false;
  card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
  if (!vid.src.endsWith(W.reward)) vid.src=W.reward;
  vid.currentTime=0; vid.play().catch(()=>{});
  const toCard=()=>{ clearTimeout(state.clipTimer);
    if (!ov.classList.contains('vidFull')) return;
    ov.classList.remove('vidFull'); card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); };
  if (matchMedia('(orientation:landscape)').matches){
    ov.classList.add('vidFull');
    state.clipTimer=setTimeout(toCard, 8000);   // safety, in case "ended" never fires
  }
  vid.onended=toCard; card.onpointerdown=toCard;
}
function celebrate(){
  $('#quiz').classList.remove('show');
  const ov=$('#celebrate'); ov.classList.add('show');
  sfx.found(); setTimeout(sfx.yes,600);
  // 21/11 the user: realistic soap bubbles instead of confetti (tap one = it pops into droplets; no extra sound)
  const box=$('#bubbles'); box.innerHTML='';
  for(let i=0;i<24;i++) setTimeout(()=>{ if (ov.classList.contains('show')) soapBubble(box); }, i*250);
  rewardClip(ov);
  const next = WORLDS[state.w+1];
  $('#nextWorldBtn').classList.toggle('show', !!next);
  if (next) $('#nextWorldBtn').style.backgroundImage = `url(${next.img})`;
  // the praise follows the finale, a different one in each world (the forest finale already says "עוברים לשלב הבא", so it gets "עליתם שלב").
  // "ממשיכים לשלב הבא" only where a next world exists.
  const cycle = ['praise_2','praise_1','praise_3'];
  let praise = cycle[state.w % 3];
  if (!next && praise === 'praise_1') praise = cycle[(state.w - 1) % 3] === 'praise_3' ? 'praise_2' : 'praise_3';
  say(W.finale).then(()=>{ if (state.lastLine === W.finale && ov.classList.contains('show')) say(praise); });
}
function soapBubble(box){
  const R=(a,b)=>a+Math.random()*(b-a), d=R(46,130), b=document.createElement('div');
  b.className='sb'; b.style.width=b.style.height=d+'px'; b.style.setProperty('--d',d+'px'); b.style.left=R(0,88)+'%';
  b.style.animationDuration=R(7,10)+'s, '+R(2.6,4)+'s';
  b.innerHTML=`<div class="b" style="animation-delay:-${R(0,2).toFixed(2)}s"><div class="film2"></div><div class="film" style="--a0:${R(0,360)|0}deg;--sw:${R(5,9).toFixed(1)}s"></div><div class="hl1"></div><div class="hl2"></div></div>`;
  b.addEventListener('pointerdown', e=>{ e.stopPropagation(); if (b.classList.contains('popping')) return; b.classList.add('popping');
    const r=b.getBoundingClientRect(), o=box.getBoundingClientRect();
    for(let i=0;i<8;i++){ const p=document.createElement('div'), a=i/8*Math.PI*2; p.className='sbDrop';
      p.style.left=(r.left-o.left+r.width/2)+'px'; p.style.top=(r.top-o.top+r.height/2)+'px';
      p.style.setProperty('--dx',Math.cos(a)*r.width*.6+'px'); p.style.setProperty('--dy',Math.sin(a)*r.width*.6+'px');
      box.appendChild(p); setTimeout(()=>p.remove(),500); }
    setTimeout(()=>b.remove(),140); });
  box.appendChild(b); setTimeout(()=>b.remove(),11000);
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
  document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('show')); $('#bubbles').innerHTML='';
  clearTimeout(state.clipTimer); $('#rewardVid').pause(); $('#celebrate').classList.remove('vidFull');
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
