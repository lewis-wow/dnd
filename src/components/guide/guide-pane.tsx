import { forwardRef } from "react";
import { GUIDE_INTRO, GUIDE_ITEMS } from "@/lib/data/guide";
import { GuideBlockView } from "@/components/guide/guide-block";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DEFAULT_OPEN = GUIDE_ITEMS.filter((i) => i.defaultOpen).map((i) => i.id);

export const GuidePane = forwardRef<HTMLElement, { widthPx: number | null; hidden: boolean }>(function GuidePane(
  { widthPx, hidden },
  ref
) {
  return (
    <aside
      ref={ref}
      aria-hidden={hidden}
      style={widthPx != null ? { flexBasis: widthPx, width: widthPx } : undefined}
      className="flex min-w-0 flex-col overflow-hidden bg-linear-to-b from-bg-1 to-bg-0 border-b border-edge min-[900px]:h-full min-[900px]:overflow-y-auto min-[900px]:border-b-0 min-[900px]:transition-none"
    >
      <div className="flex flex-none items-center justify-between gap-2.5 border-b border-edge p-4 min-[900px]:p-2.5">
        <h2 className="m-0 text-[1.1rem] tracking-wide text-gold min-[900px]:text-[0.98rem]">📖 Příručka D&amp;D</h2>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pt-3.5 pb-6">
        <div className="flex-none px-0.5 pb-1.5 text-[0.85rem] leading-relaxed text-text-dim">{GUIDE_INTRO}</div>

        <Accordion multiple defaultValue={DEFAULT_OPEN} className="flex flex-col gap-2.5">
          {GUIDE_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="overflow-hidden rounded-xl border border-edge bg-bg-2"
            >
              <AccordionTrigger className="gap-2.5 rounded-none px-3.5 py-3.5 text-[0.98rem] font-bold tracking-wide text-foreground hover:bg-face hover:no-underline">
                <span className="flex flex-1 items-center gap-2.5">
                  <span className="shrink-0 text-[1.1rem]">{item.icon}</span>
                  <span className="flex-1 text-gold">{item.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="border-t border-edge px-4 pt-0.5 pb-4 text-[0.88rem] leading-relaxed text-foreground">
                {item.blocks.map((block, i) => (
                  <GuideBlockView key={i} block={block} />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
});
