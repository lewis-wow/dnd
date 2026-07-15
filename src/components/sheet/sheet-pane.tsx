import { useMemo, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { DEFAULT_SECTION_ORDER, SHEET_SECTIONS, type SectionId } from "@/lib/data/sheet";
import { distributeIntoColumns } from "@/lib/layout";
import { useSheetColCount } from "@/hooks/use-sheet-col-count";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { SheetSection } from "@/components/sheet/sheet-section";

const sectionById = new Map(SHEET_SECTIONS.map((s) => [s.id, s]));

function SheetColumn({ id, sectionIds, onRoll }: { id: string; sectionIds: SectionId[]; onRoll: (bonus: number, label: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-15 min-w-0 flex-1 flex-col gap-2.5",
          sectionIds.length === 0 && "rounded-xl border border-dashed border-edge",
          isOver && "border-gold"
        )}
      >
        {sectionIds.map((id) => {
          const section = sectionById.get(id);
          if (!section) return null;
          return <SheetSection key={id} section={section} onRoll={onRoll} />;
        })}
      </div>
    </SortableContext>
  );
}

export function SheetPane({ onRoll }: { onRoll: (bonus: number, label: string) => void }) {
  const { ref, colCount } = useSheetColCount<HTMLDivElement>();
  const [order, setOrder] = useLocalStorageState<SectionId[]>(STORAGE_KEYS.sheetOrder, {
    defaultValue: DEFAULT_SECTION_ORDER,
  });

  const normalizedOrder = useMemo(() => {
    const known = new Set(DEFAULT_SECTION_ORDER);
    const filtered = order.filter((id) => known.has(id));
    const missing = DEFAULT_SECTION_ORDER.filter((id) => !filtered.includes(id));
    return [...filtered, ...missing];
  }, [order]);

  const columns = useMemo(() => distributeIntoColumns(normalizedOrder, colCount), [normalizedOrder, colCount]);
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as SectionId);
  }

  // Committed once, at drop — not live during drag. An earlier live-reflow
  // version (updating column arrays on every dragover) fed back into
  // dnd-kit's own collision/remeasure cycle and produced a runaway
  // "Maximum update depth exceeded" loop (the drop position and the
  // resulting layout kept invalidating each other). The dragged card still
  // follows the pointer via dnd-kit's own transform/DragOverlay; siblings
  // just settle into place on drop instead of animating out of the way
  // live — a reasonable trade for a robust, non-oscillating implementation.
  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as SectionId;
    const overId = String(over.id);
    if (activeId === overId) return;

    const next = columns.map((col) => [...col]);
    const activeColIdx = next.findIndex((col) => col.includes(activeId));
    if (activeColIdx === -1) return;
    next[activeColIdx] = next[activeColIdx].filter((id) => id !== activeId);

    let targetColIdx = next.findIndex((col) => col.includes(overId as SectionId));
    let insertAt: number;
    if (targetColIdx === -1) {
      const m = /^col-(\d+)$/.exec(overId);
      targetColIdx = m ? Number(m[1]) : activeColIdx;
      insertAt = next[targetColIdx].length;
    } else {
      insertAt = next[targetColIdx].indexOf(overId as SectionId);
    }
    next[targetColIdx].splice(insertAt, 0, activeId);

    setOrder(next.flat());
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const activeSection = activeId ? sectionById.get(activeId) : null;

  return (
    <aside
      ref={ref}
      className="flex min-w-0 flex-col border-t border-edge bg-linear-to-b from-bg-1 to-bg-0 min-[900px]:h-full min-[900px]:flex-1 min-[900px]:overflow-y-auto min-[900px]:border-t-0"
    >
      <div className="flex flex-none items-center justify-between gap-2.5 border-b border-edge p-4 min-[900px]:p-2.5">
        <h2 className="m-0 text-[1.1rem] tracking-wide text-gold min-[900px]:text-[0.98rem]">📝 Deník postavy</h2>
      </div>

      <div className="flex-1 items-start gap-4.5 p-4 pb-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex items-start gap-4.5">
            {columns.map((col, i) => (
              <SheetColumn key={i} id={`col-${i}`} sectionIds={col} onRoll={onRoll} />
            ))}
          </div>
          <DragOverlay>
            {activeSection && (
              <div className="rounded-xl border border-gold bg-bg-2 px-3.5 py-3 shadow-[0_14px_32px_rgba(0,0,0,0.5)]">
                <span className="mr-2">{activeSection.icon}</span>
                <span className="font-bold tracking-wide text-gold">{activeSection.title}</span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </aside>
  );
}
