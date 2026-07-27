/**
 * Starter template for a new episode shot list.
 *
 * 1. Copy this file to episode-XX-shots.js
 * 2. Replace placeholders and fill in story shots
 * 3. Register in src/data/episodes/episode-XX.js and registry.js
 *
 * See story/NEW-EPISODE.md for the full checklist.
 */

import {
  BALANCED_FIT_HEIGHT_COVERAGE,
  BALANCED_FIT_OFFSET_X,
  BALANCED_FIT_OFFSET_Y,
  BALANCED_FIT_ZOOM,
} from '../config.js';
import { applyEpisodeShotDefaults } from '../episode/episodeShotHelpers.js';

export const EPISODE_XX_INTRO_TIMING = {
  TITLE_HOLD: 2.5,
};

export const EPISODE_XX_ASSET_BASE = '/images/episodes/episode-XX/placeholders';
export const EPISODE_XX_FINALS_BASE = '/images/episodes/episode-XX/finals';

export const EPISODE_XX_LANDSCAPE_FIT = {
  imageFit: 'balanced',
  imageFitCoverage: BALANCED_FIT_HEIGHT_COVERAGE,
  imageFitZoom: BALANCED_FIT_ZOOM,
  imageFitOffsetX: BALANCED_FIT_OFFSET_X,
  imageFitOffsetY: BALANCED_FIT_OFFSET_Y,
};

export const EPISODE_XX_ASSEMBLE_SHOT_INDEX = 9;
export const EPISODE_XX_LANDSCAPE_FIT_FROM_SHOT_INDEX = 16;
export const EPISODE_XX_BALANCED_FIT_FROM_SHOT_INDEX = 10;
export const EPISODE_XX_STORY_START_SHOT_INDEX = 5;
export const EPISODE_XX_EPISODE_CARD_SHOT_INDEX = 4;
export const EPISODE_XX_CAPTION_BOTTOM_OFFSET = 17;

const EPISODE_XX_SHOTS_RAW = [
  // Meet the Team — reuse structure, swap art and labels
  {
    id: '03a',
    title: 'Bandito intro',
    type: 'image',
    assetPath: `${EPISODE_XX_FINALS_BASE}/shot-03a-bandito-leader.png`,
    duration: 2.5,
    label: 'THE LEADER',
    transitionIn: 'fade',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    visualEffect: 'none',
    status: 'placeholder',
  },
  // ... 03b, 03c, 03d ...

  // Episode card
  {
    id: '04',
    title: 'Episode card',
    type: 'episode-card',
    duration: 2,
    onScreenText: 'EPISODE XX — TITLE HERE',
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    visualEffect: 'none',
    status: 'placeholder',
  },

  // Story beats — 05a onward
  {
    id: '05a',
    title: 'Opening story beat',
    type: 'image',
    assetPath: `${EPISODE_XX_FINALS_BASE}/shot-05a-opening.png`,
    duration: 3,
    dialogue: 'Example dialogue line.',
    musicCue: 'adventure-calm',
    transitionIn: 'fade',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    visualEffect: 'none',
    status: 'placeholder',
  },

  // Credits — reuse team-theme-credits music cue
  {
    id: '12c',
    title: 'Credits',
    type: 'image',
    assetPath: `${EPISODE_XX_FINALS_BASE}/shot-12c-credits.png`,
    duration: 4,
    musicCue: 'team-theme-credits',
    transitionIn: 'fade',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    visualEffect: 'none',
    status: 'placeholder',
  },
];

export const EPISODE_XX_SHOT_DEFAULTS = {
  assembleShotIndex: EPISODE_XX_ASSEMBLE_SHOT_INDEX,
  landscapeFitFromShotIndex: EPISODE_XX_LANDSCAPE_FIT_FROM_SHOT_INDEX,
  balancedFitFromShotIndex: EPISODE_XX_BALANCED_FIT_FROM_SHOT_INDEX,
  storyStartShotIndex: EPISODE_XX_STORY_START_SHOT_INDEX,
  landscapeFit: EPISODE_XX_LANDSCAPE_FIT,
  captionBottomOffset: EPISODE_XX_CAPTION_BOTTOM_OFFSET,
};

export const EPISODE_XX_SHOTS = applyEpisodeShotDefaults(
  EPISODE_XX_SHOTS_RAW,
  EPISODE_XX_SHOT_DEFAULTS,
);
