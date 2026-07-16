import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Wraps a single form control (input/select/textarea) and adds a small "?"
 * badge pinned to its top-right corner — the tooltip only opens when
 * hovering that badge, not the whole control, so it doesn't fire while
 * you're just typing into the field. */
export function FieldTooltip({ content, children, className }: { content: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label="Nápověda"
              className="absolute -top-1.5 right-1 z-10 flex size-3.5 items-center justify-center rounded-full border border-gold/60 bg-bg-1 text-[0.55rem] leading-none font-bold text-gold-bright transition-colors hover:border-gold hover:bg-face-lit"
            />
          }
        >
          ?
        </TooltipTrigger>
        <TooltipContent className="max-w-64 text-[0.78rem]">{content}</TooltipContent>
      </Tooltip>
    </div>
  );
}
