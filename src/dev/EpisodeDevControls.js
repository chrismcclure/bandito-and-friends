/** Development controls for reviewing Episode 1 shots. */

import { setActiveAudioLabel } from './audioMonitor.js';
import { createAudioMeterPanel } from './AudioMeterPanel.js';

export function createEpisodeDevControls(player, { onHide, title = 'Show Dev Controls' } = {}) {
  const panel = document.createElement('div');
  panel.className = 'episode-dev-controls';

  const titleEl = document.createElement('div');
  titleEl.className = 'episode-dev-controls__title';
  titleEl.textContent = title;

  const status = document.createElement('div');
  status.className = 'episode-dev-controls__status';

  const shotSelect = document.createElement('select');
  shotSelect.className = 'episode-dev-controls__select';

  for (let index = 0; index < player.getShots().length; index += 1) {
    const shot = player.getShots()[index];
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${index + 1}. ${shot.id}`;
    shotSelect.appendChild(option);
  }

  const buttonRow = document.createElement('div');
  buttonRow.className = 'episode-dev-controls__buttons';

  const meter = createAudioMeterPanel();

  function makeButton(label, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
  }

  const buttons = [
    makeButton('Play', () => {
      player.resumeTimeline();
      player.resume();
      if (!player.isStarted()) {
        player.start();
      }
    }),
    makeButton('Pause', () => player.pause()),
    makeButton('Restart', () => {
      player.restart();
      meter.reset();
    }),
    makeButton('Prev', () => player.previousShot()),
    makeButton('Next', () => player.nextShot()),
    makeButton('Loop Shot', () => {
      const { index } = player.getCurrentShotInfo();
      player.jumpToShot(index, { loop: true });
    }),
    makeButton('Hide', () => {
      panel.classList.add('episode-dev-controls--hidden');
      onHide?.();
    }),
  ];

  for (const button of buttons) {
    buttonRow.appendChild(button);
  }

  shotSelect.addEventListener('change', () => {
    player.jumpToShot(Number(shotSelect.value));
    updateStatus();
  });

  function updateAudioLabel(shot) {
    if (shot.type === 'episode-card') {
      setActiveAudioLabel('episode-card-cue');
      return;
    }

    if (shot.musicCue) {
      setActiveAudioLabel(shot.musicCue);
      return;
    }

    setActiveAudioLabel('Silent');
  }

  function updateStatus() {
    const info = player.getCurrentShotInfo();
    const shot = info.shot;
    updateAudioLabel(shot);

    const detailLines = [
      `<strong>${info.index + 1}/${player.getShots().length}</strong> ${shot.title}`,
      shot.section ? `Section: ${shot.section}` : '',
      `Time ${info.episodeTime.toFixed(1)}s / ${info.totalDuration.toFixed(1)}s`,
      `Beat ${info.localTime.toFixed(1)}s / ${shot.duration.toFixed(1)}s`,
    ];

    if (shot.dialogue) {
      detailLines.push(`Dialogue: "${shot.dialogue}"`);
    }

    if (shot.onScreenText) {
      detailLines.push(`On-screen: ${shot.onScreenText}`);
    }

    if (shot.assetPath) {
      detailLines.push(`Asset: ${shot.assetPath}`);
    }

    if (shot.status) {
      detailLines.push(`Status: ${shot.status}`);
    }

    status.innerHTML = detailLines.filter(Boolean).join('<br>');
    shotSelect.value = String(info.index);
  }

  player.setShotChangeHandler(updateStatus);
  updateStatus();

  meter.start();

  panel.append(titleEl, status, shotSelect, buttonRow, meter.element);
  return { panel, updateStatus, meter };
}
