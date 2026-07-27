import { TITLE_MENU_TIMING } from '../data/title-menu-timing.js';
import { installMediaTap } from '../dev/audioMonitor.js';

/** Per-sound volume levels for the NES title menu. */
export const TITLE_MENU_AUDIO_VOLUMES = {
  menuCursor: 0.819,
  startSelected: 0.725,
};

const SOUND_FILES = {
  menuCursor: '/audio/sfx/menu-cursor.wav',
  startSelected: '/audio/sfx/start-selected.wav',
};

export function createTitleMenuAudio() {
  const audios = {};
  let unlocked = false;

  async function preload() {
    await Promise.all(
      Object.entries(SOUND_FILES).map(
        ([soundId, src]) =>
          new Promise((resolve) => {
            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.volume = TITLE_MENU_AUDIO_VOLUMES[soundId];

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
                console.warn(`[TitleMenuAudio] Failed to load ${src}`);
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

  function play(soundId, { onPeak, onEnded } = {}) {
    if (!unlocked) {
      onPeak?.();
      onEnded?.();
      return;
    }

    const audio = audios[soundId];
    if (!audio) {
      onPeak?.();
      onEnded?.();
      return;
    }

    audio.onended = null;
    audio.currentTime = 0;

    if (onEnded) {
      audio.onended = () => {
        audio.onended = null;
        onEnded();
      };
    }

    let peakTimer = null;
    if (onPeak) {
      peakTimer = window.setTimeout(() => {
        peakTimer = null;
        onPeak();
      }, TITLE_MENU_TIMING.START_SOUND_PEAK_DELAY * 1000);
    }

    audio.play().catch((error) => {
      console.warn(`[TitleMenuAudio] Could not play ${soundId}:`, error);
      if (peakTimer) {
        window.clearTimeout(peakTimer);
      }
      onPeak?.();
      onEnded?.();
    });
  }

  function playCursor() {
    play('menuCursor');
  }

  function playStartSelected({ onPeak, onEnded } = {}) {
    play('startSelected', { onPeak, onEnded });
  }

  return {
    preload,
    unlock,
    playCursor,
    playStartSelected,
  };
}
