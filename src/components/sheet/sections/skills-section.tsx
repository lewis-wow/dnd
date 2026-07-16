import { useFormContext } from "react-hook-form";
import { ABILITIES, abilityScoreTotal, computeRowBonus, type AbilityKey } from "@/lib/data/sheet";
import { fmtSigned } from "@/lib/data/dice";
import { Input } from "@/components/ui/input";
import { FieldTooltip } from "@/components/shared/field-tooltip";

function SkillRow({
  abilityKey,
  skillKey,
  label,
  onRoll,
}: {
  abilityKey: AbilityKey;
  skillKey: string;
  label: string;
  onRoll: (bonus: number, label: string) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, watch } = useFormContext<any>();
  const score = watch(`abilities.${abilityKey}.score`);
  const item = watch(`abilities.${abilityKey}.item`);
  const total = abilityScoreTotal(score, item);
  const misc = watch(`abilities.${abilityKey}.skills.${skillKey}`);
  const bonus = computeRowBonus(total, misc);

  return (
    <div className="flex items-center gap-2 border-t border-edge/50 py-1.5 first-of-type:border-t-0">
      <div className="min-w-0 flex-1 text-[0.8rem] text-foreground">{label}</div>
      <FieldTooltip
        className="shrink-0"
        content={`Další bonus k hodu na ${label.toLowerCase()} (např. zdatnostní bonus, pokud je postava zdatná, kouzlo, vybavení…)`}
      >
        <Input
          type="text"
          placeholder="0"
          className="h-auto w-10 rounded-md border-edge bg-face p-1 text-center text-[0.82rem] text-foreground"
          {...register(`abilities.${abilityKey}.skills.${skillKey}`)}
        />
      </FieldTooltip>
      <div
        className="w-8 shrink-0 text-center text-[0.88rem] font-extrabold text-gold-bright"
        title={`Celkový bonus k hodu na ${label.toLowerCase()} (modifikátor vlastnosti + zadaný bonus)`}
      >
        {fmtSigned(bonus)}
      </div>
      <button
        type="button"
        onClick={() => onRoll(bonus, label)}
        title={`Hodit 1k20 ${fmtSigned(bonus)} za ${label.toLowerCase()}`}
        className="flex size-6.5 shrink-0 items-center justify-center rounded-md border border-edge bg-face text-[0.9rem] leading-none text-gold hover:border-gold hover:bg-face-lit active:scale-90"
      >
        🎲
      </button>
    </div>
  );
}

export function SkillsSection({ onRoll }: { onRoll: (bonus: number, label: string) => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register } = useFormContext<any>();

  return (
    <div>
      {ABILITIES.filter((a) => a.skills.length > 0).map((a) => (
        <div key={a.key} className="mb-3 last:mb-0">
          <div className="mb-1 text-[0.68rem] tracking-wide text-text-dim uppercase">{a.label}</div>
          <div className="rounded-xl border border-edge bg-bg-1 px-3.5 py-1 pb-1.5">
            {a.skills.map((s) => (
              <SkillRow key={s.key} abilityKey={a.key} skillKey={s.key} label={s.label} onRoll={onRoll} />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-3 flex flex-col gap-1.5">
        <label className="text-[0.68rem] tracking-wide text-text-dim uppercase">Pasivní moudrost (vnímání)</label>
        <FieldTooltip content="Pasivní hodnota vnímání — 10 + modifikátor Moudrosti (+ zdatnost, je-li postava zdatná). Používá se místo hodu, když si postava ničeho nevšímá aktivně">
          <Input
            type="text"
            className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.92rem] text-foreground"
            {...register("passiveWis")}
          />
        </FieldTooltip>
      </div>
    </div>
  );
}
