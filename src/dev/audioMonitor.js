/**
 * Dev-only master output monitor. Taps Web Audio master gains and HTML
 * media elements so the dev panel can show a live 0–10 loudness meter.
 */

const analysers = new Set();
const mediaTaps = new WeakMap();
let mediaContext = null;
let activeLabel = 'Silent';

let smoothedLevel = 0;
let peakHold = 0;
let peakHoldUntil = 0;

/** Reference levels that map to 10 on the dev meter scale. */
const RMS_REFERENCE = 0.22;
const PEAK_REFERENCE = 0.9;

/**
 * Insert an analyser between a Web Audio master gain and the destination.
 * Call once when the master gain is created, before any other connections.
 */
export function installMasterTap(audioContext, masterGain) {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.75;

  masterGain.connect(analyser);
  analyser.connect(audioContext.destination);
  analysers.add(analyser);

  return analyser;
}

/**
 * Route an HTML audio element through a shared monitor context so brief SFX
 * appear on the master meter.
 */
export function installMediaTap(audioElement) {
  if (mediaTaps.has(audioElement)) {
    return;
  }

  if (!mediaContext) {
    mediaContext = new AudioContext();
  }

  const source = mediaContext.createMediaElementSource(audioElement);
  const analyser = mediaContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.75;

  source.connect(analyser);
  analyser.connect(mediaContext.destination);

  mediaTaps.set(audioElement, analyser);
  analysers.add(analyser);
}

/** Resume the shared HTML-media monitor context (requires a user gesture). */
export async function resumeMediaMonitorContext() {
  if (mediaContext?.state === 'suspended') {
    await mediaContext.resume();
  }
}

export function setActiveAudioLabel(label) {
  activeLabel = label || 'Silent';
}

export function getActiveAudioLabel() {
  return activeLabel;
}

function measureAnalyser(analyser) {
  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);

  let sumSq = 0;
  let peak = 0;

  for (let i = 0; i < buffer.length; i += 1) {
    const sample = buffer[i];
    sumSq += sample * sample;
    const abs = Math.abs(sample);
    if (abs > peak) {
      peak = abs;
    }
  }

  const rms = Math.sqrt(sumSq / buffer.length);
  const rmsLevel = Math.min(10, (rms / RMS_REFERENCE) * 10);
  const peakLevel = Math.min(10, (peak / PEAK_REFERENCE) * 10);

  return {
    rmsLevel,
    peakLevel,
    combined: Math.min(10, Math.max(rmsLevel, peakLevel * 0.9)),
  };
}

function sampleLevels() {
  if (analysers.size === 0) {
    return { level: 0, peak: 0 };
  }

  let maxCombined = 0;
  let maxPeak = 0;

  for (const analyser of analysers) {
    const { combined, peakLevel } = measureAnalyser(analyser);
    if (combined > maxCombined) {
      maxCombined = combined;
    }
    if (peakLevel > maxPeak) {
      maxPeak = peakLevel;
    }
  }

  return { level: maxCombined, peak: maxPeak };
}

/** Returns smoothed master level and a short peak hold for the dev meter UI. */
export function sampleSmoothedLevels() {
  const { level, peak } = sampleLevels();

  smoothedLevel = smoothedLevel * 0.82 + level * 0.18;

  const now = performance.now();
  if (peak > peakHold || now > peakHoldUntil) {
    peakHold = peak;
    peakHoldUntil = now + 1200;
  }

  if (level < 0.05) {
    peakHold *= 0.96;
  }

  return {
    level: smoothedLevel,
    peak: peakHold,
  };
}

export function resetMeterSmoothing() {
  smoothedLevel = 0;
  peakHold = 0;
  peakHoldUntil = 0;
}
