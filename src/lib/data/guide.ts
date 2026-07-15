// Content extracted verbatim from the legacy app's Příručka (guide) pane.
// Rich inline text is represented as arrays of plain strings / {b: string} (bold)
// / {i: string} (italic) segments, rendered by <RichText>.

export type Segment = string | { b: string } | { i: string };

export interface ParagraphBlock {
  type: "p";
  muted?: boolean;
  content: Segment[];
}

export interface ListBlock {
  type: "list";
  items: Segment[][];
}

export interface EntryBlock {
  type: "entry";
  name: string;
  meta?: string;
  desc: string;
}

export interface TipBlock {
  type: "tip";
  icon: string;
  content: Segment[];
}

export type GuideBlock = ParagraphBlock | ListBlock | EntryBlock | TipBlock;

export interface GuideItem {
  id: string;
  icon: string;
  title: string;
  defaultOpen?: boolean;
  blocks: GuideBlock[];
}

export const GUIDE_INTRO =
  "Rychlý průvodce světem Dungeons & Dragons. Klepni na sekci a rozbal si pravidla, povolání, rasy i tipy. Ať tě provází dobré hody!";

export const GUIDE_ITEMS: GuideItem[] = [
  {
    id: "what-is-dnd",
    icon: "📖",
    title: "Co je Dungeons & Dragons",
    defaultOpen: true,
    blocks: [
      {
        type: "p",
        content: [
          { b: "Dungeons & Dragons (D&D)" },
          " je stolní hra na hrdiny. Skupina hráčů společně vypráví dobrodružný příběh — každý hráč ovládá jednu ",
          { b: "postavu" },
          " (hrdinu), zatímco ",
          { b: "Pán jeskyně" },
          " (Dungeon Master, DM) řídí svět, příběh, nepřátele a rozhoduje o pravidlech.",
        ],
      },
      {
        type: "p",
        content: [
          "Není tu žádná herní deska ani vítěz — hraje se hlavně ",
          { b: "fantazií a vyprávěním" },
          ". Když je výsledek nejistý (souboj, přesvědčování, šplhání), rozhodne o něm ",
          { b: "hod kostkou" },
          ".",
        ],
      },
      {
        type: "p",
        muted: true,
        content: [
          "Potřebuješ jen sadu kostek, tužku, papír s postavou, představivost a partu přátel.",
        ],
      },
    ],
  },
  {
    id: "dice",
    icon: "🎲",
    title: "Kostky a jak se hází",
    blocks: [
      {
        type: "p",
        content: [
          "V D&D se používá sedm typů kostek. Zapisují se jako ",
          { b: "d" },
          " + počet stěn (např. ",
          { b: "d20" },
          " = dvacetistěnná kostka).",
        ],
      },
      {
        type: "list",
        items: [
          [{ b: "d4, d6, d8, d10, d12" }, " — zranění zbraní a kouzel"],
          [{ b: "d20" }, " — nejdůležitější: útoky, záchranné hody a ověření vlastností"],
          [{ b: "d100" }, " (d10 × 2) — procenta a náhodné tabulky"],
        ],
      },
      {
        type: "p",
        content: [
          { b: "Zápis hodů:" },
          " ",
          { i: "2d6 + 3" },
          " znamená „hoď dvěma šestistěnnými kostkami a přičti 3“. V appce si kostky do skupiny přidáš klepnutím na dlaždici (klepni na d6 dvakrát, malý − v rohu ubere), zadáš ",
          { b: "Modifikátor" },
          " a stiskneš ",
          { b: "Hodit" },
          " — klidně i s namíchanými typy kostek najednou (např. d4 + d6 + d20).",
        ],
      },
      {
        type: "p",
        content: [
          { b: "Výhoda / Nevýhoda:" },
          " při výhodě hodíš 2× d20 a bereš ",
          { b: "vyšší" },
          " číslo, při nevýhodě ",
          { b: "nižší" },
          ". (V appce: tlačítka ",
          { b: "Výhoda" },
          "/",
          { b: "Nevýhoda" },
          " hned vedle Hodit to udělají za tebe jedním klepnutím.)",
        ],
      },
      {
        type: "p",
        content: [
          { b: "Kritický zásah / selhání:" },
          " přirozená ",
          { b: "20" },
          " na d20 je kritický úspěch, přirozená ",
          { b: "1" },
          " je kritické selhání — appka je zvýrazní zeleně a červeně.",
        ],
      },
    ],
  },
  {
    id: "basic-rules",
    icon: "⚔️",
    title: "Základní pravidla",
    blocks: [
      {
        type: "p",
        content: [
          { b: "Jádro hry:" },
          " kdykoli je výsledek nejistý, hodíš ",
          { i: "1k20 + oprava vlastnosti (+ zdatnostní bonus)" },
          " a porovnáš se ",
          { b: "stupněm obtížnosti" },
          ". Když se mu vyrovnáš nebo ho překročíš, uspěješ.",
        ],
      },
      {
        type: "p",
        muted: true,
        content: ["Typický stupeň obtížnosti: snadné 10 · střední 15 · těžké 20."],
      },
      { type: "p", content: [{ b: "Tři základní hody (1k20):" }] },
      {
        type: "list",
        items: [
          [
            { b: "Ověření vlastnosti" },
            " — zvládneš danou akci? (např. Síla na šplhání, Charisma na přesvědčování).",
          ],
          [
            { b: "Hod na útok" },
            " — porovnáš s ",
            { b: "obranným číslem (OČ)" },
            " cíle. Základní OČ = 10 + oprava Obratnosti. Přirozená ",
            { b: "20" },
            " je vždy kritický zásah, ",
            { b: "1" },
            " vždy minutí.",
          ],
          [
            { b: "Záchranný hod" },
            " — abys odolal kouzlu, jedu, pádu apod. Stupeň obtížnosti kouzla = 8 + oprava + zdatnostní bonus sesílatele.",
          ],
        ],
      },
      {
        type: "p",
        content: [
          { b: "Výhoda a nevýhoda:" },
          " hodíš ",
          { i: "dvěma" },
          " k20 — s výhodou bereš ",
          { b: "vyšší" },
          ", s nevýhodou ",
          { b: "nižší" },
          ". (V appce: tlačítka Výhoda/Nevýhoda vedle Hodit.) Výhoda a nevýhoda se navzájem ruší na běžný hod.",
        ],
      },
      {
        type: "p",
        content: [
          { b: "Souboj po kolech:" },
          " na začátku každý hodí ",
          { i: "iniciativu" },
          " (1k20 + Obratnost) a určí se pořadí. Ve svém ",
          { b: "tahu" },
          " můžeš:",
        ],
      },
      {
        type: "list",
        items: [
          [{ b: "Pohyb" }, " — přesun až do své rychlosti."],
          [{ b: "Akce" }, " — jedna hlavní věc: útok, seslání kouzla, úprk, pomoc…"],
          [{ b: "Bonusová akce" }, " — jen pokud ti ji schopnost nebo kouzlo dovolí."],
          [{ b: "Reakce" }, " — jedna za kolo, i mimo tvůj tah (např. příležitostný útok)."],
        ],
      },
      {
        type: "p",
        content: [
          { b: "Životy (body výdrže):" },
          " při zásahu klesají. Na 0 postava padá k zemi a hází ",
          { i: "záchranu před smrtí" },
          " — 3 úspěchy dřív než 3 neúspěchy znamenají přežití.",
        ],
      },
      {
        type: "p",
        muted: true,
        content: ["Zlaté pravidlo: vždy rozhoduje Pán jeskyně a zábava u stolu."],
      },
    ],
  },
  {
    id: "character-creation",
    icon: "🎨",
    title: "Tvorba postavy — 4 volby",
    blocks: [
      {
        type: "p",
        content: [
          "V ",
          { b: "Jeskyních a dracích (JaD)" },
          ", české verzi D&D, vytvoříš postavu pomocí ",
          { b: "čtyř voleb" },
          ". Kniha se tě u každé zeptá a ty si vybereš — postava tak vznikne krok za krokem.",
        ],
      },
      {
        type: "entry",
        name: "1 · Skupinové zázemí",
        meta: "Volí celá družina společně",
        desc: "Jak se postavy znají a co je spojuje — jste hrdinové, členové řádu, zločinci, nebo cizinci svedení osudem dohromady? Toto je specialita JaD a určuje se jako první.",
      },
      {
        type: "entry",
        name: "2 · Rasa",
        meta: "Původ a schopnosti",
        desc: "Biologický původ postavy — dává bonusy k vlastnostem, zvláštní rysy (např. vidění ve tmě) a kulturní zázemí. Např. člověk, elf, trpaslík…",
      },
      {
        type: "entry",
        name: "3 · Osobní zázemí",
        meta: "Odkud pocházíš",
        desc: "Čím byla postava, než se vydala na dobrodružství. Dává zdatnosti v dovednostech, vybavení a kus příběhu — voják, učenec, poustevník, zloděj…",
      },
      {
        type: "entry",
        name: "4 · Povolání",
        meta: "Co umíš v akci",
        desc: "Dobrodružná profese, která určuje bojové schopnosti, kouzla a zvláštní síly. Viz sekce „Povolání\" níže.",
      },
      {
        type: "p",
        muted: true,
        content: [
          "Nakonec postavě dáš jméno, vzhled, cíle, ideály a osobnost — a hrdina ožije.",
        ],
      },
    ],
  },
  {
    id: "classes",
    icon: "🧙",
    title: "Povolání (třídy postav)",
    blocks: [
      { type: "p", content: ["Povolání určuje, co tvoje postava umí. Vyber si podle stylu, který tě baví."] },
      { type: "entry", name: "Alchymista", meta: "Inteligence · k8 · Vynálezce", desc: "Povolání z Jeskyní a draků — tvoří lektvary, výbušniny a alchymické vynálezy, kterými podporuje družinu i drtí nepřátele." },
      { type: "entry", name: "Barbar", meta: "Síla · k12 životů · Válečník", desc: "Zuřivý bojovník, který v bitevním běsu drtí nepřátele a vydrží obrovské zranění." },
      { type: "entry", name: "Bard", meta: "Charisma · k8 · Kouzelník", desc: "Umělec a všeuměl — inspiruje spojence, kouzlí hudbou a vždycky má co říct." },
      { type: "entry", name: "Klerik", meta: "Moudrost · k8 · Kouzelník", desc: "Sluha božstva, léčí zraněné a sesílá svatá kouzla proti zlu." },
      { type: "entry", name: "Druid", meta: "Moudrost · k8 · Kouzelník", desc: "Ochránce přírody, dokáže se proměnit ve zvíře a ovládat živly." },
      { type: "entry", name: "Bojovník", meta: "Síla/Obratnost · k10 · Válečník", desc: "Mistr zbraní a taktiky. Nejvšestrannější bojová třída, ideální pro začátečníky." },
      { type: "entry", name: "Mnich", meta: "Obratnost/Moudrost · k8 · Válečník", desc: "Bojový umělec využívající vnitřní energii (ki) a rychlé údery holýma rukama." },
      { type: "entry", name: "Paladin", meta: "Síla/Charisma · k10 · Válečník", desc: "Svatý rytíř vázaný přísahou — kombinuje zbraně, léčení a boží tresty." },
      { type: "entry", name: "Hraničář", meta: "Obratnost/Moudrost · k10 · Lovec", desc: "Lovec z divočiny, mistr luku a stopování se zvířecím společníkem." },
      { type: "entry", name: "Zloděj (Tulák)", meta: "Obratnost · k8 · Šikula", desc: "Nenápadný specialista — pasti, zámky, skrývání a zákeřné údery ze stínů." },
      { type: "entry", name: "Čaroděj (Sorcerer)", meta: "Charisma · k6 · Kouzelník", desc: "Vrozená magie proudící v krvi, kterou tvaruje mocnými kouzly." },
      { type: "entry", name: "Černokněžník (Warlock)", meta: "Charisma · k8 · Kouzelník", desc: "Získal moc paktem s mocnou bytostí. Menší, ale silná kouzla." },
      { type: "entry", name: "Kouzelník (Wizard)", meta: "Inteligence · k6 · Kouzelník", desc: "Učený mág s knihou kouzel — nejširší arzenál magie ve hře." },
    ],
  },
  {
    id: "races",
    icon: "🧝",
    title: "Rasy",
    blocks: [
      { type: "p", content: ["Rasa dává postavě vzhled, vlastnosti a schopnosti."] },
      { type: "entry", name: "Člověk", desc: "Všestranný a přizpůsobivý — dobrá volba pro každé povolání." },
      { type: "entry", name: "Elf", desc: "Ladný, dlouhověký, bystrý a obratný. Vidí ve tmě a je odolný proti očarování." },
      { type: "entry", name: "Trpaslík", desc: "Houževnatý horník a válečník, odolný vůči jedu, mistr kamene a kovu." },
      { type: "entry", name: "Půlčík (Hobit)", desc: "Malý, mrštný a nečekaně statečný. Má štěstí a snadno se skryje." },
      { type: "entry", name: "Drakorozený", desc: "Potomek draků s dračím dechem a odolností vůči jednomu živlu." },
      { type: "entry", name: "Gnóm", desc: "Malý vynálezce a čtverák s bystrou myslí a odolností vůči magii." },
      { type: "entry", name: "Půlelf", desc: "Spojuje lidskou všestrannost s elfím půvabem a charismatem." },
      { type: "entry", name: "Půlork", desc: "Silný a nezdolný — ustojí smrtelné rány a v boji je zuřivý." },
      { type: "entry", name: "Tiefling", desc: "Potomek s démonickým dědictvím, odolný vůči ohni a s vrozenou magií." },
    ],
  },
  {
    id: "abilities",
    icon: "📊",
    title: "Vlastnosti postavy",
    blocks: [
      {
        type: "p",
        content: [
          "Každou postavu určuje šest vlastností. Z hodnoty se počítá ",
          { b: "modifikátor" },
          " (10–11 = 0, každé +2 body = +1), který přičítáš k hodům d20. V Deníku postavy na to má každá vlastnost sekci ",
          { b: "„Vlastnosti, záchrany a dovednosti\"" },
          " — zapíšeš tam ",
          { b: "Základ" },
          " (co ti vyšlo při tvorbě postavy) a volitelně ",
          { b: "Vybavení" },
          " (bonus od kouzelného předmětu, např. rukavice síly +2). Appka si sama sečte efektivní skóre i modifikátor a zobrazí je (zkratky ve žlutém pruhu nahoře odpovídají zkratkám v Deníku).",
        ],
      },
      { type: "entry", name: "Síla (SÍL)", desc: "Fyzická moc — boj na blízko, zvedání, šplhání, tlačení. Dovednost: Atletika." },
      { type: "entry", name: "Obratnost (OBR)", desc: "Rychlost a mrštnost — útoky na dálku, plížení, iniciativa, obrana. Dovednosti: Akrobacie, Čachry, Nenápadnost." },
      { type: "entry", name: "Odolnost (ODO)", desc: "Výdrž a zdraví — počet životů a odolnost proti vyčerpání a jedu. Bez vlastních dovedností." },
      { type: "entry", name: "Inteligence (INT)", desc: "Znalosti a logika — magie kouzelníků, pátrání, vědomosti. Dovednosti: Historie, Mystika, Náboženství, Pátrání, Příroda." },
      { type: "entry", name: "Moudrost (MDR)", desc: "Vnímavost a intuice — všímavost, přežití, magie kleriků a druidů. Dovednosti: Lékařství, Ovládání zvířat, Přežití, Vhled, Vnímání." },
      { type: "entry", name: "Charisma (CHA)", desc: "Osobnost a vůle — přesvědčování, klamání, magie bardů a čarodějů. Dovednosti: Klamání, Přesvědčování, Umění, Zastrašování." },
      {
        type: "p",
        muted: true,
        content: [
          "U každého záchranného hodu a dovednosti v Deníku appka sama sečte modifikátor + zdatnostní bonus (jen když je zaškrtnutý jako zdatný) + tvůj volitelný vlastní bonus, a rovnou vedle je tlačítko 🎲, které s tímto součtem hned hodí.",
        ],
      },
    ],
  },
  {
    id: "tips",
    icon: "💡",
    title: "Tipy pro hráče",
    blocks: [
      {
        type: "tip",
        icon: "📖",
        content: [
          { b: "1 · Nenech se odradit množstvím pravidel." },
          " Nemusíš umět všechno hned — nauč se hlavně svoje povolání a zbytek dožene za běhu. Základ je jednoduchý: hoď d20 a musíš přehodit (nebo se vyrovnat) číslu, které má Pán jeskyně připravené.",
        ],
      },
      {
        type: "tip",
        icon: "🧑‍🤝‍🧑",
        content: [
          { b: "2 · Najdi si skupinu." },
          " Když nemá parta chuť, hledej dál — i online (Discord, seznamky družin). V D&D můžeš být, kým chceš; nikoho nezajímá, jak vypadáš nebo co děláš. I introvert může být epický hrdina, kterého bude družina milovat.",
        ],
      },
      {
        type: "tip",
        icon: "🎭",
        content: [
          { b: "3 · Vytvoř si postavu, která tě bude bavit dlouho." },
          " D&D má pravidla, ale žádné limity. Kampaň může trvat měsíce i roky, tak si vyber něco, co tě bude bavit dlouhodobě. Nedávej postavě vlastnosti, které tě časem začnou štvát.",
        ],
      },
      {
        type: "tip",
        icon: "🕹️",
        content: [
          { b: "4 · D&D není videohra." },
          " Spíš se prožívá, než hraje — nedrž se zpátky a experimentuj. Nikdo ti nebrání vyzvat banditu na taneční battle nebo mu nakecat, že jsi jeho pravnuk z budoucnosti. Buď kreativní a užívej si svět bez hranic.",
        ],
      },
      {
        type: "tip",
        icon: "🎯",
        content: [
          { b: "5 · Soustřeď se a užívej si hru." },
          " Reflektor nebude vždy na tobě — poslouchej ostatní, piš si poznámky a ponoř se do světa. Připravovat se můžeš i mimo sezení: taktika, minulost postavy, kouzla i příběh světa.",
        ],
      },
      {
        type: "tip",
        icon: "💬",
        content: [
          { b: "6 · Bav se s hráči ve hře o čemkoliv." },
          " Nechoď jen z bodu A do bodu B. Zvolni a hraj role — vyprávěj příběhy v hospodě, vzpomínej u táboráku, mluv o světě, jako bys v něm žil. Nejlepší momenty často vzejdou z obyčejných konverzací.",
        ],
      },
      {
        type: "tip",
        icon: "🎲",
        content: [
          { b: "7 · Nesnaž se vyhrát." },
          " D&D se nedá vyhrát a nesoupeříš s ostatními — tvůj osud drží kostky. Neúspěch neznamená prohru, jen se příběh vydá jiným směrem. Často díky němu zažiješ mnohem víc zábavy, než bylo v plánu.",
        ],
      },
    ],
  },
];
