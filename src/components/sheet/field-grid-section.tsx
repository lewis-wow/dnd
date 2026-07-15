import type { FieldSpec } from "@/lib/data/sheet";
import { SheetField } from "@/components/sheet/sheet-field";

export function FieldGridSection({ sectionKey, fields }: { sectionKey: string; fields: FieldSpec[] }) {
  return (
    <div className="my-2.5 grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
      {fields.map((f) => (
        <SheetField key={f.key} sectionKey={sectionKey} field={f} />
      ))}
    </div>
  );
}
