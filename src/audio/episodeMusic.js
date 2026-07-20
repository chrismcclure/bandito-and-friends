import { createIntroMusic } from './IntroMusic.js';
import { buildAdventureCalmMusicScore } from './adventureCalmMusicScore.js';
import {
  buildIntroMusicScore,
} from './introMusicScore.js';
import {
  createEpisodeMusicFileLoop,
  EPISODE_MUSIC_FILE_VOLUME,
} from './episodeMusicFileLoop.js';

const PROCEDURAL_CUES = {
  'adventure-calm': () => createIntroMusic(buildAdventureCalmMusicScore()),
  /** Credits callback — same score as IntroScene, but not `intro-theme` (that label is IntroScene-only). */
  'team-theme-credits': () => createIntroMusic(buildIntroMusicScore()),
};

const FILE_CUES = {
  'sock-monster-battle': { src: '/audio/music/sock-monster-battle.wav' },
  'living-room-reveal-1': { src: '/audio/music/living-room-reveal-1.wav' },
  'heroes-victory-1': {
    src: '/audio/music/heroes-victory-1.wav',
    loop: false,
  },
};

function isSupportedCue(cue) {
  return Boolean(cue && (PROCEDURAL_CUES[cue] || FILE_CUES[cue]));
}

function createPlayer(cue) {
  if (FILE_CUES[cue]) {
    const { src, loop = true } = FILE_CUES[cue];
    return createEpisodeMusicFileLoop(src, EPISODE_MUSIC_FILE_VOLUME, { loop });
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
