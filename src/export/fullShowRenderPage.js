import { Application, Assets } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
import { createTitleMenuScene } from '../scenes/TitleMenuScene.js';
import { createSeriesOpeningScene } from '../scenes/SeriesOpeningScene.js';
import { createIntroScene } from '../scenes/IntroScene.js';
import { createEpisodePlayer } from '../episode/EpisodePlayer.js';
import { createNesPixelLoadTransition } from '../transitions/nesPixelLoadTransition.js';
import { createFullSequencePlayer } from '../dev/createFullSequencePlayer.js';
import { buildFullShowAudioTimeline } from './buildFullShowAudioTimeline.js';
import { EPISODE_01_EXPORT_CONFIG } from './episodeExportConfig.js';

const EXPORT_SCALE = 1;

async function createFullShowExportStage() {
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
  canvas.id = 'bandito-export-stage';
  canvas.style.display = 'block';
  canvas.style.imageRendering = 'pixelated';
  document.body.appendChild(canvas);

  const titleMenu = await createTitleMenuScene();
  const seriesOpening = await createSeriesOpeningScene();
  const introScene = await createIntroScene();
  const episodePlayer = await createEpisodePlayer({ autoStart: false });
  const pixelLoad = createNesPixelLoadTransition();

  const player = createFullSequencePlayer({
    titleMenu,
    pixelLoad,
    seriesOpening,
    introScene,
    episodePlayer,
  });

  const exportRoot = player.getExportContainer();
  exportRoot.scale.set(EXPORT_SCALE);
  app.stage.addChild(exportRoot);

  async function prepare() {
    player.seekToMasterTime(0, { renderOnly: true });
    app.renderer.render(app.stage);
    return {
      durationSec: player.getTotalDuration(),
      frameCount: Math.ceil(
        player.getTotalDuration() * EPISODE_01_EXPORT_CONFIG.fps,
      ),
    };
  }

  function renderFrame(timeMs) {
    player.seekToMasterTime(timeMs / 1000, { renderOnly: true });
    app.renderer.render(app.stage);
  }

  let captureQuality = 0.95;

  function captureJpegBase64(quality = captureQuality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to capture JPEG frame'));
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result;
            resolve(dataUrl.split(',')[1]);
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        quality,
      );
    });
  }

  function setCaptureQuality(quality) {
    captureQuality = quality;
  }

  function getAudioTimeline() {
    return buildFullShowAudioTimeline();
  }

  window.__BANDITO_EXPORT__ = {
    ready: false,
    width: EPISODE_01_EXPORT_CONFIG.width,
    height: EPISODE_01_EXPORT_CONFIG.height,
    stageWidth: CANVAS_WIDTH,
    stageHeight: CANVAS_HEIGHT,
    fps: EPISODE_01_EXPORT_CONFIG.fps,
    prepare,
    renderFrame,
    captureJpegBase64,
    setCaptureQuality,
    getAudioTimeline,
    async seekToTime(timeMs) {
      renderFrame(timeMs);
    },
    async waitForRender() {},
  };

  const prepared = await prepare();
  window.__BANDITO_EXPORT__.ready = true;
  window.__BANDITO_EXPORT__.durationSec = prepared.durationSec;
  window.__BANDITO_EXPORT__.frameCount = prepared.frameCount;
}

createFullShowExportStage().catch((error) => {
  console.error('[FullShowExport] Failed to initialize', error);
  window.__BANDITO_EXPORT__ = {
    ready: false,
    error: error.message,
  };
});
