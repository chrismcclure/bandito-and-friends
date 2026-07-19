/**
 * Episode Title Card sound cue — classic NES stage intro (Mega Man–inspired).
 *
 * Four ascending beeps → charge-up → impact. Text appears with the first beep.
 * ~150 ms silence after impact before story music should begin.
 */

export const EPISODE_CARD_IMPACT_AT = 0.58;

/** Four ascending menu beeps — gaps tighten before the final note. */
export const EPISODE_CARD_BEEPS = [
  { start: 0.08, pitch: 'G4', duration: 0.055 },
  { start: 0.22, pitch: 'C5', duration: 0.055 },
  { start: 0.35, pitch: 'E5', duration: 0.055 },
  { start: 0.46, pitch: 'G5', duration: 0.055 },
];

export const EPISODE_CARD_CUE_CONFIG = {
  duration: 1.05,
  volume: 0.525,
  /** Text appears with the first beep; impact punctuates at impactAt. */
  blackHold: EPISODE_CARD_BEEPS[0].start,
  fadeIn: 0,
  /** Gap after impact before eerie story music enters. */
  postImpactSilence: 0.15,
  channels: {
    beep: { type: 'square', volume: 0.26 },
    charge: { type: 'square', volume: 0.22 },
    stab: { type: 'square', volume: 0.3 },
    bass: { type: 'triangle', volume: 0.34 },
    noise: { volume: 0.28 },
  },
};

/** Short electronic charge-up immediately before the impact. */
export const EPISODE_CARD_CHARGE = {
  start: 0.53,
  duration: 0.05,
  pitchStart: 'A5',
  pitchEnd: 'D6',
};

/** NES impact — noise burst + triangle bass slam + bright square stab. */
export const EPISODE_CARD_EXPLOSION = {
  start: EPISODE_CARD_IMPACT_AT,
  noiseDuration: 0.3,
  bassPitch: 'E2',
  bassDuration: 0.28,
  stabPitch: 'G5',
  stabDuration: 0.1,
};

export function buildEpisodeCardCueScore() {
  return {
    config: EPISODE_CARD_CUE_CONFIG,
    beeps: EPISODE_CARD_BEEPS,
    charge: EPISODE_CARD_CHARGE,
    explosion: EPISODE_CARD_EXPLOSION,
    notes: EPISODE_CARD_BEEPS.map((note) => ({ ...note, channel: 'beep' })),
  };
}
