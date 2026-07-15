import { useEffect, useRef, useState } from "react";
import { computeSheetColCount } from "@/lib/layout";

/** Tracks the sheet pane's own rendered width via ResizeObserver and derives
 * the 1/2/3 column count from it (not from viewport width). */
export function useSheetColCount<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [colCount, setColCount] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setColCount(computeSheetColCount(el.getBoundingClientRect().width));
    update();

    // ResizeObserver can fire synchronously while React is still mid-commit
    // for whatever DOM change caused the resize (e.g. a sibling pane's width
    // changing during a drag) — deferring one frame decouples the two so we
    // don't update this component's state while another is still rendering.
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return { ref, colCount };
}
