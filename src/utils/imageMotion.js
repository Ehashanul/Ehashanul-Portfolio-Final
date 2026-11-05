// Match the reference's viewport-relative build: enter near the bottom,
// finish near the upper third, and reverse naturally when scrolling back.
export function imageRevealProgress(top, viewportHeight) {
  if (viewportHeight <= 0) return 1;
  return Math.max(0, Math.min(1, (viewportHeight * 0.92 - top) / (viewportHeight * 0.57)));
}
