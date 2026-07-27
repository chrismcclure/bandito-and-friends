import {
  EPISODE_01_ASSET_BASE,
  EPISODE_01_EPISODE_CARD_SHOT_INDEX,
  EPISODE_01_FINALS_BASE,
  EPISODE_01_INTRO_TIMING,
  EPISODE_01_SHOT_DEFAULTS,
  EPISODE_01_SHOTS,
} from '../episode-01-shots.js';

/**
 * Bundles Episode 1 metadata for the episode engine.
 * The registry imports this; ACTIVE_EPISODE points here by default.
 */
/** Episode 1 — The Sock Monster */
export const EPISODE_01 = {
  id: 'episode-01',
  number: 1,
  title: 'The Sock Monster',
  exportId: 'episode-1',
  storyFile: 'episode-01-the-sock-monster.md',
  assetBase: EPISODE_01_ASSET_BASE,
  finalsBase: EPISODE_01_FINALS_BASE,
  introTiming: EPISODE_01_INTRO_TIMING,
  meetTheTeamShotCount: 4,
  episodeCardShotIndex: EPISODE_01_EPISODE_CARD_SHOT_INDEX,
  shots: EPISODE_01_SHOTS,
  shotDefaults: EPISODE_01_SHOT_DEFAULTS,
};
