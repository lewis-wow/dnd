import { cn } from "@/lib/utils";
import { dieByName } from "@/lib/data/dice";
import type { HistoryEntry } from "@/lib/data/history";
import { critTagText, formatRollText } from "@/lib/format-roll";
import { DieShape } from "@/components/dice/die-shape";

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryItem({
  entry,
  isNew,
  removing,
  onDelete,
}: {
  entry: HistoryEntry;
  isNew: boolean;
  removing: boolean;
  onDelete: () => void;
}) {
  const crit = critTagText(entry);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[10px] border border-edge border-l-[3px] border-l-gold bg-bg-2 p-2.5 transition-[opacity,transform] duration-200",
        entry.crit === "crit-hit" && "border-l-crit-hit",
        entry.crit === "crit-miss" && "border-l-crimson-bright",
        isNew && "animate-slide-in",
        removing && "scale-95 opacity-0"
      )}
    >
      <div className="size-9.5 shrink-0">
        {entry.mode === "pool" ? (
          <div className="flex size-full items-center justify-center text-[1.3rem]">🎲</div>
        ) : (
          <DieShape die={dieByName(entry.die!)} crit={entry.crit} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-bold tracking-wide text-foreground">
          {entry.tag && <span className="mr-1.5 font-bold text-gold-bright">{entry.tag}</span>}
          {crit && (
            <span
              className={cn(
                "mr-1 text-[0.8rem] font-bold tracking-[1.5px] uppercase",
                entry.crit === "crit-hit" ? "text-crit-hit" : "text-crimson-bright"
              )}
            >
              {crit}{" "}
            </span>
          )}
          {entry.notation}
        </div>
        <div className="mt-1 text-[0.78rem] break-words text-text-dim">{formatRollText(entry)}</div>
        <div className="mt-1 text-[0.68rem] text-text-dim opacity-70">{fmtTime(entry.ts)}</div>
      </div>

      <div
        className={cn(
          "ml-auto shrink-0 pl-2 text-right text-2xl leading-none font-extrabold text-gold-bright",
          entry.crit === "crit-hit" && "text-crit-hit",
          entry.crit === "crit-miss" && "text-crimson-bright"
        )}
      >
        {entry.total}
      </div>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Smazat hod"
        className="ml-1.5 flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-edge bg-face text-[1.15rem] leading-none text-text-dim transition-colors hover:border-crimson hover:bg-crimson/20 hover:text-crimson-bright active:scale-90"
      >
        ×
      </button>
    </div>
  );
}
