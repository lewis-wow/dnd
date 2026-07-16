import { genId, type SheetFormValues } from "@/lib/data/sheet";

/**
 * Merges imported JSON into the current sheet: any field that's non-empty in
 * `imported` overwrites the current value; anything empty, missing, or the
 * wrong shape in `imported` leaves the current value untouched. Applied
 * recursively so this works uniformly for the flat basic/combat/etc field
 * records, the nested ability cards, and the attacks/features/spells lists —
 * no per-section special-casing needed.
 *
 * Arrays (attacks, item-lists, spell levels) are merged index by index
 * (so importing just row 0 of a 3-row list only touches row 0); imported
 * rows beyond the current list's length are appended with a *fresh* id
 * (never trusting an imported id, since it could collide with one already
 * in use). Current rows are never removed just because the import is
 * shorter or missing that list entirely.
 */
export function mergeSheetData(current: SheetFormValues, imported: unknown): SheetFormValues {
  return mergeValue(current, imported) as SheetFormValues;
}

function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mergeValue(current: unknown, imported: unknown): unknown {
  if (typeof current === "string") {
    return isEmpty(imported) ? current : (imported as string);
  }

  if (Array.isArray(current)) {
    if (!Array.isArray(imported) || imported.length === 0) return current;
    const merged = current.map((row, i) => (i < imported.length ? mergeValue(row, imported[i]) : row));
    const template = current[0];
    for (let i = current.length; i < imported.length; i++) {
      const row = template !== undefined ? mergeValue(template, imported[i]) : imported[i];
      merged.push(isPlainObject(row) && "id" in row ? { ...row, id: genId() } : row);
    }
    return merged;
  }

  if (isPlainObject(current)) {
    if (!isPlainObject(imported)) return current;
    const result: Record<string, unknown> = { ...current };
    for (const key of Object.keys(current)) {
      if (key === "id") continue; // never import a row's identity — keep whatever it already is
      result[key] = mergeValue(current[key], imported[key]);
    }
    return result;
  }

  return current;
}
