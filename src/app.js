import { Application, Assets } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { createIntroScene } from './scenes/IntroScene.js';
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

async function runIntro(app, frame) {
  const introScene = await createIntroScene();
  app.stage.addChild(introScene.container);

  let elapsed = 0;

  introScene.setStartHandler(() => {
    elapsed = 0;
  });

  const beginIntro = () => {
    if (introScene.isStarted()) {
      return;
    }

    frame.classList.remove('awaiting-start');
    introScene.start();
  };

  frame.classList.add('awaiting-start');
  frame.addEventListener('pointerdown', beginIntro);

  app.ticker.add((ticker) => {
    if (!introScene.isStarted()) {
      introScene.update(0);
      return;
    }

    elapsed += ticker.deltaMS / 1000;
    introScene.update(elapsed);
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

  await runIntro(app, frame);
  return app;
}
