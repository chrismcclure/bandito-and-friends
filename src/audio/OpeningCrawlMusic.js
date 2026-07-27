import { buildOpeningCrawlMusicScore } from './openingCrawlMusicScore.js';
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

export function createOpeningCrawlMusic(score = buildOpeningCrawlMusicScore()) {
  let audioContext = null;
  let masterGain = null;
  let channelGains = {};

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

  function scheduleTone(channel, startTime, duration, frequency) {
    const ctx = ensureContext();
    const channelSettings = score.config.channels[channel];
    const destination = channelGains[channel];

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = channelSettings.type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.9, startTime + 0.02);
    gain.gain.setValueAtTime(0.55, startTime + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
  }

  async function play() {
    const ctx = ensureContext();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const startTime = ctx.currentTime + 0.05;

    for (const note of score.notes) {
      scheduleTone(
        note.channel,
        startTime + note.start,
        note.duration,
        pitchToFrequency(note.pitch),
      );
    }
  }

  function stop() {
    if (audioContext) {
      audioContext.close().catch(() => {});
      audioContext = null;
      masterGain = null;
      channelGains = {};
    }
  }

  return { play, stop };
}
