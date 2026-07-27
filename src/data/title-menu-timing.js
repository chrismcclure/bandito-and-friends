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
  /** Final Image 1 hold before Start press freeze (seconds). */
  FINAL_START_SELECTED_HOLD: 0.75,
  /** Freeze after Start is pressed — cartridge acknowledging the input. */
  START_PRESS_FREEZE: 0.125,
  /** Delay from Start sound start to its peak hit (white flash moment). */
  START_SOUND_PEAK_DELAY: 0.1,
};

/** Re-export pixel-load transition timing for docs and scene wiring. */
export { NES_PIXEL_LOAD_TIMING } from '../transitions/nesPixelLoadTransition.js';
