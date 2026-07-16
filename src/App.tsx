import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DieGradientDefs } from "@/components/dice/die-shape";
import { TopBar } from "@/components/layout/top-bar";
import { PaneResizer } from "@/components/layout/pane-resizer";
import { GuidePane } from "@/components/guide/guide-pane";
import { DicePane } from "@/components/dice/dice-pane";
import { SheetPane } from "@/components/sheet/sheet-pane";
import { HistoryDrawer } from "@/components/history/history-drawer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDiceRoller } from "@/hooks/use-dice-roller";
import { useResizablePane } from "@/hooks/use-resizable-pane";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useChromeHeight } from "@/hooks/use-chrome-height";
import { loadSheetFromStorage } from "@/lib/sheet-storage";
import { createDefaultSheetValues, type SheetFormValues } from "@/lib/data/sheet";
import {
  GUIDE_DEFAULT,
  GUIDE_MIN,
  PANE_MIN,
  PANE_SPLIT_MIN_WIDTH,
  SHEET_PANE_RESERVE,
  STORAGE_KEYS,
} from "@/lib/storage-keys";

function App() {
  const form = useForm<SheetFormValues>({ defaultValues: loadSheetFromStorage() });
  const isSplitView = useMediaQuery(`(min-width: ${PANE_SPLIT_MIN_WIDTH}px)`);
  const isPhone = useMediaQuery("(max-width: 640px)");

  const topbarRef = useRef<HTMLElement>(null);
  useChromeHeight(topbarRef);

  const appShellRef = useRef<HTMLDivElement>(null);
  const guidePaneElRef = useRef<HTMLElement>(null);
  const dicePaneElRef = useRef<HTMLElement>(null);

  const guideResize = useResizablePane({
    storageKey: STORAGE_KEYS.guideWidth,
    min: GUIDE_MIN,
    computeMax: () =>
      Math.max(GUIDE_DEFAULT, window.innerWidth - (dicePaneElRef.current?.getBoundingClientRect().width ?? 0) - SHEET_PANE_RESERVE),
    getAnchorLeft: () => appShellRef.current?.getBoundingClientRect().left ?? 0,
  });
  const paneResize = useResizablePane({
    storageKey: STORAGE_KEYS.paneWidth,
    min: PANE_MIN,
    computeMax: () =>
      Math.max(PANE_MIN, window.innerWidth - (guidePaneElRef.current?.getBoundingClientRect().width ?? 0) - SHEET_PANE_RESERVE),
    getAnchorLeft: () => dicePaneElRef.current?.getBoundingClientRect().left ?? 0,
  });

  const guideWidthPx = isSplitView ? (guideResize.width ?? 0) : null;
  const dicePaneWidthPx = isSplitView ? paneResize.width : null;

  const roller = useDiceRoller();
  const [historyOpen, setHistoryOpen] = useState(false);

  // Escape closes the history drawer, and (on the ≥900px split layout) collapses
  // an open guide pane — mirrors the legacy app's single global keydown listener.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (historyOpen) {
        setHistoryOpen(false);
        return;
      }
      if (isSplitView && (guideResize.width ?? 0) > 4) {
        guideResize.setWidth(0);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyOpen, isSplitView]);

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
    roller.setSettings({ mod: 0, pool: {} });
    form.reset(createDefaultSheetValues());
    setHistoryOpen(false);
  }

  return (
    <FormProvider {...form}>
      <TooltipProvider delay={300}>
      <DieGradientDefs />
      <TopBar ref={topbarRef} historyCount={roller.history.length} onOpenHistory={() => setHistoryOpen(true)} />

      <div
        ref={appShellRef}
        style={
          isSplitView
            ? {
                height: "calc(var(--app-height, 100dvh) - var(--chrome-h, 62px))",
                overflow: "hidden",
                // flex-1's flex-basis:0% would otherwise win over the explicit
                // height above in the flex-sizing algorithm — pin the basis so
                // the calc'd height is what actually gets used.
                flex: "0 0 auto",
              }
            : undefined
        }
        className="flex w-full flex-1 flex-col min-[900px]:flex-row"
      >
        <GuidePane ref={guidePaneElRef} widthPx={guideWidthPx} hidden={isSplitView && (guideResize.width ?? 0) <= 0} />

        <PaneResizer
          label="Změnit šířku příručky"
          dragging={guideResize.dragging}
          onPointerDown={guideResize.onPointerDown}
          onKeyDown={guideResize.onKeyDown}
        />

        <DicePane
          ref={dicePaneElRef}
          widthPx={dicePaneWidthPx}
          isPhone={isPhone}
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

        <PaneResizer
          label="Změnit šířku panelu s kostkami"
          dragging={paneResize.dragging}
          onPointerDown={paneResize.onPointerDown}
          onKeyDown={paneResize.onKeyDown}
        />

        <SheetPane onRoll={roller.rollFromSheet} />
      </div>

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
