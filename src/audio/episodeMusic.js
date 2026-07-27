/**
 * Episode shot music — starts/stops cues as shots change.
 *
 * Cues are defined in musicLibrary.js. File-based tracks (WAV) and
 * procedural scores (Web Audio) both go through this module.
 */
import { createIntroMusic } from './IntroMusic.js';
import { buildAdventureCalmMusicScore } from './adventureCalmMusicScore.js';
import { buildIntroMusicScore } from './introMusicScore.js';
import { createEpisodeMusicFileLoop } from './episodeMusicFileLoop.js';
import {
  EPISODE_MUSIC_FILE_CUES,
  EPISODE_MUSIC_PROCEDURAL_CUES,
  isSupportedEpisodeMusicCue,
} from './episodeMusicCues.js';

function buildIntroMusicScoreForCue(cue) {
  const score = buildIntroMusicScore();
  const volumeScale = EPISODE_MUSIC_PROCEDURAL_CUES[cue]?.volumeScale;

  if (volumeScale == null) {
    return score;
  }

  return {
    ...score,
    config: {
      ...score.config,
      volume: score.config.volume * volumeScale,
    },
  };
}

const PROCEDURAL_CUES = {
  'adventure-calm': () => createIntroMusic(buildAdventureCalmMusicScore()),
  /** Credits callback — same score as IntroScene, but not `intro-theme` (that label is IntroScene-only). */
  'team-theme-credits': () =>
    createIntroMusic(buildIntroMusicScoreForCue('team-theme-credits')),
};

function isSupportedCue(cue) {
  return isSupportedEpisodeMusicCue(cue);
}

function createPlayer(cue) {
  const fileCue = EPISODE_MUSIC_FILE_CUES[cue];
  if (fileCue) {
    const { src, loop = true, volume } = fileCue;
    return createEpisodeMusicFileLoop(src, volume, { loop });
  }

  if (PROCEDURAL_CUES[cue]) {
    return PROCEDURAL_CUES[cue]();
  }

  return null;
}

/** Episode music cues — procedural or pre-rendered WAV loops. */
export function createEpisodeMusic() {
  let activeCue = null;
  let activePlayer = null;
  let unlocked = false;

  function syncCue(cue) {
    const nextCue = isSupportedCue(cue) ? cue : null;

    if (!unlocked) {
      activeCue = nextCue;
      activePlayer = null;
      return;
    }

    if (nextCue === activeCue) {
      return;
    }

    activePlayer?.stop();
    activeCue = nextCue;
    activePlayer = nextCue ? createPlayer(nextCue) : null;

    if (unlocked && activePlayer) {
      if (typeof activePlayer.markUnlocked === 'function') {
        activePlayer.markUnlocked();
      } else {
        activePlayer.unlock?.();
      }
    }

    activePlayer?.play();
  }

  function unlock() {
    unlocked = true;

    if (activeCue && !activePlayer) {
      activePlayer = createPlayer(activeCue);
    }

    activePlayer?.unlock?.();

    if (activeCue && activePlayer) {
      activePlayer.play();
    }
  }

  function stop() {
    activePlayer?.stop();
    activeCue = null;
    activePlayer = null;
  }

  return {
    syncCue,
    unlock,
    stop,
  };
}
