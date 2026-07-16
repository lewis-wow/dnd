import { cn } from "@/lib/utils";
import { DICE, MOD_MAX, MOD_MIN, type DieDef, type DieName } from "@/lib/data/dice";
import type { HistoryEntry } from "@/lib/data/history";
import type { RollingState } from "@/hooks/use-dice-roller";
import { dieResultDisplay, formatRollText } from "@/lib/format-roll";
import { DieShape } from "@/components/dice/die-shape";

function DieChip({
  die,
  qty,
  active,
  crit,
  displayValue,
  onAdd,
  onRemove,
}: {
  die: DieDef;
  qty: number;
  active: boolean;
  crit: "" | "crit-hit" | "crit-miss";
  displayValue: string;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      title={`Přidat ${die.name} do skupiny`}
      className="group relative flex size-11 shrink-0 items-center justify-center transition-transform active:scale-95"
    >
      <DieShape
        die={die}
        crit={active ? crit : ""}
        label={displayValue}
        labelClassName="text-[26px]"
        className={cn(
          "absolute inset-0.5 drop-shadow-[0_2px_5px_rgba(0,0,0,0.55)] transition-[filter] group-hover:brightness-125",
          (qty > 0 || active) && "drop-shadow-[0_0_5px_rgba(217,180,90,0.6)]",
          active && crit === "crit-hit" && "drop-shadow-[0_0_7px_rgba(110,231,160,0.65)]",
          active && crit === "crit-miss" && "drop-shadow-[0_0_7px_rgba(209,73,91,0.65)]"
        )}
      />
      {qty > 0 && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              e.preventDefault();
              onRemove();
            }
          }}
          aria-label={`Ubrat ${die.name} ze skupiny`}
          className="absolute -top-2 -right-2 flex min-w-4.5 cursor-pointer items-center justify-center rounded-full border border-gold bg-bg-0 px-1 py-0.5 text-[0.64rem] leading-[1.1rem] font-extrabold text-gold-bright shadow-[0_2px_4px_var(--shadow)] hover:bg-face-lit"
        >
          {qty}
        </span>
      )}
    </button>
  );
}

export function DiceBar({
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
}: {
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
}) {
  const poolEmpty = Object.values(pool).every((n) => !n);
  const activeAdvMode = rolling
    ? rolling.mode === "adv" || rolling.mode === "dis"
      ? rolling.mode
      : null
    : lastEntry && (lastEntry.mode === "adv" || lastEntry.mode === "dis")
      ? lastEntry.mode
      : null;

  const resultText = rolling ? "Házím…" : lastEntry ? formatRollText(lastEntry) : "Přidej kostky a hoď";

  return (
    <div className="sticky top-(--chrome-h,62px) z-20 flex flex-none flex-wrap items-center gap-x-3 gap-y-2 border-b border-edge bg-linear-to-b from-bg-1 to-bg-0 px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
      <div className="flex shrink-0 items-center gap-1">
        {DICE.map((die) => {
          const isRollingParticipant = !!rolling?.participants.includes(die.name);
          const settled = dieResultDisplay(die.name, die.faceValue, lastEntry);
          const displayValue = isRollingParticipant
            ? (flickerValues[die.name] ?? die.faceValue)
            : rolling
              ? die.faceValue
              : settled.value;
          return (
            <DieChip
              key={die.name}
              die={die}
              qty={pool[die.name] ?? 0}
              active={rolling ? isRollingParticipant : settled.active}
              crit={rolling ? "" : settled.crit}
              displayValue={displayValue}
              onAdd={() => onAdd(die.name)}
              onRemove={() => onRemove(die.name)}
            />
          );
        })}
      </div>

      <div className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-edge bg-bg-2 px-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          aria-label="Snížit modifikátor"
          onClick={() => onModChange(Math.max(MOD_MIN, mod - 1))}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-edge bg-face text-lg leading-none text-gold hover:bg-face-lit active:scale-95"
        >
          −
        </button>
        <input
          type="number"
          step={1}
          value={mod}
          onChange={(e) => onModChange(parseInt(e.target.value, 10) || 0)}
          onBlur={(e) => onModChange(Math.max(MOD_MIN, Math.min(MOD_MAX, parseInt(e.target.value, 10) || 0)))}
          aria-label="Modifikátor"
          title="Modifikátor přičítaný ke každému hodu"
          className="min-h-7 w-12 min-w-0 rounded-lg border border-edge bg-face p-1 text-center text-base font-bold text-foreground [appearance:textfield] focus:border-gold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label="Zvýšit modifikátor"
          onClick={() => onModChange(Math.min(MOD_MAX, mod + 1))}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-edge bg-face text-lg leading-none text-gold hover:bg-face-lit active:scale-95"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={poolEmpty}
        onClick={onRollPool}
        title="Hodí všechny kostky přidané do skupiny"
        className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-gold bg-gold/12 px-4 text-[0.92rem] font-bold tracking-wide whitespace-nowrap text-gold-bright shadow-[0_3px_8px_var(--shadow)] transition-[background,transform] hover:not-disabled:bg-gold/22 active:not-disabled:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
      >
        🎲 Hodit
      </button>

      <div
        role="group"
        aria-label="Výhoda nebo nevýhoda"
        className="flex h-11 shrink-0 items-center gap-1 rounded-xl border border-edge bg-bg-0 p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)]"
      >
        <button
          type="button"
          title="Hoď hned 2×k20, použij vyšší"
          onClick={onAdvantage}
          className={cn(
            "flex h-full items-center justify-center gap-1 rounded-lg border border-transparent px-2.5 text-[0.8rem] leading-none font-semibold whitespace-nowrap text-text-dim transition-[background,color,border-color] hover:bg-face hover:text-foreground active:scale-[0.96]",
            activeAdvMode === "adv" && "border-crit-hit/55 bg-crit-hit/14 text-crit-hit"
          )}
        >
          ▲ Výh.
        </button>
        <button
          type="button"
          title="Hoď hned 2×k20, použij nižší"
          onClick={onDisadvantage}
          className={cn(
            "flex h-full items-center justify-center gap-1 rounded-lg border border-transparent px-2.5 text-[0.8rem] leading-none font-semibold whitespace-nowrap text-text-dim transition-[background,color,border-color] hover:bg-face hover:text-foreground active:scale-[0.96]",
            activeAdvMode === "dis" && "border-crimson-bright/60 bg-crimson-bright/16 text-crimson-bright"
          )}
        >
          ▼ Nevýh.
        </button>
      </div>

      <div
        className={cn(
          "min-w-0 flex-1 truncate text-[0.82rem] tracking-wide text-text-dim",
          rolling && "text-text-dim",
          !rolling && lastEntry?.crit === "crit-hit" && "font-bold text-crit-hit",
          !rolling && lastEntry?.crit === "crit-miss" && "font-bold text-crimson-bright"
        )}
        title={resultText}
      >
        {!rolling && lastEntry && (
          <span className="mr-1.5 text-[1rem] font-extrabold text-gold-bright">{lastEntry.total}</span>
        )}
        {resultText}
      </div>
    </div>
  );
}
