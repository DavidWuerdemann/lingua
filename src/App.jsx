import { useState, useRef, useEffect, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const LANGUAGES = {
  dutch:      { name:"Dutch",      flag:"🇳🇱", native:"Nederlands", accent:"#E8552A", scenarios:["At the Market","Café Visit","Meeting Neighbours","Train Station","Doctor's Visit","Work Meeting","At a Party","Booking a Hotel"] },
  italian:    { name:"Italian",    flag:"🇮🇹", native:"Italiano",   accent:"#009246", scenarios:["Ordering Pasta","At the Gelateria","Asking Directions","Shopping in Milano","Hotel Check-in","Family Dinner","At the Beach","Football Talk"] },
  french:     { name:"French",     flag:"🇫🇷", native:"Français",   accent:"#0055A4", scenarios:["Boulangerie Visit","Museum Trip","Parisian Café","Making Reservations","At the Pharmacy","Weekend Plans","On the Metro","Wine Tasting"] },
  spanish:    { name:"Spanish",    flag:"🇪🇸", native:"Español",    accent:"#AA151B", scenarios:["At the Tapas Bar","Flamenco Night","Beach Resort","Market Visit","Siesta Chat","Fútbol Talk","Airbnb Host","Local Festival"] },
  german:     { name:"German",     flag:"🇩🇪", native:"Deutsch",    accent:"#555555", scenarios:["Biergarten Visit","At the Bakery","Taking the U-Bahn","Office Small Talk","Christmas Market","Museum Visit","Renting a Car","At the Pharmacy"] },
  portuguese: { name:"Portuguese", flag:"🇵🇹", native:"Português",  accent:"#006600", scenarios:["Petiscos Bar","Pastéis de Nata Café","Fado Night","Lisbon Tram","At the Beach","Mercado Visit","Booking a Tour","Football Chat"] },
  japanese:   { name:"Japanese",   flag:"🇯🇵", native:"日本語",      accent:"#BC002D", scenarios:["Convenience Store","Ramen Restaurant","Train Journey","Temple Visit","Karaoke Night","Onsen Etiquette","Harajuku Shopping","Business Meeting"] },
  mandarin:   { name:"Mandarin",   flag:"🇨🇳", native:"普通话",      accent:"#DE2910", scenarios:["Dim Sum Brunch","Night Market","Tea House","Taxi Ride","Shopping & Bargaining","Visiting Friends","Street Food Tour","Business Dinner"] },
};

const KIDS_TOPICS = [
  { id:"animals",   label:"Animals",      emoji:"🐾", color:"#E8B4A0" },
  { id:"food",      label:"Food & Drink", emoji:"🍎", color:"#F4C28A" },
  { id:"school",    label:"School Stuff", emoji:"✏️", color:"#B7C9DC" },
  { id:"body",      label:"Body Parts",   emoji:"🦷", color:"#B9D4B5" },
  { id:"weather",   label:"Weather",      emoji:"⛅", color:"#F4D998" },
  { id:"numbers",   label:"Numbers",      emoji:"🔢", color:"#C9B4D6" },
  { id:"colors",    label:"Colors",       emoji:"🎨", color:"#E8C5BC" },
  { id:"transport", label:"Transport",    emoji:"🚗", color:"#ACBBC9" },
  { id:"sports",    label:"Sports",       emoji:"⚽", color:"#A8C4B5" },
  { id:"stories",   label:"Story Time",   emoji:"📖", color:"#DCC9A8" },
  { id:"opposites", label:"Opposites",    emoji:"↔️", color:"#C7BBC4" },
  { id:"free",      label:"Free Chat",    emoji:"💬", color:"#DDB89E" },
];

const HINTS = {
  dutch:      ["Kunt u dat herhalen?","Ik begrijp het niet","Hoeveel kost het?","Dank u wel","Kunt u langzamer spreken?"],
  italian:    ["Può ripetere?","Non capisco","Quanto costa?","Grazie mille","Parla più lentamente?"],
  french:     ["Pouvez-vous répéter?","Je ne comprends pas","Combien ça coûte?","Merci beaucoup","Plus lentement?"],
  spanish:    ["¿Puede repetir?","No entiendo","¿Cuánto cuesta?","Muchas gracias","¿Más despacio?"],
  german:     ["Können Sie das wiederholen?","Ich verstehe nicht","Was kostet das?","Danke schön","Bitte langsamer?"],
  portuguese: ["Pode repetir?","Não entendo","Quanto custa?","Muito obrigado","Mais devagar?"],
  japanese:   ["もう一度言ってください","わかりません","いくらですか?","ありがとうございます","ゆっくり話してください"],
  mandarin:   ["请再说一遍","我不明白","多少钱?","非常感谢","请说慢一点"],
};

// ─── STORAGE ─────────────────────────────────────────────────────────────────

const ADULT_KEY = "lingua_nb_adult";
const KIDS_KEY  = "lingua_nb_kids";
const WOD_KEY   = "lingua_wod";

async function loadNB(mode) {
  try { const r = await window.storage.get(mode==="kids"?KIDS_KEY:ADULT_KEY); return r ? JSON.parse(r.value) : []; }
  catch { return []; }
}
async function saveNB(mode, entries) {
  try { await window.storage.set(mode==="kids"?KIDS_KEY:ADULT_KEY, JSON.stringify(entries)); } catch {}
}
async function addWord(mode, entry) {
  const nb = await loadNB(mode);
  const updated = [{ ...entry, id: Date.now(), date: new Date().toLocaleDateString() }, ...nb];
  await saveNB(mode, updated); return updated;
}
async function delWord(mode, id) {
  const nb = await loadNB(mode);
  const updated = nb.filter(e => e.id !== id);
  await saveNB(mode, updated); return updated;
}
async function loadWODCache() {
  try { const r = await window.storage.get(WOD_KEY); if(r){ const d=JSON.parse(r.value); if(d.date===new Date().toDateString()) return d; } } catch {}
  return null;
}
async function saveWODCache(data) {
  try { await window.storage.set(WOD_KEY, JSON.stringify({...data, date:new Date().toDateString()})); } catch {}
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function ai(messages, system, max=600) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:max, messages };
  if (system) body.system = system;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
  });
  const d = await r.json();
  return d.content?.find(b=>b.type==="text")?.text || "";
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Nunito:wght@400;600;700;800;900&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
:root{
  --a-bg:#0F1B2D;--a-surf:#162336;--a-surf2:#1D2E44;
  --a-border:#243650;--a-text:#F0EBE0;--a-cream:#F0EBE0;
  --a-muted:#8899AE;--a-mutedD:#6E7E94;
  --a-gold:#C9943A;--a-goldL:#E5B86A;--a-goldT:rgba(201,148,58,.14);
  --a-terra:#C2634B;
  --a-serif:'Cormorant Garamond',Georgia,serif;
  --a-sans:'DM Sans',-apple-system,system-ui,sans-serif;
  --k-bg:#FAF3E4;--k-paper:#FFFFFF;--k-paper2:#FFF7E8;
  --k-ink:#2D2521;--k-inkSoft:#6B5F54;--k-mute:#A89889;
  --k-border:#E8DCC4;--k-borderD:#D6C4A4;
  --k-primary:#3F7A5E;--k-accent:#E8943B;
  --k-display:'Fraunces',Georgia,serif;
  --k-sans:'Nunito',-apple-system,system-ui,sans-serif;
}
html{height:-webkit-fill-available;}
body{font-family:var(--a-sans);background:var(--a-bg);color:var(--a-text);-webkit-text-size-adjust:100%;min-height:-webkit-fill-available;}
button{cursor:pointer;font-family:inherit;border:none;background:none;color:inherit;}
textarea,input,select{font-family:inherit;}

/* DOTS */
.dots{display:flex;gap:5px;align-items:center;padding:4px 0;}
.dots span{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.6;animation:bounce 1.2s infinite;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}
.adult-dots{color:var(--a-muted);}
.kids-dots{color:var(--k-mute);}

/* ANIMS */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

/* LANDING */
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
.p-card-icon.adult{background:var(--a-gold);color:var(--a-bg);font-weight:600;}
.p-card-icon.kids{background:var(--a-terra);color:#fff;font-size:20px;}
.p-card-body{flex:1;}
.p-card h3{font-family:var(--a-serif);font-size:21px;font-weight:600;color:var(--a-cream);line-height:1.1;}
.p-card p{font-size:12px;color:var(--a-muted);margin-top:2px;}
.p-card-arr{color:var(--a-muted);font-size:18px;}
.l-langs{font-size:10px;color:var(--a-mutedD);letter-spacing:.08em;text-transform:uppercase;margin-top:24px;text-align:center;position:relative;}

/* SHELL */
.shell{min-height:100svh;display:flex;flex-direction:column;background:var(--a-bg);}
.topbar{background:var(--a-surf);border-bottom:1px solid var(--a-border);padding:8px 16px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:100;}
.topbar-logo{width:30px;height:30px;background:var(--a-gold);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--a-bg);flex-shrink:0;}
.topbar-title{font-family:var(--a-serif);font-size:18px;font-weight:600;color:var(--a-cream);flex:1;}
.ghost{background:transparent;border:1px solid var(--a-border);border-radius:9px;padding:6px 13px;font-size:12.5px;color:var(--a-muted);transition:all .2s;}
.ghost:hover{border-color:var(--a-muted);color:var(--a-cream);}
.tabs{display:flex;border-bottom:1px solid var(--a-border);background:var(--a-surf);}
.tab{flex:1;padding:11px 8px;font-size:12px;font-weight:500;letter-spacing:.04em;color:var(--a-muted);border-bottom:2px solid transparent;transition:all .2s;cursor:pointer;}
.tab.on{color:var(--a-gold);border-bottom-color:var(--a-gold);}
.scr{flex:1;padding:20px;max-width:840px;margin:0 auto;width:100%;overflow-y:auto;}
.sh{font-family:var(--a-serif);font-size:26px;font-weight:600;color:var(--a-cream);letter-spacing:-.3px;margin-bottom:4px;}
.ss{color:var(--a-muted);font-size:12.5px;margin-bottom:20px;}

/* LANG GRID — 2-col */
.lgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:22px;}
.lcard{background:var(--a-surf);border:1px solid var(--a-border);border-radius:14px;padding:12px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:9px;text-align:left;}
.lcard:hover{border-color:var(--a-muted);}
.lcard.on{background:rgba(201,148,58,.06);}
.lflag{font-size:22px;flex-shrink:0;}
.linfo h4{font-size:12.5px;font-weight:600;color:var(--a-cream);}
.linfo span{font-size:10.5px;color:var(--a-muted);}

/* SCENARIOS — list style */
.scen-head{font-family:var(--a-serif);font-size:20px;font-weight:600;color:var(--a-cream);margin-bottom:3px;}
.scen-sub{color:var(--a-muted);font-size:12px;margin-bottom:12px;}
.sgrid{display:flex;flex-direction:column;gap:7px;margin-bottom:20px;}
.sbtn{background:var(--a-surf);border:1px solid var(--a-border);border-radius:11px;padding:11px 14px;font-size:13px;font-weight:500;color:var(--a-muted);text-align:left;transition:all .2s;display:flex;align-items:center;}
.sbtn:hover{color:var(--a-cream);border-color:var(--a-muted);}
.sbtn.on{color:var(--a-gold);border-color:var(--a-gold);background:rgba(201,148,58,.06);}
.sbtn-check{margin-left:auto;color:var(--a-gold);}
.cta-wrap{padding:12px 0 0;}
.cta{width:100%;background:var(--a-gold);color:var(--a-bg);border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:600;letter-spacing:.2px;transition:all .2s;box-shadow:0 6px 22px rgba(201,148,58,.3);cursor:pointer;}
.cta:hover{background:var(--a-goldL);transform:translateY(-1px);}
.cta:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none;}

/* WORD OF DAY */
.wod-ltabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.wod-ltab{background:var(--a-surf2);border:1px solid var(--a-border);border-radius:20px;padding:4px 10px;font-size:11px;cursor:pointer;color:var(--a-muted);transition:all .15s;}
.wod-ltab.on{background:var(--a-goldT);border-color:rgba(201,148,58,.4);color:var(--a-gold);}
.wod-card{background:linear-gradient(135deg,var(--a-surf),var(--a-surf2));border:1px solid var(--a-border);border-radius:18px;padding:22px 20px;position:relative;overflow:hidden;margin-bottom:20px;}
.wod-card::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:radial-gradient(circle,rgba(201,148,58,.18) 0%,transparent 65%);pointer-events:none;}
.wod-date{font-size:11px;color:var(--a-muted);letter-spacing:.06em;text-transform:uppercase;position:relative;}
.wod-word{font-family:var(--a-serif);font-size:44px;font-weight:600;color:var(--a-cream);line-height:1.05;margin-top:10px;position:relative;}
.wod-ph{font-size:13px;color:var(--a-gold);font-style:italic;margin-top:2px;position:relative;}
.wod-tr{font-size:15px;color:var(--a-muted);margin-top:7px;position:relative;}
.wod-ex{background:rgba(255,255,255,.04);border-left:3px solid var(--a-gold);padding:10px 13px;border-radius:0 10px 10px 0;margin-top:16px;position:relative;}
.wod-ex-native{font-size:12.5px;color:var(--a-cream);line-height:1.55;}
.wod-ex-en{font-size:11.5px;color:var(--a-muted);font-style:italic;margin-top:4px;line-height:1.5;}
.wod-fact{font-size:11.5px;color:var(--a-muted);font-style:italic;line-height:1.55;margin-top:12px;position:relative;}
.wod-save{display:inline-block;background:var(--a-goldT);border:1px solid rgba(201,148,58,.3);border-radius:10px;padding:6px 13px;margin-top:16px;font-size:11.5px;color:var(--a-gold);cursor:pointer;transition:all .15s;position:relative;}
.wod-save:hover{background:rgba(201,148,58,.22);}
.loading-row{display:flex;gap:8px;align-items:center;color:var(--a-muted);font-size:14px;padding:16px 0;}

/* NOTEBOOK */
.nb-filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.nbf{background:var(--a-surf);border:1px solid var(--a-border);border-radius:20px;padding:3px 10px;font-size:11px;cursor:pointer;color:var(--a-muted);transition:all .15s;}
.nbf.on{background:var(--a-goldT);border-color:rgba(201,148,58,.4);color:var(--a-gold);}
.nb-empty{text-align:center;padding:60px 20px;}
.nb-empty .ei{font-size:52px;margin-bottom:12px;}
.nb-empty p{color:var(--a-muted);font-size:15px;}
.wcs{display:flex;flex-direction:column;gap:7px;}
.wc{background:var(--a-surf);border:1px solid var(--a-border);border-radius:13px;padding:12px 14px;display:flex;gap:11px;}
.wc-flag{font-size:18px;margin-top:1px;flex-shrink:0;}
.wc-b{flex:1;min-width:0;}
.wc-w{font-family:var(--a-serif);font-size:19px;font-weight:600;color:var(--a-cream);line-height:1.1;}
.wc-ph{font-size:10.5px;color:var(--a-gold);font-style:italic;margin-top:2px;}
.wc-tr{font-size:12.5px;color:var(--a-muted);margin-top:3px;}
.wc-ctx{font-size:11px;color:var(--a-muted);background:rgba(255,255,255,.03);border-radius:6px;padding:5px 8px;margin-top:5px;line-height:1.5;}
.wc-meta{font-size:9.5px;color:var(--a-mutedD);margin-top:5px;letter-spacing:.2px;}
.wc-del{background:none;border:none;color:var(--a-muted);font-size:18px;padding:4px 6px;border-radius:6px;transition:all .15s;flex-shrink:0;cursor:pointer;}
.wc-del:hover{color:#FF6B6B;background:rgba(255,107,107,.1);}

/* CHAT */
.cshell{display:flex;flex-direction:column;height:calc(100svh - 62px);}
.cinfo{background:var(--a-surf2);border-bottom:1px solid var(--a-border);padding:8px 16px;display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--a-muted);}
.ctag{background:var(--a-goldT);border:1px solid rgba(201,148,58,.3);border-radius:20px;padding:2px 9px;font-size:11px;color:var(--a-gold);}
.cmsgs{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:12px;}
.cmsgs::-webkit-scrollbar{width:3px;}
.cmsgs::-webkit-scrollbar-thumb{background:var(--a-border);border-radius:3px;}
.mrow{display:flex;gap:7px;animation:fadeUp .25s ease;}
.mrow.user{flex-direction:row-reverse;}
.mav{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;background:var(--a-surf2);border:1px solid var(--a-border);}
.mcol{max-width:78%;display:flex;flex-direction:column;gap:5px;}
.mrow.user .mcol{align-items:flex-end;}
.bub{padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;}
.mrow.user      .bub{background:var(--a-gold);color:var(--a-bg);border-bottom-right-radius:4px;font-weight:500;}
.mrow.assistant .bub{background:var(--a-surf2);border:1px solid var(--a-border);color:var(--a-cream);border-bottom-left-radius:4px;}
.macts{display:flex;gap:5px;}
.mact{background:rgba(255,255,255,.04);border:1px solid var(--a-border);border-radius:8px;padding:3px 8px;font-size:10px;color:var(--a-muted);cursor:pointer;transition:all .15s;}
.mact:hover{border-color:var(--a-muted);color:var(--a-cream);}
.mact.on{border-color:var(--a-gold);color:var(--a-gold);background:var(--a-goldT);}
.mpanel{background:var(--a-surf);border:1px solid var(--a-border);border-left:3px solid var(--a-gold);border-radius:10px;padding:9px 12px;font-size:12.5px;line-height:1.5;color:var(--a-cream);animation:fadeUp .2s ease;}
.plabel{font-size:9.5px;font-weight:600;color:var(--a-gold);text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px;}
.pph{font-size:16px;color:var(--a-gold);font-style:italic;margin-bottom:4px;}
.ptip{color:var(--a-muted);font-size:12.5px;line-height:1.55;}
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
.sbtn-send:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none;}

/* MODAL */
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

/* KIDS */
.ks{min-height:100svh;display:flex;flex-direction:column;background:var(--k-bg);font-family:var(--k-sans);}
.kh{background:var(--k-ink);padding:8px 16px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:100;}
.khome-btn{color:#fff;font-size:13px;padding:5px 10px;background:rgba(255,255,255,.1);border-radius:8px;font-family:var(--k-sans);font-weight:700;cursor:pointer;}
.kh-ollie{display:flex;align-items:center;gap:8px;flex:1;margin-left:4px;}
.kh-title{font-family:var(--k-sans);font-weight:800;font-size:15px;color:#fff;}
.ktabs{display:flex;background:var(--k-paper2);border-bottom:2px solid var(--k-border);}
.ktab{flex:1;padding:10px;font-family:var(--k-sans);font-size:13px;font-weight:800;color:var(--k-mute);border-bottom:3px solid transparent;margin-bottom:-2px;transition:all .2s;cursor:pointer;}
.ktab.on{color:var(--k-ink);border-bottom-color:var(--k-accent);}
.kwel{padding:20px 20px 6px;position:relative;}
.kwel h1{font-family:var(--k-display);font-size:26px;font-weight:600;color:var(--k-ink);letter-spacing:-.3px;line-height:1.15;margin-bottom:6px;}
.kwel p{font-family:var(--k-sans);font-size:13px;color:var(--k-inkSoft);font-weight:600;}
.ktgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;padding:14px 14px 20px;max-width:680px;margin:0 auto;width:100%;}
.tcard{border-radius:18px;padding:14px 6px 12px;cursor:pointer;border:2px solid rgba(45,37,33,.08);font-family:var(--k-sans);font-weight:800;font-size:11.5px;color:var(--k-ink);text-align:center;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:5px;box-shadow:0 3px 0 rgba(45,37,33,.12);min-height:88px;}
.tcard:hover{transform:translateY(-3px);box-shadow:0 6px 0 rgba(45,37,33,.12);}
.tcard:active{transform:translateY(1px);box-shadow:0 1px 0 rgba(45,37,33,.12);}
.temoji{font-size:26px;}
.kids-recent{padding:0 20px 28px;}
.kids-recent-label{font-family:var(--k-sans);font-size:11px;font-weight:800;color:var(--k-mute);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
.kids-recent-card{background:var(--k-paper);border:2px solid var(--k-border);border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:border-color .2s;}
.kids-recent-card:hover{border-color:var(--k-borderD);}
.kids-recent-info{flex:1;}
.kids-recent-name{font-family:var(--k-sans);font-weight:800;font-size:13.5px;color:var(--k-ink);}
.kids-recent-sub{font-family:var(--k-sans);font-size:11.5px;color:var(--k-inkSoft);font-weight:600;}
.kids-recent-arr{font-size:18px;color:var(--k-mute);}
.kcshell{display:flex;flex-direction:column;height:calc(100svh - 110px);}
.kmsgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;max-width:680px;margin:0 auto;width:100%;-webkit-overflow-scrolling:touch;}
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
.kiarea{background:var(--k-paper);border-top:2px solid var(--k-border);padding:10px 14px 30px;max-width:680px;margin:0 auto;width:100%;}
.kirow{display:flex;gap:9px;align-items:center;}
.kinput{flex:1;border:2px solid var(--k-border);border-radius:14px;padding:10px 14px;font-size:14px;font-family:var(--k-sans);font-weight:700;background:var(--k-bg);color:var(--k-ink);outline:none;transition:border-color .2s;}
.kinput:focus{border-color:var(--k-ink);}
.kinput::placeholder{color:var(--k-mute);}
.ksendbtn{width:42px;height:42px;border-radius:50%;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 0 rgba(45,37,33,.18);transition:all .15s;color:white;cursor:pointer;border:none;}
.ksendbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 5px 0 rgba(45,37,33,.18);}
.ksendbtn:disabled{opacity:.4;cursor:not-allowed;}
.knb{padding:20px;max-width:680px;margin:0 auto;width:100%;}
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
.kids-modal{background:var(--k-bg);border:2px solid var(--k-border);}
.kids-mh3{font-family:var(--k-sans) !important;color:var(--k-ink) !important;}
.kids-mp{color:var(--k-inkSoft) !important;}
.kids-minput{background:var(--k-paper) !important;border:2px solid var(--k-border) !important;color:var(--k-ink) !important;}
.kids-minput::placeholder{color:var(--k-mute) !important;}
.kids-minput:focus{border-color:var(--k-ink) !important;}
`;

// ─── OLLIE AVATAR (SVG illustration) ─────────────────────────────────────────

function OllieAvatar({ size = 44, animated = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{flexShrink:0}}>
      <defs>
        <radialGradient id="oBody" cx=".5" cy=".4">
          <stop offset="0" stopColor="#C49570"/>
          <stop offset="1" stopColor="#8B6242"/>
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="38" rx="22" ry="22" fill="url(#oBody)"/>
      <ellipse cx="32" cy="42" rx="13" ry="15" fill="#F4E4CC"/>
      <path d="M14 22 L18 12 L22 20 Z" fill="#8B6242"/>
      <path d="M50 22 L46 12 L42 20 Z" fill="#8B6242"/>
      <circle cx="24" cy="30" r="7.5" fill="#fff"/>
      <circle cx="40" cy="30" r="7.5" fill="#fff"/>
      <circle cx="25" cy="31" r="3.5" fill="#2D2521">
        {animated && <animate attributeName="cx" values="24;26;24" dur="3s" repeatCount="indefinite"/>}
      </circle>
      <circle cx="39" cy="31" r="3.5" fill="#2D2521">
        {animated && <animate attributeName="cx" values="38;40;38" dur="3s" repeatCount="indefinite"/>}
      </circle>
      <circle cx="26" cy="29.5" r="1.2" fill="#fff"/>
      <circle cx="40" cy="29.5" r="1.2" fill="#fff"/>
      <path d="M32 35 L28 40 L36 40 Z" fill="#E8943B"/>
    </svg>
  );
}

// ─── DOTS ─────────────────────────────────────────────────────────────────────

function Dots({ kids }) {
  return (
    <div className="dots" style={{color: kids ? "var(--k-mute)" : "var(--a-muted)"}}>
      <span/><span/><span/>
    </div>
  );
}

// ─── SAVE MODAL ───────────────────────────────────────────────────────────────

function SaveModal({ sourceText, language, langFlag, mode, onSave, onClose }) {
  const [word, setWord] = useState("");
  const [ctx, setCtx] = useState(sourceText?.slice(0,100)||"");
  const isKids = mode === "kids";

  return (
    <div className="mbdrop" onClick={onClose}>
      <div className={`modal${isKids?" kids-modal":""}`} onClick={e=>e.stopPropagation()}>
        <h3 className={isKids?"kids-mh3":""}>
          {isKids ? "📌 Save a Word!" : "Save to Notebook"}
        </h3>
        <p className={isKids?"kids-mp":""}>{isKids?"Type the word you want to remember":"Pick a word or phrase to save"}</p>
        <input className={`minput${isKids?" kids-minput":""}`}
          placeholder={isKids?"Word or phrase…":"Word / phrase in target language…"}
          value={word} onChange={e=>setWord(e.target.value)} autoFocus />
        <input className={`minput${isKids?" kids-minput":""}`}
          placeholder={isKids?"What does it mean? (optional)":"Context / example sentence…"}
          value={ctx} onChange={e=>setCtx(e.target.value)} />
        <div className="mrow2">
          <button className="mcancel" onClick={onClose}>Cancel</button>
          <button className="msave"
            style={isKids?{background:"#FECA57",color:"#2D2521"}:{}}
            onClick={()=>{ if(!word.trim()) return; onSave({word:word.trim(),context:ctx.trim(),language,langFlag}); onClose(); }}>
            {isKids?"Save it! ⭐":"Save →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WORD OF DAY ──────────────────────────────────────────────────────────────

function WordOfDay() {
  const langs = Object.keys(LANGUAGES);
  const [active, setActive] = useState("dutch");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [saved, setSaved] = useState({});

  const fetchWOD = useCallback(async (lang) => {
    if (data[lang] || loading[lang]) return;
    setLoading(p=>({...p,[lang]:true}));
    const cached = await loadWODCache();
    if (cached?.words?.[lang]) {
      setData(p=>({...p,[lang]:cached.words[lang]}));
      setLoading(p=>({...p,[lang]:false}));
      return;
    }
    try {
      const L = LANGUAGES[lang];
      const text = await ai([{role:"user",content:`Give me an interesting, vivid ${L.name} word of the day for a language learner. Respond ONLY as valid JSON with these exact fields: {"word":"...","phonetic":"...","translation":"...","example_native":"...","example_english":"...","fun_fact":"..."}`}], null, 400);
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setData(p=>({...p,[lang]:parsed}));
      const cur = await loadWODCache();
      await saveWODCache({words:{...(cur?.words||{}),[lang]:parsed}});
    } catch {
      setData(p=>({...p,[lang]:{word:"–",phonetic:"",translation:"Could not load today's word",example_native:"",example_english:"",fun_fact:""}}));
    }
    setLoading(p=>({...p,[lang]:false}));
  }, [data, loading]);

  useEffect(()=>{ fetchWOD(active); },[active]);

  const d = data[active];
  const L = LANGUAGES[active];

  const saveToNB = async () => {
    if (!d || saved[active]) return;
    await addWord("adult", { word:d.word, phonetic:d.phonetic, translation:d.translation, context:d.example_native, language:active, langFlag:L.flag });
    setSaved(p=>({...p,[active]:true}));
  };

  return (
    <div className="scr">
      <h2 className="sh">Word of the Day</h2>
      <p className="ss">A fresh word each day — tap any language to load it</p>
      <div className="wod-ltabs">
        {langs.map(k=>(
          <button key={k} className={`wod-ltab${active===k?" on":""}`} onClick={()=>setActive(k)}>
            {LANGUAGES[k].flag} {LANGUAGES[k].name}
          </button>
        ))}
      </div>
      <div className="wod-card">
        {loading[active] && <div className="loading-row"><Dots/> Fetching today's {L.name} word…</div>}
        {!loading[active] && d && (
          <>
            <div className="wod-date">{L.flag} {L.name} · {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long"})}</div>
            <div className="wod-word">{d.word}</div>
            {d.phonetic && <div className="wod-ph">/{d.phonetic}/</div>}
            <div className="wod-tr">{d.translation}</div>
            {d.example_native && (
              <div className="wod-ex">
                <div className="wod-ex-native">{d.example_native}</div>
                <div className="wod-ex-en">{d.example_english}</div>
              </div>
            )}
            {d.fun_fact && <div className="wod-fact">💡 {d.fun_fact}</div>}
            <button className="wod-save" onClick={saveToNB}>
              {saved[active] ? "✓ Saved to notebook" : "📌 Save to notebook"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ADULT NOTEBOOK ───────────────────────────────────────────────────────────

function AdultNotebook({ refresh }) {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(()=>{ loadNB("adult").then(e=>{setEntries(e);setLoaded(true);}); },[refresh]);
  const del = async (id) => setEntries(await delWord("adult",id));

  const langs = ["all", ...Object.keys(LANGUAGES).filter(k=>entries.some(e=>e.language===k))];
  const filtered = filter==="all" ? entries : entries.filter(e=>e.language===filter);

  return (
    <div className="scr">
      <h2 className="sh">Vocabulary Notebook</h2>
      <p className="ss">{entries.length} saved word{entries.length!==1?"s":""}</p>
      {langs.length>1 && (
        <div className="nb-filters">
          {langs.map(k=>(
            <button key={k} className={`nbf${filter===k?" on":""}`} onClick={()=>setFilter(k)}>
              {k==="all"?"All":LANGUAGES[k]?.flag+" "+LANGUAGES[k]?.name}
            </button>
          ))}
        </div>
      )}
      {loaded && filtered.length===0 && (
        <div className="nb-empty">
          <div className="ei">📓</div>
          <p>{entries.length===0 ? "Start a conversation and tap 📌 to save words!" : "No words for this language yet."}</p>
        </div>
      )}
      <div className="wcs">
        {filtered.map(e=>(
          <div key={e.id} className="wc">
            <div className="wc-flag">{e.langFlag||"🌍"}</div>
            <div className="wc-b">
              <div className="wc-w">{e.word}</div>
              {e.phonetic && <div className="wc-ph">/{e.phonetic}/</div>}
              {e.translation && <div className="wc-tr">{e.translation}</div>}
              {e.context && <div className="wc-ctx">{e.context}</div>}
              <div className="wc-meta">{e.language ? LANGUAGES[e.language]?.name : ""} · {e.date}</div>
            </div>
            <button className="wc-del" onClick={()=>del(e.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADULT CHAT ───────────────────────────────────────────────────────────────

function AdultChat({ lang, scenario, onNotebookSave }) {
  const L = LANGUAGES[lang];
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [busy, setBusy] = useState(false);
  const [panels, setPanels] = useState({});
  const [modal, setModal] = useState(null);
  const endRef = useRef(null);

  const sys = `You are a native ${L.name} speaker in scenario: "${scenario}".
- Reply mainly in ${L.name} (natural everyday speech, not textbook)
- Add subtle English hints in parentheses only when the learner clearly struggles
- Keep replies to 2-3 sentences max — real dialogue
- Correct errors gently inline; no grammar lectures
- Stay in character for the scenario
Start the conversation naturally.`;

  useEffect(()=>{ start(); },[]);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,busy,panels]);

  const toApi = ms => ms.map(m=>({role:m.role,content:m.text}));

  const start = async () => {
    setBusy(true);
    try { const t=await ai([{role:"user",content:"Start the conversation."}],sys,400); setMsgs([{role:"assistant",text:t,id:1}]); }
    catch { setMsgs([{role:"assistant",text:"Connection error. Try again.",id:1}]); }
    setBusy(false);
  };

  const send = async () => {
    if (!inp.trim()||busy) return;
    const um={role:"user",text:inp.trim(),id:Date.now()};
    const next=[...msgs,um]; setMsgs(next); setInp(""); setBusy(true);
    try { const t=await ai(toApi(next),sys,400); setMsgs(p=>[...p,{role:"assistant",text:t,id:Date.now()+1}]); }
    catch { setMsgs(p=>[...p,{role:"assistant",text:"Error. Try again.",id:Date.now()}]); }
    setBusy(false);
  };

  const togglePanel = async (id, text, type) => {
    if (panels[id]?.type===type) { setPanels(p=>{const n={...p};delete n[id];return n;}); return; }
    setPanels(p=>({...p,[id]:{type,loading:true,content:""}}));
    try {
      let content;
      if (type==="translation") {
        content = await ai([{role:"user",content:`Translate this ${L.name} text to English. Translation only, nothing else:\n"${text}"`}],null,300);
      } else {
        const raw = await ai([{role:"user",content:`For this ${L.name} text, give a pronunciation guide for an English-speaking beginner. Respond ONLY as valid JSON: {"phonetic":"simplified phonetic spelling","tips":"1-2 key pronunciation tips","sounds":"one tricky sound to watch"}\nText: "${text}"`}],null,300);
        try { content=JSON.parse(raw.replace(/```json|```/g,"").trim()); } catch { content={phonetic:"",tips:raw,sounds:""}; }
      }
      setPanels(p=>({...p,[id]:{type,loading:false,content}}));
    } catch { setPanels(p=>({...p,[id]:{type,loading:false,content:"Could not load."}})); }
  };

  const doSave = async (entry) => { await addWord("adult",{...entry}); onNotebookSave?.(); };

  return (
    <div className="cshell">
      <div className="cinfo">
        <span style={{fontSize:16}}>{L.flag}</span>
        <span style={{fontWeight:600,color:"var(--a-cream)"}}>{L.name}</span>
        <span className="ctag">{scenario}</span>
      </div>
      <div className="cmsgs">
        {msgs.map(m=>(
          <div key={m.id} className={`mrow ${m.role}`}>
            <div className="mav">{m.role==="user"?"👤":L.flag}</div>
            <div className="mcol">
              <div className="bub">{m.text}</div>
              {m.role==="assistant" && (
                <div className="macts">
                  <button className={`mact${panels[m.id]?.type==="translation"?" on":""}`}
                    onClick={()=>togglePanel(m.id,m.text,"translation")}>🇬🇧 Translate</button>
                  <button className={`mact${panels[m.id]?.type==="pronunciation"?" on":""}`}
                    onClick={()=>togglePanel(m.id,m.text,"pronunciation")}>🔊 Pronounce</button>
                  <button className="mact" onClick={()=>setModal({text:m.text})}>📌 Save</button>
                </div>
              )}
              {panels[m.id] && (
                <div className="mpanel">
                  {panels[m.id].loading && <Dots/>}
                  {!panels[m.id].loading && panels[m.id].type==="translation" && (
                    <><div className="plabel">English Translation</div>{panels[m.id].content}</>
                  )}
                  {!panels[m.id].loading && panels[m.id].type==="pronunciation" && (()=>{
                    const c=panels[m.id].content;
                    return (<>
                      <div className="plabel">Pronunciation Guide</div>
                      {c.phonetic && <div className="pph">/{c.phonetic}/</div>}
                      {c.tips && <div className="ptip">{c.tips}</div>}
                      {c.sounds && <div className="ptip" style={{marginTop:6}}>🎯 Watch: {c.sounds}</div>}
                    </>);
                  })()}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="mrow assistant">
            <div className="mav">{L.flag}</div>
            <div className="mcol"><div className="bub"><Dots/></div></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div className="hints">
        {(HINTS[lang]||[]).map(h=><button key={h} className="hchip" onClick={()=>setInp(h)}>{h}</button>)}
      </div>
      <div className="iarea">
        <div className="irow">
          <textarea className="cinput" value={inp} rows={1}
            onChange={e=>setInp(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder={`Type in ${L.name}…`} />
          <button className="sbtn-send" onClick={send} disabled={busy||!inp.trim()}>↑</button>
        </div>
      </div>
      {modal && <SaveModal sourceText={modal.text} language={lang} langFlag={L.flag} mode="adult" onSave={doSave} onClose={()=>setModal(null)}/>}
    </div>
  );
}

// ─── KIDS NOTEBOOK ────────────────────────────────────────────────────────────

function KidsNotebook({ refresh }) {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{ loadNB("kids").then(e=>{setEntries(e);setLoaded(true);}); },[refresh]);
  const del = async (id) => setEntries(await delWord("kids",id));
  return (
    <div className="knb">
      <div className="knb-title">⭐ My Word Book</div>
      <div className="knb-sub">Words you've saved from your chats with Ollie!</div>
      {loaded && entries.length===0 && (
        <div className="knempty">
          <div className="ei">📖</div>
          <p>Chat with Ollie and tap "Save a word!" to start your collection!</p>
        </div>
      )}
      {entries.map(e=>(
        <div key={e.id} className="kwcard">
          <div className="kwe">{e.emoji||"⭐"}</div>
          <div className="kwb">
            <div className="kww">{e.word}</div>
            {e.context && <div className="kwd">{e.context}</div>}
            <div className="kwdate">Saved on {e.date}</div>
          </div>
          <button className="kwdel" onClick={()=>del(e.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

// ─── KIDS CHAT ────────────────────────────────────────────────────────────────

function KidsChat({ topic, onKidsSave }) {
  const T = KIDS_TOPICS.find(t=>t.id===topic);
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(null);
  const endRef = useRef(null);

  const sys = `You are Ollie the Owl 🦉, a warm and enthusiastic English tutor for children aged 5–12.
Topic: ${T.label} (${T.emoji})
- Be super encouraging, use emojis! 🎉
- Introduce 2-3 words at a time with fun, simple examples
- For Story Time: build a story together with the child
- Celebrate with "Brilliant! 🌟", "Amazing! 💪", "Great job! 🎊"
- Keep replies to 2-4 sentences; always end with ONE simple question
- For Story Time: collaborative storytelling
- Correct mistakes very gently: "I love that! We say 'X' — try it?"
Start with a fun, warm intro for ${T.label}!`;

  useEffect(()=>{ start(); },[]);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,busy]);

  const start = async () => {
    setBusy(true);
    try { const t=await ai([{role:"user",content:"Start!"}],sys,300); setMsgs([{role:"assistant",text:t,id:1}]); }
    catch { setMsgs([{role:"assistant",text:"Hoot hoot! 🦉 Trouble connecting. Try again!",id:1}]); }
    setBusy(false);
  };

  const send = async () => {
    if (!inp.trim()||busy) return;
    const um={role:"user",text:inp.trim(),id:Date.now()};
    const next=[...msgs,um]; setMsgs(next); setInp(""); setBusy(true);
    try { const t=await ai(next.map(m=>({role:m.role,content:m.text})),sys,300); setMsgs(p=>[...p,{role:"assistant",text:t,id:Date.now()+1}]); }
    catch { setMsgs(p=>[...p,{role:"assistant",text:"Oops! 🦉 Let's try again!",id:Date.now()}]); }
    setBusy(false);
  };

  const doSave = async (entry) => { await addWord("kids",{...entry,emoji:T.emoji}); onKidsSave?.(); };

  return (
    <div className="kcshell">
      <div className="kmsgs">
        {msgs.map(m=>(
          <div key={m.id} className={`kmsg ${m.role}`}>
            {m.role==="assistant"
              ? <OllieAvatar size={38}/>
              : <div className="kuser-av">🧒</div>}
            <div className="kbub-wrap">
              <div className="kbub">{m.text}</div>
              {m.role==="assistant" && (
                <button className="ksavebtn" onClick={()=>setModal({text:m.text})}>⭐ Save a word!</button>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="kmsg assistant">
            <OllieAvatar size={38}/>
            <div className="kbub-wrap">
              <div className="kbub"><Dots kids/></div>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div className="kiarea">
        <div className="kirow">
          <input className="kinput" value={inp}
            onChange={e=>setInp(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter") send();}}
            placeholder="Type here… ✏️" />
          <button className="ksendbtn" style={{background:T.color}} onClick={send} disabled={busy||!inp.trim()}>↑</button>
        </div>
      </div>
      {modal && <SaveModal sourceText={modal.text} mode="kids" onSave={doSave} onClose={()=>setModal(null)}/>}
    </div>
  );
}

// ─── ADULT MODE ───────────────────────────────────────────────────────────────

function AdultMode({ onBack }) {
  const [tab, setTab] = useState("converse");
  const [lang, setLang] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [inChat, setInChat] = useState(false);
  const [nbV, setNbV] = useState(0);

  if (inChat && lang && scenario) return (
    <div className="shell">
      <div className="topbar">
        <div className="topbar-logo">✦</div>
        <span className="topbar-title">Lingua</span>
        <button className="ghost" onClick={()=>setInChat(false)}>← Scenarios</button>
        <button className="ghost" onClick={onBack}>Home</button>
      </div>
      <AdultChat lang={lang} scenario={scenario} onNotebookSave={()=>setNbV(v=>v+1)}/>
    </div>
  );

  return (
    <div className="shell">
      <div className="topbar">
        <div className="topbar-logo">✦</div>
        <span className="topbar-title">Lingua</span>
        <button className="ghost" onClick={onBack}>← Home</button>
      </div>
      <div className="tabs">
        {[["converse","Converse"],["wod","Word of Day"],["notebook","Notebook"]].map(([k,l])=>(
          <button key={k} className={`tab${tab===k?" on":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {tab==="converse" && (
        <div className="scr">
          <h2 className="sh">Choose a language</h2>
          <p className="ss">Eight languages · eight scenarios each</p>
          <div className="lgrid">
            {Object.entries(LANGUAGES).map(([k,v])=>(
              <div key={k} className={`lcard${lang===k?" on":""}`}
                style={lang===k?{borderColor:v.accent,boxShadow:`0 4px 18px ${v.accent}30`}:{}}
                onClick={()=>{setLang(k);setScenario(null);}}>
                <span className="lflag">{v.flag}</span>
                <div className="linfo"><h4>{v.name}</h4><span>{v.native}</span></div>
              </div>
            ))}
          </div>
          {lang && (
            <>
              <div className="scen-head">Pick a scenario</div>
              <div className="scen-sub">Each one gives you a native partner with their own context</div>
              <div className="sgrid">
                {LANGUAGES[lang].scenarios.map(s=>(
                  <button key={s} className={`sbtn${scenario===s?" on":""}`} onClick={()=>setScenario(s)}>
                    <span>{s}</span>
                    {scenario===s && <span className="sbtn-check">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="cta-wrap">
            <button className="cta" disabled={!lang||!scenario} onClick={()=>setInChat(true)}>
              Start conversation →
            </button>
          </div>
        </div>
      )}
      {tab==="wod"      && <WordOfDay/>}
      {tab==="notebook" && <AdultNotebook refresh={nbV}/>}
    </div>
  );
}

// ─── KIDS MODE ────────────────────────────────────────────────────────────────

function KidsMode({ onBack }) {
  const [tab, setTab] = useState("learn");
  const [topic, setTopic] = useState(null);
  const [nbV, setNbV] = useState(0);
  const [nbCount, setNbCount] = useState(0);
  const lastTopic = KIDS_TOPICS[0]; // could be persisted; using first as default recent

  useEffect(()=>{ loadNB("kids").then(e=>setNbCount(e.length)); },[nbV]);

  return (
    <div className="ks">
      <div className="kh">
        <button className="khome-btn" onClick={onBack}>← Home</button>
        <div className="kh-ollie">
          <OllieAvatar size={28}/>
          <span className="kh-title">Ollie's English World</span>
        </div>
        {topic && (
          <button className="khome-btn" onClick={()=>setTopic(null)}>← Topics</button>
        )}
      </div>
      <div className="ktabs">
        <button className={`ktab${tab==="learn"?" on":""}`} onClick={()=>{setTab("learn");setTopic(null);}}>📚 Learn</button>
        <button className={`ktab${tab==="words"?" on":""}`} onClick={()=>{setTab("words");setTopic(null);}}>⭐ My Words</button>
      </div>

      {tab==="learn" && !topic && (
        <div style={{overflowY:"auto",flex:1}}>
          <div className="kwel">
            <h1>What shall we<br/>learn today?</h1>
            <p>Pick a topic and chat with Ollie 🦉</p>
          </div>
          <div className="ktgrid">
            {KIDS_TOPICS.map(t=>(
              <button key={t.id} className="tcard" style={{background:t.color}} onClick={()=>setTopic(t.id)}>
                <span className="temoji">{t.emoji}</span>
                <span style={{lineHeight:1.15}}>{t.label}</span>
              </button>
            ))}
          </div>
          {nbCount > 0 && (
            <div className="kids-recent">
              <div className="kids-recent-label">Recent</div>
              <div className="kids-recent-card" onClick={()=>setTab("words")}>
                <span style={{fontSize:24}}>{lastTopic.emoji}</span>
                <div className="kids-recent-info">
                  <div className="kids-recent-name">{lastTopic.label}</div>
                  <div className="kids-recent-sub">{nbCount} word{nbCount!==1?"s":""} saved</div>
                </div>
                <div className="kids-recent-arr">›</div>
              </div>
            </div>
          )}
        </div>
      )}
      {tab==="learn" && topic && <KidsChat topic={topic} onKidsSave={()=>setNbV(v=>v+1)}/>}
      {tab==="words" && <KidsNotebook refresh={nbV}/>}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState(null);
  return (
    <>
      <style>{CSS}</style>
      {mode==="adult" && <AdultMode onBack={()=>setMode(null)}/>}
      {mode==="kids"  && <KidsMode  onBack={()=>setMode(null)}/>}
      {!mode && (
        <div className="landing">
          <div className="l-orb1"/><div className="l-orb2"/>
          <div className="logo-row">
            <div className="logo-icon">✦</div>
            <div className="logo-name">Lingua</div>
          </div>
          <div className="l-hero">
            <h1 className="l-h1">Learn to <em>speak</em>,<br/>not just study.</h1>
            <p className="l-sub">Conversation-first learning. Real dialogues, daily vocabulary, and a personal notebook — no streaks, no points.</p>
            <div className="p-cards">
              <button className="p-card" onClick={()=>setMode("adult")}>
                <div className="p-card-icon adult">✈</div>
                <div className="p-card-body">
                  <h3>Adult mode</h3>
                  <p>8 languages · scenarios · notebook</p>
                </div>
                <div className="p-card-arr">›</div>
              </button>
              <button className="p-card" onClick={()=>setMode("kids")}>
                <div className="p-card-icon kids">🦉</div>
                <div className="p-card-body">
                  <h3>Kids mode</h3>
                  <p>English with Ollie · 12 topics</p>
                </div>
                <div className="p-card-arr">›</div>
              </button>
            </div>
          </div>
          <div className="l-langs">🇳🇱 NL · 🇮🇹 IT · 🇫🇷 FR · 🇪🇸 ES · 🇩🇪 DE · 🇵🇹 PT · 🇯🇵 JP · 🇨🇳 ZH</div>
        </div>
      )}
    </>
  );
}
