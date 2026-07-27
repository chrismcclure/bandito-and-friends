import { Application, Assets } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
import { createEpisodePlayer } from '../episode/EpisodePlayer.js';
import {
  EPISODE_01_EXPORT_CONFIG,
  frameIndexToTimeMs,
} from './episodeExportConfig.js';

const EXPORT_SCALE = EPISODE_01_EXPORT_CONFIG.width / CANVAS_WIDTH;

async function createExportStage() {
  await Assets.init();

  const app = new Application();

  await app.init({
    width: EPISODE_01_EXPORT_CONFIG.width,
    height: EPISODE_01_EXPORT_CONFIG.height,
    background: 0x000000,
    antialias: false,
    resolution: 1,
    autoDensity: false,
    roundPixels: true,
  });

  const canvas = app.canvas;
  canvas.style.display = 'block';
  canvas.style.imageRendering = 'pixelated';
  document.body.appendChild(canvas);

  const player = await createEpisodePlayer({ autoStart: false });
  player.container.scale.set(EXPORT_SCALE);
  app.stage.addChild(player.container);

  let renderPromise = Promise.resolve();

  function seekToTime(timeMs) {
    const timeSec = timeMs / 1000;
    player.seekToEpisodeTime(timeSec, { renderOnly: true });
    app.renderer.render(app.stage);

    renderPromise = new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  function seekToFrame(frameIndex) {
    seekToTime(frameIndexToTimeMs(frameIndex, EPISODE_01_EXPORT_CONFIG.fps));
  }

  async function waitForRender() {
    await renderPromise;
  }

  window.__BANDITO_EXPORT__ = {
    ready: true,
    width: EPISODE_01_EXPORT_CONFIG.width,
    height: EPISODE_01_EXPORT_CONFIG.height,
    fps: EPISODE_01_EXPORT_CONFIG.fps,
    durationSec: player.getTotalDuration(),
    seekToTime,
    seekToFrame,
    waitForRender,
  };

  seekToFrame(0);
}

createExportStage().catch((error) => {
  console.error('[ExportRenderPage] Failed to initialize', error);
  window.__BANDITO_EXPORT__ = {
    ready: false,
    error: error.message,
  };
});
