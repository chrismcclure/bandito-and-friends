import {
  installMediaTap,
  resumeMediaMonitorContext,
} from '../dev/audioMonitor.js';

/** Playback volume — matches other episode music cues. */
export const EPISODE_MUSIC_FILE_VOLUME = 0.52;

/**
 * Looping HTML Audio player for pre-rendered episode music files.
 * @param {string} src
 * @param {number} [volume]
 * @param {{ loop?: boolean }} [options]
 */
export function createEpisodeMusicFileLoop(
  src,
  volume = EPISODE_MUSIC_FILE_VOLUME,
  { loop = true } = {},
) {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = loop;
  audio.volume = volume;

  // Tap before first play so routing does not flip mid-playback when canplaythrough fires.
  installMediaTap(audio);
  audio.load();

  let unlocked = false;
  let wantsPlaying = false;

  function markUnlocked() {
    unlocked = true;
  }

  function unlock() {
    unlocked = true;
    wantsPlaying = false;

    resumeMediaMonitorContext().catch(() => {});

    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          if (!wantsPlaying) {
            audio.pause();
            audio.currentTime = 0;
          }
        })
        .catch(() => {});
    }
  }

  function play() {
    if (!unlocked) {
      return;
    }

    wantsPlaying = true;
    audio.currentTime = 0;

    resumeMediaMonitorContext()
      .then(() => audio.play())
      .catch((error) => {
        console.warn(`[EpisodeMusic] Could not play ${src}:`, error);
      });
  }

  function stop() {
    wantsPlaying = false;
    audio.pause();
    audio.currentTime = 0;
  }

  return {
    markUnlocked,
    unlock,
    play,
    stop,
  };
}
