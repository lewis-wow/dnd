import { useFieldArray, useFormContext } from "react-hook-form";
import { genId, type SheetFormValues } from "@/lib/data/sheet";
import { Input } from "@/components/ui/input";

export function AttacksSection() {
  const { control, register } = useFormContext<SheetFormValues>();
  const { fields, append, remove, update } = useFieldArray({ control, name: "attacks" });

  function handleRemove(index: number) {
    if (fields.length === 1) {
      update(index, { id: genId(), name: "", bonus: "", dmg: "" });
    } else {
      remove(index);
    }
  }

  return (
    <div>
      <div className="mb-2 flex flex-col gap-2">
        {fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-[2fr_1fr_1.4fr_auto] items-center gap-2">
            <Input
              type="text"
              placeholder="Název"
              className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.88rem] text-foreground"
              {...register(`attacks.${i}.name`)}
            />
            <Input
              type="text"
              placeholder="Bonus"
              className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.88rem] text-foreground"
              {...register(`attacks.${i}.bonus`)}
            />
            <Input
              type="text"
              placeholder="Zranění / typ"
              className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.88rem] text-foreground"
              {...register(`attacks.${i}.dmg`)}
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              aria-label="Smazat útok"
              className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-edge bg-face text-[1.1rem] leading-none text-text-dim transition-colors hover:border-crimson hover:bg-crimson/20 hover:text-crimson-bright"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ id: genId(), name: "", bonus: "", dmg: "" })}
        className="w-full rounded-lg border border-dashed border-edge bg-transparent px-3 py-2 text-[0.82rem] tracking-wide text-text-dim transition-[border-color,color,background] hover:border-gold hover:bg-gold/8 hover:text-gold-bright"
      >
        + Přidat útok
      </button>
    </div>
  );
}
