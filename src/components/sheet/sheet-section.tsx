import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { SectionMeta } from "@/lib/data/sheet";
import { SheetSectionContent } from "@/components/sheet/sheet-section-content";

export function SheetSection({
  section,
  onRoll,
  onHide,
}: {
  section: SectionMeta;
  onRoll: (bonus: number, label: string) => void;
  onHide: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-edge bg-bg-2 transition-[opacity,box-shadow,border-color]",
        isDragging && "z-10 border-gold opacity-60 shadow-[0_14px_32px_rgba(0,0,0,0.5)]"
      )}
    >
      <div className="flex items-center gap-2.5 px-3.5 pt-3.5 pb-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="-my-1 -ml-1.5 flex shrink-0 cursor-grab touch-none items-center rounded-md px-1.5 py-1 text-[1.15rem] leading-none text-text-dim transition-colors hover:bg-face hover:text-gold active:cursor-grabbing"
          aria-label={`Přesunout sekci ${section.title}`}
        >
          ⠿
        </button>
        <span className="shrink-0 text-[1.1rem]">{section.icon}</span>
        <span className="flex-1 text-[0.95rem] font-bold tracking-wide text-gold">{section.title}</span>
        <button
          type="button"
          onClick={onHide}
          title={`Skrýt sekci ${section.title}`}
          aria-label={`Skrýt sekci ${section.title}`}
          className="-my-1 -mr-1 flex shrink-0 items-center justify-center rounded-md px-1.5 py-1 text-[1.05rem] leading-none text-text-dim transition-colors hover:bg-face hover:text-crimson-bright"
        >
          ×
        </button>
      </div>
      <div className="px-3.5 pt-1.5 pb-3.5">
        <SheetSectionContent id={section.id} onRoll={onRoll} />
      </div>
    </div>
  );
}
