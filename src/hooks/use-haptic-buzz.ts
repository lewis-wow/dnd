import { useCallback } from "react";

/** Thin wrapper around navigator.vibrate — a no-op on browsers/devices without it. */
export function useHapticBuzz() {
  return useCallback((pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore — vibration is a nice-to-have, never worth surfacing an error for
      }
    }
  }, []);
}
