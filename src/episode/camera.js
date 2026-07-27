import { CANVAS_WIDTH } from '../config.js';

/**
 * Camera interpolation helpers for the episode player.
 * Movement is defined in shot config — independent of artwork.
 */

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

export function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function interpolateCamera(shot, localTime) {
  const progress = clamp(localTime / shot.duration, 0, 1);
  const eased = easeInOutQuad(progress);

  return {
    scale: lerp(shot.cameraScaleStart, shot.cameraScaleEnd, eased),
    x: lerp(shot.cameraPositionStart.x, shot.cameraPositionEnd.x, eased),
    y: lerp(shot.cameraPositionStart.y, shot.cameraPositionEnd.y, eased),
  };
}

export function getShakeOffset(time, intensity = 4) {
  if (intensity <= 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: Math.sin(time * 48) * intensity,
    y: Math.cos(time * 37) * intensity,
  };
}

/**
 * Horizontal pan for wide balanced-fit images (comic-panel reveal).
 * @param {'left-to-right' | 'right-to-left' | 'left' | 'right'} direction
 * @param {number} displayWidth Scaled image width on the internal stage
 * @param {number} localTime
 * @param {number} duration
 * @param {object} [options]
 * @param {number} [options.slideAmount] Fraction of stage width (0–1) for a limited center slide.
 * @param {'left' | 'center' | 'right'} [options.slideAlign] Start alignment for left-to-right / right-to-left pans.
 * @param {number} [options.slideCropStart] Fraction of image width cropped off-screen on the left at start.
 * @param {number} [options.slideCropEnd] Fraction of image width allowed off-screen on the right at end.
 * @param {number} [options.slideDuration] Seconds over which the pan completes (defaults to shot duration).
 */
export function computeImageSlideX(
  direction,
  displayWidth,
  localTime,
  duration,
  options = {},
) {
  const { slideAmount, slideAlign, slideCropStart, slideCropEnd, slideDuration } =
    options;
  const panDuration = slideDuration ?? duration;
  const progress = clamp(localTime / panDuration, 0, 1);
  const centerX = CANVAS_WIDTH / 2;

  if (slideAmount != null && slideAmount > 0) {
    const distance = CANVAS_WIDTH * slideAmount;

    if (direction === 'left') {
      return centerX - lerp(0, distance, progress);
    }

    if (direction === 'right') {
      return centerX + lerp(0, distance, progress);
    }
  }

  if (direction === 'left-to-right' && slideAlign === 'left') {
    const cropStart = slideCropStart ?? 0;
    const cropEnd = slideCropEnd ?? 0;
    const startX = displayWidth / 2 - cropStart * displayWidth;
    const fullEndX = CANVAS_WIDTH - displayWidth / 2;
    const endX = CANVAS_WIDTH + cropEnd * displayWidth - displayWidth / 2;
    const clampedEndX = Math.max(fullEndX, Math.min(startX, endX));
    return lerp(startX, clampedEndX, progress);
  }

  if (direction === 'right-to-left' && slideAlign === 'right') {
    const cropEnd = slideCropEnd ?? 0;
    const cropStart = slideCropStart ?? 0;
    const startX = CANVAS_WIDTH - displayWidth / 2 + cropEnd * displayWidth;
    const fullEndX = displayWidth / 2;
    const endX = displayWidth / 2 - cropStart * displayWidth;
    const clampedEndX = Math.min(fullEndX, Math.max(startX, endX));
    return lerp(startX, clampedEndX, progress);
  }

  const overflow = displayWidth - CANVAS_WIDTH;

  if (overflow <= 0) {
    return slideAlign === 'left' ? displayWidth / 2 : centerX;
  }

  const startX = displayWidth / 2;
  const endX = CANVAS_WIDTH - displayWidth / 2;

  if (direction === 'right-to-left') {
    return lerp(endX, startX, progress);
  }

  return lerp(startX, endX, progress);
}

/**
 * Stage-pixel offset from center so a normalized image point sits on the stage center.
 * @param {number} textureWidth
 * @param {number} textureHeight
 * @param {number} displayScale
 * @param {number} [focalX] 0–1 across the image (0.5 = horizontal center).
 * @param {number} [focalY] 0–1 down the image (0.3 = top 30%).
 */
export function computeFocalFitOffset(
  textureWidth,
  textureHeight,
  displayScale,
  focalX = 0.5,
  focalY = 0.5,
) {
  return {
    x: -(focalX - 0.5) * textureWidth * displayScale,
    y: -(focalY - 0.5) * textureHeight * displayScale,
  };
}

/**
 * Static horizontal position when cropping one edge of a wide image.
 * @param {number} displayWidth
 * @param {{ cropStart?: number, cropEnd?: number }} [options]
 */
export function computeStaticImageCropX(displayWidth, options = {}) {
  const cropStart = options.cropStart ?? 0;
  const cropEnd = options.cropEnd ?? 0;

  if (cropStart > 0) {
    return displayWidth / 2 - cropStart * displayWidth;
  }

  if (cropEnd > 0) {
    const leftAlignedX = displayWidth / 2;
    const fullEndX = CANVAS_WIDTH - displayWidth / 2;
    const croppedEndX = CANVAS_WIDTH + cropEnd * displayWidth - displayWidth / 2;

    return Math.max(fullEndX, Math.min(leftAlignedX, croppedEndX));
  }

  return CANVAS_WIDTH / 2;
}
