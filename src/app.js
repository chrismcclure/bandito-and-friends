import { Application, Assets } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { createIntroScene } from './scenes/IntroScene.js';
import { createOpeningCrawlScene } from './scenes/OpeningCrawlScene.js';
import { createSeriesOpeningScene } from './scenes/SeriesOpeningScene.js';
import { createThreatBoardPreviewScene } from './scenes/ThreatBoardPreviewScene.js';
import { createEpisodePlayer } from './episode/EpisodePlayer.js';
import { createEpisodeDevControls } from './dev/EpisodeDevControls.js';
import { getDevSceneId, getDevShotIndex } from './dev/sceneParam.js';

const FRAME_BORDER = 1;

function fitCanvasToWindow(canvas) {
  const availableWidth = window.innerWidth - FRAME_BORDER * 2;
  const availableHeight = window.innerHeight - FRAME_BORDER * 2;
  const scale = Math.min(
    availableWidth / CANVAS_WIDTH,
    availableHeight / CANVAS_HEIGHT,
  );

  canvas.style.width = `${Math.floor(CANVAS_WIDTH * scale)}px`;
  canvas.style.height = `${Math.floor(CANVAS_HEIGHT * scale)}px`;
}

async function createStage(container) {
  await Assets.init();

  const app = new Application();

  await app.init({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    background: 0x000000,
    antialias: false,
    resolution: 1,
    autoDensity: false,
    roundPixels: true,
  });

  const canvas = app.canvas;
  canvas.style.imageRendering = 'pixelated';

  const frame = document.createElement('div');
  frame.className = 'movie-frame';
  frame.appendChild(canvas);
  container.appendChild(frame);

  fitCanvasToWindow(canvas);
  window.addEventListener('resize', () => fitCanvasToWindow(canvas));

  return { app, frame, canvas };
}

function attachEpisodeDevControls(frame, player) {
  const { panel } = createEpisodeDevControls(player);
  frame.appendChild(panel);
}

async function runOpeningCrawlOnly(app, frame) {
  const crawlScene = createOpeningCrawlScene();
  app.stage.addChild(crawlScene.container);

  let elapsed = 0;

  const begin = () => {
    if (crawlScene.isStarted()) {
      return;
    }

    frame.classList.remove('awaiting-start');
    crawlScene.start();
  };

  frame.classList.add('awaiting-start');
  frame.addEventListener('pointerdown', begin);

  app.ticker.add((ticker) => {
    if (!crawlScene.isStarted()) {
      crawlScene.update(0);
      return;
    }

    elapsed += ticker.deltaMS / 1000;
    crawlScene.update(elapsed);
  });
}

function previewShot(player, shotIndex) {
  if (shotIndex === null) {
    player.update(0);
    return;
  }

  player.jumpToShot(shotIndex, { loop: true });
}

async function runSeriesOpeningOnly(app, frame) {
  const openingScene = await createSeriesOpeningScene();
  const previewShotIndex = getDevShotIndex();
  openingScene.container.visible = Boolean(previewShotIndex !== null);
  app.stage.addChild(openingScene.container);
  attachEpisodeDevControls(frame, openingScene);

  let phase = previewShotIndex !== null ? 'opening' : 'idle';

  const begin = () => {
    if (phase !== 'idle' && phase !== 'opening') {
      return;
    }

    phase = 'opening';
    frame.classList.remove('awaiting-start');
    openingScene.container.visible = true;

    if (previewShotIndex !== null) {
      openingScene.jumpToShot(previewShotIndex, { loop: true });
      return;
    }

    openingScene.start();
  };

  if (previewShotIndex !== null) {
    previewShot(openingScene, previewShotIndex);
  }

  frame.classList.add('awaiting-start');
  frame.addEventListener('pointerdown', begin);

  app.ticker.add((ticker) => {
    const delta = ticker.deltaMS / 1000;

    if (phase === 'idle') {
      previewShot(openingScene, previewShotIndex);
      return;
    }

    if (previewShotIndex !== null) {
      openingScene.update(delta);
      return;
    }

    openingScene.update(delta);
  });
}

async function runEpisodeOnly(app, frame) {
  const episodePlayer = await createEpisodePlayer();
  const previewShotIndex = getDevShotIndex();
  episodePlayer.container.visible = Boolean(previewShotIndex !== null);
  app.stage.addChild(episodePlayer.container);
  attachEpisodeDevControls(frame, episodePlayer);

  let phase = previewShotIndex !== null ? 'episode' : 'idle';

  const begin = () => {
    if (phase !== 'idle' && phase !== 'episode') {
      return;
    }

    phase = 'episode';
    frame.classList.remove('awaiting-start');
    episodePlayer.container.visible = true;
    episodePlayer.unlockAudio();

    if (previewShotIndex !== null) {
      episodePlayer.jumpToShot(previewShotIndex, { loop: true });
      return;
    }

    episodePlayer.start();
  };

  if (previewShotIndex !== null) {
    previewShot(episodePlayer, previewShotIndex);
  }

  frame.classList.add('awaiting-start');
  frame.addEventListener('pointerdown', begin);

  app.ticker.add((ticker) => {
    const delta = ticker.deltaMS / 1000;

    if (phase === 'idle') {
      previewShot(episodePlayer, previewShotIndex);
      return;
    }

    if (previewShotIndex !== null) {
      episodePlayer.update(delta);
      return;
    }

    episodePlayer.update(delta);
  });
}

async function runOpeningSequence(app, frame) {
  const seriesOpening = await createSeriesOpeningScene();
  const introScene = await createIntroScene();
  const episodePlayer = await createEpisodePlayer();

  introScene.container.visible = false;
  episodePlayer.container.visible = false;
  seriesOpening.container.visible = false;
  app.stage.addChild(
    introScene.container,
    episodePlayer.container,
    seriesOpening.container,
  );
  attachEpisodeDevControls(frame, episodePlayer);

  let phase = 'idle';
  let introElapsed = 0;

  seriesOpening.setCompleteHandler(() => {
    phase = 'title';
    introElapsed = 0;
    seriesOpening.container.visible = false;
    introScene.container.visible = true;
    introScene.startEpisodeTitle();
  });

  introScene.setCompleteHandler(() => {
    phase = 'episode';
    introElapsed = 0;
    introScene.container.visible = false;
    episodePlayer.container.visible = true;
    episodePlayer.start();
  });

  const begin = () => {
    if (phase !== 'idle') {
      return;
    }

    phase = 'opening';
    frame.classList.remove('awaiting-start');
    introScene.unlockAudio();
    episodePlayer.unlockAudio();
    seriesOpening.container.visible = true;
    seriesOpening.start();
  };

  frame.classList.add('awaiting-start');
  frame.addEventListener('pointerdown', begin);

  app.ticker.add((ticker) => {
    const delta = ticker.deltaMS / 1000;

    if (phase === 'idle') {
      seriesOpening.update(0);
      introScene.update(0);
      episodePlayer.update(0);
      return;
    }

    if (phase === 'opening') {
      seriesOpening.update(delta);
      return;
    }

    if (phase === 'title') {
      introElapsed += delta;
      introScene.update(introElapsed);

      if (introScene.isComplete()) {
        phase = 'episode';
      }
      return;
    }

    if (phase === 'episode') {
      episodePlayer.update(delta);
    }
  });
}

async function runThreatBoardPreview(app) {
  const previewScene = createThreatBoardPreviewScene();
  app.stage.addChild(previewScene.container);

  app.ticker.add(() => {
    previewScene.update();
  });
}

export async function createApp(container) {
  const { app, frame } = await createStage(container);
  const devScene = getDevSceneId();

  if (devScene === 'threat-board') {
    await runThreatBoardPreview(app);
    return app;
  }

  if (devScene === 'crawl') {
    await runOpeningCrawlOnly(app, frame);
    return app;
  }

  if (devScene === 'opening') {
    await runSeriesOpeningOnly(app, frame);
    return app;
  }

  if (devScene === 'episode') {
    await runEpisodeOnly(app, frame);
    return app;
  }

  await runOpeningSequence(app, frame);
  return app;
}
