import { Container, Text, TextStyle, Graphics, Assets, Sprite } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';

/** Sequence timing (seconds). Adjust these to change the intro pacing. */
export const INTRO_TIMING = {
  LOOP_DURATION: 11.2,

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
  TITLE_END: 8.3,

  BLACK_4_START: 8.3,
  BLACK_4_END: 8.55,

  EPISODE_START: 8.55,
  EPISODE_END: 10.5,

  BLACK_CLOSE_START: 10.5,
  BLACK_CLOSE_END: 11.2,
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

  CARD_1_VIBRATE_INTENSITY: 1.2,
  CARD_1_VIBRATE_DURATION: 0.12,

  TRANSITION_FLASH_DURATION: 0.06,
  TRANSITION_FLASH_OPACITY: 0.55,
  IMPACT_FLASH_OPACITY: 1.0,
  TITLE_SHIMMER_DURATION: 0.07,
  TITLE_SHIMMER_OPACITY: 0.35,

  SHAKE_CARD_2: { duration: 0.16, intensity: 2.0, horizontal: true },
  SHAKE_CARD_3: { duration: 0.2, intensity: 2.5, horizontal: false },
  SHAKE_TITLE: { duration: 0.18, intensity: 2.8, horizontal: false },
  SHAKE_EPISODE: { duration: 0.22, intensity: 3.2, horizontal: false },
};

const TITLE_IMAGE_PATH = '/images/title/Bandito-and-friends.png';
const HERO_PADDING = 16;

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

function createShakeController() {
  let active = null;

  return {
    trigger(loopTime, { duration, intensity, horizontal = false }) {
      active = { start: loopTime, duration, intensity, horizontal };
    },
    getOffset(loopTime) {
      if (!active) {
        return { x: 0, y: 0 };
      }

      const elapsed = loopTime - active.start;
      if (elapsed < 0 || elapsed >= active.duration) {
        if (elapsed >= active.duration) {
          active = null;
        }
        return { x: 0, y: 0 };
      }

      const decay = 1 - elapsed / active.duration;
      const wave = Math.sin(elapsed * 50 * Math.PI * 2);
      const amount = wave * active.intensity * decay;

      return active.horizontal
        ? { x: amount, y: 0 }
        : { x: amount * 0.35, y: amount };
    },
  };
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
  heroDisplay.visible = false;

  try {
    const texture = await Assets.load(TITLE_IMAGE_PATH);
    texture.source.scaleMode = 'nearest';

    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.roundPixels = true;

    const maxWidth = CANVAS_WIDTH - HERO_PADDING * 2;
    const maxHeight = CANVAS_HEIGHT - HERO_PADDING * 2;
    const fitScale = Math.min(maxWidth / sprite.width, maxHeight / sprite.height);
    sprite.scale.set(fitScale);

    heroDisplay.addChild(sprite);
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

function applyTextVibration(text, localTime, baseX, baseY, intensity, duration) {
  if (localTime < 0 || localTime >= duration) {
    text.x = baseX;
    text.y = baseY;
    return;
  }

  const decay = 1 - localTime / duration;
  const offset = Math.sin(localTime * 55 * Math.PI * 2) * intensity * decay;
  text.x = baseX + offset;
  text.y = baseY;
}

export async function createIntroScene() {
  const container = new Container();
  const stageRoot = new Container();
  const flashOverlay = createFlashOverlay();
  const shake = createShakeController();

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
  container.addChild(stageRoot, flashOverlay);

  const shakeTriggers = new Set();

  function triggerOnce(key, loopIndex, loopTime, config) {
    const triggerKey = `${key}-${loopIndex}`;
    if (shakeTriggers.has(triggerKey)) {
      return;
    }
    shakeTriggers.add(triggerKey);
    shake.trigger(loopTime, config);
  }

  function updateCard1(loopTime, loopIndex) {
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
    applyTextVibration(
      card1,
      localTime,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      INTRO_MOTION.CARD_1_VIBRATE_INTENSITY,
      INTRO_MOTION.CARD_1_VIBRATE_DURATION,
    );
  }

  function updateCard2(loopTime, loopIndex) {
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
    card2.x = CANVAS_WIDTH / 2;
    card2.y = CANVAS_HEIGHT / 2;

    if (localTime >= 0) {
      triggerOnce('shake-card-2', loopIndex, loopTime, INTRO_MOTION.SHAKE_CARD_2);
    }
  }

  function updateCard3(loopTime, loopIndex) {
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

    if (localTime >= INTRO_MOTION.CARD_3_ENTRANCE) {
      triggerOnce('shake-card-3', loopIndex, loopTime, INTRO_MOTION.SHAKE_CARD_3);
    }
  }

  function updateTitleArtwork(loopTime, loopIndex) {
    const active = loopTime >= INTRO_TIMING.TITLE_START && loopTime < INTRO_TIMING.TITLE_END;
    heroDisplay.visible = active;

    if (!active) {
      heroDisplay.scale.set(1);
      return;
    }

    const localTime = loopTime - INTRO_TIMING.TITLE_START;
    const sectionDuration = INTRO_TIMING.TITLE_END - INTRO_TIMING.TITLE_START;

    if (localTime >= 0) {
      triggerOnce('shake-title', loopIndex, loopTime, INTRO_MOTION.SHAKE_TITLE);
    }

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
  }

  function updateEpisodeTitles(loopTime, loopIndex) {
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

      if (line2LocalTime >= 0) {
        triggerOnce('shake-episode', loopIndex, loopTime, INTRO_MOTION.SHAKE_EPISODE);
      }
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

  function updateStageShake(loopTime) {
    const offset = shake.getOffset(loopTime);
    stageRoot.x = offset.x;
    stageRoot.y = offset.y;
  }

  function update(elapsedSeconds) {
    const loopTime = elapsedSeconds % INTRO_TIMING.LOOP_DURATION;
    const loopIndex = Math.floor(elapsedSeconds / INTRO_TIMING.LOOP_DURATION);

    updateCard1(loopTime, loopIndex);
    updateCard2(loopTime, loopIndex);
    updateCard3(loopTime, loopIndex);
    updateTitleArtwork(loopTime, loopIndex);
    updateEpisodeTitles(loopTime, loopIndex);
    updateFlashOverlay(loopTime);
    updateStageShake(loopTime);
  }

  return { container, update };
}
