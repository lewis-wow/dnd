import { useCallback, useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  DICE,
  MOD_MIN,
  MOD_MAX,
  POOL_QTY_MAX,
  critClass,
  d20,
  dieByName,
  notation,
  poolCritClass,
  poolNotation,
  rand,
  type DieName,
  type PoolPart,
} from "@/lib/data/dice";
import { genRollId, type HistoryEntry } from "@/lib/data/history";
import { MAX_HISTORY, STORAGE_KEYS } from "@/lib/storage-keys";
import { useHapticBuzz } from "@/hooks/use-haptic-buzz";

interface Settings {
  mod: number;
  pool: Partial<Record<DieName, number>>;
}

const DEFAULT_SETTINGS: Settings = { mod: 0, pool: {} };

const FLICKER_INTERVAL_MS = 70;
const FLICKER_TICKS = 7;
const RESOLVE_MS = 600;

export type RollingState = {
  participants: DieName[];
  mode: "normal" | "pool" | "adv" | "dis";
} | null;

export function useDiceRoller() {
  const buzz = useHapticBuzz();
  const [settings, setSettings] = useLocalStorageState<Settings>(STORAGE_KEYS.settings, {
    defaultValue: DEFAULT_SETTINGS,
  });
  const [history, setHistory] = useLocalStorageState<HistoryEntry[]>(STORAGE_KEYS.history, {
    defaultValue: [],
  });

  const [rolling, setRolling] = useState<RollingState>(null);
  const [flickerValues, setFlickerValues] = useState<Partial<Record<DieName, string>>>({});
  const pendingTagRef = useRef<string | null>(null);
  const flickerTimer = useRef<number | null>(null);
  const resolveTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (flickerTimer.current) window.clearInterval(flickerTimer.current);
      if (resolveTimer.current) window.clearTimeout(resolveTimer.current);
    },
    []
  );

  // Independent from `history`: initialized from the most recent entry at
  // mount (so a reload still shows the last roll, same as the legacy app's
  // restoreLastRoll), then updated explicitly on every new roll. It must
  // NOT be a live derivation of history[0] — deleting the top history row,
  // or clearing history entirely, shouldn't change what the roller is
  // currently displaying; those are edits to the *log*, not to "what did I
  // just roll".
  const [lastEntry, setLastEntry] = useState<HistoryEntry | null>(() => history[0] ?? null);

  const clearTimers = useCallback(() => {
    if (flickerTimer.current) {
      window.clearInterval(flickerTimer.current);
      flickerTimer.current = null;
    }
    if (resolveTimer.current) {
      window.clearTimeout(resolveTimer.current);
      resolveTimer.current = null;
    }
  }, []);

  const pushHistory = useCallback(
    (entry: HistoryEntry) => {
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
    },
    [setHistory]
  );

  const landingBuzz = useCallback(
    (crit: HistoryEntry["crit"]) => {
      if (crit === "crit-hit") buzz([0, 60, 50, 60, 50, 120]);
      else if (crit === "crit-miss") buzz([0, 200]);
      else buzz(35);
    },
    [buzz]
  );

  const setMod = useCallback(
    (n: number, persist = true) => {
      const clamped = Math.round(Math.max(MOD_MIN, Math.min(MOD_MAX, n)));
      if (persist) {
        setSettings((s) => ({ ...s, mod: clamped }));
      }
      return clamped;
    },
    [setSettings]
  );

  const setPoolQty = useCallback(
    (name: DieName, n: number) => {
      const clamped = Math.max(0, Math.min(POOL_QTY_MAX, Math.round(n)));
      setSettings((s) => ({ ...s, pool: { ...s.pool, [name]: clamped } }));
      buzz(8);
    },
    [setSettings, buzz]
  );

  const startFlicker = useCallback((participants: DieName[]) => {
    let ticks = 0;
    flickerTimer.current = window.setInterval(() => {
      ticks += 1;
      setFlickerValues((prev) => {
        const next = { ...prev };
        for (const name of participants) {
          const die = dieByName(name);
          next[name] = String(rand(die.sides));
        }
        return next;
      });
      if (ticks > FLICKER_TICKS - 1) {
        if (flickerTimer.current) {
          window.clearInterval(flickerTimer.current);
          flickerTimer.current = null;
        }
      }
    }, FLICKER_INTERVAL_MS);
  }, []);

  const rollSingle = useCallback(
    (dieName: DieName, tag?: string | null, modOverride?: number) => {
      clearTimers();
      const die = dieByName(dieName);
      // Accept an explicit override so callers that just set the modifier in
      // the same tick (rollFromSheet) aren't racing React's async state update.
      const mod = modOverride ?? settings.mod;
      pendingTagRef.current = tag ?? null;
      setRolling({ participants: [dieName], mode: "normal" });
      buzz([12, 40, 10, 40, 8]);
      startFlicker([dieName]);

      resolveTimer.current = window.setTimeout(() => {
        const roll = rand(die.sides);
        const total = roll + mod;
        const crit = critClass(die, [roll], 1);
        const entry: HistoryEntry = {
          id: genRollId(),
          die: dieName,
          pool: null,
          notation: notation(die, 1, mod),
          rolls: [roll],
          mod,
          total,
          mode: "normal",
          alt: null,
          tag: pendingTagRef.current,
          crit,
          ts: Date.now(),
        };
        pendingTagRef.current = null;
        pushHistory(entry);
        setLastEntry(entry);
        setRolling(null);
        landingBuzz(crit);
      }, RESOLVE_MS);
    },
    [settings.mod, clearTimers, buzz, startFlicker, pushHistory, landingBuzz]
  );

  const rollPool = useCallback(() => {
    const parts: PoolPart[] = DICE.filter((d) => (settings.pool[d.name] ?? 0) > 0).map((d) => ({
      die: d,
      qty: settings.pool[d.name] ?? 0,
      rolls: [],
    }));
    if (parts.length === 0) return;
    clearTimers();
    const mod = settings.mod;
    const participants = parts.map((p) => p.die.name);
    setRolling({ participants, mode: "pool" });
    buzz([12, 40, 10, 40, 8]);
    startFlicker(participants);

    resolveTimer.current = window.setTimeout(() => {
      const rolledParts: PoolPart[] = parts.map((p) => ({
        ...p,
        rolls: Array.from({ length: p.qty }, () => rand(p.die.sides)),
      }));
      const sum = rolledParts.reduce((acc, p) => acc + p.rolls.reduce((a, b) => a + b, 0), 0);
      const total = sum + mod;
      const crit = poolCritClass(rolledParts);
      const entry: HistoryEntry = {
        id: genRollId(),
        die: null,
        pool: rolledParts.map((p) => ({ name: p.die.name, qty: p.qty, rolls: p.rolls })),
        notation: poolNotation(rolledParts, mod),
        rolls: rolledParts.reduce<number[]>((acc, p) => acc.concat(p.rolls), []),
        mod,
        total,
        mode: "pool",
        alt: null,
        tag: null,
        crit,
        ts: Date.now(),
      };
      pushHistory(entry);
      setLastEntry(entry);
      // The group is spent, win or lose.
      setSettings((s) => ({ ...s, pool: {} }));
      setRolling(null);
      landingBuzz(crit);
    }, RESOLVE_MS);
  }, [settings.pool, settings.mod, clearTimers, buzz, startFlicker, pushHistory, setSettings, landingBuzz]);

  const rollAdvantage = useCallback(
    (mode: "adv" | "dis") => {
      clearTimers();
      const mod = settings.mod;
      setRolling({ participants: ["d20"], mode });
      buzz([12, 40, 10, 40, 8]);
      startFlicker(["d20"]);

      resolveTimer.current = window.setTimeout(() => {
        const a = rand(20);
        const b = rand(20);
        const keepA = mode === "adv" ? a >= b : a <= b;
        const kept = keepA ? a : b;
        const alt = keepA ? b : a;
        const total = kept + mod;
        const crit = critClass(d20, [kept], 1);
        const entry: HistoryEntry = {
          id: genRollId(),
          die: "d20",
          pool: null,
          notation: notation(d20, 1, mod),
          rolls: [kept],
          mod,
          total,
          mode,
          alt,
          tag: null,
          crit,
          ts: Date.now(),
        };
        pushHistory(entry);
        setLastEntry(entry);
        setRolling(null);
        landingBuzz(crit);
      }, RESOLVE_MS);
    },
    [settings.mod, clearTimers, buzz, startFlicker, pushHistory, landingBuzz]
  );

  const rollFromSheet = useCallback(
    (bonus: number, label: string) => {
      const clamped = setMod(bonus);
      rollSingle("d20", label, clamped);
    },
    [setMod, rollSingle]
  );

  const deleteHistoryEntry = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((h) => h.id !== id));
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  // For wipe-all only — resets the roller's own displayed state back to
  // idle, separately from clearing the history log (see the note on
  // lastEntry above for why those are two different things).
  const resetRollerDisplay = useCallback(() => {
    clearTimers();
    setRolling(null);
    setFlickerValues({});
    setLastEntry(null);
  }, [clearTimers]);

  return {
    dice: DICE,
    pool: settings.pool,
    mod: settings.mod,
    setMod,
    setPoolQty,
    rollPool,
    rollAdvantage,
    rollFromSheet,
    rollDieQuickRoll: rollSingle,
    rolling,
    flickerValues,
    history,
    lastEntry,
    deleteHistoryEntry,
    clearHistory,
    resetRollerDisplay,
    setHistory,
    setSettings,
  };
}
