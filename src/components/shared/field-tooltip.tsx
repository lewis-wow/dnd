import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function FieldTooltip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <Tooltip>
      {/* display:contents here would generate no box for floating-ui to
          anchor against (it'd measure a zero rect and position the popup at
          the viewport origin) — a plain block wrapper keeps positioning
          correct at the cost of one extra (invisible, non-styled) DOM layer. */}
      <TooltipTrigger render={<div className="min-w-0" />}>{children}</TooltipTrigger>
      <TooltipContent className="max-w-64 text-[0.78rem]">{content}</TooltipContent>
    </Tooltip>
  );
}
