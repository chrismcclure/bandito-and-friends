import { Container } from 'pixi.js';
import { setActiveAudioLabel } from './audioMonitor.js';
import { NES_PIXEL_LOAD_TIMING } from '../transitions/nesPixelLoadTransition.js';
import {
  buildFullSequenceBeats,
  findBeatAtTime,
  getFullSequenceTotalDuration,
  getTitleMenuEndTime,
} from './fullSequenceTimeline.js';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Unified playback controller for the full show — NES menu through Episode 1.
 * Exposes the same API as EpisodePlayer for the dev controls panel.
 */
export function createFullSequencePlayer({
  titleMenu,
  pixelLoad,
  seriesOpening,
  introScene,
  episodePlayer,
}) {
  const beats = buildFullSequenceBeats();
  const totalDuration = getFullSequenceTotalDuration(beats);
  const titleMenuEndTime = getTitleMenuEndTime(beats);

  let started = false;
  let paused = false;
  let complete = false;
  let manualBeatIndex = null;
  let loopCurrentBeat = false;
  let globalElapsed = 0;
  let onShotChange = null;
  let onComplete = null;
  let timelineMode = false;
  let lastRenderedIndex = -1;
  let openingMusicStarted = false;

  function hideAllScenes() {
    titleMenu.container.visible = false;
    pixelLoad.container.visible = false;
    seriesOpening.container.visible = false;
    introScene.container.visible = false;
    episodePlayer.container.visible = false;
  }

  function updateAudioLabel(beat) {
    if (!beat) {
      setActiveAudioLabel('Silent');
      return;
    }

    if (beat.section === 'title-menu') {
      setActiveAudioLabel('Title menu SFX');
      return;
    }

    if (beat.section === 'pixel-load' || beat.section === 'opening') {
      setActiveAudioLabel('Series opening music');
      return;
    }

    if (beat.type === 'episode-card') {
      setActiveAudioLabel('episode-card-cue');
      return;
    }

    if (beat.musicCue) {
      setActiveAudioLabel(beat.musicCue);
      return;
    }

    setActiveAudioLabel('Silent');
  }

  function notifyBeatChange(index, localTime) {
    const beat = beats[index];
    updateAudioLabel(beat);
    onShotChange?.({
      index,
      shot: beat,
      localTime,
      elapsed: getEpisodeTime(),
    });
  }

  function maybeStartOpeningMusic(localTime, beatDuration) {
    const threshold =
      NES_PIXEL_LOAD_TIMING.FLASH_DURATION +
      NES_PIXEL_LOAD_TIMING.BLOCK_HOLD_DURATION +
      NES_PIXEL_LOAD_TIMING.DISSOLVE_DURATION *
        NES_PIXEL_LOAD_TIMING.MUSIC_REVEAL_THRESHOLD;

    if (!openingMusicStarted && localTime >= threshold) {
      openingMusicStarted = true;
      seriesOpening.startMusic();
    }
  }

  function renderBeat(index, localTime) {
    const beat = beats[index];

    if (index !== lastRenderedIndex) {
      lastRenderedIndex = index;
      onEnterBeat(index);
    }

    hideAllScenes();
    titleMenu.setSuppressHandoff(manualBeatIndex !== null);
    introScene.setSuppressComplete(manualBeatIndex !== null);

    switch (beat.section) {
      case 'title-menu':
        titleMenu.container.visible = true;
        titleMenu.seekToPhaseIndex(beat.phaseIndex, localTime);
        break;

      case 'pixel-load':
        seriesOpening.container.visible = true;
        seriesOpening.seekShotTime(0, 0);
        pixelLoad.container.visible = true;
        pixelLoad.seekToTime(localTime);
        maybeStartOpeningMusic(localTime, beat.duration);
        break;

      case 'opening':
        seriesOpening.container.visible = true;
        pixelLoad.reset();
        seriesOpening.seekShotTime(beat.shotIndex, localTime);
        if (!openingMusicStarted) {
          openingMusicStarted = true;
          seriesOpening.startMusic();
        }
        break;

      case 'intro-title':
        introScene.container.visible = true;
        introScene.seekEpisodeTitleHold(localTime);
        break;

      case 'episode':
        episodePlayer.container.visible = true;
        episodePlayer.seekShotTime(beat.shotIndex, localTime);
        if (beat.shotIndex >= 4) {
          introScene.stopIntroMusic();
        }
        break;

      default:
        break;
    }

    notifyBeatChange(index, localTime);
  }

  function syncTitleMenuDevState() {
    const menuElapsed = titleMenu.getTimelineElapsed();
    const { index, localTime } = findBeatAtTime(menuElapsed, beats);
    notifyBeatChange(index, localTime);
  }

  function updateTitleMenuTimeline(deltaSeconds) {
    hideAllScenes();
    titleMenu.container.visible = true;
    titleMenu.setSuppressHandoff(false);

    if (!titleMenu.isStarted()) {
      titleMenu.start();
    }

    titleMenu.update(deltaSeconds);
    syncTitleMenuDevState();
  }

  function beginPixelLoadHandoff() {
    globalElapsed = titleMenuEndTime;
    lastRenderedIndex = -1;
    onEnterBeat(4);
    pixelLoad.start();
    renderBeat(4, 0);
  }

  function onEnterBeat(index) {
    const beat = beats[index];

    if (beat.section === 'pixel-load') {
      seriesOpening.container.visible = true;
      seriesOpening.start({ deferMusic: true });
      openingMusicStarted = false;
    }

    if (beat.section === 'intro-title') {
      seriesOpening.fadeOutMusic(0.5);
      introScene.startEpisodeTitle();
    }

    if (beat.section === 'episode') {
      if (manualBeatIndex !== null && beat.shotIndex <= 3) {
        introScene.ensureIntroMusic();
      }

      if (beat.shotIndex === 0) {
        episodePlayer.start();
      }
    }
  }

  function getPlaybackState() {
    if (manualBeatIndex !== null) {
      const beat = beats[manualBeatIndex];
      const localTime = loopCurrentBeat
        ? globalElapsed % beat.duration
        : clamp(globalElapsed, 0, beat.duration);

      return {
        index: manualBeatIndex,
        localTime,
        elapsed: beats
          .slice(0, manualBeatIndex)
          .reduce((sum, item) => sum + item.duration, 0),
      };
    }

    return findBeatAtTime(globalElapsed, beats);
  }

  function jumpToBeat(index, { loop = false, localTime = 0 } = {}) {
    if (index < 0 || index >= beats.length) {
      return;
    }

    manualBeatIndex = index;
    loopCurrentBeat = loop;
    timelineMode = false;
    globalElapsed = localTime;
    started = true;
    paused = false;
    complete = false;
    lastRenderedIndex = -1;
    renderBeat(index, localTime);
  }

  function update(deltaSeconds) {
    if (!started || paused || complete) {
      return;
    }

    if (manualBeatIndex !== null) {
      const beat = beats[manualBeatIndex];

      if (loopCurrentBeat) {
        globalElapsed += deltaSeconds;
        renderBeat(manualBeatIndex, globalElapsed % beat.duration);
        return;
      }

      renderBeat(manualBeatIndex, globalElapsed);
      return;
    }

    if (
      timelineMode &&
      globalElapsed < titleMenuEndTime &&
      !titleMenu.isComplete()
    ) {
      updateTitleMenuTimeline(deltaSeconds);
      return;
    }

    globalElapsed += deltaSeconds;

    if (globalElapsed >= totalDuration) {
      globalElapsed = totalDuration;
      complete = true;
      renderBeat(beats.length - 1, beats[beats.length - 1].duration);
      onComplete?.();
      return;
    }

    const { index, localTime } = findBeatAtTime(globalElapsed, beats);
    renderBeat(index, localTime);
  }

  function start() {
    started = true;
    paused = false;
    timelineMode = true;
    titleMenu.setSuppressHandoff(false);
    introScene.setSuppressComplete(false);

    if (manualBeatIndex === null && globalElapsed < 0.001) {
      titleMenu.start();
    }
  }

  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
  }

  function restart() {
    globalElapsed = 0;
    started = true;
    paused = false;
    complete = false;
    manualBeatIndex = null;
    loopCurrentBeat = false;
    timelineMode = true;
    lastRenderedIndex = -1;
    openingMusicStarted = false;
    pixelLoad.reset();
    titleMenu.reset();
    introScene.setSuppressComplete(false);
    titleMenu.setSuppressHandoff(false);
    titleMenu.start();
    renderBeat(0, 0);
  }

  function jumpToShot(index, options = {}) {
    jumpToBeat(index, { loop: options.loop ?? false, localTime: 0 });
  }

  function seekToMasterTime(timeSeconds, { renderOnly = true } = {}) {
    manualBeatIndex = null;
    loopCurrentBeat = false;
    globalElapsed = clamp(timeSeconds, 0, totalDuration);
    started = true;
    paused = true;
    complete = timeSeconds >= totalDuration;
    timelineMode = false;
    lastRenderedIndex = -1;

    const { index, localTime } = findBeatAtTime(globalElapsed, beats);
    const beat = beats[index];

    if (beat.section === 'pixel-load' || beat.section === 'opening') {
      openingMusicStarted = localTime > 0 || beat.section === 'opening';
    } else {
      openingMusicStarted = false;
    }

    onEnterBeat(index);
    renderBeat(index, localTime);

    if (!renderOnly) {
      notifyBeatChange(index, localTime);
    }
  }

  function resumeTimeline() {
    if (manualBeatIndex === null) {
      return;
    }

    const base = beats
      .slice(0, manualBeatIndex)
      .reduce((sum, beat) => sum + beat.duration, 0);
    globalElapsed = base + clamp(globalElapsed, 0, beats[manualBeatIndex].duration);
    manualBeatIndex = null;
    loopCurrentBeat = false;
    timelineMode = true;
    complete = false;
    lastRenderedIndex = -1;
    titleMenu.setSuppressHandoff(false);
    introScene.setSuppressComplete(false);

    const { index, localTime } = findBeatAtTime(globalElapsed, beats);
    const beat = beats[index];

    if (beat.section === 'title-menu') {
      titleMenu.seekToPhaseIndex(beat.phaseIndex, localTime);
      syncTitleMenuDevState();
      return;
    }

    onEnterBeat(index);
    renderBeat(index, localTime);
  }

  function nextShot() {
    const { index } = getPlaybackState();
    jumpToBeat(Math.min(index + 1, beats.length - 1));
  }

  function previousShot() {
    const { index } = getPlaybackState();
    jumpToBeat(Math.max(index - 1, 0));
  }

  function setShotChangeHandler(handler) {
    onShotChange = handler;
  }

  function setCompleteHandler(handler) {
    onComplete = handler;
  }

  function getShots() {
    return beats;
  }

  function getTotalDuration() {
    return totalDuration;
  }

  function getCurrentShotInfo() {
    const { index, localTime } = getPlaybackState();
    return {
      index,
      shot: beats[index],
      localTime,
      episodeTime: getEpisodeTime(),
      totalDuration,
    };
  }

  function getEpisodeTime() {
    if (manualBeatIndex !== null) {
      const base = beats
        .slice(0, manualBeatIndex)
        .reduce((sum, beat) => sum + beat.duration, 0);
      return base + clamp(globalElapsed, 0, beats[manualBeatIndex].duration);
    }

    return clamp(globalElapsed, 0, totalDuration);
  }

  function isComplete() {
    return complete;
  }

  function isPaused() {
    return paused;
  }

  function isStarted() {
    return started;
  }

  function unlockAudio() {
    titleMenu.unlockAudio();
    introScene.unlockAudio();
    episodePlayer.unlockAudio();
  }

  const exportContainer = new Container();
  exportContainer.addChild(
    introScene.container,
    episodePlayer.container,
    seriesOpening.container,
    titleMenu.container,
    pixelLoad.container,
  );

  titleMenu.setHandoffHandler(() => {
    if (manualBeatIndex !== null || !timelineMode) {
      return;
    }

    beginPixelLoadHandoff();
  });

  renderBeat(0, 0);

  return {
    start,
    pause,
    resume,
    restart,
    jumpToShot,
    seekToMasterTime,
    resumeTimeline,
    nextShot,
    previousShot,
    setShotChangeHandler,
    setCompleteHandler,
    isComplete,
    isPaused,
    isStarted,
    getShots,
    getTotalDuration,
    getCurrentShotInfo,
    getEpisodeTime,
    unlockAudio,
    update,
    getExportContainer: () => exportContainer,
  };
}
