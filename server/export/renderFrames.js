import { mkdirSync, rmSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import {
  getExportFrameCount,
  frameIndexToTimeMs,
  EPISODE_01_EXPORT_CONFIG,
} from '../../src/export/episodeExportConfig.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../src/config.js';
import { createJpegFrameStreamEncoder } from './streamVideoEncoder.js';
import { runCommand } from './checkFfmpeg.js';

function createEmptyProfile() {
  return {
    browserLaunchMs: 0,
    pageLoadMs: 0,
    prepareMs: 0,
    frameCount: 0,
    seekMs: 0,
    captureMs: 0,
    pipeWriteMs: 0,
    frameTotalMs: [],
    ffmpegEncodeMs: 0,
    totalRenderMs: 0,
    concurrency: 1,
  };
}

function summarizeFrameTimes(frameTotalMs) {
  if (frameTotalMs.length === 0) {
    return { averageMs: 0, medianMs: 0, slowestMs: 0 };
  }

  const sorted = [...frameTotalMs].sort((a, b) => a - b);
  const averageMs =
    frameTotalMs.reduce((sum, value) => sum + value, 0) / frameTotalMs.length;
  const medianMs = sorted[Math.floor(sorted.length / 2)];
  const slowestMs = sorted[sorted.length - 1];

  return { averageMs, medianMs, slowestMs };
}

function splitFrameRanges(frameCount, concurrency) {
  const workers = Math.max(1, Math.min(concurrency, frameCount));
  const chunkSize = Math.ceil(frameCount / workers);
  const ranges = [];

  for (let offset = 0; offset < frameCount; offset += chunkSize) {
    ranges.push({
      offset,
      count: Math.min(chunkSize, frameCount - offset),
    });
  }

  return ranges;
}

async function renderFrameChunk({
  browser,
  ffmpegPath,
  baseUrl,
  renderPath,
  chunkVideoPath,
  width,
  height,
  fps,
  startFrame,
  frameCount,
  jpegQuality,
  profile,
}) {
  const renderUrl = new URL(renderPath, baseUrl).toString();
  const timings = createEmptyProfile();
  const chunkStartedAt = Date.now();

  const encoder = createJpegFrameStreamEncoder({
    ffmpegPath,
    outputPath: chunkVideoPath,
    width,
    height,
    sourceWidth: CANVAS_WIDTH,
    sourceHeight: CANVAS_HEIGHT,
    fps,
    jpegQuality,
  });

  const page = await browser.newPage({
    viewport: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
    deviceScaleFactor: 1,
  });

  const canvas = page.locator('#bandito-export-stage, canvas').first();

  try {
    const pageLoadStartedAt = Date.now();
    await page.goto(renderUrl, { waitUntil: 'domcontentloaded', timeout: 120_000 });
    await page.waitForFunction(
      () => window.__BANDITO_EXPORT__?.ready === true,
      undefined,
      { timeout: 180_000 },
    );
    timings.pageLoadMs = Date.now() - pageLoadStartedAt;

    const prepareStartedAt = Date.now();
    await page.evaluate(async () => {
      await window.__BANDITO_EXPORT__.prepare?.();
    });
    timings.prepareMs = Date.now() - prepareStartedAt;

    for (let offset = 0; offset < frameCount; offset += 1) {
      const frameIndex = startFrame + offset;
      const timeMs = frameIndexToTimeMs(frameIndex, fps);
      const frameStartedAt = Date.now();

      const seekStartedAt = Date.now();
      await page.evaluate((ms) => {
        window.__BANDITO_EXPORT__.renderFrame(ms);
      }, timeMs);
      timings.seekMs += Date.now() - seekStartedAt;

      const captureStartedAt = Date.now();
      const buffer = await canvas.screenshot({
        type: 'jpeg',
        quality: jpegQuality,
        animations: 'disabled',
      });
      timings.captureMs += Date.now() - captureStartedAt;

      const pipeStartedAt = Date.now();
      await encoder.writeFrame(buffer);
      timings.pipeWriteMs += Date.now() - pipeStartedAt;

      timings.frameTotalMs.push(Date.now() - frameStartedAt);
    }

    timings.frameCount = frameCount;
    const ffmpegStartedAt = Date.now();
    await encoder.finish();
    timings.ffmpegEncodeMs = Date.now() - ffmpegStartedAt;
    timings.totalRenderMs = Date.now() - chunkStartedAt;

    return {
      chunkVideoPath,
      profile: profile ? { ...timings, ...summarizeFrameTimes(timings.frameTotalMs) } : undefined,
    };
  } finally {
    await page.close();
  }
}

function concatVideoChunks({ ffmpegPath, chunkPaths, outputPath }) {
  const listPath = `${outputPath}.concat.txt`;
  const listBody = chunkPaths.map((path) => `file '${path}'`).join('\n');
  mkdirSync(join(outputPath, '..'), { recursive: true });
  writeFileSync(listPath, listBody);

  runCommand(
    ffmpegPath,
    [
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      listPath,
      '-c',
      'copy',
      outputPath,
    ],
    { label: 'ffmpeg (concat video)' },
  );

  rmSync(listPath, { force: true });
}

/**
 * Render frames via Playwright and stream JPEG buffers directly into FFmpeg.
 */
export async function renderEpisodeFrames({
  ffmpegPath,
  baseUrl,
  renderPath,
  videoOnlyPath,
  width,
  height,
  fps,
  startSec = 0,
  totalDurationSec,
  jpegQuality = 95,
  concurrency = 1,
  profile = false,
  onProgress,
}) {
  mkdirSync(join(videoOnlyPath, '..'), { recursive: true });

  const startFrame = Math.floor(startSec * fps);
  const frameCount = getExportFrameCount(totalDurationSec, fps);
  const ranges = splitFrameRanges(frameCount, concurrency);
  const chunkDir = join(videoOnlyPath, '..', 'chunks');
  mkdirSync(chunkDir, { recursive: true });

  const renderStartedAt = Date.now();
  let completedFrames = 0;
  const chunkProfiles = [];

  const browserStartedAt = Date.now();
  const browser = await chromium.launch({ headless: true });
  const browserLaunchMs = Date.now() - browserStartedAt;

  let chunkResults = [];
  let concatMs = 0;

  try {
    chunkResults = await Promise.all(
      ranges.map(async (range, chunkIndex) => {
        const chunkVideoPath = join(chunkDir, `chunk-${chunkIndex}.mp4`);
        const result = await renderFrameChunk({
          browser,
          ffmpegPath,
          baseUrl,
          renderPath,
          chunkVideoPath,
          width,
          height,
          fps,
          startFrame: startFrame + range.offset,
          frameCount: range.count,
          jpegQuality,
          profile,
        });

        completedFrames += range.count;
        onProgress?.({
          currentFrame: completedFrames,
          totalFrames: frameCount,
        });

        if (result.profile) {
          result.profile.browserLaunchMs = browserLaunchMs;
          chunkProfiles.push(result.profile);
        }

        return result.chunkVideoPath;
      }),
    );

    const concatStartedAt = Date.now();
    if (chunkResults.length === 1) {
      renameSync(chunkResults[0], videoOnlyPath);
    } else {
      concatVideoChunks({
        ffmpegPath,
        chunkPaths: chunkResults,
        outputPath: videoOnlyPath,
      });
    }
    concatMs = Date.now() - concatStartedAt;
  } finally {
    await browser.close();
  }

  const totalRenderMs = Date.now() - renderStartedAt;
  const mergedFrameTimes = chunkProfiles.flatMap((entry) => entry.frameTotalMs ?? []);
  const frameStats = summarizeFrameTimes(mergedFrameTimes);

  const aggregateProfile = profile
    ? {
        concurrency: ranges.length,
        frameCount,
        concatMs,
        totalRenderMs,
        chunkProfiles,
        ...frameStats,
        averageFrameMs: frameStats.averageMs,
        medianFrameMs: frameStats.medianMs,
        slowestFrameMs: frameStats.slowestMs,
      }
    : undefined;

  if (profile) {
    console.log('[ExportProfile]', aggregateProfile);
  }

  return {
    totalFrames: frameCount,
    videoOnlyPath,
    mode: concurrency > 1 ? `jpeg-pipe-x${ranges.length}` : 'jpeg-pipe',
    profile: aggregateProfile,
  };
}

export function cleanupFramesDir() {
  // No-op — JPEG pipe path does not write frame files.
}
