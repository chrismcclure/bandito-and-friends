/**
 * Episode registry — maps episode id to config objects.
 * Add EPISODE_02 here when creating the next episode.
 */
import { EPISODE_01 } from './episode-01.js';

/** All registered episodes. Add new entries here when creating Episode 2+. */
export const EPISODES = {
  [EPISODE_01.id]: EPISODE_01,
};

export function getEpisode(episodeId) {
  const episode = EPISODES[episodeId];

  if (!episode) {
    throw new Error(`Unknown episode: ${episodeId}`);
  }

  return episode;
}

export function listEpisodes() {
  return Object.values(EPISODES).sort((a, b) => a.number - b.number);
}
