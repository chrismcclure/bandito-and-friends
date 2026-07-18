/**
 * Series opening cue (~15s at 88 BPM).
 * Layered: melody + continuous arpeggio + bass pulse + light texture.
 * Wonder → curiosity → Meow City → resolve for title handoff.
 */

export const SERIES_OPENING_MUSIC_CONFIG = {
  bpm: 88,
  duration: 15,
  volume: 0.48,
  channels: {
    melody: { type: 'square', volume: 0.15 },
    arpeggio: { type: 'triangle', volume: 0.12 },
    harmony: { type: 'triangle', volume: 0.11 },
    bass: { type: 'triangle', volume: 0.24 },
    texture: { volume: 0.05 },
  },
};

/** Main melody — enters ~3s; breathes but never leaves long silence. */
export const SERIES_OPENING_MELODY = [
  // 3–7s: world transforming
  { beat: 4.5, pitch: 'E4', beats: 1.4 },
  { beat: 6, pitch: 'G4', beats: 1.1 },
  { beat: 7.25, pitch: 'A4', beats: 1.5 },
  { beat: 8.75, pitch: 'C5', beats: 1.2 },

  // 7–11s: Meow City — more hopeful
  { beat: 10.25, pitch: 'E5', beats: 0.85 },
  { beat: 11.1, pitch: 'G5', beats: 0.85 },
  { beat: 11.95, pitch: 'E5', beats: 1.1 },
  { beat: 13.1, pitch: 'C5', beats: 1 },
  { beat: 14.15, pitch: 'D5', beats: 1 },

  // 11–15s: resolve into title handoff
  { beat: 16, pitch: 'E5', beats: 2.2 },
  { beat: 18, pitch: 'G5', beats: 3.5 },
];

/** Long triangle pads — shift brighter as Meow City appears. */
export const SERIES_OPENING_HARMONY = [
  { beat: 0, pitch: 'A3', beats: 6.5 },
  { beat: 6.5, pitch: 'F3', beats: 3.5 },
  { beat: 10, pitch: 'C3', beats: 6 },
  { beat: 16, pitch: 'G3', beats: 2 },
  { beat: 18, pitch: 'C4', beats: 4 },
];

/** Slow bass pulse — grounding throughout. */
export const SERIES_OPENING_BASS = [
  { beat: 0, pitch: 'A2', beats: 1.85 },
  { beat: 2, pitch: 'A2', beats: 1.85 },
  { beat: 4, pitch: 'A2', beats: 1.85 },
  { beat: 6, pitch: 'F2', beats: 1.85 },
  { beat: 8, pitch: 'F2', beats: 1.85 },
  { beat: 10, pitch: 'C2', beats: 1.85 },
  { beat: 12, pitch: 'C2', beats: 1.85 },
  { beat: 14, pitch: 'G2', beats: 1.85 },
  { beat: 16, pitch: 'G2', beats: 1.85 },
  { beat: 18, pitch: 'C2', beats: 3.5 },
];

/** Arpeggio chord changes — continuous motion under the melody. */
export const SERIES_OPENING_ARPEGGIO_SECTIONS = [
  { startBeat: 0, endBeat: 6.5, chord: ['A3', 'C4', 'E4', 'C4'] },
  { startBeat: 6.5, endBeat: 10, chord: ['F3', 'A3', 'C4', 'A3'] },
  { startBeat: 10, endBeat: 16, chord: ['C3', 'E3', 'G3', 'E3'] },
  { startBeat: 16, endBeat: 18, chord: ['G3', 'B3', 'D4', 'B3'] },
  { startBeat: 18, endBeat: 22.5, chord: ['C3', 'E3', 'G3', 'E3'] },
];

const ARPEGGIO_STEP_BEATS = 0.5;
const ARPEGGIO_NOTE_BEATS = 0.48;

function buildArpeggioPattern(sections, stepBeats, noteBeats) {
  const pattern = [];

  for (const section of sections) {
    let beat = section.startBeat;
    let index = 0;

    while (beat < section.endBeat) {
      pattern.push({
        beat,
        pitch: section.chord[index % section.chord.length],
        beats: noteBeats,
      });
      beat += stepBeats;
      index += 1;
    }
  }

  return pattern;
}

/** Very subtle rhythmic texture — not a drum beat. */
function buildTexturePattern(endBeat, stepBeats = 2) {
  const pattern = [];

  for (let beat = 1; beat < endBeat; beat += stepBeats) {
    pattern.push({ beat, kind: 'tick' });
  }

  return pattern;
}

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

function texturePatternToNotes(pattern, bpm) {
  return pattern.map((entry) => ({
    channel: 'texture',
    start: beatToSeconds(entry.beat, bpm),
    duration: 0.035,
    kind: entry.kind,
  }));
}

export function buildSeriesOpeningMusicScore() {
  const { bpm } = SERIES_OPENING_MUSIC_CONFIG;
  const totalBeats = (SERIES_OPENING_MUSIC_CONFIG.duration * bpm) / 60;

  const arpeggio = buildArpeggioPattern(
    SERIES_OPENING_ARPEGGIO_SECTIONS,
    ARPEGGIO_STEP_BEATS,
    ARPEGGIO_NOTE_BEATS,
  );
  const texture = buildTexturePattern(totalBeats);

  return {
    config: SERIES_OPENING_MUSIC_CONFIG,
    notes: [
      ...patternToNotes(SERIES_OPENING_MELODY, 'melody', bpm),
      ...patternToNotes(arpeggio, 'arpeggio', bpm),
      ...patternToNotes(SERIES_OPENING_HARMONY, 'harmony', bpm),
      ...patternToNotes(SERIES_OPENING_BASS, 'bass', bpm),
      ...texturePatternToNotes(texture, bpm),
    ],
  };
}
