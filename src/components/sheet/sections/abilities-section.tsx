import { useFormContext } from "react-hook-form";
import {
  ABILITIES,
  abilityModFromTotal,
  abilityScoreTotal,
  computeRowBonus,
  pointBuyCost,
  type AbilityKey,
} from "@/lib/data/sheet";
import { fmtSigned } from "@/lib/data/dice";
import { Input } from "@/components/ui/input";

function AbilityRow({
  abilityKey,
  rowKey,
  label,
  total,
  onRoll,
}: {
  abilityKey: AbilityKey;
  rowKey: string;
  label: string;
  total: number | null;
  onRoll: (bonus: number, label: string) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, watch } = useFormContext<any>();
  const miscPath =
    rowKey === "save" ? `abilities.${abilityKey}.saveMisc` : `abilities.${abilityKey}.skills.${rowKey}`;
  const misc = watch(miscPath);
  const bonus = computeRowBonus(total, misc);

  return (
    <div className="flex items-center gap-2 border-t border-edge/50 py-1.5 first-of-type:border-t-0">
      <div className="min-w-0 flex-1 text-[0.8rem] text-foreground">{label}</div>
      <Input
        type="text"
        placeholder="0"
        title="Další bonus (např. zdatnostní bonus, pokud je postava zdatná, kouzlo, vybavení…)"
        className="h-auto w-10 shrink-0 rounded-md border-edge bg-face p-1 text-center text-[0.82rem] text-foreground"
        {...register(miscPath)}
      />
      <div className="w-8 shrink-0 text-center text-[0.88rem] font-extrabold text-gold-bright">
        {fmtSigned(bonus)}
      </div>
      <button
        type="button"
        onClick={() => onRoll(bonus, label)}
        className="flex size-[26px] shrink-0 items-center justify-center rounded-md border border-edge bg-face text-[0.9rem] leading-none text-gold hover:border-gold hover:bg-face-lit active:scale-90"
      >
        🎲
      </button>
    </div>
  );
}

function AbilityCard({ abilityKey, label, skills, onRoll }: { abilityKey: AbilityKey; label: string; skills: { key: string; label: string }[]; onRoll: (bonus: number, label: string) => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, watch } = useFormContext<any>();
  const score = watch(`abilities.${abilityKey}.score`);
  const item = watch(`abilities.${abilityKey}.item`);
  const total = abilityScoreTotal(score, item);
  const mod = abilityModFromTotal(total);
  const points = pointBuyCost(parseInt(score, 10));
  const itemNum = parseInt(item, 10) || 0;

  return (
    <div className="rounded-xl border border-edge bg-bg-1 px-3.5 py-3 pb-3.5">
      <div className="mb-2 text-[0.85rem] font-bold tracking-wide text-gold-bright">{label.toUpperCase()}</div>

      <div className="mb-1.5 flex gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label className="text-center text-[0.6rem] tracking-wide text-text-dim uppercase">Základ</label>
          <Input
            type="text"
            placeholder="—"
            title="Základní hodnota vlastnosti, jak vyšla při tvorbě postavy"
            className="h-auto w-full rounded-lg border-edge bg-face p-2 text-center text-[1.05rem] font-extrabold text-foreground"
            {...register(`abilities.${abilityKey}.score`)}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label className="text-center text-[0.6rem] tracking-wide text-text-dim uppercase">Body</label>
          <div
            title="Cena tohoto základu v systému point-buy (27 bodů celkem na rozdělení mezi všechny vlastnosti)"
            className="flex h-auto w-full cursor-default items-center justify-center rounded-lg border border-edge bg-bg-1 p-2 text-center text-[1.05rem] font-bold text-text-dim"
          >
            {points === null ? "—" : points}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label className="text-center text-[0.6rem] tracking-wide text-text-dim uppercase">Vybavení</label>
          <Input
            type="text"
            placeholder="0"
            title="Bonus z vybavení nebo kouzelných předmětů (např. rukavice obřích sil)"
            className="h-auto w-full rounded-lg border-edge bg-face p-2 text-center text-[1.05rem] font-extrabold text-foreground"
            {...register(`abilities.${abilityKey}.item`)}
          />
        </div>
      </div>

      <div className="mb-2 text-center text-[0.75rem] text-text-dim">
        Modifikátor <strong className="text-[0.98rem] text-gold-bright">{fmtSigned(mod)}</strong>
        {itemNum !== 0 && total !== null && (
          <span className="text-[0.68rem]"> ({score} + {itemNum} = {total})</span>
        )}
      </div>

      <AbilityRow abilityKey={abilityKey} rowKey="save" label="Záchranný hod" total={total} onRoll={onRoll} />
      {skills.map((s) => (
        <AbilityRow key={s.key} abilityKey={abilityKey} rowKey={s.key} label={s.label} total={total} onRoll={onRoll} />
      ))}
    </div>
  );
}

export function AbilitiesSection({ onRoll }: { onRoll: (bonus: number, label: string) => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register } = useFormContext<any>();

  return (
    <div className="my-2.5">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {ABILITIES.map((a) => (
          <AbilityCard key={a.key} abilityKey={a.key} label={a.label} skills={a.skills} onRoll={onRoll} />
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <label className="text-[0.68rem] tracking-wide text-text-dim uppercase">Pasivní moudrost (vnímání)</label>
        <Input
          type="text"
          className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.92rem] text-foreground"
          {...register("passiveWis")}
        />
      </div>
    </div>
  );
}
