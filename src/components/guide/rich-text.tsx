import type { Segment } from "@/lib/data/guide";

export function RichText({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (typeof seg === "string") return <span key={i}>{seg}</span>;
        if ("b" in seg) return <strong key={i} className="text-gold-bright">{seg.b}</strong>;
        return <em key={i}>{seg.i}</em>;
      })}
    </>
  );
}
