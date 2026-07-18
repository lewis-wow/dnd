import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { RULETA_PEOPLE_POOL } from "@/lib/data/ruleta";
import { distributeRuleta } from "@/lib/ruleta";

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

function readSeedFromUrl(): string {
  return new URLSearchParams(window.location.search).get("seed") ?? "";
}

function RuletaApp() {
  const [seed, setSeed] = useState(readSeedFromUrl);
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  // The seed lives entirely in the URL (?seed=...) so the current
  // distribution can be shared as a link. No seed on load → mint one and
  // write it back via replaceState (no new history entry); any reroll does
  // the same, keeping the address bar always in sync with what's on screen.
  useEffect(() => {
    if (!seed) {
      setSeed(randomSeed());
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set("seed", seed);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [seed]);

  function togglePerson(name: string) {
    setRemoved((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  // Filtered from the pool in its fixed order (not push/splice order) so the
  // same seed + same active roster always redistributes identically,
  // regardless of the order people were toggled in.
  const activeNames = useMemo(() => RULETA_PEOPLE_POOL.filter((n) => !removed.has(n)), [removed]);
  const assignments = useMemo(() => distributeRuleta(seed, activeNames), [seed, activeNames]);

  return (
    <div className="mx-auto flex min-h-(--app-height,100dvh) w-full max-w-180 flex-col gap-5 px-4 py-6 min-[641px]:px-6 min-[641px]:py-8">
      <header className="flex flex-col items-center gap-1 text-center">
        <h1 className="m-0 bg-linear-to-b from-gold-bright via-gold to-[#8a6d2c] bg-clip-text text-[1.6rem] font-bold tracking-[1.5px] text-transparent">
          🎡 Ruleta
        </h1>
        <p className="m-0 text-[0.7rem] tracking-[2.5px] text-text-dim uppercase">Rozdělení čísel 1–36</p>
        <p className="m-0 text-[0.75rem] text-text-dim">
          Seed: <span className="font-bold text-gold-bright">{seed}</span>
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-xl border border-edge bg-bg-1 p-4">
        <span className="text-[0.8rem] tracking-wide text-text-dim">Hráči (klepnutím přidáš / odebereš)</span>
        <div className="flex flex-wrap gap-2">
          {RULETA_PEOPLE_POOL.map((name) => {
            const active = !removed.has(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => togglePerson(name)}
                aria-pressed={active}
                className={cn(
                  "flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[0.85rem] font-semibold tracking-wide transition-[background,color,border-color,opacity] active:scale-[0.97]",
                  active
                    ? "border-gold/55 bg-gold/14 text-gold-bright"
                    : "border-edge bg-face text-text-dim opacity-50 line-through"
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </section>

      {assignments.length === 0 ? (
        <p className="m-0 text-center text-[0.85rem] text-text-dim">Vyber alespoň jednoho hráče.</p>
      ) : (
        <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[900px]:grid-cols-3">
          {assignments.map(({ name, numbers }) => (
            <div
              key={name}
              className="flex flex-col gap-2 rounded-xl border border-edge bg-bg-2 p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.95rem] font-bold tracking-wide text-gold">{name}</span>
                <span className="text-[0.7rem] text-text-dim">{numbers.length}×</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {numbers
                  .slice()
                  .sort((a, b) => a - b)
                  .map((n) => (
                    <span
                      key={n}
                      className="flex size-8 items-center justify-center rounded-full border border-edge bg-face text-[0.85rem] font-bold text-foreground"
                    >
                      {n}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default RuletaApp;
