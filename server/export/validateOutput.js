import { statSync } from 'node:fs';
import { runCommand } from './checkFfmpeg.js';

/**
 * @typedef {Object} ExportValidation
 * @property {boolean} ok
 * @property {string[]} errors
 * @property {number} width
 * @property {number} height
 * @property {number} fps
 * @property {string} videoCodec
 * @property {string} audioCodec
 * @property {number} durationSec
 * @property {number} sizeBytes
 * @property {number} streamCount
 */

export function validateExportOutput({
  ffprobePath,
  outputPath,
  expectedWidth,
  expectedHeight,
  expectedFps,
  expectedDurationSec,
  durationToleranceSec = 0.5,
}) {
  const errors = [];
  const stats = statSync(outputPath);

  if (stats.size <= 0) {
    errors.push('Output file is empty');
  }

  const probeJson = runCommand(
    ffprobePath,
    [
      '-v',
      'error',
      '-show_entries',
      'stream=index,codec_type,codec_name,width,height,r_frame_rate:format=duration',
      '-of',
      'json',
      outputPath,
    ],
    { label: 'ffprobe' },
  );

  const probe = JSON.parse(probeJson);
  const streams = probe.streams ?? [];
  const videoStream = streams.find((stream) => stream.codec_type === 'video');
  const audioStream = streams.find((stream) => stream.codec_type === 'audio');
  const durationSec = Number(probe.format?.duration ?? 0);

  if (!videoStream) {
    errors.push('Missing video stream');
  }

  if (!audioStream) {
    errors.push('Missing audio stream');
  }

  if (streams.length > 2) {
    errors.push(`Expected 2 streams, found ${streams.length}`);
  }

  const width = Number(videoStream?.width ?? 0);
  const height = Number(videoStream?.height ?? 0);

  if (width !== expectedWidth) {
    errors.push(`Expected width ${expectedWidth}, got ${width}`);
  }

  if (height !== expectedHeight) {
    errors.push(`Expected height ${expectedHeight}, got ${height}`);
  }

  const fps = parseFrameRate(videoStream?.r_frame_rate);
  if (Math.abs(fps - expectedFps) > 0.05) {
    errors.push(`Expected ${expectedFps} FPS, got ${fps.toFixed(3)}`);
  }

  const videoCodec = videoStream?.codec_name ?? '';
  if (videoCodec !== 'h264') {
    errors.push(`Expected H.264 video codec, got ${videoCodec || 'unknown'}`);
  }

  const audioCodec = audioStream?.codec_name ?? '';
  if (audioCodec !== 'aac') {
    errors.push(`Expected AAC audio codec, got ${audioCodec || 'unknown'}`);
  }

  if (Math.abs(durationSec - expectedDurationSec) > durationToleranceSec) {
    errors.push(
      `Duration ${durationSec.toFixed(2)}s differs from expected ${expectedDurationSec.toFixed(2)}s`,
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    width,
    height,
    fps,
    videoCodec,
    audioCodec,
    durationSec,
    sizeBytes: stats.size,
    streamCount: streams.length,
  };
}

function parseFrameRate(rate) {
  if (!rate || !rate.includes('/')) {
    return Number(rate) || 0;
  }

  const [numerator, denominator] = rate.split('/').map(Number);
  if (!denominator) {
    return numerator;
  }

  return numerator / denominator;
}
