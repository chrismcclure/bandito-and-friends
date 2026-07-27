/**
 * Series opening scene — reuses EpisodePlayer with series-opening-shots.js.
 *
 * Same renderer as episodes; just a different shot list. Music is deferred
 * until the pixel-load transition reveals the living room.
 */
import { createEpisodePlayer } from '../episode/EpisodePlayer.js';
import { SERIES_OPENING_SHOTS } from '../data/series-opening-shots.js';
import { createSeriesOpeningMusic } from '../audio/SeriesOpeningMusic.js';

/** Plays the visual series opening (ordinary house → Meow City). */
export async function createSeriesOpeningScene() {
  const player = await createEpisodePlayer({ shots: SERIES_OPENING_SHOTS });
  const music = createSeriesOpeningMusic();

  return {
    container: player.container,
    update: player.update,
    start({ deferMusic = false } = {}) {
      player.start();
      if (!deferMusic) {
        music.play();
      }
    },
    startMusic() {
      music.play();
    },
    fadeOutMusic(duration = 0.75) {
      music.fadeOut(duration);
    },
    pause: player.pause,
    resume: player.resume,
    restart() {
      music.stop();
      player.restart();
      music.play();
    },
    jumpToShot: player.jumpToShot,
    seekShotTime: player.seekShotTime,
    nextShot: player.nextShot,
    previousShot: player.previousShot,
    isComplete: player.isComplete,
    isStarted: player.isStarted,
    isPaused: player.isPaused,
    setCompleteHandler(handler) {
      player.setCompleteHandler(() => {
        music.fadeOut(0.75);
        handler?.();
      });
    },
    setShotChangeHandler: player.setShotChangeHandler,
    getTotalDuration: player.getTotalDuration,
    getCurrentShotInfo: player.getCurrentShotInfo,
    getShots: player.getShots,
    getEpisodeTime: player.getEpisodeTime,
  };
}
