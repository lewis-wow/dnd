import { cn } from "@/lib/utils";
import { dieByName } from "@/lib/data/dice";
import type { HistoryEntry } from "@/lib/data/history";
import { critTagText, formatRollText } from "@/lib/format-roll";
import { DieShape } from "@/components/dice/die-shape";
import type { RollingState } from "@/hooks/use-dice-roller";

const CRIT_TEXT: Record<string, string> = {
  "crit-hit": "text-crit-hit",
  "crit-miss": "text-crimson-bright",
};

export function ResultStage({
  lastEntry,
  rolling,
}: {
  lastEntry: HistoryEntry | null;
  rolling: RollingState;
}) {
  const showDie = !rolling && lastEntry && lastEntry.mode !== "pool" && lastEntry.die;
  const showPoolBadge = !rolling && lastEntry && lastEntry.mode === "pool";

  return (
    <div className="my-1.5 mb-4.5 flex min-h-[150px] flex-col items-center justify-center gap-1.5 min-[900px]:my-0 min-[900px]:mb-1.5 min-[900px]:min-h-[118px] min-[900px]:gap-0.5">
      <div
        className={cn(
          "relative flex h-24 items-center justify-center overflow-visible pointer-events-none opacity-0 scale-[0.6] transition-[opacity,transform] duration-300 min-[900px]:h-17",
          (showDie || showPoolBadge) && "opacity-100 scale-100"
        )}
      >
        {showDie && lastEntry?.die && (
          <div className="relative size-24 min-[900px]:size-17">
            <DieShape die={dieByName(lastEntry.die)} crit={lastEntry.crit} />
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center text-[1.28rem] font-extrabold tracking-wide text-gold-bright [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]",
                lastEntry.crit && CRIT_TEXT[lastEntry.crit]
              )}
            >
              {lastEntry.rolls[0]}
            </span>
          </div>
        )}
        {showPoolBadge && (
          <span className="px-1.5 text-center text-[0.78rem] leading-snug text-gold-bright">
            {lastEntry?.pool?.map((p) => `${p.qty}${p.name}`).join(" + ")}
          </span>
        )}
      </div>

      <div
        className={cn(
          "min-h-[1em] text-[clamp(3.5rem,14vw,6rem)] leading-none font-extrabold text-gold-bright [text-shadow:0_0_24px_rgba(217,180,90,0.35),0_3px_4px_rgba(0,0,0,0.6)] min-[900px]:text-[clamp(2rem,8vw,3.2rem)]",
          rolling && "text-text-dim [text-shadow:none]",
          !rolling && lastEntry?.crit && CRIT_TEXT[lastEntry.crit] && `${CRIT_TEXT[lastEntry.crit]} [text-shadow:0_0_30px_rgba(110,231,160,0.6)]`
        )}
      >
        {rolling ? "…" : lastEntry ? lastEntry.total : "—"}
      </div>

      <div className="min-h-[1.2em] px-2.5 text-center text-[0.95rem] tracking-[2px] text-text-dim">
        {rolling ? (
          "Házím..."
        ) : lastEntry ? (
          <>
            {lastEntry.tag && <span className="mr-1.5 font-bold text-gold-bright">{lastEntry.tag}</span>}
            {critTagText(lastEntry) && (
              <span
                className={cn(
                  "mr-1 text-[0.9rem] font-bold tracking-[3px] uppercase",
                  lastEntry.crit === "crit-hit" ? "text-crit-hit" : "text-crimson-bright"
                )}
              >
                {critTagText(lastEntry)} —{" "}
              </span>
            )}
            {formatRollText(lastEntry)}
          </>
        ) : (
          "Přidej kostky do skupiny a hoď"
        )}
      </div>
    </div>
  );
}
