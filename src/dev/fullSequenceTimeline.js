/**
 * Full-show timeline — stitches every beat into one flat array.
 *
 * Order: NES title menu → pixel load → series opening → main title hold
 *        → active episode shots (Meet the Team through credits).
 *
 * Used by dev controls (scrubber), export (frame count), and audio mix.
 */
import { TITLE_MENU_TIMING } from '../data/title-menu-timing.js';
import { NES_PIXEL_LOAD_TIMING } from '../transitions/nesPixelLoadTransition.js';
import { SERIES_OPENING_SHOTS } from '../data/series-opening-shots.js';
import { ACTIVE_EPISODE } from '../data/activeEpisode.js';

/** The four NES menu cursor states before Start is pressed. */
export const TITLE_MENU_PHASES = [
  {
    id: 'title-press-start',
    title: 'NES Menu — PRESS START',
    phaseIndex: 0,
    duration: TITLE_MENU_TIMING.START_SELECTED_HOLD,
  },
  {
    id: 'title-run-away',
    title: 'NES Menu — Run Away',
    phaseIndex: 1,
    duration: TITLE_MENU_TIMING.RUN_AWAY_SELECTED_HOLD,
  },
  {
    id: 'title-press-start-final',
    title: 'NES Menu — PRESS START (final)',
    phaseIndex: 2,
    duration: TITLE_MENU_TIMING.FINAL_START_SELECTED_HOLD,
  },
  {
    id: 'title-start-freeze',
    title: 'NES Menu — Start Press',
    phaseIndex: 3,
    duration: TITLE_MENU_TIMING.START_PRESS_FREEZE,
  },
];

const PIXEL_LOAD_DURATION =
  NES_PIXEL_LOAD_TIMING.FLASH_DURATION +
  NES_PIXEL_LOAD_TIMING.BLOCK_HOLD_DURATION +
  NES_PIXEL_LOAD_TIMING.DISSOLVE_DURATION;

/** Flat timeline from NES title menu through the active episode. */
export function buildFullSequenceBeats(episode = ACTIVE_EPISODE) {
  const beats = [];

  // 1. NES title menu (cursor blips between PRESS START and Run Away)
  for (const phase of TITLE_MENU_PHASES) {
    beats.push({
      id: phase.id,
      title: phase.title,
      section: 'title-menu',
      phaseIndex: phase.phaseIndex,
      duration: phase.duration,
      type: 'title-menu',
      status: 'final',
    });
  }

  // 2. Mega Man-style pixel-block transition after Start is pressed
  beats.push({
    id: 'pixel-load',
    title: 'NES Pixel Load',
    section: 'pixel-load',
    duration: PIXEL_LOAD_DURATION,
    type: 'transition',
    status: 'final',
  });

  // 3. Series opening — ordinary house → Meow City (shared across all episodes)
  for (let index = 0; index < SERIES_OPENING_SHOTS.length; index += 1) {
    const shot = SERIES_OPENING_SHOTS[index];
    beats.push({
      ...shot,
      id: shot.id,
      title: shot.title,
      section: 'opening',
      shotIndex: index,
      duration: shot.duration,
    });
  }

  // 4. Main title hold ("Bandito and Friends") before Meet the Team
  beats.push({
    title: 'Bandito and Friends — Title',
    section: 'intro-title',
    duration: episode.introTiming.TITLE_HOLD,
    type: 'title',
    musicCue: 'intro-theme',
    status: 'final',
  });

  // 5. Active episode — Meet the Team, story, credits
  for (let index = 0; index < episode.shots.length; index += 1) {
    const shot = episode.shots[index];
    beats.push({
      ...shot,
      id: shot.id,
      title: shot.title,
      section: 'episode',
      shotIndex: index,
      duration: shot.duration,
    });
  }

  return beats;
}

export function getFullSequenceTotalDuration(beats = buildFullSequenceBeats()) {
  return beats.reduce((sum, beat) => sum + beat.duration, 0);
}

export function getTitleMenuEndTime(beats = buildFullSequenceBeats()) {
  return beats
    .filter((beat) => beat.section === 'title-menu')
    .reduce((sum, beat) => sum + beat.duration, 0);
}

export function findBeatAtTime(time, beats = buildFullSequenceBeats()) {
  let elapsed = 0;

  for (let index = 0; index < beats.length; index += 1) {
    const beat = beats[index];
    if (time < elapsed + beat.duration) {
      return { index, localTime: time - elapsed, elapsed };
    }
    elapsed += beat.duration;
  }

  const lastIndex = beats.length - 1;
  return {
    index: lastIndex,
    localTime: beats[lastIndex].duration,
    elapsed: elapsed - beats[lastIndex].duration,
  };
}
