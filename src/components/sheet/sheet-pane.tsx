import { useEffect, useMemo, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { DEFAULT_SECTION_ORDER, SHEET_SECTIONS, type SectionId } from "@/lib/data/sheet";
import { distributeIntoColumns } from "@/lib/layout";
import { useSheetColCount } from "@/hooks/use-sheet-col-count";
import { useScrollRestore } from "@/hooks/use-scroll-restore";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { SheetSection } from "@/components/sheet/sheet-section";
import { ImportExport } from "@/components/sheet/import-export";

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
  const cardCollision = pointerCollisions.find((c) => !String(c.id).startsWith("col-"));
  if (cardCollision) return [cardCollision];
  if (pointerCollisions.length === 0) return rectIntersection(args);

  // The pointer is over a column but not over any specific card — i.e. in
  // the gap between two cards (columns have no padding, so a column's
  // bounding rect is exactly the union of its cards' rects; the only
  // "container, not card" area is an inter-card gap). Resolve to the
  // nearest card instead of falling through to the column container:
  // moveSection's column-container branch always inserts at the *end* of
  // the column, which is only correct when that gap happens to be the
  // column's last one. For any other gap — e.g. easing off a drag right
  // before releasing the pointer — that silently reverted a reorder that
  // had already happened.
  const cardsOnly = {
    ...args,
    droppableContainers: args.droppableContainers.filter((c) => !String(c.id).startsWith("col-")),
  };
  const nearestCard = closestCenter(cardsOnly);
  return nearestCard.length > 0 ? nearestCard : pointerCollisions;
};

/** Where `activeId` should land, given a hover over `overId` (a card id or a
 * `col-N` container id) and the pointer's current Y — before or after the
 * hovered card depending on which half of it the pointer is over. Returns
 * the *same* `cols` reference when nothing would actually change, so
 * `setDragColumns` can bail out of a no-op update (see the effect below for
 * why that matters). */
function moveSection(
  cols: SectionId[][],
  activeId: SectionId,
  overId: string,
  pointerY: number,
  overRect: { top: number; height: number }
): SectionId[][] {
  const activeColIdx = cols.findIndex((col) => col.includes(activeId));
  if (activeColIdx === -1) return cols;

  let targetColIdx = cols.findIndex((col) => col.includes(overId as SectionId));
  let insertAt: number;
  if (targetColIdx === -1) {
    const m = /^col-(\d+)$/.exec(overId);
    if (!m) return cols;
    targetColIdx = Number(m[1]);
    insertAt = cols[targetColIdx].length;
  } else {
    const targetIdx = cols[targetColIdx].indexOf(overId as SectionId);
    const insertBefore = pointerY < overRect.top + overRect.height / 2;
    insertAt = insertBefore ? targetIdx : targetIdx + 1;
  }

  // Only the active and target columns actually change — copy just those two
  // (they may be the same column) and keep every other column's array
  // reference untouched. Every `SortableContext` in the pane is keyed on its
  // own column's item-array identity (dnd-kit remeasures/re-animates a
  // column when that identity changes), so rebuilding all columns on every
  // dragover tick — even ones nothing moved through — was forcing every
  // column in the pane to remeasure on every pointer event. That extra churn
  // is what fed dnd-kit's own internal remeasure/animate-layout-changes
  // effects into a "Maximum update depth exceeded" loop on multi-column
  // drags; touching only the two columns that actually change avoids it.
  const next = cols.slice();
  next[activeColIdx] = cols[activeColIdx].filter((id) => id !== activeId);
  // Re-find the target column's index into `next` — filtering the active
  // column above doesn't change any OTHER column's index, so targetColIdx
  // is still correct; only the insert position within it needs adjusting
  // when the active item was removed from *this same* column earlier in
  // the list (its removal shifts every later index down by one).
  if (targetColIdx === activeColIdx) {
    const removedIdx = cols[activeColIdx].indexOf(activeId);
    if (removedIdx !== -1 && removedIdx < insertAt) insertAt -= 1;
  } else {
    next[targetColIdx] = cols[targetColIdx].slice();
  }
  next[targetColIdx].splice(insertAt, 0, activeId);

  const unchanged =
    next.length === cols.length &&
    next.every((col, i) => col.length === cols[i].length && col.every((id, j) => id === cols[i][j]));
  return unchanged ? cols : next;
}

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
  useScrollRestore(ref, STORAGE_KEYS.sheetScroll);

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
    // persistedColumns comes straight out of localStorage, so its shape isn't
    // guaranteed — a stale value from an earlier schema (e.g. a flat
    // SectionId[] instead of SectionId[][]) or hand-edited storage would
    // otherwise crash `col.filter` here. Drop anything that isn't itself an
    // array; the `missing` fallback below rebuilds a fresh layout for
    // whatever sections that leaves out.
    const filtered = (Array.isArray(persistedColumns) ? persistedColumns : [])
      .filter((col): col is SectionId[] => Array.isArray(col))
      .map((col) =>
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

  // `columns` re-derives from `persistedColumns` on *every* render (a pure
  // function of persisted state + current width), which is correct, but
  // means a reconciliation (missing sections seeded, or colCount genuinely
  // different from what was last saved) only ever exists as a transient
  // computed value — never written back. Two reloads at the same width
  // should show the identical layout; writing the reconciled shape back
  // once it's actually needed makes that the new persisted baseline instead
  // of recomputing the same correction indefinitely.
  useEffect(() => {
    const changed =
      persistedColumns.length !== columns.length ||
      persistedColumns.some((col, i) => col.length !== columns[i]?.length || col.some((id, j) => id !== columns[i][j]));
    if (changed) setPersistedColumns(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const [dragColumns, setDragColumns] = useState<SectionId[][] | null>(null);
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const displayColumns = dragColumns ?? columns;
  // Mirrors `dragColumns` so handleDragEnd can read the latest value
  // without calling setPersistedColumns from *inside* the setDragColumns
  // updater — that pattern (a different hook's setter invoked while React
  // is still processing this one's state update) is exactly what produced
  // the "Cannot update a component while rendering a different component"
  // loop with use-resizable-pane earlier; two plain, separate setState
  // calls from this plain event-handler scope avoid it entirely.
  const dragColumnsRef = useRef<SectionId[][] | null>(null);
  // The dragged *card's* rect (compared against the target card's rect) is a
  // poor proxy for "which half did I drop on" — a section card is tall, and
  // its rect extends however far below/above the pointer's actual grab point
  // happened to land, which skews the comparison. Track the real pointer Y
  // instead: capture it at grab (from the native activator event) and add
  // dnd-kit's own reported delta on every subsequent event.
  const pointerStartYRef = useRef(0);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as SectionId);
    const initial = columns.map((col) => [...col]);
    dragColumnsRef.current = initial;
    setDragColumns(initial);
    const activator = event.activatorEvent;
    pointerStartYRef.current = activator && "clientY" in activator ? (activator as PointerEvent).clientY : 0;
  }

  // Live, on every dragover — reflows the *other* cards out of the way as
  // you drag, same as any ordinary sortable list. This reads and writes
  // `dragColumns` only (never the persisted state directly), and
  // `moveSection` returns the *same* array reference when a move would be a
  // no-op, so `setDragColumns` bails out without a re-render for those.
  // That equality check is load-bearing: an earlier version that always
  // committed a freshly-spliced array here fed back into dnd-kit's own
  // collision/remeasure cycle (each mutation changes the items array
  // identity, which re-measures, which can re-run collision detection and
  // re-trigger another mutation with no new pointer input) and produced a
  // runaway "Maximum update depth exceeded" loop. The improved collision
  // detection above (preferring a specific card over the enclosing column)
  // was the other half of that fix — it stopped the collision target itself
  // from flip-flopping between a card and its container near column edges.
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as SectionId;
    const overId = String(over.id);
    if (activeId === overId) return;
    const pointerY = pointerStartYRef.current + event.delta.y;

    setDragColumns((prev) => {
      if (!prev) return prev;
      const next = moveSection(prev, activeId, overId, pointerY, over.rect);
      dragColumnsRef.current = next;
      return next;
    });
  }

  function handleDragEnd(_event: DragEndEvent) {
    setActiveId(null);
    setDragColumns(null);
    // Plain, separate calls from this event-handler scope — see the note on
    // dragColumnsRef above for why this isn't nested inside setDragColumns.
    if (dragColumnsRef.current) setPersistedColumns(dragColumnsRef.current);
    dragColumnsRef.current = null;
  }

  function handleDragCancel() {
    setActiveId(null);
    setDragColumns(null);
    dragColumnsRef.current = null;
  }

  const activeSection = activeId ? sectionById.get(activeId) : null;

  return (
    <aside
      ref={ref}
      className="flex min-w-0 flex-col border-t border-edge bg-linear-to-b from-bg-1 to-bg-0 min-[900px]:h-full min-[900px]:flex-1 min-[900px]:overflow-y-auto min-[900px]:border-t-0"
    >
      <div className="flex flex-none flex-wrap items-center justify-between gap-2.5 border-b border-edge p-4 min-[900px]:p-2.5">
        <h2 className="m-0 text-[1.1rem] tracking-wide text-gold min-[900px]:text-[0.98rem]">📝 Deník postavy</h2>
        <ImportExport />
      </div>

      <div className="flex-1 items-start gap-4.5 p-4 pb-8">
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex items-start gap-4.5">
            {displayColumns.map((col, i) => (
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
