import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FieldSpec } from "@/lib/data/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/sheet/form-select";
import { FieldTooltip } from "@/components/shared/field-tooltip";

const inputClass =
  "rounded-lg border-edge bg-face px-2.5 py-2 text-[0.92rem] text-foreground focus-visible:border-gold focus-visible:ring-[rgba(217,180,90,0.2)]";

export function SheetField({ sectionKey, field }: { sectionKey: string; field: FieldSpec }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, watch } = useFormContext<any>();
  const path = `${sectionKey}.${field.key}`;
  const otherPath = `${path}_other`;
  const currentValue: string = watch(path);
  const showOther = !!field.otherValue && currentValue === field.otherValue;

  const control =
    field.type === "textarea" ? (
      <Textarea rows={3} placeholder={field.placeholder} className={cn(inputClass, "min-h-19 resize-y")} {...register(path)} />
    ) : field.type === "select" ? (
      <FormSelect path={path} options={field.options!} placeholder={field.optionsPlaceholder} />
    ) : (
      <Input type="text" placeholder={field.placeholder} className={inputClass} {...register(path)} />
    );

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", field.wide && "col-span-full")}>
      <label className="text-[0.68rem] tracking-wide text-text-dim uppercase">{field.label}</label>
      {field.tip ? <FieldTooltip content={field.tip}>{control}</FieldTooltip> : control}
      {field.otherValue && showOther && (
        <FieldTooltip content={`Vlastní ${field.label.toLowerCase()}, pokud není v nabízeném seznamu`}>
          <Input type="text" placeholder="Uveď vlastní…" className={inputClass} {...register(otherPath)} />
        </FieldTooltip>
      )}
    </div>
  );
}
