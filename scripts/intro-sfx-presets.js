/**
 * Intro sound effect presets for jsfxr.
 *
 * Wave types: 0 = square, 1 = sawtooth, 2 = sine, 3 = noise
 * Timing uses jsfxr normalized envelope values (not literal seconds).
 * Adjust p_env_sustain and p_env_decay to change perceived length.
 */

const BASE = {
  oldParams: true,
  p_env_attack: 0,
  p_env_punch: 0,
  p_freq_limit: 0,
  p_freq_dramp: 0,
  p_vib_strength: 0,
  p_vib_speed: 0,
  p_arp_mod: 0,
  p_arp_speed: 0,
  p_duty: 0,
  p_duty_ramp: 0,
  p_repeat_speed: 0,
  p_pha_offset: 0,
  p_pha_ramp: 0,
  p_lpf_ramp: 0,
  p_lpf_resonance: 0,
  p_hpf_ramp: 0,
  sound_vol: 0.25,
  sample_rate: 44100,
  sample_size: 8,
};

/** @returns {import('jsfxr').Params & Record<string, number | boolean>} */
function preset(params) {
  return { ...BASE, ...params };
}

export const INTRO_SFX_PRESETS = [
  {
    filename: 'intro-text-01.wav',
    purpose:
      'Plays when "IN A QUIET HOUSE..." appears. Serious, confident NES menu confirmation.',
    params: preset({
      wave_type: 0,
      p_base_freq: 0.42,
      p_freq_ramp: 0.08,
      p_env_sustain: 0.16,
      p_env_decay: 0.2,
      p_env_punch: 0.25,
      p_lpf_freq: 0.85,
      p_hpf_freq: 0.05,
    }),
  },
  {
    filename: 'intro-text-02.wav',
    purpose:
      'Plays when "AN ANCIENT EVIL..." appears. Lower, darker, more ominous.',
    params: preset({
      wave_type: 0,
      p_base_freq: 0.22,
      p_freq_ramp: -0.12,
      p_env_sustain: 0.14,
      p_env_decay: 0.26,
      p_env_punch: 0.15,
      p_lpf_freq: 0.55,
      p_hpf_freq: 0,
    }),
  },
  {
    filename: 'intro-text-03.wav',
    purpose:
      'Plays when "...HAD RETURNED." appears. Strongest text impact with upward finish.',
    params: preset({
      wave_type: 1,
      p_duty: 1,
      p_base_freq: 0.18,
      p_freq_ramp: 0.35,
      p_env_sustain: 0.2,
      p_env_decay: 0.34,
      p_env_punch: 0.55,
      p_lpf_freq: 0.7,
      p_hpf_freq: 0,
    }),
  },
  {
    filename: 'flash.wav',
    purpose: 'White flash transitions. Very short, bright, high-frequency spark.',
    params: preset({
      wave_type: 3,
      p_base_freq: 0.75,
      p_freq_ramp: -0.45,
      p_env_sustain: 0.07,
      p_env_decay: 0.14,
      p_env_punch: 0.1,
      p_lpf_freq: 0.95,
      p_hpf_freq: 0.35,
    }),
  },
  {
    filename: 'title-reveal.wav',
    purpose:
      'Plays when title artwork appears. Heroic, anime, retro — the heroes have arrived.',
    params: preset({
      wave_type: 1,
      p_duty: 1,
      p_base_freq: 0.28,
      p_freq_ramp: 0.18,
      p_arp_mod: 0.22,
      p_arp_speed: 0.62,
      p_env_sustain: 0.32,
      p_env_decay: 0.55,
      p_env_punch: 0.35,
      p_lpf_freq: 0.8,
      p_hpf_freq: 0,
    }),
  },
  {
    filename: 'episode-label.wav',
    purpose: 'Plays when "EPISODE 1" appears. Simple, clean confirmation.',
    params: preset({
      wave_type: 0,
      p_base_freq: 0.5,
      p_freq_ramp: 0.04,
      p_env_sustain: 0.13,
      p_env_decay: 0.17,
      p_env_punch: 0.12,
      p_lpf_freq: 0.9,
      p_hpf_freq: 0.08,
    }),
  },
  {
    filename: 'sock-monster-slam.wav',
    purpose:
      'Plays when "THE SOCK MONSTER" appears. Powerful NES final-boss introduction.',
    params: preset({
      wave_type: 0,
      p_duty: 0.45,
      p_base_freq: 0.12,
      p_freq_ramp: -0.08,
      p_env_sustain: 0.18,
      p_env_decay: 0.48,
      p_env_punch: 0.75,
      p_lpf_freq: 0.45,
      p_hpf_freq: 0,
      p_vib_strength: 0.08,
      p_vib_speed: 0.35,
    }),
  },
  {
    filename: 'intro-end.wav',
    purpose: 'Small hopeful ending cue before cutting to black.',
    params: preset({
      wave_type: 2,
      p_base_freq: 0.38,
      p_freq_ramp: 0.1,
      p_env_sustain: 0.16,
      p_env_decay: 0.28,
      p_env_punch: 0.05,
      p_lpf_freq: 0.75,
      p_hpf_freq: 0,
      sound_vol: 0.18,
    }),
  },
  {
    filename: 'episode-card-whoosh.wav',
    purpose:
      'Classic NES "Press Start" swoosh when the Episode 1 title card appears.',
    params: preset({
      wave_type: 3,
      p_base_freq: 0.82,
      p_freq_ramp: -0.58,
      p_env_sustain: 0.06,
      p_env_decay: 0.34,
      p_env_punch: 0.22,
      p_lpf_freq: 0.78,
      p_lpf_ramp: -0.28,
      p_hpf_freq: 0.12,
      sound_vol: 0.38,
    }),
  },
];
