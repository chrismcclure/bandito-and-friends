import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildFullShowAudioTimeline } from '../../src/export/buildFullShowAudioTimeline.js';
import { EPISODE_SHOT_SFX } from '../../src/audio/episodeShotSfx.js';
import { INTRO_SFX_FILES } from '../../src/scenes/IntroAudio.js';
import { runCommand } from './checkFfmpeg.js';
import {
  ensureCueAudioFile,
  getCueMixSettings,
  resolvePublicAudioPath,
} from './renderProceduralAudio.js';

const TITLE_MENU_SFX = {
  menuCursor: '/audio/sfx/menu-cursor.wav',
  startSelected: '/audio/sfx/start-selected.wav',
};

/**
 * Mix full-show audio into a single WAV using FFmpeg.
 */
export async function mixEpisodeAudio({
  ffmpegPath,
  outputPath,
  audioDir,
  totalDurationSec,
  startSec = 0,
  timeline = buildFullShowAudioTimeline(),
}) {
  mkdirSync(audioDir, { recursive: true });

  const cacheDir = join(audioDir, 'cache');
  const filterParts = [];
  const inputArgs = [];
  let inputIndex = 0;
  const mixEndSec = startSec + totalDurationSec;

  for (const segment of timeline.musicSegments) {
    if (segment.endSec <= startSec || segment.startSec >= mixEndSec) {
      continue;
    }

    const clipStart = Math.max(segment.startSec, startSec) - segment.startSec;
    const clipEnd = Math.min(segment.endSec, mixEndSec) - segment.startSec;
    const segmentDuration = clipEnd - clipStart;
    const delayMs = Math.round((Math.max(segment.startSec, startSec) - startSec) * 1000);

    const sourcePath = await ensureCueAudioFile(segment.cue, cacheDir);
    const { loop, volume } = getCueMixSettings(segment.cue);
    const shouldLoop = segment.loop ?? loop;

    if (shouldLoop) {
      inputArgs.push('-stream_loop', '-1');
    }

    inputArgs.push('-i', sourcePath);

    const volumeFilter =
      volume == null ? '' : `,volume=${volume.toFixed(4)}`;

    let segmentFilter = `[${inputIndex}:a]atrim=${clipStart.toFixed(6)}:${clipEnd.toFixed(6)},asetpts=PTS-STARTPTS${volumeFilter}`;

    if (segment.fadeOutSec && segment.endSec <= mixEndSec) {
      const fadeStart = Math.max(0, segmentDuration - segment.fadeOutSec);
      segmentFilter += `,afade=t=out:st=${fadeStart.toFixed(6)}:d=${segment.fadeOutSec.toFixed(6)}`;
    }

    segmentFilter += `,adelay=${delayMs}|${delayMs}[a${inputIndex}]`;
    filterParts.push(segmentFilter);
    inputIndex += 1;
  }

  for (const oneShot of timeline.oneShots) {
    if (oneShot.startSec < startSec || oneShot.startSec >= mixEndSec) {
      continue;
    }

    const delayMs = Math.round((oneShot.startSec - startSec) * 1000);

    if (oneShot.type === 'episode-card-cue') {
      const sourcePath = await ensureCueAudioFile('episode-card-cue', cacheDir);
      inputArgs.push('-i', sourcePath);
      filterParts.push(
        `[${inputIndex}:a]adelay=${delayMs}|${delayMs}[a${inputIndex}]`,
      );
      inputIndex += 1;
      continue;
    }

    if (oneShot.type === 'title-menu-sfx') {
      const src = TITLE_MENU_SFX[oneShot.soundId];
      if (!src) {
        continue;
      }

      const sourcePath = resolvePublicAudioPath(src);
      inputArgs.push('-i', sourcePath);
      filterParts.push(
        `[${inputIndex}:a]volume=${oneShot.volume.toFixed(4)},adelay=${delayMs}|${delayMs}[a${inputIndex}]`,
      );
      inputIndex += 1;
      continue;
    }

    if (oneShot.type === 'intro-sfx') {
      const src = INTRO_SFX_FILES[oneShot.soundId];
      if (!src) {
        console.warn(`[ExportAudio] Missing intro SFX asset for ${oneShot.soundId}`);
        continue;
      }

      const sourcePath = resolvePublicAudioPath(src);
      inputArgs.push('-i', sourcePath);
      filterParts.push(
        `[${inputIndex}:a]volume=${oneShot.volume.toFixed(4)},adelay=${delayMs}|${delayMs}[a${inputIndex}]`,
      );
      inputIndex += 1;
      continue;
    }

    if (oneShot.type === 'sfx') {
      const src = EPISODE_SHOT_SFX[oneShot.soundId];
      if (!src) {
        console.warn(`[ExportAudio] Missing SFX asset for ${oneShot.soundId}`);
        continue;
      }

      const sourcePath = resolvePublicAudioPath(src);
      inputArgs.push('-i', sourcePath);
      filterParts.push(
        `[${inputIndex}:a]volume=${oneShot.volume.toFixed(4)},adelay=${delayMs}|${delayMs}[a${inputIndex}]`,
      );
      inputIndex += 1;
    }
  }

  if (inputIndex === 0) {
    runCommand(
      ffmpegPath,
      [
        '-y',
        '-f',
        'lavfi',
        '-i',
        'anullsrc=r=44100:cl=mono',
        '-t',
        totalDurationSec.toFixed(6),
        outputPath,
      ],
      { label: 'ffmpeg (silent audio)' },
    );
    return outputPath;
  }

  const mixInputs = Array.from({ length: inputIndex }, (_, index) => `[a${index}]`).join('');
  const filterComplex = `${filterParts.join(';')};${mixInputs}amix=inputs=${inputIndex}:duration=longest:dropout_transition=0:normalize=0,atrim=0:${totalDurationSec.toFixed(6)},asetpts=PTS-STARTPTS,alimiter=limit=0.97[out]`;

  runCommand(
    ffmpegPath,
    [
      '-y',
      ...inputArgs,
      '-filter_complex',
      filterComplex,
      '-map',
      '[out]',
      '-ar',
      '44100',
      '-ac',
      '1',
      outputPath,
    ],
    { label: 'ffmpeg (audio mix)' },
  );

  return outputPath;
}
