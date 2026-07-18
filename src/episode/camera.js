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
