import {
  EPISODE_01_SHOTS,
  getEpisodeOneTotalDuration,
} from '../data/episode-01-shots.js';
import { EPISODE_SHOT_SFX_VOLUME } from '../audio/episodeShotSfx.js';
import { isSupportedEpisodeMusicCue } from '../audio/episodeMusicCues.js';

/**
 * Build a flat audio timeline from episode shot data for offline mixing.
 * Matches EpisodePlayer music/SFX behavior in episode-only preview mode.
 */
export function buildEpisodeAudioTimeline(
  shots = EPISODE_01_SHOTS,
  totalDuration = getEpisodeOneTotalDuration(shots),
) {
  const musicSegments = [];
  const oneShots = [];

  let shotStart = 0;
  let activeCue = null;
  let segmentStart = 0;

  for (let index = 0; index < shots.length; index += 1) {
    const shot = shots[index];
    const nextCue = isSupportedEpisodeMusicCue(shot.musicCue)
      ? shot.musicCue
      : null;

    if (index === 0) {
      activeCue = nextCue;
      segmentStart = shotStart;
    } else if (nextCue !== activeCue) {
      if (activeCue) {
        musicSegments.push({
          type: 'music',
          cue: activeCue,
          startSec: segmentStart,
          endSec: shotStart,
        });
      }

      activeCue = nextCue;
      segmentStart = shotStart;
    }

    if (shot.type === 'episode-card') {
      oneShots.push({
        type: 'episode-card-cue',
        startSec: shotStart,
      });
    }

    if (shot.sfx && shot.sfxAt != null) {
      oneShots.push({
        type: 'sfx',
        soundId: shot.sfx,
        startSec: shotStart + shot.sfxAt,
        volume: EPISODE_SHOT_SFX_VOLUME,
      });
    }

    shotStart += shot.duration;
  }

  if (activeCue) {
    musicSegments.push({
      type: 'music',
      cue: activeCue,
      startSec: segmentStart,
      endSec: totalDuration,
    });
  }

  return {
    totalDuration,
    musicSegments,
    oneShots,
  };
}
