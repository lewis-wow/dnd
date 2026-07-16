import type { CritClass, DieName } from "@/lib/data/dice";

export type RollMode = "normal" | "adv" | "dis" | "pool";

export interface PoolEntryPart {
  name: DieName;
  qty: number;
  rolls: number[];
}

export interface HistoryEntry {
  id: string;
  die: DieName | null;
  pool: PoolEntryPart[] | null;
  notation: string;
  rolls: number[];
  mod: number;
  total: number;
  mode: RollMode;
  alt: number | null;
  tag: string | null;
  crit: CritClass;
  ts: number;
}

export function genRollId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
