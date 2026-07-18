import { buildEpisodeCardCueScore } from './episodeCardCueScore.js';

const PITCH_OFFSETS = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

function pitchToFrequency(pitch) {
  const match = pitch.match(/^([A-G])(#?)(\d)$/);
  if (!match) {
    return 440;
  }

  const [, name, sharp, octaveText] = match;
  const octave = Number(octaveText);
  const semitone = PITCH_OFFSETS[name] + (sharp ? 1 : 0);
  const midi = 69 + semitone + (octave - 4) * 12;

  return 440 * 2 ** ((midi - 69) / 12);
}

export function createEpisodeCardCue(score = buildEpisodeCardCueScore()) {
  let audioContext = null;
  let masterGain = null;
  let channelGains = {};
  let noiseBuffer = null;
  let unlocked = false;

  function ensureContext() {
    if (!audioContext) {
      audioContext = new AudioContext();
      masterGain = audioContext.createGain();
      masterGain.gain.value = score.config.volume;
      masterGain.connect(audioContext.destination);

      for (const [channel, settings] of Object.entries(score.config.channels)) {
        const gain = audioContext.createGain();
        gain.gain.value = settings.volume ?? 1;
        gain.connect(masterGain);
        channelGains[channel] = gain;
      }
    }

    return audioContext;
  }

  function getNoiseBuffer() {
    const ctx = ensureContext();
    if (noiseBuffer) {
      return noiseBuffer;
    }

    const sampleCount = ctx.sampleRate * 0.5;
    noiseBuffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < sampleCount; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    return noiseBuffer;
  }

  function scheduleTone(channel, startTime, duration, frequency, envelope = {}) {
    const ctx = ensureContext();
    const channelSettings = score.config.channels[channel];
    const destination = channelGains[channel];

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = channelSettings.type ?? 'square';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    const attack = envelope.attack ?? 0.012;
    const sustain = envelope.sustain ?? 0.62;
    const peak = envelope.peak ?? 0.85;

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peak, startTime + attack);
    gain.gain.setValueAtTime(peak * sustain, startTime + duration * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }

  function scheduleWhoosh(startTime, duration) {
    const ctx = ensureContext();
    const destination = channelGains.whoosh;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    source.buffer = getNoiseBuffer();
    filter.type = 'bandpass';
    filter.Q.value = 0.85;
    filter.frequency.setValueAtTime(2800, startTime);
    filter.frequency.exponentialRampToValueAtTime(620, startTime + duration * 0.85);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.75, startTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.18, startTime + duration * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    source.start(startTime);
    source.stop(startTime + duration + 0.03);
  }

  function scheduleCue(startTime) {
    scheduleWhoosh(startTime + score.whoosh.start, score.whoosh.duration);

    for (const note of score.notes) {
      const envelope =
        note.channel === 'shimmer'
          ? { attack: 0.004, sustain: 0.35, peak: 0.55 }
          : note.channel === 'harmony'
            ? { attack: 0.02, sustain: 0.5, peak: 0.65 }
            : { attack: 0.014, sustain: 0.58, peak: 0.8 };

      scheduleTone(
        note.channel,
        startTime + note.start,
        note.duration,
        pitchToFrequency(note.pitch),
        envelope,
      );
    }
  }

  async function unlock() {
    const ctx = ensureContext();
    unlocked = true;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  async function play() {
    if (!unlocked) {
      return;
    }

    const ctx = ensureContext();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    scheduleCue(ctx.currentTime + 0.02);
  }

  function stop() {
    if (audioContext) {
      audioContext.close().catch(() => {});
      audioContext = null;
      masterGain = null;
      channelGains = {};
      noiseBuffer = null;
      unlocked = false;
    }
  }

  return {
    unlock,
    play,
    stop,
    getConfig: () => score.config,
  };
}
