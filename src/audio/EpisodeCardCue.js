import { buildEpisodeCardCueScore } from './episodeCardCueScore.js';
import { installMasterTap } from '../dev/audioMonitor.js';

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
      installMasterTap(audioContext, masterGain);

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

  function scheduleBeep(startTime, duration, pitch) {
    scheduleTone(
      'beep',
      startTime,
      duration,
      pitchToFrequency(pitch),
      { attack: 0.002, sustain: 0.12, peak: 0.95 },
    );
  }

  function scheduleChargeUp(startTime) {
    const ctx = ensureContext();
    const { duration, pitchStart, pitchEnd } = score.charge;
    const destination = channelGains.charge;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(pitchToFrequency(pitchStart), startTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      pitchToFrequency(pitchEnd),
      startTime + duration,
    );

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.85, startTime + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }

  function scheduleExplosion(startTime) {
    const ctx = ensureContext();
    const { noiseDuration, bassPitch, bassDuration, stabPitch, stabDuration } =
      score.explosion;

    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();

    noiseSource.buffer = getNoiseBuffer();

    noiseGain.gain.setValueAtTime(0.0001, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(1, startTime + 0.004);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + noiseDuration);

    noiseSource.connect(noiseGain);
    noiseGain.connect(channelGains.noise);
    noiseSource.start(startTime);
    noiseSource.stop(startTime + noiseDuration + 0.03);

    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    const bassFreq = pitchToFrequency(bassPitch);

    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassFreq * 1.5, startTime);
    bassOsc.frequency.exponentialRampToValueAtTime(bassFreq * 0.5, startTime + bassDuration);

    bassGain.gain.setValueAtTime(0.0001, startTime);
    bassGain.gain.exponentialRampToValueAtTime(1, startTime + 0.006);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, startTime + bassDuration);

    bassOsc.connect(bassGain);
    bassGain.connect(channelGains.bass);
    bassOsc.start(startTime);
    bassOsc.stop(startTime + bassDuration + 0.03);

    scheduleTone(
      'stab',
      startTime,
      stabDuration,
      pitchToFrequency(stabPitch),
      { attack: 0.002, sustain: 0.2, peak: 0.95 },
    );
  }

  function scheduleCue(startTime) {
    for (const beep of score.beeps) {
      scheduleBeep(startTime + beep.start, beep.duration, beep.pitch);
    }

    scheduleChargeUp(startTime + score.charge.start);
    scheduleExplosion(startTime + score.explosion.start);
  }

  async function unlock() {
    const ctx = ensureContext();
    unlocked = true;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  async function play({ shotTime = 0 } = {}) {
    if (!unlocked) {
      return;
    }

    const ctx = ensureContext();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    scheduleCue(ctx.currentTime - shotTime);
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
    getImpactTime: () => score.explosion.start,
  };
}
