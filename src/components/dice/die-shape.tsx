import { cn } from "@/lib/utils";
import type { CritClass, DieDef } from "@/lib/data/dice";

const CRIT_STROKE: Record<CritClass, string> = {
  "": "stroke-gold",
  "crit-hit": "stroke-crit-hit",
  "crit-miss": "stroke-crimson-bright",
};

export function DieShape({
  die,
  crit = "",
  className,
}: {
  die: DieDef;
  crit?: CritClass;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 80 80" className={cn("size-full overflow-visible", className)}>
      <polygon
        points={die.points}
        className={cn("fill-[url(#dieGrad)] transition-[stroke] duration-200", CRIT_STROKE[crit])}
        strokeWidth={2.5}
      />
    </svg>
  );
}

/** Shared SVG gradient def, mounted once at the app root. */
export function DieGradientDefs() {
  return (
    <svg width={0} height={0} className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="dieGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3d68" />
          <stop offset="100%" stopColor="#2b2340" />
        </linearGradient>
      </defs>
    </svg>
  );
}
