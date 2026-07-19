/**
 * Series opening cue (~15s at 88 BPM).
 * Layered: melody + continuous arpeggio + bass pulse + light texture.
 * Wonder → curiosity → Meow City → resolve for title handoff.
 */

export const SERIES_OPENING_MUSIC_CONFIG = {
  bpm: 88,
  duration: 15,
  volume: 0.75,
  channels: {
    melody: { type: 'triangle', volume: 0.17 },
    arpeggio: { type: 'triangle', volume: 0.12 },
    harmony: { type: 'triangle', volume: 0.11 },
    bass: { type: 'triangle', volume: 0.24 },
    texture: { volume: 0.05 },
  },
};

/** Sparse lead — short, curious phrases over the bass and arpeggio bed. */
export const SERIES_OPENING_MELODY = [
  // 1.5–6.5s: ordinary house — something feels quietly wrong
  { beat: 2.5, pitch: 'E4', beats: 0.4 },
  { beat: 3.25, pitch: 'D4', beats: 0.35 },
  { beat: 4.1, pitch: 'C4', beats: 0.5 },
  { beat: 5.1, pitch: 'E4', beats: 0.3 },
  { beat: 5.85, pitch: 'F4', beats: 0.45 },

  // 6.5–10s: transform — uneasy curiosity, not heroic
  { beat: 6.75, pitch: 'G4', beats: 0.35 },
  { beat: 7.5, pitch: 'A4', beats: 0.3 },
  { beat: 8.25, pitch: 'B4', beats: 0.4 },
  { beat: 9, pitch: 'A4', beats: 0.35 },
  { beat: 9.75, pitch: 'G4', beats: 0.45 },
  { beat: 10.5, pitch: 'E4', beats: 0.55 },

  // 10–14s: Meow City — wonder with a shadow
  { beat: 11.5, pitch: 'C5', beats: 0.3 },
  { beat: 12.15, pitch: 'B4', beats: 0.3 },
  { beat: 12.85, pitch: 'A4', beats: 0.35 },
  { beat: 13.55, pitch: 'G4', beats: 0.4 },
  { beat: 14.35, pitch: 'E4', beats: 0.45 },
  { beat: 15.1, pitch: 'D4', beats: 0.5 },

  // 14–18s: rooftop watch — hushed resolve
  { beat: 16, pitch: 'A4', beats: 0.55 },
  { beat: 17, pitch: 'C5', beats: 0.4 },
  { beat: 17.8, pitch: 'E5', beats: 0.45 },
  { beat: 18.75, pitch: 'D5', beats: 0.55 },
  { beat: 19.75, pitch: 'A4', beats: 1.1 },
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
