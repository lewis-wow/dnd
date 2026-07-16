import { forwardRef } from "react";
import type { DieName } from "@/lib/data/dice";
import type { HistoryEntry } from "@/lib/data/history";
import type { RollingState } from "@/hooks/use-dice-roller";
import { ResultStage } from "@/components/dice/result-stage";
import { DiceTray } from "@/components/dice/dice-tray";
import { RollControls } from "@/components/dice/roll-controls";

interface DicePaneProps {
  widthPx: number | null;
  isPhone: boolean;
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

export const DicePane = forwardRef<HTMLElement, DicePaneProps>(function DicePane(
  {
    widthPx,
    isPhone,
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
  },
  ref
) {
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
      ref={ref}
      style={{
        ...(widthPx != null ? { flexBasis: widthPx, width: widthPx } : undefined),
        ...(isPhone ? { minHeight: "calc(var(--app-height, 100dvh) - var(--chrome-h, 64px))" } : undefined),
      }}
      className="flex min-w-0 flex-col min-[900px]:h-full min-[900px]:min-h-0 min-[900px]:flex-none min-[900px]:basis-110 min-[900px]:overflow-hidden"
    >
      <div className="flex flex-none items-center justify-between gap-2.5 border-b border-edge p-4 min-[900px]:px-4 min-[900px]:py-2.5">
        <h2 className="m-0 text-[1.1rem] tracking-wide text-gold min-[900px]:text-[0.98rem]">🎲 Hoď kostkou</h2>
      </div>

      <main className="flex w-full flex-1 flex-col items-center gap-1.5 overflow-hidden px-3 py-1 max-[640px]:justify-center min-[641px]:flex-none min-[641px]:overflow-visible min-[641px]:px-4 min-[641px]:py-1.5 min-[900px]:min-h-0 min-[900px]:flex-none min-[900px]:justify-start min-[900px]:px-4 min-[900px]:py-1.5">
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
});
