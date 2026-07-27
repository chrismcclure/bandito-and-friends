/**
 * Re-exports music cue lookups for playback and export.
 * See musicLibrary.js for the actual cue definitions.
 */
import {
  EPISODE_FILE_CUES,
  SERIES_PROCEDURAL_CUES,
} from './musicLibrary.js';

/** File-based episode music cues (paths relative to /public). */
export const EPISODE_MUSIC_FILE_CUES = EPISODE_FILE_CUES;

/** Procedural episode music cues rendered offline for export. */
export const EPISODE_MUSIC_PROCEDURAL_CUES = SERIES_PROCEDURAL_CUES;

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
