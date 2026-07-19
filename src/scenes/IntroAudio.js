/** Per-sound volume levels. Adjust these to balance the intro mix. */
import { installMediaTap } from '../dev/audioMonitor.js';

export const INTRO_AUDIO_VOLUMES = {
  introText01: 0.45,
  introText02: 0.45,
  introText03: 0.45,
  flash: 0.25,
  titleReveal: 0.55,
  episodeLabel: 0.4,
  sockMonsterSlam: 0.55,
  introEnd: 0.35,
};

const SOUND_FILES = {
  introText01: '/audio/sfx/intro-text-01.wav',
  introText02: '/audio/sfx/intro-text-02.wav',
  introText03: '/audio/sfx/intro-text-03.wav',
  flash: '/audio/sfx/flash.wav',
  titleReveal: '/audio/sfx/title-reveal.wav',
  episodeLabel: '/audio/sfx/episode-label.wav',
  sockMonsterSlam: '/audio/sfx/sock-monster-slam.wav',
  introEnd: '/audio/sfx/intro-end.wav',
};

function buildCues(timing, motion) {
  return [
    { key: 'intro-text-01', sound: 'introText01', at: timing.CARD_1_START },
    { key: 'flash-after-card-1', sound: 'flash', at: timing.BLACK_1_START },
    { key: 'intro-text-02', sound: 'introText02', at: timing.CARD_2_START },
    { key: 'flash-after-card-2', sound: 'flash', at: timing.BLACK_2_START },
    { key: 'intro-text-03', sound: 'introText03', at: timing.CARD_3_START },
    { key: 'flash-before-title', sound: 'flash', at: timing.IMPACT_FLASH_START },
    { key: 'title-reveal', sound: 'titleReveal', at: timing.TITLE_START },
    { key: 'episode-label', sound: 'episodeLabel', at: timing.EPISODE_START },
    {
      key: 'sock-monster-slam',
      sound: 'sockMonsterSlam',
      at: timing.EPISODE_START + motion.EPISODE_2_DELAY,
    },
    { key: 'intro-end', sound: 'introEnd', at: timing.BLACK_CLOSE_START },
  ];
}

export function createIntroAudio(timing, motion) {
  const audios = {};
  const triggered = new Set();
  const cues = buildCues(timing, motion);
  let unlocked = false;

  async function preload() {
    const entries = Object.entries(SOUND_FILES);

    await Promise.all(
      entries.map(
        ([soundId, src]) =>
          new Promise((resolve) => {
            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.volume = INTRO_AUDIO_VOLUMES[soundId];

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
                console.warn(`[IntroAudio] Failed to load ${src}`);
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
      console.warn(`[IntroAudio] Could not play ${soundId}:`, error);
    });
  }

  function update(loopTime, loopIndex) {
    if (!unlocked) {
      return;
    }

    for (const cue of cues) {
      const triggerKey = `${cue.key}-${loopIndex}`;
      if (triggered.has(triggerKey) || loopTime < cue.at) {
        continue;
      }

      triggered.add(triggerKey);
      play(cue.sound);
    }
  }

  function resetTriggers() {
    triggered.clear();
  }

  return {
    preload,
    unlock,
    update,
    resetTriggers,
  };
}
