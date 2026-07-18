/**
 * Official opening crawl — reusable before every episode.
 * Optimized for vertical mobile (YouTube Shorts). Adjust timing in OPENING_CRAWL_TIMING.
 */

/** Manual line breaks — 3–6 words per line, one thought per block. */
export const OPENING_CRAWL_TEXT = `Humans see an
ordinary house.

Four cats know it
as Meow City.

They believe they
protect it from
danger.

And this is their
heroic story.`;

export const OPENING_CRAWL_TIMING = {
  /** Seconds before text begins scrolling upward. */
  HOLD_BEFORE_SCROLL: 0.7,
  /** Pixels per second — slower crawl so each sentence finishes before the next. */
  SCROLL_SPEED: 48,
  /** Fade to black after the final line exits. */
  FADE_OUT_DURATION: 0.5,
};

/** Typography tuned for 9:16 mobile — arm's-length phone reading. */
export const OPENING_CRAWL_STYLE = {
  fontSize: 12,
  lineHeight: 22,
  /** Narrow side inset so lines can span ~3–6 words. */
  textMargin: 8,
};

/** Intro handoff — existing title screen begins here (unchanged). */
export const OPENING_CRAWL_HANDOFF_TIME = 5.4;
