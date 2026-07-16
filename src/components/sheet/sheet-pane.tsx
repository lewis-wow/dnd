import { useMemo, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
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

// Column containers fully enclose their cards, so plain closestCenter/
// closestCorners tends to match the (large, centrally-positioned) column
// itself instead of the specific card the pointer is actually over —
// dropping "into" a card near a column boundary would silently land at the
// end of a neighboring column instead. Prefer a pointer-within match on an
// actual section card; only fall back to the column container (or rect
// intersection) when the pointer isn't over any specific card.
const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    const cardCollision = pointerCollisions.find((c) => !String(c.id).startsWith("col-"));
    return cardCollision ? [cardCollision] : pointerCollisions;
  }
  return rectIntersection(args);
};

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

const DEFAULT_COLUMNS: SectionId[][] = [DEFAULT_SECTION_ORDER];

export function SheetPane({ onRoll }: { onRoll: (bonus: number, label: string) => void }) {
  const { ref, colCount } = useSheetColCount<HTMLDivElement>();

  // Persisted directly as per-column membership (not a flat order that gets
  // re-split evenly every render) — distributeIntoColumns always forces
  // ceil-balanced groups, so round-tripping a drag's result back through it
  // could silently move a card dropped at the *start* of column 2 back into
  // column 1 just because that's where even balancing puts that flat index.
  // Columns are only ever re-derived from scratch (via distributeIntoColumns)
  // when the actual column count changes or a section needs seeding —
  // everyday drags mutate this 2D structure directly and it's what's saved.
  const [persistedColumns, setPersistedColumns] = useLocalStorageState<SectionId[][]>(STORAGE_KEYS.sheetOrder, {
    defaultValue: DEFAULT_COLUMNS,
  });

  const columns = useMemo(() => {
    const known = new Set(DEFAULT_SECTION_ORDER);
    const seen = new Set<SectionId>();
    const filtered = persistedColumns.map((col) =>
      col.filter((id) => {
        if (!known.has(id) || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
    );
    const missing = DEFAULT_SECTION_ORDER.filter((id) => !seen.has(id));

    if (filtered.length !== colCount || missing.length > 0) {
      return distributeIntoColumns([...filtered.flat(), ...missing], colCount);
    }
    return filtered;
  }, [persistedColumns, colCount]);

  const [activeId, setActiveId] = useState<SectionId | null>(null);
  // The dragged *card's* rect (compared against the target card's rect) is a
  // poor proxy for "which half did I drop on" — a section card is tall, and
  // its rect extends however far below/above the pointer's actual grab point
  // happened to land, which skews the comparison. Track the real pointer Y
  // instead: capture it at grab (from the native activator event) and add
  // dnd-kit's own reported delta at drop time.
  const pointerStartYRef = useRef(0);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as SectionId);
    const activator = event.activatorEvent;
    pointerStartYRef.current = activator && "clientY" in activator ? (activator as PointerEvent).clientY : 0;
  }

  // Resolved once, at drop — not live on every dragover. An earlier version
  // mutated the column arrays continuously while dragging, which fed back
  // into dnd-kit's own collision/remeasure cycle (each mutation changes the
  // items array identity, which re-measures, which re-runs collision
  // detection, which — for a layout where columns fully enclose their own
  // cards — could re-trigger another mutation without any new pointer
  // input) and produced both a runaway "Maximum update depth exceeded" loop
  // and visibly janky reflow. Resolving only here removes that feedback
  // path entirely. Whether the drop lands *before* or *after* the hovered
  // card is decided from where the dragged card's own rect actually ended
  // up relative to the hovered card's vertical midpoint, so dropping on the
  // top half of a card inserts above it and the bottom half inserts below —
  // not just "append to the column".
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
      // Dropped on an (empty, or past-the-last-card) column container itself.
      const m = /^col-(\d+)$/.exec(overId);
      targetColIdx = m ? Number(m[1]) : activeColIdx;
      insertAt = next[targetColIdx].length;
    } else {
      const targetIdx = next[targetColIdx].indexOf(overId as SectionId);
      const pointerY = pointerStartYRef.current + event.delta.y;
      const insertBefore = pointerY < over.rect.top + over.rect.height / 2;
      insertAt = insertBefore ? targetIdx : targetIdx + 1;
    }
    next[targetColIdx].splice(insertAt, 0, activeId);

    setPersistedColumns(next);
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
          collisionDetection={collisionDetection}
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
