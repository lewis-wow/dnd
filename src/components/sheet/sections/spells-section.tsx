import { useFormContext } from "react-hook-form";
import { SPELL_ABILITIES, SPELL_ABILITY_TIP, type SheetFormValues } from "@/lib/data/sheet";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/sheet/form-select";
import { ItemList } from "@/components/sheet/item-list";

function SpellLevelCard({ level }: { level: number }) {
  const { register } = useFormContext<SheetFormValues>();
  const isCantrip = level === 0;

  return (
    <div className="rounded-xl border border-edge bg-bg-1 px-3.5 py-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full border border-gold text-[0.8rem] font-extrabold text-gold-bright">
          {level}
        </span>
        <span className="flex-1 text-[0.85rem] font-bold tracking-wide text-gold">
          {isCantrip ? "Triky" : `Kouzla ${level}. úrovně`}
        </span>
        {!isCantrip && (
          <>
            <label className="mr-0.5 text-[0.66rem] tracking-wide text-text-dim">Pozic celkem</label>
            <Input
              type="text"
              className="h-auto w-13 rounded-md border-edge bg-face p-1 text-center text-[0.8rem] text-foreground"
              {...register(`spells.levels.${level}.slotsTotal`)}
            />
            <label className="mr-0.5 text-[0.66rem] tracking-wide text-text-dim">Utraceno</label>
            <Input
              type="text"
              className="h-auto w-13 rounded-md border-edge bg-face p-1 text-center text-[0.8rem] text-foreground"
              {...register(`spells.levels.${level}.slotsUsed`)}
            />
          </>
        )}
      </div>
      <ItemList
        name={`spells.levels.${level}.spells`}
        placeholder="Název kouzla"
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
          <label className="text-[0.68rem] tracking-wide text-text-dim uppercase" title={SPELL_ABILITY_TIP}>
            Sesílací vlastnost
          </label>
          <FormSelect path="spells.ability" options={SPELL_ABILITIES} placeholder="Vyber vlastnost…" tip={SPELL_ABILITY_TIP} />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label
            className="text-[0.68rem] tracking-wide text-text-dim uppercase"
            title="Stupeň obtížnosti, který musí cíl přehodit, aby odolal tvému kouzlu (obvykle 8 + oprava + zdatnostní bonus)"
          >
            Stupeň obtížnosti záchrany kouzel
          </label>
          <Input type="text" className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.92rem] text-foreground" {...register("spells.saveDc")} />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-[0.68rem] tracking-wide text-text-dim uppercase" title="Bonus přičítaný k hodu na útok kouzlem">
            Útočný bonus kouzla
          </label>
          <Input type="text" className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.92rem] text-foreground" {...register("spells.attackBonus")} />
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
