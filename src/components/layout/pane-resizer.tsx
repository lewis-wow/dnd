import { cn } from "@/lib/utils";

export function PaneResizer({
  label,
  dragging,
  onPointerDown,
  onKeyDown,
}: {
  label: string;
  dragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={cn(
        "group relative hidden shrink-0 self-stretch outline-none min-[900px]:block",
        "w-3.5 cursor-col-resize"
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-edge transition-[background,width]",
          "group-hover:w-[3px] group-hover:bg-gold group-focus-visible:w-[3px] group-focus-visible:bg-gold",
          dragging && "w-[3px] bg-gold"
        )}
      />
    </div>
  );
}
