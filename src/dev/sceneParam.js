/**
 * URL query helpers for dev preview modes.
 *
 * ?scene=episode|opening|title-menu|crawl|threat-board
 * ?shot=N  — 0-based beat index to jump to and loop
 */
/** Returns the active development scene id from the URL query string. */
export function getDevSceneId() {
  return new URLSearchParams(window.location.search).get('scene');
}

/** Optional 0-based shot index for ?shot= preview links. */
export function getDevShotIndex() {
  const value = new URLSearchParams(window.location.search).get('shot');

  if (value === null || value === '') {
    return null;
  }

  const index = Number(value);
  return Number.isInteger(index) && index >= 0 ? index : null;
}

/** Supported scene values: title-menu, opening, crawl, episode, threat-board */
