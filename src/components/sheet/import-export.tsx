import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { SheetFormValues } from "@/lib/data/sheet";
import { mergeSheetData } from "@/lib/sheet-merge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const toolbarBtn =
  "flex items-center gap-1 rounded-md border border-edge bg-face px-2 py-1 text-[0.7rem] tracking-wide text-text-dim transition-colors hover:border-gold hover:text-gold-bright";

function slugifyFilename(name: string | undefined): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "postava";
  return trimmed.replace(/[^\p{L}\p{N}_-]+/gu, "_").replace(/^_+|_+$/g, "") || "postava";
}

export function ImportExport() {
  const { getValues, reset } = useFormContext<SheetFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingImportRef = useRef<unknown>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  function handleExport() {
    const values = getValues();
    const blob = new Blob([JSON.stringify(values, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugifyFilename(values.basic?.charName)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // so picking the same file again still fires onChange
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          throw new Error("not an object");
        }
        pendingImportRef.current = parsed;
        setImportError(null);
        setConfirmOpen(true);
      } catch {
        setImportError("Soubor se nepodařilo přečíst — musí to být platný JSON export z této appky.");
      }
    };
    reader.onerror = () => setImportError("Soubor se nepodařilo načíst.");
    reader.readAsText(file);
  }

  function handleConfirmImport() {
    const merged = mergeSheetData(getValues(), pendingImportRef.current);
    reset(merged);
    pendingImportRef.current = null;
    setConfirmOpen(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={handleExport} title="Exportovat data postavy do souboru" className={toolbarBtn}>
        ⬇ Export
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        title="Importovat data postavy ze souboru"
        className={toolbarBtn}
      >
        ⬆ Import
      </button>
      <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileChange} />

      {importError && (
        <span className="text-[0.68rem] text-crimson-bright" role="alert">
          {importError}
        </span>
      )}

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) pendingImportRef.current = null;
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importovat data postavy?</AlertDialogTitle>
            <AlertDialogDescription>
              Přepíše aktuálně vyplněná pole hodnotami ze souboru. Pole, která jsou v souboru prázdná nebo v něm
              chybí, zůstanou beze změny. Tuto akci nelze vrátit zpět.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>Importovat</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
