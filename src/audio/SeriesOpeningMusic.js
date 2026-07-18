import { buildSeriesOpeningMusicScore } from './seriesOpeningMusicScore.js';

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

export function createSeriesOpeningMusic(score = buildSeriesOpeningMusicScore()) {
  let audioContext = null;
  let masterGain = null;
  let channelGains = {};
  let noiseBuffer = null;
  let fadeTimer = null;
  let isPlaying = false;

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

    const sampleCount = ctx.sampleRate * 0.2;
    noiseBuffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < sampleCount; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    return noiseBuffer;
  }

  function scheduleTone(channel, startTime, duration, frequency, volumeScale = 1) {
    const ctx = ensureContext();
    const channelSettings = score.config.channels[channel];
    const destination = channelGains[channel];

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = channelSettings.type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    const peak = Math.max(volumeScale, 0.0002);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peak, startTime + 0.015);
    gain.gain.setValueAtTime(peak * 0.7, startTime + duration * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
  }

  function scheduleDrum(startTime, duration, kind) {
    const ctx = ensureContext();
    const destination = channelGains.drum;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    source.buffer = getNoiseBuffer();
    filter.type = 'highpass';
    filter.frequency.value = kind === 'snare' ? 1800 : 6500;

    const peak = kind === 'snare' ? 0.85 : 0.45;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peak, startTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    source.start(startTime);
    source.stop(startTime + duration + 0.02);
  }

  function scheduleNotes(startTime) {
    for (const note of score.notes) {
      const when = startTime + note.start;

      if (note.channel === 'drum') {
        scheduleDrum(when, note.duration, note.kind);
        continue;
      }

      scheduleTone(
        note.channel,
        when,
        note.duration,
        pitchToFrequency(note.pitch),
      );
    }
  }

  function clearFadeTimer() {
    if (fadeTimer) {
      clearTimeout(fadeTimer);
      fadeTimer = null;
    }
  }

  async function play() {
    const ctx = ensureContext();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    clearFadeTimer();
    isPlaying = true;
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(score.config.volume, ctx.currentTime);

    scheduleNotes(ctx.currentTime + 0.05);
  }

  function fadeOut(duration = 0.75) {
    if (!audioContext || !masterGain || !isPlaying) {
      return;
    }

    clearFadeTimer();
    const now = audioContext.currentTime;
    const currentVolume = masterGain.gain.value;

    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(currentVolume, 0.0001), now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    fadeTimer = setTimeout(() => {
      isPlaying = false;
      fadeTimer = null;
    }, duration * 1000 + 50);
  }

  function stop() {
    clearFadeTimer();
    isPlaying = false;

    if (audioContext) {
      audioContext.close().catch(() => {});
      audioContext = null;
      masterGain = null;
      channelGains = {};
      noiseBuffer = null;
    }
  }

  return { play, fadeOut, stop };
}
