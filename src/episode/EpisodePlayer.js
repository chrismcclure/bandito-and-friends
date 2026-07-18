import {
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
import {
  clamp,
  getShakeOffset,
  interpolateCamera,
} from './camera.js';
import { createEpisodeAudio } from './EpisodeAudio.js';
import {
  EPISODE_01_SHOTS,
  findShotIndexAtTime,
  getEpisodeOneTotalDuration,
} from '../data/episode-01-shots.js';
import { EPISODE_CARD_CUE_CONFIG } from '../audio/episodeCardCueScore.js';

const LABEL_TOP = 72;

/** Mobile-first on-screen slide text — matches episode title card scale unless a shot overrides. */
const SLIDE_TEXT_DEFAULTS = {
  fontSize: 22,
  strokeWidth: 4,
  wordWrapWidth: CANVAS_WIDTH - 20,
  bottomOffset: 64,
};

function configurePixelArtTexture(texture) {
  texture.source.scaleMode = 'nearest';
  texture.source.autoGenerateMipmaps = false;

  if (texture.source.style) {
    texture.source.style.scaleMode = 'nearest';
  }
}

function createCaptionText(content) {
  const text = new Text({
    text: content,
    style: new TextStyle({
      fill: 0xffffff,
      fontFamily: 'monospace',
      fontSize: SLIDE_TEXT_DEFAULTS.fontSize,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: SLIDE_TEXT_DEFAULTS.wordWrapWidth,
      stroke: { color: 0x000000, width: SLIDE_TEXT_DEFAULTS.strokeWidth },
      dropShadow: {
        alpha: 0.85,
        angle: Math.PI / 2,
        blur: 0,
        color: 0x000000,
        distance: 2,
      },
    }),
  });

  text.anchor.set(0.5, 1);
  text.roundPixels = true;
  text.x = CANVAS_WIDTH / 2;
  text.y = CANVAS_HEIGHT - SLIDE_TEXT_DEFAULTS.bottomOffset;
  return text;
}

function createLabelText(content, fontSize = 13) {
  const text = new Text({
    text: content,
    style: new TextStyle({
      fill: 0xffffff,
      fontFamily: 'monospace',
      fontSize,
      align: 'center',
      stroke: { color: 0x000000, width: 3 },
    }),
  });

  text.anchor.set(0.5, 0);
  text.roundPixels = true;
  text.x = CANVAS_WIDTH / 2;
  return text;
}

function applyEpisodeCardTextStyle(labelText, subtitleText, shotType) {
  const isClosing = shotType === 'closing-card';

  labelText.style.fontSize = isClosing ? 16 : 22;
  labelText.style.stroke.width = isClosing ? 3 : 4;
  labelText.style.wordWrap = false;

  subtitleText.style.fontSize = isClosing ? 14 : 28;
  subtitleText.style.stroke.width = isClosing ? 3 : 5;
  subtitleText.style.wordWrap = true;
  subtitleText.style.wordWrapWidth = CANVAS_WIDTH - 20;

  labelText.anchor.set(0.5);
  subtitleText.anchor.set(0.5);

  labelText.y = CANVAS_HEIGHT / 2 - (isClosing ? 22 : 36);
  subtitleText.y = CANVAS_HEIGHT / 2 + (isClosing ? 14 : 22);
}

function resetOverlayTextStyle(labelText, subtitleText) {
  labelText.style.fontSize = 13;
  labelText.style.stroke.width = 3;
  labelText.style.wordWrap = false;
  labelText.anchor.set(0.5, 0);

  subtitleText.style.fontSize = 10;
  subtitleText.style.stroke.width = 3;
  subtitleText.style.wordWrap = false;
  subtitleText.anchor.set(0.5, 0);
  subtitleText.y = LABEL_TOP + 22;
}

function createComicText(content) {
  const text = new Text({
    text: content,
    style: new TextStyle({
      fill: 0xfff066,
      fontFamily: 'monospace',
      fontSize: SLIDE_TEXT_DEFAULTS.fontSize,
      align: 'center',
      stroke: { color: 0x000000, width: SLIDE_TEXT_DEFAULTS.strokeWidth },
    }),
  });

  text.anchor.set(0.5);
  text.roundPixels = true;
  text.x = CANVAS_WIDTH / 2;
  text.y = CANVAS_HEIGHT / 2 - 20;
  return text;
}

function createTitleCardBackground() {
  const background = new Graphics();
  background.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0x000000);
  background.visible = false;
  return background;
}

function createSpeedLines() {
  const lines = new Graphics();
  lines.visible = false;

  for (let i = 0; i < 8; i += 1) {
    const x = 20 + i * 32;
    lines
      .moveTo(x, 40)
      .lineTo(x + 14, CANVAS_HEIGHT - 40)
      .stroke({ color: 0xffffff, width: 1, alpha: 0.35 });
  }

  return lines;
}

export async function createEpisodePlayer({
  shots = EPISODE_01_SHOTS,
  autoStart = false,
} = {}) {
  const container = new Container();
  const stageRoot = new Container();
  const imageLayer = new Container();
  const overlayLayer = new Container();

  const fadeOverlay = new Graphics();
  fadeOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0x000000);
  fadeOverlay.alpha = 1;

  const flashOverlay = new Graphics();
  flashOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0xffffff);
  flashOverlay.alpha = 0;
  flashOverlay.visible = false;

  const imageSprite = new Sprite();
  imageSprite.anchor.set(0.5);
  imageSprite.roundPixels = true;
  imageSprite.x = CANVAS_WIDTH / 2;
  imageSprite.y = CANVAS_HEIGHT / 2;
  imageSprite.visible = false;

  const titleCardBackground = createTitleCardBackground();

  let baseCoverScale = 1;

  const speedLines = createSpeedLines();
  const captionText = createCaptionText('');
  captionText.visible = false;

  const labelText = createLabelText('');
  labelText.visible = false;

  const subtitleText = createLabelText('', 10);
  subtitleText.visible = false;
  subtitleText.y = LABEL_TOP + 22;

  const comicText = createComicText('');
  comicText.visible = false;

  imageLayer.addChild(titleCardBackground, imageSprite, speedLines);
  overlayLayer.addChild(captionText, labelText, subtitleText, comicText);
  stageRoot.addChild(imageLayer, overlayLayer);
  container.addChild(stageRoot, fadeOverlay, flashOverlay);

  const textures = new Map();
  const episodeAudio = createEpisodeAudio();
  const uniquePaths = [...new Set(shots.map((shot) => shot.assetPath).filter(Boolean))];

  await Promise.all([
    episodeAudio.preload(),
    ...uniquePaths.map(async (path) => {
      try {
        const texture = await Assets.load({
          src: path,
          data: { scaleMode: 'nearest', autoGenerateMipmaps: false },
        });
        configurePixelArtTexture(texture);
        textures.set(path, texture);
      } catch (error) {
        console.error(`[EpisodePlayer] Failed to load ${path}`, error);
      }
    }),
  ]);

  let elapsed = 0;
  let started = autoStart;
  let paused = false;
  let complete = false;
  let frozen = false;
  let loopCurrentShot = false;
  let manualShotIndex = null;
  let lastSfxShotIndex = -1;
  let onComplete = null;
  let onShotChange = null;

  const totalDuration = getEpisodeOneTotalDuration(shots);

  function getPlaybackState() {
    if (manualShotIndex !== null) {
      return {
        index: manualShotIndex,
        localTime: loopCurrentShot
          ? (elapsed % shots[manualShotIndex].duration)
          : clamp(elapsed, 0, shots[manualShotIndex].duration),
        elapsed: shots
          .slice(0, manualShotIndex)
          .reduce((sum, shot) => sum + shot.duration, 0),
      };
    }

    if (frozen) {
      const lastIndex = shots.length - 1;
      return {
        index: lastIndex,
        localTime: shots[lastIndex].duration,
        elapsed: totalDuration,
      };
    }

    return findShotIndexAtTime(elapsed, shots);
  }

  function getTransitionAlpha(shot, localTime, previousShot) {
    let alpha = 1;
    const fadeDuration = 0.35;

    if (shot.transitionIn === 'fade' && localTime < fadeDuration) {
      alpha = Math.min(alpha, localTime / fadeDuration);
    }

    if (previousShot?.transitionOut === 'fade') {
      const fadeOutStart = previousShot.duration - fadeDuration;
      if (localTime < fadeDuration) {
        alpha = Math.min(alpha, localTime / fadeDuration);
      }
    }

    return clamp(alpha, 0, 1);
  }

  function updateFlashOverlay(shot, localTime) {
    let alpha = 0;

    if (shot.transitionIn === 'flash' && localTime < 0.12) {
      alpha = 1 - localTime / 0.12;
    }

    flashOverlay.alpha = alpha;
    flashOverlay.visible = alpha > 0;
  }

  function renderTextOverlays(shot, localTime = 0) {
    let caption = '';

    if (shot.dialogue) {
      if (
        shot.secondaryDialogue &&
        shot.secondaryDialogueAt != null &&
        localTime >= shot.secondaryDialogueAt
      ) {
        caption = shot.secondaryDialogue;
      } else {
        caption = shot.dialogue;
      }
    }

    captionText.visible = Boolean(caption);
    captionText.text = caption;

    if (caption) {
      captionText.style.fontSize =
        shot.captionFontSize ?? SLIDE_TEXT_DEFAULTS.fontSize;
      captionText.style.stroke.width =
        shot.captionStrokeWidth ?? SLIDE_TEXT_DEFAULTS.strokeWidth;
      captionText.style.wordWrapWidth =
        shot.captionWordWrapWidth ?? SLIDE_TEXT_DEFAULTS.wordWrapWidth;
    }

    const showLabels = Boolean(shot.label || shot.subtitle);
    labelText.visible = Boolean(shot.label);
    subtitleText.visible = Boolean(shot.subtitle);
    labelText.text = shot.label ?? '';
    subtitleText.text = shot.subtitle ?? '';

    if (shot.type === 'episode-card' || shot.type === 'closing-card') {
      applyEpisodeCardTextStyle(labelText, subtitleText, shot.type);
    } else if (showLabels) {
      resetOverlayTextStyle(labelText, subtitleText);
      labelText.y = LABEL_TOP;
      subtitleText.y = LABEL_TOP + 22;
      labelText.style.fontSize = 13;
      subtitleText.style.fontSize = 10;
    } else {
      resetOverlayTextStyle(labelText, subtitleText);
    }

    comicText.visible = Boolean(shot.onScreenText);
    comicText.text = shot.onScreenText ?? '';
  }

  function renderShot(shot, localTime, previousShot) {
    const camera = interpolateCamera(shot, localTime);
    const shake =
      shot.visualEffect === 'shake'
        ? getShakeOffset(localTime, 4 * (1 - localTime / shot.duration))
        : { x: 0, y: 0 };

    speedLines.visible = shot.visualEffect === 'speed-lines';

    const isTitleCard =
      shot.type === 'episode-card' || shot.type === 'closing-card';
    titleCardBackground.visible = isTitleCard;

    if (!isTitleCard && shot.assetPath && textures.has(shot.assetPath)) {
      const texture = textures.get(shot.assetPath);
      if (imageSprite.texture !== texture) {
        imageSprite.texture = texture;
        baseCoverScale = Math.max(
          CANVAS_WIDTH / texture.width,
          CANVAS_HEIGHT / texture.height,
        );
      }

      imageSprite.visible = true;
      imageSprite.alpha = getTransitionAlpha(shot, localTime, previousShot);
      imageSprite.scale.set(baseCoverScale * camera.scale);
      imageSprite.x = CANVAS_WIDTH / 2 + camera.x + shake.x;
      imageSprite.y = CANVAS_HEIGHT / 2 + camera.y + shake.y;
    } else {
      imageSprite.visible = false;
    }

    renderTextOverlays(shot, localTime);
    updateFlashOverlay(shot, localTime);
    updateScreenFade(shot, localTime, previousShot);
  }

  function updateScreenFade(shot, localTime, previousShot) {
    const isEpisodeCard = shot.type === 'episode-card';

    if (isEpisodeCard) {
      const { blackHold, fadeIn } = EPISODE_CARD_CUE_CONFIG;
      const revealStart = blackHold;
      const revealEnd = blackHold + fadeIn;

      if (localTime < revealStart) {
        fadeOverlay.alpha = 1;
        titleCardBackground.alpha = 0;
        labelText.alpha = 0;
        subtitleText.alpha = 0;
      } else if (localTime < revealEnd) {
        const t = (localTime - revealStart) / fadeIn;
        fadeOverlay.alpha = 1 - t;
        titleCardBackground.alpha = t;
        labelText.alpha = t;
        subtitleText.alpha = t;
      } else {
        fadeOverlay.alpha = 0;
        titleCardBackground.alpha = 1;
        labelText.alpha = 1;
        subtitleText.alpha = 1;
      }
      return;
    }

    labelText.alpha = 1;
    subtitleText.alpha = 1;

    if (shot.transitionIn === 'fade' && localTime < 0.35) {
      fadeOverlay.alpha = 1 - localTime / 0.35;
    } else if (localTime > shot.duration - 0.35 && shot.transitionOut === 'fade') {
      fadeOverlay.alpha = (localTime - (shot.duration - 0.35)) / 0.35;
    } else {
      fadeOverlay.alpha = 0;
    }
  }

  function triggerShotSfx(shot, index) {
    if (index === lastSfxShotIndex) {
      return;
    }

    lastSfxShotIndex = index;

    if (shot.type === 'episode-card') {
      episodeAudio.playEpisodeCardCue();
    }
  }

  function update(deltaSeconds) {
    if (!started || paused || complete) {
      return;
    }

    if (!frozen && manualShotIndex === null) {
      elapsed += deltaSeconds;

      if (elapsed >= totalDuration) {
        elapsed = totalDuration;
        complete = true;
        frozen = true;
        onComplete?.();
      }
    } else if (manualShotIndex !== null && loopCurrentShot) {
      elapsed += deltaSeconds;
    } else if (manualShotIndex !== null) {
      elapsed += deltaSeconds;
      const shotDuration = shots[manualShotIndex].duration;
      if (elapsed > shotDuration) {
        elapsed = shotDuration;
      }
    }

    const { index, localTime } = getPlaybackState();
    const shot = shots[index];
    const previousShot = index > 0 ? shots[index - 1] : null;

    if (onShotChange) {
      onShotChange({ index, shot, localTime, elapsed: getEpisodeTime() });
    }

    triggerShotSfx(shot, index);

    if (shot.freezeAtEnd && localTime >= shot.duration - 0.001) {
      frozen = true;
    }

    renderShot(shot, localTime, previousShot);
  }

  function getEpisodeTime() {
    if (manualShotIndex !== null) {
      const base = shots
        .slice(0, manualShotIndex)
        .reduce((sum, shot) => sum + shot.duration, 0);
      return base + clamp(elapsed, 0, shots[manualShotIndex].duration);
    }

    return clamp(elapsed, 0, totalDuration);
  }

  function start() {
    started = true;
    paused = false;
  }

  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
  }

  function restart() {
    elapsed = 0;
    started = true;
    paused = false;
    complete = false;
    frozen = false;
    manualShotIndex = null;
    loopCurrentShot = false;
    lastSfxShotIndex = -1;
    fadeOverlay.alpha = 0;
  }

  function jumpToShot(index, { loop = false } = {}) {
    if (index < 0 || index >= shots.length) {
      return;
    }

    manualShotIndex = index;
    loopCurrentShot = loop;
    elapsed = 0;
    paused = false;
    complete = false;
    frozen = false;
    started = true;

    const shot = shots[index];
    lastSfxShotIndex = index - 1;
    renderShot(shot, 0, index > 0 ? shots[index - 1] : null);
    triggerShotSfx(shot, index);
  }

  function resumeTimeline() {
    if (manualShotIndex === null) {
      return;
    }

    const base = shots
      .slice(0, manualShotIndex)
      .reduce((sum, shot) => sum + shot.duration, 0);
    elapsed = base;
    manualShotIndex = null;
    loopCurrentShot = false;
    frozen = false;
    complete = false;
  }

  function nextShot() {
    const { index } = getPlaybackState();
    jumpToShot(Math.min(index + 1, shots.length - 1));
  }

  function previousShot() {
    const { index } = getPlaybackState();
    jumpToShot(Math.max(index - 1, 0));
  }

  function setCompleteHandler(handler) {
    onComplete = handler;
  }

  function setShotChangeHandler(handler) {
    onShotChange = handler;
  }

  function isComplete() {
    return complete;
  }

  function isPaused() {
    return paused;
  }

  function isStarted() {
    return started;
  }

  function getShots() {
    return shots;
  }

  function getTotalDuration() {
    return totalDuration;
  }

  function getCurrentShotInfo() {
    const { index, localTime } = getPlaybackState();
    return {
      index,
      shot: shots[index],
      localTime,
      episodeTime: getEpisodeTime(),
      totalDuration,
    };
  }

  function unlockAudio() {
    episodeAudio.unlock();
  }

  if (shots.length > 0) {
    renderShot(shots[0], 0, null);
  }

  return {
    container,
    update,
    start,
    pause,
    resume,
    restart,
    jumpToShot,
    resumeTimeline,
    nextShot,
    previousShot,
    setCompleteHandler,
    setShotChangeHandler,
    isComplete,
    isPaused,
    isStarted,
    getShots,
    getTotalDuration,
    getCurrentShotInfo,
    getEpisodeTime,
    unlockAudio,
  };
}
