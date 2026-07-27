import {
  TITLE_MENU_TIMING,
} from '../data/title-menu-timing.js';
import { NES_PIXEL_LOAD_TIMING } from '../transitions/nesPixelLoadTransition.js';
import {
  buildFullSequenceBeats,
  getFullSequenceTotalDuration,
  getTitleMenuEndTime,
} from '../dev/fullSequenceTimeline.js';
import { TITLE_MENU_AUDIO_VOLUMES } from '../scenes/TitleMenuAudio.js';
import { EPISODE_SHOT_SFX_VOLUME } from '../audio/episodeShotSfx.js';
import { isFullShowExportMusicCue } from '../audio/episodeMusicCues.js';
import {
  EPISODE_01_SHOTS,
  EPISODE_01_EPISODE_CARD_SHOT_INDEX,
} from '../data/episode-01-shots.js';
import { INTRO_AUDIO_VOLUMES } from '../scenes/IntroAudio.js';

function getBeatStartTimes(beats) {
  const starts = [];
  let elapsed = 0;

  for (const beat of beats) {
    starts.push(elapsed);
    elapsed += beat.duration;
  }

  return starts;
}

function findBeatStart(beats, predicate) {
  let elapsed = 0;

  for (let index = 0; index < beats.length; index += 1) {
    if (predicate(beats[index], index)) {
      return elapsed;
    }

    elapsed += beats[index].duration;
  }

  return null;
}

/**
 * Full-show audio timeline on the master clock (title menu → episode end).
 * Matches browser playback in the default full-sequence route.
 */
export function buildFullShowAudioTimeline(
  beats = buildFullSequenceBeats(),
  totalDuration = getFullSequenceTotalDuration(beats),
) {
  const musicSegments = [];
  const oneShots = [];

  const titleMenuEnd = getTitleMenuEndTime(beats);
  const pixelLoadStart = titleMenuEnd;
  const seriesMusicStart =
    pixelLoadStart +
    NES_PIXEL_LOAD_TIMING.FLASH_DURATION +
    NES_PIXEL_LOAD_TIMING.BLOCK_HOLD_DURATION +
    NES_PIXEL_LOAD_TIMING.DISSOLVE_DURATION *
      NES_PIXEL_LOAD_TIMING.MUSIC_REVEAL_THRESHOLD;

  const introTitleStart = findBeatStart(
    beats,
    (beat) => beat.section === 'intro-title',
  );
  const introThemeEnd = findBeatStart(
    beats,
    (beat) =>
      beat.section === 'episode' &&
      beat.shotIndex === EPISODE_01_EPISODE_CARD_SHOT_INDEX,
  );
  const episodeSectionStart = findBeatStart(
    beats,
    (beat) => beat.section === 'episode',
  );

  const titleMenuCursorTimes = [
    TITLE_MENU_TIMING.START_SELECTED_HOLD,
    TITLE_MENU_TIMING.START_SELECTED_HOLD +
      TITLE_MENU_TIMING.RUN_AWAY_SELECTED_HOLD,
  ];
  const titleMenuStartSoundTime =
    TITLE_MENU_TIMING.START_SELECTED_HOLD +
    TITLE_MENU_TIMING.RUN_AWAY_SELECTED_HOLD +
    TITLE_MENU_TIMING.FINAL_START_SELECTED_HOLD;

  for (const startSec of titleMenuCursorTimes) {
    oneShots.push({
      type: 'title-menu-sfx',
      soundId: 'menuCursor',
      startSec,
      volume: TITLE_MENU_AUDIO_VOLUMES.menuCursor,
    });
  }

  oneShots.push({
    type: 'title-menu-sfx',
    soundId: 'startSelected',
    startSec: titleMenuStartSoundTime,
    volume: TITLE_MENU_AUDIO_VOLUMES.startSelected,
  });

  oneShots.push({
    type: 'intro-sfx',
    soundId: 'titleReveal',
    startSec: introTitleStart,
    volume: INTRO_AUDIO_VOLUMES.titleReveal,
  });

  musicSegments.push({
    type: 'music',
    cue: 'series-opening-music',
    startSec: seriesMusicStart,
    endSec: introTitleStart,
    fadeOutSec: 0.5,
  });

  musicSegments.push({
    type: 'music',
    cue: 'intro-theme',
    startSec: introTitleStart,
    endSec: introThemeEnd,
    loop: true,
  });

  let episodeShotStart = episodeSectionStart;
  let activeCue = null;
  let segmentStart = episodeSectionStart;

  for (let index = 0; index < EPISODE_01_SHOTS.length; index += 1) {
    const shot = EPISODE_01_SHOTS[index];
    const nextCue = isFullShowExportMusicCue(shot.musicCue)
      ? shot.musicCue
      : null;

    if (index === 0) {
      activeCue = nextCue;
      segmentStart = episodeShotStart;
    } else if (nextCue !== activeCue) {
      if (activeCue) {
        musicSegments.push({
          type: 'music',
          cue: activeCue,
          startSec: segmentStart,
          endSec: episodeShotStart,
        });
      }

      activeCue = nextCue;
      segmentStart = episodeShotStart;
    }

    if (shot.type === 'episode-card') {
      oneShots.push({
        type: 'episode-card-cue',
        startSec: episodeShotStart,
      });
    }

    if (shot.sfx && shot.sfxAt != null) {
      oneShots.push({
        type: 'sfx',
        soundId: shot.sfx,
        startSec: episodeShotStart + shot.sfxAt,
        volume: EPISODE_SHOT_SFX_VOLUME,
      });
    }

    episodeShotStart += shot.duration;
  }

  if (activeCue) {
    musicSegments.push({
      type: 'music',
      cue: activeCue,
      startSec: segmentStart,
      endSec: totalDuration,
    });
  }

  return {
    totalDuration,
    musicSegments,
    oneShots,
    markers: {
      titleMenuEnd,
      seriesMusicStart,
      introTitleStart,
      introThemeEnd,
      episodeSectionStart,
    },
  };
}

export function getFullShowTestRanges() {
  const beats = buildFullSequenceBeats();
  const shotTenEnd =
    findBeatStart(beats, (beat) => beat.section === 'episode' && beat.shotIndex === 10) +
    EPISODE_01_SHOTS[10].duration;

  return {
    openingThroughShotTen: {
      startSec: 0,
      endSec: shotTenEnd,
      label: 'Title menu through episode shot 10',
    },
    performanceSample: {
      startSec: 28,
      endSec: 38,
      label: '10s sample with card, music change, patrol, subtitles',
    },
    subtitleSafeArea: {
      startSec: 4,
      endSec: 40,
      label: 'Dialogue-heavy sample (opening + patrol + story subtitles)',
    },
  };
}
