import { useController, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FormSelect({
  path,
  options,
  placeholder,
}: {
  path: string;
  options: string[];
  placeholder?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control } = useFormContext<any>();
  const { field } = useController({ name: path, control });

  return (
    <Select value={field.value || ""} onValueChange={field.onChange}>
      <SelectTrigger className="h-8.5 w-full rounded-lg border-edge bg-face px-2.5 py-1 text-[0.92rem] text-foreground data-[size=default]:h-8.5">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
