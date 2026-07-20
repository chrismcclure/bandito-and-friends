import { createEpisodeCardCue } from '../audio/EpisodeCardCue.js';
import { createEpisodeShotSfx } from '../audio/episodeShotSfx.js';
import { createEpisodeMusic } from '../audio/episodeMusic.js';

/** Series-wide episode title card sound design cue. */
export function createEpisodeAudio() {
  const episodeCardCue = createEpisodeCardCue();
  const episodeShotSfx = createEpisodeShotSfx();
  const episodeMusic = createEpisodeMusic();

  async function preload() {
    await episodeShotSfx.preload();
  }

  function unlock() {
    episodeCardCue.unlock();
    episodeShotSfx.unlock();
    episodeMusic.unlock();
  }

  function playEpisodeCardCue(shotTime = 0) {
    episodeCardCue.play({ shotTime });
  }

  function playShotSfx(soundId) {
    episodeShotSfx.play(soundId);
  }

  function syncMusicCue(cue) {
    episodeMusic.syncCue(cue);
  }

  function stop() {
    episodeCardCue.stop();
    episodeMusic.stop();
  }

  return {
    preload,
    unlock,
    playEpisodeCardCue,
    playShotSfx,
    syncMusicCue,
    stop,
    getEpisodeCardCueConfig: () => episodeCardCue.getConfig(),
  };
}
