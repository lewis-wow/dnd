import { useFormContext } from "react-hook-form";
import { ABILITIES, abilityModFromTotal, abilityScoreTotal, pointBuyCost, type AbilityKey } from "@/lib/data/sheet";
import { fmtSigned } from "@/lib/data/dice";
import { Input } from "@/components/ui/input";
import { FieldTooltip } from "@/components/shared/field-tooltip";

function AbilityScoreCard({ abilityKey, label }: { abilityKey: AbilityKey; label: string }) {
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
          <FieldTooltip content="Základní hodnota vlastnosti, jak vyšla při tvorbě postavy">
            <Input
              type="text"
              placeholder="—"
              className="h-auto w-full rounded-lg border-edge bg-face p-2 text-center text-[1.05rem] font-extrabold text-foreground md:text-[1.05rem]"
              {...register(`abilities.${abilityKey}.score`)}
            />
          </FieldTooltip>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label className="text-center text-[0.6rem] tracking-wide text-text-dim uppercase">Body</label>
          <div
            title="Cena tohoto základu v systému point-buy (27 bodů celkem na rozdělení mezi všechny vlastnosti) — jen orientační přehled, nikam se nezapočítává"
            className="flex h-auto w-full cursor-default items-center justify-center rounded-lg border border-edge bg-bg-1 p-2 text-center text-[1.05rem] font-bold text-text-dim"
          >
            {points === null ? "—" : points}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label className="text-center text-[0.6rem] tracking-wide text-text-dim uppercase">Vybavení</label>
          <FieldTooltip content="Bonus z vybavení nebo kouzelných předmětů (např. rukavice obřích sil)">
            <Input
              type="text"
              placeholder="0"
              className="h-auto w-full rounded-lg border-edge bg-face p-2 text-center text-[1.05rem] font-extrabold text-foreground md:text-[1.05rem]"
              {...register(`abilities.${abilityKey}.item`)}
            />
          </FieldTooltip>
        </div>
      </div>

      <div className="text-center text-[0.75rem] text-text-dim">
        Modifikátor <strong className="text-[0.98rem] text-gold-bright">{fmtSigned(mod)}</strong>
        {itemNum !== 0 && total !== null && (
          <span className="text-[0.68rem]"> ({score} + {itemNum} = {total})</span>
        )}
      </div>
    </div>
  );
}

export function AbilityScoresSection() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
      {ABILITIES.map((a) => (
        <AbilityScoreCard key={a.key} abilityKey={a.key} label={a.label} />
      ))}
    </div>
  );
}
