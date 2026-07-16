import { useFieldArray, useFormContext } from "react-hook-form";
import { genId } from "@/lib/data/sheet";
import { Input } from "@/components/ui/input";
import { FieldTooltip } from "@/components/shared/field-tooltip";

export function ItemList({
  name,
  placeholder,
  tip,
  addLabel,
  deleteLabel,
}: {
  name: string;
  placeholder: string;
  tip: string;
  addLabel: string;
  deleteLabel: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control, register } = useFormContext<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove, update } = useFieldArray({ control, name: name as any });

  function handleRemove(index: number) {
    if (fields.length === 1) {
      update(index, { id: genId(), text: "" });
    } else {
      remove(index);
    }
  }

  return (
    <div className="mb-2.5 flex flex-col gap-2">
      {fields.map((f, i) => (
        <div key={f.id} className="grid grid-cols-[1fr_auto] items-center gap-2">
          <FieldTooltip content={tip}>
            <Input
              type="text"
              placeholder={placeholder}
              className="rounded-lg border-edge bg-face px-2.5 py-2 text-[0.88rem] text-foreground focus-visible:border-gold"
              {...register(`${name}.${i}.text`)}
            />
          </FieldTooltip>
          <button
            type="button"
            onClick={() => handleRemove(i)}
            aria-label={deleteLabel}
            title={deleteLabel}
            className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-edge bg-face text-[1.1rem] leading-none text-text-dim transition-colors hover:border-crimson hover:bg-crimson/20 hover:text-crimson-bright"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ id: genId(), text: "" })}
        className="w-full rounded-lg border border-dashed border-edge bg-transparent px-3 py-2 text-[0.82rem] tracking-wide text-text-dim transition-[border-color,color,background] hover:border-gold hover:bg-gold/8 hover:text-gold-bright"
      >
        {addLabel}
      </button>
    </div>
  );
}
