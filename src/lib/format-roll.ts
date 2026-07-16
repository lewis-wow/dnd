import type { CritClass, DieName } from "@/lib/data/dice";
import type { HistoryEntry } from "@/lib/data/history";

/** What a single die tile/chip should currently show: its settled value from
 * the last roll (if it took part), or its idle face otherwise. */
export function dieResultDisplay(
  dieName: DieName,
  faceValue: string,
  lastEntry: HistoryEntry | null
): { value: string; active: boolean; crit: CritClass } {
  if (!lastEntry) return { value: faceValue, active: false, crit: "" };

  if (lastEntry.mode === "pool") {
    const part = lastEntry.pool?.find((p) => p.name === dieName);
    if (!part) return { value: faceValue, active: false, crit: "" };
    const isCritTile = part.qty === 1 && dieName === "d20";
    return {
      value: String(part.rolls[part.rolls.length - 1]),
      active: true,
      crit: isCritTile ? lastEntry.crit : "",
    };
  }

  if (lastEntry.die === dieName) {
    return { value: String(lastEntry.rolls[0]), active: true, crit: lastEntry.crit };
  }
  return { value: faceValue, active: false, crit: "" };
}

function modSuffix(mod: number): string {
  if (mod > 0) return ` + ${mod}`;
  if (mod < 0) return ` − ${Math.abs(mod)}`;
  return "";
}

/** Plain-text notation/breakdown for a roll — crit/skill tags are rendered separately. */
export function formatRollText(entry: HistoryEntry): string {
  if (entry.mode === "pool" && entry.pool) {
    const parts = entry.pool.map((p) => `${p.qty}${p.name}: [${p.rolls.join(", ")}]`).join("  +  ");
    return `${entry.notation}  →  ${parts}${modSuffix(entry.mod)} = ${entry.total}`;
  }

  if (entry.mode === "adv" || entry.mode === "dis") {
    const label = entry.mode === "adv" ? "Výhoda" : "Nevýhoda";
    return `${entry.notation} → ${label} [${entry.rolls[0]} vs ${entry.alt}]${modSuffix(entry.mod)} = ${entry.total}`;
  }

  // normal, single d20/dN roll — qty is always 1 in the current UI.
  if (entry.mod === 0) return entry.notation;
  return `${entry.notation} → [${entry.rolls.join(", ")}]${modSuffix(entry.mod)} = ${entry.total}`;
}

export function critTagText(entry: HistoryEntry): string | null {
  if (entry.crit === "crit-hit") return "Kritický zásah!";
  if (entry.crit === "crit-miss") return "Kritické selhání!";
  return null;
}
