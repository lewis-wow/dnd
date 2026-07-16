import { DICE, type DieName } from "@/lib/data/dice";
import { DieTile } from "@/components/dice/die-tile";
import type { HistoryEntry } from "@/lib/data/history";
import type { RollingState } from "@/hooks/use-dice-roller";
import { dieResultDisplay } from "@/lib/format-roll";

export function DiceTray({
  pool,
  lastEntry,
  rolling,
  flickerValues,
  onAdd,
  onRemove,
}: {
  pool: Partial<Record<DieName, number>>;
  lastEntry: HistoryEntry | null;
  rolling: RollingState;
  flickerValues: Partial<Record<DieName, string>>;
  onAdd: (name: DieName) => void;
  onRemove: (name: DieName) => void;
}) {
  return (
    // flex-wrap + justify-center (not CSS grid) at every breakpoint, including
    // mobile — grid-template-columns:repeat(3,1fr) auto-places a trailing
    // orphan item (7 dice ÷ 3 columns leaves one) into column 1 of its own
    // row, flush left with two empty cells beside it, instead of centering
    // it. flex-wrap centers whatever's left on the last row regardless of
    // count, which is what "3 per row, last one centered" actually needs.
    <div className="flex w-full max-w-[760px] flex-wrap justify-center gap-2 min-[641px]:gap-4.5 min-[900px]:max-w-[380px] min-[900px]:gap-2">
      {DICE.map((die) => {
        const isRollingParticipant = !!rolling?.participants.includes(die.name);
        const settled = dieResultDisplay(die.name, die.faceValue, lastEntry);
        const displayValue = isRollingParticipant
          ? (flickerValues[die.name] ?? die.faceValue)
          : rolling
            ? die.faceValue
            : settled.value;
        return (
          <div
            key={die.name}
            className="flex-[0_0_calc((100%-16px)/3)] min-[641px]:flex-[0_0_140px] min-[900px]:flex-[0_0_118px]"
          >
            <DieTile
              die={die}
              qty={pool[die.name] ?? 0}
              active={rolling ? isRollingParticipant : settled.active}
              crit={rolling ? "" : settled.crit}
              rolling={isRollingParticipant}
              displayValue={displayValue}
              onAdd={() => onAdd(die.name)}
              onRemove={() => onRemove(die.name)}
            />
          </div>
        );
      })}
    </div>
  );
}
