/** Development controls for reviewing Episode 1 shots. */

export function createEpisodeDevControls(player, { onHide } = {}) {
  const panel = document.createElement('div');
  panel.className = 'episode-dev-controls';

  const title = document.createElement('div');
  title.className = 'episode-dev-controls__title';
  title.textContent = 'Episode 1 Dev Controls';

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
    makeButton('Restart', () => player.restart()),
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

  function updateStatus() {
    const info = player.getCurrentShotInfo();
    const shot = info.shot;
    status.innerHTML = [
      `<strong>${info.index + 1}/${player.getShots().length}</strong> ${shot.title}`,
      `Time ${info.episodeTime.toFixed(1)}s / ${info.totalDuration.toFixed(1)}s`,
      `Shot ${info.localTime.toFixed(1)}s / ${shot.duration.toFixed(1)}s`,
      shot.dialogue ? `Dialogue: "${shot.dialogue}"` : '',
      shot.onScreenText ? `On-screen: ${shot.onScreenText}` : '',
      `Asset: ${shot.assetPath ?? 'text-only'}`,
      `Status: ${shot.status ?? 'unknown'}`,
    ]
      .filter(Boolean)
      .join('<br>');
    shotSelect.value = String(info.index);
  }

  player.setShotChangeHandler(updateStatus);
  updateStatus();

  panel.append(title, status, shotSelect, buttonRow);
  return { panel, updateStatus };
}
