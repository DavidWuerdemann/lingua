import { useState, useRef, useEffect, createContext, useContext, Fragment } from "react";
import { createPortal } from "react-dom";
import { useRegisterSW } from "virtual:pwa-register/react";

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
    vocabSets:"Words",wordOfDay:"Word of the Day",idiomOfDay:"Idiom of the Day",
    startChat:"Start chatting…",send:"Send",save:"Save",saved:"Saved!",clear:"Clear chat",
    summary:"Session Summary",noWords:"No words saved yet.",yourLevel:"Your Level",
    stars:"Stars",errorPatterns:"Error Patterns",dueReview:"Due for review",loading:"Thinking…",
    scenario:"Scenario",language:"Language",newSet:"New Set",import:"Import",
    flashcards:"Flashcards",practice:"Practice with Ollie",editSet:"Edit",deleteSet:"Delete",
    addWord:"Add word",wordLabel:"Word / Phrase",translLabel:"Translation",
    listenMode:"Listen & Type",speakBtn:"🔊 Speak",correct:"Correct!",tryAgain:"Try again",
    flip:"Flip",typeIt:"Type it",easy:"Easy",good:"Good",hard:"Hard",
    next:"Next",back:"Back",allDone:"All done!",
    pickLanguage:"Pick a language to practise:",funIdioms:"Fun Expressions 🌈",
    close:"Close",setName:"Set name",cancel:"Cancel",done:"Done",
    collocations:"Collocations",tip:"Tip",fix:"Correction",uiLang:"Language",idiomCat:"Category",
    appLang:"App language",learnLang:"I'm learning",myNativeLang:"My native language",
    // landing
    landingH1:"Learn to <em>speak</em>,<br/>not just study.",
    landingSub:"Jump into a real conversation in seconds. No streaks, no points — just talking.",
    adultDesc:"6 languages · scenarios · flashcards · notebook",
    kidsDesc:"Chat with Ollie · 12 topics · fun expressions",
    // adult mode
    langSubhead:"Six languages · scenario-based conversations",
    scenSub:"Each gives you a native partner with real context",
    startConv:"Start conversation →",home:"Home",topics:"Topics",
    translate:"Translate",pronounce:"Pronounce",phonetic:"Phonetic",
    englishTransl:"English Translation",pronGuide:"Pronunciation Guide",phoneticGuide:"Phonetic Reading",
    endSession:"Enough for today",keepChatting:"Keep chatting",backToScenarios:"Back to scenarios",
    seWins:"Your wins",seNowYouCan:"Now you can…",seNextStep:"Next up",wrappingUp:"Wrapping up your session…",
    backToTopics:"Back to topics",kidsSeeLearned:"Look what you learned!",kidsSeeCan:"Now you can…",kidsSeeChal:"Ollie's challenge for next time",
    hearSlower:"Hear it again (slower)",typeHeard:"Type what you heard…",
    watch:"🎯 Watch:",
    saveToNotebook:"Save to Notebook",saveToNbSub:"Edit the word you want to remember",
    // kids
    kidsWelH1:"What shall we<br/>learn today?",
    kidsWelSub:"Pick a topic and chat with Ollie 🦉",
    kidsWordBook:"⭐ My Word Book",kidsWordBookSub:"Words you've saved with Ollie!",
    kidsWordBookEmpty:"Chat and tap 💾 to start your collection!",
    kidsRecent:"Recent",kidsIdiomSub:"Cool phrases Ollie loves 🦉",
    hearIt:"🔊 Hear it!",nativeLang:"My native language",
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
    appLang:"App-Sprache",learnLang:"Ich lerne",myNativeLang:"Meine Muttersprache",
    landingH1:"Lern zu <em>sprechen</em>,<br/>nicht nur zu büffeln.",
    landingSub:"Starte ein echtes Gespräch in Sekunden. Kein Streak, keine Punkte — einfach reden.",
    adultDesc:"6 Sprachen · Szenarien · Karteikarten · Notizbuch",
    kidsDesc:"Chat mit Ollie · 12 Themen · witzige Phrasen",
    langSubhead:"Sechs Sprachen · szenariobasierte Gespräche",
    scenSub:"Jedes gibt dir einen Muttersprachler mit echtem Kontext",
    startConv:"Gespräch starten →",home:"Startseite",topics:"Themen",
    translate:"Übersetzen",pronounce:"Aussprache",phonetic:"Phonetik",
    englishTransl:"Englische Übersetzung",pronGuide:"Ausspracheführer",phoneticGuide:"Phonetische Lesung",
    endSession:"Für heute reicht's",keepChatting:"Weiter chatten",backToScenarios:"Zurück zu Szenarien",
    seWins:"Deine Erfolge",seNowYouCan:"Jetzt kannst du…",seNextStep:"Als Nächstes",wrappingUp:"Sitzung wird abgeschlossen…",
    backToTopics:"Zurück zu Themen",kidsSeeLearned:"Das hast du gelernt!",kidsSeeCan:"Jetzt kannst du…",kidsSeeChal:"Ollies Aufgabe für nächstes Mal",
    hearSlower:"Nochmal hören (langsamer)",typeHeard:"Tippe, was du gehört hast…",
    watch:"🎯 Achte auf:",
    saveToNotebook:"Im Notizbuch speichern",saveToNbSub:"Bearbeite das Wort, das du behalten möchtest",
    kidsWelH1:"Was lernen wir<br/>heute?",
    kidsWelSub:"Wähle ein Thema und chatte mit Ollie 🦉",
    kidsWordBook:"⭐ Mein Wörterbuch",kidsWordBookSub:"Wörter, die du mit Ollie gespeichert hast!",
    kidsWordBookEmpty:"Chatte und tippe 💾 um deine Sammlung zu starten!",
    kidsRecent:"Zuletzt",kidsIdiomSub:"Coole Phrasen, die Ollie liebt 🦉",
    hearIt:"🔊 Anhören!",nativeLang:"Meine Muttersprache",
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
    appLang:"App-taal",learnLang:"Ik leer",myNativeLang:"Mijn moedertaal",
    landingH1:"Leer <em>spreken</em>,<br/>niet alleen studeren.",
    landingSub:"Start in seconden een echt gesprek. Geen reeksen, geen punten — gewoon praten.",
    adultDesc:"6 talen · scenario's · flashkaarten · notitieboek",
    kidsDesc:"Chat met Ollie · 12 onderwerpen · grappige uitdrukkingen",
    langSubhead:"Zes talen · scenario-gebaseerde gesprekken",
    scenSub:"Elk geeft je een moedertaalspreker in een echte context",
    startConv:"Gesprek starten →",home:"Home",topics:"Onderwerpen",
    translate:"Vertalen",pronounce:"Uitspreken",phonetic:"Fonetiek",
    englishTransl:"Engelse vertaling",pronGuide:"Uitspraakgids",phoneticGuide:"Fonetische lezing",
    endSession:"Genoeg voor vandaag",keepChatting:"Doorgaan",backToScenarios:"Terug naar scenario's",
    seWins:"Jouw prestaties",seNowYouCan:"Nu kun je…",seNextStep:"Volgende stap",wrappingUp:"Sessie wordt afgerond…",
    backToTopics:"Terug naar onderwerpen",kidsSeeLearned:"Kijk wat je geleerd hebt!",kidsSeeCan:"Nu kun je…",kidsSeeChal:"Ollies uitdaging voor volgende keer",
    hearSlower:"Nog eens horen (langzamer)",typeHeard:"Typ wat je hoorde…",
    watch:"🎯 Let op:",
    saveToNotebook:"Opslaan in notitieboek",saveToNbSub:"Bewerk het woord dat je wilt onthouden",
    kidsWelH1:"Wat leren we<br/>vandaag?",
    kidsWelSub:"Kies een onderwerp en chat met Ollie 🦉",
    kidsWordBook:"⭐ Mijn Woordenboek",kidsWordBookSub:"Woorden die je met Ollie hebt opgeslagen!",
    kidsWordBookEmpty:"Chat en tik 💾 om je collectie te starten!",
    kidsRecent:"Recent",kidsIdiomSub:"Coole uitdrukkingen die Ollie geweldig vindt 🦉",
    hearIt:"🔊 Beluisteren!",nativeLang:"Mijn moedertaal",
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
    listenMode:"Écouter & Taper",speakBtn:"🔊 Écouter",correct:"Correct !",
    tryAgain:"Réessayer",flip:"Retourner",typeIt:"Taper",easy:"Facile",good:"Bien",
    hard:"Difficile",next:"Suivant",back:"Retour",allDone:"Tout fait !",
    pickLanguage:"Choisissez une langue :",funIdioms:"Expressions amusantes 🌈",
    close:"Fermer",setName:"Nom de la liste",cancel:"Annuler",done:"Terminé",
    collocations:"Collocations",tip:"Conseil",fix:"Correction",uiLang:"Langue",idiomCat:"Catégorie",
    appLang:"Langue de l'app",learnLang:"J'apprends",myNativeLang:"Ma langue maternelle",
    landingH1:"Apprends à <em>parler</em>,<br/>pas seulement à étudier.",
    landingSub:"Lance une vraie conversation en quelques secondes. Pas de séries, pas de points — juste parler.",
    adultDesc:"6 langues · scénarios · fiches · carnet",
    kidsDesc:"Chat avec Ollie · 12 sujets · expressions amusantes",
    langSubhead:"Six langues · conversations par scénario",
    scenSub:"Chacun te donne un partenaire natif avec un vrai contexte",
    startConv:"Démarrer la conversation →",home:"Accueil",topics:"Sujets",
    translate:"Traduire",pronounce:"Prononcer",phonetic:"Phonétique",
    englishTransl:"Traduction anglaise",pronGuide:"Guide de prononciation",phoneticGuide:"Lecture phonétique",
    endSession:"Assez pour aujourd'hui",keepChatting:"Continuer",backToScenarios:"Retour aux scénarios",
    seWins:"Tes réussites",seNowYouCan:"Maintenant tu peux…",seNextStep:"Prochaine étape",wrappingUp:"Bilan en cours…",
    backToTopics:"Retour aux sujets",kidsSeeLearned:"Regarde ce que tu as appris !",kidsSeeCan:"Maintenant tu peux…",kidsSeeChal:"Le défi d'Ollie pour la prochaine fois",
    hearSlower:"Réécouter (plus lentement)",typeHeard:"Tapez ce que vous avez entendu…",
    watch:"🎯 Attention :",
    saveToNotebook:"Enregistrer dans le carnet",saveToNbSub:"Modifie le mot que tu veux retenir",
    kidsWelH1:"Qu'allons-nous<br/>apprendre aujourd'hui ?",
    kidsWelSub:"Choisis un sujet et discute avec Ollie 🦉",
    kidsWordBook:"⭐ Mon Carnet de Mots",kidsWordBookSub:"Les mots que tu as sauvegardés avec Ollie !",
    kidsWordBookEmpty:"Discute et appuie sur 💾 pour commencer ta collection !",
    kidsRecent:"Récent",kidsIdiomSub:"Des expressions sympas qu'Ollie adore 🦉",
    hearIt:"🔊 Écouter !",nativeLang:"Ma langue maternelle",
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
    appLang:"Idioma de la app",learnLang:"Estoy aprendiendo",myNativeLang:"Mi lengua materna",
    landingH1:"Aprende a <em>hablar</em>,<br/>no sólo a estudiar.",
    landingSub:"Empieza una conversación real en segundos. Sin rachas, sin puntos — solo hablar.",
    adultDesc:"6 idiomas · escenarios · tarjetas · cuaderno",
    kidsDesc:"Chat con Ollie · 12 temas · expresiones divertidas",
    langSubhead:"Seis idiomas · conversaciones por escenario",
    scenSub:"Cada uno te da un hablante nativo con contexto real",
    startConv:"Iniciar conversación →",home:"Inicio",topics:"Temas",
    translate:"Traducir",pronounce:"Pronunciar",phonetic:"Fonética",
    englishTransl:"Traducción al inglés",pronGuide:"Guía de pronunciación",phoneticGuide:"Lectura fonética",
    endSession:"Ya es suficiente",keepChatting:"Seguir chateando",backToScenarios:"Volver a escenarios",
    seWins:"Tus logros",seNowYouCan:"Ahora puedes…",seNextStep:"El siguiente paso",wrappingUp:"Preparando el resumen…",
    backToTopics:"Volver a temas",kidsSeeLearned:"¡Mira lo que aprendiste!",kidsSeeCan:"Ahora puedes…",kidsSeeChal:"El reto de Ollie para la próxima vez",
    hearSlower:"Escuchar de nuevo (más lento)",typeHeard:"Escribe lo que escuchaste…",
    watch:"🎯 Observa:",
    saveToNotebook:"Guardar en cuaderno",saveToNbSub:"Edita la palabra que quieres recordar",
    kidsWelH1:"¿Qué aprendemos<br/>hoy?",
    kidsWelSub:"Elige un tema y chatea con Ollie 🦉",
    kidsWordBook:"⭐ Mi Libro de Palabras",kidsWordBookSub:"¡Palabras que has guardado con Ollie!",
    kidsWordBookEmpty:"¡Chatea y toca 💾 para empezar tu colección!",
    kidsRecent:"Reciente",kidsIdiomSub:"Frases geniales que le encantan a Ollie 🦉",
    hearIt:"🔊 ¡Escúchalo!",nativeLang:"Mi lengua materna",
  },
};

/* ─────────────────────────────────────────────────────────────
   LANGUAGES  (array, with flag + tts + per-language scenarios)
───────────────────────────────────────────────────────────── */
const LANGUAGES = [
  {code:"en",flag:"🇬🇧",name:"English",  native:"English",    tts:"en-GB",accent:"#C9943A",
   scenarios:["Job Interview","Pub Conversation","Doctor's Visit","Flat Hunting","First Date","At the GP","Networking Event","Customer Service Call","Uni Lecture","Salary Negotiation","Making Small Talk",
              "Boardroom Pitch","Contract Negotiation","Commercial Property Viewing","Lease Negotiation","On the Film Set","Script Meeting","Casting Call","At the Marina","Sailing Briefing","Yacht Charter"]},
  {code:"es",flag:"🇪🇸",name:"Spanish",  native:"Español",    tts:"es-ES",accent:"#AA151B",
   scenarios:["En el Bar de Tapas","Noche de Flamenco","Resort de Playa","En el Mercado","Charla de Siesta","Hablando de Fútbol","Anfitrión de Airbnb","Fiesta Local","En el Aeropuerto","Pidiendo Comida","Visita al Médico","Entrevista de Trabajo",
              "Pitch Empresarial","Reunión de Directivos","Tasación Inmobiliaria","Visita de Oficinas","Rodaje en Barcelona","Reunión de Guionistas","Casting en Madrid","En el Puerto Deportivo","Regata en el Mediterráneo","Alquiler de Velero"]},
  {code:"fr",flag:"🇫🇷",name:"French",   native:"Français",   tts:"fr-FR",accent:"#0055A4",
   scenarios:["À la Boulangerie","Visite au Musée","Café Parisien","Faire une Réservation","À la Pharmacie","Plans du Week-end","Dans le Métro","Dégustation de Vin","À l'Aéroport","Commander à Manger","Chez le Médecin","Entretien d'Embauche",
              "Réunion d'Affaires","Négociation Commerciale","Transaction Immobilière","Visite de Bureaux","Tournage à Paris","Réunion de Production","Casting à Cannes","Au Port de Plaisance","Voile en Méditerranée","Location de Voilier"]},
  {code:"de",flag:"🇩🇪",name:"German",   native:"Deutsch",    tts:"de-DE",accent:"#555555",
   scenarios:["Im Biergarten","In der Bäckerei","Mit der U-Bahn","Büro-Smalltalk","Auf dem Weihnachtsmarkt","Museumsbesuch","Auto mieten","In der Apotheke","Am Flughafen","Essen bestellen","Beim Arzt","Vorstellungsgespräch",
              "Vertragsverhandlung","Vorstandspräsentation","Immobilienbesichtigung","Gewerbliche Vermietung","Filmdreh in Berlin","Drehbuchbesprechung","Casting-Gespräch","Im Yachthafen","Segeln auf der Ostsee","Charterbuchung"]},
  {code:"it",flag:"🇮🇹",name:"Italian",  native:"Italiano",   tts:"it-IT",accent:"#009246",
   scenarios:["Ordinare la Pasta","In Gelateria","Chiedere Indicazioni","Shopping a Milano","Check-in in Hotel","Cena in Famiglia","In Spiaggia","Parlare di Calcio","All'Aeroporto","Ordinare da Mangiare","Dal Medico","Colloquio di Lavoro",
              "Trattativa Commerciale","Riunione del Consiglio","Visita Immobiliare","Affitto di Uffici","Set Cinematografico","Riunione di Produzione","Provino a Cinecittà","Al Porto Turistico","Vela sul Lago di Garda","Noleggio Barca"]},
  {code:"nl",flag:"🇳🇱",name:"Dutch",    native:"Nederlands", tts:"nl-NL",accent:"#E8552A",
   scenarios:["Op de Markt","Café Bezoek","Buren Ontmoeten","Op het Station","Bij de Dokter","Werkvergadering","Op een Feestje","Hotel Boeken","Op het Vliegveld","Eten Bestellen","De Weg Vragen","Sollicitatiegesprek",
              "Zakelijke Pitch","Bestuursvergadering","Vastgoed Bezichtiging","Huuronderhandeling","Filmopname in Amsterdam","Scenariobespreking","Casting Gesprek","In de Jachthaven","Zeilen op de Waddenzee","Zeilboot Huren"]},
  {code:"he",flag:"🇮🇱",name:"Hebrew",   native:"עברית",      tts:"he-IL",accent:"#2563EB", rtl:true, script:true,
   scenarios:["ראיון עבודה","שיחת בר","ביקור אצל הרופא","קניות בשוק","תוכניות לסוף שבוע","בבית קפה","בשדה התעופה","הזמנת אוכל","פגישה עם שכנים","פגישה ראשונה","פגישה עסקית","מצגת למשקיעים","משא ומתן על חוזה","ביקור בנכס","שכירת משרד","בסט הצילומים","פגישת תסריטאים","אודישן","בנמל","שיעור הפלגה","השכרת סירה"]},
  {code:"ar",flag:"🇸🇦",name:"Arabic",   native:"العربية",    tts:"ar-SA",accent:"#16A34A", rtl:true, script:true,
   scenarios:["مقابلة عمل","في المقهى","عند الطبيب","التسوق في السوق","خطط نهاية الأسبوع","في المطار","طلب الطعام","في الفندق","لقاء جديد","التعرف على الجيران","اجتماع عمل","عرض تجاري للمستثمرين","التفاوض على عقد","معاينة عقار","استئجار مكتب","في موقع التصوير","اجتماع كتّاب السيناريو","التجارب","في الميناء","درس الإبحار","استئجار قارب"]},
  {code:"tr",flag:"🇹🇷",name:"Turkish",  native:"Türkçe",     tts:"tr-TR",accent:"#E30A17",
   scenarios:["İş Görüşmesi","Çay Bahçesinde","Doktorda","Çarşıda Alışveriş","Havalimanında","Yemek Siparişi","Otelde","Yeni Tanışma","Spor Sohbeti","Müzede","Tatil Planları","Komşularla Sohbet",
              "İş Toplantısı","Yatırımcı Sunumu","Sözleşme Müzakeresi","Emlak Gezisi","Ofis Kiralama","Film Setinde","Senaryo Toplantısı","İstanbul'da Kasting","Marinada","Yelken Dersi"]},
  {code:"ru",flag:"🇷🇺",name:"Russian",  native:"Русский",    tts:"ru-RU",accent:"#CC0000", script:true,
   scenarios:["Собеседование на работу","В кафе","У врача","На рынке","В аэропорту","Заказ еды","В отеле","Знакомство","Разговор о спорте","В музее","В метро","Разговор с соседями",
              "Деловая встреча","Презентация инвесторам","Переговоры по контракту","Осмотр недвижимости","Аренда офиса","На съёмочной площадке","Встреча сценаристов","Кастинг в Москве","В яхтенной марине","Урок парусного спорта"]},
];

const KIDS_LANGS = [
  {code:"en",name:"English 🇬🇧",tts:"en-GB"},
  {code:"es",name:"Spanish 🇪🇸",tts:"es-ES"},
  {code:"de",name:"German 🇩🇪",tts:"de-DE"},
];

const KIDS_TOPICS = [
  {id:"animals",   emoji:"🐾", color:"#E8B4A0", labels:{en:"Animals",       es:"Animales",          de:"Tiere"}},
  {id:"food",      emoji:"🍎", color:"#F4C28A", labels:{en:"Food & Drink",  es:"Comida y bebida",   de:"Essen & Trinken"}},
  {id:"school",    emoji:"✏️", color:"#B7C9DC", labels:{en:"School Stuff",  es:"La escuela",        de:"Schule"}},
  {id:"body",      emoji:"🦷", color:"#B9D4B5", labels:{en:"Body Parts",    es:"El cuerpo",         de:"Körperteile"}},
  {id:"weather",   emoji:"⛅", color:"#F4D998", labels:{en:"Weather",       es:"El tiempo",         de:"Das Wetter"}},
  {id:"numbers",   emoji:"🔢", color:"#C9B4D6", labels:{en:"Numbers",       es:"Los números",       de:"Zahlen"}},
  {id:"colors",    emoji:"🎨", color:"#E8C5BC", labels:{en:"Colors",        es:"Los colores",       de:"Farben"}},
  {id:"transport", emoji:"🚗", color:"#ACBBC9", labels:{en:"Transport",     es:"Transporte",        de:"Verkehrsmittel"}},
  {id:"sports",    emoji:"⚽", color:"#A8C4B5", labels:{en:"Sports",        es:"Los deportes",      de:"Sport"}},
  {id:"stories",   emoji:"📖", color:"#DCC9A8", labels:{en:"Story Time",    es:"Cuentos",           de:"Geschichten"}},
  {id:"opposites", emoji:"↔️", color:"#C7BBC4", labels:{en:"Opposites",       es:"Los contrarios",      de:"Gegensätze"}},
  {id:"travel",    emoji:"✈️", color:"#A8D4E8", labels:{en:"Travelling",      es:"De viaje",            de:"Reisen"}},
  {id:"tvshows",   emoji:"📺", color:"#C4B8DC", labels:{en:"TV & Shows",      es:"Series y tele",       de:"Serien & TV"}},
  {id:"books",     emoji:"📚", color:"#D4C4A8", labels:{en:"Favourite Books", es:"Libros favoritos",    de:"Lieblingsbücher"}},
  {id:"space",     emoji:"🚀", color:"#9BB4CC", labels:{en:"Space & Stars",   es:"El espacio",          de:"Weltraum & Sterne"}},
  {id:"music",     emoji:"🎵", color:"#D4A8C4", labels:{en:"Music & Dance",   es:"Música y baile",      de:"Musik & Tanz"}},
  {id:"cooking",   emoji:"👨‍🍳", color:"#E8C4A0", labels:{en:"Cooking",         es:"Cocinar",             de:"Kochen"}},
  {id:"free",      emoji:"💬", color:"#DDB89E", labels:{en:"Free Chat",       es:"Conversación libre",  de:"Freies Gespräch"}},
];

const SKILL_LEVELS = [
  {id:"beginner",     emoji:"🌱", label:"Beginner",     cefr:"A1",    desc:"Starting from zero"},
  {id:"elementary",   emoji:"📗", label:"Elementary",   cefr:"A2",    desc:"Know some basics"},
  {id:"intermediate", emoji:"📘", label:"Intermediate", cefr:"B1–B2", desc:"Can hold a conversation"},
  {id:"advanced",     emoji:"📕", label:"Advanced",     cefr:"C1–C2", desc:"Near-fluent"},
];

// Hebrew alphabet (aleph-bet)
const HE_ALPHA = [
  {l:"א",n:"Aleph", r:"silent",      ex:"אבא",   xe:"father"},
  {l:"ב",n:"Bet",   r:"b / v",       ex:"בית",   xe:"house"},
  {l:"ג",n:"Gimel", r:"g",           ex:"גן",    xe:"garden"},
  {l:"ד",n:"Dalet", r:"d",           ex:"דלת",   xe:"door"},
  {l:"ה",n:"He",    r:"h",           ex:"הר",    xe:"mountain"},
  {l:"ו",n:"Vav",   r:"v / o / u",   ex:"ורד",   xe:"rose"},
  {l:"ז",n:"Zayin", r:"z",           ex:"זמן",   xe:"time"},
  {l:"ח",n:"Chet",  r:"ch (Bach)",   ex:"חלב",   xe:"milk"},
  {l:"ט",n:"Tet",   r:"t",           ex:"טוב",   xe:"good"},
  {l:"י",n:"Yod",   r:"y / i",       ex:"ים",    xe:"sea"},
  {l:"כ/ך",n:"Kaf", r:"k / kh",      ex:"כלב",   xe:"dog"},
  {l:"ל",n:"Lamed", r:"l",           ex:"לב",    xe:"heart"},
  {l:"מ/ם",n:"Mem", r:"m",           ex:"מים",   xe:"water"},
  {l:"נ/ן",n:"Nun", r:"n",           ex:"נהר",   xe:"river"},
  {l:"ס",n:"Samekh",r:"s",           ex:"ספר",   xe:"book"},
  {l:"ע",n:"Ayin",  r:"ʿ (guttural)",ex:"עין",   xe:"eye"},
  {l:"פ/ף",n:"Pe",  r:"p / f",       ex:"פרח",   xe:"flower"},
  {l:"צ/ץ",n:"Tsadi",r:"ts",         ex:"ציפור", xe:"bird"},
  {l:"ק",n:"Qof",   r:"k",           ex:"קפה",   xe:"coffee"},
  {l:"ר",n:"Resh",  r:"r",           ex:"ראש",   xe:"head"},
  {l:"ש",n:"Shin",  r:"sh / s",      ex:"שמש",   xe:"sun"},
  {l:"ת",n:"Tav",   r:"t",           ex:"תפוח",  xe:"apple"},
];

// Arabic alphabet (standalone forms, MSA)
const AR_ALPHA = [
  {l:"ا",n:"Alif",  r:"a / ā",          ex:"أب",    xe:"father"},
  {l:"ب",n:"Ba",    r:"b",               ex:"بيت",   xe:"house"},
  {l:"ت",n:"Ta",    r:"t",               ex:"تمر",   xe:"dates"},
  {l:"ث",n:"Tha",   r:"th (think)",      ex:"ثلاثة", xe:"three"},
  {l:"ج",n:"Jim",   r:"j",               ex:"جبل",   xe:"mountain"},
  {l:"ح",n:"Ha",    r:"ḥ (pharyngeal)",  ex:"حب",    xe:"love"},
  {l:"خ",n:"Kha",   r:"kh (Bach)",       ex:"خبز",   xe:"bread"},
  {l:"د",n:"Dal",   r:"d",               ex:"دار",   xe:"home"},
  {l:"ذ",n:"Dhal",  r:"dh (this)",       ex:"ذهب",   xe:"gold"},
  {l:"ر",n:"Ra",    r:"r",               ex:"رجل",   xe:"man"},
  {l:"ز",n:"Zay",   r:"z",               ex:"زمن",   xe:"time"},
  {l:"س",n:"Sin",   r:"s",               ex:"سمك",   xe:"fish"},
  {l:"ش",n:"Shin",  r:"sh",              ex:"شمس",   xe:"sun"},
  {l:"ص",n:"Sad",   r:"ṣ (emphatic s)",  ex:"صحة",   xe:"health"},
  {l:"ض",n:"Dad",   r:"ḍ (emphatic d)",  ex:"ضيف",   xe:"guest"},
  {l:"ط",n:"Ta",    r:"ṭ (emphatic t)",  ex:"طعام",  xe:"food"},
  {l:"ظ",n:"Dha",   r:"ẓ (emphatic dh)", ex:"ظرف",   xe:"envelope"},
  {l:"ع",n:"Ayn",   r:"ʿ (pharyngeal)",  ex:"عين",   xe:"eye"},
  {l:"غ",n:"Ghayn", r:"gh (French r)",   ex:"غرفة",  xe:"room"},
  {l:"ف",n:"Fa",    r:"f",               ex:"فم",    xe:"mouth"},
  {l:"ق",n:"Qaf",   r:"q (deep k)",      ex:"قلب",   xe:"heart"},
  {l:"ك",n:"Kaf",   r:"k",               ex:"كتاب",  xe:"book"},
  {l:"ل",n:"Lam",   r:"l",               ex:"لون",   xe:"colour"},
  {l:"م",n:"Mim",   r:"m",               ex:"ماء",   xe:"water"},
  {l:"ن",n:"Nun",   r:"n",               ex:"نار",   xe:"fire"},
  {l:"ه",n:"Ha",    r:"h",               ex:"هواء",  xe:"air"},
  {l:"و",n:"Waw",   r:"w / ū",           ex:"وقت",   xe:"time"},
  {l:"ي",n:"Ya",    r:"y / ī",           ex:"يد",    xe:"hand"},
];

// ── Russian (Cyrillic) alphabet ──────────────────────────────
const RU_ALPHA = [
  {l:"А а",n:"A",       r:"a (art)",        ex:"Аптека",  xe:"pharmacy"},
  {l:"Б б",n:"Be",      r:"b (boy)",        ex:"Банк",    xe:"bank"},
  {l:"В в",n:"Ve",      r:"v (vine)",       ex:"Вода",    xe:"water"},
  {l:"Г г",n:"Ge",      r:"g (good)",       ex:"Год",     xe:"year"},
  {l:"Д д",n:"De",      r:"d (door)",       ex:"Дом",     xe:"home"},
  {l:"Е е",n:"Ye",      r:"ye (yes)",       ex:"Еда",     xe:"food"},
  {l:"Ё ё",n:"Yo",      r:"yo (yonder)",    ex:"Ёж",      xe:"hedgehog"},
  {l:"Ж ж",n:"Zhe",     r:"zh (measure)",   ex:"Жизнь",   xe:"life"},
  {l:"З з",n:"Ze",      r:"z (zebra)",      ex:"Завтра",  xe:"tomorrow"},
  {l:"И и",n:"I",       r:"ee (feet)",      ex:"Имя",     xe:"name"},
  {l:"Й й",n:"Short I", r:"y (boy)",        ex:"Йогурт",  xe:"yogurt"},
  {l:"К к",n:"Ka",      r:"k (kite)",       ex:"Кофе",    xe:"coffee"},
  {l:"Л л",n:"El",      r:"l (love)",       ex:"Лес",     xe:"forest"},
  {l:"М м",n:"Em",      r:"m (mother)",     ex:"Мама",    xe:"mum"},
  {l:"Н н",n:"En",      r:"n (now)",        ex:"Нет",     xe:"no"},
  {l:"О о",n:"O",       r:"o (or)",         ex:"Окно",    xe:"window"},
  {l:"П п",n:"Pe",      r:"p (park)",       ex:"Привет",  xe:"hi"},
  {l:"Р р",n:"Er",      r:"r (rolled)",     ex:"Река",    xe:"river"},
  {l:"С с",n:"Es",      r:"s (sun)",        ex:"Спасибо", xe:"thank you"},
  {l:"Т т",n:"Te",      r:"t (top)",        ex:"Театр",   xe:"theatre"},
  {l:"У у",n:"U",       r:"oo (moon)",      ex:"Улица",   xe:"street"},
  {l:"Ф ф",n:"Ef",      r:"f (fire)",       ex:"Фото",    xe:"photo"},
  {l:"Х х",n:"Kha",     r:"kh (Bach)",      ex:"Хлеб",    xe:"bread"},
  {l:"Ц ц",n:"Tse",     r:"ts (cats)",      ex:"Центр",   xe:"centre"},
  {l:"Ч ч",n:"Che",     r:"ch (chair)",     ex:"Чай",     xe:"tea"},
  {l:"Ш ш",n:"Sha",     r:"sh (shoe)",      ex:"Школа",   xe:"school"},
  {l:"Щ щ",n:"Shcha",   r:"shch",           ex:"Щи",      xe:"cabbage soup"},
  {l:"Ъ ъ",n:"Hard sign",r:"(hardens prev)",ex:"Объект",  xe:"object"},
  {l:"Ы ы",n:"Yeru",    r:"deep ee",        ex:"Мы",      xe:"we"},
  {l:"Ь ь",n:"Soft sign",r:"(softens prev)",ex:"Соль",    xe:"salt"},
  {l:"Э э",n:"E",       r:"e (egg)",        ex:"Это",     xe:"this"},
  {l:"Ю ю",n:"Yu",      r:"yu (yule)",      ex:"Юг",      xe:"south"},
  {l:"Я я",n:"Ya",      r:"ya (yard)",      ex:"Язык",    xe:"language"},
];

// ── Hebrew structured lessons ──────────────────────────────
const HE_LESSONS = [
  {id:"he-l1",emoji:"✍️",title:"Letters א–ה",desc:"Your very first 5 Hebrew letters",items:[
    {s:"א",r:"Aleph",  e:"Silent consonant",          h:"Example: אבא (aba) — father"},
    {s:"ב",r:"Bet/Vet",e:"b (with dot) or v",         h:"Example: בית (bayit) — house"},
    {s:"ג",r:"Gimel",  e:"g as in 'game'",            h:"Example: גן (gan) — garden"},
    {s:"ד",r:"Dalet",  e:"d as in 'door'",            h:"Example: דלת (delet) — door"},
    {s:"ה",r:"He",     e:"h as in 'hello'",           h:"Example: הר (har) — mountain"},
  ]},
  {id:"he-l2",emoji:"✍️",title:"Letters ו–י",desc:"Five more essential letters",items:[
    {s:"ו",r:"Vav",    e:"v, or vowel o / u",         h:"Example: ורד (vered) — rose"},
    {s:"ז",r:"Zayin",  e:"z as in 'zebra'",           h:"Example: זמן (zman) — time"},
    {s:"ח",r:"Chet",   e:"ch — guttural (like Bach)", h:"Example: חלב (chalav) — milk"},
    {s:"ט",r:"Tet",    e:"t as in 'top'",             h:"Example: טוב (tov) — good"},
    {s:"י",r:"Yod",    e:"y, or vowel i",             h:"Example: ים (yam) — sea"},
  ]},
  {id:"he-l3",emoji:"✍️",title:"Letters כ–ס",desc:"Five more — you're halfway!",items:[
    {s:"כ / ך",r:"Kaf/Khaf",e:"k, or kh (guttural)",   h:"ך is the final form (end of word). Example: כלב (kelev) — dog"},
    {s:"ל",r:"Lamed",  e:"l as in 'love'",            h:"Example: לב (lev) — heart"},
    {s:"מ / ם",r:"Mem",e:"m as in 'mother'",          h:"ם is the final form. Example: מים (mayim) — water"},
    {s:"נ / ן",r:"Nun",e:"n as in 'now'",             h:"ן is the final form. Example: נהר (nahar) — river"},
    {s:"ס",r:"Samekh", e:"s as in 'sun'",             h:"Example: ספר (sefer) — book"},
  ]},
  {id:"he-l4",emoji:"✍️",title:"Letters ע–ת",desc:"Final seven — alphabet complete!",items:[
    {s:"ע",r:"Ayin",   e:"Guttural catch in the throat",h:"Example: עין (ayin) — eye"},
    {s:"פ / ף",r:"Pe/Fe",e:"p, or f",                 h:"ף is the final form. Example: פרח (perach) — flower"},
    {s:"צ / ץ",r:"Tsadi",e:"ts as in 'cats'",         h:"ץ is the final form. Example: ציפור (tsipor) — bird"},
    {s:"ק",r:"Qof",    e:"k (back of throat)",        h:"Example: קפה (kafe) — coffee"},
    {s:"ר",r:"Resh",   e:"r — rolled or French r",    h:"Example: ראש (rosh) — head"},
    {s:"ש",r:"Shin/Sin",e:"sh or s",                  h:"Example: שמש (shemesh) — sun"},
    {s:"ת",r:"Tav",    e:"t as in 'top'",             h:"Example: תפוח (tapuach) — apple"},
  ]},
  {id:"he-l5",emoji:"👋",title:"Greetings",desc:"Say hello and get by on day one",items:[
    {s:"שלום",       r:"Shalom",         e:"Hello / Goodbye / Peace",      h:"Works at any time of day"},
    {s:"בוקר טוב",   r:"Boker tov",      e:"Good morning",                 h:"Reply: בוקר אור (boker or)"},
    {s:"ערב טוב",    r:"Erev tov",       e:"Good evening"},
    {s:"לילה טוב",   r:"Layla tov",      e:"Good night"},
    {s:"תודה",       r:"Toda",           e:"Thank you",                    h:"More emphatic: תודה רבה (toda raba)"},
    {s:"בבקשה",      r:"Bevakasha",      e:"Please / You're welcome",      h:"Works in both directions"},
    {s:"כן / לא",    r:"Ken / Lo",       e:"Yes / No"},
    {s:"מה שלומך?",  r:"Ma shlomkha?",   e:"How are you? (to a man)",      h:"To a woman: מה שלומך (ma shlomech)"},
    {s:"בסדר",       r:"Beseder",        e:"OK / Fine / Alright",          h:"One of the most common Hebrew words"},
    {s:"סליחה",      r:"Slicha",         e:"Excuse me / Sorry"},
  ]},
  {id:"he-l6",emoji:"🔢",title:"Numbers 1–10",desc:"Count in Hebrew",items:[
    {s:"אחד",  r:"Echad",   e:"1"},{s:"שתיים",r:"Shtayim", e:"2"},{s:"שלוש",  r:"Shalosh",e:"3"},
    {s:"ארבע", r:"Arba",    e:"4"},{s:"חמש",   r:"Chamesh", e:"5"},{s:"שש",    r:"Shesh",  e:"6"},
    {s:"שבע",  r:"Sheva",   e:"7"},{s:"שמונה", r:"Shmoneh", e:"8"},{s:"תשע",   r:"Tesha",  e:"9"},
    {s:"עשר",  r:"Eser",    e:"10"},
  ]},
  {id:"he-l7",emoji:"💬",title:"Essential Phrases",desc:"Navigate real situations",items:[
    {s:"שמי...",            r:"Shmi...",               e:"My name is..."},
    {s:"אני מדבר אנגלית",   r:"Ani medaber anglit",    e:"I speak English",          h:"Woman says: מדברת (medaberet)"},
    {s:"אני לא מבין",       r:"Ani lo mevin",          e:"I don't understand",       h:"Woman says: מבינה (mevina)"},
    {s:"איפה...?",          r:"Eifo...?",              e:"Where is...?"},
    {s:"כמה זה עולה?",      r:"Kama ze ole?",          e:"How much does it cost?"},
    {s:"אני רוצה...",       r:"Ani rotse...",          e:"I want / I'd like...",     h:"Woman says: רוצה (rotsa)"},
    {s:"תדבר לאט, בבקשה",  r:"Tedaber le'at, bevakasha",e:"Please speak slowly"},
    {s:"אפשר לשלם בכרטיס?",r:"Efshar leshalem bekartis?",e:"Can I pay by card?"},
  ]},
  {id:"he-l8",emoji:"☕",title:"Café & Restaurant",desc:"Order with confidence",items:[
    {s:"קפה",    r:"Kafe",     e:"Coffee"},
    {s:"תה",     r:"Te",       e:"Tea"},
    {s:"מים",    r:"Mayim",    e:"Water"},
    {s:"לחם",    r:"Lechem",   e:"Bread"},
    {s:"חשבון",  r:"Cheshbon", e:"The bill / check"},
    {s:"מסעדה",  r:"Mis'ada",  e:"Restaurant"},
    {s:"אני רוצה להזמין", r:"Ani rotse lehazmin", e:"I'd like to order"},
    {s:"בתיאבון!", r:"Bete'avon!", e:"Enjoy your meal!",             h:"Literally: 'with appetite' — the Hebrew Bon appétit"},
  ]},
];

// ── Arabic structured lessons ────────────────────────────────
const AR_LESSONS = [
  {id:"ar-l1",emoji:"✍️",title:"Letters ا–ز",desc:"The first 11 letters of Arabic",items:[
    {s:"ا",r:"Alif",  e:"a / ā — long 'a'",           h:"Example: أب (ab) — father"},
    {s:"ب",r:"Ba",    e:"b as in 'boat'",              h:"Example: بيت (bayt) — house"},
    {s:"ت",r:"Ta",    e:"t as in 'top'",               h:"Example: تمر (tamr) — dates"},
    {s:"ث",r:"Tha",   e:"th as in 'think'",            h:"Example: ثلاثة (thalatha) — three"},
    {s:"ج",r:"Jim",   e:"j as in 'jam'",               h:"Example: جبل (jabal) — mountain"},
    {s:"ح",r:"Ha",    e:"ḥ — breathy, pharyngeal h",   h:"Example: حب (hubb) — love"},
    {s:"خ",r:"Kha",   e:"kh — guttural (like Bach)",   h:"Example: خبز (khubz) — bread"},
    {s:"د",r:"Dal",   e:"d as in 'door'",              h:"Example: دار (dar) — home"},
    {s:"ذ",r:"Dhal",  e:"dh as in 'this'",             h:"Example: ذهب (dhahab) — gold"},
    {s:"ر",r:"Ra",    e:"r — rolled",                  h:"Example: رجل (rajul) — man"},
    {s:"ز",r:"Zay",   e:"z as in 'zebra'",             h:"Example: زمن (zaman) — time"},
  ]},
  {id:"ar-l2",emoji:"✍️",title:"Letters س–ي",desc:"Complete the alphabet — 17 letters!",items:[
    {s:"س",r:"Sin",   e:"s as in 'sun'",               h:"Example: سمك (samak) — fish"},
    {s:"ش",r:"Shin",  e:"sh as in 'shoe'",             h:"Example: شمس (shams) — sun"},
    {s:"ص",r:"Sad",   e:"ṣ — emphatic s",              h:"Example: صحة (sihha) — health"},
    {s:"ض",r:"Dad",   e:"ḍ — emphatic d",              h:"Example: ضيف (dayf) — guest"},
    {s:"ط",r:"Ta",    e:"ṭ — emphatic t",              h:"Example: طعام (ta'am) — food"},
    {s:"ظ",r:"Dha",   e:"ẓ — emphatic dh",             h:"Example: ظرف (zarf) — envelope"},
    {s:"ع",r:"Ayn",   e:"ʿ — unique pharyngeal sound", h:"Example: عين (ayn) — eye  ·  Practise this one — it's key!"},
    {s:"غ",r:"Ghayn", e:"gh — like a French r",        h:"Example: غرفة (ghurfa) — room"},
    {s:"ف",r:"Fa",    e:"f as in 'fire'",              h:"Example: فم (fam) — mouth"},
    {s:"ق",r:"Qaf",   e:"q — deep back-of-throat k",   h:"Example: قلب (qalb) — heart"},
    {s:"ك",r:"Kaf",   e:"k as in 'kite'",              h:"Example: كتاب (kitab) — book"},
    {s:"ل",r:"Lam",   e:"l as in 'love'",              h:"Example: لون (lawn) — colour"},
    {s:"م",r:"Mim",   e:"m as in 'mother'",            h:"Example: ماء (ma') — water"},
    {s:"ن",r:"Nun",   e:"n as in 'now'",               h:"Example: نار (nar) — fire"},
    {s:"ه",r:"Ha",    e:"h as in 'house'",             h:"Example: هواء (hawa') — air"},
    {s:"و",r:"Waw",   e:"w, or long vowel ū",          h:"Example: وقت (waqt) — time"},
    {s:"ي",r:"Ya",    e:"y, or long vowel ī",          h:"Example: يد (yad) — hand"},
  ]},
  {id:"ar-l3",emoji:"👋",title:"Greetings",desc:"Essential day-one phrases",items:[
    {s:"مرحبا",          r:"Marhaban",             e:"Hello",                      h:"Friendly, everyday greeting"},
    {s:"السلام عليكم",   r:"As-salāmu ʿalaykum",   e:"Peace be upon you",          h:"Reply: وعليكم السلام (wa alaykum as-salam)"},
    {s:"صباح الخير",     r:"Sabāḥ al-khayr",       e:"Good morning",               h:"Reply: صباح النور (sabah an-nur) — morning of light"},
    {s:"مساء الخير",     r:"Masā' al-khayr",       e:"Good evening",               h:"Reply: مساء النور (masa' an-nur)"},
    {s:"شكراً",          r:"Shukran",              e:"Thank you",                  h:"More warmth: شكراً جزيلاً (shukran jazilan) — many thanks"},
    {s:"من فضلك",        r:"Min faḍlak",            e:"Please (to a man)",          h:"To a woman: من فضلك (min fadlik)"},
    {s:"نعم / لا",       r:"Na'am / Lā",            e:"Yes / No"},
    {s:"كيف حالك؟",      r:"Kayfa ḥālak?",          e:"How are you?",               h:"Reply: بخير، شكراً (bikhair, shukran) — fine, thanks"},
    {s:"عفواً",          r:"ʿAfwan",               e:"Excuse me / You're welcome", h:"Works in both situations"},
    {s:"مع السلامة",     r:"Maʿ as-salāma",         e:"Goodbye",                   h:"Literally: 'go with safety'"},
  ]},
  {id:"ar-l4",emoji:"🔢",title:"Numbers 1–10",desc:"Count in Arabic",items:[
    {s:"واحد",  r:"Wāḥid",    e:"1"},{s:"اثنان", r:"Ithnān",   e:"2"},{s:"ثلاثة", r:"Thalātha",e:"3"},
    {s:"أربعة", r:"Arbaʿa",   e:"4"},{s:"خمسة",  r:"Khamsa",   e:"5"},{s:"ستة",   r:"Sitta",   e:"6"},
    {s:"سبعة",  r:"Sabʿa",    e:"7"},{s:"ثمانية",r:"Thamāniya",e:"8"},{s:"تسعة",  r:"Tisʿa",   e:"9"},
    {s:"عشرة",  r:"ʿAshara",  e:"10"},
  ]},
  {id:"ar-l5",emoji:"💬",title:"Essential Phrases",desc:"Navigate real situations",items:[
    {s:"اسمي...",               r:"Ismī...",                  e:"My name is..."},
    {s:"أنا من...",             r:"Ana min...",               e:"I am from..."},
    {s:"لا أتكلم العربية جيداً",r:"La atakallam al-arabiyya jayidan",e:"I don't speak Arabic well"},
    {s:"هل تتكلم الإنجليزية?",  r:"Hal tatakallam al-ingleeziyya?",e:"Do you speak English?"},
    {s:"لا أفهم",              r:"La afham",                 e:"I don't understand"},
    {s:"أين...?",              r:"Ayna...?",                 e:"Where is...?"},
    {s:"كم الثمن?",             r:"Kam ath-thaman?",          e:"How much is it?"},
    {s:"تكلم ببطء، من فضلك",   r:"Takallam bibutʾ, min fadlak",e:"Please speak slowly"},
  ]},
  {id:"ar-l6",emoji:"☕",title:"Café & Restaurant",desc:"Order confidently anywhere",items:[
    {s:"قهوة",  r:"Qahwa",    e:"Coffee",                    h:"Arabic coffee is often spiced with cardamom"},
    {s:"شاي",   r:"Shāy",     e:"Tea",                       h:"Tea is central to Arab hospitality"},
    {s:"ماء",   r:"Māʾ",      e:"Water"},
    {s:"خبز",   r:"Khubz",    e:"Bread"},
    {s:"الحساب",r:"Al-ḥisāb", e:"The bill"},
    {s:"مطعم",  r:"Maṭʿam",   e:"Restaurant"},
    {s:"أريد...",r:"Urīd...", e:"I want...",                 h:"Polite alternative: أحب (uhibb) — I'd like..."},
    {s:"بالهناء والشفاء", r:"Bil-hanā' wash-shifā'", e:"Enjoy your meal!",h:"Literally: 'with joy and health' — the Arabic Bon appétit"},
  ]},
];

// ── Russian structured lessons ───────────────────────────────
const RU_LESSONS = [
  {id:"ru-l1",emoji:"✍️",title:"Letters А–З",desc:"9 letters, many look familiar!",items:[
    {s:"А а",r:"A",    e:"a as in 'art'",          h:"Example: Аптека (Apteka) — pharmacy"},
    {s:"Б б",r:"Be",   e:"b as in 'boy'",          h:"Example: Банк (Bank) — bank"},
    {s:"В в",r:"Ve",   e:"v as in 'vine'",         h:"Example: Вода (Voda) — water"},
    {s:"Г г",r:"Ge",   e:"g as in 'good'",         h:"Example: Город (Gorod) — city"},
    {s:"Д д",r:"De",   e:"d as in 'door'",         h:"Example: Дом (Dom) — home"},
    {s:"Е е",r:"Ye",   e:"ye as in 'yes'",         h:"Example: Еда (Yeda) — food"},
    {s:"Ё ё",r:"Yo",   e:"yo as in 'yonder'",      h:"Example: Ёж (Yozh) — hedgehog  ·  Always stressed"},
    {s:"Ж ж",r:"Zhe",  e:"zh — like 's' in 'measure'",h:"Example: Жизнь (Zhizn') — life"},
    {s:"З з",r:"Ze",   e:"z as in 'zebra'",        h:"Example: Завтра (Zavtra) — tomorrow"},
  ]},
  {id:"ru-l2",emoji:"✍️",title:"Letters И–П",desc:"Includes some sneaky false friends",items:[
    {s:"И и",r:"I",    e:"ee as in 'feet'",        h:"Example: Имя (Imya) — name"},
    {s:"Й й",r:"Kratkoye",e:"short y as in 'boy'", h:"Example: Йогурт (Yogurt) — yogurt"},
    {s:"К к",r:"Ka",   e:"k as in 'kite'",         h:"Example: Кофе (Kofe) — coffee"},
    {s:"Л л",r:"El",   e:"l as in 'love'",         h:"Example: Лес (Les) — forest"},
    {s:"М м",r:"Em",   e:"m as in 'mother'",       h:"Example: Метро (Metro) — metro"},
    {s:"Н н",r:"En",   e:"n as in 'now'",          h:"Example: Нет (Net) — no  ·  Н looks like H but sounds N!"},
    {s:"О о",r:"O",    e:"o as in 'or'",           h:"Example: Окно (Okno) — window"},
    {s:"П п",r:"Pe",   e:"p as in 'park'",         h:"Example: Привет (Privet) — hello  ·  П looks like Π"},
  ]},
  {id:"ru-l3",emoji:"✍️",title:"Letters Р–Ш",desc:"More false friends and new sounds",items:[
    {s:"Р р",r:"Er",   e:"r — rolled (like Spanish r)",h:"Example: Река (Reka) — river  ·  Р looks like P but sounds R!"},
    {s:"С с",r:"Es",   e:"s as in 'sun'",          h:"Example: Спасибо (Spasibo) — thank you  ·  С looks like C"},
    {s:"Т т",r:"Te",   e:"t as in 'top'",          h:"Example: Театр (Teatr) — theatre"},
    {s:"У у",r:"U",    e:"oo as in 'moon'",        h:"Example: Улица (Ulitsa) — street"},
    {s:"Ф ф",r:"Ef",   e:"f as in 'fire'",         h:"Example: Фото (Foto) — photo"},
    {s:"Х х",r:"Kha",  e:"kh — guttural (Bach)",   h:"Example: Хлеб (Khleb) — bread"},
    {s:"Ц ц",r:"Tse",  e:"ts as in 'cats'",        h:"Example: Центр (Tsentr) — centre"},
    {s:"Ч ч",r:"Che",  e:"ch as in 'chair'",       h:"Example: Чай (Chay) — tea"},
    {s:"Ш ш",r:"Sha",  e:"sh as in 'shoe'",        h:"Example: Школа (Shkola) — school"},
  ]},
  {id:"ru-l4",emoji:"✍️",title:"Letters Щ–Я",desc:"The final 7 — alphabet complete!",items:[
    {s:"Щ щ",r:"Shcha",e:"shch — a long soft sh",  h:"Example: Щи (Shchi) — cabbage soup"},
    {s:"Ъ ъ",r:"Hard sign",e:"No sound — hardens the consonant before it",h:"Example: Объект (Ob'yekt) — object"},
    {s:"Ы ы",r:"Yeru", e:"Deep ee — no English equivalent",h:"Example: Мы (My) — we  ·  Like ee but with jaw lower"},
    {s:"Ь ь",r:"Soft sign",e:"No sound — softens the consonant before it",h:"Example: Соль (Sol') — salt"},
    {s:"Э э",r:"E",    e:"e as in 'egg'",          h:"Example: Это (Eto) — this / that"},
    {s:"Ю ю",r:"Yu",   e:"yu as in 'yule'",        h:"Example: Юг (Yug) — south"},
    {s:"Я я",r:"Ya",   e:"ya as in 'yard'",        h:"Example: Язык (Yazyk) — language"},
  ]},
  {id:"ru-l5",emoji:"👋",title:"Greetings",desc:"Say hello and get by on day one",items:[
    {s:"Привет",            r:"Privet",           e:"Hi / Hello (informal)"},
    {s:"Здравствуйте",      r:"Zdravstvuyte",     e:"Hello (formal)",            h:"Use with strangers and older people"},
    {s:"Доброе утро",       r:"Dobroye utro",     e:"Good morning"},
    {s:"Добрый день",       r:"Dobryy den'",      e:"Good afternoon"},
    {s:"Добрый вечер",      r:"Dobryy vecher",    e:"Good evening"},
    {s:"Спасибо",           r:"Spasibo",          e:"Thank you",                 h:"Very warm thanks: Большое спасибо (Bol'shoye spasibo)"},
    {s:"Пожалуйста",        r:"Pozhaluysta",      e:"Please / You're welcome",   h:"Works in both directions"},
    {s:"Да / Нет",          r:"Da / Net",          e:"Yes / No"},
    {s:"Как дела?",         r:"Kak dela?",        e:"How are you?",             h:"Informal. Formal: Как вы? (Kak vy?)"},
    {s:"Хорошо",            r:"Khorosho",         e:"Good / Fine / OK",         h:"One of the most useful Russian words"},
  ]},
  {id:"ru-l6",emoji:"🔢",title:"Numbers 1–10",desc:"Count in Russian",items:[
    {s:"Один",    r:"Odin",     e:"1"},{s:"Два",      r:"Dva",      e:"2"},{s:"Три",     r:"Tri",     e:"3"},
    {s:"Четыре",  r:"Chetyre",  e:"4"},{s:"Пять",     r:"Pyat'",    e:"5"},{s:"Шесть",   r:"Shest'",  e:"6"},
    {s:"Семь",    r:"Sem'",     e:"7"},{s:"Восемь",   r:"Vosem'",   e:"8"},{s:"Девять",  r:"Devyat'", e:"9"},
    {s:"Десять",  r:"Desyat'",  e:"10"},
  ]},
  {id:"ru-l7",emoji:"💬",title:"Essential Phrases",desc:"Navigate real situations",items:[
    {s:"Меня зовут...",              r:"Menya zovut...",           e:"My name is..."},
    {s:"Я говорю по-английски",      r:"Ya govoryu po-angliyski",  e:"I speak English"},
    {s:"Я не понимаю",               r:"Ya ne ponimayu",           e:"I don't understand"},
    {s:"Где...?",                    r:"Gde...?",                  e:"Where is...?"},
    {s:"Сколько стоит?",             r:"Skol'ko stoit?",           e:"How much does it cost?"},
    {s:"Я хочу...",                  r:"Ya khochu...",             e:"I want / I'd like..."},
    {s:"Говорите медленнее, пожалуйста",r:"Govoritye medlenneye, pozhaluysta",e:"Please speak more slowly"},
    {s:"Можно платить картой?",       r:"Mozhno platit' kartoy?",  e:"Can I pay by card?"},
  ]},
  {id:"ru-l8",emoji:"☕",title:"Café & Restaurant",desc:"Order with confidence",items:[
    {s:"Кофе",         r:"Kofe",          e:"Coffee"},
    {s:"Чай",          r:"Chay",          e:"Tea",                  h:"Russians are famous tea drinkers"},
    {s:"Вода",         r:"Voda",          e:"Water"},
    {s:"Хлеб",         r:"Khleb",         e:"Bread"},
    {s:"Счёт",         r:"Schyot",        e:"The bill"},
    {s:"Ресторан",     r:"Restoran",      e:"Restaurant"},
    {s:"Я хочу заказать...",r:"Ya khochu zakazat'...",e:"I'd like to order..."},
    {s:"Приятного аппетита!",r:"Priyatnogo appetita!",e:"Enjoy your meal!"},
  ]},
];

const IDIOM_CATS = ["Business","Travel","Emotions","Nature","Pop Culture"];
const LEVEL_THRESHOLDS = [0,50,150,300,500,750,1050,1400,1800,2250,2750,3300,3900,4550,5250];
const LEVEL_NAMES = [
  "Newcomer","Wanderer","Explorer","Adventurer","Conversationalist",
  "Storyteller","Connector","Navigator","Linguist","Polyglot",
  "Scholar","Maestro","Expert","Master","Legend",
];

/* ─────────────────────────────────────────────────────────────
   DEFAULT VOCABULARY SET  (seeded once on first launch)
───────────────────────────────────────────────────────────── */
const DEFAULT_VSET_ID = "lingua_default_en_de_v2";
const DEFAULT_VSET = {
  id: DEFAULT_VSET_ID,
  name: "English Essentials 🇬🇧",
  created: "2026-01-01T00:00:00.000Z",
  words: [
    // ── Original 50 ──────────────────────────────────────────────────────────
    {word:"adventure",      transl:"Abenteuer"},         {word:"arrive",        transl:"ankommen"},
    {word:"believe",        transl:"glauben"},            {word:"borrow",        transl:"ausleihen"},
    {word:"brave",          transl:"mutig"},              {word:"careful",       transl:"vorsichtig"},
    {word:"clever",         transl:"schlau"},             {word:"collect",       transl:"sammeln"},
    {word:"comfortable",    transl:"bequem"},             {word:"compare",       transl:"vergleichen"},
    {word:"complete",       transl:"vollständig"},        {word:"decide",        transl:"entscheiden"},
    {word:"describe",       transl:"beschreiben"},        {word:"difficult",     transl:"schwierig"},
    {word:"discover",       transl:"entdecken"},          {word:"empty",         transl:"leer"},
    {word:"explain",        transl:"erklären"},           {word:"famous",        transl:"berühmt"},
    {word:"favorite",       transl:"Lieblings-"},         {word:"friendly",      transl:"freundlich"},
    {word:"healthy",        transl:"gesund"},             {word:"imagine",       transl:"sich vorstellen"},
    {word:"improve",        transl:"verbessern"},         {word:"include",       transl:"beinhalten"},
    {word:"important",      transl:"wichtig"},            {word:"interesting",   transl:"interessant"},
    {word:"journey",        transl:"Reise"},              {word:"language",      transl:"Sprache"},
    {word:"library",        transl:"Bibliothek"},         {word:"mistake",       transl:"Fehler"},
    {word:"nervous",        transl:"nervös"},             {word:"opinion",       transl:"Meinung"},
    {word:"polite",         transl:"höflich"},            {word:"practice",      transl:"üben"},
    {word:"promise",        transl:"versprechen"},        {word:"question",      transl:"Frage"},
    {word:"remember",       transl:"erinnern"},           {word:"repair",        transl:"reparieren"},
    {word:"safe",           transl:"sicher"},             {word:"strange",       transl:"seltsam"},
    {word:"suddenly",       transl:"plötzlich"},          {word:"surprise",      transl:"Überraschung"},
    {word:"travel",         transl:"reisen"},             {word:"understand",    transl:"verstehen"},
    {word:"useful",         transl:"nützlich"},           {word:"village",       transl:"Dorf"},
    {word:"weather",        transl:"Wetter"},             {word:"whisper",       transl:"flüstern"},
    {word:"wonderful",      transl:"wunderbar"},          {word:"yesterday",     transl:"gestern"},

    // ── 17 shopping / everyday words (user) ──────────────────────────────────
    {word:"have to buy",    transl:"ich muss … kaufen"},
    {word:"list",           transl:"die Liste"},
    {word:"biscuit",        transl:"der Keks, das Plätzchen"},
    {word:"sweet",          transl:"die Süßigkeit"},
    {word:"excited",        transl:"aufgeregt, gespannt"},
    {word:"fruit",          transl:"das Obst / die Frucht"},
    {word:"grape",          transl:"die Weintraube"},
    {word:"a few",          transl:"ein paar, einige"},
    {word:"fizzy",          transl:"sprudelnd"},
    {word:"much",           transl:"viel"},
    {word:"juice",          transl:"der Saft"},
    {word:"orange",         transl:"die Orange, die Apfelsine"},
    {word:"enough",         transl:"genug"},
    {word:"money",          transl:"das Geld"},
    {word:"of course",      transl:"natürlich, selbstverständlich"},
    {word:"forget",         transl:"vergessen"},
    {word:"trolley",        transl:"der Einkaufswagen"},

    // ── 100 5th-grade essentials ─────────────────────────────────────────────
    // Food & meals
    {word:"breakfast",      transl:"das Frühstück"},       {word:"lunch",         transl:"das Mittagessen"},
    {word:"dinner",         transl:"das Abendessen"},      {word:"vegetable",     transl:"das Gemüse"},
    {word:"chicken",        transl:"das Hähnchen"},        {word:"bread",         transl:"das Brot"},
    {word:"butter",         transl:"die Butter"},          {word:"cheese",        transl:"der Käse"},
    {word:"milk",           transl:"die Milch"},           {word:"sugar",         transl:"der Zucker"},
    {word:"salt",           transl:"das Salz"},            {word:"pepper",        transl:"der Pfeffer"},
    {word:"tea",            transl:"der Tee"},             {word:"coffee",        transl:"der Kaffee"},
    {word:"water",          transl:"das Wasser"},

    // School & learning
    {word:"lesson",         transl:"die Stunde, der Unterricht"},
    {word:"homework",       transl:"die Hausaufgabe(n)"},
    {word:"subject",        transl:"das Fach"},
    {word:"science",        transl:"die Naturwissenschaft"},
    {word:"history",        transl:"die Geschichte"},
    {word:"geography",      transl:"die Erdkunde"},
    {word:"art",            transl:"die Kunst"},
    {word:"music",          transl:"die Musik"},
    {word:"sport",          transl:"der Sport"},
    {word:"dictionary",     transl:"das Wörterbuch"},
    {word:"sentence",       transl:"der Satz"},
    {word:"paragraph",      transl:"der Absatz"},
    {word:"chapter",        transl:"das Kapitel"},
    {word:"notebook",       transl:"das Heft"},
    {word:"pencil",         transl:"der Bleistift"},

    // Feelings & character
    {word:"angry",          transl:"wütend, böse"},        {word:"sad",           transl:"traurig"},
    {word:"happy",          transl:"glücklich"},           {word:"tired",         transl:"müde"},
    {word:"bored",          transl:"gelangweilt"},         {word:"proud",         transl:"stolz"},
    {word:"worried",        transl:"besorgt"},             {word:"lonely",        transl:"einsam"},
    {word:"shy",            transl:"schüchtern"},          {word:"kind",          transl:"nett, freundlich"},
    {word:"honest",         transl:"ehrlich"},             {word:"patient",       transl:"geduldig"},
    {word:"lazy",           transl:"faul"},                {word:"hard-working",  transl:"fleißig"},
    {word:"generous",       transl:"großzügig"},

    // Time & routine
    {word:"morning",        transl:"der Morgen"},          {word:"afternoon",     transl:"der Nachmittag"},
    {word:"evening",        transl:"der Abend"},           {word:"midnight",      transl:"die Mitternacht"},
    {word:"weekend",        transl:"das Wochenende"},      {word:"holiday",       transl:"der Feiertag, der Urlaub"},
    {word:"birthday",       transl:"der Geburtstag"},      {word:"season",        transl:"die Jahreszeit"},
    {word:"spring",         transl:"der Frühling"},        {word:"autumn",        transl:"der Herbst"},

    // Nature & environment
    {word:"forest",         transl:"der Wald"},            {word:"mountain",      transl:"der Berg"},
    {word:"river",          transl:"der Fluss"},           {word:"ocean",         transl:"der Ozean, das Meer"},
    {word:"island",         transl:"die Insel"},           {word:"cloud",         transl:"die Wolke"},
    {word:"storm",          transl:"der Sturm"},           {word:"rain",          transl:"der Regen"},
    {word:"snow",           transl:"der Schnee"},          {word:"flower",        transl:"die Blume"},
    {word:"tree",           transl:"der Baum"},            {word:"grass",         transl:"das Gras"},
    {word:"animal",         transl:"das Tier"},            {word:"bird",          transl:"der Vogel"},
    {word:"fish",           transl:"der Fisch"},

    // Body & health
    {word:"headache",       transl:"die Kopfschmerzen"},
    {word:"stomachache",    transl:"die Bauchschmerzen"},
    {word:"medicine",       transl:"das Medikament, die Medizin"},
    {word:"hospital",       transl:"das Krankenhaus"},
    {word:"doctor",         transl:"der Arzt, die Ärztin"},
    {word:"tooth",          transl:"der Zahn"},
    {word:"heart",          transl:"das Herz"},
    {word:"shoulder",       transl:"die Schulter"},
    {word:"knee",           transl:"das Knie"},
    {word:"elbow",          transl:"der Ellenbogen"},

    // Home & daily life
    {word:"kitchen",        transl:"die Küche"},           {word:"bedroom",       transl:"das Schlafzimmer"},
    {word:"bathroom",       transl:"das Badezimmer"},      {word:"garden",        transl:"der Garten"},
    {word:"stairs",         transl:"die Treppe"},          {word:"window",        transl:"das Fenster"},
    {word:"door",           transl:"die Tür"},             {word:"floor",         transl:"der Boden, das Stockwerk"},
    {word:"ceiling",        transl:"die Decke"},           {word:"wall",          transl:"die Wand"},

    // Social & communication
    {word:"neighbour",      transl:"der Nachbar, die Nachbarin"},
    {word:"message",        transl:"die Nachricht"},
    {word:"telephone",      transl:"das Telefon"},
    {word:"address",        transl:"die Adresse"},
    {word:"invite",         transl:"einladen"},
    {word:"meeting",        transl:"das Treffen, die Besprechung"},

    // Common verbs
    {word:"carry",          transl:"tragen"},              {word:"drop",          transl:"fallen lassen"},
    {word:"catch",          transl:"fangen"},              {word:"throw",         transl:"werfen"},
    {word:"push",           transl:"schieben, drücken"},   {word:"pull",          transl:"ziehen"},
    {word:"share",          transl:"teilen"},              {word:"choose",        transl:"wählen, auswählen"},
    {word:"allow",          transl:"erlauben"},            {word:"suggest",       transl:"vorschlagen"},
    {word:"spend",          transl:"ausgeben, verbringen"},{word:"check",         transl:"überprüfen"},
    {word:"follow",         transl:"folgen"},              {word:"miss",          transl:"vermissen, verpassen"},
    {word:"pretend",        transl:"so tun als ob"},
  ],
};

/* ─────────────────────────────────────────────────────────────
   STORAGE KEYS
───────────────────────────────────────────────────────────── */
const SK_NB     = "lingua_notebook";
const SK_KIDNB  = "lingua_kidnb";
const SK_STARS  = "lingua_stars";
const SK_ERRS   = "lingua_errors";
const SK_WOD    = "lingua_wod";
const SK_IDIOM  = "lingua_idiom";
const SK_VSETS  = "lingua_vsets";
const SK_SKILL  = code => `lingua_skill_${code}`;
const SK_SESS   = code => `lingua_sessions_${code}`;
const loadSkill    = code      => loadLS(SK_SKILL(code), "beginner");
const saveSkill    = (code,lv) => saveLS(SK_SKILL(code), lv);
const loadSessions = code      => loadLS(SK_SESS(code), 0);
const saveSessions = (code,n)  => saveLS(SK_SESS(code), n);
const SK_UILNG  = "lingua_uilang";
const SK_KIDLG  = "lingua_kidlang";
const SK_NATLNG = "lingua_native_lang";
const SK_WEXP   = "lingua_word_exp";   // word exposure counts
const SK_REFL   = "lingua_reflections"; // metacognitive reflections

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

/* Word exposure tracking — ~7 exposures to stick */
function trackWordExposure(word) {
  if (!word) return 0;
  const key = word.toLowerCase().trim();
  const exp = loadLS(SK_WEXP, {});
  exp[key] = (exp[key] || 0) + 1;
  saveLS(SK_WEXP, exp);
  return exp[key];
}
function getWordExposure(word) {
  if (!word) return 0;
  return loadLS(SK_WEXP, {})[word.toLowerCase().trim()] || 0;
}
// Scan an AI response for any known vocab-set words and bump their counts
function trackExposuresInText(text) {
  if (!text) return;
  const lower = text.toLowerCase();
  loadVSets().forEach(s => s.words.forEach(w => {
    if (w.word && w.word.length > 2 && lower.includes(w.word.toLowerCase())) {
      trackWordExposure(w.word);
    }
  }));
}

/* Metacognitive reflections */
function saveReflection(text) {
  const r = loadLS(SK_REFL, []);
  r.unshift({ text, date: new Date().toISOString() });
  saveLS(SK_REFL, r.slice(0, 50));
}

/* ─────────────────────────────────────────────────────────────
   DEFAULT VOCABULARY SET 2  (food, shopping & classroom)
───────────────────────────────────────────────────────────── */
const DEFAULT_VSET2_ID = "lingua_default_en_de_2_v1";
const DEFAULT_VSET2 = {
  id: DEFAULT_VSET2_ID,
  name: "Food, Shopping & Classroom 🛒",
  created: "2026-01-01T00:00:00.000Z",
  words: [
    // ── Greetings & communication ────────────────────────────────────────────
    {word:"(to) greet sb.",          transl:"jn. begrüßen"},
    {word:"(to) comment on sth.",    transl:"sich äußern über/zu etwas; einen Kommentar abgeben"},
    {word:"version",                 transl:"die Version, die Fassung"},
    {word:"same",                    transl:"gleich"},
    {word:"(to) prepare for sth.",   transl:"sich auf etwas vorbereiten"},
    // ── Shopping & everyday ──────────────────────────────────────────────────
    {word:"cake",                    transl:"der Kuchen"},
    {word:"Would you like …?",       transl:"Möchtest du …?"},
    {word:"I'd like …",              transl:"Ich möchte …"},
    {word:"I have to buy …",         transl:"ich muss … kaufen"},
    {word:"list",                    transl:"die Liste"},
    {word:"biscuit",                 transl:"der Keks, das Plätzchen"},
    {word:"sweet",                   transl:"die Süßigkeit"},
    {word:"excited",                 transl:"aufgeregt, gespannt"},
    {word:"fruit",                   transl:"das Obst, die Frucht"},
    {word:"grape",                   transl:"die (Wein-)Traube"},
    {word:"a few",                   transl:"ein paar, einige"},
    {word:"fizzy",                   transl:"sprudelnd"},
    {word:"much",                    transl:"viel"},
    {word:"juice",                   transl:"der Saft"},
    {word:"orange",                  transl:"die Orange, die Apfelsine"},
    {word:"enough",                  transl:"genug"},
    {word:"money",                   transl:"das Geld"},
    {word:"of course",               transl:"natürlich, selbstverständlich"},
    {word:"(to) forget",             transl:"vergessen"},
    {word:"trolley",                 transl:"der Einkaufswagen"},
    {word:"not … yet",               transl:"noch nicht"},
    {word:"crisps",                  transl:"Kartoffelchips"},
    // ── Animals & actions ────────────────────────────────────────────────────
    {word:"monkey",                  transl:"der Affe"},
    {word:"(to) pick sth. up",       transl:"etwas aufheben, hochheben"},
    {word:"(to) choose",             transl:"aussuchen, auswählen"},
    {word:"tear",                    transl:"die Träne"},
    {word:"(to) arrive",             transl:"ankommen, eintreffen"},
    {word:"(to) point to sth.",      transl:"auf etwas zeigen, deuten"},
    {word:"large",                   transl:"groß"},
    {word:"heavy",                   transl:"schwer"},
    {word:"(to) call",               transl:"rufen; anrufen; nennen"},
    {word:"plate",                   transl:"der Teller"},
    {word:"round",                   transl:"rund"},
    // ── Baking & cooking ─────────────────────────────────────────────────────
    {word:"(to) bake",               transl:"backen"},
    {word:"(to) begin",              transl:"beginnen, anfangen"},
    {word:"rainbow",                 transl:"der Regenbogen"},
    {word:"recipe",                  transl:"das Rezept"},
    {word:"ingredient",              transl:"die Zutat"},
    {word:"instruction",             transl:"die Anweisung"},
    {word:"gram (g)",                transl:"das Gramm"},
    {word:"butter",                  transl:"die Butter"},
    {word:"sugar",                   transl:"der Zucker"},
    {word:"egg",                     transl:"das Ei"},
    {word:"flour",                   transl:"das Mehl"},
    {word:"chocolate",               transl:"die Schokolade"},
    {word:"bean",                    transl:"die Bohne"},
    {word:"bread",                   transl:"das Brot"},
    {word:"salt",                    transl:"das Salz"},
    {word:"pepper",                  transl:"der Pfeffer"},
    {word:"jar",                     transl:"das Einmachglas"},
    // ── Fruit & vegetables ───────────────────────────────────────────────────
    {word:"pear",                    transl:"die Birne"},
    {word:"kiwi",                    transl:"die Kiwi"},
    {word:"pineapple",               transl:"die Ananas"},
    {word:"strawberry",              transl:"die Erdbeere"},
    {word:"vegetables",              transl:"das Gemüse"},
    {word:"lettuce",                 transl:"der Kopfsalat"},
    {word:"tomato",                  transl:"die Tomate"},
    {word:"carrot",                  transl:"die Karotte"},
    {word:"cheese",                  transl:"der Käse"},
    // ── Cooking verbs & kitchen ──────────────────────────────────────────────
    {word:"(to) add",                transl:"hinzufügen, ergänzen"},
    {word:"(to) beat",               transl:"schlagen"},
    {word:"until",                   transl:"bis"},
    {word:"fridge",                  transl:"der Kühlschrank"},
    {word:"oven",                    transl:"der Ofen"},
    {word:"(to) cut",                transl:"schneiden"},
    {word:"a piece of …",            transl:"ein Stück …"},
    // ── Classroom & learning ─────────────────────────────────────────────────
    {word:"row",                     transl:"die Reihe"},
    {word:"(to) structure",          transl:"strukturieren, gliedern"},
    {word:"in other ways",           transl:"auf andere Art und Weise"},
    {word:"(to) collect",            transl:"sammeln"},
    {word:"(to) mark",               transl:"markieren"},
    {word:"meal",                    transl:"die Mahlzeit, das Essen"},
    {word:"quantity",                transl:"die Quantität, die Menge"},
    {word:"(to) remember sth.",      transl:"an etwas denken; sich erinnern"},
    {word:"plan",                    transl:"der Plan"},
    {word:"meaning",                 transl:"die Bedeutung"},
    {word:"(to) mean",               transl:"bedeuten"},
    {word:"(to) compare",            transl:"vergleichen"},
    {word:"mediation",               transl:"die Sprachmittlung, die Mediation"},
    {word:"(to) take notes",         transl:"sich Notizen machen"},
    {word:"(to) pass sth. on",       transl:"etwas weitergeben"},
    {word:"(to) translate",          transl:"übersetzen"},
  ],
};

/* ─────────────────────────────────────────────────────────────
   DEFAULT VOCABULARY SET 3  (performing arts, feelings & actions)
───────────────────────────────────────────────────────────── */
const DEFAULT_VSET3_ID = "lingua_default_en_de_3_v1";
const DEFAULT_VSET3 = {
  id: DEFAULT_VSET3_ID,
  name: "School, Stories & Feelings 🎭",
  created: "2026-01-01T00:00:00.000Z",
  words: [
    // ── School & learning ────────────────────────────────────────────────────
    {word:"interesting",             transl:"interessant"},
    {word:"schoolbook",              transl:"das Schulbuch"},
    {word:"Come on!",                transl:"Na los! / Komm!"},
    {word:"crib sheet",              transl:"der Spickzettel, der Merkzettel"},
    {word:"note",                    transl:"die Notiz, die Mitteilung"},
    {word:"(to) happen",             transl:"geschehen, passieren"},
    {word:"(to) repeat",             transl:"wiederholen"},
    {word:"(to) practise",           transl:"üben, trainieren, proben"},
    {word:"practice",                transl:"die Übung, das Training"},
    {word:"technique",               transl:"die Technik, die Methode"},
    // ── Performing & presenting ──────────────────────────────────────────────
    {word:"audience",                transl:"das Publikum, Zuschauer/innen"},
    {word:"orchestra",               transl:"das Orchester"},
    {word:"dancer",                  transl:"Tänzer/in"},
    {word:"(to) breathe in",         transl:"einatmen"},
    {word:"(to) relax",              transl:"sich entspannen, sich ausruhen"},
    {word:"(to) smile",              transl:"lächeln"},
    {word:"in a clear voice",        transl:"mit klarer Stimme"},
    {word:"slow",                    transl:"langsam"},
    {word:"fast",                    transl:"schnell"},
    // ── Feelings & states ────────────────────────────────────────────────────
    {word:"shy",                     transl:"schüchtern, scheu"},
    {word:"tired",                   transl:"müde"},
    {word:"unhappy",                 transl:"unglücklich"},
    {word:"(to) worry about",        transl:"sich Sorgen machen"},
    {word:"(to) be/feel bored",      transl:"gelangweilt sein, sich langweilen"},
    {word:"(to) join a club",        transl:"in einen Klub eintreten"},
    // ── Story & narrative ─────────────────────────────────────────────────────
    {word:"story",                   transl:"die Geschichte"},
    {word:"thought bubble",          transl:"die Gedankenblase"},
    {word:"thought",                 transl:"der Gedanke"},
    {word:"while",                   transl:"während"},
    {word:"just then",               transl:"genau in dem Moment"},
    {word:"at that moment",          transl:"in diesem Moment"},
    {word:"suddenly",                transl:"plötzlich, auf einmal"},
    {word:"always",                  transl:"immer"},
    {word:"never",                   transl:"nie, niemals"},
    {word:"usually",                 transl:"meistens, normalerweise"},
    {word:"better",                  transl:"besser"},
    // ── Objects & descriptions ───────────────────────────────────────────────
    {word:"real",                    transl:"echt, wirklich"},
    {word:"broken",                  transl:"zerbrochen, kaputt; gebrochen"},
    {word:"dirty",                   transl:"schmutzig"},
    {word:"eye",                     transl:"das Auge"},
    {word:"goat",                    transl:"die Ziege"},
    {word:"It isn't even real.",     transl:"Es ist noch nicht einmal echt."},
    // ── Actions ──────────────────────────────────────────────────────────────
    {word:"(to) stop",               transl:"aufhören; anhalten"},
    {word:"(to) beep",               transl:"piepen"},
    {word:"(to) whisper",            transl:"flüstern"},
    {word:"(to) wash",               transl:"waschen"},
    {word:"(to) fix",                transl:"reparieren"},
    {word:"(to) look after sb.",     transl:"auf jn./etwas aufpassen"},
    {word:"(to) change",             transl:"verändern"},
  ],
};

const DEFAULT_VSET4_ID = "lingua_default_out_about_v1";
const DEFAULT_VSET4 = {
  id: DEFAULT_VSET4_ID,
  name: "Out & About 🏙️",
  created: "2026-05-15T00:00:00.000Z",
  words: [
    // ── Out in the city ───────────────────────────────────────────────────────
    {word:"out and about",           transl:"unterwegs"},
    {word:"famous (for)",            transl:"berühmt"},
    {word:"sight",                   transl:"die Sehenswürdigkeit"},
    {word:"work of art",             transl:"das Kunstwerk"},
    {word:"chips",                   transl:"Pommes frites"},
    {word:"neighbourhood",           transl:"das Viertel, die Gegend"},
    {word:"strange",                 transl:"seltsam, komisch"},
    {word:"pavement",                transl:"der Gehweg, der Bürgersteig"},
    {word:"follow",                  transl:"folgen"},
    {word:"post box",                transl:"der Briefkasten"},
    {word:"post office",             transl:"das Postamt"},
    {word:"turn around",             transl:"sich umdrehen"},
    {word:"hide",                    transl:"verstecken, sich verstecken"},
    {word:"key",                     transl:"der Schlüssel"},
    {word:"magical",                 transl:"zauberhaft, magisch"},
    {word:"metre",                   transl:"der Meter"},
    {word:"guide",                   transl:"Fremdenführer/in"},
    {word:"visitor",                 transl:"Besucher/in, Gast"},
    {word:"bakery",                  transl:"die Bäckerei"},
    {word:"for miles",               transl:"meilenweit"},
    {word:"outside",                 transl:"draußen, außerhalb"},
    {word:"opposite sth.",           transl:"gegenüber von etwas"},
    {word:"bench",                   transl:"die Bank"},
    {word:"view (of)",               transl:"die Aussicht, der Blick"},
    // ── Weather ───────────────────────────────────────────────────────────────
    {word:"weather",                 transl:"das Wetter"},
    {word:"sunny",                   transl:"sonnig"},
    {word:"cloudy",                  transl:"bewölkt"},
    {word:"windy",                   transl:"windig"},
    {word:"stormy",                  transl:"stürmisch"},
    {word:"rainy",                   transl:"regnerisch"},
    {word:"rain",                    transl:"regnen"},
    {word:"snowy",                   transl:"schneebedeckt"},
    {word:"snow",                    transl:"schneien"},
    {word:"look up",                 transl:"hochsehen, aufschauen"},
    // ── Feelings & reactions ──────────────────────────────────────────────────
    {word:"cry",                     transl:"weinen"},
    {word:"horrible",                transl:"grauenhaft, entsetzlich"},
    {word:"dream",                   transl:"der Traum"},
    {word:"sleep",                   transl:"schlafen"},
    {word:"get angry/cold/...",      transl:"wütend/kalt/... werden"},
    {word:"growl",                   transl:"knurren"},
    {word:"worried",                 transl:"besorgt, beunruhigt"},
    {word:"brave",                   transl:"mutig, tapfer"},
    {word:"feeling",                 transl:"das Gefühl"},
    {word:"serious",                 transl:"ernst, ernsthaft"},
    {word:"sigh",                    transl:"seufzen"},
    {word:"bright",                  transl:"hell"},
    {word:"poor",                    transl:"arm"},
    // ── Actions & movement ────────────────────────────────────────────────────
    {word:"run after sb./sth.",      transl:"jm./etwas hinterherrennen"},
    {word:"slow down",               transl:"langsamer werden"},
    {word:"tiptoe",                  transl:"auf Zehenspitzen gehen"},
    {word:"tear sth. off sth.",      transl:"etwas abreißen"},
    {word:"lift",                    transl:"heben"},
    {word:"wag",                     transl:"wedeln"},
    {word:"ring",                    transl:"klingeln, läuten"},
    {word:"go black",                transl:"schwarz werden"},
    // ── Shopping & money ─────────────────────────────────────────────────────
    {word:"cost",                    transl:"kosten"},
    {word:"pound (£)",               transl:"das Pfund"},
    {word:"expensive",               transl:"teuer"},
    {word:"sell",                    transl:"verkaufen"},
    {word:"customer",                transl:"der Kunde, die Kundin"},
    {word:"ride",                    transl:"die Fahrt, das Fahrgeschäft"},
    {word:"cinema",                  transl:"das Kino"},
    {word:"glass",                   transl:"das Glas"},
    {word:"jewel",                   transl:"das Juwel"},
    // ── Household & chores ────────────────────────────────────────────────────
    {word:"machine",                 transl:"die Maschine, das Gerät"},
    {word:"tidy sth.",               transl:"etwas aufräumen"},
    {word:"wash the dishes",         transl:"das Geschirr abwaschen"},
    {word:"dry",                     transl:"trocknen"},
    {word:"hair",                    transl:"das Haar"},
    {word:"tooth / teeth",           transl:"der Zahn / die Zähne"},
    {word:"clean",                   transl:"putzen, reinigen"},
    {word:"curtain",                 transl:"der Vorhang"},
    {word:"light",                   transl:"das Licht"},
    {word:"cage",                    transl:"der Käfig"},
    {word:"tool",                    transl:"das Werkzeug"},
    {word:"locked",                  transl:"verschlossen"},
    {word:"paper",                   transl:"das Papier"},
    // ── Computers & design ───────────────────────────────────────────────────
    {word:"font",                    transl:"die Schriftart"},
    {word:"size",                    transl:"die Größe"},
    {word:"title",                   transl:"der Titel, die Überschrift"},
    {word:"at the top (of)",         transl:"oben, am oberen Ende"},
    {word:"at the bottom (of)",      transl:"unten, am unteren Ende"},
    {word:"caption",                 transl:"die Bildunterschrift"},
    {word:"beautiful",               transl:"schön"},
    {word:"ground",                  transl:"der Boden"},
    {word:"save",                    transl:"speichern, sichern"},
    {word:"on the right",            transl:"rechts, auf der rechten Seite"},
    {word:"on the left",             transl:"links, auf der linken Seite"},
    {word:"middle",                  transl:"die Mitte"},
    {word:"background",              transl:"der Hintergrund"},
    {word:"foreground",              transl:"der Vordergrund"},
    {word:"description",             transl:"die Beschreibung"},
    {word:"connect",                 transl:"verbinden, verknüpfen"},
    // ── Useful words & phrases ────────────────────────────────────────────────
    {word:"somebody / someone",      transl:"jemand"},
    {word:"yesterday",               transl:"gestern"},
    {word:"everything",              transl:"alles"},
    {word:"more than",               transl:"mehr als"},
    {word:"next",                    transl:"als Nächstes"},
    {word:"if",                      transl:"ob, wenn"},
    {word:"still",                   transl:"immer noch"},
    {word:"instead",                 transl:"stattdessen"},
    {word:"honestly",                transl:"ehrlich"},
    {word:"quick",                   transl:"schnell"},
    {word:"crazy",                   transl:"verrückt"},
    {word:"tall",                    transl:"groß, hoch"},
    {word:"silent",                  transl:"still, leise"},
    {word:"whose?",                  transl:"wessen?"},
    {word:"turn sth. on",            transl:"etwas einschalten"},
    {word:"turn sth. off",           transl:"etwas ausschalten"},
    {word:"appear",                  transl:"erscheinen, auftauchen"},
    {word:"match sth.",              transl:"zu etwas passen"},
    {word:"decide",                  transl:"beschließen, sich entscheiden"},
    {word:"suggest sth.",            transl:"etwas vorschlagen"},
    {word:"bet",                     transl:"wetten"},
    {word:"be in trouble",           transl:"in Schwierigkeiten sein"},
    {word:"truth",                   transl:"die Wahrheit"},
    {word:"rescue (noun)",           transl:"die Rettung"},
    {word:"rescue",                  transl:"retten"},
    {word:"suggestion",              transl:"der Vorschlag"},
    {word:"habit",                   transl:"die Gewohnheit"},
    {word:"order",                   transl:"der Befehl"},
    {word:"police",                  transl:"die Polizei"},
    {word:"project",                 transl:"das Projekt"},
    {word:"waste sth.",              transl:"etwas verschwenden"},
    {word:"break sth.",              transl:"zerbrechen, kaputt machen"},
    {word:"make sb. do sth.",        transl:"jn. dazu bringen, etwas zu tun"},
    {word:"ask sb. to do sth.",      transl:"jn. bitten, etwas zu tun"},
    {word:"the best machine ever",   transl:"die beste Maschine aller Zeiten"},
    // ── Phrases ───────────────────────────────────────────────────────────────
    {word:"I can't believe my eyes.", transl:"Ich traue meinen Augen nicht."},
    {word:"What's the matter?",      transl:"Was ist los?"},
    {word:"Give me a break!",        transl:"Verschone mich!"},
    {word:"What else?",              transl:"Was sonst noch?"},
  ],
};

/* ── Spanish sets (lang:"es") — word=Spanish, transl=English ── */
const DEFAULT_VSET_ES_ID = "lingua_default_es_v1";
const DEFAULT_VSET_ES = {
  id: DEFAULT_VSET_ES_ID, name: "Spanish Essentials 🇪🇸", lang: "es", created: "2026-01-01T00:00:00.000Z",
  words: [
    {word:"aventura",           transl:"adventure"},       {word:"llegar",             transl:"arrive"},
    {word:"creer",              transl:"believe"},          {word:"pedir prestado",     transl:"borrow"},
    {word:"valiente",           transl:"brave"},            {word:"cuidadoso",          transl:"careful"},
    {word:"listo",              transl:"clever"},           {word:"coleccionar",        transl:"collect"},
    {word:"cómodo",             transl:"comfortable"},      {word:"comparar",           transl:"compare"},
    {word:"completo",           transl:"complete"},         {word:"decidir",            transl:"decide"},
    {word:"describir",          transl:"describe"},         {word:"difícil",            transl:"difficult"},
    {word:"descubrir",          transl:"discover"},         {word:"vacío",              transl:"empty"},
    {word:"explicar",           transl:"explain"},          {word:"famoso",             transl:"famous"},
    {word:"favorito",           transl:"favorite"},         {word:"amigable",           transl:"friendly"},
    {word:"sano",               transl:"healthy"},          {word:"imaginar",           transl:"imagine"},
    {word:"mejorar",            transl:"improve"},          {word:"incluir",            transl:"include"},
    {word:"importante",         transl:"important"},        {word:"interesante",        transl:"interesting"},
    {word:"viaje",              transl:"journey"},          {word:"idioma",             transl:"language"},
    {word:"biblioteca",         transl:"library"},          {word:"error",              transl:"mistake"},
    {word:"nervioso",           transl:"nervous"},          {word:"opinión",            transl:"opinion"},
    {word:"educado",            transl:"polite"},           {word:"practicar",          transl:"practice"},
    {word:"prometer",           transl:"promise"},          {word:"pregunta",           transl:"question"},
    {word:"recordar",           transl:"remember"},         {word:"reparar",            transl:"repair"},
    {word:"seguro",             transl:"safe"},             {word:"extraño",            transl:"strange"},
    {word:"de repente",         transl:"suddenly"},         {word:"sorpresa",           transl:"surprise"},
    {word:"viajar",             transl:"travel"},           {word:"entender",           transl:"understand"},
    {word:"útil",               transl:"useful"},           {word:"pueblo",             transl:"village"},
    {word:"tiempo",             transl:"weather"},          {word:"susurrar",           transl:"whisper"},
    {word:"maravilloso",        transl:"wonderful"},        {word:"ayer",               transl:"yesterday"},
    {word:"tengo que comprar",  transl:"have to buy"},      {word:"lista",              transl:"list"},
    {word:"galleta",            transl:"biscuit"},          {word:"dulce",              transl:"sweet"},
    {word:"emocionado",         transl:"excited"},          {word:"fruta",              transl:"fruit"},
    {word:"uva",                transl:"grape"},            {word:"unos pocos",         transl:"a few"},
    {word:"con gas",            transl:"fizzy"},            {word:"mucho",              transl:"much"},
    {word:"zumo",               transl:"juice"},            {word:"naranja",            transl:"orange"},
    {word:"suficiente",         transl:"enough"},           {word:"dinero",             transl:"money"},
    {word:"por supuesto",       transl:"of course"},        {word:"olvidar",            transl:"forget"},
    {word:"carrito",            transl:"trolley"},          {word:"desayuno",           transl:"breakfast"},
    {word:"almuerzo",           transl:"lunch"},            {word:"cena",               transl:"dinner"},
    {word:"verdura",            transl:"vegetable"},        {word:"pollo",              transl:"chicken"},
    {word:"pan",                transl:"bread"},            {word:"mantequilla",        transl:"butter"},
    {word:"queso",              transl:"cheese"},           {word:"leche",              transl:"milk"},
    {word:"azúcar",             transl:"sugar"},            {word:"sal",                transl:"salt"},
    {word:"pimienta",           transl:"pepper"},           {word:"té",                 transl:"tea"},
    {word:"café",               transl:"coffee"},           {word:"agua",               transl:"water"},
    {word:"clase",              transl:"lesson"},           {word:"deberes",            transl:"homework"},
    {word:"asignatura",         transl:"subject"},          {word:"ciencias",           transl:"science"},
    {word:"historia",           transl:"history"},          {word:"geografía",          transl:"geography"},
    {word:"arte",               transl:"art"},              {word:"música",             transl:"music"},
    {word:"deporte",            transl:"sport"},            {word:"diccionario",        transl:"dictionary"},
    {word:"frase",              transl:"sentence"},         {word:"párrafo",            transl:"paragraph"},
    {word:"capítulo",           transl:"chapter"},          {word:"cuaderno",           transl:"notebook"},
    {word:"lápiz",              transl:"pencil"},           {word:"enfadado",           transl:"angry"},
    {word:"triste",             transl:"sad"},              {word:"feliz",              transl:"happy"},
    {word:"cansado",            transl:"tired"},            {word:"aburrido",           transl:"bored"},
    {word:"orgulloso",          transl:"proud"},            {word:"preocupado",         transl:"worried"},
    {word:"solo",               transl:"lonely"},           {word:"tímido",             transl:"shy"},
    {word:"amable",             transl:"kind"},             {word:"honesto",            transl:"honest"},
    {word:"paciente",           transl:"patient"},          {word:"perezoso",           transl:"lazy"},
    {word:"trabajador",         transl:"hard-working"},     {word:"generoso",           transl:"generous"},
    {word:"mañana",             transl:"morning"},          {word:"tarde",              transl:"afternoon"},
    {word:"noche",              transl:"evening"},          {word:"medianoche",         transl:"midnight"},
    {word:"fin de semana",      transl:"weekend"},          {word:"vacaciones",         transl:"holiday"},
    {word:"cumpleaños",         transl:"birthday"},         {word:"estación",           transl:"season"},
    {word:"primavera",          transl:"spring"},           {word:"otoño",              transl:"autumn"},
    {word:"bosque",             transl:"forest"},           {word:"montaña",            transl:"mountain"},
    {word:"río",                transl:"river"},            {word:"océano",             transl:"ocean"},
    {word:"isla",               transl:"island"},           {word:"nube",               transl:"cloud"},
    {word:"tormenta",           transl:"storm"},            {word:"lluvia",             transl:"rain"},
    {word:"nieve",              transl:"snow"},             {word:"flor",               transl:"flower"},
    {word:"árbol",              transl:"tree"},             {word:"hierba",             transl:"grass"},
    {word:"animal",             transl:"animal"},           {word:"pájaro",             transl:"bird"},
    {word:"pez",                transl:"fish"},             {word:"dolor de cabeza",    transl:"headache"},
    {word:"dolor de estómago",  transl:"stomachache"},      {word:"medicamento",        transl:"medicine"},
    {word:"hospital",           transl:"hospital"},         {word:"médico",             transl:"doctor"},
    {word:"diente",             transl:"tooth"},            {word:"corazón",            transl:"heart"},
    {word:"hombro",             transl:"shoulder"},         {word:"rodilla",            transl:"knee"},
    {word:"codo",               transl:"elbow"},            {word:"cocina",             transl:"kitchen"},
    {word:"dormitorio",         transl:"bedroom"},          {word:"baño",               transl:"bathroom"},
    {word:"jardín",             transl:"garden"},           {word:"escaleras",          transl:"stairs"},
    {word:"ventana",            transl:"window"},           {word:"puerta",             transl:"door"},
    {word:"suelo",              transl:"floor"},            {word:"techo",              transl:"ceiling"},
    {word:"pared",              transl:"wall"},             {word:"vecino",             transl:"neighbour"},
    {word:"mensaje",            transl:"message"},          {word:"teléfono",           transl:"telephone"},
    {word:"dirección",          transl:"address"},          {word:"invitar",            transl:"invite"},
    {word:"reunión",            transl:"meeting"},          {word:"llevar",             transl:"carry"},
    {word:"dejar caer",         transl:"drop"},             {word:"coger",              transl:"catch"},
    {word:"lanzar",             transl:"throw"},            {word:"empujar",            transl:"push"},
    {word:"tirar",              transl:"pull"},             {word:"compartir",          transl:"share"},
    {word:"elegir",             transl:"choose"},           {word:"permitir",           transl:"allow"},
    {word:"sugerir",            transl:"suggest"},          {word:"gastar",             transl:"spend"},
    {word:"comprobar",          transl:"check"},            {word:"seguir",             transl:"follow"},
    {word:"echar de menos",     transl:"miss"},             {word:"fingir",             transl:"pretend"},
  ],
};
const DEFAULT_VSET2_ES_ID = "lingua_default_es_v2";
const DEFAULT_VSET2_ES = {
  id: DEFAULT_VSET2_ES_ID, name: "Food, Shopping & Classroom 🛒", lang: "es", created: "2026-01-01T00:00:00.000Z",
  words: [
    {word:"saludar a alguien",          transl:"(to) greet sb."},
    {word:"comentar algo",              transl:"(to) comment on sth."},
    {word:"versión",                    transl:"version"},
    {word:"mismo",                      transl:"same"},
    {word:"prepararse para algo",       transl:"(to) prepare for sth."},
    {word:"pastel",                     transl:"cake"},
    {word:"¿Te gustaría…?",            transl:"Would you like…?"},
    {word:"Me gustaría…",              transl:"I'd like…"},
    {word:"Tengo que comprar…",        transl:"I have to buy…"},
    {word:"lista",                      transl:"list"},
    {word:"galleta",                    transl:"biscuit"},
    {word:"dulce",                      transl:"sweet"},
    {word:"emocionado",                 transl:"excited"},
    {word:"fruta",                      transl:"fruit"},
    {word:"uva",                        transl:"grape"},
    {word:"unos pocos",                 transl:"a few"},
    {word:"con gas",                    transl:"fizzy"},
    {word:"mucho",                      transl:"much"},
    {word:"zumo",                       transl:"juice"},
    {word:"naranja",                    transl:"orange"},
    {word:"suficiente",                 transl:"enough"},
    {word:"dinero",                     transl:"money"},
    {word:"por supuesto",               transl:"of course"},
    {word:"olvidar",                    transl:"(to) forget"},
    {word:"carrito",                    transl:"trolley"},
    {word:"todavía no",                 transl:"not…yet"},
    {word:"patatas fritas",             transl:"crisps"},
    {word:"mono",                       transl:"monkey"},
    {word:"recoger algo",               transl:"(to) pick sth. up"},
    {word:"elegir",                     transl:"(to) choose"},
    {word:"lágrima",                    transl:"tear"},
    {word:"llegar",                     transl:"(to) arrive"},
    {word:"señalar algo",               transl:"(to) point to sth."},
    {word:"grande",                     transl:"large"},
    {word:"pesado",                     transl:"heavy"},
    {word:"llamar",                     transl:"(to) call"},
    {word:"plato",                      transl:"plate"},
    {word:"redondo",                    transl:"round"},
    {word:"hornear",                    transl:"(to) bake"},
    {word:"comenzar",                   transl:"(to) begin"},
    {word:"arcoíris",                   transl:"rainbow"},
    {word:"receta",                     transl:"recipe"},
    {word:"ingrediente",                transl:"ingredient"},
    {word:"instrucción",                transl:"instruction"},
    {word:"gramo (g)",                  transl:"gram (g)"},
    {word:"mantequilla",                transl:"butter"},
    {word:"azúcar",                     transl:"sugar"},
    {word:"huevo",                      transl:"egg"},
    {word:"harina",                     transl:"flour"},
    {word:"chocolate",                  transl:"chocolate"},
    {word:"judía",                      transl:"bean"},
    {word:"pan",                        transl:"bread"},
    {word:"sal",                        transl:"salt"},
    {word:"pimienta",                   transl:"pepper"},
    {word:"tarro",                      transl:"jar"},
    {word:"pera",                       transl:"pear"},
    {word:"kiwi",                       transl:"kiwi"},
    {word:"piña",                       transl:"pineapple"},
    {word:"fresa",                      transl:"strawberry"},
    {word:"verduras",                   transl:"vegetables"},
    {word:"lechuga",                    transl:"lettuce"},
    {word:"tomate",                     transl:"tomato"},
    {word:"zanahoria",                  transl:"carrot"},
    {word:"queso",                      transl:"cheese"},
    {word:"añadir",                     transl:"(to) add"},
    {word:"batir",                      transl:"(to) beat"},
    {word:"hasta",                      transl:"until"},
    {word:"nevera",                     transl:"fridge"},
    {word:"horno",                      transl:"oven"},
    {word:"cortar",                     transl:"(to) cut"},
    {word:"un trozo de…",               transl:"a piece of…"},
    {word:"fila",                       transl:"row"},
    {word:"estructurar",                transl:"(to) structure"},
    {word:"de otras maneras",           transl:"in other ways"},
    {word:"recopilar",                  transl:"(to) collect"},
    {word:"marcar",                     transl:"(to) mark"},
    {word:"comida",                     transl:"meal"},
    {word:"cantidad",                   transl:"quantity"},
    {word:"recordar algo",              transl:"(to) remember sth."},
    {word:"plan",                       transl:"plan"},
    {word:"significado",                transl:"meaning"},
    {word:"significar",                 transl:"(to) mean"},
    {word:"comparar",                   transl:"(to) compare"},
    {word:"mediación",                  transl:"mediation"},
    {word:"tomar notas",                transl:"(to) take notes"},
    {word:"transmitir algo",            transl:"(to) pass sth. on"},
    {word:"traducir",                   transl:"(to) translate"},
  ],
};
const DEFAULT_VSET3_ES_ID = "lingua_default_es_v3";
const DEFAULT_VSET3_ES = {
  id: DEFAULT_VSET3_ES_ID, name: "School, Stories & Feelings 🎭", lang: "es", created: "2026-01-01T00:00:00.000Z",
  words: [
    {word:"interesante",                transl:"interesting"},
    {word:"libro de texto",             transl:"schoolbook"},
    {word:"¡Vamos!",                    transl:"Come on!"},
    {word:"chuleta",                    transl:"crib sheet"},
    {word:"nota",                       transl:"note"},
    {word:"pasar",                      transl:"(to) happen"},
    {word:"repetir",                    transl:"(to) repeat"},
    {word:"practicar",                  transl:"(to) practise"},
    {word:"práctica",                   transl:"practice"},
    {word:"técnica",                    transl:"technique"},
    {word:"público",                    transl:"audience"},
    {word:"orquesta",                   transl:"orchestra"},
    {word:"bailarín/bailarina",         transl:"dancer"},
    {word:"respirar hondo",             transl:"(to) breathe in"},
    {word:"relajarse",                  transl:"(to) relax"},
    {word:"sonreír",                    transl:"(to) smile"},
    {word:"con voz clara",              transl:"in a clear voice"},
    {word:"lento",                      transl:"slow"},
    {word:"rápido",                     transl:"fast"},
    {word:"tímido",                     transl:"shy"},
    {word:"cansado",                    transl:"tired"},
    {word:"infeliz",                    transl:"unhappy"},
    {word:"preocuparse por",            transl:"(to) worry about"},
    {word:"aburrirse",                  transl:"(to) be bored"},
    {word:"unirse a un club",           transl:"(to) join a club"},
    {word:"historia",                   transl:"story"},
    {word:"globo de pensamiento",       transl:"thought bubble"},
    {word:"pensamiento",                transl:"thought"},
    {word:"mientras",                   transl:"while"},
    {word:"justo en ese momento",       transl:"just then"},
    {word:"en ese momento",             transl:"at that moment"},
    {word:"de repente",                 transl:"suddenly"},
    {word:"siempre",                    transl:"always"},
    {word:"nunca",                      transl:"never"},
    {word:"normalmente",                transl:"usually"},
    {word:"mejor",                      transl:"better"},
    {word:"real",                       transl:"real"},
    {word:"roto",                       transl:"broken"},
    {word:"sucio",                      transl:"dirty"},
    {word:"ojo",                        transl:"eye"},
    {word:"cabra",                      transl:"goat"},
    {word:"Ni siquiera es real.",       transl:"It isn't even real."},
    {word:"parar",                      transl:"(to) stop"},
    {word:"pitar",                      transl:"(to) beep"},
    {word:"susurrar",                   transl:"(to) whisper"},
    {word:"lavar",                      transl:"(to) wash"},
    {word:"arreglar",                   transl:"(to) fix"},
    {word:"cuidar a alguien",           transl:"(to) look after sb."},
    {word:"cambiar",                    transl:"(to) change"},
  ],
};
const DEFAULT_VSET4_ES_ID = "lingua_default_es_v4";
const DEFAULT_VSET4_ES = {
  id: DEFAULT_VSET4_ES_ID, name: "Out & About 🏙️", lang: "es", created: "2026-01-01T00:00:00.000Z",
  words: [
    {word:"por ahí",                    transl:"out and about"},     {word:"famoso (por)",       transl:"famous (for)"},
    {word:"lugar de interés",           transl:"sight"},             {word:"obra de arte",       transl:"work of art"},
    {word:"patatas fritas",             transl:"chips"},             {word:"barrio",             transl:"neighbourhood"},
    {word:"extraño",                    transl:"strange"},           {word:"acera",              transl:"pavement"},
    {word:"seguir",                     transl:"follow"},            {word:"buzón",              transl:"post box"},
    {word:"correos",                    transl:"post office"},       {word:"darse la vuelta",    transl:"turn around"},
    {word:"esconderse",                 transl:"hide"},              {word:"llave",              transl:"key"},
    {word:"mágico",                     transl:"magical"},           {word:"metro",              transl:"metre"},
    {word:"guía turístico/a",          transl:"guide"},             {word:"visitante",          transl:"visitor"},
    {word:"panadería",                  transl:"bakery"},            {word:"por kilómetros",     transl:"for miles"},
    {word:"fuera",                      transl:"outside"},           {word:"enfrente de algo",   transl:"opposite sth."},
    {word:"banco",                      transl:"bench"},             {word:"vista (de)",         transl:"view (of)"},
    {word:"tiempo",                     transl:"weather"},           {word:"soleado",            transl:"sunny"},
    {word:"nublado",                    transl:"cloudy"},            {word:"ventoso",            transl:"windy"},
    {word:"tormentoso",                 transl:"stormy"},            {word:"lluvioso",           transl:"rainy"},
    {word:"llover",                     transl:"rain"},              {word:"nevado",             transl:"snowy"},
    {word:"nevar",                      transl:"snow"},              {word:"mirar hacia arriba", transl:"look up"},
    {word:"llorar",                     transl:"cry"},               {word:"horrible",           transl:"horrible"},
    {word:"sueño",                      transl:"dream"},             {word:"dormir",             transl:"sleep"},
    {word:"enfadarse",                  transl:"get angry"},         {word:"gruñir",             transl:"growl"},
    {word:"preocupado",                 transl:"worried"},           {word:"valiente",           transl:"brave"},
    {word:"sentimiento",                transl:"feeling"},           {word:"serio",              transl:"serious"},
    {word:"suspirar",                   transl:"sigh"},              {word:"brillante",          transl:"bright"},
    {word:"pobre",                      transl:"poor"},              {word:"correr detrás de alguien", transl:"run after sb."},
    {word:"ir más despacio",            transl:"slow down"},         {word:"ir de puntillas",    transl:"tiptoe"},
    {word:"arrancar algo",              transl:"tear sth. off"},     {word:"levantar",           transl:"lift"},
    {word:"menear",                     transl:"wag"},               {word:"llamar",             transl:"ring"},
    {word:"ponerse negro",              transl:"go black"},          {word:"costar",             transl:"cost"},
    {word:"libra (£)",                  transl:"pound (£)"},         {word:"caro",               transl:"expensive"},
    {word:"vender",                     transl:"sell"},              {word:"cliente",            transl:"customer"},
    {word:"paseo",                      transl:"ride"},              {word:"cine",               transl:"cinema"},
    {word:"vaso",                       transl:"glass"},             {word:"joya",               transl:"jewel"},
    {word:"máquina",                    transl:"machine"},           {word:"ordenar algo",       transl:"tidy sth."},
    {word:"fregar los platos",          transl:"wash the dishes"},   {word:"secar",              transl:"dry"},
    {word:"pelo",                       transl:"hair"},              {word:"diente/dientes",     transl:"tooth/teeth"},
    {word:"limpiar",                    transl:"clean"},             {word:"cortina",            transl:"curtain"},
    {word:"luz",                        transl:"light"},             {word:"jaula",              transl:"cage"},
    {word:"herramienta",                transl:"tool"},              {word:"cerrado con llave",  transl:"locked"},
    {word:"papel",                      transl:"paper"},             {word:"fuente",             transl:"font"},
    {word:"tamaño",                     transl:"size"},              {word:"título",             transl:"title"},
    {word:"en la parte superior",       transl:"at the top"},        {word:"en la parte inferior", transl:"at the bottom"},
    {word:"pie de foto",                transl:"caption"},           {word:"hermoso",            transl:"beautiful"},
    {word:"suelo",                      transl:"ground"},            {word:"guardar",            transl:"save"},
    {word:"a la derecha",               transl:"on the right"},      {word:"a la izquierda",     transl:"on the left"},
    {word:"centro",                     transl:"middle"},            {word:"fondo",              transl:"background"},
    {word:"primer plano",               transl:"foreground"},        {word:"descripción",        transl:"description"},
    {word:"conectar",                   transl:"connect"},           {word:"alguien",            transl:"somebody"},
    {word:"ayer",                       transl:"yesterday"},         {word:"todo",               transl:"everything"},
    {word:"más de",                     transl:"more than"},         {word:"a continuación",     transl:"next"},
    {word:"si",                         transl:"if"},                {word:"todavía",            transl:"still"},
    {word:"en su lugar",                transl:"instead"},           {word:"honestamente",       transl:"honestly"},
    {word:"rápido",                     transl:"quick"},             {word:"loco",               transl:"crazy"},
    {word:"alto",                       transl:"tall"},              {word:"silencioso",         transl:"silent"},
    {word:"¿de quién?",                 transl:"whose?"},            {word:"encender algo",      transl:"turn sth. on"},
    {word:"apagar algo",                transl:"turn sth. off"},     {word:"aparecer",           transl:"appear"},
    {word:"coincidir con algo",         transl:"match sth."},        {word:"decidir",            transl:"decide"},
    {word:"sugerir algo",               transl:"suggest sth."},      {word:"apostar",            transl:"bet"},
    {word:"estar en apuros",            transl:"be in trouble"},     {word:"verdad",             transl:"truth"},
    {word:"rescate",                    transl:"rescue (noun)"},     {word:"rescatar",           transl:"rescue"},
    {word:"sugerencia",                 transl:"suggestion"},        {word:"hábito",             transl:"habit"},
    {word:"orden",                      transl:"order"},             {word:"policía",            transl:"police"},
    {word:"proyecto",                   transl:"project"},           {word:"desperdiciar algo",  transl:"waste sth."},
    {word:"romper algo",                transl:"break sth."},
    {word:"hacer que alguien haga algo",transl:"make sb. do sth."},
    {word:"pedir a alguien que haga algo", transl:"ask sb. to do sth."},
    {word:"la mejor máquina de todos los tiempos", transl:"the best machine ever"},
    {word:"No me puedo creer lo que veo.", transl:"I can't believe my eyes."},
    {word:"¿Qué pasa?",                 transl:"What's the matter?"},
    {word:"¡Déjame en paz!",           transl:"Give me a break!"},
    {word:"¿Qué más?",                 transl:"What else?"},
  ],
};

/* ── German sets (lang:"de") — word=German, transl=English ── */
const DEFAULT_VSET_DE_ID = "lingua_default_de_v1";
const DEFAULT_VSET_DE = {
  id: DEFAULT_VSET_DE_ID, name: "Deutsch Grundwortschatz 🇩🇪", lang: "de", created: "2026-01-01T00:00:00.000Z",
  words: [
    {word:"Abenteuer",          transl:"adventure"},        {word:"ankommen",           transl:"arrive"},
    {word:"glauben",            transl:"believe"},          {word:"ausleihen",          transl:"borrow"},
    {word:"mutig",              transl:"brave"},            {word:"vorsichtig",         transl:"careful"},
    {word:"schlau",             transl:"clever"},           {word:"sammeln",            transl:"collect"},
    {word:"bequem",             transl:"comfortable"},      {word:"vergleichen",        transl:"compare"},
    {word:"vollständig",        transl:"complete"},         {word:"entscheiden",        transl:"decide"},
    {word:"beschreiben",        transl:"describe"},         {word:"schwierig",          transl:"difficult"},
    {word:"entdecken",          transl:"discover"},         {word:"leer",               transl:"empty"},
    {word:"erklären",           transl:"explain"},          {word:"berühmt",            transl:"famous"},
    {word:"Lieblings-",         transl:"favorite"},         {word:"freundlich",         transl:"friendly"},
    {word:"gesund",             transl:"healthy"},          {word:"sich vorstellen",    transl:"imagine"},
    {word:"verbessern",         transl:"improve"},          {word:"beinhalten",         transl:"include"},
    {word:"wichtig",            transl:"important"},        {word:"interessant",        transl:"interesting"},
    {word:"die Reise",          transl:"journey"},          {word:"die Sprache",        transl:"language"},
    {word:"die Bibliothek",     transl:"library"},          {word:"der Fehler",         transl:"mistake"},
    {word:"nervös",             transl:"nervous"},          {word:"die Meinung",        transl:"opinion"},
    {word:"höflich",            transl:"polite"},           {word:"üben",               transl:"practice"},
    {word:"versprechen",        transl:"promise"},          {word:"die Frage",          transl:"question"},
    {word:"erinnern",           transl:"remember"},         {word:"reparieren",         transl:"repair"},
    {word:"sicher",             transl:"safe"},             {word:"seltsam",            transl:"strange"},
    {word:"plötzlich",          transl:"suddenly"},         {word:"die Überraschung",   transl:"surprise"},
    {word:"reisen",             transl:"travel"},           {word:"verstehen",          transl:"understand"},
    {word:"nützlich",           transl:"useful"},           {word:"das Dorf",           transl:"village"},
    {word:"das Wetter",         transl:"weather"},          {word:"flüstern",           transl:"whisper"},
    {word:"wunderbar",          transl:"wonderful"},        {word:"gestern",            transl:"yesterday"},
    {word:"ich muss … kaufen",  transl:"have to buy"},      {word:"die Liste",          transl:"list"},
    {word:"der Keks",           transl:"biscuit"},          {word:"die Süßigkeit",      transl:"sweet"},
    {word:"aufgeregt",          transl:"excited"},          {word:"das Obst",           transl:"fruit"},
    {word:"die Weintraube",     transl:"grape"},            {word:"ein paar",           transl:"a few"},
    {word:"sprudelnd",          transl:"fizzy"},            {word:"viel",               transl:"much"},
    {word:"der Saft",           transl:"juice"},            {word:"die Orange",         transl:"orange"},
    {word:"genug",              transl:"enough"},           {word:"das Geld",           transl:"money"},
    {word:"natürlich",          transl:"of course"},        {word:"vergessen",          transl:"forget"},
    {word:"der Einkaufswagen",  transl:"trolley"},          {word:"das Frühstück",      transl:"breakfast"},
    {word:"das Mittagessen",    transl:"lunch"},            {word:"das Abendessen",     transl:"dinner"},
    {word:"das Gemüse",         transl:"vegetable"},        {word:"das Hähnchen",       transl:"chicken"},
    {word:"das Brot",           transl:"bread"},            {word:"die Butter",         transl:"butter"},
    {word:"der Käse",           transl:"cheese"},           {word:"die Milch",          transl:"milk"},
    {word:"der Zucker",         transl:"sugar"},            {word:"das Salz",           transl:"salt"},
    {word:"der Pfeffer",        transl:"pepper"},           {word:"der Tee",            transl:"tea"},
    {word:"der Kaffee",         transl:"coffee"},           {word:"das Wasser",         transl:"water"},
    {word:"die Stunde",         transl:"lesson"},           {word:"die Hausaufgabe",    transl:"homework"},
    {word:"das Fach",           transl:"subject"},          {word:"die Naturwissenschaft", transl:"science"},
    {word:"die Geschichte",     transl:"history"},          {word:"die Erdkunde",       transl:"geography"},
    {word:"die Kunst",          transl:"art"},              {word:"die Musik",          transl:"music"},
    {word:"der Sport",          transl:"sport"},            {word:"das Wörterbuch",     transl:"dictionary"},
    {word:"der Satz",           transl:"sentence"},         {word:"der Absatz",         transl:"paragraph"},
    {word:"das Kapitel",        transl:"chapter"},          {word:"das Heft",           transl:"notebook"},
    {word:"der Bleistift",      transl:"pencil"},           {word:"wütend",             transl:"angry"},
    {word:"traurig",            transl:"sad"},              {word:"glücklich",          transl:"happy"},
    {word:"müde",               transl:"tired"},            {word:"gelangweilt",        transl:"bored"},
    {word:"stolz",              transl:"proud"},            {word:"besorgt",            transl:"worried"},
    {word:"einsam",             transl:"lonely"},           {word:"schüchtern",         transl:"shy"},
    {word:"nett",               transl:"kind"},             {word:"ehrlich",            transl:"honest"},
    {word:"geduldig",           transl:"patient"},          {word:"faul",               transl:"lazy"},
    {word:"fleißig",            transl:"hard-working"},     {word:"großzügig",          transl:"generous"},
    {word:"der Morgen",         transl:"morning"},          {word:"der Nachmittag",     transl:"afternoon"},
    {word:"der Abend",          transl:"evening"},          {word:"die Mitternacht",    transl:"midnight"},
    {word:"das Wochenende",     transl:"weekend"},          {word:"der Urlaub",         transl:"holiday"},
    {word:"der Geburtstag",     transl:"birthday"},         {word:"die Jahreszeit",     transl:"season"},
    {word:"der Frühling",       transl:"spring"},           {word:"der Herbst",         transl:"autumn"},
    {word:"der Wald",           transl:"forest"},           {word:"der Berg",           transl:"mountain"},
    {word:"der Fluss",          transl:"river"},            {word:"das Meer",           transl:"ocean"},
    {word:"die Insel",          transl:"island"},           {word:"die Wolke",          transl:"cloud"},
    {word:"der Sturm",          transl:"storm"},            {word:"der Regen",          transl:"rain"},
    {word:"der Schnee",         transl:"snow"},             {word:"die Blume",          transl:"flower"},
    {word:"der Baum",           transl:"tree"},             {word:"das Gras",           transl:"grass"},
    {word:"das Tier",           transl:"animal"},           {word:"der Vogel",          transl:"bird"},
    {word:"der Fisch",          transl:"fish"},             {word:"die Kopfschmerzen",  transl:"headache"},
    {word:"die Bauchschmerzen", transl:"stomachache"},      {word:"das Medikament",     transl:"medicine"},
    {word:"das Krankenhaus",    transl:"hospital"},         {word:"der Arzt",           transl:"doctor"},
    {word:"der Zahn",           transl:"tooth"},            {word:"das Herz",           transl:"heart"},
    {word:"die Schulter",       transl:"shoulder"},         {word:"das Knie",           transl:"knee"},
    {word:"der Ellenbogen",     transl:"elbow"},            {word:"die Küche",          transl:"kitchen"},
    {word:"das Schlafzimmer",   transl:"bedroom"},          {word:"das Badezimmer",     transl:"bathroom"},
    {word:"der Garten",         transl:"garden"},           {word:"die Treppe",         transl:"stairs"},
    {word:"das Fenster",        transl:"window"},           {word:"die Tür",            transl:"door"},
    {word:"der Boden",          transl:"floor"},            {word:"die Decke",          transl:"ceiling"},
    {word:"die Wand",           transl:"wall"},             {word:"der Nachbar",        transl:"neighbour"},
    {word:"die Nachricht",      transl:"message"},          {word:"das Telefon",        transl:"telephone"},
    {word:"die Adresse",        transl:"address"},          {word:"einladen",           transl:"invite"},
    {word:"das Treffen",        transl:"meeting"},          {word:"tragen",             transl:"carry"},
    {word:"fallen lassen",      transl:"drop"},             {word:"fangen",             transl:"catch"},
    {word:"werfen",             transl:"throw"},            {word:"schieben",           transl:"push"},
    {word:"ziehen",             transl:"pull"},             {word:"teilen",             transl:"share"},
    {word:"wählen",             transl:"choose"},           {word:"erlauben",           transl:"allow"},
    {word:"vorschlagen",        transl:"suggest"},          {word:"ausgeben",           transl:"spend"},
    {word:"überprüfen",         transl:"check"},            {word:"folgen",             transl:"follow"},
    {word:"vermissen",          transl:"miss"},             {word:"so tun als ob",      transl:"pretend"},
  ],
};
const DEFAULT_VSET2_DE_ID = "lingua_default_de_v2";
const DEFAULT_VSET2_DE = {
  id: DEFAULT_VSET2_DE_ID, name: "Essen, Einkaufen & Schule 🛒", lang: "de", created: "2026-01-01T00:00:00.000Z",
  words: [
    {word:"jn. begrüßen",       transl:"(to) greet sb."},           {word:"sich äußern",    transl:"(to) comment on sth."},
    {word:"die Version",        transl:"version"},                   {word:"gleich",         transl:"same"},
    {word:"sich vorbereiten",   transl:"(to) prepare for sth."},    {word:"der Kuchen",     transl:"cake"},
    {word:"Möchtest du…?",     transl:"Would you like…?"},          {word:"Ich möchte…",   transl:"I'd like…"},
    {word:"Ich muss … kaufen",  transl:"I have to buy…"},           {word:"die Liste",      transl:"list"},
    {word:"der Keks",           transl:"biscuit"},                   {word:"die Süßigkeit",  transl:"sweet"},
    {word:"aufgeregt",          transl:"excited"},                   {word:"das Obst",       transl:"fruit"},
    {word:"die Weintraube",     transl:"grape"},                     {word:"ein paar",       transl:"a few"},
    {word:"sprudelnd",          transl:"fizzy"},                     {word:"viel",           transl:"much"},
    {word:"der Saft",           transl:"juice"},                     {word:"die Orange",     transl:"orange"},
    {word:"genug",              transl:"enough"},                    {word:"das Geld",       transl:"money"},
    {word:"natürlich",          transl:"of course"},                 {word:"vergessen",      transl:"(to) forget"},
    {word:"der Einkaufswagen",  transl:"trolley"},                   {word:"noch nicht",     transl:"not…yet"},
    {word:"Kartoffelchips",     transl:"crisps"},                    {word:"der Affe",       transl:"monkey"},
    {word:"etwas aufheben",     transl:"(to) pick sth. up"},        {word:"aussuchen",      transl:"(to) choose"},
    {word:"die Träne",          transl:"tear"},                      {word:"ankommen",       transl:"(to) arrive"},
    {word:"auf etwas zeigen",   transl:"(to) point to sth."},       {word:"groß",           transl:"large"},
    {word:"schwer",             transl:"heavy"},                     {word:"rufen",          transl:"(to) call"},
    {word:"der Teller",         transl:"plate"},                     {word:"rund",           transl:"round"},
    {word:"backen",             transl:"(to) bake"},                 {word:"beginnen",       transl:"(to) begin"},
    {word:"der Regenbogen",     transl:"rainbow"},                   {word:"das Rezept",     transl:"recipe"},
    {word:"die Zutat",          transl:"ingredient"},                {word:"die Anweisung",  transl:"instruction"},
    {word:"das Gramm (g)",      transl:"gram (g)"},                  {word:"die Butter",     transl:"butter"},
    {word:"der Zucker",         transl:"sugar"},                     {word:"das Ei",         transl:"egg"},
    {word:"das Mehl",           transl:"flour"},                     {word:"die Schokolade", transl:"chocolate"},
    {word:"die Bohne",          transl:"bean"},                      {word:"das Brot",       transl:"bread"},
    {word:"das Salz",           transl:"salt"},                      {word:"der Pfeffer",    transl:"pepper"},
    {word:"das Einmachglas",    transl:"jar"},                       {word:"die Birne",      transl:"pear"},
    {word:"die Kiwi",           transl:"kiwi"},                      {word:"die Ananas",     transl:"pineapple"},
    {word:"die Erdbeere",       transl:"strawberry"},                {word:"das Gemüse",     transl:"vegetables"},
    {word:"der Kopfsalat",      transl:"lettuce"},                   {word:"die Tomate",     transl:"tomato"},
    {word:"die Karotte",        transl:"carrot"},                    {word:"der Käse",       transl:"cheese"},
    {word:"hinzufügen",         transl:"(to) add"},                  {word:"schlagen",       transl:"(to) beat"},
    {word:"bis",                transl:"until"},                     {word:"der Kühlschrank",transl:"fridge"},
    {word:"der Ofen",           transl:"oven"},                      {word:"schneiden",      transl:"(to) cut"},
    {word:"ein Stück …",        transl:"a piece of…"},               {word:"die Reihe",      transl:"row"},
    {word:"strukturieren",      transl:"(to) structure"},            {word:"auf andere Weise",transl:"in other ways"},
    {word:"sammeln",            transl:"(to) collect"},              {word:"markieren",      transl:"(to) mark"},
    {word:"die Mahlzeit",       transl:"meal"},                      {word:"die Menge",      transl:"quantity"},
    {word:"sich erinnern",      transl:"(to) remember sth."},        {word:"der Plan",       transl:"plan"},
    {word:"die Bedeutung",      transl:"meaning"},                   {word:"bedeuten",       transl:"(to) mean"},
    {word:"vergleichen",        transl:"(to) compare"},              {word:"die Mediation",  transl:"mediation"},
    {word:"Notizen machen",     transl:"(to) take notes"},           {word:"weitergeben",    transl:"(to) pass sth. on"},
    {word:"übersetzen",         transl:"(to) translate"},
  ],
};
const DEFAULT_VSET3_DE_ID = "lingua_default_de_v3";
const DEFAULT_VSET3_DE = {
  id: DEFAULT_VSET3_DE_ID, name: "Schule, Geschichten & Gefühle 🎭", lang: "de", created: "2026-01-01T00:00:00.000Z",
  words: [
    {word:"interessant",                transl:"interesting"},        {word:"das Schulbuch",  transl:"schoolbook"},
    {word:"Na los!",                    transl:"Come on!"},           {word:"der Spickzettel",transl:"crib sheet"},
    {word:"die Notiz",                  transl:"note"},               {word:"geschehen",      transl:"(to) happen"},
    {word:"wiederholen",                transl:"(to) repeat"},        {word:"üben",           transl:"(to) practise"},
    {word:"die Übung",                  transl:"practice"},           {word:"die Technik",    transl:"technique"},
    {word:"das Publikum",               transl:"audience"},           {word:"das Orchester",  transl:"orchestra"},
    {word:"Tänzer/in",                  transl:"dancer"},             {word:"einatmen",       transl:"(to) breathe in"},
    {word:"sich entspannen",            transl:"(to) relax"},         {word:"lächeln",        transl:"(to) smile"},
    {word:"mit klarer Stimme",          transl:"in a clear voice"},   {word:"langsam",        transl:"slow"},
    {word:"schnell",                    transl:"fast"},               {word:"schüchtern",     transl:"shy"},
    {word:"müde",                       transl:"tired"},              {word:"unglücklich",    transl:"unhappy"},
    {word:"sich Sorgen machen",         transl:"(to) worry about"},   {word:"sich langweilen",transl:"(to) be bored"},
    {word:"einem Klub beitreten",       transl:"(to) join a club"},   {word:"die Geschichte", transl:"story"},
    {word:"die Gedankenblase",          transl:"thought bubble"},     {word:"der Gedanke",    transl:"thought"},
    {word:"während",                    transl:"while"},              {word:"genau in dem Moment", transl:"just then"},
    {word:"in diesem Moment",           transl:"at that moment"},     {word:"plötzlich",      transl:"suddenly"},
    {word:"immer",                      transl:"always"},             {word:"niemals",        transl:"never"},
    {word:"normalerweise",              transl:"usually"},            {word:"besser",         transl:"better"},
    {word:"echt",                       transl:"real"},               {word:"kaputt",         transl:"broken"},
    {word:"schmutzig",                  transl:"dirty"},              {word:"das Auge",       transl:"eye"},
    {word:"die Ziege",                  transl:"goat"},
    {word:"Es ist nicht einmal echt.",  transl:"It isn't even real."},
    {word:"aufhören",                   transl:"(to) stop"},          {word:"piepen",         transl:"(to) beep"},
    {word:"flüstern",                   transl:"(to) whisper"},       {word:"waschen",        transl:"(to) wash"},
    {word:"reparieren",                 transl:"(to) fix"},           {word:"aufpassen",      transl:"(to) look after sb."},
    {word:"verändern",                  transl:"(to) change"},
  ],
};
const DEFAULT_VSET4_DE_ID = "lingua_default_de_v4";
const DEFAULT_VSET4_DE = {
  id: DEFAULT_VSET4_DE_ID, name: "Unterwegs 🏙️", lang: "de", created: "2026-01-01T00:00:00.000Z",
  words: [
    {word:"unterwegs",                  transl:"out and about"},      {word:"berühmt",            transl:"famous (for)"},
    {word:"die Sehenswürdigkeit",       transl:"sight"},              {word:"das Kunstwerk",      transl:"work of art"},
    {word:"Pommes frites",              transl:"chips"},              {word:"das Viertel",        transl:"neighbourhood"},
    {word:"seltsam",                    transl:"strange"},            {word:"der Gehweg",         transl:"pavement"},
    {word:"folgen",                     transl:"follow"},             {word:"der Briefkasten",    transl:"post box"},
    {word:"das Postamt",                transl:"post office"},        {word:"sich umdrehen",      transl:"turn around"},
    {word:"verstecken",                 transl:"hide"},               {word:"der Schlüssel",      transl:"key"},
    {word:"magisch",                    transl:"magical"},            {word:"der Meter",          transl:"metre"},
    {word:"Fremdenführer/in",          transl:"guide"},              {word:"Besucher/in",        transl:"visitor"},
    {word:"die Bäckerei",               transl:"bakery"},             {word:"meilenweit",         transl:"for miles"},
    {word:"draußen",                    transl:"outside"},            {word:"gegenüber",          transl:"opposite sth."},
    {word:"die Bank",                   transl:"bench"},              {word:"die Aussicht",       transl:"view (of)"},
    {word:"das Wetter",                 transl:"weather"},            {word:"sonnig",             transl:"sunny"},
    {word:"bewölkt",                    transl:"cloudy"},             {word:"windig",             transl:"windy"},
    {word:"stürmisch",                  transl:"stormy"},             {word:"regnerisch",         transl:"rainy"},
    {word:"regnen",                     transl:"rain"},               {word:"schneebedeckt",      transl:"snowy"},
    {word:"schneien",                   transl:"snow"},               {word:"hochsehen",          transl:"look up"},
    {word:"weinen",                     transl:"cry"},                {word:"grauenhaft",         transl:"horrible"},
    {word:"der Traum",                  transl:"dream"},              {word:"schlafen",           transl:"sleep"},
    {word:"wütend werden",              transl:"get angry"},          {word:"knurren",            transl:"growl"},
    {word:"besorgt",                    transl:"worried"},            {word:"mutig",              transl:"brave"},
    {word:"das Gefühl",                 transl:"feeling"},            {word:"ernst",              transl:"serious"},
    {word:"seufzen",                    transl:"sigh"},               {word:"hell",               transl:"bright"},
    {word:"arm",                        transl:"poor"},               {word:"hinterherrennen",    transl:"run after sb."},
    {word:"langsamer werden",           transl:"slow down"},          {word:"auf Zehenspitzen gehen", transl:"tiptoe"},
    {word:"abreißen",                   transl:"tear sth. off"},      {word:"heben",              transl:"lift"},
    {word:"wedeln",                     transl:"wag"},                {word:"klingeln",           transl:"ring"},
    {word:"schwarz werden",             transl:"go black"},           {word:"kosten",             transl:"cost"},
    {word:"das Pfund (£)",              transl:"pound (£)"},          {word:"teuer",              transl:"expensive"},
    {word:"verkaufen",                  transl:"sell"},               {word:"der Kunde",          transl:"customer"},
    {word:"die Fahrt",                  transl:"ride"},               {word:"das Kino",           transl:"cinema"},
    {word:"das Glas",                   transl:"glass"},              {word:"das Juwel",          transl:"jewel"},
    {word:"die Maschine",               transl:"machine"},            {word:"aufräumen",          transl:"tidy sth."},
    {word:"Geschirr abwaschen",         transl:"wash the dishes"},    {word:"trocknen",           transl:"dry"},
    {word:"das Haar",                   transl:"hair"},               {word:"Zahn/Zähne",         transl:"tooth/teeth"},
    {word:"putzen",                     transl:"clean"},              {word:"der Vorhang",        transl:"curtain"},
    {word:"das Licht",                  transl:"light"},              {word:"der Käfig",          transl:"cage"},
    {word:"das Werkzeug",               transl:"tool"},               {word:"verschlossen",       transl:"locked"},
    {word:"das Papier",                 transl:"paper"},              {word:"die Schriftart",     transl:"font"},
    {word:"die Größe",                  transl:"size"},               {word:"der Titel",          transl:"title"},
    {word:"oben",                       transl:"at the top"},         {word:"unten",              transl:"at the bottom"},
    {word:"die Bildunterschrift",       transl:"caption"},            {word:"schön",              transl:"beautiful"},
    {word:"der Boden",                  transl:"ground"},             {word:"speichern",          transl:"save"},
    {word:"rechts",                     transl:"on the right"},       {word:"links",              transl:"on the left"},
    {word:"die Mitte",                  transl:"middle"},             {word:"der Hintergrund",    transl:"background"},
    {word:"der Vordergrund",            transl:"foreground"},         {word:"die Beschreibung",   transl:"description"},
    {word:"verbinden",                  transl:"connect"},            {word:"jemand",             transl:"somebody"},
    {word:"gestern",                    transl:"yesterday"},          {word:"alles",              transl:"everything"},
    {word:"mehr als",                   transl:"more than"},          {word:"als Nächstes",       transl:"next"},
    {word:"wenn",                       transl:"if"},                 {word:"immer noch",         transl:"still"},
    {word:"stattdessen",                transl:"instead"},            {word:"ehrlich",            transl:"honestly"},
    {word:"schnell",                    transl:"quick"},              {word:"verrückt",           transl:"crazy"},
    {word:"groß",                       transl:"tall"},               {word:"still",              transl:"silent"},
    {word:"wessen?",                    transl:"whose?"},             {word:"einschalten",        transl:"turn sth. on"},
    {word:"ausschalten",                transl:"turn sth. off"},      {word:"erscheinen",         transl:"appear"},
    {word:"passen",                     transl:"match sth."},         {word:"entscheiden",        transl:"decide"},
    {word:"vorschlagen",                transl:"suggest sth."},       {word:"wetten",             transl:"bet"},
    {word:"in Schwierigkeiten sein",    transl:"be in trouble"},      {word:"die Wahrheit",       transl:"truth"},
    {word:"die Rettung",                transl:"rescue (noun)"},      {word:"retten",             transl:"rescue"},
    {word:"der Vorschlag",              transl:"suggestion"},         {word:"die Gewohnheit",     transl:"habit"},
    {word:"der Befehl",                 transl:"order"},              {word:"die Polizei",        transl:"police"},
    {word:"das Projekt",                transl:"project"},            {word:"verschwenden",       transl:"waste sth."},
    {word:"kaputtmachen",               transl:"break sth."},         {word:"jn. dazu bringen",  transl:"make sb. do sth."},
    {word:"jn. bitten",                transl:"ask sb. to do sth."}, {word:"die beste Maschine aller Zeiten", transl:"the best machine ever"},
    {word:"Ich traue meinen Augen nicht.", transl:"I can't believe my eyes."},
    {word:"Was ist los?",               transl:"What's the matter?"}, {word:"Verschone mich!",   transl:"Give me a break!"},
    {word:"Was sonst noch?",            transl:"What else?"},
  ],
};

// Seed the built-in sets — always overwrites defaults so stale localStorage
// data (wrong field names, old format, missing translations) never persists.
// User-created sets (numeric timestamp IDs) are untouched.
function seedDefaultVSet() {
  const DEFAULTS = [
    DEFAULT_VSET, DEFAULT_VSET2, DEFAULT_VSET3, DEFAULT_VSET4,           // English sets (en)
    DEFAULT_VSET_ES, DEFAULT_VSET2_ES, DEFAULT_VSET3_ES, DEFAULT_VSET4_ES, // Spanish sets (es)
    DEFAULT_VSET_DE, DEFAULT_VSET2_DE, DEFAULT_VSET3_DE, DEFAULT_VSET4_DE, // German sets (de)
  ];
  const defaultIds = new Set(DEFAULTS.map(d => d.id));
  const sets = loadVSets();
  const userSets = sets.filter(s => !defaultIds.has(s.id));
  saveVSets([...userSets, ...DEFAULTS]);
}

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
  const body = {model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages};
  if (system != null) body.system = system;
  const res = await fetch("/api/chat",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(body),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message||"API error");
  return data.content?.[0]?.text || "";
}

// Vision variant — sends an image + text prompt, returns text
async function aiImage(base64, mediaType, prompt, maxTokens=2000) {
  const res = await fetch("/api/chat",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:maxTokens,
      messages:[{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:mediaType,data:base64}},
        {type:"text",text:prompt},
      ]}],
    }),
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
  // Strip emoji and other pictographic symbols before speaking
  const clean = text
    .replace(/\p{Emoji_Presentation}/gu, "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!clean) return;
  const u = new SpeechSynthesisUtterance(clean);
  u.lang=lang; u.rate=rate; u.pitch=1; u.volume=1;
  window.speechSynthesis.speak(u);
}

/* ─────────────────────────────────────────────────────────────
   AUTO-CORRECTION PARSER
───────────────────────────────────────────────────────────── */
function parseAiResponse(raw) {
  const mFix  = raw.match(/<fix>([\s\S]*?)<\/fix>/);
  const mGram = raw.match(/<gram>([\s\S]*?)<\/gram>/);
  // Extract phonetic line (🔤 ... to end of that line)
  const mPhon = raw.match(/🔤\s*(.+)/);
  const phonetic = mPhon ? mPhon[1].trim() : null;
  const text  = raw
    .replace(/<fix>[\s\S]*?<\/fix>/g, "")
    .replace(/<gram>[\s\S]*?<\/gram>/g, "")
    .replace(/\n?🔤\s*.+/g, "")
    .trim();
  let fix = null, gram = null;
  if (mFix)  try { fix  = JSON.parse(mFix[1].trim());  } catch {}
  if (mGram) try { gram = JSON.parse(mGram[1].trim()); } catch {}
  // Never return empty text — strip any stray tags and fall back to ellipsis
  return {text: text || raw.replace(/<[^>]+>/g,"").trim() || "…", fix, gram, phonetic};
}

// Strip extra props so Anthropic never sees fields like `fix` or `id`
function toApiMsgs(msgs) {
  return msgs.map(m => ({role: m.role, content: m.content}));
}

/* ─────────────────────────────────────────────────────────────
   UPDATE PROMPT  (PWA service-worker update toast)
───────────────────────────────────────────────────────────── */
const CHECK_INTERVAL_MS = 60 * 60 * 1000; // re-check every hour

function UpdatePrompt() {
  const [reloading, setReloading] = useState(false);
  const { needRefresh: [needRefresh, setNeedRefresh] } = useRegisterSW({
    onRegisteredSW(_swUrl, reg) {
      if (!reg) return;
      const tick = () => reg.update().catch(() => {});
      const id = setInterval(tick, CHECK_INTERVAL_MS);
      const onVis = () => { if (document.visibilityState === "visible") tick(); };
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("focus", tick);
      return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("focus", tick); };
    },
  });

  async function applyUpdate() {
    if (reloading) return;
    setReloading(true);
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      const target = reg?.waiting || reg?.installing;
      if (target) {
        const done = { fired: false };
        const reload = () => { if (!done.fired) { done.fired = true; window.location.reload(); } };
        navigator.serviceWorker.addEventListener("controllerchange", reload, { once: true });
        target.postMessage({ type: "SKIP_WAITING" });
        setTimeout(reload, 1500);
      } else {
        window.location.reload();
      }
    } catch { window.location.reload(); }
  }

  if (!needRefresh) return null;

  return createPortal(
    <div onClick={e => e.stopPropagation()} style={{
      position:"fixed", left:"50%", bottom:"calc(16px + env(safe-area-inset-bottom))",
      transform:"translateX(-50%)", width:"calc(100% - 32px)", maxWidth:480,
      display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
      background:"var(--a-surf)", color:"var(--a-cream)",
      border:"1px solid var(--a-border)",
      boxShadow:"0 10px 30px rgba(0,0,0,.35)",
      borderRadius:14, zIndex:2147483647,
    }}>
      <span style={{fontSize:20, flexShrink:0}}>⟳</span>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontFamily:"var(--a-sans)", fontSize:14, fontWeight:600, lineHeight:1.3}}>
          A new version is available
        </div>
        <div style={{fontFamily:"var(--a-sans)", fontSize:12, opacity:.65, marginTop:2}}>
          Reload to get the latest fixes and features.
        </div>
      </div>
      <button onClick={applyUpdate} disabled={reloading} style={{
        flexShrink:0, border:"none", background:"var(--a-gold)", color:"var(--a-bg)",
        fontFamily:"var(--a-sans)", fontWeight:700, fontSize:12,
        letterSpacing:".06em", textTransform:"uppercase",
        padding:"10px 16px", borderRadius:8, cursor: reloading ? "not-allowed" : "pointer",
        opacity: reloading ? .7 : 1, whiteSpace:"nowrap",
      }}>
        {reloading ? "Updating…" : "Update"}
      </button>
      <button onClick={() => setNeedRefresh(false)} aria-label="Dismiss" style={{
        flexShrink:0, border:"none", background:"transparent",
        color:"rgba(255,255,255,.45)", cursor:"pointer",
        padding:8, fontSize:16, lineHeight:1,
      }}>✕</button>
    </div>,
    document.body
  );
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
.prog-fill{height:100%;background:var(--a-gold);border-radius:4px;transition:width .6s ease;}

/* ═══ STAR FLASH & LEVEL-UP TOAST ═══ */
@keyframes starFloat{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}80%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-60%) scale(.9)}}
.star-flash{position:fixed;left:50%;top:48%;z-index:9999;pointer-events:none;
  font:800 18px/1 var(--a-sans);color:var(--a-gold);
  background:var(--a-surf2);border:1.5px solid rgba(201,148,58,.55);
  border-radius:24px;padding:8px 18px;
  box-shadow:0 6px 28px rgba(0,0,0,.45);
  animation:starFloat 2s ease both;}
@keyframes levelSlide{0%{opacity:0;transform:translateX(-50%) translateY(-10px) scale(.95)}12%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}82%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-6px)}}
.level-toast{position:fixed;top:64px;left:50%;z-index:9999;pointer-events:none;
  background:linear-gradient(135deg,#C9943A 0%,#E5B86A 100%);
  color:#0F1B2D;border-radius:24px;padding:10px 24px;
  font:700 13.5px/1 var(--a-sans);letter-spacing:.01em;
  box-shadow:0 8px 28px rgba(201,148,58,.45);
  animation:levelSlide 3.2s ease forwards;white-space:nowrap;}
@keyframes starPop{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}
.star-count{color:var(--a-gold);font-weight:700;font-size:13px;letter-spacing:.01em;transition:color .2s;}
.star-count.pop{animation:starPop .35s ease;}

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

/* ── Skill level picker ── */
.skill-section{margin-bottom:20px;}
.skill-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--a-muted);margin-bottom:8px;display:flex;align-items:center;gap:8px;}
.skill-label span{font-size:10px;font-weight:500;color:var(--a-mutedD);letter-spacing:0;text-transform:none;}
.skill-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
.skill-btn{background:var(--a-surf);border:1px solid var(--a-border);border-radius:10px;padding:8px 4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .18s;}
.skill-btn:hover{border-color:var(--a-muted);}
.skill-btn.on{border-color:var(--a-gold);background:rgba(201,148,58,.08);}
.skill-btn-emoji{font-size:18px;line-height:1;}
.skill-btn-label{font-size:10px;font-weight:700;color:var(--a-cream);letter-spacing:.02em;}
.skill-btn-cefr{font-size:9px;color:var(--a-muted);}
.skill-btn.on .skill-btn-label{color:var(--a-gold);}
.skill-btn.on .skill-btn-cefr{color:rgba(201,148,58,.7);}
.skill-progress{font-size:10px;color:var(--a-muted);margin-top:7px;text-align:center;}
.skill-levelup{font-size:10px;color:var(--a-gold);margin-top:5px;text-align:center;animation:fadeUp .3s ease both;}

/* ── Lessons track ── */
.lessons-hdr{display:flex;align-items:center;gap:10px;padding:4px 0 14px;}
.lessons-hdr-title{font-family:var(--a-serif);font-size:20px;font-weight:600;color:var(--a-cream);flex:1;}
.lessons-intro{font-size:12.5px;color:var(--a-muted);margin-bottom:18px;line-height:1.6;}
.lesson-list{display:flex;flex-direction:column;gap:10px;padding-bottom:24px;}
.lesson-card-row{background:var(--a-surf);border:1px solid var(--a-border);border-radius:16px;padding:14px 15px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all .18s;}
.lesson-card-row:hover{border-color:var(--a-muted);}
.lesson-card-row.done{border-color:rgba(72,199,120,.4);background:rgba(72,199,120,.05);}
.lc-icon{font-size:24px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;background:var(--a-surf2);border-radius:12px;flex-shrink:0;}
.lc-body{flex:1;min-width:0;}
.lc-title{font-weight:700;font-size:13.5px;color:var(--a-cream);}
.lc-desc{font-size:11.5px;color:var(--a-muted);margin-top:2px;}
.lc-meta{font-size:10.5px;color:var(--a-mutedD);margin-top:3px;}
.lc-arrow{font-size:16px;color:var(--a-muted);}

/* ── Lesson player ── */
.player-wrap{display:flex;flex-direction:column;flex:1;padding:0 2px;}
.player-topbar{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.player-title{flex:1;text-align:center;font-size:13px;font-weight:600;color:var(--a-cream);}
.player-pbar-wrap{height:5px;background:var(--a-surf2);border-radius:5px;margin-bottom:18px;overflow:hidden;}
.player-pbar{height:100%;background:var(--a-gold);border-radius:5px;transition:width .35s ease;}
.player-card-face{background:var(--a-surf);border:1px solid var(--a-border);border-radius:20px;padding:28px 20px;text-align:center;cursor:pointer;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;transition:background .15s;flex:1;}
.player-card-face:active{background:var(--a-surf2);}
.player-script{font-size:54px;line-height:1.1;color:var(--a-cream);direction:rtl;}
.player-roman{font-size:17px;color:var(--a-gold);font-style:italic;}
.player-tap{font-size:10.5px;color:var(--a-mutedD);letter-spacing:.07em;text-transform:uppercase;margin-top:8px;}
.player-reveal{display:flex;flex-direction:column;align-items:center;gap:5px;animation:fadeUp .2s ease both;margin-top:10px;}
.player-english{font-size:16px;font-weight:600;color:var(--a-cream);}
.player-hint{font-size:11.5px;color:var(--a-muted);line-height:1.55;max-width:260px;}
.player-speak-btn{margin-top:10px;background:var(--a-surf2);border:1px solid var(--a-border);border-radius:10px;padding:7px 16px;font-size:13px;color:var(--a-cream);cursor:pointer;display:inline-flex;align-items:center;gap:6px;}
.player-speak-btn:hover{border-color:var(--a-muted);}
.player-nav{display:flex;align-items:center;gap:10px;margin-top:14px;padding-bottom:6px;}
.player-nav-prev{background:var(--a-surf);border:1px solid var(--a-border);border-radius:11px;padding:11px 18px;font-size:15px;color:var(--a-cream);cursor:pointer;flex-shrink:0;}
.player-nav-prev:disabled{opacity:.3;cursor:not-allowed;}
.player-nav-ctr{font-size:11.5px;color:var(--a-muted);min-width:48px;text-align:center;}
.player-nav-next{background:var(--a-gold);border:none;border-radius:11px;padding:11px 0;font-size:14px;font-weight:700;color:var(--a-bg);cursor:pointer;flex:1;}
.player-nav-next:hover{background:var(--a-goldL);}
.player-done-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:14px;text-align:center;padding:20px;}
.player-done-icon{font-size:60px;}
.player-done-title{font-family:var(--a-serif);font-size:26px;font-weight:600;color:var(--a-cream);}
.player-done-sub{font-size:13.5px;color:var(--a-muted);line-height:1.65;max-width:280px;}

/* ── Script guide button ── */
.script-guide-row{margin-bottom:18px;}
.script-guide-btn{width:100%;background:rgba(37,99,235,.1);border:1px solid rgba(37,99,235,.3);border-radius:11px;padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all .18s;color:var(--a-cream);}
.script-guide-btn:hover{background:rgba(37,99,235,.18);border-color:rgba(37,99,235,.5);}
.script-guide-btn-icon{font-size:20px;}
.script-guide-btn-text{flex:1;text-align:left;}
.script-guide-btn-title{font-size:13px;font-weight:600;}
.script-guide-btn-sub{font-size:11px;color:var(--a-muted);margin-top:1px;}

/* ── Script guide modal ── */
.sg-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:900;display:flex;align-items:flex-end;justify-content:center;}
.sg-sheet{background:var(--a-surf);border-radius:22px 22px 0 0;width:100%;max-width:520px;max-height:85vh;display:flex;flex-direction:column;animation:slideUp .28s ease both;}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.sg-header{padding:16px 18px 12px;border-bottom:1px solid var(--a-border);display:flex;align-items:center;gap:10px;flex-shrink:0;}
.sg-title{flex:1;font-family:var(--a-serif);font-size:20px;font-weight:600;color:var(--a-cream);}
.sg-close{background:none;border:none;color:var(--a-muted);font-size:22px;cursor:pointer;padding:4px 8px;border-radius:8px;}
.sg-close:hover{color:var(--a-cream);}
.sg-note{font-size:11.5px;color:var(--a-muted);line-height:1.55;padding:10px 18px;border-bottom:1px solid var(--a-border);flex-shrink:0;}
.sg-body{overflow-y:auto;padding:14px;}
.alpha-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.alpha-card{background:var(--a-surf2);border:1px solid var(--a-border);border-radius:12px;padding:10px 8px;text-align:center;}
.alpha-letter{font-size:28px;line-height:1;color:var(--a-cream);direction:rtl;}
.alpha-name{font-size:10px;font-weight:700;color:var(--a-gold);margin:4px 0 1px;letter-spacing:.04em;}
.alpha-roman{font-size:10px;color:var(--a-muted);}
.alpha-ex{font-size:10px;color:var(--a-cream);margin-top:4px;direction:rtl;}
.alpha-ex-en{font-size:9px;color:var(--a-mutedD);font-style:italic;}

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
.phon-line{font-size:12px;color:var(--a-muted);font-style:italic;margin-top:3px;padding:0 2px;direction:ltr;line-height:1.5;letter-spacing:.02em;}
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
/* ── Session-end screen ── */
.se-shell{background:var(--a-bg);}
.se-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:40px 24px;text-align:center;}
.se-scroll{flex:1;overflow-y:auto;padding:28px 20px 40px;display:flex;flex-direction:column;gap:0;}
.se-flag{font-size:44px;text-align:center;margin-bottom:12px;}
.se-headline{font-family:var(--a-serif);font-size:24px;font-weight:700;color:var(--a-cream);text-align:center;margin:0 0 14px;line-height:1.25;}
.se-covered{font-size:14px;color:var(--a-muted);line-height:1.65;text-align:center;margin:0 0 24px;}
.se-section{margin-bottom:22px;}
.se-sec-label{font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--a-gold);margin-bottom:10px;}
.se-item{font-size:13.5px;line-height:1.55;color:var(--a-cream);padding:8px 12px;border-radius:10px;margin-bottom:6px;}
.se-win{background:rgba(72,199,120,.08);border:1px solid rgba(72,199,120,.2);}
.se-can{background:var(--a-surf2);border:1px solid var(--a-border);}
.se-nextstep{background:var(--a-goldT);border:1px solid rgba(201,148,58,.3);border-radius:12px;padding:14px 16px;font-size:13.5px;color:var(--a-cream);line-height:1.6;margin-bottom:18px;}
.se-nextstep-label{display:block;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--a-gold);margin-bottom:6px;}
.se-closing{font-size:13px;color:var(--a-muted);font-style:italic;text-align:center;margin:0 0 28px;}
.se-actions{display:flex;flex-direction:column;gap:0;}
/* Kids session-end */
.kse-label{font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--k-inkSoft);margin-bottom:8px;}
.kse-item{font-size:13.5px;font-weight:700;color:var(--k-ink);padding:8px 12px;border-radius:12px;margin-bottom:6px;}
.kse-learn{background:rgba(106,197,148,.15);border:2px solid rgba(106,197,148,.35);}
.kse-can{background:var(--k-paper);border:2px solid var(--k-border);}
.kse-challenge{background:rgba(255,193,7,.12);border:2px solid rgba(255,193,7,.35);border-radius:14px;padding:12px 16px;font-size:13.5px;font-weight:700;color:var(--k-ink);line-height:1.55;margin-bottom:16px;}
.kse-chal-label{font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:#c08000;margin-bottom:6px;}
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
.ks{height:100svh;overflow:hidden;display:flex;flex-direction:column;background:var(--k-bg);font-family:var(--k-sans);}
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

/* ── Grammar-in-context pill ── */
.gram-pill{margin-top:6px;background:rgba(123,168,200,.14);border:1.5px solid rgba(123,168,200,.4);
  border-radius:8px;padding:5px 10px;font-size:0.72rem;line-height:1.5;color:#4A7CA0;font-family:var(--k-sans);}
.gram-pill strong{color:#2D5F80;}

/* ── Word-exposure progress bar ── */
.exp-bar-wrap{display:flex;align-items:center;gap:5px;margin-top:3px;}
.exp-bar{flex:1;height:4px;background:rgba(45,37,33,.1);border-radius:4px;overflow:hidden;}
.exp-bar-fill{height:100%;border-radius:4px;background:#3F7A5E;transition:width .4s ease;}
.exp-count{font-size:9px;font-weight:800;color:var(--k-mute);white-space:nowrap;}

/* ── Reflection modal overlay ── */
.reflect-drop{position:fixed;inset:0;background:rgba(10,16,26,.82);backdrop-filter:blur(4px);
  z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;}
.reflect-card{background:var(--k-paper);border:2px solid var(--k-border);border-radius:24px;
  padding:28px 24px;width:100%;max-width:380px;animation:scaleIn .22s ease;text-align:center;}
.reflect-card h3{font-family:var(--k-display);font-size:22px;font-weight:600;
  color:var(--k-ink);margin:10px 0 6px;}
.reflect-card p{font-family:var(--k-sans);font-size:13px;color:var(--k-inkSoft);
  font-weight:600;margin-bottom:16px;line-height:1.5;}
.reflect-ta{width:100%;border:2px solid var(--k-border);border-radius:14px;padding:11px 14px;
  font-family:var(--k-sans);font-size:14px;font-weight:600;color:var(--k-ink);
  background:var(--k-bg);resize:none;outline:none;height:80px;
  transition:border-color .2s;margin-bottom:10px;}
.reflect-ta:focus{border-color:var(--k-primary);}
.reflect-btn{width:100%;background:var(--k-primary);color:#fff;border:none;border-radius:14px;
  padding:13px;font-family:var(--k-sans);font-size:15px;font-weight:800;cursor:pointer;
  transition:all .2s;}
.reflect-btn:hover{background:var(--k-primaryD);}
.reflect-skip{font-family:var(--k-sans);font-size:12px;color:var(--k-mute);font-weight:700;
  cursor:pointer;margin-top:10px;display:block;background:none;border:none;}

/* ── Reading practice screen ── */
.read-passage{background:var(--k-paper);border:2px solid var(--k-border);border-radius:18px;
  padding:18px;margin-bottom:16px;font-family:var(--k-sans);font-size:15px;line-height:1.85;
  color:var(--k-ink);font-weight:600;}
.read-meta{font-size:10.5px;font-weight:800;color:var(--k-mute);text-transform:uppercase;
  letter-spacing:.08em;margin-bottom:10px;}
.read-qcard{background:var(--k-paper2);border:2px solid var(--k-border);border-radius:16px;padding:16px;margin-bottom:12px;}
.read-q{font-family:var(--k-sans);font-weight:800;font-size:15px;color:var(--k-ink);margin-bottom:12px;}
.read-opt{display:block;width:100%;text-align:left;padding:10px 14px;border-radius:12px;
  margin-bottom:6px;font-family:var(--k-sans);font-weight:700;font-size:13.5px;
  background:var(--k-paper);border:2px solid var(--k-border);color:var(--k-ink);
  cursor:pointer;transition:all .15s;}
.read-opt:hover{border-color:var(--k-ink);}
.read-opt.correct{background:rgba(63,122,94,.12);border-color:#3F7A5E;color:#2E6B50;}
.read-opt.wrong{background:rgba(224,120,86,.1);border-color:#E07856;color:#B05030;}
.read-result{padding:24px;text-align:center;background:var(--k-paper);
  border:2px solid var(--k-border);border-radius:18px;}

/* ── Word Match game ── */
.match-card{padding:9px 8px;border-radius:12px;font-size:12.5px;font-weight:600;
  cursor:pointer;text-align:center;min-height:52px;width:100%;
  display:flex;align-items:center;justify-content:center;line-height:1.3;
  border:2px solid;transition:background .16s,border-color .16s,color .16s;
  word-break:break-word;white-space:pre-wrap;}
.match-card.idle{background:var(--a-surf);border-color:var(--a-border);color:var(--a-cream);}
@media(hover:hover){.match-card.idle:hover{border-color:var(--a-gold);background:var(--a-goldT);}}
.match-card.selected{background:var(--a-goldT);border-color:var(--a-gold);color:var(--a-gold);}
.match-card.wrong{background:rgba(255,100,100,.12);border-color:#FF7070;color:#FF9090;
  animation:shake .46s ease both;}
.match-card.matched{background:rgba(72,199,120,.15);border-color:#48C778;color:#48C778;
  pointer-events:none;animation:matchPop .3s ease both;}
@keyframes matchPop{0%{transform:scale(1)}40%{transform:scale(1.07)}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}60%{transform:translateX(8px)}}
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

function UiLangPicker({uiLang, setUiLang, label}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:5}}>
      {label && (
        <span style={{fontSize:10,fontWeight:700,color:"var(--a-muted)",
          textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>
          {label}
        </span>
      )}
      <div className="ui-lang-picker">
        {UI_LANGS_LIST.map(l=>(
          <button key={l} className={`ui-lang-btn${uiLang===l?" active":""}`}
            onClick={()=>{ setUiLang(l); saveLS(SK_UILNG,l); sfx.click(); }}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function NativeLangPicker() {
  const {nativeLang, setNativeLang} = useContext(Ctx);
  return (
    <div className="ui-lang-picker">
      {UI_LANGS_LIST.map(l=>(
        <button key={l} className={`ui-lang-btn${nativeLang===l?" active":""}`}
          onClick={()=>{ setNativeLang(l); sfx.click(); }}>
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

// Kids-mode level bar — same logic, warm honey palette
function KidsLevelBar({stars}) {
  const lvl  = computeLevel(stars);
  const name = LEVEL_NAMES[lvl];
  const curr = LEVEL_THRESHOLDS[lvl];
  const next = LEVEL_THRESHOLDS[lvl+1] ?? curr+1000;
  const pct  = Math.min(100,((stars-curr)/(next-curr))*100);
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 16px",
      background:"var(--k-paper)",borderBottom:"2px solid var(--k-border)",fontSize:12}}>
      <span style={{color:"#E8943B",fontWeight:800,fontFamily:"var(--k-sans)"}}>⭐ {stars}</span>
      <span style={{background:"#FFF0CC",border:"1.5px solid #F4D060",borderRadius:20,
        padding:"2px 9px",fontSize:11,fontWeight:800,color:"#9A6010",fontFamily:"var(--k-sans)"}}>
        {name}
      </span>
      <div style={{flex:1,height:5,background:"var(--k-border)",borderRadius:5,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:"#E8943B",
          borderRadius:5,transition:"width .6s ease"}}/>
      </div>
      <span style={{fontSize:"0.68rem",color:"var(--k-mute)",fontFamily:"var(--k-sans)"}}>Lv{lvl+1}</span>
    </div>
  );
}

function StarFlash({flashes}) {
  if (!flashes.length) return null;
  return createPortal(
    <>{flashes.map(f=>(
      <div key={f.id} className="star-flash">+{f.n} ⭐</div>
    ))}</>,
    document.body
  );
}

function LevelUpToast({msg}) {
  if (!msg) return null;
  return createPortal(
    <div className="level-toast">🎉 {msg}</div>,
    document.body
  );
}

/* ═══════════════════════════════════════════════════════════
   WORD OF DAY
═══════════════════════════════════════════════════════════ */
function FlashCards({words: initWords, t, onDone, onStars}) {
  const [queue,setQueue]     = useState(()=>[...initWords].sort(()=>Math.random()-.5));
  const [idx,setIdx]         = useState(0);
  const [flipped,setFlipped] = useState(false);
  const [mode,setMode]       = useState("flip");
  const [typeVal,setTypeVal] = useState("");
  const [typeResult,setTypeResult] = useState(null);

  const current = queue[idx];
  const done = !current;

  // Award stars once when the session completes (done flips true)
  useEffect(()=>{
    if (done && queue.length > 0) { const total=addStarsTo(5); onStars?.(total,5); }
  },[done]); // eslint-disable-line

  function resetDeck() {
    setQueue([...initWords].sort(()=>Math.random()-.5));
    setIdx(0); setFlipped(false); setTypeVal(""); setTypeResult(null);
  }

  if (done) return (
    <div style={{padding:28,textAlign:"center"}}>
      <div style={{fontSize:"2.5rem",marginBottom:8}}>🎉</div>
      <div style={{fontSize:"1.1rem",fontWeight:700,color:"var(--a-cream)",marginBottom:4}}>{t.allDone}</div>
      <div style={{fontSize:"0.85rem",color:"var(--a-muted)",marginBottom:20}}>+5 ⭐ earned!</div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="action-btn" onClick={onDone}>← {t.back}</button>
        <button className="action-btn primary" onClick={resetDeck}>🔄 Practice Again</button>
      </div>
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
    /* track word exposure */
    trackWordExposure(front);
    if (quality===2) sfx.correct(); else if (quality===0) sfx.wrong(); else sfx.click();
    setFlipped(false); setTypeVal(""); setTypeResult(null);
    setIdx(i=>i+1); // when i+1 >= queue.length → done=true → shows completion screen
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
function SetEditor({set: initSet, t, targetLang, onSave, onCancel}) {
  const [name,setName]         = useState(initSet?.name||"");
  const [words,setWords]       = useState(initSet?.words||[{word:"",transl:""}]);
  const [importing,setImporting] = useState(false);
  const fileRef = useRef();
  const {nativeLang} = useContext(Ctx);

  const addRow    = ()      => setWords(w=>[...w,{word:"",transl:""}]);
  const updateRow = (i,f,v) => setWords(w=>w.map((r,j)=>j===i?{...r,[f]:v}:r));
  const removeRow = (i)     => setWords(w=>w.filter((_,j)=>j!==i));

  const LANG_NAMES = {EN:"English",DE:"German",NL:"Dutch",FR:"French",ES:"Spanish"};
  const imgRef = useRef();

  async function importFile(e) {
    const file = e.target.files[0]; if (!file) return;
    setImporting(true);          // show spinner immediately
    e.target.value = "";

    let rawText = "";
    try { rawText = await file.text(); } catch { setImporting(false); return; }
    if (!rawText.trim()) { setImporting(false); return; }

    const targetLangName = LANGUAGES.find(l => l.code === targetLang)?.name || "English";
    const nativeLangName = LANG_NAMES[nativeLang] || "English";

    // ── Phase 1: instant display with simple delimiter parse ─────────────────
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const DELIMS = ["\t", ";", "|", ","];
    const best   = DELIMS
      .map(d => ({ d, n: lines.filter(l => l.includes(d)).length }))
      .sort((a, b) => b.n - a.n)[0];
    const delim  = best.n >= Math.max(1, lines.length * 0.3) ? best.d : null;
    const quickRows = delim
      ? lines.map(line => { const p = line.split(delim); return { word:(p[0]||"").trim(), transl:(p[1]||"").trim() }; }).filter(r => r.word)
      : lines.map(line => ({ word: line, transl: "" })).filter(r => r.word);

    if (quickRows.length === 0) { setImporting(false); return; }
    const existingRows = words.filter(x => x.word || x.transl);
    setWords([...existingRows, ...quickRows]);   // shown instantly while AI works

    // ── Phase 2: AI always re-parses — fixes column order + fills translations
    // (two-column files may have native lang first; single-column needs translation)
    try {
      const raw = await ai(
        [{ role: "user", content:
          `Parse this vocabulary file. The learner studies ${targetLangName}; their native language is ${nativeLangName}.\n` +
          `Rules:\n` +
          `- "word" = the ${targetLangName} word or phrase\n` +
          `- "transl" = the ${nativeLangName} translation\n` +
          `- Auto-detect which column is which (either language can appear first)\n` +
          `- If translation is missing, generate the correct ${nativeLangName} translation\n` +
          `- Skip any header rows\n` +
          `Return ONLY a JSON array, no markdown: [{"word":"...","transl":"..."},...]\n\n` +
          rawText.slice(0, 2500)
        }],
        "Output only a valid JSON array with word and transl fields. No markdown, no explanation.",
        2000
      );
      const m = raw.match(/\[[\s\S]*\]/);
      if (m) {
        const rows = JSON.parse(m[0]).filter(r => r.word);
        if (rows.length > 0) {
          setWords([...existingRows, ...rows]);   // replace Phase 1 with smart result
          setImporting(false);
          return;
        }
      }
    } catch { /* Phase 1 results stay — better than nothing */ }

    setImporting(false);
  }

  async function importImage(e) {
    const file = e.target.files[0]; if (!file) return;
    setImporting(true);
    e.target.value = "";
    const targetLangName = LANGUAGES.find(l => l.code === targetLang)?.name || "English";
    const nativeLangName = LANG_NAMES[nativeLang] || "English";
    try {
      // Read as base64
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload  = () => res(r.result.split(",")[1]); // strip data: prefix
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const mediaType = file.type || "image/jpeg";
      const prompt =
        `This image shows a vocabulary list from a textbook or worksheet.\n` +
        `The learner studies ${targetLangName}; their native language is ${nativeLangName}.\n` +
        `Extract every vocabulary pair you can see:\n` +
        `- "word" = the ${targetLangName} word or phrase\n` +
        `- "transl" = the ${nativeLangName} translation\n` +
        `If only one language column is visible, generate the ${nativeLangName} translation yourself.\n` +
        `Return ONLY a JSON array, no markdown: [{"word":"...","transl":"..."},...]`;
      const raw  = await aiImage(base64, mediaType, prompt, 2000);
      const m    = raw.match(/\[[\s\S]*\]/);
      if (m) {
        const rows = JSON.parse(m[0]).filter(r => r.word);
        if (rows.length > 0) {
          setWords(prev => [...prev.filter(x => x.word || x.transl), ...rows]);
          setImporting(false);
          return;
        }
      }
    } catch(err) { console.warn("Image import failed:", err); }
    setImporting(false);
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
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,fontSize:12,color:"var(--a-muted)"}}>
        <span>🗣 {LANG_NAMES[nativeLang]||"English"} → {LANGUAGES.find(l=>l.code===targetLang)?.flag||"🌐"} {LANGUAGES.find(l=>l.code===targetLang)?.name||"?"}</span>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:0}}>
        <button className="import-btn" style={{flex:1}} onClick={()=>fileRef.current.click()} disabled={importing}>
          {importing ? <><Dots/> Reading…</> : `📂 ${t.import}`}
        </button>
        <button className="import-btn" style={{flex:1,background:"rgba(201,148,58,.13)",borderColor:"rgba(201,148,58,.35)"}}
          onClick={()=>imgRef.current.click()} disabled={importing} title="Import from photo or image">
          {importing ? <><Dots/> Reading…</> : "📷 Photo / Scan"}
        </button>
      </div>
      <input ref={fileRef} type="file" accept=".txt,.csv,.tsv" style={{display:"none"}} onChange={importFile}/>
      <input ref={imgRef}  type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={importImage}/>
      {importing
        ? <div style={{padding:"20px 0",textAlign:"center",color:"var(--a-muted)",fontSize:13}}>
            <Dots/> Detecting words &amp; translating to {LANG_NAMES[nativeLang]}…
          </div>
        : words.map((row,i)=>(
          <div key={i} className="word-row">
            <input placeholder={t.wordLabel} value={row.word} onChange={e=>updateRow(i,"word",e.target.value)}/>
            <input placeholder={t.translLabel} value={row.transl} onChange={e=>updateRow(i,"transl",e.target.value)}/>
            <button className="del-btn" onClick={()=>removeRow(i)}>✕</button>
          </div>
        ))
      }
      {!importing && <button className="action-btn" style={{marginTop:5}} onClick={addRow}>+ {t.addWord}</button>}
      <div className="se-footer">
        <button className="se-btn" onClick={onCancel}>{t.cancel}</button>
        <button className="se-btn primary" onClick={save} disabled={importing}>{t.done}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OLLIE PRACTICE  (for vocab sets)
═══════════════════════════════════════════════════════════ */
function OlliePractice({words, kidLang, t, onDone, onStars}) {
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
      const total=addStarsTo(2); onStars?.(total,2);
    } catch {}
    setLoading(false);
  }

  return (
    <>
      {msgs.length===0 && (
        <div className="ollie-block">
          <OllieAvatar animate={ollieAnim}/>
          {loading && <div className="ollie-speech"><Dots/></div>}
        </div>
      )}
      <div className="chat-area scrollarea" style={{flex:1,overflowY:"auto",minHeight:0,maxHeight:220}}>
        {msgs.map((m,i)=>(
          <div key={i} className={`bubble ${m.role==="user"?"user":"ai"}`}>{m.content}</div>
        ))}
        {loading&&msgs.length>0 && <div className="bubble ai"><Dots/></div>}
        <div ref={bottomRef}/>
      </div>
      <div className="chat-input">
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder={t.startChat} rows={1}/>
        <button className="send-btn" onClick={send} disabled={loading||!input.trim()}>{t.send}</button>
      </div>
      <div className="chat-actions">
        <button className="action-btn" onClick={onDone}>← {t.back}</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   WORD MATCH  — deliberate matching game (5 pairs / batch)
   Pedagogical improvements over Duolingo:
   • Only 5 pairs (Miller's law — no overload)
   • Wrong answers stay — they come back until correct
   • No timer — deliberate thinking beats time pressure
   • Bidirectional toggle — study both directions
   • Exposure counter shown on correct match
═══════════════════════════════════════════════════════════ */
function WordMatch({ words, kidLang, t, onDone }) {
  const BATCH = 5;
  const { nativeLang } = useContext(Ctx);

  // Column headers: left = target language (w.word), right = native language (w.transl)
  // Fall back to role labels when both language names resolve to the same string.
  const NATIVE_NAMES = {EN:"English",DE:"German",NL:"Dutch",FR:"French",ES:"Spanish"};
  const nativeName = NATIVE_NAMES[nativeLang] || "Translation";
  const targetName = LANGUAGES.find(l => l.code === kidLang)?.name || "Word";
  const same = nativeName === targetName;
  // fwd=true:  left = w.word (target),  right = w.transl (native)
  // fwd=false: left = w.transl (native), right = w.word (target)
  const leftLabelFwd  = same ? "Word"        : targetName;
  const rightLabelFwd = same ? "Translation" : nativeName;

  // Only play with pairs that have BOTH sides filled in.
  // Empty transl → both columns would show the same word (the bug the user saw).
  const usable = (words || []).filter(w => w.word?.trim() && w.transl?.trim());

  const makeBatch = (pool) =>
    [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(BATCH, pool.length));
  const makeOrder = (n) =>
    [...Array(n).keys()].sort(() => Math.random() - 0.5);

  // All hooks unconditionally — early return comes AFTER
  const [fwd,       setFwd]       = useState(true);
  const [batch,     setBatch]     = useState(() => makeBatch(usable));
  const [lOrd,      setLOrd]      = useState(() => makeOrder(Math.min(BATCH, usable.length)));
  const [rOrd,      setROrd]      = useState(() => makeOrder(Math.min(BATCH, usable.length)));
  const [matched,   setMatched]   = useState(new Set());
  const [selL,      setSelL]      = useState(null);
  const [selR,      setSelR]      = useState(null);
  const [wrongKeys, setWrongKeys] = useState(new Set());
  const [locked,    setLocked]    = useState(false);
  const [totalDone, setTotalDone] = useState(0);
  const [expFlash,  setExpFlash]  = useState({});

  // fwd=true  → left column = transl (native lang), right = word (target lang)
  // fwd=false → left column = word  (target lang),  right = transl (native lang)
  const lHdr = fwd ? leftLabelFwd  : rightLabelFwd;
  const rHdr = fwd ? rightLabelFwd : leftLabelFwd;

  // ── No-translation guard (all hooks already called above) ──
  if (usable.length === 0) {
    return (
      <div style={{ padding:'28px 16px', textAlign:'center' }}>
        <button className="action-btn" onClick={onDone}
          style={{ marginBottom:20 }}>← {t.back}</button>
        <div style={{ fontSize:'2.4rem', marginBottom:10 }}>📝</div>
        <p style={{ color:'var(--a-cream)', fontWeight:600, marginBottom:8, fontSize:'1rem' }}>
          No translations in this set
        </p>
        <p style={{ color:'var(--a-muted)', fontSize:'0.84rem', lineHeight:1.6 }}>
          Word Match needs both a word <em>and</em> its translation.<br/>
          Open ✏️ Edit and fill in the translation column.
        </p>
      </div>
    );
  }

  function loadNext() {
    const next = makeBatch(usable);
    setBatch(next);
    setLOrd(makeOrder(next.length));
    setROrd(makeOrder(next.length));
    setMatched(new Set());
    setSelL(null); setSelR(null);
    setWrongKeys(new Set());
    setExpFlash({});
    setLocked(false);
  }

  function handleL(pos) {
    if (locked || matched.has(lOrd[pos]) || wrongKeys.has(`L${pos}`)) return;
    if (selL === pos) { setSelL(null); return; }
    setSelL(pos);
    if (selR !== null && !wrongKeys.has(`R${selR}`)) check(pos, selR);
  }

  function handleR(pos) {
    if (locked || matched.has(rOrd[pos]) || wrongKeys.has(`R${pos}`)) return;
    if (selR === pos) { setSelR(null); return; }
    setSelR(pos);
    if (selL !== null && !wrongKeys.has(`L${selL}`)) check(selL, pos);
  }

  function check(lPos, rPos) {
    if (lOrd[lPos] === rOrd[rPos]) {
      const pairIdx  = lOrd[lPos];
      const word     = batch[pairIdx];
      const exp      = trackWordExposure(word.word);
      const newMatch = new Set([...matched, pairIdx]);
      setMatched(newMatch);
      setExpFlash(prev => ({ ...prev, [pairIdx]: exp }));
      setTotalDone(n => n + 1);
      setSelL(null); setSelR(null);
      sfx.correct();
      if (newMatch.size === batch.length) setTimeout(loadNext, 720);
    } else {
      setLocked(true);
      setWrongKeys(new Set([`L${lPos}`, `R${rPos}`]));
      setSelL(null); setSelR(null);
      sfx.wrong();
      setTimeout(() => { setWrongKeys(new Set()); setLocked(false); }, 520);
    }
  }

  function cls(side, pos) {
    const idx = side === 'L' ? lOrd[pos] : rOrd[pos];
    if (matched.has(idx))                return 'match-card matched';
    if (wrongKeys.has(`${side}${pos}`))  return 'match-card wrong';
    const sel = side === 'L' ? selL === pos : selR === pos;
    return sel ? 'match-card selected' : 'match-card idle';
  }

  function txt(side, pos) {
    const idx = side === 'L' ? lOrd[pos] : rOrd[pos];
    const w   = batch[idx];
    if (!w) return '—';
    // fwd=true:  left = w.word (target language), right = w.transl (native/translation)
    // fwd=false: left = w.transl (native),        right = w.word  (target)
    return fwd
      ? (side === 'L' ? w.word   : w.transl)
      : (side === 'L' ? w.transl : w.word  );
  }

  return (
    <div style={{ padding: '0 2px' }}>
      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, flexWrap:'wrap' }}>
        <button className="action-btn" onClick={onDone}>← {t.back}</button>
        <span style={{ flex:1, textAlign:'center', fontWeight:600, fontSize:'0.85rem', color:'var(--a-cream)' }}>
          🎯 {totalDone} matched
        </span>
        <button className="action-btn" title="Swap sides"
          onClick={() => { setFwd(f => !f); setSelL(null); setSelR(null); }}>
          ⇄ flip
        </button>
      </div>

      {/* Column headers — actual language names, not generic labels */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
        {[lHdr, rHdr].map((h, i) => (
          <div key={i} style={{
            textAlign:'center', fontSize:'0.7rem', fontWeight:700,
            textTransform:'uppercase', letterSpacing:'.07em', color:'var(--a-gold)',
            paddingBottom:5, borderBottom:'1px solid var(--a-border)'
          }}>{h}</div>
        ))}
      </div>

      {/* Card grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
        {lOrd.map((_, pos) => (
          <Fragment key={pos}>
            <button className={cls('L', pos)} onClick={() => handleL(pos)}>
              {matched.has(lOrd[pos]) ? (
                <>
                  <span style={{ marginRight:5, fontSize:'1rem' }}>✓</span>
                  {txt('L', pos)}
                  {expFlash[lOrd[pos]] != null && (
                    <span style={{ fontSize:'0.67rem', opacity:.6, marginLeft:5 }}>
                      {expFlash[lOrd[pos]]}×
                    </span>
                  )}
                </>
              ) : txt('L', pos)}
            </button>
            <button className={cls('R', pos)} onClick={() => handleR(pos)}>
              {matched.has(rOrd[pos]) ? (
                <>
                  <span style={{ marginRight:5, fontSize:'1rem' }}>✓</span>
                  {txt('R', pos)}
                </>
              ) : txt('R', pos)}
            </button>
          </Fragment>
        ))}
      </div>

      <p style={{ marginTop:16, fontSize:'0.73rem', color:'var(--a-muted)', textAlign:'center', lineHeight:1.6 }}>
        Tap one card on each side · matched pairs turn green · wrong answers stay
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VOCAB SETS HUB
═══════════════════════════════════════════════════════════ */
function VocabSets({t, kidLang, onStars}) {
  const [view,setView]               = useState("list");
  const [editTarget,setEditTarget]   = useState(null);
  const [flashTarget,setFlashTarget] = useState(null);
  const [practTarget,setPractTarget] = useState(null);
  const [matchTarget,setMatchTarget] = useState(null);
  const [listKey,setListKey]         = useState(0);
  const [flashSession,setFlashSession] = useState(0); // incremented each time a set is opened
  const reload = () => setListKey(k=>k+1);

  if (view==="edit") return (
    <SetEditor set={editTarget} t={t} targetLang={kidLang||"en"}
      onSave={()=>{ setView("list"); reload(); }}
      onCancel={()=>setView("list")}/>
  );
  if (view==="flash"&&flashTarget) return (
    <>
      <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
        <button className="action-btn" onClick={()=>setView("list")}>← {t.back}</button>
        <span style={{fontWeight:600,fontSize:"0.88rem"}}>{flashTarget.name}</span>
      </div>
      <FlashCards key={flashSession} words={flashTarget.words} t={t} onDone={()=>setView("list")} onStars={onStars}/>
    </>
  );
  if (view==="practice"&&practTarget) return (
    <OlliePractice words={practTarget.words} kidLang={kidLang} t={t} onDone={()=>setView("list")} onStars={onStars}/>
  );
  if (view==="match"&&matchTarget) return (
    <WordMatch words={matchTarget.words} kidLang={kidLang} t={t} onDone={()=>setView("list")}/>
  );

  const sets = loadVSets().filter(s => !s.lang || s.lang === kidLang);
  return (
    <div className="vs-list" key={listKey}>
      <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
        <button className="action-btn primary"
          onClick={()=>{ setEditTarget(null); setView("edit"); sfx.click(); }}>
          + {t.newSet}
        </button>
        {sets.length >= 2 && (
          <>
            <button className="action-btn" title="Interleaved practice across all sets"
              onClick={()=>{
                const allWords = sets.flatMap(s=>s.words).sort(()=>Math.random()-.5).slice(0,30);
                setFlashTarget({id:"__mix__",name:"🔀 Mix",words:allWords});
                setFlashSession(n=>n+1); setView("flash"); sfx.click();
              }}>🔀 Mix All</button>
            <button className="action-btn" title="Word match across all sets"
              onClick={()=>{
                const allWords = sets.flatMap(s=>s.words).sort(()=>Math.random()-.5);
                setMatchTarget({id:"__mix_match__",name:"🔗 Mix Match",words:allWords});
                setView("match"); sfx.click();
              }}>🔗 Mix Match</button>
          </>
        )}
      </div>
      {sets.length===0 && (
        <p style={{color:"var(--muted)",fontSize:"0.86rem"}}>No sets yet — create one to get started!</p>
      )}
      {sets.map(s=>{
        /* average exposure toward the 7-exposure target */
        const avgExp = s.words.length > 0
          ? s.words.reduce((sum,w)=>sum+getWordExposure(w.word),0) / s.words.length : 0;
        const expPct = Math.min(100, (avgExp/7)*100);
        return (
          <div key={s.id} className="vs-item" style={{flexDirection:"column",alignItems:"stretch",gap:4}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span className="vs-name">{s.name}</span>
              <span className="vs-count">{s.words.length} words</span>
              <div className="vs-actions">
                <button className="vs-btn" title={t.flashcards}
                  onClick={()=>{ setFlashTarget(s); setFlashSession(n=>n+1); setView("flash"); sfx.click(); }}>🃏</button>
                <button className="vs-btn" title={t.practice}
                  onClick={()=>{ setPractTarget(s); setView("practice"); sfx.click(); }}>🤖</button>
                <button className="vs-btn" title="Word match"
                  onClick={()=>{ setMatchTarget(s); setView("match"); sfx.click(); }}>🔗</button>
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
            {/* Exposure progress — how many times words have been seen (target: 7×) */}
            {avgExp > 0 && (
              <div className="exp-bar-wrap">
                <div className="exp-bar">
                  <div className="exp-bar-fill" style={{width:`${expPct}%`}}/>
                </div>
                <span className="exp-count">{avgExp.toFixed(1)}× avg · goal 7×</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KIDS CHAT
═══════════════════════════════════════════════════════════ */

// Module-level constant — stable reference so filter comparisons never miss.
// Kept in the msgs array so the API history always starts with role:"user".
const GREET_TRIGGER = {
  role:"user",
  content:"Start now — greet the child and introduce the topic with one fun fact or question!",
};

function KidsChat({topic, kidLang, t, onStars, onExchange, onBack}) {
  const [msgs,setMsgs]             = useState([]);
  const [input,setInput]           = useState("");
  const [loading,setLoading]       = useState(false);
  const [greetFailed,setGreetFailed] = useState(false);
  const [retryKey,setRetryKey]     = useState(0);
  const [listenMode,setListenMode] = useState(false);
  const [dictVal,setDictVal]       = useState("");
  const [dictResult,setDictResult] = useState(null);
  const [currentAi,setCurrentAi]   = useState("");
  const [ollieAnim,setOllieAnim]   = useState(false);
  const [savedSet,setSavedSet]     = useState(new Set());
  const [sessionEnd,setSessionEnd] = useState(null);
  const [endLoading,setEndLoading] = useState(false);
  const bottomRef = useRef();
  const {uiLang}  = useContext(Ctx);
  const langObj   = KIDS_LANGS.find(l=>l.code===kidLang)||KIDS_LANGS[0];

  // Map UI language code to full language name for Ollie's instructions
  const UI_LANG_NAMES = {EN:"English",DE:"German",NL:"Dutch",FR:"French",ES:"Spanish"};
  const instrLang = UI_LANG_NAMES[uiLang] || "English";

  useEffect(()=>{
    setMsgs([]); setCurrentAi(""); setDictVal(""); setDictResult(null);
    setListenMode(false); setGreetFailed(false);
  },[topic,kidLang,uiLang]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  const system = `You are Ollie the owl 🦉, a fun tutor teaching children ${langObj.name}! Topic: "${topic}".
IMPORTANT: Give ALL explanations and instructions in ${instrLang}. Teach ${langObj.name} words/phrases.
Rules: max 2 SHORT sentences. Lots of emojis. Super encouraging. Always end with ONE simple question.
New words: bold them and give the ${instrLang} meaning in brackets like **word** [meaning].
If the child makes a ${langObj.name} grammar or spelling mistake, AFTER your reply append (no blank line):
<fix>{"err":"what they wrote","fix":"correct form","tip":"one short gentle tip in ${instrLang}"}</fix>
Only add <fix> for clear errors. Be very warm — never make them feel bad! No <fix> if no error.
Occasionally (once every few messages), when you naturally use a grammar pattern worth noticing, append:
<gram>{"pattern":"short name e.g. plural -s","example":"short example in ${langObj.name}","tip":"one-line tip in ${instrLang}"}</gram>
Only for genuinely useful patterns — never for basic vocabulary. Skip most of the time.`;

  function bounce() { setOllieAnim(true); setTimeout(()=>setOllieAnim(false),1500); }

  async function endSession() {
    if (endLoading) return;
    setEndLoading(true);
    const transcript = msgs.filter(m=>m.content&&m.content!==GREET_TRIGGER.content)
      .map(m=>`${m.role==="user"?"child":"ollie"}: ${m.content}`).join("\n");
    const fallback = {
      headline:`Great job today! 🦉⭐`,
      ollieSays:`You did amazing! I'm so proud of you for chatting in ${langObj.name} today!`,
      learned:[`${langObj.name} words and phrases`, `How to have a conversation`],
      nowYouCan:[`Use ${langObj.name} words from today's topic`],
      challenge:`Try to use one new word from today in a sentence next time!`,
      closing:`See you next time — keep being awesome! 🌟`,
    };
    if (msgs.filter(m=>m.role==="assistant").length < 1) {
      setSessionEnd(fallback); setEndLoading(false); return;
    }
    try {
      const raw = await ai([{role:"user",content:
        `You are Ollie the owl 🦉, writing a warm, fun, kid-friendly session review.\n` +
        `Look at this ${langObj.name} learning chat and reply with JSON only (no markdown):\n` +
        `{\n` +
        `  "headline": "Short fun celebration with 1–2 emojis, max 6 words",\n` +
        `  "ollieSays": "Ollie speaks directly to the child — 1–2 sentences, warm, silly, proud. Use 'you' and emojis.",\n` +
        `  "learned": ["2–3 specific words or phrases the child actually encountered in the chat"],\n` +
        `  "nowYouCan": ["1–2 simple real-world things the child can now do, starting with a verb"],\n` +
        `  "challenge": "One tiny fun challenge for next time — make it feel exciting not hard",\n` +
        `  "closing": "One short cheerful goodbye from Ollie with emojis"\n` +
        `}\n` +
        `RULES: Always positive and celebratory. Simple words a child understands. Lots of emojis.\n` +
        `Never mention mistakes. If the session was short, celebrate that they showed up!\n\n` +
        `Chat transcript:\n${transcript}`
      }], null, 400);
      let parsed;
      try { parsed = JSON.parse(raw.replace(/^```json\s*/,"").replace(/```\s*$/,"").trim()); }
      catch { parsed = fallback; }
      setSessionEnd(parsed);
    } catch { setSessionEnd(fallback); }
    setEndLoading(false);
  }

  useEffect(()=>{
    if (!topic) return;
    setLoading(true); setGreetFailed(false);
    ai([GREET_TRIGGER], system, 256)
      .then(text=>{
        // Store trigger + greeting so history is always user-first
        setMsgs([GREET_TRIGGER, {role:"assistant",content:text}]);
        setCurrentAi(text); bounce();
      })
      .catch(()=>{ setGreetFailed(true); })
      .finally(()=>setLoading(false));
  },[topic,kidLang,uiLang,retryKey]); // eslint-disable-line

  async function send() {
    if (!input.trim()||loading) return;
    sfx.send(); haptic([15]);
    const savedInput = input.trim();
    const prevMsgs   = msgs;
    const newMsgs    = [...msgs, {role:"user", content:savedInput}];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try {
      // Strip extra props (fix, gram, id, …) — Anthropic rejects unknown fields
      const apiMsgs = toApiMsgs(newMsgs);
      const raw  = await ai(apiMsgs, system, 400);
      const {text, fix, gram} = parseAiResponse(raw);
      setMsgs(m=>[...m, {role:"assistant", content:text, fix, gram}]);
      setCurrentAi(text); bounce();
      // Track vocab-set word exposures that appeared in Ollie's reply
      trackExposuresInText(text);
      const newTotal = addStarsTo(1); onStars?.(newTotal, 1);
      // Tell parent how many child turns have happened (for reflection prompt)
      const userCount = newMsgs.filter(m=>m.role==="user"&&m.content!==GREET_TRIGGER.content).length;
      onExchange?.(userCount);
    } catch(err) {
      console.warn("Kids chat send failed:", err);
      setMsgs(prevMsgs);      // roll back the optimistic user bubble
      setInput(savedInput);   // restore what the child typed
    } finally {
      setLoading(false);
    }
  }

  function checkDictation() {
    const norm = s=>s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,"").trim();
    const ok   = norm(dictVal)===norm(currentAi);
    setDictResult(ok?"ok":"err");
    if (ok) { sfx.correct(); haptic([30,10,30]); } else { sfx.wrong(); haptic([50]); }
  }

  /* ── Kids session-end screen ── */
  if (endLoading || sessionEnd) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,overflow:"hidden",
      background:"var(--k-bg)",fontFamily:"var(--k-sans)"}}>
      {endLoading ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          flex:1,padding:40,textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:12}}>🦉</div>
          <div style={{color:"var(--k-inkSoft)",fontSize:15,fontWeight:700,marginBottom:16}}>
            Ollie is thinking… ✨
          </div>
          <Dots/>
        </div>
      ) : (
        <div style={{flex:1,overflowY:"auto",padding:"28px 20px 40px",display:"flex",flexDirection:"column",gap:0}}>
          <div style={{fontSize:52,textAlign:"center",marginBottom:10}}>🦉</div>
          <h2 style={{fontFamily:"var(--k-sans)",fontSize:22,fontWeight:900,color:"var(--k-ink)",
            textAlign:"center",margin:"0 0 6px",lineHeight:1.2}}>{sessionEnd.headline}</h2>

          {sessionEnd.ollieSays && (
            <div style={{background:"var(--k-paper)",border:"2px solid var(--k-border)",borderRadius:16,
              padding:"12px 16px",fontSize:14,fontWeight:700,color:"var(--k-ink)",lineHeight:1.55,
              margin:"10px 0 20px",textAlign:"center"}}>
              {sessionEnd.ollieSays}
            </div>
          )}

          {sessionEnd.learned?.length > 0 && (
            <div style={{marginBottom:18}}>
              <div className="kse-label">🎒 {t.kidsSeeLearned}</div>
              {sessionEnd.learned.map((w,i)=>(
                <div key={i} className="kse-item kse-learn">{w}</div>
              ))}
            </div>
          )}

          {sessionEnd.nowYouCan?.length > 0 && (
            <div style={{marginBottom:18}}>
              <div className="kse-label">🚀 {t.kidsSeeCan}</div>
              {sessionEnd.nowYouCan.map((s,i)=>(
                <div key={i} className="kse-item kse-can">→ {s}</div>
              ))}
            </div>
          )}

          {sessionEnd.challenge && (
            <div className="kse-challenge">
              <div className="kse-chal-label">⚡ {t.kidsSeeChal}</div>
              {sessionEnd.challenge}
            </div>
          )}

          {sessionEnd.closing && (
            <p style={{fontSize:14,color:"var(--k-inkSoft)",textAlign:"center",
              fontWeight:700,margin:"6px 0 24px"}}>{sessionEnd.closing}</p>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button style={{width:"100%",background:"var(--k-ink)",color:"#fff",border:"none",
              borderRadius:14,padding:"13px",fontSize:14,fontWeight:800,cursor:"pointer",
              fontFamily:"var(--k-sans)"}}
              onClick={()=>setSessionEnd(null)}>
              💬 {t.keepChatting}
            </button>
            <button style={{width:"100%",background:"var(--k-paper)",color:"var(--k-inkSoft)",
              border:"2px solid var(--k-border)",borderRadius:14,padding:"11px",fontSize:13,
              fontWeight:800,cursor:"pointer",fontFamily:"var(--k-sans)"}}
              onClick={onBack}>
              ← {t.backToTopics}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    /* Bounded flex column — fills whatever space KidsMode gives it */
    <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,overflow:"hidden"}}>
      {/* Ollie greeting — only while waiting for first AI response */}
      {!msgs.some(m=>m.role==="assistant") && (
        <div className="ollie-block">
          <OllieAvatar animate={ollieAnim}/>
          {loading  && <div className="ollie-speech"><Dots/></div>}
          {greetFailed && !loading && (
            <div style={{textAlign:"center",marginTop:8}}>
              <div style={{fontSize:"0.82rem",color:"var(--k-mute)",marginBottom:8,fontFamily:"var(--k-sans)"}}>
                😕 Oops, couldn't connect…
              </div>
              <button className="action-btn" style={{background:"var(--k-accent)",color:"#fff",border:"none"}}
                onClick={()=>setRetryKey(k=>k+1)}>
                🔄 Try again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Full scrollable chat thread — hide the internal trigger message */}
      <div className="chat-area scrollarea" style={{flex:1,overflowY:"auto",minHeight:0}}>
        {msgs.filter(m=>m.content!==GREET_TRIGGER.content).map((m,i)=>(
          <div key={i} className={`bubble ${m.role==="user"?"user":"ai"}`} dir="auto">
            {m.content}
            {/* Kids-friendly correction pill */}
            {m.role==="assistant" && m.fix && (
              <div style={{marginTop:6,background:"rgba(248,224,180,.18)",border:"1px solid rgba(232,148,59,.35)",
                borderRadius:8,padding:"5px 9px",fontSize:"0.72rem",lineHeight:1.5}}>
                <span style={{fontSize:"0.75rem"}}>💡 </span>
                <span style={{color:"#E08030",textDecoration:"line-through",marginRight:4}}>{m.fix.err}</span>
                {"→ "}
                <span style={{color:"#4CAF82",fontWeight:700}}>{m.fix.fix}</span>
                {m.fix.tip && <span style={{color:"var(--a-muted)",fontStyle:"italic",marginLeft:4}}>({m.fix.tip})</span>}
              </div>
            )}
            {m.role==="assistant" && m.gram && (
              <div className="gram-pill">
                📐 <strong>{m.gram.pattern}</strong>: <em>{m.gram.example}</em>
                {m.gram.tip && <> — {m.gram.tip}</>}
              </div>
            )}
            {m.role==="assistant" && !savedSet.has(m.content.slice(0,60)) && (
              <button className="action-btn" style={{marginTop:4,fontSize:"0.7rem"}} onClick={()=>{
                const kn=loadKNB();
                const snippet=m.content.slice(0,60);
                if (!kn.find(w=>w.text===snippet)) {
                  kn.unshift({text:snippet,lang:kidLang,date:new Date().toISOString()});
                  saveKNB(kn); sfx.save(); haptic([20]);
                  setSavedSet(s=>new Set([...s,snippet]));
                  const total=addStarsTo(3); onStars?.(total,3);
                }
              }}>💾</button>
            )}
            {m.role==="assistant" && savedSet.has(m.content.slice(0,60)) && (
              <span style={{fontSize:"0.7rem",color:"var(--green)",marginTop:4,display:"block"}}>✓</span>
            )}
          </div>
        ))}
        {loading && msgs.some(m=>m.role==="assistant") && <div className="bubble ai"><Dots/></div>}
        <div ref={bottomRef}/>
      </div>

      {/* Listen controls — anchored above input */}
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
            {t.hearSlower}
          </button>
          <input className="dictation-input" value={dictVal}
            onChange={e=>setDictVal(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")checkDictation();}}
            placeholder={t.typeHeard}/>
          <button className="fc-check-btn" onClick={checkDictation}>{t.good}</button>
          {dictResult && (
            <div className={`dict-result ${dictResult}`} style={{marginTop:6}}>
              {dictResult==="ok"?`✓ ${t.correct}!`:`✗ It was: "${currentAi}"`}
            </div>
          )}
        </div>
      )}

      <div className="chat-input">
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder={t.startChat} rows={1}/>
        <button className="send-btn" onClick={send} disabled={loading||!input.trim()}>{t.send}</button>
      </div>
      {msgs.filter(m=>m.role==="assistant").length>=1 && (
        <div style={{padding:"4px 12px 8px",display:"flex",justifyContent:"center"}}>
          <button style={{background:"none",border:"none",color:"var(--k-mute)",fontSize:12,
            fontFamily:"var(--k-sans)",fontWeight:700,cursor:"pointer",padding:"4px 8px",
            borderRadius:8,letterSpacing:".02em"}}
            onClick={endSession} disabled={endLoading}>
            {endLoading ? "…" : `✅ ${t.endSession}`}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KIDS MODE
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   SAVE MODAL
═══════════════════════════════════════════════════════════ */
function SaveModal({ text, lang, onClose, onStars }) {
  const [word, setWord] = useState(text?.split(/[\s,!?.]+/).find(w=>w.length>1)||"");
  const {t} = useContext(Ctx);
  return (
    <div className="mbdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>{t.saveToNotebook}</h3>
        <p>{t.saveToNbSub}</p>
        <input className="minput" value={word} onChange={e=>setWord(e.target.value)}
          placeholder={t.wordLabel} autoFocus/>
        <div className="mrow2">
          <button className="mcancel" onClick={onClose}>{t.cancel}</button>
          <button className="msave" onClick={()=>{
            if (!word.trim()) return;
            const added = addAdultWord(word.trim(), lang||"");
            if (added) { const total=addStarsTo(3); onStars?.(total,3); }
            onClose();
          }}>{t.save} →</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADULT CHAT  (new design, all old features)
═══════════════════════════════════════════════════════════ */
function AdultChat({lang, scenario, skillLevel="beginner", t, onStars, onBack}) {
  const [msgs,setMsgs]           = useState([]);
  const [input,setInput]         = useState("");
  const [loading,setLoading]     = useState(false);
  const [panels,setPanels]       = useState({});
  const [modal,setModal]         = useState(null);
  const [sessionEnd,setSessionEnd] = useState(null);
  const [endLoading,setEndLoading] = useState(false);
  const endRef = useRef();
  const langObj = LANGUAGES.find(l=>l.code===lang);

  // Track session count for progress analysis
  useEffect(()=>{
    saveSessions(lang, loadSessions(lang) + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const skillInstructions = {
    beginner:     "The learner is a complete beginner (A1). Use very simple vocabulary, short sentences, speak slowly. Introduce 1–2 new words per reply with a brief English gloss in brackets, e.g. 'Bonjour [Hello]!'.",
    elementary:   "The learner is elementary (A2). Use simple, everyday language. Occasionally gloss new words in brackets.",
    intermediate: "The learner is intermediate (B1–B2). Use natural language; avoid highly idiomatic or complex grammar.",
    advanced:     "The learner is advanced (C1–C2). Speak fully naturally with idioms, nuance, and cultural references.",
  }[skillLevel] || "";

  const scriptInstruction = langObj?.script && (skillLevel==="beginner"||skillLevel==="elementary")
    ? `PHONETICS: At the very end of your reply (before any <fix> tag), add one line starting with exactly the emoji 🔤 followed by the complete romanised transliteration of everything you wrote in ${langObj.name}. Keep it on a single line. Example for Hebrew: "שלום! מה שלומך?\n🔤 Shalom! Ma shlomkha?" — for Arabic: "مرحبا! كيف حالك؟\n🔤 Marhaban! Kayfa ḥālak?" — for Russian: "Привет! Как дела?\n🔤 Privet! Kak dela?"`
    : "";

  const sysPrompt = `You are a native ${langObj?.name} speaker in this real-life scenario: "${scenario}".
${skillInstructions}
${scriptInstruction}
CRITICAL: Reply ONLY in ${langObj?.name}. Max 2 short punchy sentences — this is a live conversation, not a lesson.
Stay in character, be natural and spontaneous. React to what the user says.
If they make a grammar/vocabulary error, append this AFTER your reply (no blank line):
<fix>{"err":"exact wrong phrase","fix":"correct form","tip":"one-line English tip"}</fix>
No <fix> if no error.`;

  useEffect(()=>{
    setMsgs([]); setSessionEnd(null); setEndLoading(false); setInput(""); setPanels({});
    setLoading(true);
    ai([{role:"user",content:"Start the conversation right now with one short opening line — stay in character!"}], sysPrompt, 120)
      .then(raw=>{ const {text,phonetic}=parseAiResponse(raw); setMsgs([{role:"assistant",content:text,phonetic,id:1}]); })
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
      const {text,fix,phonetic} = parseAiResponse(raw);
      if (fix) addError(fix);
      const newTotal = addStarsTo(2); onStars?.(newTotal, 2);
      setMsgs(p=>[...p,{role:"assistant",content:text,fix,phonetic,id:Date.now()+1}]);
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
      } else if (type==="phonetic") {
        const langName = langObj?.name || "this language";
        content = await ai([{role:"user",content:
          `Give ONLY the complete romanised phonetic transliteration of this ${langName} text — nothing else, no translation:\n"${text}"`
        }],null,200);
      } else {
        const raw = await ai([{role:"user",content:
          `Pronunciation guide. JSON only, no markdown:\n` +
          `{"phonetic":"IPA transcription","british":"British English note or empty","american":"American English note or empty","tips":"1-2 sentence tip for learners"}\n` +
          `Text: "${text}"`}],null,300);
        try { content=JSON.parse(raw.replace(/```json|```/g,"").trim()); }
        catch { content={phonetic:"",british:"",american:"",tips:raw}; }
      }
      setPanels(p=>({...p,[id]:{type,loading:false,content}}));
    } catch { setPanels(p=>({...p,[id]:{type,loading:false,content:"Could not load."}})); }
  }

  async function endSession() {
    if (endLoading) return;
    setEndLoading(true);
    const transcript = msgs.filter(m=>m.content).map(m=>`${m.role}: ${m.content}`).join("\n");
    const fallback = {
      headline:`Great session! 🌟`,
      covered:`You had a real ${langObj?.name} conversation today — that takes courage and curiosity.`,
      wins:["You engaged in a real conversation","You pushed through and kept going"],
      nowYouCan:[`Feel more comfortable starting a conversation in ${langObj?.name}`],
      nextStep:`Try another scenario next time — each one builds on the last.`,
      closing:`Every session counts. See you next time!`,
    };
    if (msgs.filter(m=>m.role==="assistant").length < 1) {
      setSessionEnd(fallback); setEndLoading(false); return;
    }
    try {
      const raw = await ai([{role:"user",content:
        `You are an uplifting language coach writing a warm, personal session review.\n` +
        `Analyse this ${langObj?.name} learning conversation and respond with JSON only (no markdown fences):\n` +
        `{\n` +
        `  "headline": "Short celebratory headline with one emoji, max 8 words",\n` +
        `  "covered": "2 sentences starting with 'You practiced…' — what scenario and topics came up",\n` +
        `  "wins": ["2–3 specific things the learner did well, citing actual moments from the chat"],\n` +
        `  "nowYouCan": ["2–3 concrete real-world skills they've practised, each starting with a verb e.g. 'Order…' 'Ask for…' 'Introduce…'"],\n` +
        `  "nextStep": "One warm forward-looking suggestion for next time — never mention what went wrong, frame it as exciting new territory",\n` +
        `  "closing": "One short uplifting personal sentence to end on"\n` +
        `}\n` +
        `RULES: NEVER use negative words (wrong, mistake, error, struggle, problem, failed, incorrect, difficulty).\n` +
        `Frame everything as progress and potential. Be honest and specific — don't make up things that didn't happen.\n` +
        `If the session was short, warmly acknowledge it was a solid start.\n\n` +
        `Conversation transcript:\n${transcript}`
      }], null, 500);
      let parsed;
      try { parsed = JSON.parse(raw.replace(/^```json\s*/,"").replace(/```\s*$/,"").trim()); }
      catch { parsed = fallback; }
      setSessionEnd(parsed);
    } catch { setSessionEnd(fallback); }
    setEndLoading(false);
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

  /* ── Session-end screen ── */
  if (endLoading || sessionEnd) return (
    <div className="cshell se-shell">
      {endLoading ? (
        <div className="se-loading">
          <div style={{fontSize:42,marginBottom:12}}>✨</div>
          <div style={{color:"var(--a-muted)",fontSize:14,marginBottom:18}}>{t.wrappingUp}</div>
          <Dots/>
        </div>
      ) : (
        <div className="se-scroll">
          <div className="se-flag">{langObj?.flag}</div>
          <h2 className="se-headline">{sessionEnd.headline}</h2>
          <p className="se-covered">{sessionEnd.covered}</p>

          {sessionEnd.wins?.length > 0 && (
            <div className="se-section">
              <div className="se-sec-label">✅ {t.seWins}</div>
              {sessionEnd.wins.map((w,i)=>(
                <div key={i} className="se-item se-win">{w}</div>
              ))}
            </div>
          )}

          {sessionEnd.nowYouCan?.length > 0 && (
            <div className="se-section">
              <div className="se-sec-label">🚀 {t.seNowYouCan}</div>
              {sessionEnd.nowYouCan.map((s,i)=>(
                <div key={i} className="se-item se-can">→ {s}</div>
              ))}
            </div>
          )}

          {sessionEnd.nextStep && (
            <div className="se-nextstep">
              <span className="se-nextstep-label">{t.seNextStep}</span>
              {sessionEnd.nextStep}
            </div>
          )}

          {sessionEnd.closing && (
            <p className="se-closing">{sessionEnd.closing}</p>
          )}

          <div className="se-actions">
            <button className="cta" onClick={()=>setSessionEnd(null)}>
              💬 {t.keepChatting}
            </button>
            <button className="action-btn" style={{marginTop:8,width:"100%",padding:"10px"}}
              onClick={onBack}>
              ← {t.backToScenarios}
            </button>
          </div>
        </div>
      )}
    </div>
  );

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
              {m.phonetic && (
                <div className="phon-line">🔤 {m.phonetic}</div>
              )}
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
                    onClick={()=>togglePanel(m.id,m.content,"translation")}>🇬🇧 {t.translate}</button>
                  <button className={`mact${panels[m.id]?.type==="pronunciation"?" on":""}`}
                    onClick={()=>togglePanel(m.id,m.content,"pronunciation")}>🔉 {t.pronounce}</button>
                  {langObj?.script && !m.phonetic && (
                    <button className={`mact${panels[m.id]?.type==="phonetic"?" on":""}`}
                      onClick={()=>togglePanel(m.id,m.content,"phonetic")}>🔤 {t.phonetic}</button>
                  )}
                  <button className="mact" onClick={()=>setModal({text:m.content,lang})}>📌 {t.save}</button>
                </div>
              )}
              {panels[m.id] && (
                <div className="mpanel">
                  {panels[m.id].loading ? <Dots/> : panels[m.id].type==="translation"
                    ? <><div className="plabel">{t.englishTransl}</div>{panels[m.id].content}</>
                    : panels[m.id].type==="phonetic"
                    ? <><div className="plabel">{t.phoneticGuide}</div><div className="pph">{panels[m.id].content}</div></>
                    : (()=>{const c=panels[m.id].content; return (<>
                        <div className="plabel">{t.pronGuide}</div>
                        {c.phonetic && <div className="pph">/{c.phonetic}/</div>}
                        {c.british  && <div className="ptip"><span style={{opacity:.6,fontSize:"0.75em"}}>🇬🇧 </span>{c.british}</div>}
                        {c.american && <div className="ptip"><span style={{opacity:.6,fontSize:"0.75em"}}>🇺🇸 </span>{c.american}</div>}
                        {c.tips && <div className="ptip" style={{marginTop:c.british||c.american?6:0}}>{c.tips}</div>}
                        {c.sounds && <div className="ptip" style={{marginTop:6}}>{t.watch} {c.sounds}</div>}
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
      <div className="hints">
        {HINTS_FOR(lang).map(h=><button key={h} className="hchip" onClick={()=>setInput(h)}>{h}</button>)}
      </div>
      <div className="chat-actions">
        {msgs.length>0 && <button className="action-btn" onClick={()=>{setMsgs([]);setPanels({});sfx.click();}}>{t.clear}</button>}
        {msgs.filter(m=>m.role==="assistant").length>=1 && (
          <button className="action-btn primary" onClick={endSession} disabled={endLoading}>
            {endLoading?<Dots/>:`✅ ${t.endSession}`}
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
      {modal && <SaveModal text={modal.text} lang={modal.lang} onStars={onStars} onClose={()=>{ setModal(null); sfx.save(); haptic([20,10,20]); }}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LESSON PLAYER  (flashcard-style lesson walker)
═══════════════════════════════════════════════════════════ */
function LessonPlayer({ lesson, langObj, onDone }) {
  const [idx,      setIdx]      = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const total = lesson.items.length;
  const item  = lesson.items[idx];

  function speak() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(item.s);
    u.lang = langObj.tts; u.rate = 0.78;
    window.speechSynthesis.speak(u);
  }

  function next() {
    if (idx + 1 >= total) {
      saveLS(`lingua_lesson_${lesson.id}`, true);
      setFinished(true);
    } else {
      setIdx(i => i + 1);
      setRevealed(false);
    }
  }

  function prev() {
    if (idx > 0) { setIdx(i => i - 1); setRevealed(false); }
  }

  if (finished) return (
    <div className="player-done-screen">
      <div className="player-done-icon">🎉</div>
      <div className="player-done-title">Lesson complete!</div>
      <div className="player-done-sub">
        You finished <strong>{lesson.title}</strong>.<br/>
        Keep going with the next lesson, or practise what you've learned in a conversation.
      </div>
      <button className="action-btn" style={{marginTop:6}} onClick={onDone}>← Back to Lessons</button>
    </div>
  );

  return (
    <div className="player-wrap">
      <div className="player-topbar">
        <button className="action-btn" onClick={onDone}>← Lessons</button>
        <span className="player-title">{lesson.title}</span>
      </div>
      <div className="player-pbar-wrap">
        <div className="player-pbar" style={{width:`${(idx/total)*100}%`}}/>
      </div>
      <div className="player-card-face" onClick={()=>setRevealed(r=>!r)}>
        <div className="player-script">{item.s}</div>
        <div className="player-roman">{item.r}</div>
        {!revealed && <div className="player-tap">tap to reveal</div>}
        {revealed && (
          <div className="player-reveal">
            <div className="player-english">{item.e}</div>
            {item.h && <div className="player-hint">{item.h}</div>}
            <button className="player-speak-btn" onClick={e=>{e.stopPropagation();speak();}}>
              🔊 Listen
            </button>
          </div>
        )}
      </div>
      <div className="player-nav">
        <button className="player-nav-prev" onClick={prev} disabled={idx===0}>‹</button>
        <span className="player-nav-ctr">{idx+1} / {total}</span>
        <button className="player-nav-next" onClick={next}>
          {idx+1===total?"Finish ✓":"Next ›"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LESSONS SCREEN  (lesson track list)
═══════════════════════════════════════════════════════════ */
function LessonsScreen({ langCode, langObj, onClose, onStartLesson }) {
  const lessons  = langCode==="he" ? HE_LESSONS : langCode==="ru" ? RU_LESSONS : AR_LESSONS;
  const langName = langObj.name;
  return (
    <div className="scr" style={{paddingTop:6}}>
      <div className="lessons-hdr">
        <button className="action-btn" onClick={onClose}>← Back</button>
        <div className="lessons-hdr-title">{langObj.flag} {langName} Lessons</div>
      </div>
      <p className="lessons-intro">
        Start here before jumping into conversation. Each lesson teaches you to read, pronounce, and use real {langName} — script first, then phrases, then real life.
      </p>
      <div className="lesson-list">
        {lessons.map(lesson=>{
          const done = loadLS(`lingua_lesson_${lesson.id}`, false);
          return (
            <div key={lesson.id} className={`lesson-card-row${done?" done":""}`}
              onClick={()=>onStartLesson(lesson)}>
              <div className="lc-icon">{done?"✅":lesson.emoji}</div>
              <div className="lc-body">
                <div className="lc-title">{lesson.title}</div>
                <div className="lc-desc">{lesson.desc}</div>
                <div className="lc-meta">{lesson.items.length} cards</div>
              </div>
              <div className="lc-arrow">{done?"":"›"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCRIPT GUIDE  (Hebrew / Arabic alphabet reference)
═══════════════════════════════════════════════════════════ */
function ScriptGuide({ langCode, onClose }) {
  const isRu = langCode === "ru";
  const isHe = langCode === "he";
  const data  = isHe ? HE_ALPHA : isRu ? RU_ALPHA : AR_ALPHA;
  const title = isHe ? "The Hebrew Aleph-Bet" : isRu ? "The Russian Alphabet (Cyrillic)" : "The Arabic Alphabet";
  const flag  = isHe ? "🇮🇱" : isRu ? "🇷🇺" : "🇸🇦";
  const note  = isHe
    ? "Hebrew reads right-to-left. Letters change slightly when final in a word (shown as X/X). Vowels are usually not written — you learn to read without them."
    : isRu
    ? "Russian uses the Cyrillic alphabet — 33 letters. Many look like English but some are 'false friends' (Р = R, Н = N, С = S). Left-to-right, same direction as English."
    : "Arabic reads right-to-left. Each letter has up to 4 forms depending on where it sits in a word. This guide shows the standalone form. Start with the sounds — script will click with practice.";
  const rtl = isHe || (!isRu && langCode === "ar");

  return createPortal(
    <div className="sg-overlay" onClick={onClose}>
      <div className="sg-sheet" onClick={e=>e.stopPropagation()}>
        <div className="sg-header">
          <span style={{fontSize:24}}>{flag}</span>
          <div className="sg-title">{title}</div>
          <button className="sg-close" onClick={onClose}>✕</button>
        </div>
        <p className="sg-note">{note}</p>
        <div className="sg-body">
          <div className="alpha-grid">
            {data.map(row=>(
              <div key={row.l} className="alpha-card">
                <div className="alpha-letter" style={{direction:rtl?"rtl":"ltr"}}>{row.l}</div>
                <div className="alpha-name">{row.n}</div>
                <div className="alpha-roman">{row.r}</div>
                <div className="alpha-ex">{row.ex}</div>
                <div className="alpha-ex-en">{row.xe}</div>
              </div>
            ))}
          </div>
          <p style={{marginTop:14,fontSize:10.5,color:"var(--a-muted)",lineHeight:1.6,textAlign:"center"}}>
            Tip: Chat at Beginner level — the AI will always add transliteration so you can read along while you learn the script.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ═══════════════════════════════════════════════════════════
   ADULT MODE  (new shell + all tabs)
═══════════════════════════════════════════════════════════ */
function AdultMode({t, stars, onStars}) {
  const [tab,setTab]           = useState("chat");
  const [lang,setLang]         = useState("es");
  const [scenIdx,setScenIdx]   = useState(0);
  const [inChat,setInChat]     = useState(false);
  const [skillLevel,setSkillLevelState] = useState(() => loadSkill("es"));
  const [showScript,setShowScript]      = useState(false);
  const [lessonsView,setLessonsView]    = useState(null); // null | "list" | "player"
  const [activeLesson,setActiveLesson]  = useState(null);
  const {onBack,uiLang,setUiLang} = useContext(Ctx);
  const langObj              = LANGUAGES.find(l=>l.code===lang);
  const sessions             = loadSessions(lang);

  function changeLang(code) {
    setLang(code); setScenIdx(0);
    setSkillLevelState(loadSkill(code));
    setLessonsView(null);
    sfx.click();
  }
  function changeSkill(lv) {
    setSkillLevelState(lv);
    saveSkill(lang, lv);
    sfx.click();
  }

  if (inChat) return (
    <div className="shell">
      <div className="topbar">
        <div className="topbar-logo">✦</div>
        <span className="topbar-title">Lingua</span>
        <span className="star-count">⭐ {stars}</span>
        <button className="ghost" onClick={()=>setInChat(false)}>← {t.scenario}</button>
        <button className="ghost" onClick={onBack}>{t.home}</button>
      </div>
      <AdultChat lang={lang} scenario={langObj?.scenarios[scenIdx]||""} skillLevel={skillLevel} t={t} onStars={onStars} onBack={()=>setInChat(false)}/>
    </div>
  );

  return (
    <><div className="shell">
      <div className="topbar">
        <div className="topbar-logo">✦</div>
        <span className="topbar-title">Lingua</span>
        <UiLangPicker uiLang={uiLang} setUiLang={(l)=>{setUiLang(l);saveLS(SK_UILNG,l);sfx.click();}}
          label={`🌐 ${t.appLang}`}/>
        <button className="ghost" onClick={onBack}>← {t.home}</button>
      </div>
      <LevelBadge stars={stars}/>
      <div className="tabs">
        {[["chat",t.chat],["notebook",t.notebook],["wod",t.wordOfDay],["idiom",t.idiomOfDay],["vocab",t.vocabSets]].map(([k,l])=>(
          <button key={k} className={`tab${tab===k?" on":""}`} onClick={()=>{setTab(k);sfx.click();}}>
            {l}
          </button>
        ))}
      </div>

      {tab==="chat" && lessonsView==="list" && (
        <LessonsScreen langCode={lang} langObj={langObj}
          onClose={()=>setLessonsView(null)}
          onStartLesson={l=>{setActiveLesson(l);setLessonsView("player");sfx.click();}}/>
      )}
      {tab==="chat" && lessonsView==="player" && activeLesson && (
        <div className="scr" style={{display:"flex",flexDirection:"column",flex:1}}>
          <LessonPlayer lesson={activeLesson} langObj={langObj}
            onDone={()=>{setLessonsView("list");setActiveLesson(null);}}/>
        </div>
      )}
      {tab==="chat" && !lessonsView && (
        <div className="scr">
          <h2 className="sh">{t.language}</h2>
          <p className="ss">{t.langSubhead}</p>
          <div className="lgrid">
            {LANGUAGES.map(l=>(
              <div key={l.code} className={`lcard${lang===l.code?" on":""}`}
                style={lang===l.code?{borderColor:l.accent,boxShadow:`0 4px 18px ${l.accent}28`}:{}}
                onClick={()=>changeLang(l.code)}>
                <span className="lflag">{l.flag}</span>
                <div className="linfo"><h4>{l.name}</h4><span dir="auto">{l.native}</span></div>
              </div>
            ))}
          </div>

          {/* ── Skill level picker ── */}
          <div className="skill-section">
            <div className="skill-label">
              Your level in {langObj?.name}
              <span>· {sessions} session{sessions!==1?"s":""}</span>
            </div>
            <div className="skill-grid">
              {SKILL_LEVELS.map(lv=>(
                <button key={lv.id} className={`skill-btn${skillLevel===lv.id?" on":""}`}
                  onClick={()=>changeSkill(lv.id)} title={lv.desc}>
                  <span className="skill-btn-emoji">{lv.emoji}</span>
                  <span className="skill-btn-label">{lv.label}</span>
                  <span className="skill-btn-cefr">{lv.cefr}</span>
                </button>
              ))}
            </div>
            {sessions >= 10 && skillLevel !== "advanced" && (
              <div className="skill-levelup">
                ✨ {sessions} sessions — ready to level up?
              </div>
            )}
          </div>

          {/* ── Lessons + Script guide (Hebrew / Arabic only) ── */}
          {langObj?.script && (
            <div className="script-guide-row" style={{display:"flex",flexDirection:"column",gap:8}}>
              {/* Lessons — primary CTA */}
              <button className="script-guide-btn"
                style={{background:"rgba(201,148,58,.1)",borderColor:"rgba(201,148,58,.35)"}}
                onClick={()=>{setLessonsView("list");sfx.click();}}>
                <span className="script-guide-btn-icon">📚</span>
                <div className="script-guide-btn-text">
                  <div className="script-guide-btn-title">
                    {lang==="he"?"Hebrew":lang==="ru"?"Russian":"Arabic"} Lessons
                  </div>
                  <div className="script-guide-btn-sub">
                    {(lang==="he"?HE_LESSONS:lang==="ru"?RU_LESSONS:AR_LESSONS).filter(l=>loadLS(`lingua_lesson_${l.id}`,false)).length}
                    {" / "}{lang==="he"?HE_LESSONS.length:lang==="ru"?RU_LESSONS.length:AR_LESSONS.length} lessons complete · start here!
                  </div>
                </div>
                <span style={{color:"var(--a-gold)"}}>›</span>
              </button>
              {/* Alphabet reference — secondary */}
              <button className="script-guide-btn" onClick={()=>setShowScript(true)}>
                <span className="script-guide-btn-icon">📜</span>
                <div className="script-guide-btn-text">
                  <div className="script-guide-btn-title">
                    {lang==="he"?"Hebrew Aleph-Bet":lang==="ru"?"Russian Cyrillic":"Arabic Alphabet"} — Quick Reference
                  </div>
                  <div className="script-guide-btn-sub">
                    {lang==="he"?"22":lang==="ru"?"33":"28"} letters with romanisation & example words
                  </div>
                </div>
                <span style={{color:"var(--a-muted)"}}>›</span>
              </button>
            </div>
          )}

          <div className="scen-head">{t.scenario}</div>
          <div className="scen-sub">{t.scenSub}</div>
          <div className="sgrid">
            {langObj?.scenarios.map((s,i)=>(
              <button key={s} className={`sbtn${scenIdx===i?" on":""}`} onClick={()=>{setScenIdx(i);sfx.click();}}>
                <span dir="auto">{s}</span>
                {scenIdx===i && <span className="sbtn-check">✓</span>}
              </button>
            ))}
          </div>
          <div className="cta-wrap">
            <button className="cta" onClick={()=>{setInChat(true);sfx.click();}}>
              {t.startConv}
            </button>
          </div>
        </div>
      )}
      {tab==="notebook" && <AdultNotebookScreen t={t}/>}
      {tab==="wod"      && <WodScreen lang={lang} t={t}/>}
      {tab==="idiom"    && <IdiomScreen lang={lang} t={t}/>}
      {tab==="vocab"    && <div className="scr"><VocabSets t={t} kidLang={lang} onStars={onStars}/></div>}
    </div>
    {showScript && <ScriptGuide langCode={lang} onClose={()=>setShowScript(false)}/>}
    </>
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
   REFLECTION MODAL  (metacognitive consolidation)
═══════════════════════════════════════════════════════════ */
function ReflectionModal({onDone}) {
  const [text, setText] = useState("");
  return (
    <div className="reflect-drop">
      <div className="reflect-card">
        <div style={{fontSize:"2.5rem"}}>🦉</div>
        <h3>Great session!</h3>
        <p>What was the most useful thing you learned today?<br/>
           <span style={{fontSize:"0.85em",opacity:.7}}>(Writing it helps it stick!)</span></p>
        <textarea className="reflect-ta" value={text} onChange={e=>setText(e.target.value)}
          placeholder="I learned…" autoFocus/>
        <button className="reflect-btn" onClick={()=>{
          if (text.trim()) saveReflection(text.trim());
          sfx.save(); haptic([20,10,20]); onDone();
        }}>
          {text.trim() ? "Save & Continue ✓" : "Skip →"}
        </button>
        <button className="reflect-skip" onClick={()=>{ sfx.click(); onDone(); }}>skip</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KIDS READING PRACTICE
═══════════════════════════════════════════════════════════ */
function KidsReadScreen({kidLang, t}) {
  const {uiLang} = useContext(Ctx);
  const [topic,   setTopic]   = useState(null);
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [qIdx,    setQIdx]    = useState(0);
  const [answered,setAnswered]= useState(null); // {chosen, correct}
  const [score,   setScore]   = useState(0);

  const UI_LANG_NAMES = {EN:"English",DE:"German",NL:"Dutch",FR:"French",ES:"Spanish"};
  const instrLang = UI_LANG_NAMES[uiLang] || "English";
  const langObj   = KIDS_LANGS.find(l=>l.code===kidLang) || KIDS_LANGS[0];

  function loadText(tp) {
    setTopic(tp); setData(null); setQIdx(0); setAnswered(null); setScore(0);
    const cacheKey = `lingua_read_${tp.id}_${kidLang}_${new Date().toISOString().slice(0,10)}`;
    const cached = loadLS(cacheKey, null);
    if (cached) { setData(cached); return; }
    setLoading(true);
    ai([{role:"user", content:
      `Write a fun reading exercise for children (age 8-12) learning ${langObj.name}. Topic: "${tp.labels.en}".
Write 55-70 words in ${langObj.name} at A1-A2 level. Keep sentences short and simple.
Then write 3 comprehension questions in ${instrLang}, each with 3 multiple-choice options.
Return ONLY valid JSON (no markdown):
{"text":"...","questions":[{"q":"...","options":["A","B","C"],"correct":0},...]}`
    }], "You write graded reading exercises for children. Output only valid JSON.", 700)
    .then(raw => {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) { const d = JSON.parse(m[0]); saveLS(cacheKey, d); setData(d); }
    })
    .catch(()=>{})
    .finally(()=>setLoading(false));
  }

  // Topic picker
  if (!topic) return (
    <div style={{overflowY:"auto",flex:1}}>
      <div className="kwel">
        <h1 style={{fontFamily:"var(--k-display)",fontSize:24,fontWeight:600,color:"var(--k-ink)",
          letterSpacing:"-.3px",lineHeight:1.15,marginBottom:6}}>
          📖 Reading Practice
        </h1>
        <p style={{fontFamily:"var(--k-sans)",fontSize:13,color:"var(--k-inkSoft)",fontWeight:600}}>
          Pick a topic and read with Ollie!
        </p>
      </div>
      <div className="ktgrid">
        {KIDS_TOPICS.map(tp=>(
          <button key={tp.id} className="tcard" style={{background:tp.color}}
            onClick={()=>{loadText(tp);sfx.click();haptic([15]);}}>
            <span className="temoji">{tp.emoji}</span>
            <span>{tp.labels[kidLang]||tp.labels.en}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const q = data?.questions?.[qIdx];

  return (
    <div style={{flex:1,overflowY:"auto",padding:16}}>
      <button className="action-btn" onClick={()=>setTopic(null)} style={{marginBottom:12}}>
        ← {t.back}
      </button>

      {loading && (
        <div style={{textAlign:"center",padding:48,color:"var(--k-mute)",
          fontFamily:"var(--k-sans)",fontWeight:700}}>
          <Dots/><div style={{marginTop:8}}>Preparing your story…</div>
        </div>
      )}

      {!loading && data && (
        <>
          {/* Reading passage */}
          <div className="read-passage">
            <div className="read-meta">{langObj.name} · {topic.emoji} {topic.labels[kidLang]||topic.labels.en}</div>
            {data.text}
            <button className="klisten-btn" style={{marginTop:12,display:"inline-block"}}
              onClick={()=>speak(data.text, langObj.tts, 0.78)}>
              🔊 {t.hearIt||"Hear it!"}
            </button>
          </div>

          {/* Comprehension questions */}
          {q && (
            <div className="read-qcard">
              <div style={{fontFamily:"var(--k-sans)",fontSize:10.5,fontWeight:800,
                color:"var(--k-mute)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>
                Question {qIdx+1} of {data.questions.length}
              </div>
              <div className="read-q">{q.q}</div>
              {q.options.map((opt, i) => {
                const isAnswered = answered !== null;
                const isCorrect  = i === q.correct;
                const isChosen   = answered?.chosen === i;
                return (
                  <button key={i} disabled={isAnswered}
                    className={`read-opt${isAnswered?(isCorrect?" correct":(isChosen?" wrong":"")):""}`}
                    onClick={()=>{
                      if (isAnswered) return;
                      const ok = i === q.correct;
                      setAnswered({chosen:i,correct:q.correct});
                      if (ok) { sfx.correct(); haptic([30,10,30]); setScore(s=>s+1); }
                      else   { sfx.wrong();   haptic([50]); }
                    }}>
                    {isAnswered?(isCorrect?"✓ ":(isChosen?"✗ ":"  ")):"   "}{opt}
                  </button>
                );
              })}
              {answered && (
                <button className="action-btn primary"
                  style={{marginTop:10,background:"var(--k-accent)",border:"none",color:"#fff",fontFamily:"var(--k-sans)"}}
                  onClick={()=>{ setQIdx(qi=>qi+1); setAnswered(null); sfx.click(); }}>
                  {qIdx+1 < data.questions.length ? "Next →" : "See result 🎉"}
                </button>
              )}
            </div>
          )}

          {/* Result screen */}
          {!q && data.questions?.length > 0 && (
            <div className="read-result">
              <div style={{fontSize:"2.8rem",marginBottom:8}}>
                {score===data.questions.length?"🏆":score>0?"⭐":"😊"}
              </div>
              <div style={{fontFamily:"var(--k-display)",fontSize:24,fontWeight:600,
                color:"var(--k-ink)",marginBottom:4}}>
                {score} / {data.questions.length} correct!
              </div>
              <div style={{fontFamily:"var(--k-sans)",fontSize:13,color:"var(--k-inkSoft)",
                fontWeight:600,marginBottom:20,lineHeight:1.5}}>
                {score===data.questions.length
                  ? "Perfect! You understood everything! 🌟"
                  : score>0 ? "Great reading! Keep it up! 📚"
                            : "Good try — read again and you'll get it! 💪"}
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="action-btn" onClick={()=>setTopic(null)}>← {t.back}</button>
                <button className="action-btn primary"
                  style={{background:"var(--k-accent)",border:"none",color:"#fff",fontFamily:"var(--k-sans)"}}
                  onClick={()=>{ setQIdx(0); setAnswered(null); setScore(0); sfx.click(); }}>
                  🔄 Try Again
                </button>
              </div>
            </div>
          )}
        </>
      )}
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
      <div className="knb-title">{t.funIdioms}</div>
      <div className="knb-sub">{t.kidsIdiomSub}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {KIDS_IDIOM_CATS.map(c=>(
          <button key={c} className={`kids-lang-btn${cat===c?" active":""}`}
            onClick={()=>{setCat(c);setData(null);sfx.click();}}>
            {c}
          </button>
        ))}
      </div>
      {loading && <div style={{padding:20,color:"var(--k-mute)",fontFamily:"var(--k-sans)",fontWeight:700}}><Dots/> {t.loading}</div>}
      {!loading && data && (
        <div className="kwcard" style={{flexDirection:"column",gap:8}}>
          <div style={{fontSize:48,textAlign:"center"}}>{data.emoji}</div>
          <div style={{fontFamily:"var(--k-display)",fontSize:22,fontWeight:600,color:"var(--k-ink)",textAlign:"center"}}>{data.phrase}</div>
          <div style={{fontFamily:"var(--k-sans)",fontSize:14,color:"var(--k-inkSoft)",fontWeight:600,textAlign:"center"}}>{data.meaning}</div>
          {data.example && <div style={{background:"var(--k-paper2)",border:"2px solid var(--k-border)",borderRadius:12,padding:"10px 14px",fontFamily:"var(--k-sans)",fontSize:13,color:"var(--k-ink)",fontWeight:700,marginTop:4}}>{data.example}</div>}
          <button className="listen-btn" style={{alignSelf:"center",marginTop:4}} onClick={()=>speak(data.phrase,langObj.tts,0.85)}>{t.hearIt}</button>
        </div>
      )}
    </div>
  );
}

function KidsMode({t, onStars, stars=0}) {
  const [tab,setTab]               = useState("chat");
  const [kidLang,setKidLang]       = useState(loadLS(SK_KIDLG,"en"));
  const [topic,setTopic]           = useState(null);
  const [chatExchanges,setChatExchanges] = useState(0); // user turns in current chat
  const [showReflect,setShowReflect]    = useState(false);
  const {onBack, uiLang, setUiLang} = useContext(Ctx);
  const nbCount              = loadKNB().length;

  function selectLang(code) { setKidLang(code); saveLS(SK_KIDLG,code); sfx.click(); haptic([15]); }

  // Called when user tries to leave a topic — show reflection modal if ≥ 2 exchanges
  function leaveTopic() {
    if (chatExchanges >= 2) { setShowReflect(true); }
    else { setTopic(null); setChatExchanges(0); }
  }

  return (
    <div className="ks">
      <div className="kh">
        <button className="khome-btn" onClick={onBack}>← {t.home}</button>
        <div className="kh-ollie">
          <OllieAvatar size={28}/>
          <span className="kh-title">Ollie's Language World</span>
        </div>
        {topic && <button className="khome-btn" onClick={leaveTopic}>← {t.topics}</button>}
        <UiLangPicker uiLang={uiLang} setUiLang={(l)=>{setUiLang(l);saveLS(SK_UILNG,l);sfx.click();}}
          label="🌐 App"/>
      </div>

      <div className="ktabs">
        {[["chat","📚 Learn"],["read","📖 Read"],["idiom","💬 Expressions"],["notebook","⭐ "+t.notebook],["vocab","🃏 "+t.vocabSets]].map(([k,l])=>(
          <button key={k} className={`ktab${tab===k?" on":""}`}
            onClick={()=>{setTab(k);setTopic(null);setChatExchanges(0);sfx.click();}}>
            {l}
          </button>
        ))}
      </div>
      <KidsLevelBar stars={stars}/>

      {tab==="chat" && (
        <>
          {!topic ? (
            <div style={{overflowY:"auto",flex:1}}>
              <div className="kwel">
                <h1 dangerouslySetInnerHTML={{__html:t.kidsWelH1}}/>
                <p>{t.kidsWelSub}</p>
              </div>
              {/* Language-to-learn picker */}
              <div style={{padding:"4px 16px 8px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontFamily:"var(--k-sans)",fontSize:11,fontWeight:800,
                  color:"var(--k-mute)",textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>
                  🗣 {t.learnLang}:
                </span>
                <div className="kids-lang-row" style={{padding:0,margin:0}}>
                  {KIDS_LANGS.map(l=>(
                    <button key={l.code} className={`kids-lang-btn${kidLang===l.code?" active":""}`}
                      onClick={()=>selectLang(l.code)}>
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ktgrid">
                {KIDS_TOPICS.map(tp=>(
                  <button key={tp.id} className="tcard" style={{background:tp.color}}
                    onClick={()=>{setTopic(tp);sfx.click();haptic([15]);}}>
                    <span className="temoji">{tp.emoji}</span>
                    <span>{tp.labels[kidLang]||tp.labels.en}</span>
                  </button>
                ))}
              </div>
              {nbCount>0 && (
                <div className="kids-recent">
                  <div className="kids-recent-label">{t.kidsRecent}</div>
                  <div className="kids-recent-card" onClick={()=>{setTab("notebook");setTopic(null);}}>
                    <span style={{fontSize:24}}>{KIDS_TOPICS[0].emoji}</span>
                    <div className="kids-recent-info">
                      <div className="kids-recent-name">{t.kidsWordBook}</div>
                      <div className="kids-recent-sub">{nbCount} word{nbCount!==1?"s":""} saved</div>
                    </div>
                    <div className="kids-recent-arr">›</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <KidsChat topic={topic.labels[kidLang]||topic.labels.en} kidLang={kidLang} t={t}
              onStars={onStars} onExchange={setChatExchanges} onBack={()=>setTopic(null)}/>
          )}
        </>
      )}
      {tab==="read"     && <KidsReadScreen kidLang={kidLang} t={t}/>}
      {tab==="idiom"    && <KidsIdiomScreen kidLang={kidLang} t={t}/>}
      {tab==="notebook" && <KidsNotebookScreen t={t}/>}
      {tab==="vocab"    && <div className="kids-wrap" style={{padding:14,flex:1,overflowY:"auto"}}><VocabSets t={t} kidLang={kidLang} onStars={onStars}/></div>}

      {/* Metacognitive reflection modal — shown when leaving a topic after ≥2 exchanges */}
      {showReflect && (
        <ReflectionModal onDone={()=>{
          setShowReflect(false); setTopic(null); setChatExchanges(0);
        }}/>
      )}
    </div>
  );
}

function KidsNotebookScreen({t}) {
  const [words,setWords] = useState(loadKNB());
  return (
    <div className="knb" style={{overflowY:"auto",flex:1}}>
      <div className="knb-title">{t.kidsWordBook}</div>
      <div className="knb-sub">{t.kidsWordBookSub}</div>
      {words.length===0 && <div className="knempty"><div className="ei">📖</div><p>{t.kidsWordBookEmpty}</p></div>}
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
  useEffect(()=>{ seedDefaultVSet(); }, []); // seed once on first mount
  const [mode,setMode]         = useState(loadLS("lingua_last_mode", null));
  const [uiLang,setUiLang]     = useState(loadLS(SK_UILNG,"EN"));
  const [nativeLang,setNativeLang] = useState(loadLS(SK_NATLNG,"EN"));
  const [stars,setStars]       = useState(getStarsData().total);
  const [flashes,setFlashes]   = useState([]);
  const [levelToast,setLevelToast] = useState("");
  const t = T[uiLang] || T.EN;

  function handleStars(newTotal, n=1) {
    const prevLvl = computeLevel(stars);
    const newLvl  = computeLevel(newTotal);
    setStars(newTotal);
    sfx.star();
    haptic([20,10,20,10,40]);
    // Floating "+N ⭐" toast
    const id = Date.now() + Math.random();
    setFlashes(f => [...f, {id, n}]);
    setTimeout(() => setFlashes(f => f.filter(x => x.id !== id)), 2100);
    // Level-up banner
    if (newLvl > prevLvl) {
      setTimeout(() => {
        setLevelToast(`${LEVEL_NAMES[newLvl]}! 🌟`);
        setTimeout(() => setLevelToast(""), 3400);
      }, 700);
    }
  }

  function goMode(m) { setMode(m); saveLS("lingua_last_mode", m); sfx.click(); }

  const ctx = {
    t, uiLang, setUiLang: (l)=>{ setUiLang(l); saveLS(SK_UILNG,l); },
    nativeLang, setNativeLang: (l)=>{ setNativeLang(l); saveLS(SK_NATLNG,l); },
    onBack:()=>{ setMode(null); saveLS("lingua_last_mode",null); }
  };

  return (
    <Ctx.Provider value={ctx}>
      <style>{CSS}{LOGIN_CSS}</style>
      <UpdatePrompt/>
      <StarFlash flashes={flashes}/>
      <LevelUpToast msg={levelToast}/>
      {mode==="adult" && <AdultMode t={t} stars={stars} onStars={handleStars}/>}
      {mode==="kids"  && <KidsMode  t={t} onStars={handleStars} stars={stars}/>}

      {!mode && (
        <div className="landing">
          <div className="l-orb1"/><div className="l-orb2"/>
          <div className="logo-row">
            <div className="logo-icon">✦</div>
            <div className="logo-name">Lingua</div>
            <UiLangPicker uiLang={uiLang} setUiLang={ctx.setUiLang}/>
          </div>
          <div className="l-hero">
            <h1 className="l-h1" dangerouslySetInnerHTML={{__html:t.landingH1}}/>
            <p className="l-sub">{t.landingSub}</p>
            <div className="p-cards">
              <button className="p-card" onClick={()=>goMode("adult")}>
                <div className="p-card-icon adult">✈</div>
                <div className="p-card-body">
                  <h3>{t.adultMode}</h3>
                  <p>{t.adultDesc}</p>
                </div>
                <div className="p-card-arr">›</div>
              </button>
              <button className="p-card" onClick={()=>goMode("kids")}>
                <div className="p-card-icon kids">🦉</div>
                <div className="p-card-body">
                  <h3>{t.kidsMode}</h3>
                  <p>{t.kidsDesc}</p>
                </div>
                <div className="p-card-arr">›</div>
              </button>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:18,padding:"14px 0",borderTop:"1px solid var(--a-border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:"var(--a-muted)",fontWeight:600,minWidth:140}}>🌐 {t.appLang}:</span>
              <UiLangPicker uiLang={uiLang} setUiLang={ctx.setUiLang}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:"var(--a-muted)",fontWeight:600,minWidth:140}}>🗣 {t.myNativeLang}:</span>
              <NativeLangPicker/>
            </div>
          </div>
          <div className="l-langs">🇬🇧 EN · 🇪🇸 ES · 🇫🇷 FR · 🇩🇪 DE · 🇮🇹 IT · 🇳🇱 NL</div>
        </div>
      )}
    </Ctx.Provider>
  );
}
