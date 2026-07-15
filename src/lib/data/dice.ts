export type DieName = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

export interface DieDef {
  sides: number;
  name: DieName;
  /** SVG polygon points, 80x80 viewBox. */
  points: string;
  /** Text shown inside the shape when idle / after landing. d100 shows "%". */
  faceValue: string;
}

// Order matters: tray render order and pool iteration order.
export const DICE: DieDef[] = [
  { sides: 4, name: "d4", points: "40,4 76,70 4,70", faceValue: "4" },
  { sides: 6, name: "d6", points: "10,10 70,10 70,70 10,70", faceValue: "6" },
  { sides: 8, name: "d8", points: "40,2 74,40 40,78 6,40", faceValue: "8" },
  { sides: 10, name: "d10", points: "40,2 74,34 62,74 18,74 6,34", faceValue: "10" },
  {
    sides: 12,
    name: "d12",
    points: "40,4 66,16 78,42 66,68 40,78 14,68 2,42 14,16",
    faceValue: "12",
  },
  { sides: 20, name: "d20", points: "40,3 70,20 70,56 40,75 10,56 10,20", faceValue: "20" },
  // d100 reuses the d10 shape (visually identical), face shows "%" not "100".
  { sides: 100, name: "d100", points: "40,2 74,34 62,74 18,74 6,34", faceValue: "%" },
];

export const d20 = DICE.find((d) => d.sides === 20)!;

export function dieByName(name: DieName): DieDef {
  return DICE.find((d) => d.name === name)!;
}

/** "1 – 20" style range label — literal template, not percentile notation for d100. */
export function rangeLabel(die: DieDef): string {
  return `1 – ${die.sides}`;
}

/** Cryptographically-sourced die roll (falls back to Math.random). Note: modulo bias
 * is present in the original app and intentionally not corrected here to match it. */
export function rand(sides: number): number {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const a = new Uint32Array(1);
    window.crypto.getRandomValues(a);
    return (a[0] % sides) + 1;
  }
  return Math.floor(Math.random() * sides) + 1;
}

export type CritClass = "" | "crit-hit" | "crit-miss";

export function critClass(die: DieDef, rolls: number[], qty: number): CritClass {
  if (die.sides === 20 && qty === 1) {
    if (rolls[0] === 20) return "crit-hit";
    if (rolls[0] === 1) return "crit-miss";
  }
  return "";
}

export interface PoolPart {
  die: DieDef;
  qty: number;
  rolls: number[];
}

/** Crit only ever fires when the group contains exactly one d20. */
export function poolCritClass(parts: PoolPart[]): CritClass {
  const d20part = parts.find((p) => p.die.sides === 20);
  if (d20part && d20part.qty === 1) {
    if (d20part.rolls[0] === 20) return "crit-hit";
    if (d20part.rolls[0] === 1) return "crit-miss";
  }
  return "";
}

export function notation(die: DieDef, qty: number, mod: number): string {
  let s = `${qty}${die.name}`;
  if (mod > 0) s += ` + ${mod}`;
  else if (mod < 0) s += ` − ${Math.abs(mod)}`;
  return s;
}

export function poolNotation(parts: PoolPart[], mod: number): string {
  let s = parts.map((p) => `${p.qty}${p.die.name}`).join(" + ");
  if (mod > 0) s += ` + ${mod}`;
  else if (mod < 0) s += ` − ${Math.abs(mod)}`;
  return s;
}

export function fmtSigned(n: number): string {
  return (n >= 0 ? "+" : "−") + Math.abs(n);
}

export const MOD_MIN = -99;
export const MOD_MAX = 99;
export const POOL_QTY_MAX = 20;
