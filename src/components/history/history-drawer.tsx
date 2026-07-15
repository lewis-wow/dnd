import { useEffect, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import type { HistoryEntry } from "@/lib/data/history";
import { HistoryItem } from "@/components/history/history-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function HistoryDrawer({
  open,
  onOpenChange,
  history,
  onDelete,
  onClear,
  onWipeAll,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: HistoryEntry[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onWipeAll: () => void;
}) {
  const prevTopId = useRef<string | undefined>(history[0]?.id);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const topId = history[0]?.id;
    if (topId && topId !== prevTopId.current) {
      setJustAddedId(topId);
      const t = setTimeout(() => setJustAddedId(null), 300);
      prevTopId.current = topId;
      return () => clearTimeout(t);
    }
    prevTopId.current = topId;
  }, [history]);

  function handleDelete(id: string) {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      onDelete(id);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-black/55 opacity-0 transition-opacity duration-250 data-open:opacity-100" />
        <DialogPrimitive.Popup
          style={{ height: "var(--app-height, 100dvh)" }}
          className="fixed inset-y-0 right-0 z-50 flex w-100 max-w-[90vw] translate-x-full flex-col bg-linear-to-b from-bg-1 to-bg-0 shadow-[-8px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out data-open:translate-x-0 outline-none"
        >
          <div className="flex items-center justify-between border-b border-edge p-5">
            <DialogPrimitive.Title className="m-0 text-[1.2rem] tracking-[2px] text-gold">
              Historie hodů
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Zavřít"
              className="text-[1.6rem] leading-none text-text-dim transition-colors hover:text-foreground"
            >
              ×
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 [scrollbar-gutter:stable]">
            {history.length === 0 ? (
              <div className="p-10 text-center text-text-dim italic">Zatím žádné hody. Hoď kostkou!</div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {history.map((entry) => (
                  <HistoryItem
                    key={entry.id}
                    entry={entry}
                    isNew={entry.id === justAddedId}
                    removing={removingIds.has(entry.id)}
                    onDelete={() => handleDelete(entry.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5 border-t border-edge p-4">
            <AlertDialog>
              <AlertDialogTrigger
                disabled={history.length === 0}
                className={cn(
                  "w-full rounded-[10px] border border-crimson bg-transparent p-3 text-[0.9rem] tracking-wide text-crimson-bright transition-colors hover:not-disabled:bg-crimson/15 disabled:cursor-not-allowed disabled:opacity-40"
                )}
              >
                🗑 Smazat historii
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Smazat historii?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tímto trvale odstraníš všech <strong>{history.length}</strong> zaznamenaných hodů. Tuto akci
                    nelze vrátit zpět.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={onClear}>
                    Smazat vše
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger className="w-full rounded-[10px] border border-dashed border-edge bg-transparent p-2.5 text-[0.78rem] tracking-wide text-text-dim transition-colors hover:border-crimson hover:bg-crimson/15 hover:text-crimson-bright">
                🧨 Smazat všechna data aplikace
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Smazat všechna data aplikace?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tímto trvale odstraníš historii hodů, celý deník postavy i uložené rozložení panelů. Tuto akci
                    nelze vrátit zpět.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={onWipeAll}>
                    Smazat vše
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
