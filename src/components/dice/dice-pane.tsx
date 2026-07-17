import type { DieName } from "@/lib/data/dice";
import type { HistoryEntry } from "@/lib/data/history";
import type { RollingState } from "@/hooks/use-dice-roller";
import { ResultStage } from "@/components/dice/result-stage";
import { DiceTray } from "@/components/dice/dice-tray";
import { RollControls } from "@/components/dice/roll-controls";

interface DicePaneProps {
  pool: Partial<Record<DieName, number>>;
  mod: number;
  onModChange: (n: number) => void;
  lastEntry: HistoryEntry | null;
  rolling: RollingState;
  flickerValues: Partial<Record<DieName, string>>;
  onAdd: (name: DieName) => void;
  onRemove: (name: DieName) => void;
  onRollPool: () => void;
  onAdvantage: () => void;
  onDisadvantage: () => void;
}

/** The phone-only "Kostky" tab: dice fill the whole screen below the topbar
 * and tab switcher, sized off --phone-chrome-h (that combined header
 * stack's live height — see useChromeHeight) so it reads as one full
 * screen rather than a cramped strip. */
export function DicePane({
  pool,
  mod,
  onModChange,
  lastEntry,
  rolling,
  flickerValues,
  onAdd,
  onRemove,
  onRollPool,
  onAdvantage,
  onDisadvantage,
}: DicePaneProps) {
  const poolEmpty = Object.values(pool).every((n) => !n);
  const activeAdvMode = rolling
    ? rolling.mode === "adv" || rolling.mode === "dis"
      ? rolling.mode
      : null
    : lastEntry && (lastEntry.mode === "adv" || lastEntry.mode === "dis")
      ? lastEntry.mode
      : null;

  return (
    <section
      style={{ minHeight: "calc(var(--app-height, 100dvh) - var(--phone-chrome-h, 110px))" }}
      className="flex min-w-0 flex-col"
    >
      <div className="flex flex-none items-center justify-between gap-2.5 border-b border-edge p-4">
        <h2 className="m-0 text-[1.1rem] tracking-wide text-gold">🎲 Hoď kostkou</h2>
      </div>

      <main className="flex w-full flex-1 flex-col items-center justify-center gap-1.5 overflow-hidden px-3 py-1">
        <ResultStage lastEntry={lastEntry} rolling={rolling} />
        <DiceTray
          pool={pool}
          lastEntry={lastEntry}
          rolling={rolling}
          flickerValues={flickerValues}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </main>

      <RollControls
        mod={mod}
        onModChange={onModChange}
        poolEmpty={poolEmpty}
        onRollPool={onRollPool}
        onAdvantage={onAdvantage}
        onDisadvantage={onDisadvantage}
        activeAdvMode={activeAdvMode}
      />
    </section>
  );
}
