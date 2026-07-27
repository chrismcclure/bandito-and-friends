import { EPISODE_MUSIC_FILE_VOLUME } from './episodeMusicFileLoop.js';

/** File-based episode music cues (paths relative to /public). */
export const EPISODE_MUSIC_FILE_CUES = {
  'sock-monster-battle': {
    src: '/audio/music/sock-monster-battle.wav',
    loop: true,
    volume: EPISODE_MUSIC_FILE_VOLUME * 0.9,
  },
  'living-room-reveal-1': {
    src: '/audio/music/living-room-reveal-1.wav',
    loop: true,
    volume: EPISODE_MUSIC_FILE_VOLUME,
  },
  'heroes-victory-1': {
    src: '/audio/music/heroes-victory-1.wav',
    loop: false,
    volume: EPISODE_MUSIC_FILE_VOLUME,
  },
};

/** Procedural episode music cues rendered offline for export. */
export const EPISODE_MUSIC_PROCEDURAL_CUES = {
  'intro-theme': {
    scoreModule: 'introMusicScore.js',
    buildScore: 'buildIntroMusicScore',
    loop: true,
  },
  'series-opening-music': {
    scoreModule: 'seriesOpeningMusicScore.js',
    buildScore: 'buildSeriesOpeningMusicScore',
    loop: false,
  },
  'adventure-calm': {
    scoreModule: 'adventureCalmMusicScore.js',
    buildScore: 'buildAdventureCalmMusicScore',
    loop: true,
  },
  'team-theme-credits': {
    scoreModule: 'introMusicScore.js',
    buildScore: 'buildIntroMusicScore',
    loop: true,
  },
};

/** intro-theme is handled by IntroScene in the full show, not EpisodePlayer music. */
export function isSupportedEpisodeMusicCue(cue) {
  return Boolean(
    cue &&
      (EPISODE_MUSIC_FILE_CUES[cue] || EPISODE_MUSIC_PROCEDURAL_CUES[cue]),
  );
}

/** Episode shot music for offline full-show export (excludes intro-theme). */
export function isFullShowExportMusicCue(cue) {
  return isSupportedEpisodeMusicCue(cue) && cue !== 'intro-theme';
}

export function getEpisodeMusicCueKind(cue) {
  if (EPISODE_MUSIC_FILE_CUES[cue]) {
    return 'file';
  }

  if (EPISODE_MUSIC_PROCEDURAL_CUES[cue]) {
    return 'procedural';
  }

  return null;
}
