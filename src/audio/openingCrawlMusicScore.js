/**
 * Gentle NES-style opening crawl music.
 * One-shot ~14s — warm, curious, hopeful. No percussion.
 */

export const OPENING_CRAWL_MUSIC_CONFIG = {
  bpm: 88,
  duration: 14,
  volume: 0.28,
  channels: {
    melody: { type: 'square', volume: 0.11 },
    harmony: { type: 'triangle', volume: 0.08 },
    bass: { type: 'triangle', volume: 0.16 },
  },
};

/** Times in beats at 88 BPM. */
export const OPENING_CRAWL_MELODY = [
  { beat: 0, pitch: 'E4', beats: 1.5 },
  { beat: 2, pitch: 'G4', beats: 1 },
  { beat: 3.5, pitch: 'A4', beats: 1.5 },
  { beat: 5.5, pitch: 'B4', beats: 1 },
  { beat: 7, pitch: 'C5', beats: 2 },
  { beat: 9.5, pitch: 'B4', beats: 1 },
  { beat: 11, pitch: 'A4', beats: 1.5 },
  { beat: 13, pitch: 'G4', beats: 1.5 },
  { beat: 15, pitch: 'E4', beats: 2 },
  { beat: 18, pitch: 'A4', beats: 1.5 },
  { beat: 20, pitch: 'C5', beats: 2.5 },
];

export const OPENING_CRAWL_HARMONY = [
  { beat: 0, pitch: 'C3', beats: 4 },
  { beat: 4, pitch: 'G3', beats: 4 },
  { beat: 8, pitch: 'A3', beats: 4 },
  { beat: 12, pitch: 'E3', beats: 4 },
  { beat: 16, pitch: 'F3', beats: 4 },
  { beat: 20, pitch: 'C3', beats: 4 },
];

export const OPENING_CRAWL_BASS = [
  { beat: 0, pitch: 'C2', beats: 2 },
  { beat: 2, pitch: 'G2', beats: 2 },
  { beat: 4, pitch: 'A2', beats: 2 },
  { beat: 6, pitch: 'E2', beats: 2 },
  { beat: 8, pitch: 'F2', beats: 2 },
  { beat: 10, pitch: 'C2', beats: 2 },
  { beat: 12, pitch: 'G2', beats: 2 },
  { beat: 14, pitch: 'A2', beats: 2 },
  { beat: 16, pitch: 'E2', beats: 2 },
  { beat: 18, pitch: 'F2', beats: 2 },
  { beat: 20, pitch: 'C2', beats: 4 },
];

function beatToSeconds(beat, bpm) {
  return (beat * 60) / bpm;
}

function patternToNotes(pattern, channel, bpm) {
  return pattern.map((entry) => ({
    channel,
    start: beatToSeconds(entry.beat, bpm),
    duration: beatToSeconds(entry.beats, bpm),
    pitch: entry.pitch,
  }));
}

export function buildOpeningCrawlMusicScore() {
  const { bpm } = OPENING_CRAWL_MUSIC_CONFIG;

  return {
    config: OPENING_CRAWL_MUSIC_CONFIG,
    notes: [
      ...patternToNotes(OPENING_CRAWL_MELODY, 'melody', bpm),
      ...patternToNotes(OPENING_CRAWL_HARMONY, 'harmony', bpm),
      ...patternToNotes(OPENING_CRAWL_BASS, 'bass', bpm),
    ],
  };
}
