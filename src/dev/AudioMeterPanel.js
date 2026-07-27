import {
  getActiveAudioLabel,
  resetMeterSmoothing,
  sampleSmoothedLevels,
} from './audioMonitor.js';

function levelBand(level) {
  if (level >= 8.5) {
    return 'hot';
  }
  if (level >= 5) {
    return 'ok';
  }
  if (level >= 0.5) {
    return 'low';
  }
  return 'silent';
}

/** Live master loudness meter for the episode dev controls panel. */
export function createAudioMeterPanel() {
  const section = document.createElement('div');
  section.className = 'episode-dev-controls__meter';

  const heading = document.createElement('div');
  heading.className = 'episode-dev-controls__meter-title';
  heading.textContent = 'Audio Monitor';

  const scale = document.createElement('div');
  scale.className = 'audio-meter__scale';
  scale.textContent = '0 ——— 5 ——— 10';

  const barTrack = document.createElement('div');
  barTrack.className = 'audio-meter__track';
  barTrack.setAttribute('aria-hidden', 'true');

  const barFill = document.createElement('div');
  barFill.className = 'audio-meter__fill';
  barTrack.appendChild(barFill);

  const readout = document.createElement('div');
  readout.className = 'audio-meter__readout';
  readout.textContent = 'Master 0.0 / 10';

  const peakReadout = document.createElement('div');
  peakReadout.className = 'audio-meter__peak';
  peakReadout.textContent = 'Peak 0.0';

  const label = document.createElement('div');
  label.className = 'audio-meter__label';
  label.textContent = 'Now: Silent';

  const hint = document.createElement('div');
  hint.className = 'audio-meter__hint';
  hint.textContent = 'Aim for 5–8 during playback. 10 = very loud.';

  section.append(heading, scale, barTrack, readout, peakReadout, label, hint);

  let rafId = null;

  function tick() {
    const { level, peak } = sampleSmoothedLevels();
    const band = levelBand(level);

    barFill.style.width = `${Math.min(100, (level / 10) * 100)}%`;
    barFill.dataset.level = band;
    readout.textContent = `Master ${level.toFixed(1)} / 10`;
    peakReadout.textContent = `Peak ${peak.toFixed(1)}`;
    label.textContent = `Now: ${getActiveAudioLabel()}`;

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function reset() {
    resetMeterSmoothing();
    barFill.style.width = '0%';
    barFill.dataset.level = 'silent';
    readout.textContent = 'Master 0.0 / 10';
    peakReadout.textContent = 'Peak 0.0';
  }

  return { element: section, start, stop, reset };
}
