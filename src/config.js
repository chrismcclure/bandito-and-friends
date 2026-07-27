/** Internal movie stage size (9:16 vertical). */
export const CANVAS_WIDTH = 270;
export const CANVAS_HEIGHT = 480;

/**
 * Landscape finals on the portrait stage: fill this fraction of frame height,
 * center-crop the sides, letterbox the rest. Tweak while iterating on wide shots.
 */
export const BALANCED_FIT_HEIGHT_COVERAGE = 0.82;

/** Extra zoom-out on balanced shots (1 = none, 0.92 ≈ 8% more side visible). */
export const BALANCED_FIT_ZOOM = 0.92;

/** Nudge balanced shots horizontally on the stage (negative = slide left). */
export const BALANCED_FIT_OFFSET_X = -8;

/** Nudge balanced shots vertically on the stage (negative = slide up). */
export const BALANCED_FIT_OFFSET_Y = 0;
