import { Application } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { createIntroScene } from './scenes/IntroScene.js';

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

export async function createApp(container) {
  const app = new Application();

  await app.init({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    background: 0x000000,
    antialias: false,
    resolution: 1,
    autoDensity: false,
  });

  const canvas = app.canvas;
  canvas.style.imageRendering = 'pixelated';

  const frame = document.createElement('div');
  frame.className = 'movie-frame';
  frame.appendChild(canvas);
  container.appendChild(frame);

  const introScene = await createIntroScene();
  app.stage.addChild(introScene.container);

  let elapsed = 0;
  app.ticker.add((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    introScene.update(elapsed);
  });

  fitCanvasToWindow(canvas);
  window.addEventListener('resize', () => fitCanvasToWindow(canvas));

  return app;
}
