import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { CritClass, DieDef } from "@/lib/data/dice";
import { rangeLabel } from "@/lib/data/dice";
import { DieShape } from "@/components/dice/die-shape";

const CRIT_TILE: Record<CritClass, string> = {
  "": "",
  "crit-hit": "border-crit-hit shadow-[0_8px_20px_var(--shadow),0_0_0_1px_var(--crit-hit)_inset,0_0_24px_rgba(110,231,160,0.4)] [&_.die-name]:text-crit-hit",
  "crit-miss":
    "border-crimson-bright shadow-[0_8px_20px_var(--shadow),0_0_0_1px_var(--crimson-bright)_inset,0_0_24px_rgba(209,73,91,0.4)] [&_.die-name]:text-crimson-bright",
};

export function DieTile({
  die,
  qty,
  active,
  crit,
  rolling,
  displayValue,
  onAdd,
  onRemove,
}: {
  die: DieDef;
  qty: number;
  active: boolean;
  crit: CritClass;
  rolling: boolean;
  displayValue: string;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    if (!rolling) return;
    setSpin(false);
    const id = requestAnimationFrame(() => setSpin(true));
    return () => cancelAnimationFrame(id);
  }, [rolling]);

  return (
    <button
      type="button"
      onClick={onAdd}
      className={cn(
        "die-tile group relative flex flex-col items-center gap-2.5 rounded-2xl border border-edge bg-linear-to-br from-face-lit to-face px-2.5 pt-4.5 pb-3.5 text-center shadow-[0_6px_16px_var(--shadow),inset_0_1px_0_rgba(255,255,255,0.05)] transition-[transform,box-shadow,border-color] active:translate-y-[-1px] active:scale-[0.98]",
        qty > 0 && "border-gold",
        active &&
          "border-gold bg-linear-to-br from-[#4a3d68] to-[#34294d] shadow-[0_8px_20px_var(--shadow),0_0_0_1px_var(--gold)_inset,0_0_22px_rgba(217,180,90,0.28)] [&_.die-name]:text-gold-bright",
        active && crit && CRIT_TILE[crit]
      )}
    >
      <span className="die-name text-base font-bold tracking-[2px] text-gold">{die.name}</span>
      <span className="text-[0.72rem] tracking-wide text-text-dim">{rangeLabel(die)}</span>

      <div className={cn("relative flex size-[74px] items-center justify-center max-[900px]:size-12 max-[640px]:size-[clamp(38px,12vw,50px)]", spin && "animate-spin-roll")}>
        <DieShape die={die} crit={active ? crit : ""} />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[1.4rem] font-extrabold text-foreground [text-shadow:0_1px_2px_rgba(0,0,0,0.7)] max-[900px]:text-[1.05rem]">
          {displayValue}
        </span>
      </div>

      <span
        className={cn(
          "die-qty pointer-events-none absolute top-1.5 right-1.5 flex scale-[0.85] items-center gap-0.5 rounded-full border border-gold bg-bg-0 py-0.5 pr-1.5 pl-0.5 opacity-0 transition-[opacity,transform]",
          qty > 0 && "pointer-events-auto scale-100 opacity-100"
        )}
      >
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
          className="flex size-[18px] items-center justify-center rounded-full bg-face text-[0.8rem] leading-none text-gold transition-colors hover:bg-face-lit active:scale-[0.88]"
          aria-label={`Ubrat ${die.name} ze skupiny`}
        >
          −
        </span>
        <span className="min-w-[12px] text-center text-[0.72rem] font-extrabold text-gold-bright">{qty}</span>
      </span>
    </button>
  );
}
