import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildEpisodeCardCueScore } from '../../src/audio/episodeCardCueScore.js';
import { buildIntroMusicScore } from '../../src/audio/introMusicScore.js';
import { buildSeriesOpeningMusicScore } from '../../src/audio/seriesOpeningMusicScore.js';
import {
  EPISODE_MUSIC_FILE_CUES,
  EPISODE_MUSIC_PROCEDURAL_CUES,
} from '../../src/audio/episodeMusicCues.js';

const PITCH_OFFSETS = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
const SAMPLE_RATE = 44100;
const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../..');
const AUDIO_DIR = join(ROOT_DIR, 'public/audio');

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
  if (type === 'triangle') {
    return (2 / Math.PI) * Math.asin(Math.sin(phase));
  }

  return Math.sin(phase) >= 0 ? 1 : -1;
}

function renderTone(samples, sampleRate, note, channel, amplitude) {
  const startSample = Math.floor(note.start * sampleRate);
  const endSample = Math.min(
    samples.length,
    Math.floor((note.start + note.duration + 0.03) * sampleRate),
  );
  const frequency = pitchToFrequency(note.pitch);
  const twoPiF = (2 * Math.PI * frequency) / sampleRate;
  const waveType = channel.type ?? 'square';

  for (let i = startSample; i < endSample; i += 1) {
    const time = (i - startSample) / sampleRate;
    const env = envelopeAt(time, note.duration);
    const phase = twoPiF * (i - startSample);
    samples[i] += waveSample(waveType, phase) * env * amplitude;
  }
}

function renderDrum(samples, sampleRate, note, amplitude) {
  const startSample = Math.floor(note.start * sampleRate);
  const endSample = Math.min(
    samples.length,
    Math.floor((note.start + note.duration + 0.03) * sampleRate),
  );
  const peak = note.kind === 'snare' ? 1 : 0.55;
  const decayScale = 0.45;

  for (let i = startSample; i < endSample; i += 1) {
    const time = (i - startSample) / sampleRate;
    const env = peak * Math.exp(-time / (note.duration * decayScale));
    const noise = Math.random() * 2 - 1;
    samples[i] += noise * env * amplitude;
  }
}

function writeWav(outputPath, samples, masterVolume) {
  mkdirSync(dirname(outputPath), { recursive: true });

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
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  writeFileSync(outputPath, Buffer.concat([header, data]));
}

function renderScoreToWav(score, outputPath) {
  const duration = score.config.loopDuration ?? score.config.duration;
  const sampleCount = Math.ceil(duration * SAMPLE_RATE);
  const samples = new Float32Array(sampleCount);

  for (const note of score.notes) {
    if (note.channel === 'drum' || note.channel === 'texture') {
      const amp = (score.config.channels[note.channel]?.volume ?? score.config.channels.drum?.volume ?? 1) * 0.35;
      renderDrum(samples, SAMPLE_RATE, note, amp);
      continue;
    }

    const channel = score.config.channels[note.channel];
    if (!channel || !note.pitch) {
      continue;
    }

    const amp = (channel.volume ?? 1) * 0.35;
    renderTone(samples, SAMPLE_RATE, note, channel, amp);
  }

  writeWav(outputPath, samples, score.config.volume);
  return outputPath;
}

function renderEpisodeCardCueWav(outputPath) {
  const score = buildEpisodeCardCueScore();
  const duration = score.config.duration;
  const sampleCount = Math.ceil(duration * SAMPLE_RATE);
  const samples = new Float32Array(sampleCount);

  for (const beep of score.beeps) {
    renderTone(
      samples,
      SAMPLE_RATE,
      { start: beep.start, duration: beep.duration, pitch: beep.pitch },
      score.config.channels.beep,
      (score.config.channels.beep.volume ?? 1) * 0.35,
    );
  }

  const charge = score.charge;
  const chargeStart = Math.floor(charge.start * SAMPLE_RATE);
  const chargeEnd = Math.min(
    samples.length,
    Math.floor((charge.start + charge.duration + 0.03) * SAMPLE_RATE),
  );
  const chargeChannel = score.config.channels.charge;
  const startFreq = pitchToFrequency(charge.pitchStart);
  const endFreq = pitchToFrequency(charge.pitchEnd);

  for (let i = chargeStart; i < chargeEnd; i += 1) {
    const time = (i - chargeStart) / SAMPLE_RATE;
    const progress = time / charge.duration;
    const freq = startFreq * (endFreq / startFreq) ** progress;
    const env = envelopeAt(time, charge.duration);
    const phase = ((2 * Math.PI * freq) / SAMPLE_RATE) * (i - chargeStart);
    samples[i] +=
      waveSample(chargeChannel.type ?? 'square', phase) *
      env *
      (chargeChannel.volume ?? 1) *
      0.35;
  }

  const explosion = score.explosion;
  const explosionStart = Math.floor(explosion.start * SAMPLE_RATE);
  const explosionEnd = Math.min(
    samples.length,
    Math.floor((explosion.start + explosion.noiseDuration + 0.03) * SAMPLE_RATE),
  );

  for (let i = explosionStart; i < explosionEnd; i += 1) {
    const time = (i - explosionStart) / SAMPLE_RATE;
    const env =
      time < 0.004
        ? time / 0.004
        : Math.exp(-(time - 0.004) / Math.max(explosion.noiseDuration * 0.35, 0.01));
    samples[i] +=
      (Math.random() * 2 - 1) *
      env *
      (score.config.channels.noise.volume ?? 1) *
      0.35;
  }

  renderTone(
    samples,
    SAMPLE_RATE,
    {
      start: explosion.start,
      duration: explosion.stabDuration,
      pitch: explosion.stabPitch,
    },
    score.config.channels.stab,
    (score.config.channels.stab.volume ?? 1) * 0.35,
  );

  renderTone(
    samples,
    SAMPLE_RATE,
    {
      start: explosion.start,
      duration: explosion.bassDuration,
      pitch: explosion.bassPitch,
    },
    score.config.channels.bass,
    (score.config.channels.bass.volume ?? 1) * 0.35,
  );

  writeWav(outputPath, samples, score.config.volume);
  return outputPath;
}

async function loadScoreBuilder(cue) {
  const meta = EPISODE_MUSIC_PROCEDURAL_CUES[cue];
  if (!meta) {
    throw new Error(`Unknown procedural cue: ${cue}`);
  }

  const modulePath = join(ROOT_DIR, 'src/audio', meta.scoreModule);
  const module = await import(pathToFileURL(modulePath).href);
  const buildScore = module[meta.buildScore];

  if (typeof buildScore !== 'function') {
    throw new Error(`Missing ${meta.buildScore} in ${meta.scoreModule}`);
  }

  return buildScore();
}

export function resolvePublicAudioPath(publicSrc) {
  return join(AUDIO_DIR, publicSrc.replace(/^\/audio\//, ''));
}

export async function ensureCueAudioFile(cue, cacheDir) {
  mkdirSync(cacheDir, { recursive: true });

  if (cue === 'episode-card-cue') {
    const outputPath = join(cacheDir, 'episode-card-cue.wav');
    if (!existsSync(outputPath)) {
      renderEpisodeCardCueWav(outputPath);
    }
    return outputPath;
  }

  const fileCue = EPISODE_MUSIC_FILE_CUES[cue];
  if (fileCue) {
    const outputPath = resolvePublicAudioPath(fileCue.src);
    if (!existsSync(outputPath)) {
      throw new Error(`Missing audio asset: ${outputPath}`);
    }
    return outputPath;
  }

  const procedural = EPISODE_MUSIC_PROCEDURAL_CUES[cue];
  if (procedural) {
    const outputPath = join(cacheDir, `${cue}.wav`);
    if (!existsSync(outputPath)) {
      const score = await loadScoreBuilder(cue);
      renderScoreToWav(score, outputPath);
    }
    return outputPath;
  }

  throw new Error(`Unsupported audio cue: ${cue}`);
}

export function getCueMixSettings(cue) {
  if (cue === 'episode-card-cue') {
    return { loop: false, volume: buildEpisodeCardCueScore().config.volume };
  }

  if (cue === 'intro-theme') {
    return { loop: true, volume: buildIntroMusicScore().config.volume };
  }

  if (cue === 'series-opening-music') {
    return { loop: false, volume: buildSeriesOpeningMusicScore().config.volume };
  }

  const fileCue = EPISODE_MUSIC_FILE_CUES[cue];
  if (fileCue) {
    return { loop: fileCue.loop ?? true, volume: fileCue.volume };
  }

  const procedural = EPISODE_MUSIC_PROCEDURAL_CUES[cue];
  if (procedural) {
    return { loop: procedural.loop ?? true, volume: 1 };
  }

  return { loop: false, volume: 1 };
}
