export const wrapIndex = (value, count) => ((value % count) + count) % count;
export const CARD_VERTICAL_FIT = 1;
export const CARD_HEIGHT = 4;
export const CARD_WIDTH = CARD_HEIGHT * 4 / 5;
export const DRUM_RADIUS = 5.2;
export const DRUM_SPACING = (CARD_WIDTH + 0.65) / DRUM_RADIUS;

export function transitionBlur(state, previous, dt, reduced = false) {
  const speed = Math.abs(state.position - previous) / Math.max(dt, 0.001);
  if (reduced || speed < 0.1) return 0;
  return Math.min(0.018, speed * 0.006);
}

// Recycle a fixed set of visible neighbors; artwork wraps without an empty slot.
export function drumSlots(position, count) {
  const origin = Math.floor(position);
  return Array.from({ length: 9 }, (_, slot) => {
    const index = origin + slot - 4;
    return { index, textureIndex: wrapIndex(index, count) };
  });
}

export function createCarouselState() {
  return { position: 0, target: 0, dragging: false, startX: 0, lastX: 0, startTarget: 0, distance: 0, velocity: 0, lastTime: 0, resumeAt: 0 };
}

export function selectCard(state, index, count, now) {
  state.target = index + Math.round((state.position - index) / count) * count;
  state.resumeAt = now + 3800;
}

export function stepCard(state, direction, now) {
  state.target = Math.round(state.target) + direction;
  state.resumeAt = now + 3800;
}

export function advanceCarousel(state, dt, now, playing, reduced = false) {
  if (playing && !state.dragging && now >= state.resumeAt) {
    state.target = Math.round(state.target) + 1;
    state.resumeAt = now + 3800;
  }
  const blend = 1 - Math.exp(-(reduced ? 30 : 9) * Math.min(dt, 0.05));
  state.position += (state.target - state.position) * blend;
  if (Math.abs(state.target - state.position) < 0.0001) state.position = state.target;
}

export function endDrag(state, now, pixelsPerCard) {
  const velocity = now - state.lastTime > 100 ? 0 : state.velocity;
  const momentum = Math.abs(velocity) < 0.2 ? 0 : Math.max(-2, Math.min(2, -velocity * 180 / pixelsPerCard));
  state.target = Math.round(state.target + momentum);
  state.dragging = false;
  state.resumeAt = now + 3800;
}

export function cardPose(index, position, count) {
  const offset = wrapIndex(index - position + count / 2, count) - count / 2;
  const distance = Math.abs(offset);
  const angle = offset * DRUM_SPACING;
  const edge = Math.abs(angle);
  return {
    offset,
    x: Math.sin(angle) * DRUM_RADIUS,
    z: (Math.cos(angle) - 1) * DRUM_RADIUS,
    rotation: angle,
    opacity: Math.max(0, Math.min(1, (2 - edge) / 0.45)),
  };
}
