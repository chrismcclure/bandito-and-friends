import { Application, Assets } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { createIntroScene } from './scenes/IntroScene.js';
import { createOpeningCrawlScene } from './scenes/OpeningCrawlScene.js';
import { createSeriesOpeningScene } from './scenes/SeriesOpeningScene.js';
import { createTitleMenuScene } from './scenes/TitleMenuScene.js';
import { createThreatBoardPreviewScene } from './scenes/ThreatBoardPreviewScene.js';
import { createEpisodePlayer } from './episode/EpisodePlayer.js';
import { createEpisodeDevControls } from './dev/EpisodeDevControls.js';
import { createFullSequencePlayer } from './dev/createFullSequencePlayer.js';
import { getDevSceneId, getDevShotIndex } from './dev/sceneParam.js';
import { createNesPixelLoadTransition } from './transitions/nesPixelLoadTransition.js';

const FRAME_BORDER = 1;

function fitCanvasToWindow(canvas) {
  const workspace = canvas.closest('.dev-workspace');
  const sidebar = workspace?.querySelector(
    '.episode-dev-controls:not(.episode-dev-controls--hidden)',
  );

  let availableWidth = window.innerWidth - FRAME_BORDER * 2;
  let availableHeight = window.innerHeight - FRAME_BORDER * 2;

  if (sidebar) {
    const stacked = window.matchMedia('(max-width: 720px)').matches;

    if (stacked) {
      availableHeight -= sidebar.offsetHeight + 16;
    } else {
      availableWidth -= sidebar.offsetWidth + 16;
    }
  }

  const scale = Math.min(
    availableWidth / CANVAS_WIDTH,
    availableHeight / CANVAS_HEIGHT,
  );
  const integerScale = Math.max(1, Math.floor(scale));

  canvas.style.width = `${CANVAS_WIDTH * integerScale}px`;
  canvas.style.height = `${CANVAS_HEIGHT * integerScale}px`;
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

function attachEpisodeDevControls(frame, player, options = {}) {
  const canvas = frame.querySelector('canvas');
  const refit = () => fitCanvasToWindow(canvas);

  const { panel } = createEpisodeDevControls(player, { onHide: refit, ...options });

  const workspace = document.createElement('div');
  workspace.className = 'dev-workspace';

  const parent = frame.parentElement;
  parent.replaceChild(workspace, frame);
  workspace.append(frame, panel);

  refit();
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
  attachEpisodeDevControls(frame, episodePlayer, {
    title: 'Episode 1 Dev Controls',
    enableExport: true,
  });

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

async function runTitleMenuOnly(app, frame) {
  const titleMenu = await createTitleMenuScene();
  titleMenu.container.visible = false;
  app.stage.addChild(titleMenu.container);

  let phase = 'idle';

  const begin = () => {
    if (phase !== 'idle') {
      return;
    }

    phase = 'title-menu';
    frame.classList.remove('awaiting-start');
    titleMenu.container.visible = true;
    titleMenu.unlockAudio();
    titleMenu.start();
  };

  frame.classList.add('awaiting-start');
  frame.addEventListener('pointerdown', begin);

  app.ticker.add((ticker) => {
    const delta = ticker.deltaMS / 1000;

    if (phase === 'idle') {
      titleMenu.update(0);
      return;
    }

    titleMenu.update(delta);
  });
}

async function runOpeningSequence(app, frame) {
  const titleMenu = await createTitleMenuScene();
  const seriesOpening = await createSeriesOpeningScene();
  const introScene = await createIntroScene();
  const episodePlayer = await createEpisodePlayer();
  const pixelLoad = createNesPixelLoadTransition();

  const fullPlayer = createFullSequencePlayer({
    titleMenu,
    pixelLoad,
    seriesOpening,
    introScene,
    episodePlayer,
  });

  app.stage.addChild(fullPlayer.getExportContainer());

  attachEpisodeDevControls(frame, fullPlayer, {
    title: 'Full Show Dev Controls',
  });

  const previewBeatIndex = getDevShotIndex();
  let awaitingStart = previewBeatIndex === null;

  const begin = () => {
    if (!awaitingStart) {
      return;
    }

    awaitingStart = false;
    frame.classList.remove('awaiting-start');
    fullPlayer.unlockAudio();
    fullPlayer.start();
  };

  if (previewBeatIndex !== null) {
    awaitingStart = false;
    frame.classList.remove('awaiting-start');
    fullPlayer.unlockAudio();
    fullPlayer.jumpToShot(previewBeatIndex, { loop: true });
  }

  frame.classList.add('awaiting-start');
  frame.addEventListener('pointerdown', begin);

  app.ticker.add((ticker) => {
    const delta = ticker.deltaMS / 1000;

    if (awaitingStart) {
      fullPlayer.update(0);
      return;
    }

    fullPlayer.update(delta);
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

  if (devScene === 'title-menu') {
    await runTitleMenuOnly(app, frame);
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
