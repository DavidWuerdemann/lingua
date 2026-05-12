import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ─────────────────────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────────────────────── */
const Ctx = createContext({});
const useApp = () => useContext(Ctx);

/* ─────────────────────────────────────────────────────────────
   UI TRANSLATIONS  (EN / DE / NL / FR / ES)
───────────────────────────────────────────────────────────── */
const UI_LANGS_LIST = ["EN","DE","NL","FR","ES"];
const T = {
  EN:{
    adultMode:"Adult Mode",kidsMode:"Kids Mode",chat:"Chat",notebook:"Notebook",
    vocabSets:"Vocab Sets",wordOfDay:"Word of the Day",idiomOfDay:"Idiom of the Day",
    startChat:"Start chatting…",send:"Send",save:"Save",saved:"Saved!",clear:"Clear chat",
    summary:"Session Summary",noWords:"No words saved yet.",yourLevel:"Your Level",
    stars:"Stars",errorPatterns:"Error Patterns",dueReview:"Due for review",loading:"Thinking…",
    scenario:"Scenario",language:"Language",newSet:"New Set",import:"Import",
    flashcards:"Flashcards",practice:"Practice with Ollie",editSet:"Edit",deleteSet:"Delete",
    addWord:"Add word",wordLabel:"Word / Phrase",translLabel:"Translation",
    listenMode:"Listen & Type",speakBtn:"🔊 Speak",correct:"Correct!",tryAgain:"Try again",
    flip:"Flip",typeIt:"Type it",easy:"Easy",good:"Good",hard:"Hard",
    next:"Next",back:"Back",allDone:"All done!",
    pickLanguage:"Pick a language to practise:",funIdioms:"Fun Idioms 🌈",
    close:"Close",setName:"Set name",cancel:"Cancel",done:"Done",
    collocations:"Collocations",tip:"Tip",fix:"Correction",uiLang:"Language",idiomCat:"Category",
  },
  DE:{
    adultMode:"Erwachsenen",kidsMode:"Kinder",chat:"Chat",notebook:"Notizbuch",
    vocabSets:"Vokabeln",wordOfDay:"Wort des Tages",idiomOfDay:"Redewendung des Tages",
    startChat:"Schreib etwas…",send:"Senden",save:"Speichern",saved:"Gespeichert!",
    clear:"Chat löschen",summary:"Zusammenfassung",noWords:"Keine Wörter gespeichert.",
    yourLevel:"Dein Level",stars:"Sterne",errorPatterns:"Fehlermuster",
    dueReview:"Zur Wiederholung",loading:"Denke nach…",scenario:"Szenario",language:"Sprache",
    newSet:"Neue Liste",import:"Importieren",flashcards:"Karteikarten",
    practice:"Mit Ollie üben",editSet:"Bearbeiten",deleteSet:"Löschen",
    addWord:"Wort hinzufügen",wordLabel:"Wort / Phrase",translLabel:"Übersetzung",
    listenMode:"Hören & Tippen",speakBtn:"🔊 Sprechen",correct:"Richtig!",
    tryAgain:"Nochmal",flip:"Umdrehen",typeIt:"Eintippen",easy:"Einfach",good:"Gut",
    hard:"Schwer",next:"Weiter",back:"Zurück",allDone:"Alles erledigt!",
    pickLanguage:"Wähle eine Sprache:",funIdioms:"Witzige Redewendungen 🌈",
    close:"Schließen",setName:"Listenname",cancel:"Abbrechen",done:"Fertig",
    collocations:"Kollokationen",tip:"Tipp",fix:"Korrektur",uiLang:"Sprache",idiomCat:"Kategorie",
  },
  NL:{
    adultMode:"Volwassen",kidsMode:"Kinderen",chat:"Chat",notebook:"Notitieboek",
    vocabSets:"Woordenlijsten",wordOfDay:"Woord van de dag",idiomOfDay:"Uitdrukking van de dag",
    startChat:"Begin te chatten…",send:"Sturen",save:"Opslaan",saved:"Opgeslagen!",
    clear:"Chat wissen",summary:"Samenvatting",noWords:"Geen woorden opgeslagen.",
    yourLevel:"Jouw niveau",stars:"Sterren",errorPatterns:"Foutpatronen",
    dueReview:"Voor herhaling",loading:"Bezig…",scenario:"Scenario",language:"Taal",
    newSet:"Nieuwe lijst",import:"Importeren",flashcards:"Flashkaarten",
    practice:"Oefenen met Ollie",editSet:"Bewerken",deleteSet:"Verwijderen",
    addWord:"Woord toevoegen",wordLabel:"Woord / Zin",translLabel:"Vertaling",
    listenMode:"Luisteren & Typen",speakBtn:"🔊 Spreken",correct:"Correct!",
    tryAgain:"Probeer opnieuw",flip:"Omdraaien",typeIt:"Intypen",easy:"Makkelijk",
    good:"Goed",hard:"Moeilijk",next:"Volgende",back:"Terug",allDone:"Alles klaar!",
    pickLanguage:"Kies een taal:",funIdioms:"Grappige uitdrukkingen 🌈",
    close:"Sluiten",setName:"Lijstnaam",cancel:"Annuleren",done:"Klaar",
    collocations:"Collocaties",tip:"Tip",fix:"Correctie",uiLang:"Taal",idiomCat:"Categorie",
  },
  FR:{
    adultMode:"Adultes",kidsMode:"Enfants",chat:"Chat",notebook:"Carnet",
    vocabSets:"Listes vocab",wordOfDay:"Mot du jour",idiomOfDay:"Expression du jour",
    startChat:"Commencez à chatter…",send:"Envoyer",save:"Enregistrer",saved:"Enregistré!",
    clear:"Effacer le chat",summary:"Résumé",noWords:"Aucun mot enregistré.",
    yourLevel:"Votre niveau",stars:"Étoiles",errorPatterns:"Erreurs fréquentes",
    dueReview:"À réviser",loading:"Réflexion…",scenario:"Scénario",language:"Langue",
    newSet:"Nouvelle liste",import:"Importer",flashcards:"Fiches",
    practice:"Pratiquer avec Ollie",editSet:"Modifier",deleteSet:"Supprimer",
    addWord:"Ajouter un mot",wordLabel:"Mot / Phrase",translLabel:"Traduction",
    listenMode:"Écouter & Taper",speakBtn:"🔊 Écouter",correct:"Correct!",
    tryAgain:"Réessayer",flip:"Retourner",typeIt:"Taper",easy:"Facile",good:"Bien",
    hard:"Difficile",next:"Suivant",back:"Retour",allDone:"Tout fait!",
    pickLanguage:"Choisissez une langue:",funIdioms:"Expressions amusantes 🌈",
    close:"Fermer",setName:"Nom de la liste",cancel:"Annuler",done:"Terminé",
    collocations:"Collocations",tip:"Conseil",fix:"Correction",uiLang:"Langue",idiomCat:"Catégorie",
  },
  ES:{
    adultMode:"Adultos",kidsMode:"Niños",chat:"Chat",notebook:"Cuaderno",
    vocabSets:"Vocabulario",wordOfDay:"Palabra del día",idiomOfDay:"Expresión del día",
    startChat:"Empieza a chatear…",send:"Enviar",save:"Guardar",saved:"¡Guardado!",
    clear:"Borrar chat",summary:"Resumen",noWords:"No hay palabras guardadas.",
    yourLevel:"Tu nivel",stars:"Estrellas",errorPatterns:"Patrones de error",
    dueReview:"Para repasar",loading:"Pensando…",scenario:"Escenario",language:"Idioma",
    newSet:"Nueva lista",import:"Importar",flashcards:"Tarjetas",
    practice:"Practicar con Ollie",editSet:"Editar",deleteSet:"Eliminar",
    addWord:"Añadir palabra",wordLabel:"Palabra / Frase",translLabel:"Traducción",
    listenMode:"Escuchar y escribir",speakBtn:"🔊 Hablar",correct:"¡Correcto!",
    tryAgain:"Inténtalo de nuevo",flip:"Voltear",typeIt:"Escribirlo",easy:"Fácil",
    good:"Bien",hard:"Difícil",next:"Siguiente",back:"Atrás",allDone:"¡Todo listo!",
    pickLanguage:"Elige un idioma:",funIdioms:"Expresiones divertidas 🌈",
    close:"Cerrar",setName:"Nombre de lista",cancel:"Cancelar",done:"Hecho",
    collocations:"Colocaciones",tip:"Consejo",fix:"Corrección",uiLang:"Idioma",idiomCat:"Categoría",
  },
};

/* ─────────────────────────────────────────────────────────────
   LANGUAGES  (8 × 11 scenarios)
───────────────────────────────────────────────────────────── */
const SCENARIOS = [
  "At the Airport","At the Hotel","Ordering Food","Shopping","Asking Directions",
  "Doctor's Visit","Job Interview","Making Friends","Real Estate","Business Negotiation","On a Film Set",
];
const LANGUAGES = [
  {code:"es",name:"Spanish 🇪🇸",tts:"es-ES",scenarios:SCENARIOS},
  {code:"fr",name:"French 🇫🇷",tts:"fr-FR",scenarios:SCENARIOS},
  {code:"de",name:"German 🇩🇪",tts:"de-DE",scenarios:SCENARIOS},
  {code:"it",name:"Italian 🇮🇹",tts:"it-IT",scenarios:SCENARIOS},
  {code:"pt",name:"Portuguese 🇧🇷",tts:"pt-BR",scenarios:SCENARIOS},
  {code:"nl",name:"Dutch 🇳🇱",tts:"nl-NL",scenarios:SCENARIOS},
  {code:"ja",name:"Japanese 🇯🇵",tts:"ja-JP",scenarios:SCENARIOS},
  {code:"zh",name:"Chinese 🇨🇳",tts:"zh-CN",scenarios:SCENARIOS},
];

/* ─────────────────────────────────────────────────────────────
   KIDS
───────────────────────────────────────────────────────────── */
const KIDS_LANGS = [
  {code:"en",name:"English 🇬🇧",tts:"en-GB"},
  {code:"es",name:"Spanish 🇪🇸",tts:"es-ES"},
  {code:"de",name:"German 🇩🇪",tts:"de-DE"},
];
const KIDS_TOPICS = [
  "Animals 🐾","Colors 🎨","Numbers 🔢","Food & Drinks 🍕","Family 👨‍👩‍👧","Body Parts 🦷",
  "Weather ☀️","Clothes 👗","School 🏫","Sports ⚽","Nature 🌳","Emotions 😊","Fun Idioms 🌈",
];

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const IDIOM_CATS = ["Business","Travel","Emotions","Nature","Pop Culture"];
const LEVEL_THRESHOLDS = [0,50,150,300,500,750,1050,1400,1800,2250,2750,3300,3900,4550,5250];
const LEVEL_NAMES = [
  "Newcomer","Wanderer","Explorer","Adventurer","Conversationalist",
  "Storyteller","Connector","Navigator","Linguist","Polyglot",
  "Scholar","Maestro","Expert","Master","Legend",
];

/* ─────────────────────────────────────────────────────────────
   STORAGE KEYS
───────────────────────────────────────────────────────────── */
const SK_NB    = "lingua_notebook";
const SK_KIDNB = "lingua_kidnb";
const SK_STARS = "lingua_stars";
const SK_ERRS  = "lingua_errors";
const SK_WOD   = "lingua_wod";
const SK_IDIOM = "lingua_idiom";
const SK_VSETS = "lingua_vsets";
const SK_UILNG = "lingua_uilang";
const SK_KIDLG = "lingua_kidlang";

/* ─────────────────────────────────────────────────────────────
   STORAGE UTILITIES
───────────────────────────────────────────────────────────── */
const loadLS = (key, def) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
};
const saveLS = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const loadNB  = ()  => loadLS(SK_NB,  []);
const saveNB  = (v) => saveLS(SK_NB,  v);
const loadKNB = ()  => loadLS(SK_KIDNB, []);
const saveKNB = (v) => saveLS(SK_KIDNB, v);

function addAdultWord(text, lang) {
  const nb = loadNB();
  if (nb.find(w => w.text === text)) return false;
  nb.unshift({text,lang,date:new Date().toISOString(),interval:1,ease:2.5,reviewCount:0,
    lastReviewed:null,nextReview:new Date(Date.now()+86400000).toISOString()});
  saveNB(nb); return true;
}
function delAdultWord(text) { saveNB(loadNB().filter(w => w.text !== text)); }
function getDueWords(entries) {
  const now = new Date();
  return entries.filter(w => !w.nextReview || new Date(w.nextReview) <= now);
}

/* Daily caches */
const todayKey = () => new Date().toISOString().slice(0,10);
const loadWOD    = (lc)   => { const c=loadLS(SK_WOD,{}); return c[`${lc}_${todayKey()}`]||null; };
const saveWOD    = (lc,d) => { const c=loadLS(SK_WOD,{}); c[`${lc}_${todayKey()}`]=d; saveLS(SK_WOD,c); };
const loadIdiom  = (cat)  => { const c=loadLS(SK_IDIOM,{}); return c[`${cat}_${todayKey()}`]||null; };
const saveIdiom  = (cat,d)=> { const c=loadLS(SK_IDIOM,{}); c[`${cat}_${todayKey()}`]=d; saveLS(SK_IDIOM,c); };

/* Stars / level */
function getStarsData() { return loadLS(SK_STARS, {total:0,history:[]}); }
function addStarsTo(n) {
  const d = getStarsData();
  d.total += n; d.history.push({n,date:new Date().toISOString()});
  saveLS(SK_STARS, d); return d.total;
}
function computeLevel(total) {
  let lvl = 0;
  for (let i=0;i<LEVEL_THRESHOLDS.length;i++) { if (total>=LEVEL_THRESHOLDS[i]) lvl=i; }
  return lvl;
}

/* Errors */
const getErrors = () => loadLS(SK_ERRS, []);
function addError(entry) {
  const e = getErrors(); e.unshift({...entry,date:new Date().toISOString()});
  saveLS(SK_ERRS, e.slice(0,50));
}

/* Vocab Sets */
const loadVSets = () => loadLS(SK_VSETS, []);
const saveVSets = (v) => saveLS(SK_VSETS, v);

/* SM-2 lite */
function sm2Update(word, quality) {
  let ease = word.ease ?? 2.5, interval = word.interval ?? 1;
  if (quality===2) { ease=Math.min(3,ease+0.15); interval=Math.round(interval*ease); }
  else if (quality===1) { interval=Math.round(interval*1.2); }
  else { ease=Math.max(1.3,ease-0.2); interval=1; }
  return {...word,ease,interval,
    nextReview:new Date(Date.now()+interval*86400000).toISOString(),
    reviewCount:(word.reviewCount||0)+1,lastReviewed:new Date().toISOString()};
}

/* ─────────────────────────────────────────────────────────────
   AUDIO  (lazy AudioContext)
───────────────────────────────────────────────────────────── */
let _audioCtx = null;
function _getCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  if (_audioCtx.state==="suspended") _audioCtx.resume().catch(()=>{});
  return _audioCtx;
}
function playTone(freq=440,dur=0.12,type="sine",vol=0.18) {
  try {
    const c=_getCtx(), o=c.createOscillator(), g=c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type=type; o.frequency.value=freq;
    g.gain.setValueAtTime(vol,c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+dur);
    o.start(); o.stop(c.currentTime+dur);
  } catch {}
}
const sfx = {
  send:   ()=>{ playTone(600,0.07,"sine",0.12); setTimeout(()=>playTone(800,0.07,"sine",0.12),80); },
  save:   ()=>{ playTone(880,0.1,"sine",0.18); setTimeout(()=>playTone(1100,0.1,"sine",0.18),110); },
  star:   ()=>{ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.12,"sine",0.2),i*70)); },
  correct:()=>{ [523,659,784].forEach((f,i)=>setTimeout(()=>playTone(f,0.1,"sine",0.2),i*80)); },
  wrong:  ()=>{ playTone(220,0.18,"sawtooth",0.12); },
  flip:   ()=>{ playTone(700,0.07,"triangle",0.1); },
  click:  ()=>{ playTone(440,0.06,"sine",0.08); },
};
const haptic = (p=[30]) => { try { navigator.vibrate?.(p); } catch {} };

/* ─────────────────────────────────────────────────────────────
   TTS
───────────────────────────────────────────────────────────── */
function speak(text, lang="en-US", rate=0.95) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang=lang; u.rate=rate; u.pitch=1; u.volume=1;
  window.speechSynthesis.speak(u);
}

/* ─────────────────────────────────────────────────────────────
   AUTO-CORRECTION PARSER
───────────────────────────────────────────────────────────── */
function parseAiResponse(raw) {
  const m = raw.match(/<fix>([\s\S]*?)<\/fix>/);
  const text = raw.replace(/<fix>[\s\S]*?<\/fix>/g,"").trim();
  let fix = null;
  if (m) try { fix = JSON.parse(m[1].trim()); } catch {}
  return {text, fix};
}

/* ─────────────────────────────────────────────────────────────
   AI CALL  →  /api/chat
───────────────────────────────────────────────────────────── */
async function ai(messages, system="You are a helpful language tutor.", maxTokens=512) {
  const res = await fetch("/api/chat",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,system,messages}),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message||"API error");
  return data.content?.[0]?.text || "";
}

/* ─────────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Nunito:wght@400;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
:root{
  --bg:#0F1B2D;--surf:#162336;--surf2:#1D2E44;--border:#243650;
  --text:#F0EBE0;--muted:#8899AE;--gold:#C9943A;--goldl:#E5B86A;--cream:#F0EBE0;
}
html{height:-webkit-fill-available;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);-webkit-text-size-adjust:100%;min-height:-webkit-fill-available;}
button{cursor:pointer;font-family:'DM Sans',sans-serif;touch-action:manipulation;}
input,textarea,select{font-family:'DM Sans',sans-serif;font-size:16px;}
.cmsgs,.kmsgs,.vp-msgs,.editor-wrap,.knb,.scr,.vs-wrap{-webkit-overflow-scrolling:touch;}

/* LANDING */
.landing{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px;background:var(--bg);position:relative;overflow:hidden;}
.l-orb1{position:absolute;top:-120px;right:-120px;width:600px;height:600px;background:radial-gradient(circle,rgba(201,148,58,.13) 0%,transparent 65%);pointer-events:none;}
.l-orb2{position:absolute;bottom:-80px;left:-80px;width:450px;height:450px;background:radial-gradient(circle,rgba(194,99,75,.11) 0%,transparent 65%);pointer-events:none;}
.l-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(36,54,80,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(36,54,80,.35) 1px,transparent 1px);background-size:56px 56px;pointer-events:none;}
.logo-row{display:flex;align-items:center;gap:14px;margin-bottom:36px;animation:fadeUp .55s ease both;}
.logo-icon{width:56px;height:56px;background:var(--gold);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 0 36px rgba(201,148,58,.45);}
.logo-name{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:600;color:var(--cream);letter-spacing:-.5px;}
.l-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(38px,6vw,70px);font-weight:600;text-align:center;line-height:1.05;color:var(--cream);margin-bottom:16px;animation:fadeUp .55s .1s ease both;}
.l-h1 em{font-style:italic;color:var(--gold);}
.l-sub{color:var(--muted);font-size:17px;text-align:center;max-width:500px;line-height:1.65;margin-bottom:52px;animation:fadeUp .55s .2s ease both;}
.p-cards{display:flex;gap:20px;flex-wrap:wrap;justify-content:center;animation:fadeUp .55s .3s ease both;}
.p-card{background:var(--surf);border:1px solid var(--border);border-radius:24px;padding:32px 26px;width:220px;cursor:pointer;transition:all .25s;text-align:center;position:relative;overflow:hidden;}
.p-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 50%,rgba(201,148,58,.05));pointer-events:none;}
.p-card:hover,.p-card:active{border-color:var(--gold);box-shadow:0 20px 50px rgba(0,0,0,.4),0 0 0 1px rgba(201,148,58,.25);}@media(hover:hover){.p-card:hover{transform:translateY(-5px);}}
.p-card .ce{font-size:48px;margin-bottom:14px;display:block;}
.p-card h3{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--cream);margin-bottom:8px;}
.p-card p{font-size:13px;color:var(--muted);line-height:1.55;margin:0;}
.l-langs{margin-top:44px;font-size:12px;color:var(--muted);animation:fadeUp .55s .5s ease both;opacity:0;animation-fill-mode:forwards;}

/* SHELL */
.shell{min-height:100svh;display:flex;flex-direction:column;background:var(--bg);}
.topbar{background:var(--surf);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100;}
.topbar-logo{width:36px;height:36px;background:var(--gold);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;box-shadow:0 0 16px rgba(201,148,58,.3);}
.topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--cream);flex:1;}
.ghost{background:transparent;border:1px solid var(--border);border-radius:10px;padding:8px 14px;font-size:13px;color:var(--muted);transition:all .2s;min-height:38px;}
.ghost:hover{border-color:var(--muted);color:var(--cream);}
.tabs{display:flex;border-bottom:1px solid var(--border);background:var(--surf);}
.tab{flex:1;padding:12px 8px;background:none;border:none;font-size:13px;font-weight:500;color:var(--muted);border-bottom:2px solid transparent;transition:all .2s;}
.tab.on{color:var(--gold);border-bottom-color:var(--gold);}
.scr{flex:1;padding:24px 20px;max-width:840px;margin:0 auto;width:100%;}
.sh{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--cream);margin-bottom:6px;}
.ss{color:var(--muted);font-size:14px;margin-bottom:24px;}

/* LANG GRID */
.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(176px,1fr));gap:12px;margin-bottom:28px;}
.lcard{background:var(--surf);border:1px solid var(--border);border-radius:16px;padding:18px 16px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:14px;}
.lcard:hover,.lcard:active{border-color:var(--muted);}@media(hover:hover){.lcard:hover{transform:translateY(-2px);}}
.lcard.on{border-width:1.5px;}
.lflag{font-size:32px;flex-shrink:0;}
.linfo h4{font-size:15px;font-weight:600;color:var(--cream);margin-bottom:2px;}
.linfo span{font-size:12px;color:var(--muted);}
.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:10px;margin-bottom:24px;}
.sbtn{background:var(--surf);border:1px solid var(--border);border-radius:12px;padding:12px 14px;font-size:13px;font-weight:500;color:var(--muted);text-align:left;transition:all .2s;}
.sbtn:hover{color:var(--cream);border-color:var(--muted);}
.sbtn.on{color:var(--gold);border-color:var(--gold);background:rgba(201,148,58,.08);}
.cta{background:var(--gold);color:#0F1B2D;border:none;border-radius:12px;padding:14px 28px;font-size:15px;font-weight:600;transition:all .2s;box-shadow:0 4px 20px rgba(201,148,58,.3);}
.cta:hover{background:var(--goldl);transform:translateY(-1px);}
.cta:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none;}

/* WOD */
.wod-card{background:linear-gradient(135deg,var(--surf),var(--surf2));border:1px solid var(--border);border-radius:20px;padding:28px 24px;position:relative;overflow:hidden;margin-bottom:20px;}
.wod-card::before{content:'';position:absolute;top:-50px;right:-50px;width:220px;height:220px;background:radial-gradient(circle,rgba(201,148,58,.15) 0%,transparent 65%);pointer-events:none;}
.wod-ltabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px;}
.wod-ltab{background:var(--surf2);border:1px solid var(--border);border-radius:20px;padding:5px 13px;font-size:12px;cursor:pointer;color:var(--muted);transition:all .15s;}
.wod-ltab.on{background:rgba(201,148,58,.14);border-color:rgba(201,148,58,.4);color:var(--gold);}
.wod-word{font-family:'Cormorant Garamond',serif;font-size:50px;font-weight:600;color:var(--cream);line-height:1.05;margin-bottom:4px;}
.wod-ph{font-size:15px;color:var(--gold);font-style:italic;margin-bottom:10px;}
.wod-tr{font-size:18px;color:var(--muted);margin-bottom:18px;}
.wod-ex{background:rgba(255,255,255,.04);border-left:3px solid var(--gold);padding:12px 16px;border-radius:0 10px 10px 0;font-size:14px;color:var(--cream);line-height:1.65;margin-bottom:12px;}
.wod-fact{font-size:13px;color:var(--muted);line-height:1.55;font-style:italic;}
.wod-save{background:rgba(201,148,58,.12);border:1px solid rgba(201,148,58,.3);border-radius:10px;padding:7px 16px;font-size:13px;color:var(--gold);margin-top:16px;transition:all .15s;}
.wod-save:hover{background:rgba(201,148,58,.22);}

/* ──── IDIOMS ──── */
.idiom-card{background:linear-gradient(135deg,var(--surf),var(--surf2));border:1px solid var(--border);border-radius:20px;padding:28px 24px;position:relative;overflow:hidden;margin-bottom:16px;}
.idiom-card::before{content:'';position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,rgba(107,143,113,.18) 0%,transparent 65%);pointer-events:none;}
.idiom-category{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.idiom-cat-pill{background:rgba(107,143,113,.2);border:1px solid rgba(107,143,113,.35);border-radius:20px;padding:2px 10px;font-size:11px;color:#8FBF97;}
.idiom-phrase{font-family:'Cormorant Garamond',serif;font-size:clamp(24px,4vw,38px);font-weight:600;color:var(--cream);line-height:1.15;margin-bottom:6px;}
.idiom-phonetic{font-size:14px;color:var(--gold);font-style:italic;margin-bottom:10px;}
.idiom-meaning{font-size:16px;color:var(--muted);margin-bottom:6px;line-height:1.5;}
.idiom-literal{font-size:13px;color:var(--muted);font-style:italic;margin-bottom:16px;opacity:.7;}
.idiom-ex{background:rgba(255,255,255,.04);border-left:3px solid #6B8F71;padding:12px 16px;border-radius:0 10px 10px 0;font-size:14px;color:var(--cream);line-height:1.65;margin-bottom:10px;}
.idiom-usage{font-size:13px;color:var(--muted);line-height:1.55;margin-bottom:14px;}
.idiom-save{background:rgba(107,143,113,.15);border:1px solid rgba(107,143,113,.35);border-radius:10px;padding:7px 16px;font-size:13px;color:#8FBF97;margin-top:4px;transition:all .15s;}
.idiom-save:hover{background:rgba(107,143,113,.28);}
.idiom-filter-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.idiom-filter{background:var(--surf);border:1px solid var(--border);border-radius:20px;padding:5px 13px;font-size:12px;cursor:pointer;color:var(--muted);transition:all .15s;}
.idiom-filter.on{background:rgba(107,143,113,.15);border-color:rgba(107,143,113,.4);color:#8FBF97;}
.loading-row{display:flex;gap:8px;align-items:center;color:var(--muted);font-size:14px;padding:16px 0;}

/* NOTEBOOK */
.nb-empty{text-align:center;padding:60px 20px;}
.nb-empty .ei{font-size:52px;margin-bottom:12px;}
.nb-empty p{color:var(--muted);font-size:15px;}
.nb-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.nbf{background:var(--surf);border:1px solid var(--border);border-radius:20px;padding:5px 13px;font-size:12px;cursor:pointer;color:var(--muted);transition:all .15s;}
.nbf.on{background:rgba(201,148,58,.12);border-color:rgba(201,148,58,.4);color:var(--gold);}
.wcs{display:grid;gap:10px;}
.wc{background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:16px 18px;display:flex;align-items:flex-start;gap:14px;}
.wc-flag{font-size:22px;flex-shrink:0;margin-top:2px;}
.wc-b{flex:1;min-width:0;}
.wc-w{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--cream);margin-bottom:2px;}
.wc-ph{font-size:12px;color:var(--gold);font-style:italic;margin-bottom:4px;}
.wc-tr{font-size:14px;color:var(--muted);margin-bottom:6px;}
.wc-ctx{font-size:12px;color:var(--muted);background:rgba(255,255,255,.04);border-radius:8px;padding:6px 10px;line-height:1.5;}
.wc-meta{font-size:11px;color:var(--muted);margin-top:6px;opacity:.6;}
.wc-del{background:none;border:none;color:var(--muted);font-size:18px;padding:4px 6px;border-radius:6px;transition:all .15s;flex-shrink:0;}
.wc-del:hover{color:#FF6B6B;background:rgba(255,107,107,.1);}

/* CHAT */
.cshell{display:flex;flex-direction:column;height:calc(100svh - 62px);}
.cinfo{background:var(--surf2);border-bottom:1px solid var(--border);padding:10px 20px;display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted);flex-wrap:wrap;}
.ctag{background:rgba(201,148,58,.12);border:1px solid rgba(201,148,58,.3);border-radius:20px;padding:3px 12px;font-size:12px;color:var(--gold);}
.cmsgs{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}
.cmsgs::-webkit-scrollbar{width:3px;}
.cmsgs::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}
.mrow{display:flex;gap:10px;animation:fadeUp .25s ease;}
.mrow.user{flex-direction:row-reverse;}
.mav{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;background:var(--surf2);border:1px solid var(--border);}
.mcol{max-width:76%;display:flex;flex-direction:column;gap:5px;}
.mrow.user .mcol{align-items:flex-end;}
.bub{padding:12px 16px;border-radius:18px;font-size:15px;line-height:1.6;}
.mrow.user      .bub{background:var(--gold);color:#0F1B2D;border-bottom-right-radius:4px;font-weight:500;}
.mrow.assistant .bub{background:var(--surf2);border:1px solid var(--border);border-bottom-left-radius:4px;}
.macts{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;-webkit-overflow-scrolling:touch;scrollbar-width:none;white-space:nowrap;}
.mact{background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;padding:6px 12px;font-size:12px;color:var(--muted);transition:all .15s;flex-shrink:0;min-height:32px;}
.mact:hover{border-color:var(--muted);color:var(--cream);}
.mact.on{border-color:var(--gold);color:var(--gold);background:rgba(201,148,58,.1);}
.mpanel{background:var(--surf);border:1px solid var(--border);border-radius:12px;padding:14px;font-size:13px;line-height:1.6;color:var(--cream);}
.plabel{font-size:10px;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;}
.pph{font-size:16px;color:var(--gold);font-style:italic;margin-bottom:6px;}
.ptip{color:var(--muted);font-size:13px;line-height:1.55;}
.hints{display:flex;gap:8px;flex-wrap:wrap;padding:10px 20px;border-top:1px solid var(--border);background:var(--surf);}
.hchip{background:rgba(201,148,58,.08);border:1px solid rgba(201,148,58,.2);border-radius:20px;padding:5px 12px;font-size:12px;color:var(--gold);transition:all .15s;}
.hchip:hover{background:rgba(201,148,58,.18);}
.iarea{padding:14px 20px;background:var(--surf);border-top:1px solid var(--border);}
.irow{display:flex;gap:10px;align-items:flex-end;}
.cinput{flex:1;background:var(--surf2);border:1px solid var(--border);border-radius:14px;padding:12px 16px;font-size:15px;color:var(--cream);resize:none;min-height:48px;max-height:120px;outline:none;transition:border-color .2s;line-height:1.4;}
.cinput::placeholder{color:var(--muted);}
.cinput:focus{border-color:var(--gold);}
.sbtn-send{width:48px;height:48px;background:var(--gold);border:none;border-radius:14px;color:#0F1B2D;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;box-shadow:0 4px 16px rgba(201,148,58,.3);}
.sbtn-send:hover:not(:disabled){box-shadow:0 6px 24px rgba(201,148,58,.4);transform:translateY(-1px);}
.sbtn-send:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none;}

/* MODAL */
.mbdrop{position:fixed;inset:0;background:rgba(10,16,26,.82);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:var(--surf);border:1px solid var(--border);border-radius:20px;padding:28px;width:100%;max-width:420px;animation:scaleIn .2s ease;}
.modal h3{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--cream);margin-bottom:6px;}
.modal p{font-size:13px;color:var(--muted);margin-bottom:20px;line-height:1.5;}
.minput{width:100%;background:var(--surf2);border:1px solid var(--border);border-radius:12px;padding:11px 14px;font-size:15px;color:var(--cream);outline:none;margin-bottom:10px;transition:border-color .2s;}
.minput::placeholder{color:var(--muted);}
.minput:focus{border-color:var(--gold);}
.mrow2{display:flex;gap:10px;}
.mcancel{flex:1;background:transparent;border:1px solid var(--border);border-radius:12px;padding:11px;font-size:14px;color:var(--muted);transition:all .2s;}
.mcancel:hover{border-color:var(--muted);color:var(--cream);}
.msave{flex:1;background:var(--gold);border:none;border-radius:12px;padding:11px;font-size:14px;font-weight:600;color:#0F1B2D;transition:all .2s;}
.msave:hover{background:var(--goldl);}

/* ──────────── KIDS ──────────── */
.ks{min-height:100svh;display:flex;flex-direction:column;background:#FFF8F0;font-family:'Nunito',sans-serif;}
.kh{background:#1C1917;padding:14px 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100;}
.kh h2{font-family:'Nunito',sans-serif;font-weight:800;font-size:18px;color:white;flex:1;}
.ktabs{display:flex;background:#231D16;border-bottom:2px solid #3A2E25;}
.ktab{flex:1;padding:11px;background:none;border:none;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,.45);border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s;}
.ktab.on{color:#FECA57;border-bottom-color:#FECA57;}
.kwel{padding:22px 20px 0;max-width:700px;margin:0 auto;width:100%;}
.kwel h1{font-family:'Nunito',sans-serif;font-weight:900;font-size:26px;color:#1C1917;margin-bottom:4px;}
.kwel p{font-size:13px;color:#78716C;}
.ktgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:12px;padding:18px 20px;max-width:700px;margin:0 auto;width:100%;}
.tcard{border-radius:18px;padding:20px 12px;cursor:pointer;border:none;font-family:'Nunito',sans-serif;font-weight:800;font-size:14px;text-align:center;transition:all .2s;color:white;display:flex;flex-direction:column;align-items:center;gap:8px;box-shadow:0 4px 0 rgba(0,0,0,.2);}
.tcard:hover,.tcard:active{box-shadow:0 7px 0 rgba(0,0,0,.2);}@media(hover:hover){.tcard:hover{transform:translateY(-3px);}}
.tcard:active{transform:translateY(1px);box-shadow:0 2px 0 rgba(0,0,0,.2);}
.temoji{font-size:34px;}
.kcshell{display:flex;flex-direction:column;flex:1;height:calc(100svh - 112px);}
.kmsgs{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:12px;max-width:700px;margin:0 auto;width:100%;}
.kmsg{display:flex;gap:10px;animation:fadeUp .25s ease;}
.kmsg.user{flex-direction:row-reverse;}
.kav{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.kbub{max-width:78%;padding:12px 16px;border-radius:20px;font-size:16px;line-height:1.5;font-weight:600;}
.kmsg.user      .kbub{background:#1C1917;color:white;border-bottom-right-radius:4px;}
.kmsg.assistant .kbub{background:white;border:2px solid #E8E0D5;color:#1C1917;border-bottom-left-radius:4px;}
.ksavebtn{background:rgba(254,202,87,.2);border:1.5px solid rgba(254,202,87,.5);border-radius:8px;padding:4px 10px;font-size:11px;font-family:'Nunito',sans-serif;font-weight:700;color:#C9943A;margin-top:5px;transition:all .15s;}
.ksavebtn:hover{background:rgba(254,202,87,.35);}
.kiarea{background:white;border-top:2px solid #E8E0D5;padding:12px 20px;max-width:700px;margin:0 auto;width:100%;}
.kirow{display:flex;gap:10px;align-items:center;}
.kinput{flex:1;border:2px solid #E8E0D5;border-radius:16px;padding:11px 16px;font-size:16px;font-family:'Nunito',sans-serif;font-weight:700;background:#FFF8F0;color:#1C1917;outline:none;transition:border-color .2s;}
.kinput:focus{border-color:#1C1917;}
.ksendbtn{width:48px;height:48px;border-radius:50%;border:none;font-size:22px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 0 rgba(0,0,0,.2);transition:all .15s;color:white;}
.ksendbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 5px 0 rgba(0,0,0,.2);}
.ksendbtn:disabled{opacity:.4;cursor:not-allowed;}
.knb{padding:20px;max-width:700px;margin:0 auto;width:100%;}
.knb h2{font-family:'Nunito',sans-serif;font-weight:900;font-size:22px;color:#1C1917;margin-bottom:4px;}
.knb p{font-size:13px;color:#78716C;margin-bottom:20px;}
.kwcard{background:white;border:2px solid #E8E0D5;border-radius:16px;padding:16px;margin-bottom:10px;display:flex;align-items:flex-start;gap:12px;}
.kwe{font-size:28px;flex-shrink:0;}
.kwb{flex:1;}
.kww{font-family:'Nunito',sans-serif;font-weight:900;font-size:18px;color:#1C1917;margin-bottom:3px;}
.kwd{font-size:14px;color:#78716C;line-height:1.5;}
.kwdate{font-size:11px;color:#B8AFA8;margin-top:4px;}
.kwdel{background:none;border:none;font-size:18px;color:#B8AFA8;padding:4px;border-radius:8px;transition:all .15s;flex-shrink:0;}
.kwdel:hover{color:#FF6B6B;background:rgba(255,107,107,.1);}
.knempty{text-align:center;padding:48px 20px;}
.knempty .ei{font-size:52px;margin-bottom:12px;}
.knempty p{font-size:15px;color:#78716C;font-family:'Nunito',sans-serif;font-weight:700;}
.kids-modal{background:#FFF8F0;border:2px solid #E8E0D5;}
.kids-mh3{font-family:'Nunito',sans-serif;color:#1C1917 !important;}
.kids-mp{color:#78716C !important;}
.kids-minput{background:white !important;border:2px solid #E8E0D5 !important;color:#1C1917 !important;}
.kids-minput::placeholder{color:#B8AFA8 !important;}
.kids-minput:focus{border-color:#1C1917 !important;}

/* ──── KIDS HOME ──── */
.kids-home-section{padding:22px 20px 24px;max-width:700px;margin:0 auto;width:100%;}
.kids-section-label{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#A09080;font-family:'Nunito',sans-serif;margin-bottom:4px;}
.kids-section-title{font-family:'Nunito',sans-serif;font-weight:900;font-size:24px;color:#1C1917;margin-bottom:6px;}
.kids-section-sub{font-size:13px;color:#78716C;margin-bottom:16px;line-height:1.5;}
.kids-sets-section{background:#F0E8DF;border-top:2px solid #E0D4C8;padding:22px 20px 28px;max-width:100%;}
.kids-sets-inner{max-width:700px;margin:0 auto;}

/* ──── VOCAB SETS ──── */
.vs-wrap{padding:20px;max-width:700px;margin:0 auto;width:100%;}
.vs-header{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.vs-header h2{font-family:'Nunito',sans-serif;font-weight:900;font-size:22px;color:#1C1917;flex:1;}
.vs-add-btn{background:#1C1917;color:white;border:none;border-radius:12px;padding:8px 16px;font-size:14px;font-family:'Nunito',sans-serif;font-weight:800;transition:all .2s;display:flex;align-items:center;gap:6px;}
.vs-add-btn:hover{background:#2D2520;transform:translateY(-1px);}
.vs-sub{font-size:13px;color:#78716C;margin-bottom:20px;}
.vs-empty{text-align:center;padding:48px 20px;background:white;border:2px dashed #E8E0D5;border-radius:20px;}
.vs-empty .ei{font-size:52px;margin-bottom:12px;}
.vs-empty p{font-size:15px;color:#78716C;font-weight:700;line-height:1.6;}
.vs-empty small{display:block;font-size:13px;color:#B8AFA8;margin-top:4px;font-weight:400;}
.set-card{background:white;border:2px solid #E8E0D5;border-radius:20px;padding:18px;margin-bottom:12px;transition:all .2s;overflow:hidden;position:relative;}
.set-card:hover{box-shadow:0 6px 20px rgba(0,0,0,.08);}
.set-card-top{display:flex;align-items:flex-start;gap:14px;}
.set-color-dot{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.set-info{flex:1;min-width:0;}
.set-name{font-family:'Nunito',sans-serif;font-weight:900;font-size:17px;color:#1C1917;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.set-meta{font-size:12px;color:#78716C;}
.set-actions{display:flex;gap:8px;margin-top:14px;}
.set-practice-btn{flex:1;background:#1C1917;color:white;border:none;border-radius:12px;padding:10px 14px;font-size:14px;font-family:'Nunito',sans-serif;font-weight:800;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px;}
.set-practice-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.2);}
.set-edit-btn{background:#FFF8F0;border:2px solid #E8E0D5;border-radius:12px;padding:10px 14px;font-size:14px;font-family:'Nunito',sans-serif;font-weight:700;color:#78716C;transition:all .2s;}
.set-edit-btn:hover{border-color:#1C1917;color:#1C1917;}
.word-pills{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;}
.word-pill{background:#FFF8F0;border:1.5px solid #E8E0D5;border-radius:20px;padding:3px 10px;font-size:12px;font-family:'Nunito',sans-serif;font-weight:700;color:#5A5048;}
.word-pill.more{color:#B8AFA8;border-style:dashed;}

/* ──── SET EDITOR ──── */
.editor-wrap{flex:1;overflow-y:auto;padding:20px;max-width:700px;margin:0 auto;width:100%;}
.editor-wrap h2{font-family:'Nunito',sans-serif;font-weight:900;font-size:22px;color:#1C1917;margin-bottom:4px;}
.editor-wrap p{font-size:13px;color:#78716C;margin-bottom:20px;}
.editor-field-label{font-size:12px;font-weight:800;color:#5A5048;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;font-family:'Nunito',sans-serif;}
.editor-name-input{width:100%;border:2px solid #E8E0D5;border-radius:14px;padding:13px 16px;font-size:17px;font-family:'Nunito',sans-serif;font-weight:800;background:#FFF8F0;color:#1C1917;outline:none;transition:border-color .2s;margin-bottom:20px;}
.editor-name-input:focus{border-color:#1C1917;}
.editor-name-input::placeholder{color:#C8BEB8;font-weight:600;}
.color-picker{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px;}
.color-dot{width:32px;height:32px;border-radius:50%;cursor:pointer;transition:all .2s;border:3px solid transparent;}
.color-dot.sel{transform:scale(1.2);border-color:white;box-shadow:0 0 0 2px #1C1917;}
.words-section-header{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.words-section-header h3{font-family:'Nunito',sans-serif;font-weight:900;font-size:17px;color:#1C1917;flex:1;}
.word-count-badge{background:#1C1917;color:white;border-radius:20px;padding:3px 10px;font-size:12px;font-family:'Nunito',sans-serif;font-weight:800;}
.word-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;animation:fadeUp .2s ease;}
.word-row-num{width:24px;font-size:13px;color:#B8AFA8;font-family:'Nunito',sans-serif;font-weight:700;text-align:right;flex-shrink:0;}
.word-input{flex:1;border:2px solid #E8E0D5;border-radius:12px;padding:10px 14px;font-size:15px;font-family:'Nunito',sans-serif;font-weight:700;background:white;color:#1C1917;outline:none;transition:border-color .2s;}
.word-input:focus{border-color:#1C1917;}
.word-input::placeholder{color:#C8BEB8;font-weight:500;}
.word-input.hint-inp{background:#FFFBF5;}
.word-del-btn{width:32px;height:32px;background:none;border:1.5px solid #E8E0D5;border-radius:8px;color:#B8AFA8;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.word-del-btn:hover{border-color:#FF6B6B;color:#FF6B6B;background:rgba(255,107,107,.08);}
.add-word-btn{width:100%;border:2px dashed #E8E0D5;border-radius:14px;padding:12px;background:white;color:#B8AFA8;font-size:14px;font-family:'Nunito',sans-serif;font-weight:700;transition:all .2s;margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:6px;}
.add-word-btn:hover{border-color:#1C1917;color:#1C1917;background:#FFF8F0;}
.col-labels{display:grid;grid-template-columns:24px 1fr 1fr 32px;gap:8px;margin-bottom:6px;}
.col-label{font-size:11px;font-weight:800;color:#B8AFA8;text-transform:uppercase;letter-spacing:.06em;font-family:'Nunito',sans-serif;}
.editor-save-btn{width:100%;background:#1C1917;color:white;border:none;border-radius:14px;padding:14px;font-size:16px;font-family:'Nunito',sans-serif;font-weight:900;transition:all .2s;box-shadow:0 4px 0 rgba(0,0,0,.2);margin-bottom:8px;}
.editor-save-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 0 rgba(0,0,0,.2);}
.editor-save-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.editor-delete-btn{width:100%;background:none;border:2px solid #E8E0D5;border-radius:14px;padding:12px;font-size:14px;font-family:'Nunito',sans-serif;font-weight:700;color:#B8AFA8;transition:all .2s;margin-bottom:24px;}
.editor-delete-btn:hover{border-color:#FF6B6B;color:#FF6B6B;}

/* ──── FILE UPLOAD ──── */
.upload-zone{border:2.5px dashed #D0C8C0;border-radius:18px;padding:28px 20px;text-align:center;background:white;cursor:pointer;transition:all .25s;margin-bottom:20px;position:relative;}
.upload-zone:hover,.upload-zone.drag{border-color:#1C1917;background:#FFF8F0;}
.upload-zone.drag{border-style:solid;transform:scale(1.01);}
.upload-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
.upload-icon{font-size:36px;margin-bottom:10px;}
.upload-title{font-family:'Nunito',sans-serif;font-weight:900;font-size:16px;color:#1C1917;margin-bottom:4px;}
.upload-sub{font-size:13px;color:#78716C;line-height:1.55;}
.upload-formats{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:12px;}
.upload-fmt{background:#F0EBE5;border-radius:6px;padding:3px 8px;font-size:11px;font-family:'Nunito',sans-serif;font-weight:800;color:#78716C;}
.parse-preview{background:white;border:2px solid #E8E0D5;border-radius:16px;padding:16px;margin-bottom:20px;animation:fadeUp .25s ease;}
.parse-preview-header{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.parse-preview-header h4{font-family:'Nunito',sans-serif;font-weight:900;font-size:15px;color:#1C1917;flex:1;}
.parse-status{font-size:12px;font-family:'Nunito',sans-serif;font-weight:700;padding:3px 10px;border-radius:20px;}
.parse-status.ok{background:#D4EDDA;color:#2D6A4F;}
.parse-status.warn{background:#FFF3CD;color:#856404;}
.preview-word-rows{max-height:240px;overflow-y:auto;margin-bottom:12px;}
.preview-word-row{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #F0EBE5;}
.preview-word-row:last-child{border-bottom:none;}
.preview-word{font-family:'Nunito',sans-serif;font-weight:800;font-size:14px;color:#1C1917;flex:1;}
.preview-hint{font-size:13px;color:#78716C;flex:1;font-style:italic;}
.preview-remove{width:26px;height:26px;background:none;border:1.5px solid #E8E0D5;border-radius:6px;color:#B8AFA8;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.preview-remove:hover{border-color:#FF6B6B;color:#FF6B6B;}
.parse-apply-btn{width:100%;background:#1C1917;color:white;border:none;border-radius:12px;padding:11px;font-size:14px;font-family:'Nunito',sans-serif;font-weight:900;transition:all .2s;margin-bottom:4px;}
.parse-apply-btn:hover{background:#2D2520;}
.parse-dismiss-btn{width:100%;background:none;border:none;font-size:13px;font-family:'Nunito',sans-serif;font-weight:700;color:#B8AFA8;padding:6px;}
.parse-error{background:#FFF0EE;border:2px solid #FFCCC5;border-radius:14px;padding:14px;font-size:14px;font-family:'Nunito',sans-serif;font-weight:700;color:#C2634B;margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.upload-divider{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
.upload-divider-line{flex:1;height:1.5px;background:#E8E0D5;}
.upload-divider span{font-size:12px;font-family:'Nunito',sans-serif;font-weight:700;color:#B8AFA8;}

/* ──── VOCAB PRACTICE ──── */
.vp-shell{display:flex;flex-direction:column;height:calc(100svh - 62px);}
.vp-header{background:white;border-bottom:2px solid #E8E0D5;padding:12px 20px;}
.vp-set-name{font-family:'Nunito',sans-serif;font-weight:900;font-size:16px;color:#1C1917;margin-bottom:8px;}
.progress-bar-track{background:#F0EBE5;border-radius:10px;height:8px;overflow:hidden;margin-bottom:8px;}
.progress-bar-fill{height:100%;border-radius:10px;transition:width .5s ease;}
.word-progress-pills{display:flex;gap:5px;flex-wrap:wrap;}
.wpp{border-radius:20px;padding:3px 10px;font-size:11px;font-family:'Nunito',sans-serif;font-weight:800;border:2px solid transparent;transition:all .3s;}
.wpp.done{color:white;}
.wpp.current{border-color:#1C1917;color:#1C1917;background:white;}
.wpp.todo{background:#F0EBE5;color:#B8AFA8;}
.vp-msgs{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:12px;max-width:700px;margin:0 auto;width:100%;}
.vp-input-area{background:white;border-top:2px solid #E8E0D5;padding:12px 20px;max-width:700px;margin:0 auto;width:100%;}

/* CORRECTION PILL */
.cpill{display:flex;flex-direction:column;gap:6px;margin-top:6px;max-width:92%;animation:fadeUp .35s ease;font-family:inherit;}
.cpill-header{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;}
.cpill-corrected{background:rgba(255,107,107,.12);border:1.5px solid rgba(255,107,107,.3);border-radius:10px;padding:6px 11px;font-size:13px;line-height:1.45;word-break:break-word;}
.cpill-error{font-size:11px;font-style:italic;opacity:.7;margin-top:1px;}
.cpill-variant{border-radius:10px;padding:6px 11px;font-size:12px;line-height:1.5;word-break:break-word;border:1.5px solid;}
.cpill-variant-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px;}
.cpill-variant-text{font-size:13px;}
.cpill-variant-note{font-size:11px;opacity:.7;font-style:italic;margin-top:1px;}
/* Kids theme */
.cpill.kids .cpill-corrected{background:rgba(254,202,87,.15);border-color:rgba(254,202,87,.45);color:#7A600F;}
.cpill.kids .cpill-header{color:#9A7820;}
.cpill.kids .cpill-variant{background:rgba(254,202,87,.08);border-color:rgba(254,202,87,.3);color:#7A600F;}
.cpill.kids .cpill-variant-label{color:#C9943A;}
/* Adult theme */
.cpill.adult .cpill-corrected{background:rgba(201,148,58,.1);border-color:rgba(201,148,58,.3);color:rgba(229,184,106,.9);}
.cpill.adult .cpill-header{color:rgba(201,148,58,.8);}
.cpill.adult .cpill-variant{background:rgba(201,148,58,.06);border-color:rgba(201,148,58,.2);color:rgba(229,184,106,.85);}
.cpill.adult .cpill-variant-label{color:var(--gold);}

/* ──── FLASHCARDS ──── */
.fc-shell{display:flex;flex-direction:column;height:calc(100svh - 62px);background:#FFF8F0;font-family:'Nunito',sans-serif;}
.fc-topbar{padding:14px 20px;display:flex;align-items:center;gap:10px;border-bottom:2px solid #E8E0D5;background:white;}
.fc-topbar h3{font-family:'Nunito',sans-serif;font-weight:900;font-size:16px;color:#1C1917;flex:1;}
.fc-count{font-size:13px;color:#78716C;font-weight:700;}
.fc-progress-wrap{padding:0 20px 16px;background:white;}
.fc-track{background:#F0EBE5;border-radius:10px;height:8px;overflow:hidden;margin-top:12px;}
.fc-fill{height:100%;border-radius:10px;transition:width .4s ease;}
.fc-pill-row{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}
.fc-pill{font-size:11px;font-family:'Nunito',sans-serif;font-weight:800;padding:3px 10px;border-radius:20px;transition:all .3s;}
.fc-pill.known{color:white;}
.fc-pill.left{background:#F0EBE5;color:#B8AFA8;}
.fc-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:20px;}
.fc-hint{font-size:13px;color:#B8AFA8;font-family:'Nunito',sans-serif;font-weight:700;letter-spacing:.04em;}
.fc-perspective{perspective:1000px;width:100%;max-width:380px;}
.fc-card{width:100%;min-height:200px;position:relative;transform-style:preserve-3d;transition:transform .45s cubic-bezier(.4,0,.2,1);cursor:pointer;border-radius:24px;}
.fc-card.flipped{transform:rotateY(180deg);}
.fc-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 24px;min-height:200px;}
.fc-front{background:white;border:3px solid #E8E0D5;box-shadow:0 8px 0 #D0C8C0;}
.fc-back{background:#1C1917;transform:rotateY(180deg);box-shadow:0 8px 0 rgba(0,0,0,.3);}
.fc-word{font-family:'Nunito',sans-serif;font-weight:900;font-size:clamp(22px,5vw,36px);color:#1C1917;text-align:center;line-height:1.2;margin-bottom:8px;}
.fc-tap{font-size:12px;color:#B8AFA8;font-weight:700;margin-top:8px;}
.fc-meaning{font-family:'Nunito',sans-serif;font-weight:800;font-size:clamp(18px,4vw,26px);color:white;text-align:center;line-height:1.35;}
.fc-back-label{font-size:11px;color:rgba(255,255,255,.5);font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;}
.fc-actions{display:flex;gap:12px;width:100%;max-width:380px;}
.fc-btn{flex:1;border:none;border-radius:16px;padding:14px 10px;font-family:'Nunito',sans-serif;font-weight:900;font-size:15px;transition:all .2s;box-shadow:0 4px 0 rgba(0,0,0,.15);}
.fc-btn:active{transform:translateY(2px);box-shadow:0 2px 0 rgba(0,0,0,.15);}
.fc-btn.still{background:#F0EBE5;color:#78716C;}
.fc-btn.know{background:#1DD1A1;color:white;}
.fc-btn:disabled{opacity:.4;cursor:not-allowed;}
.fc-complete{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px;text-align:center;}
.fc-complete .big-emoji{font-size:72px;margin-bottom:16px;animation:bounce2 .6s ease;}
.fc-complete h2{font-family:'Nunito',sans-serif;font-weight:900;font-size:26px;color:#1C1917;margin-bottom:8px;}
.fc-complete p{font-size:15px;color:#78716C;margin-bottom:28px;line-height:1.5;}
.fc-restart-btn{background:#1C1917;color:white;border:none;border-radius:16px;padding:14px 28px;font-size:16px;font-family:'Nunito',sans-serif;font-weight:900;box-shadow:0 4px 0 rgba(0,0,0,.2);margin-bottom:10px;width:100%;max-width:280px;}
.fc-back-btn{background:none;border:2px solid #E8E0D5;border-radius:16px;padding:12px 28px;font-size:14px;font-family:'Nunito',sans-serif;font-weight:700;color:#78716C;width:100%;max-width:280px;}
@media(max-width:600px){.fc-actions{flex-direction:column;}.fc-btn{padding:16px;}}
@keyframes bounce2{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}

/* ──── REWARDS ──── */
.stars-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:5px 11px;font-family:'Nunito',sans-serif;font-weight:900;font-size:13px;color:white;cursor:pointer;transition:all .15s;flex-shrink:0;}
.stars-badge:hover{background:rgba(255,255,255,.2);}
.stars-badge .star{font-size:14px;}
.stars-badge.adult{background:rgba(201,148,58,.15);border-color:rgba(201,148,58,.4);color:var(--gold);font-family:'DM Sans',sans-serif;font-weight:600;}
.stars-badge.adult:hover{background:rgba(201,148,58,.25);}

.star-toast{position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#1C1917;color:white;padding:14px 22px;border-radius:18px;font-family:'Nunito',sans-serif;font-weight:900;font-size:16px;z-index:300;box-shadow:0 12px 32px rgba(0,0,0,.35);display:flex;align-items:center;gap:10px;animation:toastIn .35s cubic-bezier(.34,1.56,.64,1),toastOut .35s 2.2s forwards;white-space:nowrap;}
.star-toast .big-star{font-size:24px;}
.star-toast .breakdown{font-weight:700;font-size:13px;color:#FECA57;}
.adult-shell .star-toast{background:var(--gold);color:#0F1B2D;}

.stats-modal-bg{position:fixed;inset:0;background:rgba(10,16,26,.7);backdrop-filter:blur(4px);z-index:250;display:flex;align-items:center;justify-content:center;padding:20px;}
.stats-card{background:white;border-radius:24px;padding:28px 24px;width:100%;max-width:380px;animation:scaleIn .25s ease;font-family:'Nunito',sans-serif;text-align:center;}
.stats-card.dark{background:var(--surf);color:var(--cream);font-family:'DM Sans',sans-serif;}
.stats-title{font-weight:900;font-size:22px;color:#1C1917;margin-bottom:4px;}
.stats-card.dark .stats-title{color:var(--cream);font-family:'Cormorant Garamond',serif;font-weight:600;font-size:24px;}
.stats-sub{font-size:13px;color:#78716C;margin-bottom:22px;}
.stats-card.dark .stats-sub{color:var(--muted);}
.stats-big-num{font-family:'Cormorant Garamond',serif;font-size:72px;font-weight:600;color:#C9943A;line-height:1;margin-bottom:6px;}
.stats-big-label{font-size:13px;color:#78716C;font-weight:700;margin-bottom:24px;}
.stats-card.dark .stats-big-label{color:var(--muted);}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
.stats-tile{background:#FFF8F0;border:1.5px solid #E8E0D5;border-radius:14px;padding:14px 10px;}
.stats-card.dark .stats-tile{background:var(--surf2);border-color:var(--border);}
.stats-tile-num{font-family:'Nunito',sans-serif;font-weight:900;font-size:24px;color:#1C1917;}
.stats-card.dark .stats-tile-num{font-family:'Cormorant Garamond',serif;font-weight:600;color:var(--cream);font-size:28px;}
.stats-tile-label{font-size:11px;color:#78716C;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;}
.stats-note{font-size:12px;color:#B8AFA8;font-style:italic;line-height:1.5;margin-bottom:16px;}
.stats-card.dark .stats-note{color:var(--muted);}
.stats-close{width:100%;background:#1C1917;color:white;border:none;border-radius:12px;padding:12px;font-family:'Nunito',sans-serif;font-weight:900;font-size:14px;}
.stats-card.dark .stats-close{background:var(--gold);color:#0F1B2D;font-family:'DM Sans',sans-serif;font-weight:600;}

/* Level display in stats */
.level-row{display:flex;align-items:center;gap:12px;background:#FFF8F0;border:1.5px solid #E8E0D5;border-radius:14px;padding:14px 16px;margin-bottom:16px;text-align:left;}
.stats-card.dark .level-row{background:var(--surf2);border-color:var(--border);}
.level-emoji{font-size:32px;flex-shrink:0;}
.level-info{flex:1;min-width:0;}
.level-title{font-family:'Nunito',sans-serif;font-weight:900;font-size:16px;color:#1C1917;margin-bottom:2px;}
.stats-card.dark .level-title{color:var(--cream);}
.level-label{font-size:11px;color:#78716C;font-weight:700;text-transform:uppercase;letter-spacing:.05em;}
.level-bar-wrap{margin-top:6px;}
.level-bar{background:#E8E0D5;border-radius:6px;height:6px;overflow:hidden;}
.stats-card.dark .level-bar{background:var(--border);}
.level-bar-fill{height:100%;border-radius:6px;transition:width .6s ease;}
.level-next{font-size:11px;color:#B8AFA8;margin-top:3px;}

/* Level-up celebration modal */
.levelup-bg{position:fixed;inset:0;background:rgba(10,16,26,.88);backdrop-filter:blur(6px);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px;}
.levelup-card{background:white;border-radius:28px;padding:36px 28px;width:100%;max-width:360px;text-align:center;animation:levelUpPop .5s cubic-bezier(.34,1.56,.64,1);}
.levelup-card.dark{background:#162336;}
.levelup-emoji{font-size:80px;margin-bottom:8px;display:block;animation:wiggle 1s ease .3s;}
.levelup-level{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:#C9943A;margin-bottom:6px;font-family:'Nunito',sans-serif;}
.levelup-title{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:#1C1917;margin-bottom:6px;line-height:1.1;}
.levelup-card.dark .levelup-title{color:#F0EBE0;}
.levelup-sub{font-size:12px;color:#78716C;margin-bottom:20px;font-family:'Nunito',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.08em;}
.levelup-message{font-size:17px;color:#1C1917;line-height:1.6;margin-bottom:28px;font-family:'Nunito',sans-serif;font-weight:700;}
.levelup-card.dark .levelup-message{color:#F0EBE0;}
.levelup-btn{width:100%;background:#C9943A;color:#0F1B2D;border:none;border-radius:16px;padding:16px;font-size:16px;font-family:'Nunito',sans-serif;font-weight:900;box-shadow:0 6px 0 rgba(0,0,0,.2);transition:all .15s;}
.levelup-btn:hover{transform:translateY(-2px);box-shadow:0 8px 0 rgba(0,0,0,.2);}
.levelup-btn.kids{background:#1C1917;color:white;}
.levelup-btn.kids:hover{background:#2D2520;}

@keyframes levelUpPop{from{opacity:0;transform:scale(.7);}to{opacity:1;transform:scale(1);}}
@keyframes wiggle{0%,100%{transform:rotate(0);}20%{transform:rotate(-10deg);}40%{transform:rotate(10deg);}60%{transform:rotate(-6deg);}80%{transform:rotate(6deg);}}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-20px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
@keyframes toastOut{to{opacity:0;transform:translateX(-50%) translateY(-20px);}}

/* SESSION SUMMARY */
.sum-bg{position:fixed;inset:0;background:rgba(10,16,26,.85);backdrop-filter:blur(5px);z-index:300;display:flex;align-items:flex-end;justify-content:center;padding:20px;}
.sum-card{background:white;border-radius:28px 28px 20px 20px;padding:28px 22px 32px;width:100%;max-width:500px;max-height:85vh;overflow-y:auto;animation:slideUp .35s cubic-bezier(.34,1.2,.64,1);font-family:'Nunito',sans-serif;}
.sum-card.dark{background:var(--surf);font-family:'DM Sans',sans-serif;}
.sum-header{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
.sum-emoji{font-size:36px;}
.sum-title{font-family:'Nunito',sans-serif;font-weight:900;font-size:20px;color:#1C1917;line-height:1.2;}
.sum-card.dark .sum-title{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--cream);font-weight:600;}
.sum-sub{font-size:13px;color:#78716C;margin-bottom:20px;line-height:1.5;}
.sum-card.dark .sum-sub{color:var(--muted);}
.sum-words{display:flex;flex-direction:column;gap:10px;margin-bottom:22px;}
.sum-word-row{background:#FFF8F0;border:1.5px solid #E8E0D5;border-radius:14px;padding:12px 14px;display:flex;align-items:flex-start;gap:12px;}
.sum-card.dark .sum-word-row{background:var(--surf2);border-color:var(--border);}
.sum-word-main{flex:1;}
.sum-word-text{font-weight:900;font-size:17px;color:#1C1917;margin-bottom:2px;}
.sum-card.dark .sum-word-text{color:var(--cream);}
.sum-word-meaning{font-size:13px;color:#78716C;margin-bottom:4px;}
.sum-card.dark .sum-word-meaning{color:var(--muted);}
.sum-word-example{font-size:12px;color:#78716C;font-style:italic;line-height:1.45;}
.sum-save-btn{background:rgba(201,148,58,.15);border:1px solid rgba(201,148,58,.35);border-radius:8px;padding:4px 10px;font-size:12px;font-weight:700;color:#C9943A;flex-shrink:0;transition:all .15s;}
.sum-save-btn:hover{background:rgba(201,148,58,.25);}
.sum-save-btn.saved{background:rgba(29,209,161,.12);border-color:rgba(29,209,161,.3);color:#1A7A60;}
.sum-empty{text-align:center;padding:20px;color:#78716C;font-size:14px;}
.sum-close{width:100%;background:#1C1917;color:white;border:none;border-radius:14px;padding:14px;font-weight:900;font-size:15px;font-family:'Nunito',sans-serif;}
.sum-card.dark .sum-close{background:var(--gold);color:#0F1B2D;font-family:'DM Sans',sans-serif;font-weight:600;}
.sum-loading{display:flex;align-items:center;gap:8px;color:#78716C;font-size:14px;padding:12px 0 20px;}
@keyframes slideUp{from{opacity:0;transform:translateY(60px);}to{opacity:1;transform:translateY(0);}}

/* ACTIVE RECALL */
.recall-prompt{display:flex;flex-direction:column;align-items:center;gap:14px;width:100%;max-width:380px;}
.recall-card{width:100%;border:3px solid #E8E0D5;border-radius:24px;padding:24px 20px;background:white;text-align:center;box-shadow:0 8px 0 #D0C8C0;transition:border-color .3s,background .3s;}
.recall-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#B8AFA8;margin-bottom:10px;}
.recall-hint-text{font-family:'Nunito',sans-serif;font-weight:900;font-size:clamp(18px,4vw,26px);color:#1C1917;line-height:1.3;margin-bottom:8px;}
.recall-example{font-size:13px;color:#78716C;font-style:italic;line-height:1.5;margin-bottom:12px;}
.recall-result{font-family:'Nunito',sans-serif;font-weight:900;font-size:22px;margin-top:8px;}
.recall-input{flex:1;border:2px solid #E8E0D5;border-radius:12px;padding:10px 14px;font-size:16px;font-family:'Nunito',sans-serif;font-weight:700;background:#FFF8F0;color:#1C1917;outline:none;transition:border-color .2s;}
.recall-input:focus{border-color:#1C1917;}

.dots{display:flex;gap:5px;align-items:center;padding:6px 2px;}
.dots span{width:7px;height:7px;border-radius:50%;animation:bounce 1.2s infinite;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}
.adult-dots span{background:var(--muted);}
.kids-dots  span{background:#B8AFA8;}


/* ── RESPONSIVE ── */
@media(max-width:600px){
  /* Landing */
  .l-h1{font-size:34px;}
  .l-sub{font-size:15px;}
  .p-cards{flex-direction:column;align-items:center;}
  .p-card{width:100%;max-width:340px;}

  /* Adult topbar - truncate title */
  .topbar-title{font-size:16px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
  
  /* Language grid: 2 columns on phones */
  .lgrid{grid-template-columns:repeat(2,1fr);}
  .lcard{padding:14px 12px;}
  .lflag{font-size:26px;}
  .linfo h4{font-size:14px;}

  /* Scenario grid: 2 columns */
  .sgrid{grid-template-columns:repeat(2,1fr);}

  /* Chat bubbles - wider on small screens */
  .mcol{max-width:88%;}
  .bub{font-size:14px;padding:10px 14px;}
  .hints{padding:8px 14px;gap:6px;}
  .hchip{padding:6px 10px;font-size:12px;}
  .iarea{padding:10px 14px;}
  .cinput{padding:10px 14px;font-size:16px;}
  .sbtn-send{width:44px;height:44px;}

  /* Word of day */
  .wod-word{font-size:38px;}
  .wod-ltabs{gap:6px;}
  .wod-ltab{font-size:11px;padding:4px 10px;}

  /* Set editor: stack word rows (drop hint onto second line) */
  .col-labels{display:none;}
  .word-row{flex-wrap:wrap;gap:6px;}
  .word-row-num{width:auto;margin-top:8px;}
  .word-input{min-width:0;flex:1 1 calc(50% - 30px);}
  .word-input.hint-inp{flex:1 1 100%;}
  .word-del-btn{margin-top:2px;}

  /* Kids home */
  .kids-home-section{padding:18px 16px 20px;}
  .kids-sets-section{padding:18px 16px 24px;}
  .ktgrid{grid-template-columns:repeat(3,1fr);gap:10px;padding:0 0 4px;}
  .tcard{padding:16px 8px;font-size:12px;border-radius:14px;}
  .temoji{font-size:28px;}

  /* Kids chat */
  .kbub{font-size:15px;}
  .kiarea{padding:10px 14px;}
  .kinput{padding:10px 14px;}

  /* Progress pills - scroll horizontally */
  .word-progress-pills{overflow-x:auto;flex-wrap:nowrap;-webkit-overflow-scrolling:touch;padding-bottom:4px;}
  .wpp{flex-shrink:0;}

  /* Vocab set cards */
  .set-actions{flex-direction:column;}
  .set-practice-btn,.set-edit-btn{width:100%;}

  /* Modal */
  .modal{padding:22px 18px;}
}

@media(max-width:380px){
  .ktgrid{grid-template-columns:repeat(2,1fr);}
  .lgrid{grid-template-columns:1fr;}
}

/* Tablet: comfortable 3-col topic grid */
@media(min-width:601px) and (max-width:900px){
  .ktgrid{grid-template-columns:repeat(4,1fr);}
  .lgrid{grid-template-columns:repeat(3,1fr);}
}
/* ANIMS */
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95);}to{opacity:1;transform:scale(1);}}
@keyframes bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);}}
`;

const LOGIN_CSS = `
.auth-wrap{min-height:100svh;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 20px;position:relative;overflow:hidden;}
.auth-card{background:var(--surf);border:1px solid var(--border);border-radius:24px;padding:32px 28px;width:100%;max-width:400px;animation:fadeUp .4s ease;}
.auth-logo{display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:28px;}
.auth-logo-icon{width:48px;height:48px;background:var(--gold);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 24px rgba(201,148,58,.4);}
.auth-logo-name{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:600;color:var(--cream);}
.auth-tabs{display:flex;background:var(--surf2);border-radius:14px;padding:4px;gap:4px;margin-bottom:24px;}
.auth-tab{flex:1;padding:9px;border:none;border-radius:11px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;color:var(--muted);background:transparent;}
.auth-tab.on{background:var(--gold);color:#0F1B2D;}
.auth-field{margin-bottom:14px;}
.auth-label{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;display:block;}
.auth-input{width:100%;background:var(--surf2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;font-size:16px;color:var(--cream);outline:none;transition:border-color .2s;font-family:'DM Sans',sans-serif;}
.auth-input::placeholder{color:var(--muted);}
.auth-input:focus{border-color:var(--gold);}
.auth-btn{width:100%;background:var(--gold);color:#0F1B2D;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;box-shadow:0 4px 16px rgba(201,148,58,.3);margin-top:4px;}
.auth-btn:hover{background:var(--goldl);}
.auth-btn:disabled{opacity:.45;cursor:not-allowed;}
.auth-error{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.3);border-radius:10px;padding:10px 14px;font-size:13px;color:#FF8080;margin-bottom:14px;line-height:1.45;}
.auth-divider{display:flex;align-items:center;gap:12px;margin:18px 0;}
.auth-divider-line{flex:1;height:1px;background:var(--border);}
.auth-divider span{font-size:12px;color:var(--muted);}
.auth-guest-btn{width:100%;background:transparent;border:1px solid var(--border);border-radius:12px;padding:12px;font-size:14px;color:var(--muted);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;}
.auth-guest-btn:hover{border-color:var(--muted);color:var(--cream);}
.auth-sub{font-size:12px;color:var(--muted);text-align:center;margin-top:16px;line-height:1.5;}
.auth-user-bar{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:5px 12px;cursor:pointer;transition:all .15s;}
.auth-user-bar:hover{background:rgba(255,255,255,.12);}
.auth-avatar{width:26px;height:26px;background:var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#0F1B2D;flex-shrink:0;}
.auth-name{font-size:13px;color:var(--cream);font-weight:500;max-width:100px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.auth-user-menu{position:absolute;top:56px;right:20px;background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:8px;z-index:30;min-width:160px;box-shadow:0 12px 32px rgba(0,0,0,.4);animation:scaleIn .15s ease;}
.auth-menu-item{display:block;width:100%;background:transparent;border:none;border-radius:8px;padding:9px 14px;font-size:14px;color:var(--text);cursor:pointer;text-align:left;font-family:'DM Sans',sans-serif;transition:all .15s;}
.auth-menu-item:hover{background:rgba(255,255,255,.08);}
.auth-menu-item.danger{color:#FF8080;}
.auth-menu-item.danger:hover{background:rgba(255,107,107,.1);}
`;

/* ═══════════════════════════════════════════════════════════
   SMALL SHARED COMPONENTS
═══════════════════════════════════════════════════════════ */
function Dots() {
  return <div className="dots"><span/><span/><span/></div>;
}

function OllieAvatar({animate}) {
  const [blink, setBlink] = useState(false);
  useEffect(()=>{
    const t = setInterval(()=>{ setBlink(true); setTimeout(()=>setBlink(false),140); },2600);
    return ()=>clearInterval(t);
  },[]);
  return (
    <svg className="ollie-avatar" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="owlBody" cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#D4A870"/>
          <stop offset="100%" stopColor="#C49570"/>
        </radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="40" cy="52" rx="20" ry="21" fill="url(#owlBody)"/>
      {/* Head */}
      <circle cx="40" cy="29" r="17" fill="url(#owlBody)"/>
      {/* Ear tufts */}
      <path d="M29,15 L25,6 L33,13 Z" fill="#B8845A"/>
      <path d="M51,15 L55,6 L47,13 Z" fill="#B8845A"/>
      {/* Face disk */}
      <ellipse cx="40" cy="30" rx="12" ry="11" fill="#EDD8B0"/>
      {/* Eyes */}
      <circle cx="34.5" cy="27" r="5" fill="white"/>
      <circle cx="45.5" cy="27" r="5" fill="white"/>
      {blink
        ? <><line x1="30" y1="27" x2="39" y2="27" stroke="#2D1A0A" strokeWidth="2.2" strokeLinecap="round"/>
             <line x1="41" y1="27" x2="50" y2="27" stroke="#2D1A0A" strokeWidth="2.2" strokeLinecap="round"/></>
        : <><circle cx="34.5" cy="27" r="3" fill="#2D1A0A"/>
             <circle cx="45.5" cy="27" r="3" fill="#2D1A0A"/>
             <circle cx="36" cy="25.5" r="1.1" fill="white"/>
             <circle cx="47" cy="25.5" r="1.1" fill="white"/></>
      }
      {/* Beak */}
      <path d="M37,33 L40,37.5 L43,33 Z" fill="#E8943B"/>
      {/* Wings */}
      <path d="M20,52 Q15,64 24,69 L29,57 Z" fill="#B8845A"/>
      <path d="M60,52 Q65,64 56,69 L51,57 Z" fill="#B8845A"/>
      {/* Chest */}
      <ellipse cx="40" cy="58" rx="11" ry="9" fill="#EDD8B0"/>
      {/* Smile when animate */}
      <path d={animate?"M36,41 Q40,45 44,41":"M36,40 Q40,43 44,40"} stroke="#B8845A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Feet */}
      <path d="M31,72 L29,78 M35,72 L34,78 M39,72 L40,78" stroke="#E8943B" strokeWidth="2" strokeLinecap="round"/>
      <path d="M49,72 L51,78 M45,72 L45,78 M41,72 L40,78" stroke="#E8943B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function UiLangPicker({uiLang, setUiLang}) {
  return (
    <div className="ui-lang-picker">
      {UI_LANGS_LIST.map(l=>(
        <button key={l} className={`ui-lang-btn${uiLang===l?" active":""}`}
          onClick={()=>{ setUiLang(l); saveLS(SK_UILNG,l); sfx.click(); }}>
          {l}
        </button>
      ))}
    </div>
  );
}

function LevelBadge({stars}) {
  const lvl  = computeLevel(stars);
  const name = LEVEL_NAMES[lvl];
  const curr = LEVEL_THRESHOLDS[lvl];
  const next = LEVEL_THRESHOLDS[lvl+1] ?? curr+1000;
  const pct  = Math.min(100,((stars-curr)/(next-curr))*100);
  return (
    <div className="stars-bar">
      <span className="star-ct">⭐ {stars}</span>
      <span className="lvl-badge">{name}</span>
      <div className="prog-bar"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
      <span style={{fontSize:"0.68rem",color:"var(--muted)"}}>Lv{lvl+1}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WORD OF DAY
═══════════════════════════════════════════════════════════ */
function WordOfDay({langCode, t}) {
  const [data,setData]       = useState(null);
  const [loading,setLoading] = useState(false);
  const lang = LANGUAGES.find(l=>l.code===langCode);

  useEffect(()=>{
    const cached = loadWOD(langCode);
    if (cached) { setData(cached); return; }
    setLoading(true);
    ai([{role:"user",content:`Give me one interesting ${lang?.name||langCode} word of the day. Reply ONLY valid JSON with these keys: word, pos (part of speech), definition (in English), example (sentence in ${lang?.name||langCode}), collocations (array of 4 common collocations in ${lang?.name||langCode}).`}],
       "You are a language expert. Output only valid JSON, no markdown.",300)
      .then(raw=>{ const m=raw.match(/\{[\s\S]*\}/); if(m){const d=JSON.parse(m[0]);saveWOD(langCode,d);setData(d);} })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[langCode]);

  if (loading) return <div className="wod-card"><div className="card-loading"><Dots/></div></div>;
  if (!data)   return null;
  return (
    <div className="wod-card">
      <h3>📚 {t.wordOfDay}</h3>
      <div className="wod-word">
        {data.word}
        <button className="tts-btn" onClick={()=>speak(data.word,lang?.tts||"en-US")}>🔊</button>
      </div>
      <div className="wod-pos">{data.pos}</div>
      <div className="wod-def">{data.definition}</div>
      {data.example && <div className="wod-ex">{data.example}</div>}
      {data.collocations?.length>0 && <>
        <div style={{fontSize:"0.72rem",color:"var(--muted)",marginTop:8,marginBottom:4}}>{t.collocations}</div>
        <div className="wod-colls">{data.collocations.map((c,i)=><span key={i} className="wod-coll">{c}</span>)}</div>
      </>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IDIOM OF DAY
═══════════════════════════════════════════════════════════ */
function IdiomOfDay({langCode, t}) {
  const [cat,setCat]         = useState(IDIOM_CATS[0]);
  const [data,setData]       = useState(null);
  const [loading,setLoading] = useState(false);
  const lang = LANGUAGES.find(l=>l.code===langCode);

  useEffect(()=>{
    const cached = loadIdiom(cat);
    if (cached) { setData(cached); return; }
    setLoading(true);
    ai([{role:"user",content:`Give me a ${cat}-themed idiom in ${lang?.name||langCode}. Reply ONLY valid JSON with these keys: phrase (in ${lang?.name||langCode}), meaning (in English), example (sentence in ${lang?.name||langCode}).`}],
       "You are a language expert. Output only valid JSON, no markdown.",200)
      .then(raw=>{ const m=raw.match(/\{[\s\S]*\}/); if(m){const d=JSON.parse(m[0]);saveIdiom(cat,d);setData(d);} })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[cat,langCode]);

  return (
    <div className="idiom-card">
      <h3>💬 {t.idiomOfDay}</h3>
      <div className="idiom-cat-tabs">
        {IDIOM_CATS.map(c=>(
          <button key={c} className={`idiom-cat-btn${cat===c?" active":""}`}
            onClick={()=>{ setCat(c); setData(null); sfx.click(); }}>{c}</button>
        ))}
      </div>
      {loading && <div className="card-loading"><Dots/></div>}
      {!loading && data && <>
        <div className="idiom-phrase">
          {data.phrase}
          <button className="tts-btn" onClick={()=>speak(data.phrase,lang?.tts||"en-US")}>🔊</button>
        </div>
        <div className="idiom-meaning">{data.meaning}</div>
        {data.example && <div className="idiom-ex">{data.example}</div>}
      </>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADULT NOTEBOOK
═══════════════════════════════════════════════════════════ */
function AdultNotebook({t}) {
  const [words,setWords] = useState(loadNB());
  const reload = () => setWords(loadNB());
  const due    = getDueWords(words);
  const errs   = getErrors().slice(0,8);

  return (
    <div className="notebook">
      {due.length>0 && (
        <div className="nudge-banner">
          🔔 {due.length} word{due.length>1?"s":""} {t.dueReview}:&nbsp;
          {due.slice(0,3).map(w=>w.text).join(", ")}{due.length>3?"…":""}
        </div>
      )}
      {words.length===0 && <p style={{color:"var(--muted)",fontSize:"0.86rem",padding:"6px 2px"}}>{t.noWords}</p>}
      {words.map((w,i)=>{
        const isDue = w.nextReview && new Date(w.nextReview)<=new Date();
        return (
          <div key={i} className="nb-word">
            <span className="word-text">{w.text}{isDue && <span className="due-badge">review</span>}</span>
            <span className="word-lang">{w.lang}</span>
            <button className="tts-btn" onClick={()=>speak(w.text,LANGUAGES.find(x=>x.code===w.lang)?.tts||"en-US")}>🔊</button>
            <button className="del-btn" onClick={()=>{ delAdultWord(w.text); reload(); }}>✕</button>
          </div>
        );
      })}
      {errs.length>0 && (
        <div className="error-section">
          <h3>{t.errorPatterns}</h3>
          {errs.map((e,i)=>(
            <div key={i} className="err-item">
              <span className="fix-err">{e.err}</span>{" → "}
              <span className="err-ok">{e.fix}</span>
              {e.tip && <div style={{marginTop:2,fontSize:"0.74rem"}}>{e.tip}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADULT CHAT
═══════════════════════════════════════════════════════════ */
function AdultChat({lang, scenario, t, onStars}) {
  const [msgs,setMsgs]               = useState([]);
  const [input,setInput]             = useState("");
  const [loading,setLoading]         = useState(false);
  const [savedIdx,setSavedIdx]       = useState(new Set());
  const [summary,setSummary]         = useState("");
  const [summLoading,setSummLoading] = useState(false);
  const [saveInput,setSaveInput]     = useState({idx:-1,val:""});
  const bottomRef = useRef();
  const langObj   = LANGUAGES.find(l=>l.code===lang);

  useEffect(()=>{
    setMsgs([]); setSummary(""); setSavedIdx(new Set()); setSaveInput({idx:-1,val:""});
  },[lang,scenario]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  const sysPrompt = `You are a friendly ${langObj?.name} language tutor doing a roleplay scenario: "${scenario}".
Respond primarily in ${langObj?.name} at an intermediate B1-B2 level. Keep replies to 2-4 short sentences.
If the user makes a language error, append EXACTLY this block at the very end of your reply (after all other text):
<fix>{"err":"[their exact error]","fix":"[correct form]","tip":"[brief tip in English]"}</fix>
Omit the <fix> block entirely when there are no errors.`;

  async function send() {
    if (!input.trim()||loading) return;
    sfx.send(); haptic([15]);
    const userMsg = {role:"user",content:input.trim()};
    const newMsgs = [...msgs,userMsg];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try {
      const apiMsgs = newMsgs.map(m=>({role:m.role,content:m.rawContent||m.content}));
      const raw = await ai(apiMsgs,sysPrompt);
      const {text,fix} = parseAiResponse(raw);
      if (fix) addError(fix);
      setMsgs(m=>[...m,{role:"assistant",content:text,rawContent:raw,fix}]);
      const newTotal = addStarsTo(2); onStars?.(newTotal);
      if (langObj) speak(text,langObj.tts,0.92);
    } catch(e) {
      setMsgs(m=>[...m,{role:"assistant",content:`Error: ${e.message}`}]);
    }
    setLoading(false);
  }

  async function getSessionSummary() {
    if (msgs.length<2) return;
    setSummLoading(true);
    const transcript = msgs.map(m=>`${m.role}: ${m.rawContent||m.content}`).join("\n");
    try {
      const s = await ai(
        [{role:"user",content:`Summarise this language learning chat in 4-5 bullet points covering: topics discussed, vocabulary used, grammar practiced, and overall progress. Be concise and encouraging.\n\n${transcript}`}],
        "You are a language learning coach.",350
      );
      setSummary(s);
    } catch {}
    setSummLoading(false);
  }

  function openSave(i,text) {
    const firstWord = text.split(/[\s,!?.]+/).find(w=>w.length>1)||text.slice(0,30);
    setSaveInput({idx:i,val:firstWord});
  }
  function commitSave(i) {
    const word = saveInput.val.trim();
    if (!word) return;
    if (addAdultWord(word,lang)) {
      sfx.save(); haptic([20,10,20]);
      setSavedIdx(s=>new Set([...s,i]));
      const newTotal = addStarsTo(5); onStars?.(newTotal);
    }
    setSaveInput({idx:-1,val:""});
  }

  return (
    <>
      <div className="chat-area">
        {msgs.length===0 && (
          <p style={{color:"var(--muted)",fontSize:"0.86rem",textAlign:"center",marginTop:24}}>
            {t.startChat}
          </p>
        )}
        {msgs.map((m,i)=>(
          <div key={i} className={`bubble ${m.role==="user"?"user":"ai"}`}>
            {m.content}
            {m.role==="assistant" && (
              <button className="tts-btn" onClick={()=>speak(m.content,langObj?.tts||"en-US")}>🔊</button>
            )}
            {m.fix && (
              <div className="fix-pill">
                <span className="fix-label">{t.fix}:</span>
                <span className="fix-err">{m.fix.err}</span>
                <span>→</span>
                <span className="fix-ok">{m.fix.fix}</span>
                {m.fix.tip && <span className="fix-tip">({m.fix.tip})</span>}
              </div>
            )}
            {m.role==="assistant" && (
              savedIdx.has(i)
                ? <span style={{fontSize:"0.73rem",color:"var(--green)",marginTop:5,display:"block"}}>✓ {t.saved}</span>
                : saveInput.idx===i
                  ? <div style={{display:"flex",gap:5,marginTop:6,alignItems:"center"}}>
                      <input
                        style={{flex:1,padding:"4px 8px",borderRadius:7,background:"var(--surf)",border:"1px solid var(--border)",color:"var(--text)",fontSize:"0.8rem"}}
                        value={saveInput.val}
                        onChange={e=>setSaveInput(s=>({...s,val:e.target.value}))}
                        onKeyDown={e=>{if(e.key==="Enter")commitSave(i);}}
                        autoFocus
                      />
                      <button className="action-btn primary" style={{padding:"4px 9px"}} onClick={()=>commitSave(i)}>✓</button>
                      <button className="action-btn" style={{padding:"4px 9px"}} onClick={()=>setSaveInput({idx:-1,val:""})}>✕</button>
                    </div>
                  : <button className="action-btn" style={{marginTop:5,fontSize:"0.73rem"}} onClick={()=>openSave(i,m.content)}>
                      💾 {t.save}
                    </button>
            )}
          </div>
        ))}
        {loading && <div className="bubble ai"><Dots/></div>}
        <div ref={bottomRef}/>
      </div>

      {summary && (
        <div className="summary-box">
          <h3>📋 {t.summary}</h3>
          <div style={{whiteSpace:"pre-wrap"}}>{summary}</div>
        </div>
      )}

      <div className="chat-input">
        <textarea
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder={t.startChat}
          rows={1}
        />
        <button className="send-btn" onClick={send} disabled={loading||!input.trim()}>{t.send}</button>
      </div>
      <div className="chat-actions">
        {msgs.length>0 && (
          <button className="action-btn" onClick={()=>{setMsgs([]);setSummary("");setSavedIdx(new Set());setSaveInput({idx:-1,val:""});sfx.click();}}>
            {t.clear}
          </button>
        )}
        {msgs.filter(m=>m.role==="assistant").length>=2 && (
          <button className="action-btn" onClick={getSessionSummary} disabled={summLoading}>
            {summLoading ? <Dots/> : `📋 ${t.summary}`}
          </button>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADULT MODE
═══════════════════════════════════════════════════════════ */
function AdultMode({t, onStars, stars}) {
  const [tab,setTab]         = useState("chat");
  const [lang,setLang]       = useState("es");
  const [scenIdx,setScenIdx] = useState(0);
  const langObj = LANGUAGES.find(l=>l.code===lang);

  return (
    <>
      <LevelBadge stars={stars}/>
      <div className="tabs">
        {[["chat",t.chat],["notebook",t.notebook],["wod",t.wordOfDay],["idiom",t.idiomOfDay]].map(([k,label])=>(
          <button key={k} className={`tab-btn${tab===k?" active":""}`} onClick={()=>{setTab(k);sfx.click();}}>
            {label}
          </button>
        ))}
      </div>

      {tab==="chat" && <>
        <div className="selectors">
          <div className="sel-group">
            <label>{t.language}</label>
            <select value={lang} onChange={e=>{setLang(e.target.value);setScenIdx(0);}}>
              {LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>
          <div className="sel-group">
            <label>{t.scenario}</label>
            <select value={scenIdx} onChange={e=>setScenIdx(+e.target.value)}>
              {langObj?.scenarios.map((s,i)=><option key={i} value={i}>{s}</option>)}
            </select>
          </div>
        </div>
        <AdultChat lang={lang} scenario={langObj?.scenarios[scenIdx]||""} t={t} onStars={onStars}/>
      </>}

      {tab==="notebook" && <AdultNotebook t={t}/>}
      {tab==="wod"      && <WordOfDay langCode={lang} t={t}/>}
      {tab==="idiom"    && <IdiomOfDay langCode={lang} t={t}/>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   KIDS NOTEBOOK
═══════════════════════════════════════════════════════════ */
function KidsNotebook({t}) {
  const [words,setWords] = useState(loadKNB());
  const reload = () => setWords(loadKNB());
  return (
    <div className="notebook">
      {words.length===0 && <p style={{color:"var(--muted)",fontSize:"0.86rem"}}>{t.noWords}</p>}
      {words.map((w,i)=>(
        <div key={i} className="nb-word">
          <span className="word-text">{w.text}</span>
          <span className="word-lang">{w.lang}</span>
          <button className="tts-btn" onClick={()=>speak(w.text,KIDS_LANGS.find(l=>l.code===w.lang)?.tts||"en-US")}>🔊</button>
          <button className="del-btn" onClick={()=>{ saveKNB(loadKNB().filter(x=>x.text!==w.text)); reload(); }}>✕</button>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FLASHCARDS  (SM-2, flip + type-it)
═══════════════════════════════════════════════════════════ */
function FlashCards({words: initWords, t, onDone}) {
  const [queue]              = useState([...initWords].sort(()=>Math.random()-.5));
  const [idx,setIdx]         = useState(0);
  const [flipped,setFlipped] = useState(false);
  const [mode,setMode]       = useState("flip");
  const [typeVal,setTypeVal] = useState("");
  const [typeResult,setTypeResult] = useState(null);

  const current = queue[idx];
  if (!current) return (
    <div style={{padding:28,textAlign:"center",color:"var(--muted)",fontSize:"1.1rem"}}>
      {t.allDone} 🎉
    </div>
  );

  /* front = translation (cue), back = target word (answer) */
  const front   = current.transl || current.text || "";
  const back    = current.word   || current.text || "";
  const answer  = back.toLowerCase().trim();

  function advance(quality) {
    /* persist SM-2 into adult notebook if word exists there */
    const nb = loadNB();
    const entry = nb.find(w=>w.text===back);
    if (entry && quality!==undefined) saveNB(nb.map(w=>w.text===back?sm2Update(w,quality):w));
    if (quality===2) sfx.correct(); else if (quality===0) sfx.wrong(); else sfx.click();
    setFlipped(false); setTypeVal(""); setTypeResult(null);
    if (idx+1>=queue.length) onDone?.(); else setIdx(i=>i+1);
  }

  function checkType() {
    const ok = typeVal.trim().toLowerCase()===answer;
    setTypeResult(ok?"ok":"err");
    if (ok) { sfx.correct(); haptic([30,10,30]); } else { sfx.wrong(); haptic([50]); }
  }

  return (
    <div className="fc-wrap">
      <div className="fc-prog">{idx+1} / {queue.length}</div>

      <div className="fc-mode-btns">
        <button className={`action-btn${mode==="flip"?" primary":""}`}
          onClick={()=>{setMode("flip");setFlipped(false);setTypeResult(null);sfx.click();}}>
          {t.flip}
        </button>
        <button className={`action-btn${mode==="type"?" primary":""}`}
          onClick={()=>{setMode("type");setFlipped(false);setTypeResult(null);sfx.click();}}>
          {t.typeIt}
        </button>
      </div>

      <div className="fc-container" onClick={()=>{ if(mode==="flip"){sfx.flip();haptic([15]);setFlipped(f=>!f);} }}>
        <div className={`fc-inner${flipped?" flipped":""}`}>
          <div className="fc-face fc-front">
            <div className="fc-word">{front||"—"}</div>
            <div className="fc-hint">{mode==="flip"?`👆 ${t.flip}`:t.typeIt}</div>
          </div>
          <div className="fc-face fc-back">
            <div className="fc-word">{back||"—"}</div>
          </div>
        </div>
      </div>

      {mode==="flip" && flipped && (
        <div className="fc-sm2-btns">
          <button className="fc-sm2-btn hard" onClick={()=>advance(0)}>{t.hard}</button>
          <button className="fc-sm2-btn good" onClick={()=>advance(1)}>{t.good}</button>
          <button className="fc-sm2-btn easy" onClick={()=>advance(2)}>{t.easy}</button>
        </div>
      )}

      {mode==="type" && !typeResult && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <input className="fc-type-input" value={typeVal}
            onChange={e=>setTypeVal(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")checkType();}}
            placeholder="Type the word…" autoFocus/>
          <button className="fc-check-btn" onClick={checkType}>{t.good}</button>
        </div>
      )}

      {mode==="type" && typeResult && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <div className={`dict-result ${typeResult}`}>
            {typeResult==="ok"?`✓ ${t.correct}`:`✗ ${t.tryAgain}: "${back}"`}
          </div>
          <button className="fc-check-btn" onClick={()=>advance(typeResult==="ok"?2:0)}>{t.next}</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SET EDITOR
═══════════════════════════════════════════════════════════ */
function SetEditor({set: initSet, t, onSave, onCancel}) {
  const [name,setName]   = useState(initSet?.name||"");
  const [words,setWords] = useState(initSet?.words||[{word:"",transl:""}]);
  const fileRef = useRef();

  const addRow     = ()       => setWords(w=>[...w,{word:"",transl:""}]);
  const updateRow  = (i,f,v)  => setWords(w=>w.map((r,j)=>j===i?{...r,[f]:v}:r));
  const removeRow  = (i)      => setWords(w=>w.filter((_,j)=>j!==i));

  function importFile(e) {
    const file=e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      const rows = ev.target.result.split("\n").filter(Boolean).map(line=>{
        const p = line.split(/[,\t]/);
        return {word:(p[0]||"").trim(),transl:(p[1]||"").trim()};
      }).filter(r=>r.word);
      setWords(r=>[...r.filter(x=>x.word||x.transl),...rows]);
    };
    reader.readAsText(file);
    e.target.value="";
  }

  function save() {
    const clean = words.filter(w=>w.word.trim());
    if (!name.trim()||clean.length===0) return;
    const sets = loadVSets();
    if (initSet) {
      saveVSets(sets.map(s=>s.id===initSet.id?{...s,name,words:clean}:s));
    } else {
      sets.unshift({id:Date.now().toString(),name,words:clean,created:new Date().toISOString()});
      saveVSets(sets);
    }
    sfx.save(); haptic([20,10,20]); onSave?.();
  }

  return (
    <div className="set-editor">
      <input className="se-input" placeholder={t.setName} value={name} onChange={e=>setName(e.target.value)}/>
      <button className="import-btn" onClick={()=>fileRef.current.click()}>
        📂 {t.import} (.txt / .csv — word,translation per line)
      </button>
      <input ref={fileRef} type="file" accept=".txt,.csv" style={{display:"none"}} onChange={importFile}/>
      {words.map((row,i)=>(
        <div key={i} className="word-row">
          <input placeholder={t.wordLabel} value={row.word} onChange={e=>updateRow(i,"word",e.target.value)}/>
          <input placeholder={t.translLabel} value={row.transl} onChange={e=>updateRow(i,"transl",e.target.value)}/>
          <button className="del-btn" onClick={()=>removeRow(i)}>✕</button>
        </div>
      ))}
      <button className="action-btn" style={{marginTop:5}} onClick={addRow}>+ {t.addWord}</button>
      <div className="se-footer">
        <button className="se-btn" onClick={onCancel}>{t.cancel}</button>
        <button className="se-btn primary" onClick={save}>{t.done}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OLLIE PRACTICE  (for vocab sets)
═══════════════════════════════════════════════════════════ */
function OlliePractice({words, kidLang, t, onDone}) {
  const [msgs,setMsgs]           = useState([]);
  const [input,setInput]         = useState("");
  const [loading,setLoading]     = useState(false);
  const [ollieAnim,setOllieAnim] = useState(false);
  const bottomRef = useRef();
  const langObj = KIDS_LANGS.find(l=>l.code===kidLang)||KIDS_LANGS[0];
  const wordList = words.map(w=>w.word+(w.transl?` (${w.transl})`:"")).join(", ");

  const system = `You are Ollie, a friendly owl tutor. Practice these vocabulary words with the child: ${wordList}.
Ask one fun, simple question at a time in ${langObj.name}. Use lots of emojis. Keep it A1-A2 level. Be very encouraging!`;

  function bounce() { setOllieAnim(true); setTimeout(()=>setOllieAnim(false),1500); }

  useEffect(()=>{
    setLoading(true);
    ai([{role:"user",content:"Start! Greet the child warmly and ask your first question about one of the vocabulary words."}],system,180)
      .then(text=>{ setMsgs([{role:"assistant",content:text}]); bounce(); speak(text,langObj.tts,0.85); })
      .catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  async function send() {
    if (!input.trim()||loading) return;
    sfx.send(); haptic([15]);
    const newMsgs=[...msgs,{role:"user",content:input.trim()}];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try {
      const raw=await ai(newMsgs,system,180);
      setMsgs(m=>[...m,{role:"assistant",content:raw}]); bounce(); speak(raw,langObj.tts,0.85);
    } catch {}
    setLoading(false);
  }

  const lastAi = msgs.filter(m=>m.role==="assistant").slice(-1)[0];

  return (
    <>
      <div className="ollie-block">
        <OllieAvatar animate={ollieAnim}/>
        {loading&&!msgs.length
          ? <div className="ollie-speech"><Dots/></div>
          : lastAi && <div className="ollie-speech">{lastAi.content}</div>}
      </div>
      <div className="chat-area" style={{maxHeight:190}}>
        {msgs.slice(0,-1).map((m,i)=>(
          <div key={i} className={`bubble ${m.role==="user"?"user":"ai"}`}>{m.content}</div>
        ))}
        {loading&&msgs.length>0 && <div className="bubble ai"><Dots/></div>}
        <div ref={bottomRef}/>
      </div>
      <div className="chat-input">
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder="Answer Ollie…" rows={1}/>
        <button className="send-btn" onClick={send} disabled={loading||!input.trim()}>{t.send}</button>
      </div>
      <div className="chat-actions">
        <button className="action-btn" onClick={onDone}>← {t.back}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VOCAB SETS HUB
═══════════════════════════════════════════════════════════ */
function VocabSets({t, kidLang}) {
  const [view,setView]               = useState("list");
  const [editTarget,setEditTarget]   = useState(null);
  const [flashTarget,setFlashTarget] = useState(null);
  const [practTarget,setPractTarget] = useState(null);
  const [listKey,setListKey]         = useState(0);
  const reload = () => setListKey(k=>k+1);

  if (view==="edit") return (
    <SetEditor set={editTarget} t={t}
      onSave={()=>{ setView("list"); reload(); }}
      onCancel={()=>setView("list")}/>
  );
  if (view==="flash"&&flashTarget) return (
    <>
      <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
        <button className="action-btn" onClick={()=>setView("list")}>← {t.back}</button>
        <span style={{fontWeight:600,fontSize:"0.88rem"}}>{flashTarget.name}</span>
      </div>
      <FlashCards words={flashTarget.words} t={t} onDone={()=>setView("list")}/>
    </>
  );
  if (view==="practice"&&practTarget) return (
    <OlliePractice words={practTarget.words} kidLang={kidLang} t={t} onDone={()=>setView("list")}/>
  );

  const sets = loadVSets();
  return (
    <div className="vs-list" key={listKey}>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button className="action-btn primary"
          onClick={()=>{ setEditTarget(null); setView("edit"); sfx.click(); }}>
          + {t.newSet}
        </button>
      </div>
      {sets.length===0 && (
        <p style={{color:"var(--muted)",fontSize:"0.86rem"}}>No sets yet — create one to get started!</p>
      )}
      {sets.map(s=>(
        <div key={s.id} className="vs-item">
          <span className="vs-name">{s.name}</span>
          <span className="vs-count">{s.words.length} words</span>
          <div className="vs-actions">
            <button className="vs-btn" title={t.flashcards}
              onClick={()=>{ setFlashTarget(s); setView("flash"); sfx.click(); }}>🃏</button>
            <button className="vs-btn" title={t.practice}
              onClick={()=>{ setPractTarget(s); setView("practice"); sfx.click(); }}>🤖</button>
            <button className="vs-btn" title={t.editSet}
              onClick={()=>{ setEditTarget(s); setView("edit"); sfx.click(); }}>✏️</button>
            <button className="vs-btn danger" title={t.deleteSet}
              onClick={()=>{
                if (confirm(`Delete "${s.name}"?`)) {
                  saveVSets(loadVSets().filter(x=>x.id!==s.id));
                  reload(); sfx.click();
                }
              }}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KIDS CHAT
═══════════════════════════════════════════════════════════ */
function KidsChat({topic, kidLang, t, onStars}) {
  const [msgs,setMsgs]             = useState([]);
  const [input,setInput]           = useState("");
  const [loading,setLoading]       = useState(false);
  const [listenMode,setListenMode] = useState(false);
  const [dictVal,setDictVal]       = useState("");
  const [dictResult,setDictResult] = useState(null);
  const [currentAi,setCurrentAi]   = useState("");
  const [ollieAnim,setOllieAnim]   = useState(false);
  const [savedSet,setSavedSet]     = useState(new Set());
  const bottomRef = useRef();
  const langObj = KIDS_LANGS.find(l=>l.code===kidLang)||KIDS_LANGS[0];

  useEffect(()=>{
    setMsgs([]); setCurrentAi(""); setDictVal(""); setDictResult(null); setListenMode(false);
  },[topic,kidLang]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  const system = `You are Ollie, a fun owl friend teaching kids ${langObj.name}! Today's topic: "${topic}".
Use short, simple ${langObj.name} sentences (A1 level). Mix in English for brand-new words like: *word* (English meaning).
Reply in 1-2 sentences max. Use LOTS of emojis 🎉. Be super enthusiastic and encouraging!`;

  function bounce() { setOllieAnim(true); setTimeout(()=>setOllieAnim(false),1500); }

  useEffect(()=>{
    if (!topic) return;
    setLoading(true);
    ai([{role:"user",content:"Start! Introduce yourself and the topic in a super fun way."}],system,150)
      .then(text=>{ setMsgs([{role:"assistant",content:text}]); setCurrentAi(text); bounce(); speak(text,langObj.tts,0.85); })
      .catch(()=>{}).finally(()=>setLoading(false));
  },[topic,kidLang]);

  async function send() {
    if (!input.trim()||loading) return;
    sfx.send(); haptic([15]);
    const newMsgs=[...msgs,{role:"user",content:input.trim()}];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try {
      const raw=await ai(newMsgs,system,150);
      setMsgs(m=>[...m,{role:"assistant",content:raw}]);
      setCurrentAi(raw); bounce(); speak(raw,langObj.tts,0.85);
      const newTotal=addStarsTo(3); onStars?.(newTotal);
    } catch {}
    setLoading(false);
  }

  function checkDictation() {
    const norm = s=>s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,"").trim();
    const ok   = norm(dictVal)===norm(currentAi);
    setDictResult(ok?"ok":"err");
    if (ok) { sfx.correct(); haptic([30,10,30]); } else { sfx.wrong(); haptic([50]); }
  }

  const lastAi = msgs.filter(m=>m.role==="assistant").slice(-1)[0];

  return (
    <>
      <div className="ollie-block">
        <OllieAvatar animate={ollieAnim}/>
        {loading&&!msgs.length
          ? <div className="ollie-speech"><Dots/></div>
          : lastAi && <div className="ollie-speech">{lastAi.content}</div>}
      </div>

      {currentAi && (
        <div className="listen-strip">
          <button className={`listen-btn${listenMode?" active":""}`}
            onClick={()=>{ setListenMode(l=>!l); setDictVal(""); setDictResult(null); sfx.click(); }}>
            🎧 {t.listenMode}
          </button>
          <button className="listen-btn" onClick={()=>speak(currentAi,langObj.tts,0.82)}>
            {t.speakBtn}
          </button>
        </div>
      )}

      {listenMode && currentAi && (
        <div className="dictation-area">
          <button style={{fontSize:"0.82rem",color:"var(--teal)",marginBottom:6,display:"block"}}
            onClick={()=>speak(currentAi,langObj.tts,0.72)}>
            🔊 Hear it again (slower)
          </button>
          <input className="dictation-input" value={dictVal}
            onChange={e=>setDictVal(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")checkDictation();}}
            placeholder="Type what you heard…"/>
          <button className="fc-check-btn" onClick={checkDictation}>{t.good}</button>
          {dictResult && (
            <div className={`dict-result ${dictResult}`} style={{marginTop:6}}>
              {dictResult==="ok"?`✓ ${t.correct}!`:`✗ It was: "${currentAi}"`}
            </div>
          )}
        </div>
      )}

      <div className="chat-area" style={{minHeight:100}}>
        {msgs.slice(0,-1).map((m,i)=>(
          <div key={i} className={`bubble ${m.role==="user"?"user":"ai"}`}>
            {m.content}
            {m.role==="assistant" && !savedSet.has(i) && (
              <button className="action-btn" style={{marginTop:4,fontSize:"0.7rem"}} onClick={()=>{
                const kn=loadKNB();
                const snippet=m.content.slice(0,60);
                if (!kn.find(w=>w.text===snippet)) {
                  kn.unshift({text:snippet,lang:kidLang,date:new Date().toISOString()});
                  saveKNB(kn); sfx.save(); haptic([20]);
                  setSavedSet(s=>new Set([...s,i]));
                }
              }}>💾</button>
            )}
            {m.role==="assistant"&&savedSet.has(i) && (
              <span style={{fontSize:"0.7rem",color:"var(--green)",marginTop:4,display:"block"}}>✓</span>
            )}
          </div>
        ))}
        {loading && <div className="bubble ai"><Dots/></div>}
        <div ref={bottomRef}/>
      </div>

      <div className="chat-input">
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder={t.startChat} rows={1}/>
        <button className="send-btn" onClick={send} disabled={loading||!input.trim()}>{t.send}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   KIDS MODE
═══════════════════════════════════════════════════════════ */
function KidsMode({t, onStars}) {
  const [tab,setTab]         = useState("chat");
  const [kidLang,setKidLang] = useState(loadLS(SK_KIDLG,"en"));
  const [topic,setTopic]     = useState(KIDS_TOPICS[0]);

  function selectLang(code) { setKidLang(code); saveLS(SK_KIDLG,code); sfx.click(); haptic([15]); }

  return (
    <div className="kids-wrap kids-mode">
      <div style={{background:"var(--surf2)",borderBottom:"1px solid var(--border)",padding:"8px 14px 10px"}}>
        <p style={{fontSize:"0.75rem",color:"var(--muted)",marginBottom:6}}>{t.pickLanguage}</p>
        <div className="kids-lang-pick">
          {KIDS_LANGS.map(l=>(
            <button key={l.code} className={`kids-lang-btn${kidLang===l.code?" active":""}`}
              onClick={()=>selectLang(l.code)}>{l.name}</button>
          ))}
        </div>
      </div>

      <div className="tabs">
        {[["chat",t.chat],["notebook",t.notebook],["vocab",t.vocabSets]].map(([k,label])=>(
          <button key={k} className={`tab-btn${tab===k?" active":""}`} onClick={()=>{setTab(k);sfx.click();}}>
            {label}
          </button>
        ))}
      </div>

      {tab==="chat" && <>
        <div className="topic-grid">
          {KIDS_TOPICS.map(tp=>(
            <button key={tp} className={`topic-btn${topic===tp?" active":""}`}
              onClick={()=>{ setTopic(tp); sfx.click(); haptic([15]); }}>{tp}</button>
          ))}
        </div>
        <KidsChat topic={topic} kidLang={kidLang} t={t} onStars={onStars}/>
      </>}

      {tab==="notebook" && <KidsNotebook t={t}/>}
      {tab==="vocab"    && <VocabSets t={t} kidLang={kidLang}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [mode,setMode]     = useState("adult");
  const [uiLang,setUiLang] = useState(loadLS(SK_UILNG,"EN"));
  const [stars,setStars]   = useState(getStarsData().total);

  const t = T[uiLang] || T.EN;

  function handleStars(newTotal) {
    setStars(newTotal);
    sfx.star(); haptic([20,10,20,10,40]);
  }

  return (
    <Ctx.Provider value={{t,uiLang,setUiLang}}>
      <style>{CSS}{LOGIN_CSS}</style>
      <div className="app">

        <div className="top-bar">
          <h1>✦ Lingua</h1>
          <div className="top-bar-right">
            <UiLangPicker uiLang={uiLang} setUiLang={setUiLang}/>
            <div className="mode-switch">
              <button className={`mode-btn${mode==="adult"?" active":""}`}
                onClick={()=>{ setMode("adult"); sfx.click(); }}>
                {t.adultMode}
              </button>
              <button className={`mode-btn${mode==="kids"?" active":""}`}
                onClick={()=>{ setMode("kids"); sfx.click(); }}>
                {t.kidsMode}
              </button>
            </div>
          </div>
        </div>

        {mode==="adult" && <AdultMode t={t} onStars={handleStars} stars={stars}/>}
        {mode==="kids"  && <KidsMode  t={t} onStars={handleStars}/>}

        <button className="update-btn" onClick={()=>window.location.reload(true)}>⟳ Update</button>
      </div>
    </Ctx.Provider>
  );
}
