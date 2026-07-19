import { Assets, Container, Graphics, Sprite } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
import {
  TITLE_MENU_IMAGES,
  TITLE_MENU_TIMING,
} from '../data/title-menu-timing.js';
import { createTitleMenuAudio } from './TitleMenuAudio.js';

function configurePixelArtTexture(texture) {
  texture.source.scaleMode = 'nearest';
  texture.source.autoGenerateMipmaps = false;

  if (texture.source.style) {
    texture.source.style.scaleMode = 'nearest';
  }
}

/** Scale to fit entirely inside the 9:16 stage — never wider or taller than the canvas. */
function computeContainScale(texture) {
  return Math.min(
    CANVAS_WIDTH / texture.width,
    CANVAS_HEIGHT / texture.height,
  );
}

/** NES-style title menu — cursor blips between two menu images, then Start + flash. */
export async function createTitleMenuScene() {
  const container = new Container();
  const stageRoot = new Container();
  const imageSprite = new Sprite();
  imageSprite.anchor.set(0.5);
  imageSprite.x = CANVAS_WIDTH / 2;
  imageSprite.y = CANVAS_HEIGHT / 2;
  imageSprite.roundPixels = true;

  const flashOverlay = new Graphics();
  flashOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0xffffff);
  flashOverlay.alpha = 0;
  flashOverlay.visible = false;

  container.addChild(stageRoot, flashOverlay);
  stageRoot.addChild(imageSprite);

  const audio = createTitleMenuAudio();
  await audio.preload();

  const textures = new Map();
  let fitScale = 1;
  let started = false;
  let complete = false;
  let phase = 'idle';
  let phaseElapsed = 0;
  let flashElapsed = 0;
  let onHandoffStart = null;

  async function loadTextures() {
    const entries = Object.entries(TITLE_MENU_IMAGES);

    await Promise.all(
      entries.map(async ([key, path]) => {
        try {
          const texture = await Assets.load(path);
          configurePixelArtTexture(texture);
          textures.set(key, texture);
        } catch (error) {
          console.warn(`[TitleMenuScene] Failed to load ${path}.`, error);
        }
      }),
    );
  }

  await loadTextures();

  function showImage(key) {
    const texture = textures.get(key);
    if (!texture) {
      imageSprite.visible = false;
      return;
    }

    imageSprite.texture = texture;
    fitScale = computeContainScale(texture);
    imageSprite.scale.set(fitScale);
    imageSprite.visible = true;
  }

  function setFlashAlpha(alpha) {
    flashOverlay.alpha = alpha;
    flashOverlay.visible = alpha > 0;
  }

  function finish() {
    complete = true;
    started = false;
    setFlashAlpha(0);
  }

  function beginFlash() {
    phase = 'flashing';
    flashElapsed = 0;
    setFlashAlpha(1);
    onHandoffStart?.();
  }

  function advancePhase() {
    switch (phase) {
      case 'start-hold':
        audio.playCursor();
        showImage('RUN_AWAY_SELECTED');
        phase = 'run-away-hold';
        phaseElapsed = 0;
        break;

      case 'run-away-hold':
        audio.playCursor();
        showImage('START_SELECTED');
        phase = 'final-start-hold';
        phaseElapsed = 0;
        break;

      case 'final-start-hold':
        phase = 'confirming';
        phaseElapsed = 0;
        audio.playStartSelected(beginFlash);
        break;

      default:
        break;
    }
  }

  function getPhaseDuration() {
    switch (phase) {
      case 'start-hold':
        return TITLE_MENU_TIMING.START_SELECTED_HOLD;
      case 'run-away-hold':
        return TITLE_MENU_TIMING.RUN_AWAY_SELECTED_HOLD;
      case 'final-start-hold':
        return TITLE_MENU_TIMING.FINAL_START_SELECTED_HOLD;
      default:
        return 0;
    }
  }

  function start() {
    started = true;
    complete = false;
    phase = 'start-hold';
    phaseElapsed = 0;
    flashElapsed = 0;
    setFlashAlpha(0);
    showImage('START_SELECTED');
  }

  function update(deltaSeconds) {
    if (!started || complete) {
      if (!started) {
        showImage('START_SELECTED');
      }
      return;
    }

    if (phase === 'flashing') {
      flashElapsed += deltaSeconds;

      if (flashElapsed >= TITLE_MENU_TIMING.WHITE_FLASH_DURATION) {
        setFlashAlpha(0);
        finish();
      }
      return;
    }

    if (phase === 'confirming') {
      return;
    }

    phaseElapsed += deltaSeconds;
    const duration = getPhaseDuration();

    if (duration > 0 && phaseElapsed >= duration) {
      advancePhase();
    }
  }

  return {
    container,
    start,
    update,
    unlockAudio: audio.unlock,
    isComplete: () => complete,
    isStarted: () => started,
    setHandoffHandler(handler) {
      onHandoffStart = handler;
    },
  };
}
