import { runCommand } from './checkFfmpeg.js';

/**
 * Encode PNG frame sequence + WAV audio into H.264/AAC MP4.
 */
export function encodeEpisodeVideo({
  ffmpegPath,
  framesDir,
  audioPath,
  outputPath,
  fps,
}) {
  const framePattern = `${framesDir}/frame-%06d.png`;

  runCommand(
    ffmpegPath,
    [
      '-y',
      '-framerate',
      String(fps),
      '-i',
      framePattern,
      '-i',
      audioPath,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-r',
      String(fps),
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-shortest',
      outputPath,
    ],
    { label: 'ffmpeg (encode mp4)' },
  );

  return outputPath;
}
