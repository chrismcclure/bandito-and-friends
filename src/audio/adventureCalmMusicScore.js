/**
 * Upbeat cartoon adventure theme for shots 05a–06a (episode beats 6–9).
 * SNES-style overworld energy — catchy hook, bouncing bass, light drums.
 */

export const ADVENTURE_CALM_MUSIC_CONFIG = {
  bpm: 152,
  /** 16-beat seamless loop (~6.3s). */
  loopDuration: (16 * 60) / 152,
  volume: 0.52,
  channels: {
    melody1: { type: 'square', volume: 0.14 },
    melody2: { type: 'square', volume: 0.09 },
    bass: { type: 'triangle', volume: 0.19 },
    drum: { volume: 0.065 },
  },
};

/** Bright square-wave hook — grabs attention from beat zero. */
export const ADVENTURE_CALM_MELODY1 = [
  { beat: 0, pitch: 'C5', beats: 0.25 },
  { beat: 0.25, pitch: 'E5', beats: 0.25 },
  { beat: 0.5, pitch: 'G5', beats: 0.5 },
  { beat: 1, pitch: 'C6', beats: 0.5 },
  { beat: 1.5, pitch: 'G5', beats: 0.25 },
  { beat: 1.75, pitch: 'E5', beats: 0.25 },
  { beat: 2, pitch: 'C5', beats: 0.5 },
  { beat: 2.5, pitch: 'D5', beats: 0.5 },
  { beat: 3, pitch: 'E5', beats: 0.5 },
  { beat: 3.5, pitch: 'G5', beats: 0.5 },
  { beat: 4, pitch: 'A5', beats: 1 },
  { beat: 5, pitch: 'G5', beats: 0.5 },
  { beat: 5.5, pitch: 'E5', beats: 0.5 },
  { beat: 6, pitch: 'C5', beats: 1 },
  { beat: 7, pitch: 'G4', beats: 0.5 },
  { beat: 7.5, pitch: 'A4', beats: 0.5 },
  { beat: 8, pitch: 'C5', beats: 0.5 },
  { beat: 8.5, pitch: 'E5', beats: 0.5 },
  { beat: 9, pitch: 'G5', beats: 1 },
  { beat: 10, pitch: 'F5', beats: 0.5 },
  { beat: 10.5, pitch: 'E5', beats: 0.5 },
  { beat: 11, pitch: 'D5', beats: 1 },
  { beat: 12, pitch: 'E5', beats: 0.5 },
  { beat: 12.5, pitch: 'G5', beats: 0.5 },
  { beat: 13, pitch: 'A5', beats: 0.5 },
  { beat: 13.5, pitch: 'G5', beats: 0.5 },
  { beat: 14, pitch: 'E5', beats: 0.5 },
  { beat: 14.5, pitch: 'D5', beats: 0.5 },
  { beat: 15, pitch: 'C5', beats: 0.5 },
];

/** Pulse-wave countermelody and harmony stabs. */
export const ADVENTURE_CALM_MELODY2 = [
  { beat: 0.5, pitch: 'G4', beats: 0.25 },
  { beat: 1.5, pitch: 'E4', beats: 0.25 },
  { beat: 2.5, pitch: 'G4', beats: 0.25 },
  { beat: 3.5, pitch: 'C5', beats: 0.25 },
  { beat: 4.5, pitch: 'E4', beats: 0.5 },
  { beat: 5.5, pitch: 'C4', beats: 0.5 },
  { beat: 6.5, pitch: 'G4', beats: 0.5 },
  { beat: 7.5, pitch: 'E4', beats: 0.5 },
  { beat: 8.5, pitch: 'G4', beats: 0.25 },
  { beat: 9.5, pitch: 'C5', beats: 0.25 },
  { beat: 10.5, pitch: 'A4', beats: 0.25 },
  { beat: 11.5, pitch: 'F4', beats: 0.25 },
  { beat: 12.5, pitch: 'G4', beats: 0.5 },
  { beat: 13.5, pitch: 'E4', beats: 0.5 },
  { beat: 14.5, pitch: 'C4', beats: 0.5 },
];

/** Bouncing triangle bass. */
export const ADVENTURE_CALM_BASS = [
  { beat: 0, pitch: 'C3', beats: 0.5 },
  { beat: 0.5, pitch: 'G2', beats: 0.5 },
  { beat: 1, pitch: 'C3', beats: 0.5 },
  { beat: 1.5, pitch: 'E3', beats: 0.5 },
  { beat: 2, pitch: 'G2', beats: 0.5 },
  { beat: 2.5, pitch: 'C3', beats: 0.5 },
  { beat: 3, pitch: 'E3', beats: 0.5 },
  { beat: 3.5, pitch: 'G3', beats: 0.5 },
  { beat: 4, pitch: 'A2', beats: 0.5 },
  { beat: 4.5, pitch: 'E3', beats: 0.5 },
  { beat: 5, pitch: 'A2', beats: 0.5 },
  { beat: 5.5, pitch: 'C3', beats: 0.5 },
  { beat: 6, pitch: 'G2', beats: 0.5 },
  { beat: 6.5, pitch: 'C3', beats: 0.5 },
  { beat: 7, pitch: 'E2', beats: 0.5 },
  { beat: 7.5, pitch: 'G2', beats: 0.5 },
  { beat: 8, pitch: 'C3', beats: 0.5 },
  { beat: 8.5, pitch: 'G2', beats: 0.5 },
  { beat: 9, pitch: 'C3', beats: 0.5 },
  { beat: 9.5, pitch: 'E3', beats: 0.5 },
  { beat: 10, pitch: 'F2', beats: 0.5 },
  { beat: 10.5, pitch: 'C3', beats: 0.5 },
  { beat: 11, pitch: 'G2', beats: 0.5 },
  { beat: 11.5, pitch: 'B2', beats: 0.5 },
  { beat: 12, pitch: 'C3', beats: 0.5 },
  { beat: 12.5, pitch: 'G2', beats: 0.5 },
  { beat: 13, pitch: 'A2', beats: 0.5 },
  { beat: 13.5, pitch: 'E3', beats: 0.5 },
  { beat: 14, pitch: 'F2', beats: 0.5 },
  { beat: 14.5, pitch: 'G2', beats: 0.5 },
  { beat: 15, pitch: 'C3', beats: 0.5 },
];

/** Light retro percussion. */
export const ADVENTURE_CALM_DRUMS = [
  { beat: 0, kind: 'snare' },
  { beat: 1, kind: 'hat' },
  { beat: 1.5, kind: 'hat' },
  { beat: 2, kind: 'snare' },
  { beat: 3, kind: 'hat' },
  { beat: 3.5, kind: 'hat' },
  { beat: 4, kind: 'snare' },
  { beat: 5, kind: 'hat' },
  { beat: 5.5, kind: 'hat' },
  { beat: 6, kind: 'snare' },
  { beat: 7, kind: 'hat' },
  { beat: 7.5, kind: 'hat' },
  { beat: 8, kind: 'snare' },
  { beat: 9, kind: 'hat' },
  { beat: 9.5, kind: 'hat' },
  { beat: 10, kind: 'snare' },
  { beat: 11, kind: 'hat' },
  { beat: 11.5, kind: 'hat' },
  { beat: 12, kind: 'snare' },
  { beat: 13, kind: 'hat' },
  { beat: 13.5, kind: 'hat' },
  { beat: 14, kind: 'snare' },
  { beat: 15, kind: 'hat' },
  { beat: 15.5, kind: 'hat' },
];

function beatPatternToNotes(pattern, channel, config) {
  const beatSec = 60 / config.bpm;

  return pattern.map((entry) => ({
    channel,
    start: entry.beat * beatSec,
    duration: entry.beats * beatSec * 0.92,
    pitch: entry.pitch,
  }));
}

function beatDrumsToNotes(pattern, config) {
  const beatSec = 60 / config.bpm;

  return pattern.map((entry) => ({
    channel: 'drum',
    start: entry.beat * beatSec,
    duration: entry.kind === 'snare' ? beatSec * 0.12 : beatSec * 0.06,
    kind: entry.kind,
  }));
}

export function buildAdventureCalmMusicScore(config = ADVENTURE_CALM_MUSIC_CONFIG) {
  return {
    config,
    notes: [
      ...beatPatternToNotes(ADVENTURE_CALM_MELODY1, 'melody1', config),
      ...beatPatternToNotes(ADVENTURE_CALM_MELODY2, 'melody2', config),
      ...beatPatternToNotes(ADVENTURE_CALM_BASS, 'bass', config),
      ...beatDrumsToNotes(ADVENTURE_CALM_DRUMS, config),
    ],
  };
}
