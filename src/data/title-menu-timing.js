/** NES title menu sequence — plays before the series opening. */

export const TITLE_MENU_IMAGES = {
  /** PRESS START selected (bright white + cursor). */
  START_SELECTED: '/images/title/title-menu-press-start-selected.png',
  /** Run Away Like a Little Baby selected. */
  RUN_AWAY_SELECTED: '/images/title/title-menu-run-away-selected.png',
};

export const TITLE_MENU_TIMING = {
  /** Image 1 hold before first cursor blip (seconds). */
  START_SELECTED_HOLD: 1.05,
  /** Image 2 hold before second cursor blip (seconds). */
  RUN_AWAY_SELECTED_HOLD: 0.525,
  /** Final Image 1 hold before Start confirmation (seconds). */
  FINAL_START_SELECTED_HOLD: 0.75,
  /** White flash after Start sound — ~2–3 frames at 60fps. */
  WHITE_FLASH_DURATION: 0.045,
};

/** Re-export handoff timing for docs and scene wiring. */
export { NES_HANDOFF_TIMING } from '../transitions/nesHandoffTransition.js';
