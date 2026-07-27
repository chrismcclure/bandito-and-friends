/**
 * Offline render of a chiptune score to a listenable WAV file.
 * Usage: node scripts/export-music-wav.js [score-module] [output-filename]
 *
 * Example:
 *   node scripts/export-music-wav.js bossBattleMusicScore.js boss-battle-loop.wav
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

function envelopeAt(time, duration, envelopeType = 'chiptune') {
  if (envelopeType === 'soft') {
    const attack = 0.045;
    const sustainLevel = 0.55;

    if (time < attack) {
      return (time / attack) * sustainLevel;
    }

    const releaseStart = duration * 0.62;
    if (time < releaseStart) {
      return sustainLevel;
    }

    if (time >= duration) {
      return 0;
    }

    const progress = (time - releaseStart) / (duration - releaseStart);
    return sustainLevel * (1 - progress) ** 2;
  }

  if (envelopeType === 'pluck') {
    const attack = 0.006;
    if (time < attack) {
      return time / attack;
    }

    return Math.exp(-(time - attack) / Math.max(duration * 0.38, 0.05));
  }

  if (envelopeType === 'bass') {
    const attack = 0.035;
    const sustainLevel = 0.62;

    if (time < attack) {
      return (time / attack) * sustainLevel;
    }

    const releaseStart = duration * 0.7;
    if (time < releaseStart) {
      return sustainLevel;
    }

    if (time >= duration) {
      return 0;
    }

    const progress = (time - releaseStart) / (duration - releaseStart);
    return sustainLevel * (1 - progress) ** 1.8;
  }

  const attack = 0.01;
  const sustainLevel = 0.75;

  if (time < attack) {
    const t = time / attack;
    return 0.0002 * 2 ** (Math.log2(Math.max(sustainLevel, 0.0002) / 0.0002) * t);
  }

  const decayStart = duration * 0.55;
  if (time < decayStart) {
    return sustainLevel;
  }

  if (time >= duration) {
    return 0;
  }

  const progress = (time - decayStart) / (duration - decayStart);
  return sustainLevel * (1 - progress) ** 3;
}

function waveSample(type, phase) {
  if (type === 'sine') {
    return Math.sin(phase);
  }

  if (type === 'sawtooth') {
    const wrapped = (phase / (2 * Math.PI)) % 1;
    const unit = wrapped < 0 ? wrapped + 1 : wrapped;
    return 2 * unit - 1;
  }

  if (type === 'triangle') {
    return (2 / Math.PI) * Math.asin(Math.sin(phase));
  }

  return Math.sin(phase) >= 0 ? 1 : -1;
}

function renderTone(samples, sampleRate, note, channel, amplitude) {
  const startSample = Math.floor(note.start * sampleRate);
  const endSample = Math.min(
    samples.length,
    Math.floor((note.start + note.duration + 0.02) * sampleRate),
  );
  const frequency = pitchToFrequency(note.pitch);
  const twoPiF = (2 * Math.PI * frequency) / sampleRate;
  const envelopeType = channel.envelope ?? 'chiptune';
  const waveType = channel.type;

  for (let i = startSample; i < endSample; i += 1) {
    const time = (i - startSample) / sampleRate;
    const env = envelopeAt(time, note.duration, envelopeType);
    const phase = twoPiF * (i - startSample);
    samples[i] += waveSample(waveType, phase) * env * amplitude;
  }
}

function renderDrum(samples, sampleRate, note, amplitude) {
  const startSample = Math.floor(note.start * sampleRate);
  const endSample = Math.min(
    samples.length,
    Math.floor((note.start + note.duration + 0.02) * sampleRate),
  );
  const peak =
    note.kind === 'brush' ? 0.35 : note.kind === 'snare' ? 1 : 0.65;
  const decayScale = note.kind === 'brush' ? 0.85 : 0.45;

  for (let i = startSample; i < endSample; i += 1) {
    const time = (i - startSample) / sampleRate;
    const env = peak * Math.exp(-time / (note.duration * decayScale));
    const noise = Math.random() * 2 - 1;
    samples[i] += noise * env * amplitude;
  }
}

function applyMasterFade(samples, sampleRate, fadeInSec = 0, fadeOutSec = 0) {
  if (fadeInSec > 0) {
    const fadeInSamples = Math.floor(fadeInSec * sampleRate);
    for (let i = 0; i < fadeInSamples && i < samples.length; i += 1) {
      samples[i] *= i / fadeInSamples;
    }
  }

  if (fadeOutSec > 0) {
    const fadeOutSamples = Math.floor(fadeOutSec * sampleRate);
    const fadeStart = Math.max(0, samples.length - fadeOutSamples);
    for (let i = fadeStart; i < samples.length; i += 1) {
      samples[i] *= (samples.length - i) / fadeOutSamples;
    }
  }
}

function floatTo16BitWav(samples, sampleRate, masterVolume) {
  let peak = 0;

  for (let i = 0; i < samples.length; i += 1) {
    peak = Math.max(peak, Math.abs(samples[i]));
  }

  const normalize = peak > 0 ? 0.92 / peak : 1;
  const data = Buffer.alloc(samples.length * 2);

  for (let i = 0; i < samples.length; i += 1) {
    const value = Math.max(-1, Math.min(1, samples[i] * normalize * masterVolume));
    data.writeInt16LE(Math.round(value * 32767), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}

async function main() {
  const scoreModule = process.argv[2] ?? 'bossBattleMusicScore.js';
  const outputName = process.argv[3] ?? 'boss-battle-loop.wav';
  const scorePath = join(dirname(fileURLToPath(import.meta.url)), `../src/audio/${scoreModule}`);
  const scoreModuleExports = await import(scorePath);
  const buildScore = Object.values(scoreModuleExports).find(
    (value) => typeof value === 'function' && value.name.startsWith('build'),
  );

  if (!buildScore) {
    throw new Error(`No build* score function found in ${scoreModule}`);
  }

  const score = buildScore();

  const sampleRate = 44100;
  const sampleCount = Math.ceil(score.config.loopDuration * sampleRate);
  const samples = new Float32Array(sampleCount);

  for (const note of score.notes) {
    if (note.channel === 'drum') {
      const amp = (score.config.channels.drum.volume ?? 1) * 0.35;
      renderDrum(samples, sampleRate, note, amp);
      continue;
    }

    const channel = score.config.channels[note.channel];
    if (!channel) {
      continue;
    }

    const amp = (channel.volume ?? 1) * 0.35;
    renderTone(samples, sampleRate, note, channel, amp);
  }

  applyMasterFade(
    samples,
    sampleRate,
    score.config.fadeIn ?? 0,
    score.config.fadeOut ?? 0,
  );

  const outputDir = join(
    dirname(fileURLToPath(import.meta.url)),
    '../public/audio/music',
  );
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, outputName);
  const wav = floatTo16BitWav(samples, sampleRate, score.config.volume);

  writeFileSync(outputPath, wav);
  console.log(`Wrote ${outputPath} (${score.config.loopDuration.toFixed(2)}s loop)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
