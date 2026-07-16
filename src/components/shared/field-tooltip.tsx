import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/** Wraps a single form control (input/select/textarea) and adds a small "?"
 * badge pinned to its top-right corner. Opens on click (a real Popover, not
 * a hover-triggered Tooltip) — deliberately, so it doesn't fire just from
 * mousing over the field while filling out the form, and works the same way
 * on touch. */
export function FieldTooltip({ content, children, className }: { content: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label="Nápověda"
              onClick={(e) => e.stopPropagation()}
              className="absolute -top-1.5 right-1 z-10 flex size-3.5 items-center justify-center rounded-full border border-gold/60 bg-bg-1 text-[0.55rem] leading-none font-bold text-gold-bright transition-colors hover:border-gold hover:bg-face-lit"
            />
          }
        >
          ?
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-foreground text-[0.78rem] text-background">{content}</PopoverContent>
      </Popover>
    </div>
  );
}
