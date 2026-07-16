import { createDefaultSheetValues, type SheetFormValues } from "@/lib/data/sheet";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export function loadSheetFromStorage(): SheetFormValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sheet);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed as SheetFormValues;
    }
  } catch {
    // corrupt storage — fall through to defaults
  }
  return createDefaultSheetValues();
}
