/**
 * Recurring Episode Title Card sound cue (~2s).
 * Silence → airy whoosh → three descending square notes → soft shimmer.
 * Original composition for the Bandito and Friends series identity.
 */

export const EPISODE_CARD_CUE_CONFIG = {
  duration: 2,
  volume: 0.3,
  blackHold: 0.25,
  fadeIn: 0.35,
  channels: {
    melody: { type: 'square', volume: 0.11 },
    harmony: { type: 'triangle', volume: 0.055 },
    shimmer: { type: 'square', volume: 0.035 },
    whoosh: { volume: 0.09 },
  },
};

/** Three gentle descending square-wave notes after the whoosh. */
export const EPISODE_CARD_MELODY = [
  { start: 0.58, pitch: 'E5', duration: 0.3 },
  { start: 0.96, pitch: 'C5', duration: 0.26 },
  { start: 1.3, pitch: 'A4', duration: 0.24 },
];

/** Soft triangle support beneath each melody note. */
export const EPISODE_CARD_HARMONY = [
  { start: 0.58, pitch: 'E4', duration: 0.34 },
  { start: 0.96, pitch: 'C4', duration: 0.3 },
  { start: 1.3, pitch: 'A3', duration: 0.28 },
];

/** Tiny digital sparkle trailing off after the third note. */
export const EPISODE_CARD_SHIMMER = [
  { start: 1.58, pitch: 'E6', duration: 0.07 },
  { start: 1.68, pitch: 'C6', duration: 0.07 },
  { start: 1.76, pitch: 'G5', duration: 0.09 },
  { start: 1.84, pitch: 'E5', duration: 0.16 },
];

export const EPISODE_CARD_WHOOSH = {
  start: 0.25,
  duration: 0.42,
};

export function buildEpisodeCardCueScore() {
  return {
    config: EPISODE_CARD_CUE_CONFIG,
    whoosh: EPISODE_CARD_WHOOSH,
    notes: [
      ...EPISODE_CARD_MELODY.map((note) => ({ ...note, channel: 'melody' })),
      ...EPISODE_CARD_HARMONY.map((note) => ({ ...note, channel: 'harmony' })),
      ...EPISODE_CARD_SHIMMER.map((note) => ({ ...note, channel: 'shimmer' })),
    ],
  };
}
