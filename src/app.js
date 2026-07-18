import { Application, Assets } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { createIntroScene } from './scenes/IntroScene.js';
import { createOpeningCrawlScene } from './scenes/OpeningCrawlScene.js';
import { createThreatBoardPreviewScene } from './scenes/ThreatBoardPreviewScene.js';
import { getDevSceneId } from './dev/sceneParam.js';

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

async function runOpeningSequence(app, frame) {
  const crawlScene = createOpeningCrawlScene();
  const introScene = await createIntroScene();

  introScene.container.visible = false;
  app.stage.addChild(introScene.container, crawlScene.container);

  let phase = 'idle';
  let crawlElapsed = 0;
  let introElapsed = 0;

  crawlScene.setCompleteHandler(() => {
    phase = 'intro';
    introElapsed = 0;
    crawlScene.container.visible = false;
    introScene.container.visible = true;
    introScene.startFromTitle();
  });

  const begin = () => {
    if (phase !== 'idle') {
      return;
    }

    phase = 'crawl';
    frame.classList.remove('awaiting-start');
    introScene.unlockAudio();
    crawlScene.start();
  };

  frame.classList.add('awaiting-start');
  frame.addEventListener('pointerdown', begin);

  app.ticker.add((ticker) => {
    const delta = ticker.deltaMS / 1000;

    if (phase === 'idle') {
      crawlScene.update(0);
      introScene.update(0);
      return;
    }

    if (phase === 'crawl') {
      crawlElapsed += delta;
      crawlScene.update(crawlElapsed);
      return;
    }

    if (phase === 'intro') {
      introElapsed += delta;
      introScene.update(introElapsed);

      if (introScene.isComplete()) {
        phase = 'episode';
      }
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

  await runOpeningSequence(app, frame);
  return app;
}
