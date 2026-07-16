import { cn } from "@/lib/utils";
import type { GuideBlock } from "@/lib/data/guide";
import { RichText } from "@/components/guide/rich-text";

export function GuideBlockView({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className={cn("my-2.5 text-foreground", block.muted && "text-text-dim")}>
          <RichText segments={block.content} />
        </p>
      );
    case "list":
      return (
        <ul className="my-2.5 list-disc pl-5">
          {block.items.map((item, i) => (
            <li key={i} className="my-1.5">
              <RichText segments={item} />
            </li>
          ))}
        </ul>
      );
    case "entry":
      return (
        <div className="my-2 rounded-lg border border-edge border-l-[3px] border-l-gold bg-bg-1 px-3 py-2.5">
          <div className="font-bold tracking-wide text-gold-bright">{block.name}</div>
          {block.meta && (
            <div className="my-0.5 text-[0.72rem] tracking-wide text-text-dim uppercase">{block.meta}</div>
          )}
          <div className="text-[0.84rem] leading-snug text-foreground">{block.desc}</div>
        </div>
      );
    case "tip":
      return (
        <div className="flex items-start gap-2.5 border-b border-edge/50 py-2 last:border-b-0">
          <span className="shrink-0 text-[1.05rem]">{block.icon}</span>
          <span>
            <RichText segments={block.content} />
          </span>
        </div>
      );
  }
}
