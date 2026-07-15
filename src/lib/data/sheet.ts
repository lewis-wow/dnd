// Character sheet ("Deník postavy") data model + static content, ported from
// the legacy app's SHEET_SECTIONS config. Field labels/options/tips are
// verbatim Czech copy from the original.

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface SkillDef {
  key: string;
  label: string;
}

export interface AbilityDef {
  key: AbilityKey;
  label: string;
  skills: SkillDef[];
}

export const ABILITIES: AbilityDef[] = [
  { key: "str", label: "Síla", skills: [{ key: "athletics", label: "Atletika" }] },
  {
    key: "dex",
    label: "Obratnost",
    skills: [
      { key: "acrobatics", label: "Akrobacie" },
      { key: "sleightOfHand", label: "Čachry" },
      { key: "stealth", label: "Nenápadnost" },
    ],
  },
  { key: "con", label: "Odolnost", skills: [] },
  {
    key: "int",
    label: "Inteligence",
    skills: [
      { key: "hist", label: "Historie" },
      { key: "arcana", label: "Mystika" },
      { key: "religion", label: "Náboženství" },
      { key: "investigation", label: "Pátrání" },
      { key: "nature", label: "Příroda" },
    ],
  },
  {
    key: "wis",
    label: "Moudrost",
    skills: [
      { key: "medicine", label: "Lékařství" },
      { key: "animalHandling", label: "Ovládání zvířat" },
      { key: "survival", label: "Přežití" },
      { key: "insight", label: "Vhled" },
      { key: "perception", label: "Vnímání" },
    ],
  },
  {
    key: "cha",
    label: "Charisma",
    skills: [
      { key: "deception", label: "Klamání" },
      { key: "persuasion", label: "Přesvědčování" },
      { key: "performance", label: "Umění" },
      { key: "intimidation", label: "Zastrašování" },
    ],
  },
];

export const CLASSES = [
  "Alchymista",
  "Barbar",
  "Bard",
  "Klerik",
  "Druid",
  "Bojovník",
  "Mnich",
  "Paladin",
  "Hraničář",
  "Zloděj (Tulák)",
  "Čaroděj",
  "Černokněžník",
  "Kouzelník",
  "Jiné",
];

export const BACKGROUNDS = [
  "Voják",
  "Duchovní",
  "Zločinec",
  "Řemeslník",
  "Lidový hrdina",
  "Průvodce",
  "Poustevník",
  "Zábavný umělec",
  "Šlechtic",
  "Cizinec",
  "Mudrc",
  "Námořník",
  "Vyvrhel",
  "Jiné",
];

export const RACES = [
  "Člověk",
  "Elf",
  "Trpaslík",
  "Půlčík (Hobit)",
  "Drakorozený",
  "Gnóm",
  "Půlelf",
  "Půlork",
  "Tiefling",
  "Jiná",
];

export const ALIGNMENTS = [
  "Zákonně dobré",
  "Neutrálně dobré",
  "Chaoticky dobré",
  "Zákonně neutrální",
  "Neutrální",
  "Chaoticky neutrální",
  "Zákonně zlé",
  "Neutrálně zlé",
  "Chaoticky zlé",
];

export const CHAR_LEVELS = Array.from({ length: 20 }, (_, i) => String(i + 1));

export const INSPIRATION_OPTIONS = ["1", "2", "3", "4", "5"];

export const SPELL_ABILITIES = ["Inteligence", "Moudrost", "Charisma"];

export const SPELL_ABILITY_BY_CLASS: Record<string, string[]> = {
  Inteligence: ["Alchymista", "Kouzelník"],
  Moudrost: ["Klerik", "Druid", "Hraničář"],
  Charisma: ["Bard", "Paladin", "Čaroděj", "Černokněžník"],
};

export const SPELL_ABILITY_TIP =
  "Podle povolání: " +
  Object.entries(SPELL_ABILITY_BY_CLASS)
    .map(([ability, classes]) => `${ability} – ${classes.join(", ")}`)
    .join("; ") +
  ".";

export const POINT_BUY_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export function pointBuyCost(baseScore: number): number | null {
  return Object.prototype.hasOwnProperty.call(POINT_BUY_COST, baseScore)
    ? POINT_BUY_COST[baseScore]
    : null;
}

export function parseNum(v: string | undefined): number {
  const n = parseInt(v ?? "", 10);
  return isNaN(n) ? 0 : n;
}

/** Effective score = base + item bonus. Returns null if base isn't a valid number. */
export function abilityScoreTotal(score: string | undefined, item: string | undefined): number | null {
  const base = parseInt(score ?? "", 10);
  if (isNaN(base)) return null;
  return base + parseNum(item);
}

export function abilityModFromTotal(total: number | null): number {
  if (total === null) return 0;
  return Math.floor((total - 10) / 2);
}

/** Signed modifier string for the topbar vitals chips ("—" if no score yet). */
export function abilityModDisplay(total: number | null): string {
  if (total === null) return "—";
  const mod = abilityModFromTotal(total);
  return (mod >= 0 ? "+" : "−") + Math.abs(mod);
}

export function computeRowBonus(total: number | null, misc: string | undefined): number {
  return abilityModFromTotal(total) + parseNum(misc);
}

export type FieldType = "text" | "textarea" | "select";

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  tip?: string;
  wide?: boolean;
  options?: string[];
  optionsPlaceholder?: string;
  otherValue?: string;
}

export const BASIC_FIELDS: FieldSpec[] = [
  { key: "charName", label: "Jméno postavy", type: "text", tip: "Jméno tvé postavy" },
  {
    key: "class",
    label: "Povolání",
    type: "select",
    options: CLASSES,
    optionsPlaceholder: "Vyber povolání…",
    otherValue: "Jiné",
    tip: "Herní povolání postavy (bojovník, kouzelník, zloděj…)",
  },
  {
    key: "subclass",
    label: "Podtřída",
    type: "text",
    placeholder: "Např. Škola věštění",
    tip: "Specializace v rámci povolání (např. Škola věštění, Cesta berserkera, Kruh měsíce) — volí se obvykle mezi 1. a 3. úrovní podle povolání",
  },
  {
    key: "level",
    label: "Úroveň",
    type: "select",
    options: CHAR_LEVELS,
    optionsPlaceholder: "—",
    tip: "Aktuální úroveň postavy",
  },
  {
    key: "background",
    label: "Zázemí",
    type: "select",
    options: BACKGROUNDS,
    optionsPlaceholder: "Vyber zázemí…",
    otherValue: "Jiné",
    tip: "Odkud postava pochází — dává zdatnosti, vybavení a kus příběhu",
  },
  { key: "playerName", label: "Jméno hráče", type: "text", tip: "Jméno hráče u stolu" },
  {
    key: "race",
    label: "Rasa",
    type: "select",
    options: RACES,
    optionsPlaceholder: "Vyber rasu…",
    otherValue: "Jiná",
    tip: "Rasa/druh postavy",
  },
  {
    key: "alignment",
    label: "Přesvědčení",
    type: "select",
    options: ALIGNMENTS,
    optionsPlaceholder: "Vyber přesvědčení…",
    tip: "Morální a etické zaměření postavy",
  },
  { key: "xp", label: "Body zkušenosti", type: "text", tip: "Nasbírané body zkušenosti — jejich součet určuje úroveň" },
  {
    key: "profBonus",
    label: "Zdatnostní bonus",
    type: "text",
    tip: "Bonus přičítaný ke zdatným záchranám, dovednostem a útokům — roste s úrovní postavy",
  },
  {
    key: "inspiration",
    label: "Inspirace",
    type: "select",
    options: INSPIRATION_OPTIONS,
    optionsPlaceholder: "0",
    tip: "Body inspirace, které lze utratit za výhodu na hodu",
  },
];

export const COMBAT_FIELDS: FieldSpec[] = [
  { key: "ac", label: "OČ (obranné číslo)", type: "text", tip: "Obranné číslo — čím vyšší, tím hůř tě útočník trefí" },
  { key: "speed", label: "Rychlost", type: "text", tip: "Rychlost pohybu ve stopách za kolo" },
  { key: "maxHp", label: "Maximum životů", type: "text", tip: "Maximální počet životů postavy" },
  { key: "currentHp", label: "Aktuální životy", type: "text", tip: "Kolik životů má postava právě teď" },
  { key: "tempHp", label: "Dočasné životy", type: "text", tip: "Dočasné životy navíc — ubývají jako první" },
  { key: "hitDice", label: "Kostky života", type: "text", tip: "Kostky života použitelné při odpočinku k léčení" },
  {
    key: "deathSuccess",
    label: "Záchrany př. smrtí — úspěchy",
    type: "text",
    tip: "Záchranné hody proti smrti, které postava už uspěla (3 = přežití)",
  },
  {
    key: "deathFail",
    label: "Záchrany př. smrtí — neúspěchy",
    type: "text",
    tip: "Záchranné hody proti smrti, které postava neuspěla (3 = smrt)",
  },
];

export const PERSONALITY_FIELDS: FieldSpec[] = [
  { key: "traits", label: "Osobnostní rysy", type: "textarea", tip: "Krátké návyky a chování, které postavu odlišují" },
  { key: "ideals", label: "Ideály", type: "textarea", tip: "Zásady a přesvědčení, kterými se postava řídí" },
  { key: "bonds", label: "Pouta", type: "textarea", tip: "Lidé, místa nebo věci, ke kterým má postava pouto" },
  { key: "flaws", label: "Vady", type: "textarea", tip: "Slabina nebo chyba, která postavu občas přivede do potíží" },
];

export const APPEARANCE_FIELDS: FieldSpec[] = [
  { key: "age", label: "Věk", type: "text" },
  { key: "height", label: "Výška", type: "text" },
  { key: "weight", label: "Váha", type: "text" },
  { key: "eyes", label: "Oči", type: "text" },
  { key: "skin", label: "Pokožka", type: "text" },
  { key: "hair", label: "Vlasy", type: "text" },
  { key: "appearance", label: "Vzhled postavy", type: "textarea", wide: true },
];

export const BACKSTORY_FIELDS: FieldSpec[] = [
  { key: "backstory", label: "Minulost postavy", type: "textarea" },
  { key: "allies", label: "Spojenci a organizace", type: "textarea" },
  { key: "additionalFeatures", label: "Další schopnosti a rysy", type: "textarea" },
  { key: "treasure", label: "Poklad", type: "textarea" },
];

export type SectionId =
  | "basic"
  | "combat"
  | "abilities"
  | "attacks"
  | "personality"
  | "features"
  | "appearance"
  | "backstory"
  | "spells";

export interface SectionMeta {
  id: SectionId;
  icon: string;
  title: string;
}

export const SHEET_SECTIONS: SectionMeta[] = [
  { id: "basic", icon: "🪪", title: "Základní informace" },
  { id: "combat", icon: "⚔️", title: "Boj a životy" },
  { id: "abilities", icon: "📊", title: "Vlastnosti, záchrany a dovednosti" },
  { id: "attacks", icon: "🗡️", title: "Útoky" },
  { id: "personality", icon: "🎭", title: "Osobnost postavy" },
  { id: "features", icon: "🎒", title: "Schopnosti, vybavení a jazyky" },
  { id: "appearance", icon: "🧝", title: "Vzhled a osobní údaje" },
  { id: "backstory", icon: "📜", title: "Příběh postavy" },
  { id: "spells", icon: "✨", title: "Kouzlení" },
];

export const DEFAULT_SECTION_ORDER: SectionId[] = SHEET_SECTIONS.map((s) => s.id);

let idCounter = 0;
export function genId(): string {
  idCounter += 1;
  return Date.now().toString(36) + idCounter.toString(36);
}

export interface ItemRow {
  id: string;
  text: string;
}

export interface AttackRow {
  id: string;
  name: string;
  bonus: string;
  dmg: string;
}

export interface SpellLevelData {
  level: number;
  slotsTotal: string;
  slotsUsed: string;
  spells: ItemRow[];
}

export interface AbilityFormSlice {
  score: string;
  item: string;
  saveMisc: string;
  skills: Record<string, string>;
}

export interface SheetFormValues {
  basic: Record<string, string>;
  combat: Record<string, string>;
  abilities: Record<AbilityKey, AbilityFormSlice>;
  passiveWis: string;
  attacks: AttackRow[];
  personality: Record<string, string>;
  features: ItemRow[];
  equipment: ItemRow[];
  languages: ItemRow[];
  appearance: Record<string, string>;
  backstory: Record<string, string>;
  spells: {
    ability: string;
    saveDc: string;
    attackBonus: string;
    levels: SpellLevelData[];
  };
}

function emptyFieldRecord(fields: FieldSpec[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fields) {
    out[f.key] = "";
    if (f.otherValue) out[`${f.key}_other`] = "";
  }
  return out;
}

export function createDefaultSheetValues(): SheetFormValues {
  const abilities = {} as Record<AbilityKey, AbilityFormSlice>;
  for (const a of ABILITIES) {
    const skills: Record<string, string> = {};
    for (const s of a.skills) skills[s.key] = "";
    abilities[a.key] = {
      score: "11", // D&D 5e average ability score — the one field with a real default
      item: "",
      saveMisc: "",
      skills,
    };
  }

  return {
    basic: emptyFieldRecord(BASIC_FIELDS),
    combat: emptyFieldRecord(COMBAT_FIELDS),
    abilities,
    passiveWis: "",
    attacks: [{ id: genId(), name: "", bonus: "", dmg: "" }],
    personality: emptyFieldRecord(PERSONALITY_FIELDS),
    features: [{ id: genId(), text: "" }],
    equipment: [{ id: genId(), text: "" }],
    languages: [{ id: genId(), text: "" }],
    appearance: emptyFieldRecord(APPEARANCE_FIELDS),
    backstory: emptyFieldRecord(BACKSTORY_FIELDS),
    spells: {
      ability: "",
      saveDc: "",
      attackBonus: "",
      levels: Array.from({ length: 10 }, (_, level) => ({
        level,
        slotsTotal: "",
        slotsUsed: "",
        spells: [{ id: genId(), text: "" }],
      })),
    },
  };
}
