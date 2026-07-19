/** Per-sound volume levels for the NES title menu. */
export const TITLE_MENU_AUDIO_VOLUMES = {
  menuCursor: 0.42,
  startSelected: 0.58,
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

  function play(soundId, onEnded) {
    if (!unlocked) {
      return;
    }

    const audio = audios[soundId];
    if (!audio) {
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

    audio.play().catch((error) => {
      console.warn(`[TitleMenuAudio] Could not play ${soundId}:`, error);
      onEnded?.();
    });
  }

  function playCursor() {
    play('menuCursor');
  }

  function playStartSelected(onEnded) {
    play('startSelected', onEnded);
  }

  return {
    preload,
    unlock,
    playCursor,
    playStartSelected,
  };
}
