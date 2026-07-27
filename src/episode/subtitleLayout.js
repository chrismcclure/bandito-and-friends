import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';

/**
 * Lift applied to all dialogue subtitle baselines so text clears Shorts/Reels UI.
 * ~17.5% of stage height (middle of the 15–20% target range).
 */
export const SHORTS_SAFE_AREA_SUBTITLE_LIFT = Math.round(CANVAS_HEIGHT * 0.175);

/** Reference export width (1080p vertical Shorts). Internal stage is 1:4 scale. */
const SHORTS_REFERENCE_EXPORT_WIDTH = 1080;
const STAGE_TO_EXPORT_SCALE = CANVAS_WIDTH / SHORTS_REFERENCE_EXPORT_WIDTH;

/** Subtitle block width as a fraction of export width (~72% → ~778px at 1080). */
const SHORTS_SUBTITLE_WIDTH_RATIO = 0.72;

/** Maximum subtitle block width on export (px). */
const SHORTS_SUBTITLE_MAX_EXPORT_WIDTH = 780;

/** Minimum safe inset from the left edge on export (px). */
const SHORTS_SUBTITLE_SAFE_LEFT_EXPORT = 130;

/** Minimum safe inset from the right edge on export (px). */
const SHORTS_SUBTITLE_SAFE_RIGHT_EXPORT = 170;

/**
 * Maximum word-wrap width for dialogue subtitles on the internal stage.
 * Uses the narrowest of: 72% width, 780px export cap, and centered safe side insets.
 */
export function resolveShortsSubtitleWordWrapWidth(
  stageWidth = CANVAS_WIDTH,
) {
  const ratioWidth = stageWidth * SHORTS_SUBTITLE_WIDTH_RATIO;
  const maxWidth = SHORTS_SUBTITLE_MAX_EXPORT_WIDTH * STAGE_TO_EXPORT_SCALE;
  const safeLeft = SHORTS_SUBTITLE_SAFE_LEFT_EXPORT * STAGE_TO_EXPORT_SCALE;
  const safeRight = SHORTS_SUBTITLE_SAFE_RIGHT_EXPORT * STAGE_TO_EXPORT_SCALE;
  const centerX = stageWidth / 2;
  const maxCenteredWidth =
    2 * Math.min(centerX - safeLeft, centerX - safeRight);

  return Math.round(Math.min(ratioWidth, maxWidth, maxCenteredWidth));
}

/** Horizontally centered X anchor for subtitle text blocks. */
export function resolveShortsSubtitleCenterX(stageWidth = CANVAS_WIDTH) {
  return stageWidth / 2;
}

/** Resolve the stage Y position for a bottom-anchored subtitle baseline. */
export function resolveSubtitleBaselineY(bottomOffsetFromStageBottom) {
  return CANVAS_HEIGHT - bottomOffsetFromStageBottom - SHORTS_SAFE_AREA_SUBTITLE_LIFT;
}

/** Top-anchored caption Y — ~18% down from the top of the stage. */
export function resolveShortsSubtitleTopOffset(
  stageHeight = CANVAS_HEIGHT,
) {
  return Math.round(stageHeight * 0.18);
}
