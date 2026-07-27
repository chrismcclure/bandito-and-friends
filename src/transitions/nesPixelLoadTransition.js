/**
 * Mega Man-style pixel-block dissolve between title menu and series opening.
 * White flash → hold on pixel grid → blocks dissolve to reveal the living room.
 */
import { Container, Graphics } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';

/** NES Start press → pixel-block load transition after the title menu. */
export const NES_PIXEL_LOAD_TIMING = {
  /** Full-screen white flash — ~2–3 frames at 60fps. */
  FLASH_DURATION: 0.045,
  /** Hold on full white pixel grid before blocks begin dissolving. */
  BLOCK_HOLD_DURATION: 0.5,
  /** Chunky pixel blocks dissolve away (seconds). */
  DISSOLVE_DURATION: 0.8,
  /** Discrete removal steps — no smooth fade. */
  DISSOLVE_STEPS: 16,
  /** Begin intro music once this much of the living room is revealed. */
  MUSIC_REVEAL_THRESHOLD: 0.7,
  /** Size of each retro load block in stage pixels. */
  BLOCK_SIZE: 20,
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function buildDissolveBlocks(blockSize, steps) {
  const cols = Math.ceil(CANVAS_WIDTH / blockSize);
  const rows = Math.ceil(CANVAS_HEIGHT / blockSize);
  const blocks = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      blocks.push({ col, row });
    }
  }

  shuffle(blocks);

  const chunkSize = Math.max(1, Math.ceil(blocks.length / steps));
  blocks.forEach((block, index) => {
    block.removeStep = Math.floor(index / chunkSize);
  });

  return { blocks, cols, rows };
}

/**
 * White flash → chunky pixel blocks → cluster dissolve revealing the scene below.
 * Feels like an NES cartridge loading the game world block-by-block.
 */
export function createNesPixelLoadTransition() {
  const container = new Container();
  const blocksGraphics = new Graphics();
  const flashOverlay = new Graphics();

  flashOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0xffffff);
  flashOverlay.visible = false;

  container.addChild(blocksGraphics, flashOverlay);

  const { BLOCK_SIZE, FLASH_DURATION, BLOCK_HOLD_DURATION, DISSOLVE_DURATION, DISSOLVE_STEPS } =
    NES_PIXEL_LOAD_TIMING;

  let phase = 'idle';
  let elapsed = 0;
  let blocks = [];
  let musicStarted = false;
  let onMusicStart = null;

  function drawBlocks(removeThroughStep) {
    blocksGraphics.clear();

    for (const block of blocks) {
      if (block.removeStep <= removeThroughStep) {
        continue;
      }

      blocksGraphics
        .rect(
          block.col * BLOCK_SIZE,
          block.row * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE,
        )
        .fill(0xffffff);
    }
  }

  function getRevealProgress(removeThroughStep) {
    if (blocks.length === 0) {
      return 1;
    }

    const remaining = blocks.filter((block) => block.removeStep > removeThroughStep).length;
    return 1 - remaining / blocks.length;
  }

  function start() {
    const grid = buildDissolveBlocks(BLOCK_SIZE, DISSOLVE_STEPS);
    blocks = grid.blocks;
    musicStarted = false;
    phase = 'flash';
    elapsed = 0;
    blocksGraphics.clear();
    flashOverlay.visible = true;
    flashOverlay.alpha = 1;
    container.visible = true;
  }

  function update(deltaSeconds) {
    if (phase === 'idle') {
      return true;
    }

    elapsed += deltaSeconds;

    if (phase === 'flash') {
      if (elapsed >= FLASH_DURATION) {
        phase = 'hold';
        elapsed = 0;
        flashOverlay.visible = false;
        drawBlocks(-1);
      }

      return false;
    }

    if (phase === 'hold') {
      if (elapsed >= BLOCK_HOLD_DURATION) {
        phase = 'dissolve';
        elapsed = 0;
      }

      return false;
    }

    const linearT = Math.min(1, elapsed / DISSOLVE_DURATION);
    const removeThroughStep = Math.min(
      DISSOLVE_STEPS,
      Math.floor(linearT * DISSOLVE_STEPS),
    );
    drawBlocks(removeThroughStep);

    const revealProgress = getRevealProgress(removeThroughStep);

    if (!musicStarted && revealProgress >= NES_PIXEL_LOAD_TIMING.MUSIC_REVEAL_THRESHOLD) {
      musicStarted = true;
      onMusicStart?.();
    }

    if (linearT >= 1) {
      phase = 'idle';
      elapsed = 0;
      blocks = [];
      blocksGraphics.clear();
      container.visible = false;
      return true;
    }

    return false;
  }

  function seekToTime(time) {
    const totalDuration = FLASH_DURATION + BLOCK_HOLD_DURATION + DISSOLVE_DURATION;
    const clampedTime = Math.max(0, Math.min(time, totalDuration));

    if (blocks.length === 0) {
      const grid = buildDissolveBlocks(BLOCK_SIZE, DISSOLVE_STEPS);
      blocks = grid.blocks;
    }

    musicStarted =
      clampedTime >=
      FLASH_DURATION +
        BLOCK_HOLD_DURATION +
        DISSOLVE_DURATION * NES_PIXEL_LOAD_TIMING.MUSIC_REVEAL_THRESHOLD;

    container.visible = clampedTime < totalDuration;
    elapsed = clampedTime;

    if (clampedTime < FLASH_DURATION) {
      phase = 'flash';
      flashOverlay.visible = true;
      flashOverlay.alpha = 1;
      blocksGraphics.clear();
      return;
    }

    flashOverlay.visible = false;

    if (clampedTime < FLASH_DURATION + BLOCK_HOLD_DURATION) {
      phase = 'hold';
      drawBlocks(-1);
      return;
    }

    phase = 'dissolve';
    const dissolveElapsed = clampedTime - FLASH_DURATION - BLOCK_HOLD_DURATION;
    const linearT = Math.min(1, dissolveElapsed / DISSOLVE_DURATION);
    const removeThroughStep = Math.min(
      DISSOLVE_STEPS,
      Math.floor(linearT * DISSOLVE_STEPS),
    );
    drawBlocks(removeThroughStep);
  }

  function getTotalDuration() {
    return FLASH_DURATION + BLOCK_HOLD_DURATION + DISSOLVE_DURATION;
  }

  return {
    container,
    start,
    update,
    seekToTime,
    getTotalDuration,
    isActive: () => phase !== 'idle',
    setMusicStartHandler(handler) {
      onMusicStart = handler;
    },
    reset() {
      phase = 'idle';
      elapsed = 0;
      blocks = [];
      musicStarted = false;
      blocksGraphics.clear();
      flashOverlay.visible = false;
      container.visible = false;
    },
  };
}
