import { Container, Text, TextStyle, Graphics } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
import {
  OPENING_CRAWL_TEXT,
  OPENING_CRAWL_TIMING,
  OPENING_CRAWL_STYLE,
} from '../data/opening-crawl.js';
import { createOpeningCrawlMusic } from '../audio/OpeningCrawlMusic.js';

const FRAME_INSET = 14;
const TEXT_COLOR = 0xf8e898;
const FRAME_OUTER = 0x6b4f2a;
const FRAME_INNER = 0x9a7340;
const FRAME_ACCENT = 0xc49a55;
const STAR_COLOR = 0x8888aa;

function createStars() {
  const stars = new Graphics();
  const seed = [12, 37, 58, 91, 113, 142, 168, 201, 224, 248];

  for (let i = 0; i < seed.length; i += 1) {
    const x = (seed[i] * 17) % (CANVAS_WIDTH - 24) + 12;
    const y = (seed[i] * 23) % (CANVAS_HEIGHT - 24) + 12;
    const size = i % 3 === 0 ? 2 : 1;
    stars.rect(x, y, size, size).fill(STAR_COLOR);
  }

  return stars;
}

function drawPawPrint(graphics, x, y, scale = 1) {
  const pad = 3 * scale;
  graphics.circle(x, y + pad, 2 * scale).fill(FRAME_ACCENT);
  graphics.circle(x - 3 * scale, y - 1 * scale, 1.5 * scale).fill(FRAME_ACCENT);
  graphics.circle(x + 3 * scale, y - 1 * scale, 1.5 * scale).fill(FRAME_ACCENT);
  graphics.circle(x - 1.5 * scale, y - 3 * scale, 1.5 * scale).fill(FRAME_ACCENT);
  graphics.circle(x + 1.5 * scale, y - 3 * scale, 1.5 * scale).fill(FRAME_ACCENT);
}

function createStorybookFrame() {
  const frame = new Graphics();

  frame.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0x000000);

  frame
    .rect(4, 4, CANVAS_WIDTH - 8, CANVAS_HEIGHT - 8)
    .fill(FRAME_OUTER);
  frame
    .rect(8, 8, CANVAS_WIDTH - 16, CANVAS_HEIGHT - 16)
    .fill(FRAME_INNER);
  frame
    .rect(FRAME_INSET, FRAME_INSET, CANVAS_WIDTH - FRAME_INSET * 2, CANVAS_HEIGHT - FRAME_INSET * 2)
    .fill(0x000000);

  // Cat ears — top corners
  const drawEar = (x, flip) => {
    const points = flip
      ? [x, 10, x + 14, 10, x + 7, 22]
      : [x, 10, x + 14, 10, x + 7, 22];
    frame.poly(points).fill(FRAME_OUTER);
    const inner = flip
      ? [x + 3, 12, x + 11, 12, x + 7, 18]
      : [x + 3, 12, x + 11, 12, x + 7, 18];
    frame.poly(inner).fill(FRAME_ACCENT);
  };
  drawEar(18, false);
  drawEar(CANVAS_WIDTH - 32, true);

  // Yarn curls — left and right sides
  for (let i = 0; i < 4; i += 1) {
    const y = 80 + i * 90;
    frame.arc(10, y, 6, 0, Math.PI * 1.5).stroke({ color: FRAME_ACCENT, width: 2 });
    frame.arc(CANVAS_WIDTH - 10, y + 20, 6, Math.PI * 0.5, Math.PI).stroke({
      color: FRAME_ACCENT,
      width: 2,
    });
  }

  // Tail-shaped side vines
  frame
    .moveTo(6, 120)
    .lineTo(10, 160)
    .lineTo(6, 200)
    .lineTo(11, 240)
    .stroke({ color: FRAME_OUTER, width: 2 });
  frame
    .moveTo(CANVAS_WIDTH - 6, 140)
    .lineTo(CANVAS_WIDTH - 11, 180)
    .lineTo(CANVAS_WIDTH - 6, 220)
    .lineTo(CANVAS_WIDTH - 10, 260)
    .stroke({ color: FRAME_OUTER, width: 2 });

  // Paw prints in corners
  drawPawPrint(frame, 22, CANVAS_HEIGHT - 28);
  drawPawPrint(frame, CANVAS_WIDTH - 30, CANVAS_HEIGHT - 28);
  drawPawPrint(frame, 24, 36, 0.85);
  drawPawPrint(frame, CANVAS_WIDTH - 32, 36, 0.85);

  // Tiny fish bone — bottom center charm
  frame
    .moveTo(CANVAS_WIDTH / 2 - 8, CANVAS_HEIGHT - 12)
    .lineTo(CANVAS_WIDTH / 2 + 8, CANVAS_HEIGHT - 12)
    .stroke({ color: FRAME_ACCENT, width: 1 });
  frame
    .moveTo(CANVAS_WIDTH / 2 - 4, CANVAS_HEIGHT - 15)
    .lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10)
    .lineTo(CANVAS_WIDTH / 2 + 4, CANVAS_HEIGHT - 15)
    .stroke({ color: FRAME_ACCENT, width: 1 });

  return frame;
}

function createStartOverlay() {
  const overlay = new Container();
  const background = new Graphics();
  background.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0x000000);

  const label = new Text({
    text: 'CLICK TO START',
    style: new TextStyle({
      fill: 0xffffff,
      fontFamily: 'monospace',
      fontSize: 11,
      align: 'center',
    }),
  });

  label.anchor.set(0.5);
  label.roundPixels = true;
  label.x = CANVAS_WIDTH / 2;
  label.y = CANVAS_HEIGHT / 2;

  overlay.addChild(background, label);
  return overlay;
}

export function createOpeningCrawlScene() {
  const container = new Container();
  const crawlMusic = createOpeningCrawlMusic();
  const fadeOverlay = new Graphics();
  fadeOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0x000000);
  fadeOverlay.alpha = 0;
  fadeOverlay.visible = false;

  const textViewportTop = FRAME_INSET + 6;
  const textViewportBottom = CANVAS_HEIGHT - FRAME_INSET - 6;
  const textWidth =
    CANVAS_WIDTH - FRAME_INSET * 2 - OPENING_CRAWL_STYLE.textMargin * 2;

  const crawlText = new Text({
    text: OPENING_CRAWL_TEXT,
    style: new TextStyle({
      fill: TEXT_COLOR,
      fontFamily: 'monospace',
      fontSize: OPENING_CRAWL_STYLE.fontSize,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: textWidth,
      lineHeight: OPENING_CRAWL_STYLE.lineHeight,
    }),
  });

  crawlText.anchor.set(0.5, 0);
  crawlText.roundPixels = true;
  crawlText.x = CANVAS_WIDTH / 2;

  const scrollDistance = crawlText.height + (textViewportBottom - textViewportTop);
  const scrollDuration = scrollDistance / OPENING_CRAWL_TIMING.SCROLL_SPEED;
  const totalDuration =
    OPENING_CRAWL_TIMING.HOLD_BEFORE_SCROLL +
    scrollDuration +
    OPENING_CRAWL_TIMING.FADE_OUT_DURATION;

  const textLayer = new Container();
  textLayer.addChild(crawlText);

  const startOverlay = createStartOverlay();

  container.addChild(
    createStars(),
    createStorybookFrame(),
    textLayer,
    fadeOverlay,
    startOverlay,
  );

  let started = false;
  let complete = false;
  let onComplete = null;

  function update(elapsedSeconds) {
    if (!started) {
      crawlText.y = textViewportBottom;
      return;
    }

    if (complete) {
      return;
    }

    const hold = OPENING_CRAWL_TIMING.HOLD_BEFORE_SCROLL;
    const scrollElapsed = Math.max(0, elapsedSeconds - hold);
    crawlText.y = textViewportBottom - scrollElapsed * OPENING_CRAWL_TIMING.SCROLL_SPEED;

    const scrollFinished = crawlText.y + crawlText.height <= textViewportTop;
    const fadeStart = hold + scrollDuration;
    const fadeElapsed = elapsedSeconds - fadeStart;

    if (scrollFinished && fadeElapsed >= 0) {
      const fadeProgress = Math.min(
        fadeElapsed / OPENING_CRAWL_TIMING.FADE_OUT_DURATION,
        1,
      );
      fadeOverlay.visible = true;
      fadeOverlay.alpha = fadeProgress;

      if (fadeProgress >= 1) {
        complete = true;
        crawlMusic.stop();
        onComplete?.();
      }
    }
  }

  function start() {
    if (started) {
      return;
    }

    started = true;
    startOverlay.visible = false;
    crawlMusic.play();
  }

  function isStarted() {
    return started;
  }

  function isComplete() {
    return complete;
  }

  function setCompleteHandler(handler) {
    onComplete = handler;
  }

  function getTotalDuration() {
    return totalDuration;
  }

  return {
    container,
    update,
    start,
    isStarted,
    isComplete,
    setCompleteHandler,
    getTotalDuration,
  };
}

export function getOpeningCrawlEstimatedRuntime() {
  const scene = createOpeningCrawlScene();
  return scene.getTotalDuration();
}
