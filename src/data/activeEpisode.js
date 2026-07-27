/**
 * Which episode the app plays, exports, and previews by default.
 *
 * To switch episodes: import EPISODE_02 (etc.) and set ACTIVE_EPISODE.
 * See story/NEW-EPISODE.md for the full workflow.
 */
import { EPISODE_01 } from './episodes/episode-01.js';

export const ACTIVE_EPISODE = EPISODE_01;

export const ACTIVE_EPISODE_ID = ACTIVE_EPISODE.id;

export const ACTIVE_EXPORT_ID = ACTIVE_EPISODE.exportId;
