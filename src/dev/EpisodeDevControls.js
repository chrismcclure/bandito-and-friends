/** Development controls for reviewing episode shots. */

/**
 * Sidebar UI: play/pause, shot scrubber, loop, step, and optional MP4 export.
 * Works with EpisodePlayer and createFullSequencePlayer (same API).
 */
import { setActiveAudioLabel } from './audioMonitor.js';
import { createAudioMeterPanel } from './AudioMeterPanel.js';
import { createExportClient } from '../export/exportClient.js';
import { ACTIVE_EPISODE } from '../data/activeEpisode.js';

export function createEpisodeDevControls(
  player,
  { onHide, title = 'Show Dev Controls', enableExport = false } = {},
) {
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

  const children = [titleEl, status, shotSelect, buttonRow, meter.element];

  if (enableExport) {
    const exportSection = document.createElement('div');
    exportSection.className = 'episode-dev-controls__export';

    const exportTitle = document.createElement('div');
    exportTitle.className = 'episode-dev-controls__export-title';
    exportTitle.textContent = 'Video Export';

    const exportButton = document.createElement('button');
    exportButton.type = 'button';
    exportButton.textContent = `Export Episode ${ACTIVE_EPISODE.number} MP4`;
    exportButton.className = 'episode-dev-controls__export-button';

    const exportStatus = document.createElement('div');
    exportStatus.className = 'episode-dev-controls__export-status';
    exportStatus.textContent = 'Ready to export.';

    const exportProgress = document.createElement('div');
    exportProgress.className = 'episode-dev-controls__export-progress';
    exportProgress.hidden = true;

    const exportLink = document.createElement('a');
    exportLink.className = 'episode-dev-controls__export-link';
    exportLink.hidden = true;
    exportLink.textContent = 'Download MP4';
    exportLink.target = '_blank';
    exportLink.rel = 'noopener';

    const exportClient = createExportClient({
      onStatusChange: (state) => {
        exportButton.disabled = Boolean(state.exporting);

        if (state.error) {
          exportStatus.textContent = `Export failed: ${state.error}`;
          exportProgress.hidden = true;
          exportLink.hidden = true;
          return;
        }

        if (state.exporting || state.phase) {
          const frameDetail =
            state.currentFrame && state.totalFrames
              ? ` — frame ${state.currentFrame} of ${state.totalFrames}`
              : '';
          exportStatus.textContent = `${state.message || 'Exporting'}${frameDetail}`;
          exportProgress.hidden = false;
          exportProgress.textContent = state.percentLabel || '0%';
        }

        if (state.phase === 'complete') {
          exportStatus.textContent = `Export complete: ${state.outputPath || 'bandito-and-friends-episode-1.mp4'}`;
          exportProgress.textContent = '100%';
          exportLink.href = state.downloadUrl || '/api/export/download/episode-1';
          exportLink.hidden = false;
        }
      },
    });

    exportButton.addEventListener('click', async () => {
      exportLink.hidden = true;
      exportStatus.textContent = 'Checking export environment...';

      try {
        await exportClient.startExport();
      } catch (error) {
        exportStatus.textContent = `Export failed: ${error.message}`;
        exportButton.disabled = false;
      }
    });

    exportSection.append(
      exportTitle,
      exportButton,
      exportStatus,
      exportProgress,
      exportLink,
    );
    children.push(exportSection);
  }

  panel.append(...children);
  return { panel, updateStatus, meter };
}
