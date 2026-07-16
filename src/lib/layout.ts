/** Pure layout helpers ported from the legacy app — column count is a function
 * of the sheet pane's own rendered width (not viewport width), and section
 * distribution into columns is a sequential "as evenly as possible by count"
 * split, not round-robin or height-balanced. */

export function computeSheetColCount(paneWidthPx: number): number {
  if (paneWidthPx >= 1020) return 3;
  if (paneWidthPx >= 660) return 2;
  return 1;
}

export function distributeIntoColumns<T>(items: T[], numCols: number): T[][] {
  const cols: T[][] = Array.from({ length: numCols }, () => []);
  let idx = 0;
  let remaining = items.length;
  for (let c = 0; c < numCols; c++) {
    const colsLeft = numCols - c;
    const take = Math.ceil(remaining / colsLeft);
    for (let i = 0; i < take; i++) cols[c].push(items[idx++]);
    remaining -= take;
  }
  return cols;
}
