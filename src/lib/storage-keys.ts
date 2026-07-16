export const STORAGE_KEYS = {
  history: "dnd-dice-history",
  settings: "dnd-dice-settings",
  sheet: "dnd-character-sheet",
  sheetOrder: "dnd-sheet-order",
  sheetHidden: "dnd-sheet-hidden-sections",
  paneWidth: "dnd-dice-pane-width",
  guideWidth: "dnd-guide-pane-width",
  sheetScroll: "dnd-sheet-scroll",
} as const;

export const MAX_HISTORY = 200;
export const PANE_MIN = 410;
export const GUIDE_MIN = 0;
export const GUIDE_DEFAULT = 320;
export const SHEET_PANE_RESERVE = 360;
export const RESIZE_ARROW_STEP = 24;
export const PANE_SPLIT_MIN_WIDTH = 900;
