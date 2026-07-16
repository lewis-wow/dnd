import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DieGradientDefs } from "@/components/dice/die-shape";
import { TopBar } from "@/components/layout/top-bar";
import { GuideDrawer } from "@/components/guide/guide-drawer";
import { DiceBar } from "@/components/dice/dice-bar";
import { SheetPane } from "@/components/sheet/sheet-pane";
import { HistoryDrawer } from "@/components/history/history-drawer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDiceRoller } from "@/hooks/use-dice-roller";
import { useChromeHeight } from "@/hooks/use-chrome-height";
import { loadSheetFromStorage } from "@/lib/sheet-storage";
import { createDefaultSheetValues, type SheetFormValues } from "@/lib/data/sheet";
import { STORAGE_KEYS } from "@/lib/storage-keys";

function App() {
  const form = useForm<SheetFormValues>({ defaultValues: loadSheetFromStorage() });

  const topbarRef = useRef<HTMLElement>(null);
  useChromeHeight(topbarRef);

  const roller = useDiceRoller();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Escape closes whichever drawer is open, mirroring the legacy app's
  // single global keydown listener.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (historyOpen) {
        setHistoryOpen(false);
        return;
      }
      if (guideOpen) {
        setGuideOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [historyOpen, guideOpen]);

  // Debounced sheet persistence — mirrors the legacy 250ms save-on-input debounce.
  useEffect(() => {
    const timer = { current: null as number | null };
    const sub = form.watch((values) => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        localStorage.setItem(STORAGE_KEYS.sheet, JSON.stringify(values));
      }, 250);
    });
    return () => {
      sub.unsubscribe();
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [form]);

  function handleWipeAll() {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    roller.clearHistory();
    roller.resetRollerDisplay();
    roller.setSettings({ mod: 0, pool: {} });
    form.reset(createDefaultSheetValues());
    setHistoryOpen(false);
  }

  return (
    <FormProvider {...form}>
      <TooltipProvider delay={300}>
        <DieGradientDefs />
        <div className="flex min-h-(--app-height,100dvh) flex-col">
          <TopBar
            ref={topbarRef}
            historyCount={roller.history.length}
            onOpenHistory={() => setHistoryOpen(true)}
            onOpenGuide={() => setGuideOpen(true)}
          />

          <DiceBar
            pool={roller.pool}
            mod={roller.mod}
            onModChange={(n) => roller.setMod(n)}
            lastEntry={roller.lastEntry}
            rolling={roller.rolling}
            flickerValues={roller.flickerValues}
            onAdd={(name) => roller.setPoolQty(name, (roller.pool[name] ?? 0) + 1)}
            onRemove={(name) => roller.setPoolQty(name, (roller.pool[name] ?? 0) - 1)}
            onRollPool={roller.rollPool}
            onAdvantage={() => roller.rollAdvantage("adv")}
            onDisadvantage={() => roller.rollAdvantage("dis")}
          />

          <SheetPane onRoll={roller.rollFromSheet} />
        </div>

        <GuideDrawer open={guideOpen} onOpenChange={setGuideOpen} />

        <HistoryDrawer
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          history={roller.history}
          onDelete={roller.deleteHistoryEntry}
          onClear={roller.clearHistory}
          onWipeAll={handleWipeAll}
        />
      </TooltipProvider>
    </FormProvider>
  );
}

export default App;
