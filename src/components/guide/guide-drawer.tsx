import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { GUIDE_INTRO, GUIDE_ITEMS } from "@/lib/data/guide";
import { GuideBlockView } from "@/components/guide/guide-block";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DEFAULT_OPEN = GUIDE_ITEMS.filter((i) => i.defaultOpen).map((i) => i.id);

export function GuideDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-black/55 transition-opacity duration-250 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          style={{ height: "var(--app-height, 100dvh)" }}
          className="fixed inset-y-0 left-0 z-50 flex w-100 max-w-[90vw] flex-col bg-linear-to-b from-bg-1 to-bg-0 shadow-[8px_0_30px_rgba(0,0,0,0.5)] outline-none transition-transform duration-300 ease-in-out data-ending-style:-translate-x-full data-starting-style:-translate-x-full"
        >
          <div className="flex items-center justify-between border-b border-edge p-5">
            <DialogPrimitive.Title className="m-0 text-[1.1rem] tracking-wide text-gold">
              📖 Příručka D&amp;D
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Zavřít"
              className="text-[1.6rem] leading-none text-text-dim transition-colors hover:text-foreground"
            >
              ×
            </DialogPrimitive.Close>
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
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
