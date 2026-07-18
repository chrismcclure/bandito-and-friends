/** Per-sound volume levels for episode playback. */
export const EPISODE_AUDIO_VOLUMES = {
  episodeCardWhoosh: 0.52,
};

const SOUND_FILES = {
  episodeCardWhoosh: '/audio/sfx/episode-card-whoosh.wav',
};

export function createEpisodeAudio() {
  const audios = {};
  let unlocked = false;

  async function preload() {
    await Promise.all(
      Object.entries(SOUND_FILES).map(
        ([soundId, src]) =>
          new Promise((resolve) => {
            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.volume = EPISODE_AUDIO_VOLUMES[soundId];

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
                console.warn(`[EpisodeAudio] Failed to load ${src}`);
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
      console.warn(`[EpisodeAudio] Could not play ${soundId}:`, error);
    });
  }

  function playEpisodeCardWhoosh() {
    play('episodeCardWhoosh');
  }

  return {
    preload,
    unlock,
    playEpisodeCardWhoosh,
  };
}
