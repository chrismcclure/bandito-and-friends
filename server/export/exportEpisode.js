/**
 * Server-side MP4 export pipeline.
 *
 * Steps: render frames (Playwright) → mix audio (FFmpeg) → encode H.264 → validate.
 * Progress is reported via SSE to the browser export button.
 */
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getEpisodeExportConfig } from '../../src/export/episodeExportConfig.js';
import { getFullShowTestRanges } from '../../src/export/buildFullShowAudioTimeline.js';
import { checkFfmpeg } from './checkFfmpeg.js';
import { mixEpisodeAudio } from './mixAudio.js';
import { renderEpisodeFrames, cleanupFramesDir } from './renderFrames.js';
import { muxVideoAndAudio } from './streamVideoEncoder.js';
import { validateExportOutput } from './validateOutput.js';
import {
  EXPORT_PHASES,
  EXPORT_STATUS_LABELS,
} from './exportTypes.js';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../..');

let activeJob = null;

function getExportPaths(episodeId) {
  const exportRoot = join(ROOT_DIR, 'exports', episodeId);
  return {
    exportRoot,
    audioDir: join(exportRoot, 'audio'),
    mixedAudioPath: join(exportRoot, 'audio', 'mixed.wav'),
    videoOnlyPath: join(exportRoot, 'video-only.mp4'),
    outputPath: join(exportRoot, getEpisodeExportConfig(episodeId).outputFilename),
  };
}

function reportProgress(onProgress, partial) {
  onProgress?.(partial);
}

function resolveExportRange({
  fullDurationSec,
  testDurationSec,
  startSec,
  endSec,
  testId,
}) {
  if (testId) {
    const ranges = getFullShowTestRanges();
    const range = ranges[testId];
    if (!range) {
      throw new Error(`Unknown export test id: ${testId}`);
    }

    return {
      startSec: range.startSec,
      exportDurationSec: range.endSec - range.startSec,
      label: range.label,
    };
  }

  if (startSec != null || endSec != null) {
    const resolvedStart = startSec ?? 0;
    const resolvedEnd = endSec ?? fullDurationSec;
    return {
      startSec: resolvedStart,
      exportDurationSec: resolvedEnd - resolvedStart,
      label: `Custom range ${resolvedStart.toFixed(2)}s–${resolvedEnd.toFixed(2)}s`,
    };
  }

  if (testDurationSec != null) {
    return {
      startSec: 0,
      exportDurationSec: Math.min(testDurationSec, fullDurationSec),
      label: `First ${testDurationSec}s`,
    };
  }

  return {
    startSec: 0,
    exportDurationSec: fullDurationSec,
    label: 'Full show',
  };
}

/**
 * @param {import('./exportTypes.js').ExportJobOptions} options
 * @returns {Promise<import('./exportTypes.js').ExportJobResult>}
 */
export async function exportEpisode({
  episodeId,
  baseUrl = 'http://127.0.0.1:5173',
  testDurationSec = null,
  startSec = null,
  endSec = null,
  testId = null,
  concurrency = 2,
  profile = false,
  onProgress,
}) {
  if (activeJob) {
    throw new Error('Another export is already in progress');
  }

  const startedAt = Date.now();
  const config = getEpisodeExportConfig(episodeId);
  const fullDurationSec = config.getDurationSec();
  const range = resolveExportRange({
    fullDurationSec,
    testDurationSec,
    startSec,
    endSec,
    testId,
  });
  const paths = getExportPaths(episodeId);
  const ffmpegCheck = checkFfmpeg();

  activeJob = { episodeId, startedAt };

  try {
    reportProgress(onProgress, {
      phase: EXPORT_PHASES.PREPARING,
      message: EXPORT_STATUS_LABELS[EXPORT_PHASES.PREPARING],
      percent: 0,
    });

    if (!ffmpegCheck.ok) {
      throw new Error(ffmpegCheck.error);
    }

    mkdirSync(paths.exportRoot, { recursive: true });
    mkdirSync(paths.audioDir, { recursive: true });

    const frameCount = Math.ceil(range.exportDurationSec * config.fps);

    console.log('[Export] Starting', {
      episodeId,
      label: range.label,
      startSec: range.startSec,
      durationSec: range.exportDurationSec,
      fullDurationSec,
      resolution: `${config.width}x${config.height}`,
      fps: config.fps,
      frameCount,
      outputPath: paths.outputPath,
      profile,
    });

    const frameWeight = 0.72;
    const audioWeight = 0.12;
    const encodeWeight = 0.1;

    const renderResult = await renderEpisodeFrames({
      ffmpegPath: ffmpegCheck.ffmpegPath,
      baseUrl,
      renderPath: config.renderPath,
      videoOnlyPath: paths.videoOnlyPath,
      width: config.width,
      height: config.height,
      fps: config.fps,
      startSec: range.startSec,
      totalDurationSec: range.exportDurationSec,
      concurrency,
      profile,
      onProgress: ({ currentFrame, totalFrames }) => {
        const framePercent = (currentFrame / totalFrames) * frameWeight * 100;
        reportProgress(onProgress, {
          phase: EXPORT_PHASES.RENDERING_FRAMES,
          message: `Rendering frame ${currentFrame} of ${totalFrames}`,
          percent: Math.round(framePercent),
          currentFrame,
          totalFrames,
        });
      },
    });

    reportProgress(onProgress, {
      phase: EXPORT_PHASES.MIXING_AUDIO,
      message: EXPORT_STATUS_LABELS[EXPORT_PHASES.MIXING_AUDIO],
      percent: Math.round(frameWeight * 100),
    });

    console.log('[Export] Mixing audio');
    await mixEpisodeAudio({
      ffmpegPath: ffmpegCheck.ffmpegPath,
      outputPath: paths.mixedAudioPath,
      audioDir: paths.audioDir,
      totalDurationSec: range.exportDurationSec,
      startSec: range.startSec,
    });

    reportProgress(onProgress, {
      phase: EXPORT_PHASES.ENCODING,
      message: EXPORT_STATUS_LABELS[EXPORT_PHASES.ENCODING],
      percent: Math.round((frameWeight + audioWeight) * 100),
    });

    console.log('[Export] Muxing MP4');
    await muxVideoAndAudio({
      ffmpegPath: ffmpegCheck.ffmpegPath,
      videoPath: paths.videoOnlyPath,
      audioPath: paths.mixedAudioPath,
      outputPath: paths.outputPath,
    });

    reportProgress(onProgress, {
      phase: EXPORT_PHASES.VALIDATING,
      message: EXPORT_STATUS_LABELS[EXPORT_PHASES.VALIDATING],
      percent: Math.round((frameWeight + audioWeight + encodeWeight) * 100),
    });

    const validation = validateExportOutput({
      ffprobePath: ffmpegCheck.ffprobePath,
      outputPath: paths.outputPath,
      expectedWidth: config.width,
      expectedHeight: config.height,
      expectedFps: config.fps,
      expectedDurationSec: range.exportDurationSec,
    });

    if (!validation.ok) {
      throw new Error(validation.errors.join('; '));
    }

    cleanupFramesDir();
    try {
      rmSync(paths.mixedAudioPath);
      rmSync(paths.videoOnlyPath);
    } catch {
      // Keep intermediates if cleanup fails.
    }

    const durationMs = Date.now() - startedAt;
    console.log('[Export] Complete', {
      outputPath: paths.outputPath,
      durationMs,
      validation,
      profile: renderResult.profile,
    });

    reportProgress(onProgress, {
      phase: EXPORT_PHASES.COMPLETE,
      message: EXPORT_STATUS_LABELS[EXPORT_PHASES.COMPLETE],
      percent: 100,
      outputPath: paths.outputPath,
    });

    return {
      ok: true,
      outputPath: paths.outputPath,
      validation,
      durationMs,
      profile: renderResult.profile,
      range,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Export] Failed', message);

    reportProgress(onProgress, {
      phase: EXPORT_PHASES.FAILED,
      message: EXPORT_STATUS_LABELS[EXPORT_PHASES.FAILED],
      percent: 0,
      error: message,
    });

    return {
      ok: false,
      outputPath: paths.outputPath,
      error: message,
      durationMs: Date.now() - startedAt,
    };
  } finally {
    activeJob = null;
  }
}

export function getActiveExportJob() {
  return activeJob;
}

export function getExportOutputInfo(episodeId) {
  const paths = getExportPaths(episodeId);
  return {
    outputPath: paths.outputPath,
    downloadUrl: `/api/export/download/${episodeId}`,
  };
}
