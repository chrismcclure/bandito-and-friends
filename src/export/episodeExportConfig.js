import { getFullSequenceTotalDuration } from '../dev/fullSequenceTimeline.js';

export const EXPORT_FRAME_RATE = 30;

export const EPISODE_01_EXPORT_CONFIG = {
  id: 'episode-1',
  label: 'Episode 1 — Full Show',
  outputFilename: 'bandito-and-friends-episode-4-v4.mp4',
  width: 1080,
  height: 1920,
  fps: EXPORT_FRAME_RATE,
  renderPath: '/export/full-show.html',
  getDurationSec: getFullSequenceTotalDuration,
};

export function getExportFrameCount(durationSec, fps = EXPORT_FRAME_RATE) {
  return Math.ceil(durationSec * fps);
}

export function frameIndexToTimeMs(frameIndex, fps = EXPORT_FRAME_RATE) {
  return (frameIndex * 1000) / fps;
}

export function getEpisodeExportConfig(episodeId) {
  if (episodeId === EPISODE_01_EXPORT_CONFIG.id) {
    return EPISODE_01_EXPORT_CONFIG;
  }

  throw new Error(`Unknown episode export id: ${episodeId}`);
}
