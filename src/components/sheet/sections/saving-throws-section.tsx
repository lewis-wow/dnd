import { useFormContext } from "react-hook-form";
import { ABILITIES, abilityScoreTotal, computeRowBonus, type AbilityKey } from "@/lib/data/sheet";
import { fmtSigned } from "@/lib/data/dice";
import { Input } from "@/components/ui/input";
import { FieldTooltip } from "@/components/shared/field-tooltip";

function SavingThrowRow({
  abilityKey,
  label,
  onRoll,
}: {
  abilityKey: AbilityKey;
  label: string;
  onRoll: (bonus: number, label: string) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, watch } = useFormContext<any>();
  const score = watch(`abilities.${abilityKey}.score`);
  const item = watch(`abilities.${abilityKey}.item`);
  const total = abilityScoreTotal(score, item);
  const misc = watch(`abilities.${abilityKey}.saveMisc`);
  const bonus = computeRowBonus(total, misc);
  const rollLabel = `${label} (záchranný hod)`;

  return (
    <div className="flex items-center gap-2 border-t border-edge/50 py-1.5 first-of-type:border-t-0">
      <div className="min-w-0 flex-1 text-[0.8rem] text-foreground">{label}</div>
      <FieldTooltip
        className="shrink-0"
        content={`Další bonus k záchrannému hodu na ${label.toLowerCase()} (např. zdatnostní bonus, pokud je postava zdatná, kouzlo, vybavení…)`}
      >
        <Input
          type="text"
          placeholder="0"
          className="h-auto w-10 rounded-md border-edge bg-face p-1 text-center text-[0.82rem] text-foreground"
          {...register(`abilities.${abilityKey}.saveMisc`)}
        />
      </FieldTooltip>
      <div
        className="w-8 shrink-0 text-center text-[0.88rem] font-extrabold text-gold-bright"
        title={`Celkový bonus k záchrannému hodu na ${label.toLowerCase()} (modifikátor vlastnosti + zadaný bonus)`}
      >
        {fmtSigned(bonus)}
      </div>
      <button
        type="button"
        onClick={() => onRoll(bonus, rollLabel)}
        title={`Hodit 1k20 ${fmtSigned(bonus)} za ${label.toLowerCase()} (záchranný hod)`}
        className="flex size-6.5 shrink-0 items-center justify-center rounded-md border border-edge bg-face text-[0.9rem] leading-none text-gold hover:border-gold hover:bg-face-lit active:scale-90"
      >
        🎲
      </button>
    </div>
  );
}

export function SavingThrowsSection({ onRoll }: { onRoll: (bonus: number, label: string) => void }) {
  return (
    <div className="rounded-xl border border-edge bg-bg-1 px-3.5 py-1 pb-1.5">
      {ABILITIES.map((a) => (
        <SavingThrowRow key={a.key} abilityKey={a.key} label={a.label} onRoll={onRoll} />
      ))}
    </div>
  );
}
