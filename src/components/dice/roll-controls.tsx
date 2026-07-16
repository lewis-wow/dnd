import { cn } from "@/lib/utils";
import { MOD_MAX, MOD_MIN } from "@/lib/data/dice";
import { FieldTooltip } from "@/components/shared/field-tooltip";

export function RollControls({
  mod,
  onModChange,
  poolEmpty,
  onRollPool,
  onAdvantage,
  onDisadvantage,
  activeAdvMode,
}: {
  mod: number;
  onModChange: (n: number) => void;
  poolEmpty: boolean;
  onRollPool: () => void;
  onAdvantage: () => void;
  onDisadvantage: () => void;
  activeAdvMode: "adv" | "dis" | null;
}) {
  return (
    <div className="mx-auto my-5.5 flex w-full max-w-[760px] flex-none flex-wrap items-center justify-center gap-3 px-4 min-[900px]:my-2.5 min-[900px]:gap-2 max-[640px]:m-0 max-[640px]:gap-2 max-[640px]:border-t max-[640px]:border-edge max-[640px]:bg-bg-1 max-[640px]:px-3 max-[640px]:pt-2.5 max-[640px]:pb-[calc(10px+env(safe-area-inset-bottom))]">
      <div className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-edge bg-bg-2 px-3 py-2 min-h-11 min-[900px]:px-2.5 min-[900px]:py-1.5">
        <label className="w-[84px] shrink-0 text-[0.8rem] tracking-wide text-text-dim">Modifikátor</label>
        <button
          type="button"
          aria-label="Snížit modifikátor"
          onClick={() => onModChange(Math.max(MOD_MIN, mod - 1))}
          className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-edge bg-face text-xl leading-none text-gold hover:bg-face-lit max-[640px]:size-9.5 max-[640px]:text-2xl"
        >
          −
        </button>
        <FieldTooltip className="min-w-0 flex-1" content="Modifikátor přičítaný ke každému hodu — např. oprava vlastnosti a zdatnostní bonus">
          <input
            type="number"
            step={1}
            value={mod}
            onChange={(e) => onModChange(parseInt(e.target.value, 10) || 0)}
            onBlur={(e) => onModChange(Math.max(MOD_MIN, Math.min(MOD_MAX, parseInt(e.target.value, 10) || 0)))}
            className="min-h-9.5 w-full min-w-0 rounded-lg border border-edge bg-face p-2 text-center text-xl font-bold text-foreground [appearance:textfield] focus:border-gold focus:shadow-[0_0_0_2px_rgba(217,180,90,0.2)] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </FieldTooltip>
        <button
          type="button"
          aria-label="Zvýšit modifikátor"
          onClick={() => onModChange(Math.min(MOD_MAX, mod + 1))}
          className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-edge bg-face text-xl leading-none text-gold hover:bg-face-lit max-[640px]:size-9.5 max-[640px]:text-2xl"
        >
          +
        </button>
      </div>

      <div className="flex w-full flex-1 flex-wrap items-stretch gap-2">
        <button
          type="button"
          disabled={poolEmpty}
          onClick={onRollPool}
          title="Hodí všechny kostky přidané do skupiny"
          className="flex flex-[0_1_auto] min-w-0 items-center justify-center gap-1.5 rounded-xl border border-gold bg-gold/12 px-3.5 py-2 text-[0.92rem] font-bold tracking-wide whitespace-nowrap text-gold-bright transition-[background,transform] hover:not-disabled:bg-gold/22 active:not-disabled:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 max-[640px]:min-h-11 max-[640px]:flex-1 max-[640px]:text-[0.95rem] min-[900px]:px-2.5 min-[900px]:py-1.5 min-[900px]:text-[0.85rem]"
        >
          🎲 Hodit
        </button>

        <div
          role="group"
          aria-label="Výhoda nebo nevýhoda"
          className="flex flex-[1_1_220px] min-w-0 gap-1 rounded-[13px] border border-edge bg-bg-0 p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.45)]"
        >
          <button
            type="button"
            title="Hoď hned 2×k20, použij vyšší"
            onClick={onAdvantage}
            className={cn(
              "flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-[10px] border border-transparent px-2.5 py-2 text-[0.86rem] leading-none font-semibold whitespace-nowrap text-text-dim transition-[background,color,border-color,box-shadow] hover:bg-face hover:text-foreground active:scale-[0.96] max-[640px]:min-h-11 min-[900px]:px-[9px] min-[900px]:py-[7px] min-[900px]:text-[0.8rem]",
              activeAdvMode === "adv" &&
                "border-crit-hit/55 bg-crit-hit/14 text-crit-hit shadow-[0_0_16px_rgba(110,231,160,0.22)]"
            )}
          >
            <span className="text-[0.95rem] opacity-85">▲</span> Výhoda
          </button>
          <button
            type="button"
            title="Hoď hned 2×k20, použij nižší"
            onClick={onDisadvantage}
            className={cn(
              "flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-[10px] border border-transparent px-2.5 py-2 text-[0.86rem] leading-none font-semibold whitespace-nowrap text-text-dim transition-[background,color,border-color,box-shadow] hover:bg-face hover:text-foreground active:scale-[0.96] max-[640px]:min-h-11 min-[900px]:px-[9px] min-[900px]:py-[7px] min-[900px]:text-[0.8rem]",
              activeAdvMode === "dis" &&
                "border-crimson-bright/60 bg-crimson-bright/16 text-crimson-bright shadow-[0_0_16px_rgba(209,73,91,0.22)]"
            )}
          >
            <span className="text-[0.95rem] opacity-85">▼</span> Nevýhoda
          </button>
        </div>
      </div>
    </div>
  );
}
