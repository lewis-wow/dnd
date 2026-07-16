import { forwardRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ABILITIES, abilityModDisplay, abilityScoreTotal, type SheetFormValues } from "@/lib/data/sheet";

const ABIL_ABBR: Record<string, string> = {
  str: "SÍL",
  dex: "OBR",
  con: "ODO",
  int: "INT",
  wis: "MDR",
  cha: "CHA",
};

function VitalChip({
  icon,
  label,
  value,
  title,
  className,
}: {
  icon: string;
  label?: string;
  value: string;
  title?: string;
  className?: string;
}) {
  return (
    <div
      title={title}
      className={cn("flex items-center gap-1.5 rounded-[10px] border border-edge bg-bg-2 px-2.5 py-1.5", className)}
    >
      <span className="shrink-0 text-[0.92rem]">{icon}</span>
      {label && (
        <span className="hidden text-[0.64rem] tracking-wide text-text-dim uppercase min-[641px]:inline">{label}</span>
      )}
      <span className="text-[0.85rem] font-bold text-foreground">{value}</span>
    </div>
  );
}

export const TopBar = forwardRef<
  HTMLElement,
  { historyCount: number; onOpenHistory: () => void; onOpenGuide: () => void }
>(function TopBar({ historyCount, onOpenHistory, onOpenGuide }, ref) {
  const { control } = useFormContext<SheetFormValues>();
  const basic = useWatch({ control, name: "basic" });
  const abilities = useWatch({ control, name: "abilities" });

  const charName = basic?.charName || "Nová postava";
  const ac = basic?.ac ?? "";
  const combat = useWatch({ control, name: "combat" });
  const speed = combat?.speed || "—";
  const currentHp = combat?.currentHp || "";
  const maxHp = combat?.maxHp || "";
  const hp = currentHp && maxHp ? `${currentHp} / ${maxHp}` : currentHp || maxHp || "—";
  const inspCount = parseInt(basic?.inspiration ?? "", 10) || 0;
  const profBonus = basic?.profBonus || "—";

  return (
    <header
      ref={ref}
      className="sticky top-0 z-30 flex flex-wrap items-center gap-x-4.5 gap-y-2 border-b border-edge bg-linear-to-b from-bg-1 to-bg-0 px-5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.35)] max-[640px]:px-3 max-[640px]:py-2"
    >
      <div className="flex flex-none items-center gap-2.5">
        <span className="text-[1.5rem] leading-none">🎲</span>
        <div className="min-w-0">
          <h1 className="m-0 bg-linear-to-b from-gold-bright via-gold to-[#8a6d2c] bg-clip-text text-[1.15rem] font-bold tracking-[1.5px] whitespace-nowrap text-transparent max-[640px]:text-base max-[640px]:tracking-wide">
            Kostky Říše
          </h1>
          <p className="m-0 mt-0.5 text-[0.6rem] tracking-[2.5px] whitespace-nowrap text-text-dim uppercase max-[640px]:hidden">
            Dungeons &amp; Dragons
          </p>
        </div>
      </div>

      <div
        aria-label="Klíčové hodnoty postavy"
        className="flex flex-1 flex-wrap items-center justify-center gap-2 min-w-0 max-[640px]:order-3 max-[640px]:basis-full max-[640px]:justify-start"
      >
        <VitalChip icon="🪪" value={charName} className="border-gold bg-gold/8 [&>span:last-child]:max-w-[34vw] [&>span:last-child]:overflow-hidden [&>span:last-child]:text-ellipsis [&>span:last-child]:whitespace-nowrap [&>span:last-child]:text-gold-bright" />
        <VitalChip icon="🛡️" label="OČ" value={ac || "—"} title="Obranné číslo" />
        <VitalChip icon="🏃" label="Rychlost" value={speed} />
        <VitalChip icon="❤️" label="Životy" value={hp} />
        <VitalChip icon="⭐" label="Inspirace" value={String(inspCount)} />
        <VitalChip icon="🎯" label="Zdat. bonus" value={profBonus} title="Zdatnostní bonus" />

        <div className="flex w-full flex-wrap justify-center gap-2 max-[640px]:justify-start">
          {ABILITIES.map((a) => {
            const slice = abilities?.[a.key];
            const total = slice ? abilityScoreTotal(slice.score, slice.item) : null;
            return (
              <div
                key={a.key}
                title={a.label}
                className="flex items-center gap-1.5 rounded-[10px] border border-edge bg-bg-2 px-2.5 py-1.5"
              >
                <span className="text-[0.62rem] font-bold tracking-wide text-text-dim">{ABIL_ABBR[a.key]}</span>
                <span className="text-[0.85rem] font-bold text-gold-bright">{abilityModDisplay(total)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-none gap-2.5">
        <button
          type="button"
          onClick={onOpenGuide}
          aria-label="Otevřít příručku"
          className="flex items-center gap-1.5 rounded-[10px] border border-edge bg-bg-2 px-3.5 py-2.5 text-[0.82rem] tracking-wide text-gold transition-[background,border-color] hover:border-gold hover:bg-face-lit active:scale-95 max-[640px]:min-h-10 max-[640px]:px-2.5"
        >
          📖 <span className="max-[640px]:hidden">Příručka</span>
        </button>
        <button
          type="button"
          onClick={onOpenHistory}
          aria-label="Otevřít historii"
          className="flex items-center gap-1.5 rounded-[10px] border border-edge bg-bg-2 px-3.5 py-2.5 text-[0.82rem] tracking-wide text-gold transition-[background,border-color] hover:border-gold hover:bg-face-lit active:scale-95 max-[640px]:min-h-10 max-[640px]:px-2.5"
        >
          📜 <span className="max-[640px]:hidden">Historie</span>{" "}
          <span className="min-w-5 rounded-full bg-crimson px-2 py-0.5 text-center text-[0.72rem] font-bold text-white">
            {historyCount}
          </span>
        </button>
      </div>
    </header>
  );
});
