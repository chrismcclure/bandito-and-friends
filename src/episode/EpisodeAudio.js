import { createEpisodeCardCue } from '../audio/EpisodeCardCue.js';

/** Series-wide episode title card sound design cue. */
export function createEpisodeAudio() {
  const episodeCardCue = createEpisodeCardCue();

  async function preload() {
    // Web Audio cue initializes on unlock/play.
  }

  function unlock() {
    episodeCardCue.unlock();
  }

  function playEpisodeCardCue() {
    episodeCardCue.play();
  }

  function stop() {
    episodeCardCue.stop();
  }

  return {
    preload,
    unlock,
    playEpisodeCardCue,
    stop,
    getEpisodeCardCueConfig: () => episodeCardCue.getConfig(),
  };
}
