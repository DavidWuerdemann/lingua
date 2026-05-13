import { useState, useRef, useEffect, createContext, useContext } from "react";

/* ─────────────────────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────────────────────── */
const Ctx = createContext({});

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
   LANGUAGES  (array, with flag + tts + per-language scenarios)
───────────────────────────────────────────────────────────── */
const LANGUAGES = [
  {code:"en",flag:"🇬🇧",name:"English",  native:"English",    tts:"en-GB",accent:"#C9943A",
   scenarios:["Job Interview","Pub Conversation","Business Meeting","Doctor's Visit","Flat Hunting","First Date","At the GP","Networking Event","Customer Service Call","Uni Lecture","Salary Negotiation","Making Small Talk"]},
  {code:"es",flag:"🇪🇸",name:"Spanish",  native:"Español",    tts:"es-ES",accent:"#AA151B",
   scenarios:["At the Tapas Bar","Flamenco Night","Beach Resort","Market Visit","Siesta Chat","Fútbol Talk","Airbnb Host","Local Festival","At the Airport","Ordering Food","Doctor's Visit","Job Interview"]},
  {code:"fr",flag:"🇫🇷",name:"French",   native:"Français",   tts:"fr-FR",accent:"#0055A4",
   scenarios:["Boulangerie Visit","Museum Trip","Parisian Café","Making Reservations","At the Pharmacy","Weekend Plans","On the Metro","Wine Tasting","At the Airport","Ordering Food","Doctor's Visit","Job Interview"]},
  {code:"de",flag:"🇩🇪",name:"German",   native:"Deutsch",    tts:"de-DE",accent:"#555555",
   scenarios:["Biergarten Visit","At the Bakery","Taking the U-Bahn","Office Small Talk","Christmas Market","Museum Visit","Renting a Car","At the Pharmacy","At the Airport","Ordering Food","Doctor's Visit","Job Interview"]},
  {code:"it",flag:"🇮🇹",name:"Italian",  native:"Italiano",   tts:"it-IT",accent:"#009246",
   scenarios:["Ordering Pasta","At the Gelateria","Asking Directions","Shopping in Milano","Hotel Check-in","Family Dinner","At the Beach","Football Talk","At the Airport","Ordering Food","Doctor's Visit","Job Interview"]},
  {code:"pt",flag:"🇧🇷",name:"Portuguese",native:"Português", tts:"pt-BR",accent:"#006600",
   scenarios:["Petiscos Bar","Pastéis de Nata Café","Fado Night","Lisbon Tram","At the Beach","Mercado Visit","Booking a Tour","Football Chat","At the Airport","Ordering Food","Doctor's Visit","Job Interview"]},
  {code:"nl",flag:"🇳🇱",name:"Dutch",    native:"Nederlands", tts:"nl-NL",accent:"#E8552A",
   scenarios:["At the Market","Café Visit","Meeting Neighbours","Train Station","Doctor's Visit","Work Meeting","At a Party","Booking a Hotel","At the Airport","Ordering Food","Asking Directions","Job Interview"]},
  {code:"ja",flag:"🇯🇵",name:"Japanese", native:"日本語",      tts:"ja-JP",accent:"#BC002D",
   scenarios:["Convenience Store","Ramen Restaurant","Train Journey","Temple Visit","Karaoke Night","Onsen Etiquette","Harajuku Shopping","Business Meeting","At the Airport","Ordering Food","Doctor's Visit","Shopping"]},
  {code:"zh",flag:"🇨🇳",name:"Chinese",  native:"普通话",      tts:"zh-CN",accent:"#DE2910",
   scenarios:["Dim Sum Brunch","Night Market","Tea House","Taxi Ride","Shopping & Bargaining","Visiting Friends","Street Food Tour","Business Dinner","At the Airport","Ordering Food","Doctor's Visit","Making Friends"]},
];

const KIDS_LANGS = [
  {code:"en",name:"English 🇬🇧",tts:"en-GB"},
  {code:"es",name:"Spanish 🇪🇸",tts:"es-ES"},
  {code:"de",name:"German 🇩🇪",tts:"de-DE"},
];

const KIDS_TOPICS = [
  {id:"animals",   label:"Animals",      emoji:"🐾", color:"#E8B4A0"},
  {id:"food",      label:"Food & Drink", emoji:"🍎", color:"#F4C28A"},
  {id:"school",    label:"School Stuff", emoji:"✏️", color:"#B7C9DC"},
  {id:"body",      label:"Body Parts",   emoji:"🦷", color:"#B9D4B5"},
  {id:"weather",   label:"Weather",      emoji:"⛅", color:"#F4D998"},
  {id:"numbers",   label:"Numbers",      emoji:"🔢", color:"#C9B4D6"},
  {id:"colors",    label:"Colors",       emoji:"🎨", color:"#E8C5BC"},
  {id:"transport", label:"Transport",    emoji:"🚗", color:"#ACBBC9"},
  {id:"sports",    label:"Sports",       emoji:"⚽", color:"#A8C4B5"},
  {id:"stories",   label:"Story Time",   emoji:"📖", color:"#DCC9A8"},
  {id:"opposites", label:"Opposites",    emoji:"↔️", color:"#C7BBC4"},
  {id:"free",      label:"Free Chat",    emoji:"💬", color:"#DDB89E"},
];

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
const todayKey  = () => new Date().toISOString().slice(0,10);
const loadWOD   = (lc)    => { const c=loadLS(SK_WOD,{});  return c[`${lc}_${todayKey()}`]||null; };
const saveWOD   = (lc,d)  => { const c=loadLS(SK_WOD,{});  c[`${lc}_${todayKey()}`]=d;  saveLS(SK_WOD,c);  };
const loadIdiom = (key)   => { const c=loadLS(SK_IDIOM,{}); return c[`${key}_${todayKey()}`]||null; };
const saveIdiom = (key,d) => { const c=loadLS(SK_IDIOM,{}); c[`${key}_${todayKey()}`]=d; saveLS(SK_IDIOM,c); };

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

/* Error tracking */
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
   AUDIO
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


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Nunito:wght@400;600;700;800;900&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
:root{
  /* ── Adult design tokens ── */
  --a-bg:#0F1B2D;--a-surf:#162336;--a-surf2:#1D2E44;
  --a-border:#243650;--a-text:#F0EBE0;--a-cream:#F0EBE0;
  --a-muted:#8899AE;--a-mutedD:#6E7E94;
  --a-gold:#C9943A;--a-goldL:#E5B86A;--a-goldT:rgba(201,148,58,.14);
  --a-terra:#C2634B;
  --a-serif:'Cormorant Garamond',Georgia,serif;
  --a-sans:'DM Sans',-apple-system,system-ui,sans-serif;
  /* ── Kids design tokens ── */
  --k-bg:#FAF3E4;--k-paper:#FFFFFF;--k-paper2:#FFF7E8;
  --k-ink:#2D2521;--k-inkSoft:#6B5F54;--k-mute:#A89889;
  --k-border:#E8DCC4;--k-borderD:#D6C4A4;
  --k-primary:#3F7A5E;--k-accent:#E8943B;
  --k-display:'Fraunces',Georgia,serif;
  --k-sans:'Nunito',-apple-system,system-ui,sans-serif;
  /* ── Legacy aliases (used by inner components) ── */
  --bg:var(--a-bg);--surf:var(--a-surf);--surf2:var(--a-surf2);
  --border:var(--a-border);--text:var(--a-text);--cream:var(--a-cream);
  --muted:var(--a-muted);--gold:var(--a-gold);--goldl:var(--a-goldL);
  --green:#4CAF82;--teal:#4CAF82;
}
html{height:-webkit-fill-available;}
body{font-family:var(--a-sans);background:var(--a-bg);color:var(--a-text);-webkit-text-size-adjust:100%;min-height:-webkit-fill-available;}
button{cursor:pointer;font-family:inherit;border:none;background:none;color:inherit;touch-action:manipulation;}
input,textarea,select{font-family:inherit;font-size:16px;}

/* ═══ ANIMATIONS ═══ */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

/* ═══ DOTS ═══ */
.dots{display:flex;gap:5px;align-items:center;padding:4px 0;}
.dots span{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.6;animation:bounce 1.2s infinite;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}

/* ═══ LANDING ═══ */
.landing{min-height:100svh;display:flex;flex-direction:column;background:var(--a-bg);color:var(--a-text);font-family:var(--a-sans);padding:56px 28px 44px;position:relative;overflow:hidden;}
.l-orb1{position:absolute;top:-120px;right:-120px;width:340px;height:340px;background:radial-gradient(circle,rgba(201,148,58,.18) 0%,transparent 60%);pointer-events:none;}
.l-orb2{position:absolute;bottom:-100px;left:-90px;width:280px;height:280px;background:radial-gradient(circle,rgba(194,99,75,.13) 0%,transparent 60%);pointer-events:none;}
.logo-row{display:flex;align-items:center;gap:12px;margin-bottom:36px;position:relative;}
.logo-icon{width:42px;height:42px;background:var(--a-gold);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--a-bg);box-shadow:0 0 24px rgba(201,148,58,.4);}
.logo-name{font-family:var(--a-serif);font-size:28px;font-weight:600;letter-spacing:-.3px;}
.l-hero{flex:1;position:relative;display:flex;flex-direction:column;justify-content:center;}
.l-h1{font-family:var(--a-serif);font-size:42px;font-weight:600;line-height:1.04;letter-spacing:-.5px;margin-bottom:14px;}
.l-h1 em{font-style:italic;color:var(--a-gold);}
.l-sub{color:var(--a-muted);font-size:14px;line-height:1.65;max-width:300px;margin-bottom:32px;}
.p-cards{display:flex;flex-direction:column;gap:11px;}
.p-card{display:flex;align-items:center;gap:14px;background:var(--a-surf);border:1px solid var(--a-border);border-radius:18px;padding:16px 18px;text-align:left;cursor:pointer;transition:border-color .2s;color:var(--a-text);}
.p-card:hover{border-color:rgba(201,148,58,.4);}
.p-card-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.p-card-icon.adult{background:var(--a-gold);color:var(--a-bg);}
.p-card-icon.kids{background:var(--a-terra);color:#fff;font-size:20px;}
.p-card-body{flex:1;}
.p-card h3{font-family:var(--a-serif);font-size:21px;font-weight:600;color:var(--a-cream);line-height:1.1;}
.p-card p{font-size:12px;color:var(--a-muted);margin-top:2px;}
.p-card-arr{color:var(--a-muted);font-size:18px;}
.l-langs{font-size:10px;color:var(--a-mutedD);letter-spacing:.08em;text-transform:uppercase;margin-top:24px;text-align:center;position:relative;}

/* ═══ ADULT SHELL ═══ */
.shell{min-height:100svh;display:flex;flex-direction:column;background:var(--a-bg);}
.topbar{background:var(--a-surf);border-bottom:1px solid var(--a-border);padding:8px 16px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:100;}
.topbar-logo{width:30px;height:30px;background:var(--a-gold);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--a-bg);flex-shrink:0;}
.topbar-title{font-family:var(--a-serif);font-size:18px;font-weight:600;color:var(--a-cream);flex:1;}
.ghost{background:transparent;border:1px solid var(--a-border);border-radius:9px;padding:6px 13px;font-size:12.5px;color:var(--a-muted);transition:all .2s;cursor:pointer;}
.ghost:hover{border-color:var(--a-muted);color:var(--a-cream);}
.tabs{display:flex;border-bottom:1px solid var(--a-border);background:var(--a-surf);overflow-x:auto;scrollbar-width:none;}
.tabs::-webkit-scrollbar{display:none;}
.tab{flex:1;min-width:max-content;padding:11px 8px;font-size:12px;font-weight:500;letter-spacing:.04em;color:var(--a-muted);border-bottom:2px solid transparent;transition:all .2s;cursor:pointer;white-space:nowrap;}
.tab.on{color:var(--a-gold);border-bottom-color:var(--a-gold);}
.scr{flex:1;padding:20px;max-width:840px;margin:0 auto;width:100%;overflow-y:auto;}
.sh{font-family:var(--a-serif);font-size:26px;font-weight:600;color:var(--a-cream);letter-spacing:-.3px;margin-bottom:4px;}
.ss{color:var(--a-muted);font-size:12.5px;margin-bottom:20px;}

/* ═══ LEVEL BADGE ═══ */
.stars-bar{display:flex;align-items:center;gap:8px;padding:7px 16px;background:var(--a-surf);border-bottom:1px solid var(--a-border);font-size:12px;}
.star-ct{color:var(--a-gold);font-weight:700;}
.lvl-badge{background:var(--a-goldT);border:1px solid rgba(201,148,58,.3);border-radius:20px;padding:2px 9px;font-size:11px;color:var(--a-gold);}
.prog-bar{flex:1;height:4px;background:var(--a-surf2);border-radius:4px;overflow:hidden;}
.prog-fill{height:100%;background:var(--a-gold);border-radius:4px;transition:width .4s ease;}

/* ═══ UI LANG PICKER ═══ */
.ui-lang-picker{display:flex;gap:4px;}
.ui-lang-btn{background:transparent;border:1px solid var(--a-border);border-radius:6px;padding:3px 7px;font-size:11px;color:var(--a-muted);cursor:pointer;transition:all .15s;}
.ui-lang-btn.active{background:var(--a-goldT);border-color:rgba(201,148,58,.4);color:var(--a-gold);}

/* ═══ LANG GRID — 2-col ═══ */
.lgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:22px;}
.lcard{background:var(--a-surf);border:1px solid var(--a-border);border-radius:14px;padding:12px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:9px;text-align:left;}
.lcard:hover{border-color:var(--a-muted);}
.lcard.on{background:rgba(201,148,58,.06);}
.lflag{font-size:22px;flex-shrink:0;}
.linfo h4{font-size:12.5px;font-weight:600;color:var(--a-cream);}
.linfo span{font-size:10.5px;color:var(--a-muted);}

/* ═══ SCENARIOS — list style ═══ */
.scen-head{font-family:var(--a-serif);font-size:20px;font-weight:600;color:var(--a-cream);margin-bottom:3px;}
.scen-sub{color:var(--a-muted);font-size:12px;margin-bottom:12px;}
.sgrid{display:flex;flex-direction:column;gap:7px;margin-bottom:20px;}
.sbtn{background:var(--a-surf);border:1px solid var(--a-border);border-radius:11px;padding:11px 14px;font-size:13px;font-weight:500;color:var(--a-muted);text-align:left;transition:all .2s;display:flex;align-items:center;cursor:pointer;}
.sbtn:hover{color:var(--a-cream);border-color:var(--a-muted);}
.sbtn.on{color:var(--a-gold);border-color:var(--a-gold);background:rgba(201,148,58,.06);}
.sbtn-check{margin-left:auto;color:var(--a-gold);}
.cta-wrap{padding:12px 0 0;}
.cta{width:100%;background:var(--a-gold);color:var(--a-bg);border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:600;letter-spacing:.2px;transition:all .2s;box-shadow:0 6px 22px rgba(201,148,58,.3);cursor:pointer;}
.cta:hover{background:var(--a-goldL);transform:translateY(-1px);}
.cta:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none;}

/* ═══ WORD OF DAY ═══ */
.wod-ltabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.wod-ltab{background:var(--a-surf2);border:1px solid var(--a-border);border-radius:20px;padding:4px 10px;font-size:11px;cursor:pointer;color:var(--a-muted);transition:all .15s;}
.wod-ltab.on{background:var(--a-goldT);border-color:rgba(201,148,58,.4);color:var(--a-gold);}
.wod-card{background:linear-gradient(135deg,var(--a-surf),var(--a-surf2));border:1px solid var(--a-border);border-radius:18px;padding:22px 20px;position:relative;overflow:hidden;margin-bottom:20px;}
.wod-card::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:radial-gradient(circle,rgba(201,148,58,.18) 0%,transparent 65%);pointer-events:none;}
.wod-word{font-family:var(--a-serif);font-size:40px;font-weight:600;color:var(--a-cream);line-height:1.05;margin-top:8px;position:relative;display:flex;align-items:center;gap:10px;}
.wod-pos{font-size:12px;color:var(--a-gold);font-style:italic;position:relative;margin-top:2px;}
.wod-def{font-size:15px;color:var(--a-muted);margin-top:6px;position:relative;}
.wod-ex{background:rgba(255,255,255,.04);border-left:3px solid var(--a-gold);padding:10px 13px;border-radius:0 10px 10px 0;margin-top:14px;position:relative;}
.wod-ex-native{font-size:13px;color:var(--a-cream);line-height:1.55;}
.wod-ex-en{font-size:12px;color:var(--a-muted);font-style:italic;margin-top:4px;}
.wod-colls{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;}
.wod-coll{background:var(--a-surf2);border:1px solid var(--a-border);border-radius:20px;padding:3px 9px;font-size:11px;color:var(--a-muted);}
.wod-fact{font-size:11.5px;color:var(--a-muted);font-style:italic;line-height:1.55;margin-top:12px;position:relative;}
.wod-save{display:inline-block;background:var(--a-goldT);border:1px solid rgba(201,148,58,.3);border-radius:10px;padding:6px 13px;margin-top:14px;font-size:11.5px;color:var(--a-gold);cursor:pointer;transition:all .15s;position:relative;}
.wod-save:hover{background:rgba(201,148,58,.22);}
.card-loading{padding:16px 0;display:flex;align-items:center;gap:8px;color:var(--a-muted);font-size:14px;}

/* ═══ IDIOM OF DAY ═══ */
.idiom-card{background:linear-gradient(135deg,var(--a-surf),var(--a-surf2));border:1px solid var(--a-border);border-radius:18px;padding:20px;margin-bottom:20px;}
.idiom-card h3{font-family:var(--a-serif);font-size:20px;font-weight:600;color:var(--a-cream);margin-bottom:12px;}
.idiom-cat-tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px;}
.idiom-cat-btn{background:var(--a-surf2);border:1px solid var(--a-border);border-radius:20px;padding:4px 10px;font-size:11px;cursor:pointer;color:var(--a-muted);transition:all .15s;}
.idiom-cat-btn.active{background:var(--a-goldT);border-color:rgba(201,148,58,.4);color:var(--a-gold);}
.idiom-phrase{font-family:var(--a-serif);font-size:26px;font-weight:600;color:var(--a-cream);margin-bottom:6px;display:flex;align-items:center;gap:10px;}
.idiom-meaning{font-size:14px;color:var(--a-muted);margin-bottom:8px;}
.idiom-ex{font-size:13px;color:var(--a-cream);background:rgba(255,255,255,.04);border-left:3px solid var(--a-gold);padding:8px 12px;border-radius:0 8px 8px 0;}

/* ═══ ADULT NOTEBOOK ═══ */
.nb-filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.nbf{background:var(--a-surf);border:1px solid var(--a-border);border-radius:20px;padding:3px 10px;font-size:11px;cursor:pointer;color:var(--a-muted);transition:all .15s;}
.nbf.on{background:var(--a-goldT);border-color:rgba(201,148,58,.4);color:var(--a-gold);}
.nudge-banner{background:var(--a-goldT);border:1px solid rgba(201,148,58,.3);border-radius:10px;padding:8px 12px;font-size:12px;color:var(--a-gold);margin-bottom:14px;}
.notebook{padding:0;}
.nb-word{display:flex;align-items:center;gap:8px;background:var(--a-surf);border:1px solid var(--a-border);border-radius:11px;padding:9px 12px;margin-bottom:7px;}
.word-text{flex:1;font-family:var(--a-serif);font-size:17px;color:var(--a-cream);}
.word-lang{font-size:11px;color:var(--a-muted);background:var(--a-surf2);border-radius:4px;padding:2px 6px;}
.due-badge{background:rgba(201,148,58,.2);color:var(--a-gold);border-radius:4px;padding:1px 5px;font-size:10px;font-weight:600;margin-left:6px;}
.error-section{margin-top:20px;}
.error-section h3{font-family:var(--a-serif);font-size:18px;font-weight:600;color:var(--a-cream);margin-bottom:10px;}
.err-item{background:var(--a-surf2);border:1px solid var(--a-border);border-radius:10px;padding:9px 12px;margin-bottom:6px;font-size:13px;}
.fix-err{color:#FF8080;text-decoration:line-through;margin-right:6px;}
.err-ok{color:#4CAF82;font-weight:600;margin-left:2px;}

/* ═══ ADULT CHAT ═══ */
.cshell{display:flex;flex-direction:column;height:calc(100svh - 62px);}
.cinfo{background:var(--a-surf2);border-bottom:1px solid var(--a-border);padding:8px 16px;display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--a-muted);flex-wrap:wrap;}
.ctag{background:var(--a-goldT);border:1px solid rgba(201,148,58,.3);border-radius:20px;padding:2px 9px;font-size:11px;color:var(--a-gold);}
.cmsgs{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:12px;}
.cmsgs::-webkit-scrollbar{width:3px;}
.cmsgs::-webkit-scrollbar-thumb{background:var(--a-border);border-radius:3px;}
.mrow{display:flex;gap:7px;animation:fadeUp .25s ease;}
.mrow.user{flex-direction:row-reverse;}
.mav{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;background:var(--a-surf2);border:1px solid var(--a-border);}
.mcol{max-width:82%;display:flex;flex-direction:column;gap:5px;}
.mrow.user .mcol{align-items:flex-end;}
.bub{padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;}
.mrow.user      .bub{background:var(--a-gold);color:var(--a-bg);border-bottom-right-radius:4px;font-weight:500;}
.mrow.assistant .bub{background:var(--a-surf2);border:1px solid var(--a-border);color:var(--a-cream);border-bottom-left-radius:4px;}
.fix-pill{background:rgba(255,107,107,.08);border:1px solid rgba(255,107,107,.2);border-radius:8px;padding:5px 10px;font-size:11.5px;color:var(--a-muted);margin-top:4px;line-height:1.5;}
.fix-label{font-weight:700;color:var(--a-muted);margin-right:4px;}
.fix-ok{color:#4CAF82;font-weight:600;}
.fix-tip{font-style:italic;margin-left:4px;}
.macts{display:flex;gap:5px;flex-wrap:wrap;}
.mact{background:rgba(255,255,255,.04);border:1px solid var(--a-border);border-radius:8px;padding:3px 8px;font-size:10px;color:var(--a-muted);cursor:pointer;transition:all .15s;}
.mact:hover{border-color:var(--a-muted);color:var(--a-cream);}
.mact.on{border-color:var(--a-gold);color:var(--a-gold);background:var(--a-goldT);}
.mpanel{background:var(--a-surf);border:1px solid var(--a-border);border-left:3px solid var(--a-gold);border-radius:10px;padding:9px 12px;font-size:12.5px;line-height:1.5;color:var(--a-cream);animation:fadeUp .2s ease;}
.plabel{font-size:9.5px;font-weight:600;color:var(--a-gold);text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px;}
.pph{font-size:16px;color:var(--a-gold);font-style:italic;margin-bottom:4px;}
.ptip{color:var(--a-muted);font-size:12.5px;line-height:1.55;}
.summary-box{margin:12px 14px;background:var(--a-surf);border:1px solid var(--a-border);border-left:3px solid var(--a-gold);border-radius:12px;padding:14px 16px;}
.summary-box h3{font-family:var(--a-serif);font-size:17px;color:var(--a-cream);margin-bottom:8px;}
.tts-btn{background:transparent;border:none;cursor:pointer;font-size:14px;padding:2px 4px;border-radius:5px;color:var(--a-muted);transition:all .15s;flex-shrink:0;}
.tts-btn:hover{color:var(--a-gold);}
.chat-actions{display:flex;gap:7px;padding:6px 14px 8px;background:var(--a-surf);border-top:1px solid var(--a-border);}
.action-btn{background:rgba(255,255,255,.04);border:1px solid var(--a-border);border-radius:8px;padding:5px 11px;font-size:11.5px;color:var(--a-muted);cursor:pointer;transition:all .15s;}
.action-btn:hover{border-color:var(--a-muted);color:var(--a-cream);}
.action-btn.primary{background:var(--a-goldT);border-color:rgba(201,148,58,.4);color:var(--a-gold);}
.action-btn:disabled{opacity:.35;cursor:not-allowed;}
.hints{display:flex;gap:5px;overflow-x:auto;padding:8px 12px 4px;border-top:1px solid var(--a-border);background:var(--a-surf);-webkit-overflow-scrolling:touch;scrollbar-width:none;}
.hints::-webkit-scrollbar{height:0;}
.hchip{background:var(--a-goldT);border:1px solid rgba(201,148,58,.25);color:var(--a-gold);font-size:11px;padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;cursor:pointer;transition:all .15s;}
.hchip:hover{background:rgba(201,148,58,.22);}
.iarea{padding:8px 12px 30px;background:var(--a-surf);border-top:1px solid var(--a-border);}
.irow{display:flex;gap:8px;align-items:center;}
.cinput{flex:1;background:var(--a-surf2);border:1px solid var(--a-border);border-radius:12px;padding:10px 13px;font-size:13.5px;color:var(--a-cream);resize:none;min-height:40px;max-height:120px;outline:none;transition:border-color .2s;line-height:1.4;}
.cinput::placeholder{color:var(--a-muted);}
.cinput:focus{border-color:var(--a-gold);}
.sbtn-send{width:40px;height:40px;background:var(--a-gold);border:none;border-radius:11px;color:var(--a-bg);font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;box-shadow:0 4px 14px rgba(201,148,58,.3);cursor:pointer;}
.sbtn-send:hover:not(:disabled){box-shadow:0 6px 20px rgba(201,148,58,.4);transform:translateY(-1px);}
.sbtn-send:disabled{opacity:.35;cursor:not-allowed;}
/* Save modal */
.mbdrop{position:fixed;inset:0;background:rgba(10,16,26,.82);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:var(--a-surf);border:1px solid var(--a-border);border-radius:20px;padding:28px;width:100%;max-width:420px;animation:scaleIn .2s ease;}
.modal h3{font-family:var(--a-serif);font-size:24px;color:var(--a-cream);margin-bottom:6px;}
.modal p{font-size:13px;color:var(--a-muted);margin-bottom:20px;line-height:1.5;}
.minput{width:100%;background:var(--a-surf2);border:1px solid var(--a-border);border-radius:12px;padding:11px 14px;font-size:15px;color:var(--a-cream);outline:none;margin-bottom:10px;transition:border-color .2s;}
.minput::placeholder{color:var(--a-muted);}
.minput:focus{border-color:var(--a-gold);}
.mrow2{display:flex;gap:10px;}
.mcancel{flex:1;background:transparent;border:1px solid var(--a-border);border-radius:12px;padding:11px;font-size:14px;color:var(--a-muted);cursor:pointer;transition:all .2s;}
.mcancel:hover{border-color:var(--a-muted);color:var(--a-cream);}
.msave{flex:1;background:var(--a-gold);border:none;border-radius:12px;padding:11px;font-size:14px;font-weight:600;color:var(--a-bg);cursor:pointer;transition:all .2s;}
.msave:hover{background:var(--a-goldL);}

/* ═══ FLASHCARDS ═══ */
.fc-wrap{padding:16px;max-width:440px;margin:0 auto;}
.fc-prog{font-size:12px;color:var(--a-muted);text-align:center;margin-bottom:12px;}
.fc-mode-btns{display:flex;gap:8px;justify-content:center;margin-bottom:16px;}
.fc-container{perspective:1000px;height:200px;cursor:pointer;margin-bottom:16px;}
.fc-inner{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform .5s;}
.fc-inner.flipped{transform:rotateY(180deg);}
.fc-face{position:absolute;inset:0;backface-visibility:hidden;background:linear-gradient(135deg,var(--a-surf),var(--a-surf2));border:1px solid var(--a-border);border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:10px;}
.fc-back{transform:rotateY(180deg);}
.fc-word{font-family:var(--a-serif);font-size:32px;font-weight:600;color:var(--a-cream);text-align:center;}
.fc-hint{font-size:12px;color:var(--a-muted);}
.fc-sm2-btns{display:flex;gap:8px;justify-content:center;}
.fc-sm2-btn{flex:1;max-width:100px;padding:10px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;}
.fc-sm2-btn.hard{background:rgba(255,107,107,.15);color:#FF8080;}
.fc-sm2-btn.good{background:rgba(201,148,58,.15);color:var(--a-gold);}
.fc-sm2-btn.easy{background:rgba(76,175,130,.15);color:#4CAF82;}
.fc-type-input{width:100%;background:var(--a-surf2);border:1px solid var(--a-border);border-radius:10px;padding:10px 14px;font-size:15px;color:var(--a-cream);outline:none;text-align:center;}
.fc-check-btn{background:var(--a-gold);color:var(--a-bg);border:none;border-radius:10px;padding:10px 24px;font-size:14px;font-weight:600;cursor:pointer;margin-top:8px;}
.dict-result{padding:8px 14px;border-radius:10px;font-size:14px;font-weight:600;}
.dict-result.ok{background:rgba(76,175,130,.12);color:#4CAF82;border:1px solid rgba(76,175,130,.3);}
.dict-result.err{background:rgba(255,107,107,.1);color:#FF8080;border:1px solid rgba(255,107,107,.3);}

/* ═══ VOCAB SETS ═══ */
.vs-list{padding:0;}
.vs-item{background:var(--a-surf);border:1px solid var(--a-border);border-radius:12px;padding:12px 14px;margin-bottom:7px;display:flex;align-items:center;gap:10px;}
.vs-name{flex:1;font-size:14px;font-weight:600;color:var(--a-cream);}
.vs-count{font-size:11px;color:var(--a-muted);white-space:nowrap;}
.vs-actions{display:flex;gap:5px;}
.vs-btn{background:rgba(255,255,255,.04);border:1px solid var(--a-border);border-radius:7px;padding:5px 8px;font-size:14px;cursor:pointer;transition:all .15s;}
.vs-btn:hover{border-color:var(--a-muted);}
.vs-btn.danger:hover{border-color:#FF8080;background:rgba(255,107,107,.1);}

/* ═══ SET EDITOR ═══ */
.set-editor{padding:4px 0 20px;}
.se-input{width:100%;background:var(--a-surf2);border:1px solid var(--a-border);border-radius:10px;padding:10px 14px;font-size:15px;color:var(--a-cream);outline:none;margin-bottom:10px;}
.import-btn{background:rgba(255,255,255,.04);border:1px solid var(--a-border);border-radius:9px;padding:7px 14px;font-size:12px;color:var(--a-muted);cursor:pointer;margin-bottom:10px;display:block;width:100%;text-align:left;}
.word-row{display:flex;gap:6px;margin-bottom:6px;}
.word-row input{flex:1;background:var(--a-surf2);border:1px solid var(--a-border);border-radius:9px;padding:8px 12px;font-size:14px;color:var(--a-cream);outline:none;}
.del-btn{background:transparent;border:none;color:var(--a-muted);font-size:18px;cursor:pointer;padding:2px 6px;border-radius:5px;transition:all .15s;flex-shrink:0;}
.del-btn:hover{color:#FF8080;}
.se-footer{display:flex;gap:8px;margin-top:12px;}
.se-btn{flex:1;background:transparent;border:1px solid var(--a-border);border-radius:10px;padding:10px;font-size:14px;color:var(--a-muted);cursor:pointer;transition:all .2s;}
.se-btn.primary{background:var(--a-gold);border-color:var(--a-gold);color:var(--a-bg);font-weight:600;}

/* ═══ OLLIE PRACTICE ═══ */
.ollie-avatar{width:52px;height:52px;flex-shrink:0;}
.ollie-block{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:var(--a-surf2);border-bottom:1px solid var(--a-border);}
.ollie-speech{flex:1;background:var(--a-surf);border:1px solid var(--a-border);border-radius:14px;border-bottom-left-radius:4px;padding:10px 14px;font-size:14px;line-height:1.5;color:var(--a-cream);}
.listen-strip{display:flex;gap:8px;padding:8px 14px;border-top:1px solid var(--a-border);background:var(--a-surf);}
.listen-btn{background:rgba(255,255,255,.04);border:1px solid var(--a-border);border-radius:20px;padding:5px 12px;font-size:12px;color:var(--a-muted);cursor:pointer;transition:all .15s;}
.listen-btn:hover,.listen-btn.active{border-color:var(--a-gold);color:var(--a-gold);background:var(--a-goldT);}
.dictation-area{padding:10px 14px;background:var(--a-surf2);border-top:1px solid var(--a-border);}
.dictation-input{width:100%;background:var(--a-surf);border:1px solid var(--a-border);border-radius:10px;padding:9px 13px;font-size:15px;color:var(--a-cream);outline:none;margin-bottom:8px;}
.chat-area{overflow-y:auto;flex:1;padding:12px 14px;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch;}
.chat-area::-webkit-scrollbar{width:3px;}
.chat-area::-webkit-scrollbar-thumb{background:var(--a-border);}
.bubble{padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;max-width:84%;animation:fadeUp .2s ease;}
.bubble.user{background:var(--a-gold);color:var(--a-bg);font-weight:500;border-bottom-right-radius:4px;align-self:flex-end;}
.bubble.ai{background:var(--a-surf2);border:1px solid var(--a-border);color:var(--a-cream);border-bottom-left-radius:4px;align-self:flex-start;}
.chat-input{display:flex;gap:8px;padding:8px 12px 28px;background:var(--a-surf);border-top:1px solid var(--a-border);}
.chat-input textarea{flex:1;background:var(--a-surf2);border:1px solid var(--a-border);border-radius:12px;padding:10px 13px;font-size:14px;color:var(--a-cream);resize:none;min-height:40px;max-height:100px;outline:none;line-height:1.4;}
.chat-input textarea::placeholder{color:var(--a-muted);}
.send-btn{background:var(--a-gold);color:var(--a-bg);border:none;border-radius:10px;padding:0 16px;font-size:14px;font-weight:600;cursor:pointer;height:40px;align-self:flex-end;transition:all .15s;white-space:nowrap;}
.send-btn:hover:not(:disabled){background:var(--a-goldL);}
.send-btn:disabled{opacity:.35;cursor:not-allowed;}

/* ═══ KIDS SHELL ═══ */
.ks{min-height:100svh;display:flex;flex-direction:column;background:var(--k-bg);font-family:var(--k-sans);}
.kh{background:var(--k-ink);padding:8px 16px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:100;flex-wrap:wrap;}
.khome-btn{color:#fff;font-size:13px;padding:5px 10px;background:rgba(255,255,255,.1);border-radius:8px;font-family:var(--k-sans);font-weight:700;cursor:pointer;border:none;}
.kh-ollie{display:flex;align-items:center;gap:8px;flex:1;margin-left:4px;}
.kh-title{font-family:var(--k-sans);font-weight:800;font-size:15px;color:#fff;}
.ktabs{display:flex;background:var(--k-paper2);border-bottom:2px solid var(--k-border);}
.ktab{flex:1;padding:10px;font-family:var(--k-sans);font-size:13px;font-weight:800;color:var(--k-mute);border-bottom:3px solid transparent;margin-bottom:-2px;transition:all .2s;cursor:pointer;border:none;background:none;}
.ktab.on{color:var(--k-ink);border-bottom-color:var(--k-accent);}
.kwel{padding:20px 20px 6px;position:relative;}
.kwel h1{font-family:var(--k-display);font-size:26px;font-weight:600;color:var(--k-ink);letter-spacing:-.3px;line-height:1.15;margin-bottom:6px;}
.kwel p{font-family:var(--k-sans);font-size:13px;color:var(--k-inkSoft);font-weight:600;}
.kids-lang-row{padding:0 16px 10px;display:flex;gap:6px;flex-wrap:wrap;}
.kids-lang-btn{background:var(--k-paper);border:2px solid var(--k-border);border-radius:20px;padding:4px 11px;font-family:var(--k-sans);font-size:12px;font-weight:800;color:var(--k-inkSoft);cursor:pointer;transition:all .15s;}
.kids-lang-btn.active{background:var(--k-ink);border-color:var(--k-ink);color:#fff;}
.ktgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;padding:10px 14px 20px;}
.tcard{border-radius:18px;padding:14px 6px 12px;cursor:pointer;border:2px solid rgba(45,37,33,.08);font-family:var(--k-sans);font-weight:800;font-size:11.5px;color:var(--k-ink);text-align:center;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:5px;box-shadow:0 3px 0 rgba(45,37,33,.12);min-height:88px;}
.tcard:hover{transform:translateY(-3px);box-shadow:0 6px 0 rgba(45,37,33,.12);}
.temoji{font-size:26px;}
.kids-recent{padding:0 20px 28px;}
.kids-recent-label{font-family:var(--k-sans);font-size:11px;font-weight:800;color:var(--k-mute);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
.kids-recent-card{background:var(--k-paper);border:2px solid var(--k-border);border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:border-color .2s;}
.kids-recent-card:hover{border-color:var(--k-borderD);}
.kids-recent-info{flex:1;}
.kids-recent-name{font-family:var(--k-sans);font-weight:800;font-size:13.5px;color:var(--k-ink);}
.kids-recent-sub{font-family:var(--k-sans);font-size:11.5px;color:var(--k-inkSoft);font-weight:600;}
.kids-recent-arr{font-size:18px;color:var(--k-mute);}

/* KIDS CHAT */
.kcshell{display:flex;flex-direction:column;flex:1;overflow:hidden;}
.kmsgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch;}
.kmsgs::-webkit-scrollbar{width:3px;}
.kmsgs::-webkit-scrollbar-thumb{background:var(--k-border);border-radius:3px;}
.kmsg{display:flex;gap:8px;animation:fadeUp .25s ease;align-items:flex-end;}
.kmsg.user{flex-direction:row-reverse;}
.kuser-av{width:38px;height:38px;border-radius:50%;background:#B7C9DC;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.kbub-wrap{display:flex;flex-direction:column;gap:5px;max-width:72%;}
.kmsg.user .kbub-wrap{align-items:flex-end;}
.kbub{padding:10px 14px;border-radius:16px;font-family:var(--k-sans);font-weight:600;font-size:14px;line-height:1.45;}
.kmsg.user      .kbub{background:var(--k-ink);color:white;border-bottom-right-radius:4px;}
.kmsg.assistant .kbub{background:var(--k-paper);border:2px solid var(--k-border);color:var(--k-ink);border-bottom-left-radius:4px;}
.ksavebtn{background:#FFF1CF;border:1.5px solid #F4D998;border-radius:8px;padding:4px 10px;font-family:var(--k-sans);font-size:11px;font-weight:800;color:#A87515;cursor:pointer;align-self:flex-start;transition:all .15s;}
.ksavebtn:hover{background:#FFE7A0;}
.klisten-row{display:flex;gap:7px;padding:6px 14px;background:var(--k-paper2);border-top:2px solid var(--k-border);}
.klisten-btn{background:var(--k-paper);border:2px solid var(--k-border);border-radius:20px;padding:5px 12px;font-family:var(--k-sans);font-size:12px;font-weight:700;color:var(--k-inkSoft);cursor:pointer;transition:all .15s;}
.klisten-btn:hover,.klisten-btn.active{background:var(--k-accent);border-color:var(--k-accent);color:#fff;}
.kiarea{background:var(--k-paper);border-top:2px solid var(--k-border);padding:10px 14px 30px;}
.kirow{display:flex;gap:9px;align-items:center;}
.kinput{flex:1;border:2px solid var(--k-border);border-radius:14px;padding:10px 14px;font-size:14px;font-family:var(--k-sans);font-weight:700;background:var(--k-bg);color:var(--k-ink);outline:none;transition:border-color .2s;}
.kinput:focus{border-color:var(--k-ink);}
.kinput::placeholder{color:var(--k-mute);}
.ksendbtn{width:42px;height:42px;border-radius:50%;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 0 rgba(45,37,33,.18);transition:all .15s;color:white;cursor:pointer;border:none;}
.ksendbtn:hover:not(:disabled){transform:translateY(-2px);}
.ksendbtn:disabled{opacity:.4;cursor:not-allowed;}

/* KIDS NOTEBOOK */
.knb{padding:20px;}
.knb-title{font-family:var(--k-display);font-size:24px;font-weight:600;color:var(--k-ink);line-height:1.15;margin-bottom:4px;}
.knb-sub{font-family:var(--k-sans);font-size:12.5px;color:var(--k-inkSoft);font-weight:600;margin-bottom:20px;}
.kwcard{background:var(--k-paper);border:2px solid var(--k-border);border-radius:16px;padding:12px 14px;margin-bottom:8px;display:flex;gap:11px;align-items:flex-start;box-shadow:0 2px 0 rgba(45,37,33,.06);}
.kwe{width:42px;height:42px;background:var(--k-paper2);border:2px solid var(--k-border);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.kwb{flex:1;}
.kww{font-family:var(--k-sans);font-weight:900;font-size:16px;color:var(--k-ink);}
.kwd{font-family:var(--k-sans);font-weight:600;font-size:12.5px;color:var(--k-inkSoft);line-height:1.45;margin-top:2px;}
.kwdate{font-family:var(--k-sans);font-weight:700;font-size:10.5px;color:var(--k-mute);margin-top:5px;letter-spacing:.3px;}
.kwdel{background:none;border:none;color:var(--k-mute);font-size:18px;padding:4px;border-radius:8px;transition:all .15s;flex-shrink:0;cursor:pointer;}
.kwdel:hover{color:#FF6B6B;background:rgba(255,107,107,.1);}
.knempty{text-align:center;padding:48px 20px;}
.knempty .ei{font-size:52px;margin-bottom:12px;}
.knempty p{font-size:15px;color:var(--k-inkSoft);font-family:var(--k-sans);font-weight:700;}

/* KIDS VOCAB SETS (uses adult action-btn/vs-* styles with k- overrides) */
.kids-wrap{background:var(--k-bg);color:var(--k-ink);font-family:var(--k-sans);}
.kids-wrap .action-btn{border-color:var(--k-border);color:var(--k-inkSoft);background:var(--k-paper);}
.kids-wrap .action-btn.primary{background:var(--k-accent);border-color:var(--k-accent);color:#fff;}
.kids-wrap .vs-item{background:var(--k-paper);border-color:var(--k-border);}
.kids-wrap .vs-name{color:var(--k-ink);}
.kids-wrap .vs-count{color:var(--k-inkSoft);}
.kids-wrap .set-editor input,.kids-wrap .se-input{background:var(--k-paper);border-color:var(--k-border);color:var(--k-ink);}
.kids-wrap .send-btn{background:var(--k-accent);color:#fff;}
.kids-wrap .chat-input textarea{background:var(--k-paper);border-color:var(--k-border);color:var(--k-ink);}
.kids-wrap .bubble.ai{background:var(--k-paper);border-color:var(--k-border);color:var(--k-ink);}
.kids-wrap .bubble.user{background:var(--k-ink);color:#fff;}
.topic-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:10px 14px;}
.topic-btn{background:var(--k-paper);border:2px solid var(--k-border);border-radius:12px;padding:8px 6px;font-family:var(--k-sans);font-size:12px;font-weight:700;color:var(--k-inkSoft);cursor:pointer;transition:all .15s;text-align:center;}
.topic-btn.active{background:var(--k-ink);border-color:var(--k-ink);color:#fff;}

/* UPDATE BTN */
.update-btn{display:none;}
`;

const LOGIN_CSS = `
.auth-wrap{min-height:100svh;background:var(--a-bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 20px;position:relative;overflow:hidden;}
.auth-card{background:var(--a-surf);border:1px solid var(--a-border);border-radius:24px;padding:32px 28px;width:100%;max-width:400px;animation:fadeUp .4s ease;}
.auth-logo{display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:28px;}
.auth-logo-icon{width:48px;height:48px;background:var(--a-gold);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 24px rgba(201,148,58,.4);}
.auth-logo-name{font-family:var(--a-serif);font-size:30px;font-weight:600;color:var(--a-cream);}
.auth-field{margin-bottom:14px;}
.auth-label{font-size:12px;font-weight:600;color:var(--a-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;display:block;}
.auth-input{width:100%;background:var(--a-surf2);border:1px solid var(--a-border);border-radius:12px;padding:12px 14px;font-size:16px;color:var(--a-cream);outline:none;transition:border-color .2s;}
.auth-input::placeholder{color:var(--a-muted);}
.auth-input:focus{border-color:var(--a-gold);}
.auth-btn{width:100%;background:var(--a-gold);color:var(--a-bg);border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 16px rgba(201,148,58,.3);margin-top:4px;}
.auth-btn:hover{background:var(--a-goldL);}
.auth-btn:disabled{opacity:.45;cursor:not-allowed;}
.auth-error{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.3);border-radius:10px;padding:10px 14px;font-size:13px;color:#FF8080;margin-bottom:14px;line-height:1.45;}
`;
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

  /* front = the word to learn, back = its meaning/translation */
  const front   = current.word   || current.text || "";
  const back    = current.transl || current.text || "?";
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
      .then(text=>{ setMsgs([{role:"assistant",content:text}]); bounce(); })
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
      setMsgs(m=>[...m,{role:"assistant",content:raw}]); bounce();
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
  const {uiLang}  = useContext(Ctx);
  const langObj   = KIDS_LANGS.find(l=>l.code===kidLang)||KIDS_LANGS[0];

  // Map UI language code to full language name for Ollie's instructions
  const UI_LANG_NAMES = {EN:"English",DE:"German",NL:"Dutch",FR:"French",ES:"Spanish"};
  const instrLang = UI_LANG_NAMES[uiLang] || "English";

  useEffect(()=>{
    setMsgs([]); setCurrentAi(""); setDictVal(""); setDictResult(null); setListenMode(false);
  },[topic,kidLang,uiLang]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  const system = `You are Ollie the owl 🦉, a fun tutor teaching children ${langObj.name}! Topic: "${topic}".
IMPORTANT: Give ALL explanations and instructions in ${instrLang}. Teach ${langObj.name} words/phrases.
Rules: max 2 SHORT sentences. Lots of emojis. Super encouraging. Always end with ONE simple question.
New words: bold them and give the ${instrLang} meaning in brackets like **word** [meaning].`;

  function bounce() { setOllieAnim(true); setTimeout(()=>setOllieAnim(false),1500); }

  useEffect(()=>{
    if (!topic) return;
    setLoading(true);
    ai([{role:"user",content:"Start now — greet the child and introduce the topic with one fun fact or question!"}],system,120)
      .then(text=>{ setMsgs([{role:"assistant",content:text}]); setCurrentAi(text); bounce(); })
      .catch(()=>{}).finally(()=>setLoading(false));
  },[topic,kidLang,uiLang]);

  async function send() {
    if (!input.trim()||loading) return;
    sfx.send(); haptic([15]);
    const newMsgs=[...msgs,{role:"user",content:input.trim()}];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try {
      const raw=await ai(newMsgs,system,120);
      setMsgs(m=>[...m,{role:"assistant",content:raw}]);
      setCurrentAi(raw); bounce();
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

/* ═══════════════════════════════════════════════════════════
   SAVE MODAL
═══════════════════════════════════════════════════════════ */
function SaveModal({ text, lang, onClose }) {
  const [word, setWord] = useState(text?.split(/[\s,!?.]+/).find(w=>w.length>1)||"");
  return (
    <div className="mbdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Save to Notebook</h3>
        <p>Edit the word you want to remember</p>
        <input className="minput" value={word} onChange={e=>setWord(e.target.value)}
          placeholder="Word / phrase…" autoFocus/>
        <div className="mrow2">
          <button className="mcancel" onClick={onClose}>Cancel</button>
          <button className="msave" onClick={()=>{
            if (!word.trim()) return;
            addAdultWord(word.trim(), lang||""); onClose();
          }}>Save →</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADULT CHAT  (new design, all old features)
═══════════════════════════════════════════════════════════ */
function AdultChat({lang, scenario, t}) {
  const [msgs,setMsgs]         = useState([]);
  const [input,setInput]       = useState("");
  const [loading,setLoading]   = useState(false);
  const [panels,setPanels]     = useState({});
  const [modal,setModal]       = useState(null);
  const [summary,setSummary]   = useState("");
  const [summLoading,setSummLoading] = useState(false);
  const endRef = useRef();
  const langObj = LANGUAGES.find(l=>l.code===lang);

  const sysPrompt = `You are a native ${langObj?.name} speaker in this real-life scenario: "${scenario}".
CRITICAL: Reply ONLY in ${langObj?.name}. Max 2 short punchy sentences — this is a live conversation, not a lesson.
Stay in character, be natural and spontaneous. React to what the user says.
If they make a grammar/vocabulary error, append this AFTER your reply (no blank line):
<fix>{"err":"exact wrong phrase","fix":"correct form","tip":"one-line English tip"}</fix>
No <fix> if no error.`;

  useEffect(()=>{
    setMsgs([]); setSummary(""); setInput(""); setPanels({});
    setLoading(true);
    ai([{role:"user",content:"Start the conversation right now with one short opening line — stay in character!"}], sysPrompt, 120)
      .then(raw=>{ const {text}=parseAiResponse(raw); setMsgs([{role:"assistant",content:text,id:1}]); })
      .catch(()=>setMsgs([{role:"assistant",content:"Connection error. Please try again.",id:1}]))
      .finally(()=>setLoading(false));
  },[lang,scenario]);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading,panels]);

  async function send() {
    if (!input.trim()||loading) return;
    sfx.send(); haptic([15]);
    const userMsg = {role:"user",content:input.trim(),id:Date.now()};
    const next = [...msgs, userMsg]; setMsgs(next); setInput(""); setLoading(true);
    try {
      const apiMsgs = next.map(m=>({role:m.role,content:m.content}));
      const raw = await ai(apiMsgs, sysPrompt, 220);
      const {text,fix} = parseAiResponse(raw);
      if (fix) addError(fix);
      addStarsTo(2);
      setMsgs(p=>[...p,{role:"assistant",content:text,fix,id:Date.now()+1}]);
    } catch(e) {
      setMsgs(p=>[...p,{role:"assistant",content:`Error: ${e.message}`,id:Date.now()}]);
    }
    setLoading(false);
  }

  async function togglePanel(id, text, type) {
    if (panels[id]?.type===type) { setPanels(p=>{const n={...p};delete n[id];return n;}); return; }
    setPanels(p=>({...p,[id]:{type,loading:true,content:""}}));
    try {
      let content;
      if (type==="translation") {
        content = await ai([{role:"user",content:`Translate to English. Translation only:\n"${text}"`}],null,250);
      } else {
        const raw = await ai([{role:"user",content:`Pronunciation guide for an English speaker. JSON only: {"phonetic":"...","tips":"...","sounds":"..."}\nText: "${text}"`}],null,250);
        try { content=JSON.parse(raw.replace(/```json|```/g,"").trim()); } catch { content={phonetic:"",tips:raw,sounds:""}; }
      }
      setPanels(p=>({...p,[id]:{type,loading:false,content}}));
    } catch { setPanels(p=>({...p,[id]:{type,loading:false,content:"Could not load."}})); }
  }

  async function getSessionSummary() {
    if (msgs.length<2||summLoading) return;
    setSummLoading(true);
    const transcript = msgs.map(m=>`${m.role}: ${m.content}`).join("\n");
    try {
      const s = await ai([{role:"user",content:`Summarise this language learning session in 4-5 bullet points: topics, vocab, grammar, progress.\n\n${transcript}`}],"You are a language coach.",300);
      setSummary(s);
    } catch {}
    setSummLoading(false);
  }

  const HINTS_FOR = lang => ({
    es:["¿Puede repetir?","No entiendo","¿Cuánto cuesta?","Muchas gracias","¿Más despacio?"],
    fr:["Pouvez-vous répéter?","Je ne comprends pas","Combien ça coûte?","Merci beaucoup","Plus lentement?"],
    de:["Können Sie das wiederholen?","Ich verstehe nicht","Was kostet das?","Danke schön","Bitte langsamer?"],
    it:["Può ripetere?","Non capisco","Quanto costa?","Grazie mille","Parla più lentamente?"],
    pt:["Pode repetir?","Não entendo","Quanto custa?","Muito obrigado","Mais devagar?"],
    nl:["Kunt u dat herhalen?","Ik begrijp het niet","Hoeveel kost het?","Dank u wel","Langzamer?"],
    ja:["もう一度言ってください","わかりません","いくらですか?","ありがとうございます","ゆっくり話してください"],
    zh:["请再说一遍","我不明白","多少钱?","非常感谢","请说慢一点"],
  })[lang] || [];

  return (
    <div className="cshell">
      <div className="cinfo">
        <span style={{fontSize:16}}>{langObj?.flag}</span>
        <span style={{fontWeight:600,color:"var(--a-cream)"}}>{langObj?.name}</span>
        <span className="ctag">{scenario}</span>
      </div>
      <div className="cmsgs">
        {msgs.map(m=>(
          <div key={m.id} className={`mrow ${m.role}`}>
            <div className="mav">{m.role==="user"?"👤":langObj?.flag}</div>
            <div className="mcol">
              <div className="bub">
                {m.content}
                {m.role==="assistant" && <button className="tts-btn" onClick={()=>speak(m.content,langObj?.tts||"en-US")}>🔊</button>}
              </div>
              {m.fix && (
                <div className="fix-pill">
                  <span className="fix-label">{t.fix}:</span>
                  <span className="fix-err">{m.fix.err}</span>
                  {" → "}
                  <span className="fix-ok">{m.fix.fix}</span>
                  {m.fix.tip && <span className="fix-tip">({m.fix.tip})</span>}
                </div>
              )}
              {m.role==="assistant" && (
                <div className="macts">
                  <button className={`mact${panels[m.id]?.type==="translation"?" on":""}`}
                    onClick={()=>togglePanel(m.id,m.content,"translation")}>🇬🇧 Translate</button>
                  <button className={`mact${panels[m.id]?.type==="pronunciation"?" on":""}`}
                    onClick={()=>togglePanel(m.id,m.content,"pronunciation")}>🔉 Pronounce</button>
                  <button className="mact" onClick={()=>setModal({text:m.content,lang})}>📌 {t.save}</button>
                </div>
              )}
              {panels[m.id] && (
                <div className="mpanel">
                  {panels[m.id].loading ? <Dots/> : panels[m.id].type==="translation"
                    ? <><div className="plabel">English Translation</div>{panels[m.id].content}</>
                    : (()=>{const c=panels[m.id].content; return (<>
                        <div className="plabel">Pronunciation Guide</div>
                        {c.phonetic && <div className="pph">/{c.phonetic}/</div>}
                        {c.tips && <div className="ptip">{c.tips}</div>}
                        {c.sounds && <div className="ptip" style={{marginTop:6}}>🎯 Watch: {c.sounds}</div>}
                      </>);})()}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mrow assistant">
            <div className="mav">{langObj?.flag}</div>
            <div className="mcol"><div className="bub"><Dots/></div></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      {summary && (
        <div className="summary-box">
          <h3>📋 {t.summary}</h3>
          <div style={{whiteSpace:"pre-wrap",fontSize:13,color:"var(--a-muted)",lineHeight:1.6}}>{summary}</div>
        </div>
      )}
      <div className="hints">
        {HINTS_FOR(lang).map(h=><button key={h} className="hchip" onClick={()=>setInput(h)}>{h}</button>)}
      </div>
      <div className="chat-actions">
        {msgs.length>0 && <button className="action-btn" onClick={()=>{setMsgs([]);setSummary("");sfx.click();}}>{t.clear}</button>}
        {msgs.filter(m=>m.role==="assistant").length>=2 && (
          <button className="action-btn" onClick={getSessionSummary} disabled={summLoading}>
            {summLoading?<Dots/>:`📋 ${t.summary}`}
          </button>
        )}
      </div>
      <div className="iarea">
        <div className="irow">
          <textarea className="cinput" rows={1} value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder={`${t.startChat}…`}/>
          <button className="sbtn-send" onClick={send} disabled={loading||!input.trim()}>↑</button>
        </div>
      </div>
      {modal && <SaveModal text={modal.text} lang={modal.lang} onClose={()=>{ setModal(null); sfx.save(); haptic([20,10,20]); }}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADULT MODE  (new shell + all tabs)
═══════════════════════════════════════════════════════════ */
function AdultMode({t, stars}) {
  const [tab,setTab]         = useState("chat");
  const [lang,setLang]       = useState("es");
  const [scenIdx,setScenIdx] = useState(0);
  const [inChat,setInChat]   = useState(false);
  const {onBack,uiLang,setUiLang} = useContext(Ctx);
  const langObj              = LANGUAGES.find(l=>l.code===lang);

  if (inChat) return (
    <div className="shell">
      <div className="topbar">
        <div className="topbar-logo">✦</div>
        <span className="topbar-title">Lingua</span>
        <button className="ghost" onClick={()=>setInChat(false)}>← {t.scenario}</button>
        <button className="ghost" onClick={onBack}>Home</button>
      </div>
      <AdultChat lang={lang} scenario={langObj?.scenarios[scenIdx]||""} t={t}/>
    </div>
  );

  return (
    <div className="shell">
      <div className="topbar">
        <div className="topbar-logo">✦</div>
        <span className="topbar-title">Lingua</span>
        <UiLangPicker uiLang={uiLang} setUiLang={(l)=>{setUiLang(l);saveLS(SK_UILNG,l);sfx.click();}}/>
        <button className="ghost" onClick={onBack}>← Home</button>
      </div>
      <LevelBadge stars={stars}/>
      <div className="tabs">
        {[["chat",t.chat],["notebook",t.notebook],["wod",t.wordOfDay],["idiom",t.idiomOfDay],["vocab",t.vocabSets]].map(([k,l])=>(
          <button key={k} className={`tab${tab===k?" on":""}`} onClick={()=>{setTab(k);sfx.click();}}>
            {l}
          </button>
        ))}
      </div>

      {tab==="chat" && (
        <div className="scr">
          <h2 className="sh">{t.language}</h2>
          <p className="ss">Eight languages · scenario-based conversation</p>
          <div className="lgrid">
            {LANGUAGES.map(l=>(
              <div key={l.code} className={`lcard${lang===l.code?" on":""}`}
                style={lang===l.code?{borderColor:l.accent,boxShadow:`0 4px 18px ${l.accent}28`}:{}}
                onClick={()=>{setLang(l.code);setScenIdx(0);sfx.click();}}>
                <span className="lflag">{l.flag}</span>
                <div className="linfo"><h4>{l.name}</h4><span>{l.native}</span></div>
              </div>
            ))}
          </div>
          <div className="scen-head">{t.scenario}</div>
          <div className="scen-sub">Each gives you a native partner with real context</div>
          <div className="sgrid">
            {langObj?.scenarios.map((s,i)=>(
              <button key={s} className={`sbtn${scenIdx===i?" on":""}`} onClick={()=>{setScenIdx(i);sfx.click();}}>
                <span>{s}</span>
                {scenIdx===i && <span className="sbtn-check">✓</span>}
              </button>
            ))}
          </div>
          <div className="cta-wrap">
            <button className="cta" onClick={()=>{setInChat(true);sfx.click();}}>
              Start conversation →
            </button>
          </div>
        </div>
      )}
      {tab==="notebook" && <AdultNotebookScreen t={t}/>}
      {tab==="wod"      && <WodScreen lang={lang} t={t}/>}
      {tab==="idiom"    && <IdiomScreen lang={lang} t={t}/>}
      {tab==="vocab"    && <div className="scr"><VocabSets t={t} kidLang="en"/></div>}
    </div>
  );
}

function AdultNotebookScreen({t}) {
  const words = loadNB();
  const due   = getDueWords(words);
  const errs  = getErrors().slice(0,8);
  const [,forceUpdate] = useState(0);
  return (
    <div className="scr">
      <h2 className="sh">{t.notebook}</h2>
      <p className="ss">{words.length} saved word{words.length!==1?"s":""}</p>
      {due.length>0 && <div className="nudge-banner">🔔 {due.length} word{due.length>1?"s":""} {t.dueReview}: {due.slice(0,3).map(w=>w.text).join(", ")}{due.length>3?"…":""}</div>}
      {words.length===0 && <p style={{color:"var(--a-muted)",fontSize:14}}>{t.noWords}</p>}
      {words.map((w,i)=>{
        const isDue = w.nextReview && new Date(w.nextReview)<=new Date();
        return (
          <div key={i} className="nb-word">
            <span className="word-text">{w.text}{isDue && <span className="due-badge">review</span>}</span>
            <span className="word-lang">{w.lang}</span>
            <button className="tts-btn" onClick={()=>speak(w.text,LANGUAGES.find(x=>x.code===w.lang)?.tts||"en-US")}>🔊</button>
            <button className="del-btn" onClick={()=>{ delAdultWord(w.text); forceUpdate(n=>n+1); }}>✕</button>
          </div>
        );
      })}
      {errs.length>0 && (
        <div className="error-section">
          <h3>{t.errorPatterns}</h3>
          {errs.map((e,i)=>(
            <div key={i} className="err-item">
              <span className="fix-err">{e.err}</span>{" → "}<span className="err-ok">{e.fix}</span>
              {e.tip && <div style={{marginTop:3,fontSize:12,color:"var(--a-muted)"}}>{e.tip}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WodScreen({lang, t}) {
  const [data,setData]       = useState(null);
  const [loading,setLoading] = useState(false);
  const [saved,setSaved]     = useState(false);
  const langObj = LANGUAGES.find(l=>l.code===lang);

  useEffect(()=>{
    setSaved(false);
    const cached = loadWOD(lang);
    if (cached) { setData(cached); return; }
    setLoading(true);
    ai([{role:"user",content:`Give me one interesting ${langObj?.name||lang} word of the day. Reply ONLY valid JSON with keys: word, pos, definition (English), example (sentence in ${langObj?.name||lang}), collocations (array of 4).`}],
       "Language expert. Output only valid JSON.",300)
      .then(raw=>{ const m=raw.match(/\{[\s\S]*\}/); if(m){const d=JSON.parse(m[0]);saveWOD(lang,d);setData(d);} })
      .catch(()=>{}).finally(()=>setLoading(false));
  },[lang]);

  return (
    <div className="scr">
      <h2 className="sh">{t.wordOfDay}</h2>
      <p className="ss">{new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</p>
      <div className="wod-card">
        {loading && <div className="card-loading"><Dots/> Loading {langObj?.name} word…</div>}
        {!loading && data && (
          <>
            <div style={{fontSize:11,color:"var(--a-muted)",textTransform:"uppercase",letterSpacing:".06em"}}>{langObj?.flag} {langObj?.name}</div>
            <div className="wod-word">
              {data.word}
              <button className="tts-btn" onClick={()=>speak(data.word,langObj?.tts||"en-US")}>🔊</button>
            </div>
            {data.pos && <div className="wod-pos">{data.pos}</div>}
            {data.definition && <div className="wod-def">{data.definition}</div>}
            {data.example && <div className="wod-ex"><div className="wod-ex-native">{data.example}</div></div>}
            {data.collocations?.length>0 && <div className="wod-colls">{data.collocations.map((c,i)=><span key={i} className="wod-coll">{c}</span>)}</div>}
            <button className="wod-save" onClick={()=>{ if(!saved&&data){addAdultWord(data.word,lang);setSaved(true);sfx.save();} }}>
              {saved?"✓ Saved":"📌 "+t.save+" to notebook"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function IdiomScreen({lang, t}) {
  const [cat,setCat]         = useState(IDIOM_CATS[0]);
  const [data,setData]       = useState(null);
  const [loading,setLoading] = useState(false);
  const langObj = LANGUAGES.find(l=>l.code===lang);

  useEffect(()=>{
    const cached = loadIdiom(cat+lang);
    if (cached) { setData(cached); return; }
    setLoading(true);
    ai([{role:"user",content:`Give me a ${cat}-themed idiom in ${langObj?.name||lang}. ONLY valid JSON: {"phrase":"...","meaning":"...","example":"..."}`}],
       "Language expert. Output only valid JSON.",200)
      .then(raw=>{ const m=raw.match(/\{[\s\S]*\}/); if(m){const d=JSON.parse(m[0]);saveIdiom(cat+lang,d);setData(d);} })
      .catch(()=>{}).finally(()=>setLoading(false));
  },[cat,lang]);

  return (
    <div className="scr">
      <h2 className="sh">{t.idiomOfDay}</h2>
      <p className="ss">{langObj?.flag} {langObj?.name}</p>
      <div className="idiom-card">
        <h3>💬 {t.idiomOfDay}</h3>
        <div className="idiom-cat-tabs">
          {IDIOM_CATS.map(c=>(
            <button key={c} className={`idiom-cat-btn${cat===c?" active":""}`}
              onClick={()=>{setCat(c);setData(null);sfx.click();}}>
              {c}
            </button>
          ))}
        </div>
        {loading && <div className="card-loading"><Dots/></div>}
        {!loading && data && (
          <>
            <div className="idiom-phrase">
              {data.phrase}
              <button className="tts-btn" onClick={()=>speak(data.phrase,langObj?.tts||"en-US")}>🔊</button>
            </div>
            <div className="idiom-meaning">{data.meaning}</div>
            {data.example && <div className="idiom-ex">{data.example}</div>}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KIDS MODE  (new shell + all old features)
═══════════════════════════════════════════════════════════ */
function KidsIdiomScreen({kidLang, t}) {
  const {uiLang} = useContext(Ctx);
  const KIDS_IDIOM_CATS = ["Animals 🐾","Food 🍕","Weather ☁️","Feelings 😊","Colours 🎨"];
  const [cat,setCat]         = useState(KIDS_IDIOM_CATS[0]);
  const [data,setData]       = useState(null);
  const [loading,setLoading] = useState(false);
  const langObj = KIDS_LANGS.find(l=>l.code===kidLang)||KIDS_LANGS[0];
  const UI_LANG_NAMES = {EN:"English",DE:"German",NL:"Dutch",FR:"French",ES:"Spanish"};
  const instrLang = UI_LANG_NAMES[uiLang]||"English";

  useEffect(()=>{
    const key = `kids_idiom_${cat}_${kidLang}_${new Date().toISOString().slice(0,10)}`;
    const cached = loadLS(key,null);
    if (cached) { setData(cached); return; }
    setLoading(true);
    ai([{role:"user",content:`Give a fun, child-friendly ${cat} idiom in ${langObj.name} for kids aged 5-12. Explain it in simple ${instrLang}. JSON only: {"phrase":"...","meaning":"(in ${instrLang}, simple)","example":"(in ${langObj.name}, simple)","emoji":"one emoji"}`}],
       "You explain idioms to children in a fun way. Output only valid JSON.",180)
      .then(raw=>{const m=raw.match(/\{[\s\S]*\}/);if(m){const d=JSON.parse(m[0]);saveLS(key,d);setData(d);}})
      .catch(()=>{}).finally(()=>setLoading(false));
  },[cat,kidLang,uiLang]);

  return (
    <div className="knb" style={{overflowY:"auto",flex:1}}>
      <div className="knb-title">💬 Fun Expressions!</div>
      <div className="knb-sub">Cool phrases Ollie loves 🦉</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {KIDS_IDIOM_CATS.map(c=>(
          <button key={c} className={`kids-lang-btn${cat===c?" active":""}`}
            onClick={()=>{setCat(c);setData(null);sfx.click();}}>
            {c}
          </button>
        ))}
      </div>
      {loading && <div style={{padding:20,color:"var(--k-mute)",fontFamily:"var(--k-sans)",fontWeight:700}}><Dots/> Ollie is thinking…</div>}
      {!loading && data && (
        <div className="kwcard" style={{flexDirection:"column",gap:8}}>
          <div style={{fontSize:48,textAlign:"center"}}>{data.emoji}</div>
          <div style={{fontFamily:"var(--k-display)",fontSize:22,fontWeight:600,color:"var(--k-ink)",textAlign:"center"}}>{data.phrase}</div>
          <div style={{fontFamily:"var(--k-sans)",fontSize:14,color:"var(--k-inkSoft)",fontWeight:600,textAlign:"center"}}>{data.meaning}</div>
          {data.example && <div style={{background:"var(--k-paper2)",border:"2px solid var(--k-border)",borderRadius:12,padding:"10px 14px",fontFamily:"var(--k-sans)",fontSize:13,color:"var(--k-ink)",fontWeight:700,marginTop:4}}>{data.example}</div>}
          <button className="listen-btn" style={{alignSelf:"center",marginTop:4}} onClick={()=>speak(data.phrase,langObj.tts,0.85)}>🔊 Hear it!</button>
        </div>
      )}
    </div>
  );
}

function KidsMode({t, onStars}) {
  const [tab,setTab]         = useState("chat");
  const [kidLang,setKidLang] = useState(loadLS(SK_KIDLG,"en"));
  const [topic,setTopic]     = useState(null);
  const {onBack}             = useContext(Ctx);
  const nbCount              = loadKNB().length;

  function selectLang(code) { setKidLang(code); saveLS(SK_KIDLG,code); sfx.click(); haptic([15]); }

  return (
    <div className="ks">
      <div className="kh">
        <button className="khome-btn" onClick={onBack}>← Home</button>
        <div className="kh-ollie">
          <OllieAvatar size={28}/>
          <span className="kh-title">Ollie's Language World</span>
        </div>
        {topic && <button className="khome-btn" onClick={()=>setTopic(null)}>← Topics</button>}
      </div>

      <div className="ktabs">
        {[["chat","📚 Learn"],["idiom","💬 Expressions"],["notebook","⭐ "+t.notebook],["vocab","🃏 "+t.vocabSets]].map(([k,l])=>(
          <button key={k} className={`ktab${tab===k?" on":""}`}
            onClick={()=>{setTab(k);setTopic(null);sfx.click();}}>
            {l}
          </button>
        ))}
      </div>

      {tab==="chat" && (
        <>
          {/* Language picker */}
          <div className="kids-lang-row">
            {KIDS_LANGS.map(l=>(
              <button key={l.code} className={`kids-lang-btn${kidLang===l.code?" active":""}`}
                onClick={()=>selectLang(l.code)}>{l.name}</button>
            ))}
          </div>
          {!topic ? (
            <div style={{overflowY:"auto",flex:1}}>
              <div className="kwel">
                <h1>What shall we<br/>learn today?</h1>
                <p>Pick a topic and chat with Ollie 🦉</p>
              </div>
              <div className="ktgrid">
                {KIDS_TOPICS.map(tp=>(
                  <button key={tp.id} className="tcard" style={{background:tp.color}}
                    onClick={()=>{setTopic(tp);sfx.click();haptic([15]);}}>
                    <span className="temoji">{tp.emoji}</span>
                    <span>{tp.label}</span>
                  </button>
                ))}
              </div>
              {nbCount>0 && (
                <div className="kids-recent">
                  <div className="kids-recent-label">Recent</div>
                  <div className="kids-recent-card" onClick={()=>{setTab("notebook");setTopic(null);}}>
                    <span style={{fontSize:24}}>{KIDS_TOPICS[0].emoji}</span>
                    <div className="kids-recent-info">
                      <div className="kids-recent-name">My Word Book</div>
                      <div className="kids-recent-sub">{nbCount} word{nbCount!==1?"s":""} saved</div>
                    </div>
                    <div className="kids-recent-arr">›</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <KidsChat topic={topic.label} kidLang={kidLang} t={t} onStars={onStars}/>
          )}
        </>
      )}
      {tab==="idiom"    && <KidsIdiomScreen kidLang={kidLang} t={t}/>}
      {tab==="notebook" && <KidsNotebookScreen t={t}/>}
      {tab==="vocab"    && <div className="kids-wrap" style={{padding:14,flex:1,overflowY:"auto"}}><VocabSets t={t} kidLang={kidLang}/></div>}
    </div>
  );
}

function KidsNotebookScreen({t}) {
  const [words,setWords] = useState(loadKNB());
  return (
    <div className="knb" style={{overflowY:"auto",flex:1}}>
      <div className="knb-title">⭐ My Word Book</div>
      <div className="knb-sub">Words you've saved with Ollie!</div>
      {words.length===0 && <div className="knempty"><div className="ei">📖</div><p>Chat and tap "Save" to start your collection!</p></div>}
      {words.map((w,i)=>(
        <div key={i} className="kwcard">
          <div className="kwe">{w.emoji||"⭐"}</div>
          <div className="kwb">
            <div className="kww">{w.text||w.word}</div>
            {w.context && <div className="kwd">{w.context}</div>}
            <div className="kwdate">{w.lang} · {new Date(w.date).toLocaleDateString()}</div>
          </div>
          <button className="kwdel" onClick={()=>{ saveKNB(loadKNB().filter(x=>x.text!==w.text)); setWords(loadKNB()); }}>×</button>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP  (new landing page design)
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [mode,setMode]     = useState(loadLS("lingua_last_mode", null));
  const [uiLang,setUiLang] = useState(loadLS(SK_UILNG,"EN"));
  const [stars,setStars]   = useState(getStarsData().total);
  const t = T[uiLang] || T.EN;

  function handleStars(newTotal) { setStars(newTotal); sfx.star(); haptic([20,10,20,10,40]); }
  function goMode(m) { setMode(m); saveLS("lingua_last_mode", m); sfx.click(); }

  const ctx = { t, uiLang, setUiLang: (l)=>{ setUiLang(l); saveLS(SK_UILNG,l); }, onBack:()=>{ setMode(null); saveLS("lingua_last_mode",null); } };

  return (
    <Ctx.Provider value={ctx}>
      <style>{CSS}{LOGIN_CSS}</style>
      {mode==="adult" && <AdultMode t={t} stars={stars} onStars={handleStars}/>}
      {mode==="kids"  && <KidsMode  t={t} onStars={handleStars}/>}

      {!mode && (
        <div className="landing">
          <div className="l-orb1"/><div className="l-orb2"/>
          <div className="logo-row">
            <div className="logo-icon">✦</div>
            <div className="logo-name">Lingua</div>
          </div>
          <div className="l-hero">
            <h1 className="l-h1">Learn to <em>speak</em>,<br/>not just study.</h1>
            <p className="l-sub">Jump into a real conversation in seconds. No streaks, no points — just talking.</p>
            <div className="p-cards">
              <button className="p-card" onClick={()=>goMode("adult")}>
                <div className="p-card-icon adult">✈</div>
                <div className="p-card-body">
                  <h3>{t.adultMode}</h3>
                  <p>9 languages · scenarios · flashcards · notebook</p>
                </div>
                <div className="p-card-arr">›</div>
              </button>
              <button className="p-card" onClick={()=>goMode("kids")}>
                <div className="p-card-icon kids">🦉</div>
                <div className="p-card-body">
                  <h3>{t.kidsMode}</h3>
                  <p>Chat with Ollie · 12 topics · fun expressions</p>
                </div>
                <div className="p-card-arr">›</div>
              </button>
            </div>
          </div>
          <div className="l-langs">🇪🇸 ES · 🇫🇷 FR · 🇩🇪 DE · 🇮🇹 IT · 🇵🇹 PT · 🇳🇱 NL · 🇯🇵 JP · 🇨🇳 ZH</div>
        </div>
      )}
    </Ctx.Provider>
  );
}
