/** Returns the active development scene id from the URL query string. */
export function getDevSceneId() {
  return new URLSearchParams(window.location.search).get('scene');
}
