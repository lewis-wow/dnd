import { useEffect } from "react";
import type { RefObject } from "react";

/** Mirrors the legacy app's --chrome-h: the topbar's own live height, used by
 * both the phone roller and the desktop split layout to size panes to
 * exactly "one screen minus the topbar". */
export function useChromeHeight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    function setChromeHeight() {
      const h = ref.current ? ref.current.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty("--chrome-h", `${Math.round(h)}px`);
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
  }, [ref]);
}
