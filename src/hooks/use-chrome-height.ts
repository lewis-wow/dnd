import { useEffect } from "react";
import type { RefObject } from "react";

/** Mirrors the legacy app's --chrome-h: a sticky header block's own live
 * height, used to size panes to exactly "one screen minus that header".
 * `varName` lets callers track more than one header stack (e.g. the topbar
 * alone vs. the topbar plus the phone tab switcher) without clobbering each
 * other's CSS var. */
export function useChromeHeight(ref: RefObject<HTMLElement | null>, varName = "--chrome-h") {
  useEffect(() => {
    function setChromeHeight() {
      const h = ref.current ? ref.current.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty(varName, `${Math.round(h)}px`);
    }
    setChromeHeight();
    window.addEventListener("resize", setChromeHeight);
    window.addEventListener("orientationchange", setChromeHeight);
    const ro = new ResizeObserver(setChromeHeight);
    if (ref.current) ro.observe(ref.current);
    return () => {
      window.removeEventListener("resize", setChromeHeight);
      window.removeEventListener("orientationchange", setChromeHeight);
      ro.disconnect();
    };
  }, [ref, varName]);
}
