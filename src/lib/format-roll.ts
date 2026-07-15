import type { HistoryEntry } from "@/lib/data/history";

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
