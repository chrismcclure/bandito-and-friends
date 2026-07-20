import { installMediaTap } from '../dev/audioMonitor.js';

/**
 * Playback volume for episode shot SFX — matches title-menu start-selected (0.725).
 * Pair with EPISODE_SFX_SOUND_VOL (0.2) in intro-sfx-presets.js when authoring new sounds.
 */
export const EPISODE_SHOT_SFX_VOLUME = 0.725;

/** Episode shot sound effects — keyed by shot `sfx` field. */
export const EPISODE_SHOT_SFX = {};

/**
 * @param {string[]} [soundIds]
 */
export function createEpisodeShotSfx(soundIds = Object.keys(EPISODE_SHOT_SFX)) {
  const audios = {};
  let unlocked = false;

  async function preload() {
    await Promise.all(
      soundIds.map(
        (soundId) =>
          new Promise((resolve) => {
            const src = EPISODE_SHOT_SFX[soundId];
            if (!src) {
              console.warn(`[EpisodeShotSfx] Unknown sound id: ${soundId}`);
              resolve();
              return;
            }

            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.volume = EPISODE_SHOT_SFX_VOLUME;

            audio.addEventListener(
              'canplaythrough',
              () => {
                audios[soundId] = audio;
                installMediaTap(audio);
                resolve();
              },
              { once: true },
            );

            audio.addEventListener(
              'error',
              () => {
                console.warn(`[EpisodeShotSfx] Failed to load ${src}`);
                resolve();
              },
              { once: true },
            );

            audio.load();
          }),
      ),
    );
  }

  function unlock() {
    unlocked = true;

    for (const audio of Object.values(audios)) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
          })
          .catch(() => {});
      }
    }
  }

  function play(soundId) {
    if (!unlocked) {
      return;
    }

    const audio = audios[soundId];
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.warn(`[EpisodeShotSfx] Could not play ${soundId}:`, error);
    });
  }

  return {
    preload,
    unlock,
    play,
  };
}
