/**
 * Warm living-room reveal theme — human-world contrast to Meow City chiptune.
 * Soft piano melody, gentle guitar arpeggios, upright bass, brushed percussion.
 */

export const LIVING_ROOM_REVEAL_1_MUSIC_CONFIG = {
  bpm: 76,
  /** 32-beat loop (~25.3s) — cozy Sunday-afternoon feel. */
  loopDuration: (32 * 60) / 76,
  volume: 0.5,
  fadeIn: 1.4,
  fadeOut: 2.2,
  channels: {
    piano: { type: 'sine', volume: 0.13, envelope: 'soft' },
    guitar: { type: 'triangle', volume: 0.085, envelope: 'pluck' },
    bass: { type: 'sine', volume: 0.11, envelope: 'bass' },
    drum: { volume: 0.028 },
  },
};

/** Soft piano melody — nostalgic, wholesome homecoming. */
export const LIVING_ROOM_REVEAL_1_PIANO = [
  { beat: 0, pitch: 'E5', beats: 1.5 },
  { beat: 1.5, pitch: 'G5', beats: 0.5 },
  { beat: 2, pitch: 'A5', beats: 2 },
  { beat: 4, pitch: 'G5', beats: 1 },
  { beat: 5, pitch: 'E5', beats: 1 },
  { beat: 6, pitch: 'D5', beats: 1 },
  { beat: 7, pitch: 'E5', beats: 1 },
  { beat: 8, pitch: 'C5', beats: 2 },
  { beat: 10, pitch: 'E5', beats: 1 },
  { beat: 11, pitch: 'G5', beats: 1 },
  { beat: 12, pitch: 'A5', beats: 2 },
  { beat: 14, pitch: 'G5', beats: 1 },
  { beat: 15, pitch: 'E5', beats: 1 },
  { beat: 16, pitch: 'F5', beats: 1.5 },
  { beat: 17.5, pitch: 'E5', beats: 0.5 },
  { beat: 18, pitch: 'D5', beats: 2 },
  { beat: 20, pitch: 'E5', beats: 1 },
  { beat: 21, pitch: 'G5', beats: 1 },
  { beat: 22, pitch: 'C5', beats: 2 },
  { beat: 24, pitch: 'G5', beats: 1.5 },
  { beat: 25.5, pitch: 'A5', beats: 0.5 },
  { beat: 26, pitch: 'G5', beats: 2 },
  { beat: 28, pitch: 'E5', beats: 1.5 },
  { beat: 29.5, pitch: 'D5', beats: 0.5 },
  { beat: 30, pitch: 'C5', beats: 2 },
];

function arpeggioBlock(startBeat, pitches) {
  const notes = [];
  for (let i = 0; i < 8; i += 1) {
    notes.push({
      beat: startBeat + i * 0.5,
      pitch: pitches[i % pitches.length],
      beats: 0.48,
    });
  }
  return notes;
}

/** Gentle fingerpicked guitar — C / Am / F / G arpeggios. */
export const LIVING_ROOM_REVEAL_1_GUITAR = [
  ...arpeggioBlock(0, ['C4', 'E4', 'G4', 'C5']),
  ...arpeggioBlock(2, ['C4', 'E4', 'G4', 'C5']),
  ...arpeggioBlock(4, ['C4', 'E4', 'G4', 'C5']),
  ...arpeggioBlock(6, ['C4', 'E4', 'G4', 'C5']),
  ...arpeggioBlock(8, ['A3', 'C4', 'E4', 'A4']),
  ...arpeggioBlock(10, ['A3', 'C4', 'E4', 'A4']),
  ...arpeggioBlock(12, ['A3', 'C4', 'E4', 'A4']),
  ...arpeggioBlock(14, ['A3', 'C4', 'E4', 'A4']),
  ...arpeggioBlock(16, ['F3', 'A3', 'C4', 'F4']),
  ...arpeggioBlock(18, ['F3', 'A3', 'C4', 'F4']),
  ...arpeggioBlock(20, ['F3', 'A3', 'C4', 'F4']),
  ...arpeggioBlock(22, ['F3', 'A3', 'C4', 'F4']),
  ...arpeggioBlock(24, ['G3', 'B3', 'D4', 'G4']),
  ...arpeggioBlock(26, ['G3', 'B3', 'D4', 'G4']),
  ...arpeggioBlock(28, ['G3', 'B3', 'D4', 'G4']),
  ...arpeggioBlock(30, ['C4', 'E4', 'G4', 'C5']),
];

/** Light upright bass — warm root movement. */
export const LIVING_ROOM_REVEAL_1_BASS = [
  { beat: 0, pitch: 'C2', beats: 2 },
  { beat: 2, pitch: 'G2', beats: 2 },
  { beat: 4, pitch: 'C2', beats: 2 },
  { beat: 6, pitch: 'E2', beats: 2 },
  { beat: 8, pitch: 'A1', beats: 2 },
  { beat: 10, pitch: 'E2', beats: 2 },
  { beat: 12, pitch: 'A1', beats: 2 },
  { beat: 14, pitch: 'C2', beats: 2 },
  { beat: 16, pitch: 'F1', beats: 2 },
  { beat: 18, pitch: 'C2', beats: 2 },
  { beat: 20, pitch: 'F1', beats: 2 },
  { beat: 22, pitch: 'A1', beats: 2 },
  { beat: 24, pitch: 'G1', beats: 2 },
  { beat: 26, pitch: 'D2', beats: 2 },
  { beat: 28, pitch: 'G1', beats: 2 },
  { beat: 30, pitch: 'C2', beats: 2 },
];

/** Very subtle brushed percussion — sparse and soft. */
export const LIVING_ROOM_REVEAL_1_DRUMS = [
  { beat: 0, kind: 'brush' },
  { beat: 2, kind: 'brush' },
  { beat: 4, kind: 'brush' },
  { beat: 6, kind: 'brush' },
  { beat: 8, kind: 'brush' },
  { beat: 12, kind: 'brush' },
  { beat: 16, kind: 'brush' },
  { beat: 20, kind: 'brush' },
  { beat: 24, kind: 'brush' },
  { beat: 28, kind: 'brush' },
  { beat: 30, kind: 'brush' },
];

function beatPatternToNotes(pattern, channel, config) {
  const beatSec = 60 / config.bpm;

  return pattern.map((entry) => ({
    channel,
    start: entry.beat * beatSec,
    duration: entry.beats * beatSec * 0.96,
    pitch: entry.pitch,
  }));
}

function beatDrumsToNotes(pattern, config) {
  const beatSec = 60 / config.bpm;

  return pattern.map((entry) => ({
    channel: 'drum',
    start: entry.beat * beatSec,
    duration: beatSec * 0.22,
    kind: entry.kind,
  }));
}

export function buildLivingRoomReveal1MusicScore(
  config = LIVING_ROOM_REVEAL_1_MUSIC_CONFIG,
) {
  return {
    config,
    notes: [
      ...beatPatternToNotes(LIVING_ROOM_REVEAL_1_PIANO, 'piano', config),
      ...beatPatternToNotes(LIVING_ROOM_REVEAL_1_GUITAR, 'guitar', config),
      ...beatPatternToNotes(LIVING_ROOM_REVEAL_1_BASS, 'bass', config),
      ...beatDrumsToNotes(LIVING_ROOM_REVEAL_1_DRUMS, config),
    ],
  };
}
