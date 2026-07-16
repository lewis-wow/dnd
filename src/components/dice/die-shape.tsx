import { cn } from "@/lib/utils";
import type { CritClass, DieDef } from "@/lib/data/dice";

const CRIT_STROKE: Record<CritClass, string> = {
  "": "stroke-gold",
  "crit-hit": "stroke-crit-hit",
  "crit-miss": "stroke-crimson-bright",
};

const CRIT_FILL: Record<CritClass, string> = {
  "": "fill-foreground",
  "crit-hit": "fill-crit-hit",
  "crit-miss": "fill-crimson-bright",
};

/** Vertex-average centroid of a die's polygon, in its own 80x80 viewBox
 * units. Used to place the face label at the shape's actual visual center
 * of mass rather than its bounding-box center — for lopsided shapes like the
 * d4 triangle (apex up, wide base down) those aren't the same point. */
function polygonCentroid(points: string): { x: number; y: number } {
  const verts = points
    .trim()
    .split(/\s+/)
    .map((p) => p.split(",").map(Number) as [number, number]);
  const x = verts.reduce((sum, [px]) => sum + px, 0) / verts.length;
  const y = verts.reduce((sum, [, py]) => sum + py, 0) / verts.length;
  return { x, y };
}

export function DieShape({
  die,
  crit = "",
  className,
  label,
  labelClassName,
}: {
  die: DieDef;
  crit?: CritClass;
  className?: string;
  /** Optional face value rendered as real SVG text anchored at the polygon's
   * centroid — text-anchor/dominant-baseline center on the glyph's own
   * metrics, which is more reliable across fonts/browsers than centering an
   * overlaid HTML element with CSS. */
  label?: string;
  labelClassName?: string;
}) {
  const centroid = label != null ? polygonCentroid(die.points) : null;
  return (
    <svg viewBox="0 0 80 80" className={cn("size-full overflow-visible", className)}>
      <polygon
        points={die.points}
        className={cn("fill-[url(#dieGrad)] transition-[stroke] duration-200", CRIT_STROKE[crit])}
        strokeWidth={2.5}
      />
      {label != null && centroid && (
        <text
          x={centroid.x}
          y={centroid.y}
          textAnchor="middle"
          dominantBaseline="central"
          paintOrder="stroke"
          strokeWidth={3}
          strokeLinejoin="round"
          className={cn("pointer-events-none stroke-black/60 text-[22px] font-extrabold", CRIT_FILL[crit], labelClassName)}
        >
          {label}
        </text>
      )}
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
