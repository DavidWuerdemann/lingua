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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Nunito:wght@700;800;900&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');

:root{
  /* Adult — deep editorial navy */
  --bg:#0F1B2D;
  --surf:#162336;
  --surf2:#1D2E44;
  --surf3:#243350;
  --border:#243650;
  --borderL:#2e4668;
  --text:#F0EBE0;
  --muted:#8899AE;
  --mutedD:#6E7E94;
  --gold:#C9943A;
  --goldL:#E5B86A;
  --goldT:rgba(201,148,58,.14);
  --goldD:#a87520;
  --terra:#C2634B;
  --green:#4CAF7D;--red:#E05555;
  --blue:#5B9CF6;--blueD:#3a7bd5;
  --purple:#A78BFA;--teal:#2dd4bf;
  --orange:#f59e0b;
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'DM Sans',system-ui,sans-serif;
  --user-bubble:var(--gold);
  --user-bubble-text:var(--bg);
  --shadow-sm:0 2px 8px rgba(0,0,0,.45);
  --shadow:0 4px 20px rgba(0,0,0,.55);
  --glow-gold:0 0 20px rgba(201,148,58,.3);
  --glow-blue:0 0 20px rgba(91,156,246,.25);
  --glow-teal:0 0 20px rgba(45,212,191,.2);
}

/* ── Reset ── */
*{box-sizing:border-box;margin:0;padding:0}
body{
  background:var(--bg);
  color:var(--text);
  font-family:var(--sans);
  min-height:100vh;
  -webkit-tap-highlight-color:transparent;
}
button{cursor:pointer;border:none;background:none;font-family:inherit;}
input,textarea,select{font-family:inherit;color-scheme:dark;}

/* ── App shell ── */
.app{display:flex;flex-direction:column;min-height:100vh;max-width:700px;margin:0 auto;padding-bottom:82px;}

/* ── Top bar ── */
.top-bar{
  display:flex;align-items:center;justify-content:space-between;
  padding:13px 16px;
  background:rgba(15,27,45,.92);
  border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:50;
  backdrop-filter:blur(18px);
  gap:8px;
  box-shadow:0 1px 0 rgba(255,255,255,.04), var(--shadow-sm);
}
.top-bar h1{
  font-family:var(--serif);font-size:1.45rem;font-weight:600;letter-spacing:.01em;
  color:var(--gold);white-space:nowrap;
  filter:drop-shadow(0 0 8px rgba(201,148,58,.35));
}
.top-bar-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end;}

/* ── Mode switch ── */
.mode-switch{display:flex;gap:3px;background:var(--surf2);border-radius:22px;padding:3px;border:1px solid var(--border);}
.mode-btn{
  padding:5px 14px;border-radius:18px;font-size:0.76rem;font-weight:600;
  color:var(--muted);transition:all .22s;
}
.mode-btn.active{
  background:linear-gradient(135deg,var(--gold),var(--goldD));
  color:#111;font-weight:700;
  box-shadow:var(--glow-gold), 0 2px 8px rgba(0,0,0,.3);
}
.mode-btn:not(.active):hover{color:var(--text);}

/* ── Stars / Level bar ── */
.stars-bar{
  display:flex;align-items:center;gap:10px;padding:8px 16px;
  background:var(--surf);
  border-bottom:1px solid var(--border);font-size:0.8rem;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.03);
}
.stars-bar .star-ct{color:var(--gold);font-weight:700;white-space:nowrap;text-shadow:0 0 12px rgba(201,148,58,.4);}
.stars-bar .lvl-badge{
  background:var(--goldT);
  color:var(--goldL);border-radius:10px;padding:2px 9px;
  font-size:0.7rem;font-weight:700;white-space:nowrap;
  border:1px solid rgba(201,148,58,.3);
}
.stars-bar .prog-bar{flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden;}
.stars-bar .prog-fill{
  height:100%;
  background:linear-gradient(90deg,var(--gold),var(--goldL));
  border-radius:3px;transition:width .6s cubic-bezier(.4,0,.2,1);
  box-shadow:0 0 8px rgba(240,192,64,.5);
}

/* ── Tabs ── */
.tabs{
  display:flex;gap:2px;padding:10px 10px 0;
  background:var(--surf);
  border-bottom:1px solid var(--border);
  position:sticky;top:57px;z-index:40;overflow-x:auto;
  box-shadow:0 1px 0 rgba(255,255,255,.03);
}
.tab-btn{
  padding:8px 14px;border-radius:10px 10px 0 0;
  font-size:0.78rem;font-weight:600;color:var(--muted);
  border:1px solid transparent;border-bottom:none;
  white-space:nowrap;transition:all .15s;
}
.tab-btn.active{
  background:transparent;color:var(--gold);
  border-color:transparent;border-bottom:2px solid var(--gold);
  font-weight:700;
}
.tab-btn:not(.active):hover{color:var(--text);background:rgba(255,255,255,.04);}

/* ── Selectors ── */
.selectors{
  display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;
  background:var(--surf2);border-bottom:1px solid var(--border);
}
.sel-group{display:flex;flex-direction:column;gap:4px;flex:1;min-width:130px;}
.sel-group label{font-size:0.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-weight:600;}
.sel-group select{
  background:var(--surf);color:var(--text);
  border:1px solid var(--border);border-radius:9px;
  padding:7px 10px;font-size:0.84rem;
  transition:border-color .15s;
  box-shadow:var(--shadow-sm);
}
.sel-group select:focus{outline:none;border-color:var(--blue);}

/* ── Chat area ── */
.chat-area{
  flex:1;overflow-y:auto;padding:14px 14px 6px;
  display:flex;flex-direction:column;gap:9px;min-height:200px;
}

/* ── Bubbles ── */
.bubble{
  max-width:86%;padding:11px 14px;
  border-radius:16px;font-size:0.88rem;line-height:1.58;
  position:relative;
}
.bubble.user{
  background:var(--user-bubble);
  color:var(--user-bubble-text);align-self:flex-end;border-bottom-right-radius:4px;
  box-shadow:0 4px 14px rgba(201,148,58,.25), var(--shadow-sm);
}
.bubble.ai{
  background:var(--surf2);
  border:1px solid var(--borderL);
  align-self:flex-start;border-bottom-left-radius:4px;
  box-shadow:var(--shadow-sm);
}
.bubble .tts-btn{font-size:0.7rem;opacity:.45;padding:2px 5px;margin-left:4px;transition:opacity .15s;vertical-align:middle;}
.bubble .tts-btn:hover{opacity:1;}

/* ── Fix pill ── */
.fix-pill{
  display:flex;flex-wrap:wrap;align-items:center;gap:4px;
  margin-top:8px;padding:7px 10px;
  background:linear-gradient(135deg,rgba(240,192,64,.08),rgba(240,192,64,.03));
  border:1px solid rgba(240,192,64,.3);border-radius:9px;font-size:0.78rem;
  box-shadow:0 0 12px rgba(240,192,64,.07);
}
.fix-label{color:var(--gold);font-weight:700;}
.fix-err{color:var(--red);text-decoration:line-through;}
.fix-ok{color:var(--green);}
.fix-tip{color:var(--muted);font-style:italic;}

/* ── Chat input ── */
.chat-input{
  display:flex;gap:8px;padding:10px 14px;
  background:rgba(15,27,45,.92);
  border-top:1px solid var(--border);
  backdrop-filter:blur(12px);
}
.chat-input textarea{
  flex:1;background:var(--surf2);
  border:1px solid var(--border);border-radius:11px;
  padding:9px 12px;color:var(--text);font-size:0.88rem;
  resize:none;min-height:42px;max-height:120px;line-height:1.45;
  transition:border-color .15s, box-shadow .15s;
}
.chat-input textarea:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,148,58,.15);}
.send-btn{
  background:var(--gold);
  color:var(--bg);border-radius:11px;padding:9px 17px;
  font-weight:700;font-size:0.86rem;align-self:flex-end;
  transition:all .18s;box-shadow:0 4px 14px rgba(201,148,58,.3);
}
.send-btn:hover{transform:translateY(-1px);box-shadow:var(--glow-gold),var(--shadow);}
.send-btn:active{transform:translateY(0);}
.send-btn:disabled{opacity:.35;cursor:default;transform:none;box-shadow:none;}

/* ── Chat action buttons ── */
.chat-actions{display:flex;gap:7px;padding:6px 14px;flex-wrap:wrap;}
.action-btn{
  font-size:0.75rem;padding:5px 12px;border-radius:8px;
  border:1px solid var(--border);color:var(--muted);
  transition:all .18s;background:transparent;
}
.action-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(240,192,64,.06);}
.action-btn.primary{
  background:linear-gradient(135deg,var(--gold),var(--goldD));
  color:#111;border-color:transparent;font-weight:700;
  box-shadow:var(--shadow-sm);
}
.action-btn.primary:hover{box-shadow:var(--glow-gold);transform:translateY(-1px);}

/* ── Dots loader ── */
.dots{display:inline-flex;gap:4px;align-items:center;}
.dots span{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:bounce 1.2s infinite;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}
@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}

/* ── Session summary ── */
.summary-box{
  margin:10px 14px;padding:14px 16px;
  background:linear-gradient(135deg,rgba(201,148,58,.08),rgba(201,148,58,.03));
  border:1px solid rgba(201,148,58,.22);border-radius:13px;
  font-size:0.84rem;line-height:1.65;color:var(--muted);
  box-shadow:var(--shadow-sm);
}
.summary-box h3{color:var(--text);margin-bottom:7px;font-size:0.92rem;font-weight:700;}

/* ── Notebook ── */
.notebook{padding:14px;}
.nb-word{
  display:flex;align-items:center;gap:8px;
  padding:10px 13px;
  background:var(--surf2);border:1px solid var(--border);border-radius:11px;
  margin-bottom:7px;transition:border-color .15s, box-shadow .15s;
  box-shadow:var(--shadow-sm);
}
.nb-word:hover{border-color:var(--borderL);box-shadow:var(--shadow);}
.nb-word .word-text{flex:1;font-family:var(--serif);font-size:1.1rem;font-weight:500;letter-spacing:.01em;}
.nb-word .word-lang{
  font-size:0.68rem;color:var(--gold);font-style:italic;
  background:var(--goldT);padding:2px 7px;border-radius:5px;
  white-space:nowrap;border:1px solid rgba(201,148,58,.25);
}
.nb-word .tts-btn{font-size:0.74rem;color:var(--muted);padding:3px 7px;border-radius:6px;border:1px solid var(--border);transition:all .15s;}
.nb-word .tts-btn:hover{border-color:var(--gold);color:var(--gold);}
.nb-word .del-btn{color:var(--red);font-size:0.74rem;padding:3px 7px;border-radius:6px;border:1px solid transparent;opacity:.5;transition:all .15s;}
.nb-word .del-btn:hover{border-color:var(--red);opacity:1;}
.due-badge{
  display:inline-block;
  background:linear-gradient(135deg,var(--orange),#d97706);
  color:#111;border-radius:5px;padding:1px 7px;
  font-size:0.67rem;font-weight:800;margin-left:6px;
  box-shadow:0 0 8px rgba(245,158,11,.3);
}
.nudge-banner{
  margin:0 0 9px;padding:8px 12px;
  background:linear-gradient(135deg,rgba(245,158,11,.1),rgba(245,158,11,.05));
  border:1px solid rgba(245,158,11,.3);border-radius:10px;
  font-size:0.8rem;color:var(--orange);
  box-shadow:0 0 16px rgba(245,158,11,.07);
}
.error-section{padding:11px 0 0;border-top:1px solid var(--border);margin-top:6px;}
.error-section h3{font-size:0.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-weight:700;margin-bottom:8px;}
.err-item{
  font-size:0.78rem;padding:6px 10px;
  background:var(--surf2);border-radius:7px;
  border-left:3px solid rgba(224,85,85,.7);
  margin-bottom:5px;color:var(--muted);
  box-shadow:var(--shadow-sm);
}
.err-ok{color:var(--green);}

/* ── Word of Day ── */
.wod-card{
  margin:14px 14px 0;padding:20px;
  background:linear-gradient(135deg,rgba(201,148,58,.12) 0%,rgba(201,148,58,.04) 100%);
  border:1px solid rgba(201,148,58,.28);border-radius:16px;
  position:relative;overflow:hidden;
  box-shadow:var(--glow-gold), var(--shadow);
}
.wod-card::before{
  content:'';position:absolute;top:-40px;right:-40px;
  width:160px;height:160px;border-radius:50%;
  background:radial-gradient(circle,rgba(201,148,58,.18) 0%,transparent 70%);
  pointer-events:none;
}
.wod-card h3{font-size:0.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:10px;font-weight:700;}
.wod-word{font-family:var(--serif);font-size:2.4rem;font-weight:500;color:var(--text);margin-bottom:3px;line-height:1;}
.wod-pos{font-size:0.72rem;color:var(--muted);margin-bottom:8px;font-style:italic;}
.wod-def{font-size:0.86rem;color:var(--muted);margin-bottom:6px;line-height:1.55;}
.wod-ex{font-size:0.82rem;font-style:italic;color:var(--text);border-left:2px solid var(--gold);padding-left:10px;margin-top:6px;opacity:.85;}
.wod-colls{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;}
.wod-coll{
  background:var(--goldT);border:1px solid rgba(201,148,58,.3);
  border-radius:7px;padding:3px 9px;font-size:0.75rem;color:var(--goldL);
  font-weight:500;transition:all .15s;
}
.wod-coll:hover{background:rgba(201,148,58,.2);border-color:rgba(201,148,58,.5);}

/* ── Idiom of Day ── */
.idiom-card{
  margin:10px 14px 0;padding:16px;
  background:linear-gradient(135deg,rgba(240,192,64,.1),rgba(240,192,64,.04),transparent);
  border:1px solid rgba(240,192,64,.28);border-radius:16px;
  box-shadow:var(--glow-gold), var(--shadow);
}
.idiom-card h3{font-size:0.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--gold);margin-bottom:6px;font-weight:700;}
.idiom-cat-tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;}
.idiom-cat-btn{
  font-size:0.72rem;padding:4px 10px;border-radius:10px;
  border:1px solid var(--border);color:var(--muted);transition:all .18s;
}
.idiom-cat-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(240,192,64,.06);}
.idiom-cat-btn.active{
  background:linear-gradient(135deg,var(--gold),var(--goldD));
  color:#111;border-color:transparent;font-weight:700;
  box-shadow:var(--shadow-sm);
}
.idiom-phrase{font-size:1.1rem;font-weight:700;color:var(--goldL);margin-bottom:4px;letter-spacing:-.01em;text-shadow:0 0 20px rgba(240,192,64,.3);}
.idiom-meaning{font-size:0.83rem;color:var(--muted);line-height:1.5;}
.idiom-ex{font-size:0.81rem;color:var(--text);font-style:italic;margin-top:6px;border-left:2px solid var(--gold);padding-left:10px;opacity:.85;}
.card-loading{color:var(--muted);font-size:0.83rem;text-align:center;padding:12px;}

/* ── Kids mode palette override ── */
.kids-mode{
  --bg:#FAF3E4;--surf:#FFFFFF;--surf2:#FFF7E8;--surf3:#FFF0D4;
  --border:#E8DCC4;--borderL:#D6C4A4;
  --text:#2D2521;--muted:#A89889;--mutedD:#8C7B70;
  --gold:#E8943B;--goldL:#F0A84A;--goldT:rgba(232,148,59,.12);--goldD:#C4742A;
  --teal:#3F7A5E;--green:#3F7A5E;
  --user-bubble:#2D2521;--user-bubble-text:#FFFFFF;
  --sans:'Nunito',system-ui,sans-serif;
  --shadow-sm:0 2px 8px rgba(45,37,33,.12);
  --shadow:0 4px 20px rgba(45,37,33,.16);
  --glow-gold:0 0 20px rgba(232,148,59,.25);
  background:var(--bg);
  color:var(--text);
}

/* ── Kids / Ollie ── */
.kids-wrap{flex:1;display:flex;flex-direction:column;}
.ollie-block{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 0 4px;}
.ollie-avatar{
  width:80px;height:80px;
  filter:drop-shadow(0 4px 12px rgba(232,148,59,.35));
}
.ollie-speech{
  background:var(--surf);border:1.5px solid var(--border);
  border-radius:16px 16px 16px 4px;padding:10px 16px;
  font-size:0.88rem;color:var(--text);max-width:280px;text-align:center;
  box-shadow:var(--shadow-sm);
}
.kids-lang-pick{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;padding:6px 0;}
.kids-lang-btn{
  padding:9px 18px;border-radius:12px;
  border:2px solid var(--border);font-size:0.9rem;font-weight:700;
  color:var(--text);background:var(--surf);transition:all .2s;
  box-shadow:var(--shadow-sm);
}
.kids-lang-btn:hover{border-color:var(--gold);transform:translateY(-2px);box-shadow:0 4px 12px rgba(232,148,59,.2);}
.kids-lang-btn.active{
  border-color:var(--gold);
  background:var(--gold);
  color:#fff;font-weight:800;
  box-shadow:0 4px 12px rgba(232,148,59,.3);
}

/* ── Topic grid ── */
.topic-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:8px;padding:10px 14px;}
.topic-btn{
  padding:13px 8px;border-radius:14px;font-size:0.86rem;font-weight:700;
  border:2px solid var(--border);background:var(--surf);color:var(--text);
  transition:all .18s;text-align:center;
  box-shadow:0 3px 0 rgba(45,37,33,.1);
}
.topic-btn:hover{border-color:var(--gold);transform:translateY(-2px);box-shadow:0 5px 0 rgba(45,37,33,.1);}
.topic-btn.active{
  border-color:var(--gold);
  background:var(--gold);
  color:#fff;font-weight:800;
  box-shadow:0 4px 12px rgba(232,148,59,.3);
}

/* ── Listen strip ── */
.listen-strip{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:5px 14px;}
.listen-btn{
  display:flex;align-items:center;gap:5px;padding:7px 14px;
  border-radius:9px;border:1px solid rgba(45,212,191,.35);
  color:var(--teal);font-size:0.82rem;font-weight:600;transition:all .18s;
}
.listen-btn.active{background:rgba(45,212,191,.14);border-color:var(--teal);box-shadow:var(--glow-teal);}
.listen-btn:hover{background:rgba(45,212,191,.08);border-color:var(--teal);}
.dictation-area{padding:6px 14px;}
.dictation-input{
  width:100%;padding:9px 12px;border-radius:10px;
  background:var(--surf2);border:1px solid var(--border);
  color:var(--text);font-size:0.88rem;margin-bottom:7px;
  transition:border-color .15s, box-shadow .15s;
}
.dictation-input:focus{outline:none;border-color:var(--teal);box-shadow:var(--glow-teal);}
.dict-result{padding:7px 11px;border-radius:9px;font-size:0.83rem;font-weight:700;margin-bottom:5px;}
.dict-result.ok{background:rgba(62,207,114,.12);color:var(--green);border:1px solid rgba(62,207,114,.25);}
.dict-result.err{background:rgba(224,85,85,.1);color:var(--red);border:1px solid rgba(224,85,85,.22);}

/* ── Vocab sets ── */
.vs-list{padding:10px 14px;}
.vs-item{
  display:flex;align-items:center;gap:8px;
  padding:11px 13px;background:var(--surf2);
  border:1px solid var(--border);border-radius:12px;margin-bottom:8px;
  transition:border-color .15s, box-shadow .15s;box-shadow:var(--shadow-sm);
}
.vs-item:hover{border-color:var(--borderL);box-shadow:var(--shadow);}
.vs-name{flex:1;font-size:0.88rem;font-weight:600;}
.vs-count{font-size:0.74rem;color:var(--muted);white-space:nowrap;}
.vs-actions{display:flex;gap:4px;}
.vs-btn{font-size:0.76rem;padding:4px 9px;border-radius:7px;border:1px solid var(--border);color:var(--muted);transition:all .15s;}
.vs-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(240,192,64,.06);}
.vs-btn.danger:hover{border-color:var(--red);color:var(--red);background:rgba(224,85,85,.07);}

/* ── Set editor ── */
.set-editor{padding:14px;}
.se-input{
  width:100%;margin-bottom:9px;padding:9px 12px;border-radius:9px;
  background:var(--surf2);border:1px solid var(--border);color:var(--text);font-size:0.88rem;
  transition:border-color .15s, box-shadow .15s;
}
.se-input:focus{outline:none;border-color:var(--blue);box-shadow:var(--glow-blue);}
.word-row{display:flex;gap:5px;margin-bottom:6px;align-items:center;}
.word-row input{
  flex:1;padding:7px 10px;border-radius:8px;
  background:var(--surf);border:1px solid var(--border);color:var(--text);font-size:0.83rem;
  transition:border-color .15s;
}
.word-row input:focus{outline:none;border-color:var(--teal);}
.word-row .del-btn{color:var(--red);padding:6px 8px;border-radius:6px;border:1px solid transparent;opacity:.5;transition:all .15s;}
.word-row .del-btn:hover{border-color:var(--red);opacity:1;}
.import-btn{
  display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:9px;
  border:1px dashed var(--border);color:var(--muted);font-size:0.8rem;
  margin-bottom:10px;transition:all .2s;width:100%;
}
.import-btn:hover{border-color:var(--blue);color:var(--blue);background:rgba(91,156,246,.05);}
.se-footer{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;}
.se-btn{padding:8px 18px;border-radius:10px;font-size:0.86rem;font-weight:600;border:1px solid var(--border);color:var(--muted);transition:all .15s;}
.se-btn:hover{border-color:var(--borderL);color:var(--text);}
.se-btn.primary{
  background:var(--gold);
  color:var(--bg);border-color:transparent;font-weight:700;
  box-shadow:0 4px 14px rgba(201,148,58,.3);
}
.se-btn.primary:hover{box-shadow:var(--glow-gold),var(--shadow);transform:translateY(-1px);}

/* ── Flashcards ── */
.fc-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;padding:20px 14px;}
.fc-prog{font-size:0.78rem;color:var(--muted);}
.fc-mode-btns{display:flex;gap:7px;}
.fc-container{perspective:1000px;width:300px;height:168px;cursor:pointer;}
.fc-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .45s cubic-bezier(.4,0,.2,1);}
.fc-inner.flipped{transform:rotateY(180deg);}
.fc-face{
  position:absolute;width:100%;height:100%;backface-visibility:hidden;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  border-radius:16px;padding:20px;
}
.fc-front{
  background:var(--surf2);border:1px solid var(--borderL);
  box-shadow:var(--shadow);
}
.fc-back{
  background:linear-gradient(135deg,rgba(201,148,58,.15),rgba(201,148,58,.06));
  border:1px solid rgba(201,148,58,.3);
  transform:rotateY(180deg);
  box-shadow:var(--glow-gold),var(--shadow);
}
.fc-word{font-family:var(--serif);font-size:1.7rem;font-weight:500;color:var(--text);text-align:center;}
.fc-transl{font-size:1.05rem;color:var(--goldL);margin-top:7px;text-align:center;font-weight:600;}
.fc-hint{font-size:0.7rem;color:var(--muted);margin-top:6px;}
.fc-sm2-btns{display:flex;gap:9px;}
.fc-sm2-btn{padding:8px 18px;border-radius:10px;font-size:0.83rem;font-weight:700;border:1px solid var(--border);transition:all .18s;}
.fc-sm2-btn.easy{border-color:rgba(62,207,114,.4);color:var(--green);}
.fc-sm2-btn.easy:hover{background:rgba(62,207,114,.12);border-color:var(--green);box-shadow:0 0 14px rgba(62,207,114,.2);}
.fc-sm2-btn.good{border-color:rgba(201,148,58,.4);color:var(--gold);}
.fc-sm2-btn.good:hover{background:rgba(201,148,58,.1);border-color:var(--gold);box-shadow:var(--glow-gold);}
.fc-sm2-btn.hard{border-color:rgba(224,85,85,.35);color:var(--red);}
.fc-sm2-btn.hard:hover{background:rgba(224,85,85,.1);border-color:var(--red);}
.fc-type-input{
  padding:9px 14px;border-radius:10px;
  background:var(--surf2);border:1px solid var(--border);
  color:var(--text);font-size:0.9rem;width:230px;text-align:center;
  transition:border-color .15s, box-shadow .15s;
}
.fc-type-input:focus{outline:none;border-color:var(--teal);box-shadow:var(--glow-teal);}
.fc-check-btn{
  padding:8px 18px;border-radius:10px;
  background:var(--gold);
  color:var(--bg);font-weight:700;font-size:0.84rem;
  box-shadow:0 4px 14px rgba(201,148,58,.3);transition:all .18s;
}
.fc-check-btn:hover{box-shadow:var(--glow-gold),var(--shadow);transform:translateY(-1px);}

/* ── UI lang picker ── */
.ui-lang-picker{display:flex;gap:3px;}
.ui-lang-btn{
  font-size:0.7rem;padding:3px 7px;border-radius:5px;
  border:1px solid var(--border);color:var(--muted);transition:all .15s;
}
.ui-lang-btn:hover{border-color:var(--borderL);color:var(--text);}
.ui-lang-btn.active{
  background:linear-gradient(135deg,var(--gold),var(--goldD));
  color:#111;border-color:transparent;font-weight:700;
}

/* ── Update button ── */
.update-btn{
  position:fixed;bottom:18px;right:18px;z-index:999;
  background:rgba(21,21,30,.85);
  border:1px solid var(--border);border-radius:10px;
  padding:7px 14px;font-size:11px;color:var(--muted);
  transition:all .2s;backdrop-filter:blur(12px);
  box-shadow:var(--shadow);
}
.update-btn:hover{border-color:var(--gold);color:var(--gold);box-shadow:var(--glow-gold);}

/* ── Responsive ── */
@media(max-width:480px){
  .app{padding-bottom:70px;}
  .wod-word{font-size:1.3rem;}
  .fc-container{width:270px;height:154px;}
  .top-bar h1{font-size:1.1rem;}
  .top-bar{padding:11px 12px;}
}
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
      <style>{CSS}</style>
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
