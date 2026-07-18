/**
 * One-shot series opening cue (~12.5s at 90 BPM).
 * Wonder → curiosity → adventure → resolve. Original composition.
 */

export const SERIES_OPENING_MUSIC_CONFIG = {
  bpm: 90,
  duration: 12.5,
  volume: 0.3,
  channels: {
    melody: { type: 'square', volume: 0.1 },
    harmony: { type: 'triangle', volume: 0.09 },
    pulse: { type: 'square', volume: 0.05 },
    bass: { type: 'triangle', volume: 0.17 },
    drum: { volume: 0.045 },
  },
};

/** Soft square lead — sparse at first, then builds. */
export const SERIES_OPENING_MELODY = [
  // 0–4s: wonder
  { beat: 0, pitch: 'E4', beats: 2.5 },
  { beat: 3, pitch: 'A4', beats: 1.5 },
  { beat: 5, pitch: 'G4', beats: 1.5 },

  // 4–8s: curiosity
  { beat: 6.5, pitch: 'C5', beats: 1 },
  { beat: 7.5, pitch: 'B4', beats: 1 },
  { beat: 8.5, pitch: 'A4', beats: 1.5 },
  { beat: 10, pitch: 'G4', beats: 1 },
  { beat: 11, pitch: 'A4', beats: 1 },

  // 8–12s: adventure
  { beat: 12, pitch: 'C5', beats: 0.75 },
  { beat: 12.75, pitch: 'E5', beats: 0.75 },
  { beat: 13.5, pitch: 'G5', beats: 1 },
  { beat: 14.5, pitch: 'E5', beats: 1 },
  { beat: 15.5, pitch: 'C5', beats: 1.5 },

  // 12–12.5s: resolve — hopeful sustained tone for title handoff
  { beat: 17, pitch: 'E5', beats: 2.5 },
];

/** Triangle pads — Am warmth shifting to major as Meow City appears. */
export const SERIES_OPENING_HARMONY = [
  { beat: 0, pitch: 'A3', beats: 6 },
  { beat: 6, pitch: 'F3', beats: 4 },
  { beat: 10, pitch: 'C3', beats: 4 },
  { beat: 14, pitch: 'G3', beats: 3 },
  { beat: 17, pitch: 'C4', beats: 2.5 },
];

/** Light pulse-wave fifths — enter mid cue. */
export const SERIES_OPENING_PULSE = [
  { beat: 6, pitch: 'E4', beats: 0.45 },
  { beat: 7, pitch: 'C4', beats: 0.45 },
  { beat: 8, pitch: 'G3', beats: 0.45 },
  { beat: 9, pitch: 'G3', beats: 0.45 },
  { beat: 12, pitch: 'D4', beats: 0.45 },
  { beat: 13, pitch: 'D4', beats: 0.45 },
  { beat: 14, pitch: 'D4', beats: 0.45 },
  { beat: 15, pitch: 'D4', beats: 0.45 },
  { beat: 17, pitch: 'G4', beats: 1.5 },
];

/** Gentle triangle bass roots. */
export const SERIES_OPENING_BASS = [
  { beat: 0, pitch: 'A2', beats: 3 },
  { beat: 3, pitch: 'E2', beats: 3 },
  { beat: 6, pitch: 'F2', beats: 4 },
  { beat: 10, pitch: 'C2', beats: 4 },
  { beat: 14, pitch: 'G2', beats: 3 },
  { beat: 17, pitch: 'C2', beats: 2.5 },
];

/** Subtle noise-channel percussion — only in the final build. */
export const SERIES_OPENING_DRUMS = [
  { beat: 12, kind: 'hat' },
  { beat: 13, kind: 'hat' },
  { beat: 14, kind: 'hat' },
  { beat: 15, kind: 'hat' },
  { beat: 16, kind: 'hat' },
  { beat: 17, kind: 'hat' },
  { beat: 18, kind: 'hat' },
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

function drumPatternToNotes(pattern, bpm) {
  return pattern.map((entry) => ({
    channel: 'drum',
    start: beatToSeconds(entry.beat, bpm),
    duration: entry.kind === 'snare' ? 0.12 : 0.06,
    kind: entry.kind,
  }));
}

export function buildSeriesOpeningMusicScore() {
  const { bpm } = SERIES_OPENING_MUSIC_CONFIG;

  return {
    config: SERIES_OPENING_MUSIC_CONFIG,
    notes: [
      ...patternToNotes(SERIES_OPENING_MELODY, 'melody', bpm),
      ...patternToNotes(SERIES_OPENING_HARMONY, 'harmony', bpm),
      ...patternToNotes(SERIES_OPENING_PULSE, 'pulse', bpm),
      ...patternToNotes(SERIES_OPENING_BASS, 'bass', bpm),
      ...drumPatternToNotes(SERIES_OPENING_DRUMS, bpm),
    ],
  };
}
