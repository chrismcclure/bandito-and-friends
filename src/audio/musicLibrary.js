/**
 * Music cue registry — series-wide vs episode-specific tracks.
 *
 * Reference cue IDs from shot data via musicCue: 'adventure-calm'.
 * Series cues work in any episode; file cues are tagged with episode id.
 */
import { EPISODE_MUSIC_FILE_VOLUME } from './episodeMusicFileLoop.js';

/**
 * Series-wide procedural music — reuse these cue IDs in any episode shot list.
 * Add new series cues here when a track should be available across episodes.
 */
export const SERIES_PROCEDURAL_CUES = {
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
    /** Applied on top of the baked WAV in export; scales master gain in browser. */
    volumeScale: 0.792,
  },
};

/**
 * Episode-specific file-based music — add new entries when an episode needs
 * a unique track. Reference the cue ID from that episode's shot list via musicCue.
 */
export const EPISODE_FILE_CUES = {
  'sock-monster-battle': {
    src: '/audio/music/sock-monster-battle.wav',
    loop: true,
    volume: EPISODE_MUSIC_FILE_VOLUME * 0.9,
    episode: 'episode-01',
  },
  'living-room-reveal-1': {
    src: '/audio/music/living-room-reveal-1.wav',
    loop: true,
    volume: EPISODE_MUSIC_FILE_VOLUME,
    episode: 'episode-01',
  },
  'heroes-victory-1': {
    src: '/audio/music/heroes-victory-1.wav',
    loop: false,
    volume: EPISODE_MUSIC_FILE_VOLUME,
    episode: 'episode-01',
  },
};

/** @deprecated Use SERIES_PROCEDURAL_CUES */
export const EPISODE_MUSIC_PROCEDURAL_CUES = SERIES_PROCEDURAL_CUES;

/** @deprecated Use EPISODE_FILE_CUES */
export const EPISODE_MUSIC_FILE_CUES = EPISODE_FILE_CUES;

export function listMusicCuesForEpisode(episodeId) {
  const fileCues = Object.fromEntries(
    Object.entries(EPISODE_FILE_CUES).filter(
      ([, cue]) => !cue.episode || cue.episode === episodeId,
    ),
  );

  return {
    procedural: SERIES_PROCEDURAL_CUES,
    file: fileCues,
  };
}
