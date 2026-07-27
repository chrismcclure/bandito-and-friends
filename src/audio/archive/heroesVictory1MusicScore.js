/**
 * Short 16-bit victory fanfare — level-complete celebration sting.
 * C major — upward square-wave lead, pulse harmonies, triangle bass, bright drums.
 */

export const HEROES_VICTORY_1_MUSIC_CONFIG = {
  bpm: 168,
  /** 9-beat one-shot (~3.2s) — resolved ending, not a loop. */
  loopDuration: (9 * 60) / 168,
  volume: 0.5,
  fadeIn: 0.02,
  fadeOut: 0.12,
  channels: {
    melody1: { type: 'square', volume: 0.155 },
    melody2: { type: 'square', volume: 0.095 },
    bass: { type: 'triangle', volume: 0.2 },
    drum: { volume: 0.075 },
  },
};

/** Bold ascending square-wave victory lead. */
export const HEROES_VICTORY_1_MELODY1 = [
  { beat: 0, pitch: 'C5', beats: 0.25 },
  { beat: 0.25, pitch: 'E5', beats: 0.25 },
  { beat: 0.5, pitch: 'G5', beats: 0.25 },
  { beat: 0.75, pitch: 'C6', beats: 0.25 },
  { beat: 1, pitch: 'E6', beats: 0.5 },
  { beat: 1.5, pitch: 'G6', beats: 0.5 },
  { beat: 2, pitch: 'A6', beats: 0.25 },
  { beat: 2.25, pitch: 'G6', beats: 0.25 },
  { beat: 2.5, pitch: 'E6', beats: 0.5 },
  { beat: 3, pitch: 'G6', beats: 0.25 },
  { beat: 3.25, pitch: 'C7', beats: 0.75 },
  { beat: 4, pitch: 'G6', beats: 0.25 },
  { beat: 4.25, pitch: 'E6', beats: 0.25 },
  { beat: 4.5, pitch: 'C6', beats: 0.5 },
  { beat: 5, pitch: 'E6', beats: 0.25 },
  { beat: 5.25, pitch: 'G6', beats: 0.25 },
  { beat: 5.5, pitch: 'C7', beats: 0.5 },
  { beat: 6, pitch: 'C7', beats: 1.5 },
  { beat: 7.5, pitch: 'G6', beats: 0.5 },
  { beat: 8, pitch: 'C6', beats: 1 },
];

/** Pulse-wave harmony stabs under the fanfare. */
export const HEROES_VICTORY_1_MELODY2 = [
  { beat: 0, pitch: 'C4', beats: 0.5 },
  { beat: 0.5, pitch: 'G4', beats: 0.5 },
  { beat: 1, pitch: 'C5', beats: 0.5 },
  { beat: 1.5, pitch: 'E5', beats: 0.5 },
  { beat: 2, pitch: 'G4', beats: 0.5 },
  { beat: 2.5, pitch: 'C5', beats: 0.5 },
  { beat: 3, pitch: 'E4', beats: 0.5 },
  { beat: 3.5, pitch: 'G4', beats: 0.5 },
  { beat: 4, pitch: 'C5', beats: 1 },
  { beat: 5, pitch: 'E4', beats: 0.5 },
  { beat: 5.5, pitch: 'G4', beats: 0.5 },
  { beat: 6, pitch: 'C5', beats: 1 },
  { beat: 7, pitch: 'G4', beats: 0.5 },
  { beat: 7.5, pitch: 'E4', beats: 0.5 },
  { beat: 8, pitch: 'C4', beats: 1 },
];

/** Resolved C-major chord stack on the final beat. */
export const HEROES_VICTORY_1_RESOLVE = [
  { beat: 7.5, pitch: 'E5', beats: 1.5 },
  { beat: 7.5, pitch: 'G5', beats: 1.5 },
  { beat: 8, pitch: 'C6', beats: 1 },
];

/** Light triangle bass — root punches into the final chord. */
export const HEROES_VICTORY_1_BASS = [
  { beat: 0, pitch: 'C2', beats: 0.5 },
  { beat: 1, pitch: 'C2', beats: 0.5 },
  { beat: 2, pitch: 'G2', beats: 0.5 },
  { beat: 3, pitch: 'C2', beats: 0.5 },
  { beat: 4, pitch: 'G2', beats: 0.5 },
  { beat: 5, pitch: 'C2', beats: 0.5 },
  { beat: 6, pitch: 'C2', beats: 1 },
  { beat: 7, pitch: 'G2', beats: 0.5 },
  { beat: 7.5, pitch: 'C2', beats: 1.5 },
];

/** Bright retro percussion — victory accents. */
export const HEROES_VICTORY_1_DRUMS = [
  { beat: 0, kind: 'snare' },
  { beat: 0.5, kind: 'hat' },
  { beat: 1, kind: 'snare' },
  { beat: 1.5, kind: 'hat' },
  { beat: 2, kind: 'snare' },
  { beat: 2.5, kind: 'hat' },
  { beat: 3, kind: 'snare' },
  { beat: 3.5, kind: 'hat' },
  { beat: 4, kind: 'snare' },
  { beat: 4.5, kind: 'hat' },
  { beat: 5, kind: 'snare' },
  { beat: 5.5, kind: 'hat' },
  { beat: 6, kind: 'snare' },
  { beat: 6.5, kind: 'hat' },
  { beat: 7, kind: 'snare' },
  { beat: 7.5, kind: 'snare' },
  { beat: 8, kind: 'snare' },
];

function beatPatternToNotes(pattern, channel, config) {
  const beatSec = 60 / config.bpm;

  return pattern.map((entry) => ({
    channel,
    start: entry.beat * beatSec,
    duration: entry.beats * beatSec * 0.94,
    pitch: entry.pitch,
  }));
}

function beatDrumsToNotes(pattern, config) {
  const beatSec = 60 / config.bpm;

  return pattern.map((entry) => ({
    channel: 'drum',
    start: entry.beat * beatSec,
    duration: entry.kind === 'snare' ? beatSec * 0.11 : beatSec * 0.05,
    kind: entry.kind,
  }));
}

export function buildHeroesVictory1MusicScore(config = HEROES_VICTORY_1_MUSIC_CONFIG) {
  return {
    config,
    notes: [
      ...beatPatternToNotes(HEROES_VICTORY_1_MELODY1, 'melody1', config),
      ...beatPatternToNotes(HEROES_VICTORY_1_MELODY2, 'melody2', config),
      ...beatPatternToNotes(HEROES_VICTORY_1_RESOLVE, 'melody2', config),
      ...beatPatternToNotes(HEROES_VICTORY_1_BASS, 'bass', config),
      ...beatDrumsToNotes(HEROES_VICTORY_1_DRUMS, config),
    ],
  };
}
