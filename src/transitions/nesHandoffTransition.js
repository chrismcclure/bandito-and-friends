import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';

/** NES-style scene handoff after the title menu Start confirmation. */
export const NES_HANDOFF_TIMING = {
  /** Horizontal slide + fade after the white flash (seconds). */
  DURATION: 0.55,
  /** Chunky stepped frames — classic console scene-change feel. */
  STEPS: 10,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function stepEase(linearT, steps) {
  const t = clamp(linearT, 0, 1);
  return Math.floor(t * steps) / steps;
}

/**
 * Slides the incoming scene from the right while the outgoing title menu exits left.
 * Uses stepped motion and a brief pixel-resolve scale for an 8-bit scene change.
 */
export function createNesHandoffTransition({ incoming, outgoing }) {
  let active = false;
  let elapsed = 0;

  function resetIncoming() {
    incoming.pivot.set(0, 0);
    incoming.x = 0;
    incoming.y = 0;
    incoming.alpha = 1;
    incoming.scale.set(1);
  }

  function resetOutgoing() {
    outgoing.x = 0;
    outgoing.alpha = 1;
  }

  function start() {
    active = true;
    elapsed = 0;
    incoming.pivot.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    incoming.x = CANVAS_WIDTH + CANVAS_WIDTH / 2;
    incoming.y = CANVAS_HEIGHT / 2;
    incoming.alpha = 0;
    incoming.scale.set(1.3);
    outgoing.x = 0;
    outgoing.alpha = 1;
  }

  function update(deltaSeconds) {
    if (!active) {
      return true;
    }

    elapsed += deltaSeconds;
    const linearT = Math.min(1, elapsed / NES_HANDOFF_TIMING.DURATION);
    const t = stepEase(linearT, NES_HANDOFF_TIMING.STEPS);

    incoming.x = CANVAS_WIDTH / 2 + CANVAS_WIDTH * (1 - t);
    incoming.alpha = t;
    incoming.scale.set(1.3 - 0.3 * t);

    outgoing.x = -CANVAS_WIDTH * t;
    outgoing.alpha = 1 - t * 0.85;

    if (linearT >= 1) {
      active = false;
      resetIncoming();
      resetOutgoing();
      return true;
    }

    return false;
  }

  return {
    start,
    update,
    isActive: () => active,
    reset() {
      active = false;
      elapsed = 0;
      resetIncoming();
      resetOutgoing();
    },
  };
}
