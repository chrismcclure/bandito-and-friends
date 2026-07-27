/**
 * Export configuration — resolution, frame rate, output filename.
 * One config per registered episode; looked up by exportId (e.g. 'episode-1').
 */
import { getFullSequenceTotalDuration } from '../dev/fullSequenceTimeline.js';
import { ACTIVE_EPISODE } from '../data/activeEpisode.js';
import { EPISODES } from '../data/episodes/registry.js';

export const EXPORT_FRAME_RATE = 30;

export function createEpisodeExportConfig(episode) {
  return {
    id: episode.exportId,
    label: `Episode ${episode.number} — Full Show`,
    outputFilename: `bandito-and-friends-episode-${episode.number}.mp4`,
    width: 1080,
    height: 1920,
    fps: EXPORT_FRAME_RATE,
    renderPath: '/export/full-show.html',
    getDurationSec: getFullSequenceTotalDuration,
  };
}

/** @deprecated Use createEpisodeExportConfig(ACTIVE_EPISODE) */
export const EPISODE_01_EXPORT_CONFIG = createEpisodeExportConfig(ACTIVE_EPISODE);

export function getExportFrameCount(durationSec, fps = EXPORT_FRAME_RATE) {
  return Math.ceil(durationSec * fps);
}

export function frameIndexToTimeMs(frameIndex, fps = EXPORT_FRAME_RATE) {
  return (frameIndex * 1000) / fps;
}

export function getEpisodeExportConfig(episodeId) {
  const episode = Object.values(EPISODES).find(
    (entry) => entry.exportId === episodeId || entry.id === episodeId,
  );

  if (!episode) {
    throw new Error(`Unknown episode export id: ${episodeId}`);
  }

  return createEpisodeExportConfig(episode);
}
