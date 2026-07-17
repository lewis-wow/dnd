import { cn } from "@/lib/utils";

export type MobileTab = "dice" | "sheet";

export function MobileTabs({ active, onChange }: { active: MobileTab; onChange: (tab: MobileTab) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Přepnout mezi kostkami a deníkem"
      className="sticky top-(--chrome-h,62px) z-20 flex flex-none gap-1.5 border-b border-edge bg-linear-to-b from-bg-1 to-bg-0 p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active === "dice"}
        onClick={() => onChange("dice")}
        className={cn(
          "flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent text-[0.88rem] font-semibold tracking-wide text-text-dim transition-[background,color,border-color] active:scale-[0.98]",
          active === "dice" ? "border-gold/55 bg-gold/14 text-gold-bright" : "hover:bg-face hover:text-foreground"
        )}
      >
        🎲 Kostky
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === "sheet"}
        onClick={() => onChange("sheet")}
        className={cn(
          "flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent text-[0.88rem] font-semibold tracking-wide text-text-dim transition-[background,color,border-color] active:scale-[0.98]",
          active === "sheet" ? "border-gold/55 bg-gold/14 text-gold-bright" : "hover:bg-face hover:text-foreground"
        )}
      >
        📝 Deník
      </button>
    </div>
  );
}
