/** Episode 1 intro timing — used after series opening title flash. */

import {
  BALANCED_FIT_HEIGHT_COVERAGE,
  BALANCED_FIT_OFFSET_X,
  BALANCED_FIT_OFFSET_Y,
  BALANCED_FIT_ZOOM,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from '../config.js';

export const EPISODE_01_INTRO_TIMING = {
  /** Main title hold after crawl fade (seconds). */
  TITLE_HOLD: 2.5,
};

/** Intro theme should cover title hold + Meet the Team (shots 03a–03d). */
export function getIntroThemeDuration(shots = EPISODE_01_SHOTS) {
  const meetTheTeamDuration = shots
    .slice(0, 4)
    .reduce((total, shot) => total + shot.duration, 0);

  return EPISODE_01_INTRO_TIMING.TITLE_HOLD + meetTheTeamDuration;
}

/** Base path for Episode 1 placeholder and final shot assets. */
export const EPISODE_01_ASSET_BASE = '/images/episodes/episode-01/placeholders';
export const EPISODE_01_FINALS_BASE = '/images/episodes/episode-01/finals';

/**
 * @typedef {'cut' | 'fade' | 'flash'} EpisodeTransition
 * @typedef {'static' | 'push-in' | 'push-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down' | 'slow-zoom'} EpisodeCameraMovement
 * @typedef {'none' | 'shake' | 'speed-lines'} EpisodeVisualEffect
 *
 * @typedef {Object} EpisodeShot
 * @property {string} id
 * @property {string} title
 * @property {'image' | 'episode-card' | 'closing-card'} type
 * @property {string} [assetPath]
 * @property {number} duration
 * @property {EpisodeTransition} transitionIn
 * @property {EpisodeTransition} transitionOut
 * @property {EpisodeCameraMovement} cameraMovement
 * @property {number} cameraScaleStart
 * @property {number} cameraScaleEnd
 * @property {{ x: number, y: number }} cameraPositionStart
 * @property {{ x: number, y: number }} cameraPositionEnd
 * @property {string} [dialogue]
 * @property {string} [dialogueTop] Caption shown near the top of the stage (pairs with dialogue).
 * @property {{ text: string, at: number }[]} [dialogueSections] Timed caption lines; overrides dialogue when set.
 * @property {'top' | 'bottom'} [captionPosition] Where dialogue captions render (default bottom).
 * @property {string} [secondaryDialogue]
 * @property {number} [secondaryDialogueAt] Seconds into the shot when secondary dialogue replaces primary.
 * @property {number} [captionFontSize] Override default slide caption size (20px).
 * @property {number} [captionStrokeWidth] Override default caption stroke width.
 * @property {number} [captionWordWrapWidth] Override default caption wrap width.
 * @property {number} [captionBottomOffset] Distance from bottom of stage to caption baseline.
 * @property {number} [captionTopOffset] Distance from top of stage to top caption baseline.
 * @property {boolean} [captionItalic] Render dialogue caption in italics (e.g. sound effects).
 * @property {string} [onScreenText]
 * @property {string} [subtitle]
 * @property {string} [label]
 * @property {string} [musicCue]
 * @property {EpisodeVisualEffect} visualEffect
 * @property {number} [shakeIntensity] Shake strength when visualEffect is shake (default 4).
 * @property {boolean} [freezeAtEnd]
 * @property {string} [notes]
 * @property {'placeholder' | 'final'} [status]
 * @property {'cover' | 'contain' | 'balanced'} [imageFit] Defaults to cover.
 * @property {number} [imageFitCoverage] Balanced mode height fill (0–1). Defaults to config.
 * @property {number} [imageFitZoom] Balanced mode zoom multiplier. Defaults to config.
 * @property {number} [imageFitZoomStart] Animate zoom from this value over the shot (with imageFitZoomEnd).
 * @property {number} [imageFitZoomEnd] Animate zoom to this value over the shot (with imageFitZoomStart).
 * @property {number} [imageFitOffsetX] Balanced mode horizontal nudge in stage pixels.
 * @property {number} [imageFitOffsetY] Balanced mode vertical nudge in stage pixels.
 * @property {number} [imageFitFocalX] Normalized focal point (0–1) to center on while zooming.
 * @property {number} [imageFitFocalY] Normalized focal point (0–1) to center on while zooming.
 * @property {'left-to-right' | 'right-to-left' | 'left' | 'right'} [imageFitSlide] Pan across a wide balanced-fit image over the shot duration, or a limited slide when imageFitSlideAmount is set.
 * @property {number} [imageFitSlideAmount] Fraction of stage width (0–1) for a limited slide with directions left or right.
 * @property {'left' | 'center' | 'right'} [imageFitSlideAlign] Start alignment for pans. Use left or right to pin an edge to the stage.
 * @property {number} [imageFitSlideCropStart] Fraction of image width cropped off-screen on the left at the start of a left-aligned pan.
 * @property {number} [imageFitSlideCropEnd] Fraction of image width allowed off-screen on the right at the end of a left-aligned pan.
 * @property {number} [imageFitSlideDuration] Seconds over which the image pan completes (defaults to shot duration).
 * @property {number} [flashAt] Seconds into the shot when a white flash peaks (overrides transitionIn flash timing).
 * @property {string} [sfx] Episode shot sound effect id (see episodeShotSfx.js).
 * @property {number} [sfxAt] Seconds into the shot when sfx plays once.
 * @property {number} [imageFitRotateStart] Starting tilt as a fraction of 90° (negative = left).
 * @property {number} [imageFitRotateEnd] Ending tilt as a fraction of 90° (defaults to 0).
 * @property {number} [imageFitRotateDuration] Seconds over which rotation completes (defaults to shot duration).
 */

/**
 * Default framing for wide landscape finals on the 9:16 stage.
 * Applied to assemble and shots from order-of-operations #22 onward.
 * Override any field on an individual shot to tweak it.
 */
export const EPISODE_01_LANDSCAPE_FIT = {
  imageFit: 'balanced',
  imageFitCoverage: BALANCED_FIT_HEIGHT_COVERAGE,
  imageFitZoom: BALANCED_FIT_ZOOM,
  imageFitOffsetX: BALANCED_FIT_OFFSET_X,
  imageFitOffsetY: BALANCED_FIT_OFFSET_Y,
};

/** Episode shot index for 06c — Bandito Team, assemble! (order-of-operations #15). */
export const EPISODE_01_ASSEMBLE_SHOT_INDEX = 9;

/**
 * First episode shot index for order-of-operations #22 (08d — Professor device).
 * Shots at and after this index receive EPISODE_01_LANDSCAPE_FIT unless overridden.
 */
export const EPISODE_01_LANDSCAPE_FIT_FROM_SHOT_INDEX = 16;

/** Shots between assemble and #22 still use balanced fit via global config defaults. */
export const EPISODE_01_BALANCED_FIT_FROM_SHOT_INDEX = 10;

/** First story beat after the episode card (05a — patrol). */
export const EPISODE_01_STORY_START_SHOT_INDEX = 5;

/** Default caption distance from the bottom of the stage for story dialogue. */
export const EPISODE_01_CAPTION_BOTTOM_OFFSET = 17;

/** @type {EpisodeShot[]} */
const EPISODE_01_SHOTS_RAW = [
  {
    id: '03a-bandito-leader',
    title: 'Bandito — The Leader',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-03a-bandito-leader.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'pan-down',
    cameraScaleStart: 1,
    cameraScaleEnd: 1.02,
    cameraPositionStart: { x: 0, y: 4 },
    cameraPositionEnd: { x: 0, y: 28 },
    musicCue: 'intro-theme',
    visualEffect: 'none',
    notes: 'Meet the Team — titles baked into artwork; pan down keeps title in frame',
    status: 'final',
  },
  {
    id: '03b-professor-brains',
    title: 'Professor SpaghettiO — The Brains',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-03b-professor-brains.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'pan-right',
    cameraScaleStart: 1.02,
    cameraScaleEnd: 1.02,
    cameraPositionStart: { x: -14, y: 0 },
    cameraPositionEnd: { x: 14, y: 0 },
    musicCue: 'intro-theme',
    visualEffect: 'none',
    notes: 'Meet the Team — titles baked into artwork',
    status: 'final',
  },
  {
    id: '03c-girl-frederick-muscle',
    title: 'Girl Frederick — The Muscle',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-03c-girl-frederick-muscle.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'push-in',
    cameraScaleStart: 1,
    cameraScaleEnd: 1.08,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    musicCue: 'intro-theme',
    visualEffect: 'none',
    notes: 'Meet the Team — titles baked into artwork',
    status: 'final',
  },
  {
    id: '03d-tortellini-wild-card',
    title: 'Tortellini — The Wild Card',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-03d-tortellini-wild-card.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'slow-zoom',
    cameraScaleStart: 1,
    cameraScaleEnd: 1.04,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    musicCue: 'intro-theme',
    visualEffect: 'none',
    notes: 'Meet the Team — titles baked into artwork; static comedic hold',
    status: 'final',
  },
  {
    id: '04-episode-card',
    title: 'Episode Title Card',
    type: 'episode-card',
    duration: 2.2,
    transitionIn: 'fade',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    label: 'EPISODE 1',
    subtitle: 'THE SOCK MONSTER',
    musicCue: 'intro-theme',
    visualEffect: 'none',
    status: 'final',
    notes: 'Text-only title card — no background art asset',
  },
  {
    id: '05a-bandito-patrol',
    title: 'Bandito on Patrol',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-05a-bandito-patrol.png`,
    duration: 3.5,
    transitionIn: 'fade',
    transitionOut: 'cut',
    cameraMovement: 'pan-right',
    cameraScaleStart: 1.08,
    cameraScaleEnd: 1.08,
    cameraPositionStart: { x: -24, y: 0 },
    cameraPositionEnd: { x: 24, y: 0 },
    dialogue: 'Another peaceful day in Meow City.',
    secondaryDialogue: 'Bandito is on patrol.',
    secondaryDialogueAt: 1.5,
    musicCue: 'adventure-calm',
    visualEffect: 'none',
    status: 'final',
    notes: 'Bandito rooftop patrol — Meow City skyline at night',
  },
  {
    id: '05b-bandito-stops',
    title: 'Bandito Stops',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-05b-bandito-stops.png`,
    duration: 3,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'push-in',
    cameraScaleStart: 1.05,
    cameraScaleEnd: 1.18,
    cameraPositionStart: { x: 8, y: 0 },
    cameraPositionEnd: { x: 0, y: -4 },
    dialogue: 'Bandito is shocked at what he finds.',
    musicCue: 'adventure-calm',
    visualEffect: 'none',
    status: 'final',
    notes: 'Bandito stops — shocked reaction, Meow City street at night',
  },
  {
    id: '05c-bandito-finds-sock',
    title: 'Bandito Finds the Sock',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-05c-bandito-finds-sock.png`,
    duration: 3.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'push-in',
    cameraScaleStart: 1,
    cameraScaleEnd: 1.12,
    cameraPositionStart: { x: -12, y: 8 },
    cameraPositionEnd: { x: 0, y: 0 },
    dialogue: 'Is it a regular sock or could it be...?',
    musicCue: 'adventure-calm',
    visualEffect: 'none',
    status: 'final',
    notes: 'Bandito discovers the sock on the street — Meow City alley',
  },
  {
    id: '06a-sock-reveal',
    title: 'Sock Reveal',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-06a-sock-reveal.png`,
    duration: 3.5,
    transitionIn: 'flash',
    transitionOut: 'cut',
    cameraMovement: 'push-in',
    cameraScaleStart: 1,
    cameraScaleEnd: 1.15,
    cameraPositionStart: { x: 0, y: 12 },
    cameraPositionEnd: { x: 0, y: 0 },
    dialogue: 'Sir Sockington... the sock monster.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Sock Monster revealed — Sir Sockington, Bandito in foreground',
  },
  {
    id: '06c-bandito-assemble',
    title: 'Bandito Team Assemble',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-06c-bandito-assemble.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'pan-left',
    cameraScaleStart: 1.05,
    cameraScaleEnd: 1.05,
    cameraPositionStart: { x: 20, y: 0 },
    cameraPositionEnd: { x: -10, y: 0 },
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Bandito shouts in Meow City street — title text baked into artwork',
  },
  {
    id: '06d-team-hears-call',
    title: 'Team Hears the Call',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-06d-team-hears-call.png`,
    duration: 3.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'pan-right',
    cameraScaleStart: 1.02,
    cameraScaleEnd: 1.02,
    cameraPositionStart: { x: -14, y: 0 },
    cameraPositionEnd: { x: 14, y: 0 },
    imageFit: 'cover',
    dialogue: 'The team hears the call for help.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes:
      'Professor, Tortellini, and Girl Frederick react to Bandito’s call — triptych panel',
  },
  {
    id: '07a-team-arrives',
    title: 'Team Arrival',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-07a-team-arrives.png`,
    duration: 3,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'pan-left',
    cameraScaleStart: 1.02,
    cameraScaleEnd: 1.02,
    cameraPositionStart: { x: 14, y: 0 },
    cameraPositionEnd: { x: -14, y: 0 },
    imageFit: 'cover',
    dialogue: 'The team assembles, ready to fight.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Full team on Meow City rooftop — moonlit group shot',
  },
  {
    id: '07b-professor-scans',
    title: 'Professor Scans Sock',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-07b-professor-scans.png`,
    duration: 3.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'balanced',
    imageFitCoverage: BALANCED_FIT_HEIGHT_COVERAGE,
    imageFitZoom: 0.70,
    imageFitOffsetX: 0,
    imageFitOffsetY: BALANCED_FIT_OFFSET_Y,
    dialogue: 'My instruments...',
    secondaryDialogue: 'have never detected anything like this.',
    secondaryDialogueAt: 1.4,
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Professor SpaghettiO with Threat-O-Meter pegged in the red — Meow City night',
  },
  {
    id: '07c-attack-stances',
    title: 'Attack Stances',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-07c-attack-stances.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'cover',
    dialogue: 'Bandito and friends are ready to attack.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Team takes attack stances on Meow City rooftop — Girl Frederick lunges, Bandito alert, Tortellini confused',
  },
  {
    id: '08b-girl-frederick-leap',
    title: 'Girl Frederick Leaps',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-08b-girl-frederick-leap.png`,
    duration: 3,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'balanced',
    imageFitCoverage: BALANCED_FIT_HEIGHT_COVERAGE,
    imageFitZoomStart: 0.76,
    imageFitZoomEnd: 0.70,
    imageFitOffsetX: 0,
    imageFitOffsetY: 0,
    dialogue:
      'Girl Frederick attacks with her razor-sharp bicycle kicks.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Girl Frederick flying kick — purple action lines, moonlit night',
  },
  {
    id: '08c-sock-monster-knockback',
    title: 'Sock Monster Knockback',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-08c-sock-monster-knockback.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'balanced',
    imageFitCoverage: BALANCED_FIT_HEIGHT_COVERAGE,
    imageFitZoom: BALANCED_FIT_ZOOM,
    imageFitOffsetX: 0,
    imageFitOffsetY: BALANCED_FIT_OFFSET_Y,
    imageFitSlide: 'left-to-right',
    imageFitSlideAlign: 'left',
    imageFitSlideCropEnd: 0.15,
    dialogue: 'The sock monster deflects the kicks.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'shake',
    status: 'final',
    notes: 'Sir Sockington punches Girl Frederick back — Meow City alley',
  },
  {
    id: '08d-professor-device',
    title: 'Professor Device',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-08d-professor-device.png`,
    duration: 3.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitZoom: BALANCED_FIT_ZOOM * 0.85,
    imageFitSlide: 'left-to-right',
    imageFitSlideAlign: 'left',
    imageFitSlideCropEnd: 0.1,
    imageFitSlideDuration: 1.875,
    flashAt: 1.875,
    dialogue: 'Professor shoots his ray gun 9000.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Professor SpaghettiO fires laser device — revised final, Meow City alley',
  },
  {
    id: '08e-sock-monster-deflect',
    title: 'Sock Monster Deflect',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-08e-sock-monster-deflect.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitSlide: 'left-to-right',
    imageFitSlideAlign: 'left',
    imageFitSlideCropEnd: 0.15,
    dialogue: 'The sock monster deflected the laser blasts.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'shake',
    status: 'final',
    notes: 'Sir Sockington deflects Professor’s energy blast — Meow City street',
  },
  {
    id: '08g-team-shock',
    title: 'Team Shock',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-08g-team-shock.png`,
    duration: 2.5,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitZoom: BALANCED_FIT_ZOOM * 0.92,
    dialogue: "Sir Sockington is too powerful!",
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Bandito shocked after Sir Sockington deflects the blast — Meow City street',
  },
  {
    id: '09a-tortellini-has-a-plan',
    title: 'Tortellini Has a Plan',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-09a-tortellini-has-a-plan.png`,
    duration: 2.7,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'cover',
    dialogue: "Tortellini announces her daring plan.",
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Tortellini heavy breathing after the deflect — Meow City street',
  },
  {
    id: '09b-bandito-plan-too-dangerous',
    title: 'Bandito — Plan Too Dangerous',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-09b-bandito-plan-too-dangerous.png`,
    duration: 3,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1.06,
    cameraScaleEnd: 1.06,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitZoom: BALANCED_FIT_ZOOM * 0.85,
    dialogue: 'No! There is no coming back from that.',
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Bandito yells at Tortellini after hearing the plan — Meow City street',
  },
  {
    id: '09c-tortellini-starts-to-fall',
    title: 'Tortellini Starts to Fall',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-09c-tortellini-starts-to-fall.png`,
    duration: 2,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'cover',
    imageFitSlide: 'right-to-left',
    imageFitSlideDuration: 2,
    imageFitRotateStart: -5 / 90,
    imageFitRotateEnd: 0.0875,
    imageFitRotateDuration: 2,
    dialogue: 'deep gurgling noises',
    captionItalic: true,
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Tortellini slips and starts to fall — Meow City street; no dialogue or SFX',
  },
  {
    id: '10a-giant-shadow-over-sock-monster',
    title: 'Giant Shadow Over Sock Monster',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-10a-giant-shadow-over-sock-monster.png`,
    duration: 2.2,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitZoomStart: BALANCED_FIT_ZOOM * 0.9,
    imageFitZoomEnd: BALANCED_FIT_ZOOM * 1.05,
    imageFitOffsetY: -CANVAS_HEIGHT * 0.1,
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Tortellini’s giant shadow looms over terrified Sir Sockington — Meow City alley',
  },
  {
    id: '10c-tortellini-squish',
    title: 'Tortellini Squish',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-10c-tortellini-squish.png`,
    duration: 2.2,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'cover',
    musicCue: 'sock-monster-battle',
    visualEffect: 'shake',
    status: 'final',
    notes: 'Tortellini lands on Sir Sockington — BOOM graphic baked in; Meow City street',
  },
  {
    id: '10e-celebration',
    title: 'Celebration',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-10e-celebration.png`,
    duration: 3,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 0.7 / 0.9,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'cover',
    dialogue: "Tortellini's plan worked!",
    musicCue: 'sock-monster-battle',
    visualEffect: 'none',
    status: 'final',
    notes: 'Team celebrates victory in Meow City street — Girl Frederick, Bandito, Professor',
  },
  {
    id: '11a-human-room',
    title: 'Human View',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-11a-human-view.png`,
    duration: 3,
    transitionIn: 'fade',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitSlide: 'left-to-right',
    imageFitSlideAlign: 'left',
    imageFitSlideCropStart: 0.05,
    imageFitSlideDuration: 2,
    musicCue: 'living-room-reveal-1',
    visualEffect: 'none',
    status: 'final',
    notes: 'Human POV of ordinary living room — reality shift from Meow City',
  },
  {
    id: '11b-human-over-shoulder',
    title: 'Human Over-the-Shoulder',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-11b-human-over-shoulder.png`,
    duration: 3,
    transitionIn: 'fade',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitSlide: 'right-to-left',
    imageFitSlideAlign: 'right',
    imageFitSlideCropStart: 0.08,
    imageFitSlideCropEnd: 0.05,
    imageFitSlideDuration: 3,
    musicCue: 'living-room-reveal-1',
    visualEffect: 'none',
    status: 'final',
    notes: 'Human over-the-shoulder view of the four cats — Tortellini with stuffed sock',
  },
  {
    id: '11c-human-grabs-sock',
    title: 'Human Grabs the Sock',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-11c-human-grabs-sock.png`,
    duration: 3,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitZoomStart: 0.90,
    imageFitZoomEnd: 0.70,
    musicCue: 'living-room-reveal-1',
    visualEffect: 'none',
    status: 'final',
    notes: 'Human hand pulls the sock away from Tortellini — living room, four cats watching',
  },
  {
    id: '12a-heroic-celebration',
    title: 'Heroic Celebration',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-12a-heroic-celebration.png`,
    duration: 3,
    transitionIn: 'fade',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFit: 'cover',
    dialogue: 'Meow City is safe once again!',
    musicCue: 'heroes-victory-1',
    visualEffect: 'none',
    status: 'final',
    notes: 'Team celebrates on Meow City rooftop — Bandito triumphant, Tortellini sprawled',
  },
  {
    id: '12b-celebration-freeze-frame',
    title: 'Celebration Freeze Frame',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-12b-celebration-freeze-frame.png`,
    duration: 3,
    transitionIn: 'cut',
    transitionOut: 'fade',
    cameraMovement: 'static',
    cameraScaleStart: 1.06,
    cameraScaleEnd: 1.06,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    imageFitZoomStart: BALANCED_FIT_ZOOM * 0.75,
    imageFitZoomEnd: BALANCED_FIT_ZOOM * 0.95,
    imageFitFocalY: 0.3,
    musicCue: 'heroes-victory-1',
    visualEffect: 'none',
    freezeAtEnd: true,
    status: 'final',
    notes: 'Team jumps and high-fives in Meow City — freeze on heroic celebration',
  },
  {
    id: '12c-credits',
    title: 'Credits',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-12c-credits.png`,
    duration: 3,
    transitionIn: 'fade',
    transitionOut: 'fade',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    dialogue: 'Created by Audrey and Chris McClure.',
    musicCue: 'team-theme-credits',
    visualEffect: 'none',
    status: 'final',
    notes: 'Chris and Audrey — creators credit in Meow City',
  },
  {
    id: '12d-tools-used',
    title: 'Tools We Used',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-12d-tools-used.png`,
    duration: 4,
    transitionIn: 'fade',
    transitionOut: 'fade',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    captionPosition: 'top',
    captionTopOffset: Math.round(CANVAS_HEIGHT * 0.13),
    captionWordWrapWidth: Math.round(CANVAS_WIDTH * 0.96),
    dialogueSections: [
      { at: 0, text: 'The tools we used to create this video.' },
      { at: 1.5, text: 'Link below for more infomation.' },
    ],
    musicCue: 'team-theme-credits',
    visualEffect: 'none',
    status: 'final',
    notes: 'How we made this — Cursor, ChatGPT, Composer, JavaScript, GitHub',
  },
  {
    id: '12e-thanks-for-watching',
    title: 'Thanks for Watching',
    type: 'image',
    assetPath: `${EPISODE_01_FINALS_BASE}/shot-12e-thanks-for-watching.png`,
    duration: 5,
    transitionIn: 'fade',
    transitionOut: 'fade',
    cameraMovement: 'static',
    cameraScaleStart: 1.06,
    cameraScaleEnd: 1.06,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    captionPosition: 'top',
    captionTopOffset: Math.round(CANVAS_HEIGHT * 0.08),
    captionWordWrapWidth: Math.round(CANVAS_WIDTH * 0.96),
    dialogueSections: [
      { at: 0, text: 'Thanks for watching!' },
      { at: 1.7, text: 'Like for more Bandito adventures!' },
    ],
    musicCue: 'team-theme-credits',
    visualEffect: 'none',
    freezeAtEnd: true,
    status: 'final',
    notes: 'Full group shot — Chris, Audrey, and the whole team in Meow City',
  },
];

export const EPISODE_01_SHOTS = EPISODE_01_SHOTS_RAW.map((shot, index) => {
  if (shot.type !== 'image') {
    return shot;
  }

  let next = shot;

  if (
    index === EPISODE_01_ASSEMBLE_SHOT_INDEX ||
    index >= EPISODE_01_LANDSCAPE_FIT_FROM_SHOT_INDEX
  ) {
    next = { ...EPISODE_01_LANDSCAPE_FIT, ...shot };
  } else if (index >= EPISODE_01_BALANCED_FIT_FROM_SHOT_INDEX) {
    next = { ...shot, imageFit: shot.imageFit ?? 'balanced' };
  }

  if (index >= EPISODE_01_STORY_START_SHOT_INDEX && next.dialogue) {
    next = {
      ...next,
      captionBottomOffset:
        next.captionBottomOffset ?? EPISODE_01_CAPTION_BOTTOM_OFFSET,
    };
  }

  return next;
});

export function getEpisodeOneTotalDuration(shots = EPISODE_01_SHOTS) {
  return shots.reduce((total, shot) => total + shot.duration, 0);
}

export function getEpisodeOneShotStarts(shots = EPISODE_01_SHOTS) {
  const starts = [];
  let elapsed = 0;

  for (const shot of shots) {
    starts.push(elapsed);
    elapsed += shot.duration;
  }

  return starts;
}

export function findShotIndexAtTime(time, shots = EPISODE_01_SHOTS) {
  let elapsed = 0;

  for (let index = 0; index < shots.length; index += 1) {
    const shot = shots[index];
    if (time < elapsed + shot.duration) {
      return { index, localTime: time - elapsed, elapsed };
    }
    elapsed += shot.duration;
  }

  const lastIndex = shots.length - 1;
  return {
    index: lastIndex,
    localTime: shots[lastIndex].duration,
    elapsed: elapsed - shots[lastIndex].duration,
  };
}
