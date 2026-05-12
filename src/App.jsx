import { useState, useRef, useEffect, useCallback } from "react"

// ─── LANGUAGES ────────────────────────────────────────────────────────────────

const LANGUAGES = {
  dutch:      { name:"Dutch",      flag:"🇳🇱", native:"Nederlands", accent:"#E8552A", scenarios:["At the Market","Café Visit","Meeting Neighbours","Train Station","Doctor's Visit","Work Meeting","At a Party","Booking a Hotel"] },
  italian:    { name:"Italian",    flag:"🇮🇹", native:"Italiano",   accent:"#009246", scenarios:["Ordering Pasta","At the Gelateria","Asking Directions","Shopping in Milano","Hotel Check-in","Family Dinner","At the Beach","Football Talk"] },
  french:     { name:"French",     flag:"🇫🇷", native:"Français",   accent:"#0055A4", scenarios:["Boulangerie Visit","Museum Trip","Parisian Café","Making Reservations","At the Pharmacy","Weekend Plans","On the Metro","Wine Tasting"] },
  spanish:    { name:"Spanish",    flag:"🇪🇸", native:"Español",    accent:"#AA151B", scenarios:["At the Tapas Bar","Flamenco Night","Beach Resort","Market Visit","Siesta Chat","Fútbol Talk","Airbnb Host","Local Festival"] },
  german:     { name:"German",     flag:"🇩🇪", native:"Deutsch",    accent:"#555555", scenarios:["Biergarten Visit","At the Bakery","Taking the U-Bahn","Office Small Talk","Christmas Market","Museum Visit","Renting a Car","At the Pharmacy"] },
  portuguese: { name:"Portuguese", flag:"🇵🇹", native:"Português",  accent:"#006600", scenarios:["Petiscos Bar","Pastéis de Nata Café","Fado Night","Lisbon Tram","At the Beach","Mercado Visit","Booking a Tour","Football Chat"] },
  japanese:   { name:"Japanese",   flag:"🇯🇵", native:"日本語",      accent:"#BC002D", scenarios:["Convenience Store","Ramen Restaurant","Train Journey","Temple Visit","Karaoke Night","Onsen Etiquette","Harajuku Shopping","Business Meeting"] },
  mandarin:   { name:"Mandarin",   flag:"🇨🇳", native:"普通话",      accent:"#DE2910", scenarios:["Dim Sum Brunch","Night Market","Tea House","Taxi Ride","Shopping & Bargaining","Visiting Friends","Street Food Tour","Business Dinner"] },
}

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
]

const HINTS = {
  dutch:      ["Kunt u dat herhalen?","Ik begrijp het niet","Hoeveel kost het?","Dank u wel","Kunt u langzamer spreken?"],
  italian:    ["Può ripetere?","Non capisco","Quanto costa?","Grazie mille","Parla più lentamente?"],
  french:     ["Pouvez-vous répéter?","Je ne comprends pas","Combien ça coûte?","Merci beaucoup","Plus lentement?"],
  spanish:    ["¿Puede repetir?","No entiendo","¿Cuánto cuesta?","Muchas gracias","¿Más despacio?"],
  german:     ["Können Sie das wiederholen?","Ich verstehe nicht","Was kostet das?","Danke schön","Bitte langsamer?"],
  portuguese: ["Pode repetir?","Não entendo","Quanto custa?","Muito obrigado","Mais devagar?"],
  japanese:   ["もう一度言ってください","わかりません","いくらですか?","ありがとうございます","ゆっくり話してください"],
  mandarin:   ["请再说一遍","我不明白","多少钱?","非常感谢","请说慢一点"],
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────

const ADULT_KEY = "lingua_nb_adult"
const KIDS_KEY  = "lingua_nb_kids"
const WOD_KEY   = "lingua_wod"

async function loadNB(mode) {
  try {
    const raw = localStorage.getItem(mode === "kids" ? KIDS_KEY : ADULT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
async function saveNB(mode, entries) {
  try { localStorage.setItem(mode === "kids" ? KIDS_KEY : ADULT_KEY, JSON.stringify(entries)) } catch {}
}
async function addWord(mode, entry) {
  const nb = await loadNB(mode)
  const updated = [{ ...entry, id: Date.now(), date: new Date().toLocaleDateString() }, ...nb]
  await saveNB(mode, updated)
  return updated
}
async function delWord(mode, id) {
  const nb = await loadNB(mode)
  const updated = nb.filter(e => e.id !== id)
  await saveNB(mode, updated)
  return updated
}
async function loadWODCache() {
  try {
    const raw = localStorage.getItem(WOD_KEY)
    if (raw) {
      const d = JSON.parse(raw)
      if (d.date === new Date().toDateString()) return d
    }
  } catch {}
  return null
}
async function saveWODCache(data) {
  try { localStorage.setItem(WOD_KEY, JSON.stringify({ ...data, date: new Date().toDateString() })) } catch {}
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function ai(messages, system, max = 600) {
  const body = { model: "claude-sonnet-4-20250514", max_tokens: max, messages }
  if (system) body.system = system
  const r = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const d = await r.json()
  if (d.error) throw new Error(d.error.message)
  return d.content?.find(b => b.type === "text")?.text || ""
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Nunito:wght@400;600;700;800;900&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#0F1B2D;--surf:#162336;--surf2:#1D2E44;--border:#243650;
  --text:#F0EBE0;--muted:#8899AE;--gold:#C9943A;--goldl:#E5B86A;
  --cream:#F0EBE0;--terra:#C2634B;
  --k-bg:#FAF3E4;--k-paper:#FFFFFF;--k-paper2:#FFF7E8;
  --k-ink:#2D2521;--k-inkSoft:#6B5F54;--k-mute:#A89889;
  --k-border:#E8DCC4;--k-accent:#E8943B;
}
html,body{height:100%;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);}
button{cursor:pointer;font-family:'DM Sans',sans-serif;}
textarea,input{font-family:'DM Sans',sans-serif;}

/* LANDING */
.landing{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px;background:var(--bg);position:relative;overflow:hidden;}
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
.p-card:hover{border-color:var(--gold);transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.4),0 0 0 1px rgba(201,148,58,.25);}
.p-card .ce{font-size:48px;margin-bottom:14px;display:block;}
.p-card h3{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--cream);margin-bottom:8px;}
.p-card p{font-size:13px;color:var(--muted);line-height:1.55;margin:0;}
.l-langs{margin-top:44px;font-size:12px;color:var(--muted);animation:fadeUp .55s .5s ease both;opacity:0;animation-fill-mode:forwards;}

/* SHELL */
.shell{min-height:100vh;display:flex;flex-direction:column;background:var(--bg);}
.topbar{background:var(--surf);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100;}
.topbar-logo{width:36px;height:36px;background:var(--gold);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;box-shadow:0 0 16px rgba(201,148,58,.3);}
.topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--cream);flex:1;}
.ghost{background:transparent;border:1px solid var(--border);border-radius:10px;padding:6px 14px;font-size:13px;color:var(--muted);transition:all .2s;}
.ghost:hover{border-color:var(--muted);color:var(--cream);}
.tabs{display:flex;border-bottom:1px solid var(--border);background:var(--surf);}
.tab{flex:1;padding:12px 8px;background:none;border:none;font-size:13px;font-weight:500;color:var(--muted);border-bottom:2px solid transparent;transition:all .2s;}
.tab.on{color:var(--gold);border-bottom-color:var(--gold);}
.scr{flex:1;padding:24px 20px;max-width:840px;margin:0 auto;width:100%;}

/* TYPOGRAPHY */
.sh{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--cream);margin-bottom:6px;}
.ss{color:var(--muted);font-size:14px;margin-bottom:24px;}

/* LANG GRID */
.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(176px,1fr));gap:12px;margin-bottom:28px;}
.lcard{background:var(--surf);border:1px solid var(--border);border-radius:16px;padding:18px 16px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:14px;}
.lcard:hover{border-color:var(--muted);transform:translateY(-2px);}
.lcard.on{border-width:1.5px;}
.lflag{font-size:32px;flex-shrink:0;}
.linfo h4{font-size:15px;font-weight:600;color:var(--cream);margin-bottom:2px;}
.linfo span{font-size:12px;color:var(--muted);}
.sgrid{display:flex;flex-direction:column;gap:7px;margin-bottom:24px;}
.sbtn{background:var(--surf);border:1px solid var(--border);border-radius:11px;padding:11px 14px;font-size:13px;font-weight:500;color:var(--muted);text-align:left;transition:all .2s;display:flex;align-items:center;}
.sbtn:hover{color:var(--cream);border-color:var(--muted);}
.sbtn.on{color:var(--gold);border-color:var(--gold);background:rgba(201,148,58,.06);}
.sbtn.on::after{content:'✓';margin-left:auto;color:var(--gold);}
.cta{background:var(--gold);color:#0F1B2D;border:none;border-radius:12px;padding:14px 28px;font-size:15px;font-weight:600;transition:all .2s;box-shadow:0 4px 20px rgba(201,148,58,.3);}
.cta:hover{background:var(--goldl);transform:translateY(-1px);box-shadow:0 6px 28px rgba(201,148,58,.4);}
.cta:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none;}

/* WORD OF DAY */
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
.loading-row{display:flex;gap:8px;align-items:center;color:var(--muted);font-size:14px;padding:16px 0;}

/* NOTEBOOK */
.nb-empty{text-align:center;padding:60px 20px;}
.nb-empty .ei{font-size:52px;margin-bottom:12px;}
.nb-empty p{color:var(--muted);font-size:15px;}
.nb-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.nbf{background:var(--surf);border:1px solid var(--border);border-radius:20px;padding:5px 13px;font-size:12px;cursor:pointer;color:var(--muted);transition:all .15s;}
.nbf.on{background:rgba(201,148,58,.12);border-color:rgba(201,148,58,.4);color:var(--gold);}
.wcs{display:grid;gap:10px;}
.wc{background:var(--surf);border:1px solid var(--border);border-radius:14px;padding:16px 18px;display:flex;align-items:flex-start;gap:14px;transition:border-color .2s;}
.wc:hover{border-color:var(--surf2);}
.wc-flag{font-size:22px;flex-shrink:0;margin-top:2px;}
.wc-b{flex:1;min-width:0;}
.wc-w{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--cream);margin-bottom:2px;}
.wc-ph{font-size:12px;color:var(--gold);font-style:italic;margin-bottom:4px;}
.wc-tr{font-size:14px;color:var(--muted);margin-bottom:6px;}
.wc-ctx{font-size:12px;color:var(--muted);background:rgba(255,255,255,.04);border-radius:8px;padding:6px 10px;line-height:1.5;}
.wc-meta{font-size:11px;color:var(--muted);margin-top:6px;opacity:.6;}
.wc-del{background:none;border:none;color:var(--muted);font-size:18px;padding:4px 6px;border-radius:6px;transition:all .15s;flex-shrink:0;}
.wc-del:hover{color:#E57373;background:rgba(229,115,115,.1);}

/* CHAT */
.cshell{display:flex;flex-direction:column;height:calc(100vh - 62px);}
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
.macts{display:flex;gap:6px;flex-wrap:wrap;}
.mact{background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;padding:4px 10px;font-size:11px;color:var(--muted);transition:all .15s;}
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

/* KIDS */
.ks{min-height:100vh;display:flex;flex-direction:column;background:var(--k-bg);font-family:'Nunito',sans-serif;}
.kh{background:var(--k-ink);padding:10px 16px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:100;}
.kh-brand{display:flex;align-items:center;gap:8px;margin-left:8px;flex:1;}
.kh-brand span{font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;color:white;}
.ktabs{display:flex;background:var(--k-paper2);border-bottom:2px solid var(--k-border);}
.ktab{flex:1;padding:11px;background:none;border:none;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;color:var(--k-mute);border-bottom:3px solid transparent;margin-bottom:-2px;transition:all .2s;}
.ktab.on{color:var(--k-ink);border-bottom-color:var(--k-accent);}
.kwel{padding:20px 20px 6px;max-width:680px;margin:0 auto;width:100%;}
.kwel h1{font-family:'Fraunces',serif;font-weight:600;font-size:26px;color:var(--k-ink);margin-bottom:6px;letter-spacing:-.3px;line-height:1.15;}
.kwel p{font-size:13px;color:var(--k-inkSoft);font-weight:600;}
.ktgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:10px;padding:14px 16px 24px;max-width:680px;margin:0 auto;width:100%;}
.tcard{border-radius:18px;padding:14px 6px 12px;cursor:pointer;border:2px solid rgba(45,37,33,.08);font-family:'Nunito',sans-serif;font-weight:800;font-size:12px;text-align:center;transition:all .2s;color:var(--k-ink);display:flex;flex-direction:column;align-items:center;gap:5px;box-shadow:0 3px 0 rgba(45,37,33,.12);min-height:88px;}
.tcard:hover{transform:translateY(-2px);box-shadow:0 5px 0 rgba(45,37,33,.12);}
.tcard:active{transform:translateY(1px);box-shadow:0 1px 0 rgba(45,37,33,.12);}
.temoji{font-size:26px;}
.kcshell{display:flex;flex-direction:column;flex:1;height:calc(100vh - 112px);}
.kmsgs{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:12px;max-width:680px;margin:0 auto;width:100%;}
.kmsg{display:flex;gap:8px;animation:fadeUp .25s ease;}
.kmsg.user{flex-direction:row-reverse;}
.kav{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.kbub{max-width:72%;padding:10px 14px;border-radius:16px;font-size:14.5px;line-height:1.5;font-weight:600;font-family:'Nunito',sans-serif;}
.kmsg.user      .kbub{background:var(--k-ink);color:white;border-bottom-right-radius:4px;}
.kmsg.assistant .kbub{background:var(--k-paper);border:2px solid var(--k-border);color:var(--k-ink);border-bottom-left-radius:4px;}
.ksavebtn{background:rgba(248,209,135,.2);border:1.5px solid #F4D998;border-radius:8px;padding:4px 10px;font-size:11px;font-family:'Nunito',sans-serif;font-weight:800;color:#A87515;margin-top:5px;transition:all .15s;}
.ksavebtn:hover{background:rgba(248,209,135,.35);}
.kiarea{background:var(--k-paper);border-top:2px solid var(--k-border);padding:12px 20px;max-width:680px;margin:0 auto;width:100%;}
.kirow{display:flex;gap:9px;align-items:center;}
.kinput{flex:1;border:2px solid var(--k-border);border-radius:14px;padding:10px 14px;font-size:14px;font-family:'Nunito',sans-serif;font-weight:700;background:var(--k-bg);color:var(--k-ink);outline:none;transition:border-color .2s;}
.kinput:focus{border-color:var(--k-ink);}
.ksendbtn{width:42px;height:42px;border-radius:50%;border:none;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 0 rgba(45,37,33,.18);transition:all .15s;color:white;}
.ksendbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 5px 0 rgba(45,37,33,.18);}
.ksendbtn:disabled{opacity:.4;cursor:not-allowed;}
.knb{padding:20px;max-width:680px;margin:0 auto;width:100%;}
.knb h2{font-family:'Fraunces',serif;font-weight:600;font-size:24px;color:var(--k-ink);margin-bottom:4px;line-height:1.15;}
.knb p{font-size:13px;color:var(--k-inkSoft);margin-bottom:20px;font-weight:600;}
.kwcard{background:var(--k-paper);border:2px solid var(--k-border);border-radius:16px;padding:14px;margin-bottom:8px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 2px 0 rgba(45,37,33,.06);transition:border-color .2s;}
.kwcard:hover{border-color:var(--k-mute);}
.kwe{font-size:24px;flex-shrink:0;width:42px;height:42px;background:var(--k-paper2);border:2px solid var(--k-border);border-radius:12px;display:flex;align-items:center;justify-content:center;}
.kwb{flex:1;}
.kww{font-family:'Nunito',sans-serif;font-weight:900;font-size:17px;color:var(--k-ink);margin-bottom:3px;}
.kwd{font-size:13px;color:var(--k-inkSoft);line-height:1.45;font-weight:600;}
.kwdate{font-size:11px;color:var(--k-mute);margin-top:5px;font-weight:700;letter-spacing:.2px;}
.kwdel{background:none;border:none;font-size:18px;color:var(--k-mute);padding:4px;border-radius:8px;transition:all .15s;flex-shrink:0;}
.kwdel:hover{color:#c94040;background:rgba(201,64,64,.1);}
.knempty{text-align:center;padding:48px 20px;}
.knempty .ei{font-size:52px;margin-bottom:12px;}
.knempty p{font-size:15px;color:var(--k-inkSoft);font-family:'Nunito',sans-serif;font-weight:700;}
.kids-modal{background:var(--k-bg);border:2px solid var(--k-border);}
.kids-minput{background:var(--k-paper);border:2px solid var(--k-border);color:var(--k-ink);}
.kids-minput::placeholder{color:var(--k-mute);}
.kids-minput:focus{border-color:var(--k-ink);}
.kids-mh3{font-family:'Nunito',sans-serif;color:var(--k-ink);}
.kids-mp{color:var(--k-inkSoft);}

/* DOTS */
.dots{display:flex;gap:5px;align-items:center;padding:6px 2px;}
.dots span{width:7px;height:7px;border-radius:50%;animation:bounce 1.2s infinite;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}
.adult-dots span{background:var(--muted);}
.kids-dots  span{background:var(--k-mute);}

/* ERROR */
.err-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;background:var(--bg);}
.err-screen h2{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--cream);margin-bottom:12px;}
.err-screen p{color:var(--muted);font-size:15px;line-height:1.6;max-width:480px;}
.err-screen code{background:var(--surf);border:1px solid var(--border);border-radius:6px;padding:2px 7px;font-size:13px;color:var(--gold);}

/* ANIMS */
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95);}to{opacity:1;transform:scale(1);}}
@keyframes bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);}}
`

// ─── OLLIE AVATAR ─────────────────────────────────────────────────────────────

function OllieAvatar({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0, display: "block" }}>
      <defs>
        <radialGradient id="oBody" cx=".5" cy=".4">
          <stop offset="0" stopColor="#C49570" />
          <stop offset="1" stopColor="#8B6242" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="38" rx="22" ry="22" fill="url(#oBody)" />
      <ellipse cx="32" cy="42" rx="13" ry="15" fill="#F4E4CC" />
      <path d="M14 22 L18 12 L22 20 Z" fill="#8B6242" />
      <path d="M50 22 L46 12 L42 20 Z" fill="#8B6242" />
      <circle cx="24" cy="30" r="7.5" fill="#fff" />
      <circle cx="40" cy="30" r="7.5" fill="#fff" />
      <circle cx="25" cy="31" r="3.5" fill="#2D2521" />
      <circle cx="39" cy="31" r="3.5" fill="#2D2521" />
      <circle cx="26" cy="29.5" r="1.2" fill="#fff" />
      <circle cx="40" cy="29.5" r="1.2" fill="#fff" />
      <path d="M32 35 L28 40 L36 40 Z" fill="#E8943B" />
    </svg>
  )
}

// ─── DOTS ─────────────────────────────────────────────────────────────────────

function Dots({ kids }) {
  const cls = kids ? "kids-dots" : "adult-dots"
  return (
    <div className="dots">
      <span className={cls} />
      <span className={cls} />
      <span className={cls} />
    </div>
  )
}

// ─── SAVE MODAL ───────────────────────────────────────────────────────────────

function SaveModal({ sourceText, language, langFlag, mode, onSave, onClose }) {
  const [word, setWord] = useState("")
  const [ctx, setCtx] = useState(sourceText?.slice(0, 100) || "")
  const isKids = mode === "kids"
  return (
    <div className="mbdrop" onClick={onClose}>
      <div className={`modal${isKids ? " kids-modal" : ""}`} onClick={e => e.stopPropagation()}>
        <h3 className={isKids ? "kids-mh3" : ""} style={isKids ? { fontFamily: "'Nunito',sans-serif" } : {}}>
          {isKids ? "📌 Save a Word!" : "Save to Notebook"}
        </h3>
        <p className={isKids ? "kids-mp" : ""}>
          {isKids ? "Type the word you want to remember" : "Pick a word or phrase to save"}
        </p>
        <input
          className={`minput${isKids ? " kids-minput" : ""}`}
          placeholder={isKids ? "Word or phrase…" : "Word / phrase in target language…"}
          value={word}
          onChange={e => setWord(e.target.value)}
          autoFocus
        />
        <input
          className={`minput${isKids ? " kids-minput" : ""}`}
          placeholder={isKids ? "What does it mean? (optional)" : "Context / example sentence…"}
          value={ctx}
          onChange={e => setCtx(e.target.value)}
        />
        <div className="mrow2">
          <button className="mcancel" style={isKids ? { color: "#78716C" } : {}} onClick={onClose}>
            Cancel
          </button>
          <button
            className="msave"
            style={isKids ? { background: "#FECA57", color: "#1C1917" } : {}}
            onClick={() => {
              if (!word.trim()) return
              onSave({ word: word.trim(), context: ctx.trim(), language, langFlag })
              onClose()
            }}
          >
            {isKids ? "Save it! ⭐" : "Save →"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── WORD OF DAY ──────────────────────────────────────────────────────────────

function WordOfDay() {
  const langs = Object.keys(LANGUAGES)
  const [active, setActive] = useState("dutch")
  const [data, setData] = useState({})
  const [loading, setLoading] = useState({})
  const [saved, setSaved] = useState({})

  const fetchWOD = useCallback(
    async lang => {
      if (data[lang] || loading[lang]) return
      setLoading(p => ({ ...p, [lang]: true }))
      const cached = await loadWODCache()
      if (cached?.words?.[lang]) {
        setData(p => ({ ...p, [lang]: cached.words[lang] }))
        setLoading(p => ({ ...p, [lang]: false }))
        return
      }
      try {
        const L = LANGUAGES[lang]
        const text = await ai(
          [{ role: "user", content: `Give me an interesting, vivid ${L.name} word of the day for a language learner. Respond ONLY as valid JSON with these exact fields: {"word":"...","phonetic":"...","translation":"...","example_native":"...","example_english":"...","fun_fact":"..."}` }],
          null,
          400
        )
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim())
        setData(p => ({ ...p, [lang]: parsed }))
        const cur = await loadWODCache()
        await saveWODCache({ words: { ...(cur?.words || {}), [lang]: parsed } })
      } catch {
        setData(p => ({ ...p, [lang]: { word: "–", phonetic: "", translation: "Could not load today's word", example_native: "", example_english: "", fun_fact: "" } }))
      }
      setLoading(p => ({ ...p, [lang]: false }))
    },
    [data, loading]
  )

  useEffect(() => { fetchWOD(active) }, [active])

  const d = data[active]
  const L = LANGUAGES[active]

  const saveToNB = async () => {
    if (!d || saved[active]) return
    await addWord("adult", { word: d.word, phonetic: d.phonetic, translation: d.translation, context: d.example_native, language: active, langFlag: L.flag })
    setSaved(p => ({ ...p, [active]: true }))
  }

  return (
    <div className="scr">
      <h2 className="sh">Word of the Day</h2>
      <p className="ss">A fresh word each day — tap any language to load it</p>
      <div className="wod-ltabs">
        {langs.map(k => (
          <button key={k} className={`wod-ltab${active === k ? " on" : ""}`} onClick={() => setActive(k)}>
            {LANGUAGES[k].flag} {LANGUAGES[k].name}
          </button>
        ))}
      </div>
      <div className="wod-card">
        {loading[active] && (
          <div className="loading-row">
            <Dots /> Fetching today's {L.name} word…
          </div>
        )}
        {!loading[active] && d && (
          <>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
              {L.flag} {L.name} · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
            </div>
            <div className="wod-word">{d.word}</div>
            {d.phonetic && <div className="wod-ph">/{d.phonetic}/</div>}
            <div className="wod-tr">{d.translation}</div>
            {d.example_native && (
              <div className="wod-ex">
                <div style={{ marginBottom: 4 }}>{d.example_native}</div>
                <div style={{ color: "var(--muted)", fontSize: 13, fontStyle: "italic" }}>{d.example_english}</div>
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
  )
}

// ─── ADULT NOTEBOOK ───────────────────────────────────────────────────────────

function AdultNotebook({ refresh }) {
  const [entries, setEntries] = useState([])
  const [filter, setFilter] = useState("all")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadNB("adult").then(e => { setEntries(e); setLoaded(true) })
  }, [refresh])

  const del = async id => setEntries(await delWord("adult", id))
  const langs = ["all", ...Object.keys(LANGUAGES).filter(k => entries.some(e => e.language === k))]
  const filtered = filter === "all" ? entries : entries.filter(e => e.language === filter)

  return (
    <div className="scr">
      <h2 className="sh">Vocabulary Notebook</h2>
      <p className="ss">{entries.length} saved word{entries.length !== 1 ? "s" : ""}</p>
      {langs.length > 1 && (
        <div className="nb-filters">
          {langs.map(k => (
            <button key={k} className={`nbf${filter === k ? " on" : ""}`} onClick={() => setFilter(k)}>
              {k === "all" ? "All" : LANGUAGES[k]?.flag + " " + LANGUAGES[k]?.name}
            </button>
          ))}
        </div>
      )}
      {loaded && filtered.length === 0 && (
        <div className="nb-empty">
          <div className="ei">📓</div>
          <p>{entries.length === 0 ? "Start a conversation and tap 📌 to save words!" : "No words for this language yet."}</p>
        </div>
      )}
      <div className="wcs">
        {filtered.map(e => (
          <div key={e.id} className="wc">
            <div className="wc-flag">{e.langFlag || "🌍"}</div>
            <div className="wc-b">
              <div className="wc-w">{e.word}</div>
              {e.phonetic && <div className="wc-ph">/{e.phonetic}/</div>}
              {e.translation && <div className="wc-tr">{e.translation}</div>}
              {e.context && <div className="wc-ctx">{e.context}</div>}
              <div className="wc-meta">{e.language ? LANGUAGES[e.language]?.name : ""} · {e.date}</div>
            </div>
            <button className="wc-del" onClick={() => del(e.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ADULT CHAT ───────────────────────────────────────────────────────────────

function AdultChat({ lang, scenario, onNotebookSave }) {
  const L = LANGUAGES[lang]
  const [msgs, setMsgs] = useState([])
  const [inp, setInp] = useState("")
  const [busy, setBusy] = useState(false)
  const [panels, setPanels] = useState({})
  const [modal, setModal] = useState(null)
  const endRef = useRef(null)

  const sys = `You are a native ${L.name} speaker in scenario: "${scenario}".
- Reply mainly in ${L.name} (natural everyday speech, not textbook)
- Add subtle English hints in parentheses only when the learner clearly struggles
- Keep replies to 2-3 sentences max — real dialogue
- Correct errors gently inline; no grammar lectures
- Stay in character for the scenario
Start the conversation naturally.`

  useEffect(() => { start() }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs, busy, panels])

  const toApi = ms => ms.map(m => ({ role: m.role, content: m.text }))

  const start = async () => {
    setBusy(true)
    try {
      const t = await ai([{ role: "user", content: "Start the conversation." }], sys, 400)
      setMsgs([{ role: "assistant", text: t, id: 1 }])
    } catch {
      setMsgs([{ role: "assistant", text: "Connection error. Try again.", id: 1 }])
    }
    setBusy(false)
  }

  const send = async () => {
    if (!inp.trim() || busy) return
    const um = { role: "user", text: inp.trim(), id: Date.now() }
    const next = [...msgs, um]
    setMsgs(next)
    setInp("")
    setBusy(true)
    try {
      const t = await ai(toApi(next), sys, 400)
      setMsgs(p => [...p, { role: "assistant", text: t, id: Date.now() + 1 }])
    } catch {
      setMsgs(p => [...p, { role: "assistant", text: "Error. Try again.", id: Date.now() }])
    }
    setBusy(false)
  }

  const togglePanel = async (id, text, type) => {
    if (panels[id]?.type === type) {
      setPanels(p => { const n = { ...p }; delete n[id]; return n })
      return
    }
    setPanels(p => ({ ...p, [id]: { type, loading: true, content: "" } }))
    try {
      let content
      if (type === "translation") {
        content = await ai([{ role: "user", content: `Translate this ${L.name} text to English. Translation only, nothing else:\n"${text}"` }], null, 300)
      } else {
        const raw = await ai(
          [{ role: "user", content: `For this ${L.name} text, give a pronunciation guide for an English-speaking beginner. Respond ONLY as valid JSON: {"phonetic":"simplified phonetic spelling","tips":"1-2 key pronunciation tips","sounds":"one tricky sound to watch"}\nText: "${text}"` }],
          null,
          300
        )
        try { content = JSON.parse(raw.replace(/```json|```/g, "").trim()) } catch { content = { phonetic: "", tips: raw, sounds: "" } }
      }
      setPanels(p => ({ ...p, [id]: { type, loading: false, content } }))
    } catch {
      setPanels(p => ({ ...p, [id]: { type, loading: false, content: "Could not load." } }))
    }
  }

  const doSave = async entry => { await addWord("adult", { ...entry }); onNotebookSave?.() }

  return (
    <div className="cshell">
      <div className="cinfo">
        <span>{L.flag} {L.name}</span>
        <span className="ctag">{scenario}</span>
        <span style={{ marginLeft: "auto", fontSize: 12 }}>Tap a message for translation, pronunciation & save</span>
      </div>
      <div className="cmsgs">
        {msgs.map(m => (
          <div key={m.id} className={`mrow ${m.role}`}>
            <div className="mav">{m.role === "user" ? "👤" : L.flag}</div>
            <div className="mcol">
              <div className="bub">{m.text}</div>
              {m.role === "assistant" && (
                <div className="macts">
                  <button className={`mact${panels[m.id]?.type === "translation" ? " on" : ""}`} onClick={() => togglePanel(m.id, m.text, "translation")}>🇬🇧 Translate</button>
                  <button className={`mact${panels[m.id]?.type === "pronunciation" ? " on" : ""}`} onClick={() => togglePanel(m.id, m.text, "pronunciation")}>🔊 Pronunciation</button>
                  <button className="mact" onClick={() => setModal({ text: m.text })}>📌 Save</button>
                </div>
              )}
              {panels[m.id] && (
                <div className="mpanel">
                  {panels[m.id].loading && <Dots />}
                  {!panels[m.id].loading && panels[m.id].type === "translation" && (
                    <><div className="plabel">English Translation</div>{panels[m.id].content}</>
                  )}
                  {!panels[m.id].loading && panels[m.id].type === "pronunciation" && (() => {
                    const c = panels[m.id].content
                    return (
                      <>
                        <div className="plabel">Pronunciation Guide</div>
                        {c.phonetic && <div className="pph">/{c.phonetic}/</div>}
                        {c.tips && <div className="ptip">{c.tips}</div>}
                        {c.sounds && <div className="ptip" style={{ marginTop: 6 }}>🎯 Watch out for: {c.sounds}</div>}
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="mrow assistant">
            <div className="mav">{L.flag}</div>
            <div className="mcol"><div className="bub"><Dots /></div></div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="hints">
        {(HINTS[lang] || []).map(h => (
          <button key={h} className="hchip" onClick={() => setInp(h)}>{h}</button>
        ))}
      </div>
      <div className="iarea">
        <div className="irow">
          <textarea
            className="cinput"
            value={inp}
            rows={1}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={`Type in ${L.name}…`}
          />
          <button className="sbtn-send" onClick={send} disabled={busy || !inp.trim()}>↑</button>
        </div>
      </div>
      {modal && (
        <SaveModal
          sourceText={modal.text}
          language={lang}
          langFlag={L.flag}
          mode="adult"
          onSave={doSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

// ─── KIDS NOTEBOOK ────────────────────────────────────────────────────────────

function KidsNotebook({ refresh }) {
  const [entries, setEntries] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadNB("kids").then(e => { setEntries(e); setLoaded(true) })
  }, [refresh])

  const del = async id => setEntries(await delWord("kids", id))

  return (
    <div className="knb">
      <h2>My Word Book</h2>
      <p>Words you've saved from your chats with Ollie! ⭐</p>
      {loaded && entries.length === 0 && (
        <div className="knempty">
          <div className="ei">📖</div>
          <p>Chat with Ollie and tap "Save a word!" to start your collection!</p>
        </div>
      )}
      {entries.map(e => (
        <div key={e.id} className="kwcard">
          <div className="kwe">{e.emoji || "⭐"}</div>
          <div className="kwb">
            <div className="kww">{e.word}</div>
            {e.context && <div className="kwd">{e.context}</div>}
            <div className="kwdate">Saved on {e.date}</div>
          </div>
          <button className="kwdel" onClick={() => del(e.id)}>×</button>
        </div>
      ))}
    </div>
  )
}

// ─── KIDS CHAT ────────────────────────────────────────────────────────────────

function KidsChat({ topic, onKidsSave }) {
  const T = KIDS_TOPICS.find(t => t.id === topic)
  const [msgs, setMsgs] = useState([])
  const [inp, setInp] = useState("")
  const [busy, setBusy] = useState(false)
  const [modal, setModal] = useState(null)
  const endRef = useRef(null)

  const sys = `You are Ollie the Owl 🦉, a warm and enthusiastic English tutor for children aged 5–12.
Topic: ${T.label} (${T.emoji})
- Be super encouraging, use emojis! 🎉
- Introduce 2-3 words at a time with fun, simple examples
- For Story Time: build a story together with the child
- Celebrate with "Brilliant! 🌟", "Amazing! 💪", "Great job! 🎊"
- Keep replies to 2-4 sentences; always end with ONE simple question
- Correct mistakes very gently: "I love that! We say 'X' — try it?"
Start with a fun, warm intro for ${T.label}!`

  useEffect(() => { start() }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs, busy])

  const start = async () => {
    setBusy(true)
    try {
      const t = await ai([{ role: "user", content: "Start!" }], sys, 300)
      setMsgs([{ role: "assistant", text: t, id: 1 }])
    } catch {
      setMsgs([{ role: "assistant", text: "Hoot hoot! 🦉 Trouble connecting. Try again!", id: 1 }])
    }
    setBusy(false)
  }

  const send = async () => {
    if (!inp.trim() || busy) return
    const um = { role: "user", text: inp.trim(), id: Date.now() }
    const next = [...msgs, um]
    setMsgs(next)
    setInp("")
    setBusy(true)
    try {
      const t = await ai(next.map(m => ({ role: m.role, content: m.text })), sys, 300)
      setMsgs(p => [...p, { role: "assistant", text: t, id: Date.now() + 1 }])
    } catch {
      setMsgs(p => [...p, { role: "assistant", text: "Oops! 🦉 Let's try again!", id: Date.now() }])
    }
    setBusy(false)
  }

  const doSave = async entry => { await addWord("kids", { ...entry, emoji: T.emoji }); onKidsSave?.() }

  return (
    <div className="kcshell">
      <div className="kmsgs">
        {msgs.map(m => (
          <div key={m.id} className={`kmsg ${m.role}`}>
            {m.role === "assistant" && (
              <div className="kav" style={{ background: "#F4E4CC" }}>
                <OllieAvatar size={38} />
              </div>
            )}
            {m.role === "user" && (
              <div className="kav" style={{ background: "#B7C9DC", fontSize: 18 }}>🧒</div>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div className="kbub">{m.text}</div>
              {m.role === "assistant" && (
                <button className="ksavebtn" onClick={() => setModal({ text: m.text })}>⭐ Save a word!</button>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="kmsg assistant">
            <div className="kav" style={{ background: "#F4E4CC" }}>
              <OllieAvatar size={38} />
            </div>
            <div className="kbub" style={{ paddingTop: 8, paddingBottom: 8 }}>
              <Dots kids />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="kiarea">
        <div className="kirow">
          <input
            className="kinput"
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send() }}
            placeholder="Type here… ✏️"
          />
          <button className="ksendbtn" style={{ background: T.color }} onClick={send} disabled={busy || !inp.trim()}>↑</button>
        </div>
      </div>
      {modal && (
        <SaveModal
          sourceText={modal.text}
          mode="kids"
          onSave={doSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

// ─── ADULT MODE ───────────────────────────────────────────────────────────────

function AdultMode({ onBack }) {
  const [tab, setTab] = useState("converse")
  const [lang, setLang] = useState(null)
  const [scenario, setScenario] = useState(null)
  const [inChat, setInChat] = useState(false)
  const [nbV, setNbV] = useState(0)

  if (inChat && lang && scenario) {
    return (
      <div className="shell">
        <div className="topbar">
          <div className="topbar-logo">✦</div>
          <span className="topbar-title">Lingua — {LANGUAGES[lang].flag} {LANGUAGES[lang].name}</span>
          <button className="ghost" onClick={() => setInChat(false)}>← Scenarios</button>
          <button className="ghost" onClick={onBack}>Home</button>
        </div>
        <AdultChat lang={lang} scenario={scenario} onNotebookSave={() => setNbV(v => v + 1)} />
      </div>
    )
  }

  return (
    <div className="shell">
      <div className="topbar">
        <div className="topbar-logo">✦</div>
        <span className="topbar-title">Lingua</span>
        <button className="ghost" onClick={onBack}>← Home</button>
      </div>
      <div className="tabs">
        {[["converse", "💬 Converse"], ["wod", "🌟 Word of Day"], ["notebook", "📓 Notebook"]].map(([k, l]) => (
          <button key={k} className={`tab${tab === k ? " on" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab === "converse" && (
        <div className="scr">
          <h2 className="sh">Choose a language</h2>
          <p className="ss">8 languages · 8 scenarios each · real conversation</p>
          <div className="lgrid">
            {Object.entries(LANGUAGES).map(([k, v]) => (
              <div
                key={k}
                className={`lcard${lang === k ? " on" : ""}`}
                style={lang === k ? { borderColor: v.accent, boxShadow: `0 4px 20px ${v.accent}30` } : {}}
                onClick={() => { setLang(k); setScenario(null) }}
              >
                <span className="lflag">{v.flag}</span>
                <div className="linfo"><h4>{v.name}</h4><span>{v.native}</span></div>
              </div>
            ))}
          </div>
          {lang && (
            <>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "var(--cream)", marginBottom: 14 }}>
                Pick a scenario
              </h3>
              <div className="sgrid">
                {LANGUAGES[lang].scenarios.map(s => (
                  <button key={s} className={`sbtn${scenario === s ? " on" : ""}`} onClick={() => setScenario(s)}>{s}</button>
                ))}
              </div>
            </>
          )}
          <button className="cta" disabled={!lang || !scenario} onClick={() => setInChat(true)}>
            Start conversation →
          </button>
        </div>
      )}
      {tab === "wod"      && <WordOfDay />}
      {tab === "notebook" && <AdultNotebook refresh={nbV} />}
    </div>
  )
}

// ─── KIDS MODE ────────────────────────────────────────────────────────────────

function KidsMode({ onBack }) {
  const [tab, setTab] = useState("learn")
  const [topic, setTopic] = useState(null)
  const [nbV, setNbV] = useState(0)

  return (
    <div className="ks">
      <div className="kh">
        <button
          className="ghost"
          style={{ background: "rgba(255,255,255,.1)", color: "white", borderColor: "rgba(255,255,255,.2)", fontSize: 12, padding: "5px 10px" }}
          onClick={onBack}
        >
          ← Home
        </button>
        <div className="kh-brand">
          <OllieAvatar size={28} />
          <span>Ollie's English World</span>
        </div>
        {topic && (
          <button
            className="ghost"
            style={{ background: "rgba(255,255,255,.1)", color: "white", borderColor: "rgba(255,255,255,.2)", fontSize: 12, padding: "5px 10px" }}
            onClick={() => setTopic(null)}
          >
            ← Topics
          </button>
        )}
      </div>
      <div className="ktabs">
        <button className={`ktab${tab === "learn" ? " on" : ""}`} onClick={() => { setTab("learn"); setTopic(null) }}>📚 Learn</button>
        <button className={`ktab${tab === "words" ? " on" : ""}`} onClick={() => { setTab("words"); setTopic(null) }}>⭐ My Words</button>
      </div>
      {tab === "learn" && !topic && (
        <>
          <div className="kwel">
            <h1>What shall we learn today?</h1>
            <p>Pick a topic and chat with Ollie 🦉</p>
          </div>
          <div className="ktgrid">
            {KIDS_TOPICS.map(t => (
              <button key={t.id} className="tcard" style={{ background: t.color }} onClick={() => setTopic(t.id)}>
                <span className="temoji">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
      {tab === "learn" && topic && <KidsChat topic={topic} onKidsSave={() => setNbV(v => v + 1)} />}
      {tab === "words" && <KidsNotebook refresh={nbV} />}
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState(null)

  return (
    <>
      <style>{CSS}</style>
      {mode === "adult" && <AdultMode onBack={() => setMode(null)} />}
      {mode === "kids"  && <KidsMode  onBack={() => setMode(null)} />}
      {!mode && (
        <div className="landing">
          <div className="l-grid" />
          <div className="l-orb1" /><div className="l-orb2" />
          <div className="logo-row">
            <div className="logo-icon">✦</div>
            <div className="logo-name">Lingua</div>
          </div>
          <h1 className="l-h1">Learn to <em>speak</em>,<br />not just study.</h1>
          <p className="l-sub">
            Conversation-first language learning for your whole family. Real dialogues, daily vocabulary,
            pronunciation guides, and a personal notebook — no streaks, no gamification.
          </p>
          <div className="p-cards">
            <div className="p-card" onClick={() => setMode("kids")}>
              <span className="ce">🦉</span>
              <h3>Kids Mode</h3>
              <p>English vocabulary &amp; fun dialogues with Ollie the Owl. 12 topics, word book included.</p>
            </div>
            <div className="p-card" onClick={() => setMode("adult")}>
              <span className="ce">✈️</span>
              <h3>Adult Mode</h3>
              <p>8 languages. Real-life scenarios. Pronunciation guides, translations &amp; a personal notebook.</p>
            </div>
          </div>
          <div className="l-langs">
            🇳🇱 Dutch · 🇮🇹 Italian · 🇫🇷 French · 🇪🇸 Spanish · 🇩🇪 German · 🇵🇹 Portuguese · 🇯🇵 Japanese · 🇨🇳 Mandarin
          </div>
        </div>
      )}
    </>
  )
}
