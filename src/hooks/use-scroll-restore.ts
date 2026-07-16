import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Restores a scrollable element's scrollTop from localStorage on mount, and
 * persists it (debounced) as the user scrolls. Restoring is deferred one
 * frame past mount so it runs after the element's content (and therefore
 * its real scrollHeight) has actually settled — restoring against a
 * not-yet-laid-out container would just clamp back to 0.
 *
 * Harmless no-op when the element isn't actually scrollable (e.g. the sheet
 * pane below the 900px split-view breakpoint, where the whole page scrolls
 * instead) — reading/writing scrollTop on a non-overflowing element is a
 * standard, silently-ignored operation, and the browser's own scroll
 * restoration already covers the whole-page-scroll case on reload.
 */
export function useScrollRestore<T extends HTMLElement>(ref: RefObject<T | null>, storageKey: string, debounceMs = 150) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const raf = requestAnimationFrame(() => {
      const saved = parseInt(localStorage.getItem(storageKey) ?? "", 10);
      if (!isNaN(saved)) el.scrollTop = saved;
    });

    let saveTimer: number | null = null;
    const onScroll = () => {
      if (saveTimer) window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => {
        localStorage.setItem(storageKey, String(el.scrollTop));
      }, debounceMs);
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (saveTimer) window.clearTimeout(saveTimer);
      el.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, debounceMs]);
}
