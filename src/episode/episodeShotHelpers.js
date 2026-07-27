/**
 * Shared helpers for any episode shot list.
 * Episode-specific data lives in src/data/episodes/.
 */

/**
 * @typedef {'cut' | 'fade' | 'flash'} EpisodeTransition
 * @typedef {'static' | 'push-in' | 'push-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down' | 'slow-zoom'} EpisodeCameraMovement
 * @typedef {'none' | 'shake' | 'speed-lines'} EpisodeVisualEffect
 *
 * @typedef {Object} EpisodeShot
 * @property {string} id
 * @property {string} title
 * @property {'image' | 'episode-card' | 'closing-card'} type
 * @property {string} [assetPath]
 * @property {number} duration
 * @property {EpisodeTransition} transitionIn
 * @property {EpisodeTransition} transitionOut
 * @property {EpisodeCameraMovement} cameraMovement
 * @property {number} cameraScaleStart
 * @property {number} cameraScaleEnd
 * @property {{ x: number, y: number }} cameraPositionStart
 * @property {{ x: number, y: number }} cameraPositionEnd
 * @property {string} [dialogue]
 * @property {string} [dialogueTop]
 * @property {{ text: string, at: number }[]} [dialogueSections]
 * @property {'top' | 'bottom'} [captionPosition]
 * @property {string} [secondaryDialogue]
 * @property {number} [secondaryDialogueAt]
 * @property {number} [captionFontSize]
 * @property {number} [captionStrokeWidth]
 * @property {number} [captionWordWrapWidth]
 * @property {number} [captionBottomOffset]
 * @property {number} [captionTopOffset]
 * @property {boolean} [captionItalic]
 * @property {string} [onScreenText]
 * @property {string} [subtitle]
 * @property {string} [label]
 * @property {string} [musicCue]
 * @property {EpisodeVisualEffect} visualEffect
 * @property {number} [shakeIntensity]
 * @property {boolean} [freezeAtEnd]
 * @property {string} [notes]
 * @property {'placeholder' | 'final'} [status]
 * @property {'cover' | 'contain' | 'balanced'} [imageFit]
 * @property {number} [imageFitCoverage]
 * @property {number} [imageFitZoom]
 * @property {number} [imageFitZoomStart]
 * @property {number} [imageFitZoomEnd]
 * @property {number} [imageFitOffsetX]
 * @property {number} [imageFitOffsetY]
 * @property {number} [imageFitFocalX]
 * @property {number} [imageFitFocalY]
 * @property {'left-to-right' | 'right-to-left' | 'left' | 'right'} [imageFitSlide]
 * @property {number} [imageFitSlideAmount]
 * @property {'left' | 'center' | 'right'} [imageFitSlideAlign]
 * @property {number} [imageFitSlideCropStart]
 * @property {number} [imageFitSlideCropEnd]
 * @property {number} [imageFitSlideDuration]
 * @property {number} [flashAt]
 * @property {string} [sfx]
 * @property {number} [sfxAt]
 * @property {number} [imageFitRotateStart]
 * @property {number} [imageFitRotateEnd]
 * @property {number} [imageFitRotateDuration]
 */

/**
 * @typedef {Object} EpisodeShotDefaults
 * @property {number} assembleShotIndex
 * @property {number} landscapeFitFromShotIndex
 * @property {number} balancedFitFromShotIndex
 * @property {number} storyStartShotIndex
 * @property {Record<string, unknown>} landscapeFit
 * @property {number} captionBottomOffset
 */

/**
 * @typedef {Object} EpisodeConfig
 * @property {string} id
 * @property {number} number
 * @property {string} title
 * @property {string} exportId
 * @property {string} storyFile
 * @property {string} assetBase
 * @property {string} finalsBase
 * @property {{ TITLE_HOLD: number }} introTiming
 * @property {number} meetTheTeamShotCount
 * @property {number} episodeCardShotIndex
 * @property {EpisodeShot[]} shots
 * @property {EpisodeShotDefaults} shotDefaults
 */

/** Apply per-episode framing rules (landscape fit, caption offsets) to raw shot data. */
export function applyEpisodeShotDefaults(rawShots, defaults) {
  const {
    assembleShotIndex,
    landscapeFitFromShotIndex,
    balancedFitFromShotIndex,
    storyStartShotIndex,
    landscapeFit,
    captionBottomOffset,
  } = defaults;

  return rawShots.map((shot, index) => {
    if (shot.type !== 'image') {
      return shot;
    }

    let next = shot;

    if (
      index === assembleShotIndex ||
      index >= landscapeFitFromShotIndex
    ) {
      next = { ...landscapeFit, ...shot };
    } else if (index >= balancedFitFromShotIndex) {
      next = { ...shot, imageFit: shot.imageFit ?? 'balanced' };
    }

    if (index >= storyStartShotIndex && next.dialogue) {
      next = {
        ...next,
        captionBottomOffset:
          next.captionBottomOffset ?? captionBottomOffset,
      };
    }

    return next;
  });
}

/** Sum of all shot durations — total episode runtime in seconds. */
export function getEpisodeTotalDuration(shots) {
  return shots.reduce((total, shot) => total + shot.duration, 0);
}

/** Returns the global start time (seconds) for each shot index. */
export function getEpisodeShotStarts(shots) {
  const starts = [];
  let elapsed = 0;

  for (const shot of shots) {
    starts.push(elapsed);
    elapsed += shot.duration;
  }

  return starts;
}

/** Map a global episode time to { index, localTime, elapsed }. */
export function findShotIndexAtTime(time, shots) {
  let elapsed = 0;

  for (let index = 0; index < shots.length; index += 1) {
    const shot = shots[index];
    if (time < elapsed + shot.duration) {
      return { index, localTime: time - elapsed, elapsed };
    }
    elapsed += shot.duration;
  }

  const lastIndex = shots.length - 1;
  return {
    index: lastIndex,
    localTime: shots[lastIndex].duration,
    elapsed: elapsed - shots[lastIndex].duration,
  };
}

/** Intro theme covers title hold + Meet the Team shots before the episode card. */
export function getIntroThemeDuration(episode) {
  const meetTheTeamDuration = episode.shots
    .slice(0, episode.meetTheTeamShotCount)
    .reduce((total, shot) => total + shot.duration, 0);

  return episode.introTiming.TITLE_HOLD + meetTheTeamDuration;
}
