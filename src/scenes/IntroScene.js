import {
  Container,
  Text,
  TextStyle,
  Graphics,
  Assets,
  Sprite,
  Texture,
  Rectangle,
} from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
import { EPISODE_01_INTRO_TIMING } from '../data/episode-01-shots.js';
import { createIntroAudio } from './IntroAudio.js';
import { createIntroMusic } from '../audio/IntroMusic.js';

/** Sequence timing (seconds). Adjust these to change the intro pacing. */
export const INTRO_TIMING = {
  LOOP_DURATION: 14.1,

  CARD_1_START: 0.6,
  CARD_1_END: 1.8,

  BLACK_1_START: 1.8,
  BLACK_1_END: 2.1,

  CARD_2_START: 2.1,
  CARD_2_END: 3.4,

  BLACK_2_START: 3.4,
  BLACK_2_END: 3.7,

  CARD_3_START: 3.7,
  CARD_3_END: 5.0,

  BLACK_3_START: 5.0,
  BLACK_3_END: 5.25,

  IMPACT_FLASH_START: 5.25,
  IMPACT_FLASH_END: 5.4,

  TITLE_START: 5.4,
  TITLE_END: 11.2,

  BLACK_4_START: 11.2,
  BLACK_4_END: 11.45,

  EPISODE_START: 11.45,
  EPISODE_END: 13.4,

  BLACK_CLOSE_START: 13.4,
  BLACK_CLOSE_END: 14.1,
};

/** Motion tuning. Adjust strength, duration, and scale values here. */
export const INTRO_MOTION = {
  CARD_1_ENTRANCE: 0.22,
  CARD_2_ENTRANCE: 0.24,
  CARD_3_ENTRANCE: 0.28,
  TITLE_ENTRANCE: 0.35,
  EPISODE_1_ENTRANCE: 0.2,
  EPISODE_2_DELAY: 0.18,
  EPISODE_2_ENTRANCE: 0.22,

  CARD_1_START_SCALE: 1.35,
  CARD_2_START_SCALE: 1.55,
  CARD_3_START_SCALE: 1.75,
  TITLE_START_SCALE: 1.12,
  TITLE_ZOOM_END: 1.045,
  EPISODE_1_START_SCALE: 1.25,
  EPISODE_2_START_SCALE: 1.65,

  TRANSITION_FLASH_DURATION: 0.06,
  TRANSITION_FLASH_OPACITY: 0.55,
  IMPACT_FLASH_OPACITY: 1.0,
  TITLE_SHIMMER_DURATION: 0.07,
  TITLE_SHIMMER_OPACITY: 0.35,
};

const TITLE_IMAGE_PATH = '/images/title/Bandito-and-friends-v2.png';
const TITLE_HERO_PADDING = 2;
const TITLE_BASE_SCALE_MULTIPLIER = 1.3;
const TITLE_BACKGROUND_THRESHOLD = 12;

function configurePixelArtTexture(texture) {
  texture.source.scaleMode = 'nearest';
  texture.source.autoGenerateMipmaps = false;

  if (texture.source.style) {
    texture.source.style.scaleMode = 'nearest';
  }
}

function getImageElementFromTexture(texture) {
  const resource = texture?.source?.resource;

  if (resource instanceof HTMLImageElement || resource instanceof HTMLCanvasElement) {
    return resource;
  }

  return null;
}

function getContentBounds(image, threshold = TITLE_BACKGROUND_THRESHOLD) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);

  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      const isBackground =
        alpha < 8 ||
        (red <= threshold && green <= threshold && blue <= threshold);

      if (!isBackground) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function computePixelPerfectTitleScale(contentWidth, contentHeight) {
  const maxWidth = CANVAS_WIDTH - TITLE_HERO_PADDING * 2;
  const maxHeight = CANVAS_HEIGHT - TITLE_HERO_PADDING * 2;
  let fitScale = Math.min(maxWidth / contentWidth, maxHeight / contentHeight);
  fitScale *= TITLE_BASE_SCALE_MULTIPLIER;
  fitScale = Math.min(
    fitScale,
    maxWidth / contentWidth,
    maxHeight / contentHeight,
  );

  const renderWidth = Math.round(contentWidth * fitScale);
  const renderHeight = Math.round(contentHeight * fitScale);
  const scaleX = renderWidth / contentWidth;
  const scaleY = renderHeight / contentHeight;
  const uniformScale = Math.min(scaleX, scaleY);

  return {
    scale: uniformScale,
    renderWidth: Math.round(contentWidth * uniformScale),
    renderHeight: Math.round(contentHeight * uniformScale),
  };
}

function snapDisplayObjectToPixels(displayObject) {
  displayObject.x = Math.round(displayObject.x);
  displayObject.y = Math.round(displayObject.y);
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createCenteredText(content, styleOverrides = {}) {
  const text = new Text({
    text: content,
    style: new TextStyle({
      fill: 0xffffff,
      fontFamily: 'monospace',
      fontSize: 11,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: CANVAS_WIDTH - 32,
      ...styleOverrides,
    }),
  });

  text.anchor.set(0.5);
  text.roundPixels = true;
  text.x = CANVAS_WIDTH / 2;
  text.y = CANVAS_HEIGHT / 2;
  text.visible = false;
  return text;
}

function createHeroPlaceholderPanel() {
  const panel = new Container();
  const panelWidth = 220;
  const panelHeight = 300;

  const border = new Graphics();
  border
    .rect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight)
    .stroke({ color: 0xffffff, width: 1 });

  const title = new Text({
    text: 'BANDITO AND FRIENDS',
    style: new TextStyle({
      fill: 0xffffff,
      fontFamily: 'monospace',
      fontSize: 10,
      align: 'center',
    }),
  });

  const label = new Text({
    text: 'HERO IMAGE PLACEHOLDER',
    style: new TextStyle({
      fill: 0xffffff,
      fontFamily: 'monospace',
      fontSize: 8,
      align: 'center',
    }),
  });

  title.anchor.set(0.5);
  label.anchor.set(0.5);
  title.y = -10;
  label.y = 10;

  panel.addChild(border, title, label);
  return panel;
}

async function createHeroDisplay() {
  const heroDisplay = new Container();
  heroDisplay.x = CANVAS_WIDTH / 2;
  heroDisplay.y = CANVAS_HEIGHT / 2;
  heroDisplay.roundPixels = true;
  heroDisplay.visible = false;

  try {
    const texture = await Assets.load({
      src: TITLE_IMAGE_PATH,
      data: {
        scaleMode: 'nearest',
        autoGenerateMipmaps: false,
      },
    });
    configurePixelArtTexture(texture);

    const image = getImageElementFromTexture(texture);
    const contentBounds = image
      ? getContentBounds(image)
      : {
          x: 0,
          y: 0,
          width: texture.width,
          height: texture.height,
        };

    const croppedTexture =
      contentBounds.x === 0 &&
      contentBounds.y === 0 &&
      contentBounds.width === texture.width &&
      contentBounds.height === texture.height
        ? texture
        : new Texture({
            source: texture.source,
            frame: new Rectangle(
              contentBounds.x,
              contentBounds.y,
              contentBounds.width,
              contentBounds.height,
            ),
          });

    configurePixelArtTexture(croppedTexture);

    const layout = computePixelPerfectTitleScale(
      croppedTexture.width,
      croppedTexture.height,
    );

    const sprite = new Sprite(croppedTexture);
    sprite.anchor.set(0.5);
    sprite.roundPixels = true;
    sprite.scale.set(layout.scale);

    heroDisplay.baseTitleScale = layout.scale;
    heroDisplay.titleRenderWidth = layout.renderWidth;
    heroDisplay.titleRenderHeight = layout.renderHeight;
    heroDisplay.addChild(sprite);
    snapDisplayObjectToPixels(heroDisplay);
  } catch (error) {
    console.error(
      `[IntroScene] Failed to load title artwork from ${TITLE_IMAGE_PATH}.`,
      error,
    );
    heroDisplay.addChild(createHeroPlaceholderPanel());
  }

  return heroDisplay;
}

function createFlashOverlay() {
  const flash = new Graphics();
  flash.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0xffffff);
  flash.alpha = 0;
  flash.visible = false;
  return flash;
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

function applyPunchInScale(displayObject, localTime, entranceDuration, startScale) {
  if (localTime < 0) {
    displayObject.scale.set(startScale);
    displayObject.visible = false;
    return;
  }

  displayObject.visible = true;

  if (localTime >= entranceDuration) {
    displayObject.scale.set(1);
    return;
  }

  const progress = clamp(localTime / entranceDuration, 0, 1);
  const eased = easeOutBack(progress);
  const scale = startScale - (startScale - 1) * eased;
  displayObject.scale.set(scale);
}

export async function createIntroScene() {
  const container = new Container();
  const stageRoot = new Container();
  stageRoot.roundPixels = true;
  const flashOverlay = createFlashOverlay();
  const startOverlay = createStartOverlay();
  const introAudio = createIntroAudio(INTRO_TIMING, INTRO_MOTION);
  const introMusic = createIntroMusic();

  await introAudio.preload();

  let started = false;
  let skipTextCards = false;
  let episodeIntroMode = false;
  let introComplete = false;
  let suppressComplete = false;
  let onStart = null;
  let onComplete = null;

  const card1 = createCenteredText('IN A QUIET HOUSE...');
  const card2 = createCenteredText('AN ANCIENT EVIL...');
  const card3 = createCenteredText('...HAD RETURNED.');
  const heroDisplay = await createHeroDisplay();

  const episodeLine1 = createCenteredText('EPISODE 1', { fontSize: 9 });
  episodeLine1.y = CANVAS_HEIGHT / 2 - 22;

  const episodeLine2 = createCenteredText('THE SOCK MONSTER', {
    fontSize: 15,
    wordWrapWidth: CANVAS_WIDTH - 24,
  });
  episodeLine2.y = CANVAS_HEIGHT / 2 + 10;

  stageRoot.addChild(card1, card2, card3, heroDisplay, episodeLine1, episodeLine2);
  container.addChild(stageRoot, flashOverlay, startOverlay);

  function updateCard1(loopTime) {
    const active = loopTime >= INTRO_TIMING.CARD_1_START && loopTime < INTRO_TIMING.CARD_1_END;
    card1.visible = active;

    if (!active) {
      card1.scale.set(1);
      card1.x = CANVAS_WIDTH / 2;
      card1.y = CANVAS_HEIGHT / 2;
      return;
    }

    const localTime = loopTime - INTRO_TIMING.CARD_1_START;
    applyPunchInScale(
      card1,
      localTime,
      INTRO_MOTION.CARD_1_ENTRANCE,
      INTRO_MOTION.CARD_1_START_SCALE,
    );
  }

  function updateCard2(loopTime) {
    const active = loopTime >= INTRO_TIMING.CARD_2_START && loopTime < INTRO_TIMING.CARD_2_END;
    card2.visible = active;

    if (!active) {
      card2.scale.set(1);
      card2.x = CANVAS_WIDTH / 2;
      card2.y = CANVAS_HEIGHT / 2;
      return;
    }

    const localTime = loopTime - INTRO_TIMING.CARD_2_START;
    applyPunchInScale(
      card2,
      localTime,
      INTRO_MOTION.CARD_2_ENTRANCE,
      INTRO_MOTION.CARD_2_START_SCALE,
    );
  }

  function updateCard3(loopTime) {
    const active = loopTime >= INTRO_TIMING.CARD_3_START && loopTime < INTRO_TIMING.CARD_3_END;
    card3.visible = active;

    if (!active) {
      card3.scale.set(1);
      return;
    }

    const localTime = loopTime - INTRO_TIMING.CARD_3_START;
    applyPunchInScale(
      card3,
      localTime,
      INTRO_MOTION.CARD_3_ENTRANCE,
      INTRO_MOTION.CARD_3_START_SCALE,
    );
  }

  function updateTitleArtwork(loopTime) {
    const active = loopTime >= INTRO_TIMING.TITLE_START && loopTime < INTRO_TIMING.TITLE_END;
    heroDisplay.visible = active;

    if (!active) {
      heroDisplay.scale.set(1);
      snapDisplayObjectToPixels(heroDisplay);
      return;
    }

    const localTime = loopTime - INTRO_TIMING.TITLE_START;
    const sectionDuration = INTRO_TIMING.TITLE_END - INTRO_TIMING.TITLE_START;

    let displayScale = 1;

    if (localTime < INTRO_MOTION.TITLE_ENTRANCE) {
      const progress = clamp(localTime / INTRO_MOTION.TITLE_ENTRANCE, 0, 1);
      const eased = easeOutBack(progress);
      displayScale =
        INTRO_MOTION.TITLE_START_SCALE -
        (INTRO_MOTION.TITLE_START_SCALE - 1) * eased;
    } else {
      const zoomProgress = clamp(
        (localTime - INTRO_MOTION.TITLE_ENTRANCE) / (sectionDuration - INTRO_MOTION.TITLE_ENTRANCE),
        0,
        1,
      );
      const zoomAmount = INTRO_MOTION.TITLE_ZOOM_END - 1;
      displayScale = 1 + zoomAmount * easeOutCubic(zoomProgress);
    }

    heroDisplay.scale.set(displayScale);
    snapDisplayObjectToPixels(heroDisplay);
  }

  function updateEpisodeTitles(loopTime) {
    const active = loopTime >= INTRO_TIMING.EPISODE_START && loopTime < INTRO_TIMING.EPISODE_END;

    if (!active) {
      episodeLine1.visible = false;
      episodeLine2.visible = false;
      episodeLine1.scale.set(1);
      episodeLine2.scale.set(1);
      return;
    }

    const localTime = loopTime - INTRO_TIMING.EPISODE_START;

    episodeLine1.visible = true;
    applyPunchInScale(
      episodeLine1,
      localTime,
      INTRO_MOTION.EPISODE_1_ENTRANCE,
      INTRO_MOTION.EPISODE_1_START_SCALE,
    );

    const line2Start = INTRO_MOTION.EPISODE_2_DELAY;
    const line2LocalTime = localTime - line2Start;
    episodeLine2.visible = line2LocalTime >= 0;

    if (line2LocalTime >= 0) {
      applyPunchInScale(
        episodeLine2,
        line2LocalTime,
        INTRO_MOTION.EPISODE_2_ENTRANCE,
        INTRO_MOTION.EPISODE_2_START_SCALE,
      );
    } else {
      episodeLine2.scale.set(INTRO_MOTION.EPISODE_2_START_SCALE);
    }
  }

  function updateFlashOverlay(loopTime) {
    let alpha = 0;

    const transitionFlash = (start) => {
      const elapsed = loopTime - start;
      if (elapsed >= 0 && elapsed < INTRO_MOTION.TRANSITION_FLASH_DURATION) {
        const progress = elapsed / INTRO_MOTION.TRANSITION_FLASH_DURATION;
        alpha = Math.max(alpha, INTRO_MOTION.TRANSITION_FLASH_OPACITY * (1 - progress));
      }
    };

    transitionFlash(INTRO_TIMING.BLACK_1_START);
    transitionFlash(INTRO_TIMING.BLACK_2_START);

    if (
      loopTime >= INTRO_TIMING.IMPACT_FLASH_START &&
      loopTime < INTRO_TIMING.IMPACT_FLASH_END
    ) {
      const elapsed = loopTime - INTRO_TIMING.IMPACT_FLASH_START;
      const duration = INTRO_TIMING.IMPACT_FLASH_END - INTRO_TIMING.IMPACT_FLASH_START;
      alpha = Math.max(alpha, INTRO_MOTION.IMPACT_FLASH_OPACITY * (1 - elapsed / duration));
    }

    if (
      loopTime >= INTRO_TIMING.TITLE_START &&
      loopTime < INTRO_TIMING.TITLE_START + INTRO_MOTION.TITLE_SHIMMER_DURATION
    ) {
      const elapsed = loopTime - INTRO_TIMING.TITLE_START;
      const progress = elapsed / INTRO_MOTION.TITLE_SHIMMER_DURATION;
      alpha = Math.max(alpha, INTRO_MOTION.TITLE_SHIMMER_OPACITY * (1 - progress));
    }

    flashOverlay.alpha = alpha;
    flashOverlay.visible = alpha > 0;
  }

  function finishIntro(loopTime) {
    updateCard1(loopTime);
    updateCard2(loopTime);
    updateCard3(loopTime);
    updateTitleArtwork(loopTime);
    updateEpisodeTitles(loopTime);
    updateFlashOverlay(loopTime);
  }

  function update(elapsedSeconds) {
    if (introComplete) {
      return;
    }

    let loopTime;
    let loopIndex = 0;

    if (episodeIntroMode) {
      loopTime = INTRO_TIMING.TITLE_START + elapsedSeconds;

      if (elapsedSeconds >= EPISODE_01_INTRO_TIMING.TITLE_HOLD) {
        finishIntro(loopTime);
        introComplete = true;
        if (!suppressComplete) {
          onComplete?.();
        }
        return;
      }

      updateCard1(-1);
      updateCard2(-1);
      updateCard3(-1);
      updateTitleArtwork(loopTime);
      updateEpisodeTitles(-1);
      updateFlashOverlay(loopTime);

      if (started) {
        introAudio.update(loopTime, 0);
      }

      return;
    }

    if (skipTextCards) {
      loopTime = INTRO_TIMING.TITLE_START + elapsedSeconds;

      if (loopTime >= INTRO_TIMING.BLACK_CLOSE_END) {
        finishIntro(INTRO_TIMING.BLACK_CLOSE_END);
        introComplete = true;
        introMusic.stop();
        onComplete?.();
        return;
      }
    } else {
      loopTime = elapsedSeconds % INTRO_TIMING.LOOP_DURATION;
      loopIndex = Math.floor(elapsedSeconds / INTRO_TIMING.LOOP_DURATION);
    }

    updateCard1(loopTime);
    updateCard2(loopTime);
    updateCard3(loopTime);
    updateTitleArtwork(loopTime);
    updateEpisodeTitles(loopTime);
    updateFlashOverlay(loopTime);

    if (started) {
      introAudio.update(loopTime, loopIndex);
    }
  }

  function isStarted() {
    return started;
  }

  function setStartHandler(handler) {
    onStart = handler;
  }

  function setCompleteHandler(handler) {
    onComplete = handler;
  }

  function isComplete() {
    return introComplete;
  }

  function unlockAudio() {
    introAudio.unlock();
  }

  function seekEpisodeTitleHold(localTime = 0) {
    episodeIntroMode = true;
    skipTextCards = true;
    started = true;
    introComplete = false;
    container.visible = true;
    startOverlay.visible = false;

    const loopTime = INTRO_TIMING.TITLE_START + localTime;
    updateCard1(-1);
    updateCard2(-1);
    updateCard3(-1);
    updateTitleArtwork(loopTime);
    updateEpisodeTitles(-1);
    updateFlashOverlay(loopTime);
    introAudio.update(loopTime, 0);
  }

  function ensureIntroMusic() {
    introMusic.restart();
  }

  function setSuppressComplete(value) {
    suppressComplete = value;
  }

  function startEpisodeTitle() {
    started = true;
    skipTextCards = true;
    episodeIntroMode = true;
    introComplete = false;
    introAudio.resetTriggers();
    introMusic.restart();
    startOverlay.visible = false;
  }

  function startFromTitle() {
    if (started) {
      return;
    }

    started = true;
    skipTextCards = true;
    introAudio.resetTriggers();
    introMusic.restart();
    startOverlay.visible = false;
  }

  function start() {
    if (started) {
      return;
    }

    started = true;
    introAudio.resetTriggers();
    introAudio.unlock();
    introMusic.restart();
    startOverlay.visible = false;
    onStart?.();
  }

  function stopIntroMusic() {
    introMusic.stop();
  }

  return {
    container,
    update,
    isStarted,
    isComplete,
    setStartHandler,
    setCompleteHandler,
    start,
    startFromTitle,
    startEpisodeTitle,
    seekEpisodeTitleHold,
    setSuppressComplete,
    ensureIntroMusic,
    stopIntroMusic,
    unlockAudio,
  };
}
