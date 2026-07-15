import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FieldSpec } from "@/lib/data/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/sheet/form-select";

const inputClass =
  "rounded-lg border-edge bg-face px-2.5 py-2 text-[0.92rem] text-foreground focus-visible:border-gold focus-visible:ring-[rgba(217,180,90,0.2)]";

export function SheetField({ sectionKey, field }: { sectionKey: string; field: FieldSpec }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, watch } = useFormContext<any>();
  const path = `${sectionKey}.${field.key}`;
  const otherPath = `${path}_other`;
  const currentValue: string = watch(path);
  const showOther = !!field.otherValue && currentValue === field.otherValue;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", field.wide && "col-span-full")}>
      <label className="text-[0.68rem] tracking-wide text-text-dim uppercase" title={field.tip}>
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <Textarea
          rows={3}
          placeholder={field.placeholder}
          title={field.tip}
          className={cn(inputClass, "min-h-19 resize-y")}
          {...register(path)}
        />
      ) : field.type === "select" ? (
        <FormSelect path={path} options={field.options!} placeholder={field.optionsPlaceholder} tip={field.tip} />
      ) : (
        <Input type="text" placeholder={field.placeholder} title={field.tip} className={inputClass} {...register(path)} />
      )}
      {field.otherValue && (
        <Input
          type="text"
          placeholder="Uveď vlastní…"
          className={cn(inputClass, "mt-1.5", !showOther && "hidden")}
          {...register(otherPath)}
        />
      )}
    </div>
  );
}
