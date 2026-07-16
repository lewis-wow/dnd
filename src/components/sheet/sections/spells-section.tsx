import { useFormContext } from "react-hook-form";
import { SPELL_ABILITIES, SPELL_ABILITY_TIP, type SheetFormValues } from "@/lib/data/sheet";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/sheet/form-select";
import { ItemList } from "@/components/sheet/item-list";
import { FieldTooltip } from "@/components/shared/field-tooltip";

function SpellLevelCard({ level }: { level: number }) {
  const { register } = useFormContext<SheetFormValues>();
  const isCantrip = level === 0;
  const levelLabel = isCantrip ? "triky" : `kouzla ${level}. úrovně`;

  return (
    <div className="rounded-xl border border-edge bg-bg-1 px-3.5 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full border border-gold text-[0.8rem] font-extrabold text-gold-bright">
          {level}
        </span>
        <span className="flex-1 text-[0.85rem] font-bold tracking-wide text-gold">
          {isCantrip ? "Triky" : `Kouzla ${level}. úrovně`}
        </span>
      </div>
      {!isCantrip && (
        <div className="mb-2 flex flex-wrap gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <label className="text-[0.62rem] tracking-wide text-text-dim uppercase">Pozic celkem</label>
            <FieldTooltip content={`Kolik pozic ${level}. úrovně má postava celkem k dispozici za odpočinek`}>
              <Input
                type="text"
                className="h-auto w-16 rounded-md border-edge bg-face p-1.5 text-center text-[0.8rem] text-foreground"
                {...register(`spells.levels.${level}.slotsTotal`)}
              />
            </FieldTooltip>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <label className="text-[0.62rem] tracking-wide text-text-dim uppercase">Utraceno</label>
            <FieldTooltip content={`Kolik pozic ${level}. úrovně už postava od posledního odpočinku utratila`}>
              <Input
                type="text"
                className="h-auto w-16 rounded-md border-edge bg-face p-1.5 text-center text-[0.8rem] text-foreground"
                {...register(`spells.levels.${level}.slotsUsed`)}
              />
            </FieldTooltip>
          </div>
        </div>
      )}
      <ItemList
        name={`spells.levels.${level}.spells`}
        placeholder="Název kouzla"
        tip={`Název kouzla mezi ${levelLabel}, které postava zná nebo má připravené`}
        addLabel="+ Přidat kouzlo"
        deleteLabel="Smazat kouzlo"
      />
    </div>
  );
}

export function SpellsSection() {
  const { register } = useFormContext<SheetFormValues>();

  return (
    <div>
      <div className="mb-3 grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-[0.68rem] tracking-wide text-text-dim uppercase">Sesílací vlastnost</label>
          <FieldTooltip content={SPELL_ABILITY_TIP}>
            <FormSelect path="spells.ability" options={SPELL_ABILITIES} placeholder="Vyber vlastnost…" />
          </FieldTooltip>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-[0.68rem] tracking-wide text-text-dim uppercase">Stupeň obtížnosti záchrany kouzel</label>
          <FieldTooltip content="Stupeň obtížnosti, který musí cíl přehodit, aby odolal tvému kouzlu (obvykle 8 + oprava sesílací vlastnosti + zdatnostní bonus)">
            <Input type="text" className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.92rem] text-foreground" {...register("spells.saveDc")} />
          </FieldTooltip>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-[0.68rem] tracking-wide text-text-dim uppercase">Útočný bonus kouzla</label>
          <FieldTooltip content="Bonus přičítaný k hodu na útok kouzlem (oprava sesílací vlastnosti + zdatnostní bonus)">
            <Input type="text" className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.92rem] text-foreground" {...register("spells.attackBonus")} />
          </FieldTooltip>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 10 }, (_, level) => (
          <SpellLevelCard key={level} level={level} />
        ))}
      </div>
    </div>
  );
}
