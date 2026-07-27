/**
 * Intro theme composition data.
 *
 * Adjust tempo and loop length in INTRO_MUSIC_CONFIG.
 * Adjust melody, bass, and percussion in the pattern arrays below.
 * Times are expressed in beats; they are converted to seconds at playback.
 */

import { getIntroThemeDuration } from '../data/episode-01-shots.js';

export const INTRO_MUSIC_CONFIG = {
  /** Target tempo. 145–165 BPM recommended. */
  bpm: 160,
  /** One-shot length — title hold + Meet the Team, ending at the episode card. */
  loopDuration: getIntroThemeDuration(),
  /** Master music volume. SFX remain independent. */
  volume: 0.546875,
  channels: {
    melody1: { type: 'square', volume: 0.14 },
    melody2: { type: 'square', volume: 0.09 },
    bass: { type: 'triangle', volume: 0.2 },
    drum: { volume: 0.07 },
  },
};

/** Primary square-wave lead. */
export const MELODY1_PATTERN = [
  // 0–2s: sparse tension
  { beat: 3, pitch: 'E4', beats: 0.5 },
  { beat: 4.5, pitch: 'G4', beats: 0.5 },

  // 2–5s: melody enters
  { beat: 5, pitch: 'A4', beats: 0.5 },
  { beat: 5.5, pitch: 'C5', beats: 0.5 },
  { beat: 6, pitch: 'E5', beats: 0.75 },
  { beat: 7, pitch: 'D5', beats: 0.5 },
  { beat: 7.5, pitch: 'C5', beats: 0.5 },
  { beat: 8, pitch: 'A4', beats: 1 },

  // 5–8s: full heroic theme
  { beat: 9, pitch: 'C5', beats: 0.5 },
  { beat: 9.5, pitch: 'E5', beats: 0.5 },
  { beat: 10, pitch: 'G5', beats: 0.75 },
  { beat: 11, pitch: 'E5', beats: 0.5 },
  { beat: 11.5, pitch: 'C5', beats: 0.5 },
  { beat: 12, pitch: 'A4', beats: 0.5 },
  { beat: 12.5, pitch: 'G4', beats: 0.5 },
  { beat: 13, pitch: 'E4', beats: 1 },

  // 8–10s: drive toward episode title
  { beat: 14, pitch: 'G4', beats: 0.5 },
  { beat: 14.5, pitch: 'A4', beats: 0.5 },
  { beat: 15, pitch: 'C5', beats: 0.5 },
  { beat: 15.5, pitch: 'E5', beats: 0.5 },
  { beat: 16, pitch: 'G5', beats: 0.75 },
  { beat: 17, pitch: 'A5', beats: 0.5 },
  { beat: 17.5, pitch: 'G5', beats: 0.5 },
  { beat: 18, pitch: 'E5', beats: 0.5 },
  { beat: 18.5, pitch: 'C5', beats: 0.5 },
  { beat: 19, pitch: 'D5', beats: 0.5 },
  { beat: 19.5, pitch: 'E5', beats: 0.5 },

  // 10–12s: resolve back to tonic for seamless loop
  { beat: 20, pitch: 'G5', beats: 0.75 },
  { beat: 21, pitch: 'E5', beats: 0.5 },
  { beat: 21.5, pitch: 'D5', beats: 0.5 },
  { beat: 22, pitch: 'C5', beats: 0.75 },
  { beat: 23, pitch: 'A4', beats: 1 },
  { beat: 24.5, pitch: 'E4', beats: 0.5 },
  { beat: 25, pitch: 'A4', beats: 1.5 },

  // 12–12.5s: resolve into episode card handoff
  { beat: 28, pitch: 'C5', beats: 0.75 },
  { beat: 29, pitch: 'A4', beats: 0.75 },
  { beat: 30, pitch: 'G4', beats: 0.5 },
  { beat: 30.5, pitch: 'E4', beats: 0.5 },
  { beat: 31, pitch: 'A4', beats: 1.5 },
];

/** Secondary square-wave harmony / countermelody. */
export const MELODY2_PATTERN = [
  { beat: 6, pitch: 'A3', beats: 1 },
  { beat: 7.5, pitch: 'C4', beats: 1 },
  { beat: 9, pitch: 'E4', beats: 0.75 },
  { beat: 10, pitch: 'G4', beats: 0.75 },
  { beat: 11, pitch: 'A4', beats: 1 },
  { beat: 12.5, pitch: 'C4', beats: 1 },
  { beat: 14, pitch: 'D4', beats: 0.75 },
  { beat: 15, pitch: 'E4', beats: 0.75 },
  { beat: 16, pitch: 'G4', beats: 1 },
  { beat: 17.5, pitch: 'A4', beats: 0.75 },
  { beat: 18.5, pitch: 'C5', beats: 0.75 },
  { beat: 20, pitch: 'E4', beats: 1 },
  { beat: 21.5, pitch: 'C4', beats: 0.75 },
  { beat: 22.5, pitch: 'A3', beats: 1.25 },

  // 12–12.5s: trailing harmony into episode card
  { beat: 28, pitch: 'E4', beats: 1 },
  { beat: 30, pitch: 'C4', beats: 1.25 },
  { beat: 31.5, pitch: 'A3', beats: 1.5 },
];

/** Triangle-wave bass line. */
export const BASS_PATTERN = [
  // 0–2s: simple pulsing root
  { beat: 0, pitch: 'A2', beats: 1 },
  { beat: 1, pitch: 'A2', beats: 1 },
  { beat: 2, pitch: 'E2', beats: 1 },
  { beat: 3, pitch: 'A2', beats: 1 },

  // 2–5s: rising bass movement
  { beat: 4, pitch: 'A2', beats: 1 },
  { beat: 5, pitch: 'C3', beats: 1 },
  { beat: 6, pitch: 'E3', beats: 1 },
  { beat: 7, pitch: 'A2', beats: 1 },

  // 5–8s: driving heroic bass
  { beat: 8, pitch: 'A2', beats: 0.5 },
  { beat: 8.5, pitch: 'A2', beats: 0.5 },
  { beat: 9, pitch: 'C3', beats: 0.5 },
  { beat: 9.5, pitch: 'E3', beats: 0.5 },
  { beat: 10, pitch: 'G2', beats: 0.5 },
  { beat: 10.5, pitch: 'A2', beats: 0.5 },
  { beat: 11, pitch: 'C3', beats: 0.5 },
  { beat: 11.5, pitch: 'E3', beats: 0.5 },
  { beat: 12, pitch: 'A2', beats: 1 },

  // 8–12s: push and resolve
  { beat: 13, pitch: 'G2', beats: 0.5 },
  { beat: 13.5, pitch: 'A2', beats: 0.5 },
  { beat: 14, pitch: 'C3', beats: 0.5 },
  { beat: 14.5, pitch: 'E3', beats: 0.5 },
  { beat: 15, pitch: 'F3', beats: 0.5 },
  { beat: 15.5, pitch: 'E3', beats: 0.5 },
  { beat: 16, pitch: 'D3', beats: 0.5 },
  { beat: 16.5, pitch: 'C3', beats: 0.5 },
  { beat: 17, pitch: 'B2', beats: 0.5 },
  { beat: 17.5, pitch: 'A2', beats: 0.5 },
  { beat: 18, pitch: 'G2', beats: 0.5 },
  { beat: 18.5, pitch: 'F2', beats: 0.5 },
  { beat: 19, pitch: 'E2', beats: 0.5 },
  { beat: 19.5, pitch: 'D2', beats: 0.5 },
  { beat: 20, pitch: 'C2', beats: 1 },
  { beat: 21, pitch: 'E2', beats: 1 },
  { beat: 22, pitch: 'A2', beats: 2 },
  { beat: 24, pitch: 'A2', beats: 1 },
  { beat: 25, pitch: 'E2', beats: 1 },
  { beat: 26, pitch: 'A2', beats: 2 },

  // 12–12.5s: final root hold for episode card transition
  { beat: 28, pitch: 'A2', beats: 1 },
  { beat: 29, pitch: 'E2', beats: 1 },
  { beat: 30, pitch: 'A2', beats: 1 },
  { beat: 31, pitch: 'A2', beats: 1.5 },
];

/**
 * Noise percussion hits.
 * kind: 'hat' for light hi-hat, 'snare' for accent hits.
 */
export const DRUM_PATTERN = [
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
  { beat: 16, kind: 'snare' },
  { beat: 17, kind: 'hat' },
  { beat: 17.5, kind: 'hat' },
  { beat: 18, kind: 'snare' },
  { beat: 19, kind: 'hat' },
  { beat: 19.5, kind: 'hat' },
  { beat: 20, kind: 'snare' },
  { beat: 21, kind: 'hat' },
  { beat: 21.5, kind: 'hat' },
  { beat: 22, kind: 'snare' },
  { beat: 23, kind: 'hat' },
  { beat: 23.5, kind: 'hat' },
  { beat: 24, kind: 'snare' },
  { beat: 25, kind: 'hat' },
  { beat: 25.5, kind: 'hat' },
  { beat: 26, kind: 'snare' },
  { beat: 27, kind: 'hat' },
  { beat: 27.5, kind: 'hat' },
  { beat: 28, kind: 'snare' },
  { beat: 29, kind: 'hat' },
  { beat: 29.5, kind: 'hat' },
  { beat: 30, kind: 'snare' },
  { beat: 31, kind: 'hat' },
  { beat: 31.5, kind: 'hat' },
  { beat: 32, kind: 'snare' },
  { beat: 33, kind: 'hat' },
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

/** Flattened note list consumed by IntroMusic playback. */
export function buildIntroMusicScore(config = INTRO_MUSIC_CONFIG) {
  return {
    config,
    notes: [
      ...beatPatternToNotes(MELODY1_PATTERN, 'melody1', config),
      ...beatPatternToNotes(MELODY2_PATTERN, 'melody2', config),
      ...beatPatternToNotes(BASS_PATTERN, 'bass', config),
      ...beatDrumsToNotes(DRUM_PATTERN, config),
    ],
  };
}
