import { useCallback, useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { PANE_SPLIT_MIN_WIDTH, RESIZE_ARROW_STEP } from "@/lib/storage-keys";

/**
 * Drag-to-resize a pane's width, ported from the legacy app's pane-resizer
 * logic: pointer-drag updates the live CSS width without persisting, only
 * pointerup/arrow-key nudges persist. Inert below the 900px split-view
 * breakpoint (panes just stack, nothing to resize).
 */
export function useResizablePane({
  storageKey,
  min,
  computeMax,
  getAnchorLeft,
}: {
  storageKey: string;
  min: number;
  computeMax: () => number;
  /** Left edge (clientX) the drag offset is measured from. */
  getAnchorLeft: () => number;
}) {
  const [persisted, setPersisted] = useLocalStorageState<number | null>(storageKey, {
    defaultValue: null,
  });
  const [liveWidth, setLiveWidth] = useState<number | null>(persisted);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const liveWidthRef = useRef(liveWidth);
  liveWidthRef.current = liveWidth;

  useEffect(() => {
    if (!draggingRef.current) setLiveWidth(persisted);
  }, [persisted]);

  const clamp = useCallback((px: number) => Math.round(Math.max(min, Math.min(computeMax(), px))), [min, computeMax]);

  const isSplitView = useCallback(() => window.matchMedia(`(min-width: ${PANE_SPLIT_MIN_WIDTH}px)`).matches, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isSplitView()) return;
      draggingRef.current = true;
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      function onMove(ev: PointerEvent) {
        const px = ev.clientX - getAnchorLeft();
        const clamped = clamp(px);
        liveWidthRef.current = clamped;
        setLiveWidth(clamped);
      }
      function onUp() {
        draggingRef.current = false;
        setDragging(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        // Plain (non-updater) calls, made from this native event-handler scope —
        // calling setPersisted from inside a setLiveWidth *updater* function
        // (as this used to) triggers it during React's state-reducer pass,
        // which React reports as "updating a component while rendering
        // another" since use-local-storage-state fans the change out to every
        // subscriber of this key.
        const final = clamp(liveWidthRef.current ?? min);
        setLiveWidth(final);
        setPersisted(final);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [isSplitView, clamp, getAnchorLeft, min, setPersisted]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isSplitView()) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const delta = e.key === "ArrowRight" ? RESIZE_ARROW_STEP : -RESIZE_ARROW_STEP;
        const next = clamp((liveWidth ?? min) + delta);
        setLiveWidth(next);
        setPersisted(next);
      }
    },
    [isSplitView, clamp, liveWidth, min, setPersisted]
  );

  const setWidth = useCallback(
    (px: number) => {
      const next = clamp(px);
      setLiveWidth(next);
      setPersisted(next);
    },
    [clamp, setPersisted]
  );

  return {
    width: liveWidth,
    dragging,
    onPointerDown,
    onKeyDown,
    setWidth,
  };
}
