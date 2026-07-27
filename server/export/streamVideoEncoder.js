import { spawn } from 'node:child_process';

function waitForProcess(proc, label) {
  return new Promise((resolve, reject) => {
    let stderr = '';

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${label} exited with code ${code}: ${stderr.trim()}`));
    });
  });
}

/**
 * Stream JPEG frames into FFmpeg and write an H.264 video-only MP4.
 */
export function createJpegFrameStreamEncoder({
  ffmpegPath,
  outputPath,
  width,
  height,
  fps,
  sourceWidth,
  sourceHeight,
  jpegQuality = 95,
}) {
  const scaleFilter =
    sourceWidth && sourceHeight && (sourceWidth !== width || sourceHeight !== height)
      ? [`-vf`, `scale=${width}:${height}:flags=neighbor`]
      : [];

  const args = [
    '-y',
    '-f',
    'image2pipe',
    '-vcodec',
    'mjpeg',
    '-framerate',
    String(fps),
    '-i',
    'pipe:0',
    ...scaleFilter,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-r',
    String(fps),
    '-an',
    outputPath,
  ];

  const proc = spawn(ffmpegPath, args, {
    stdio: ['pipe', 'ignore', 'pipe'],
  });

  let stderr = '';
  proc.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  return {
    jpegQuality,
    writeFrame(buffer) {
      if (!proc.stdin.write(buffer)) {
        return new Promise((resolve) => {
          proc.stdin.once('drain', resolve);
        });
      }

      return Promise.resolve();
    },
    async finish() {
      proc.stdin.end();
      await waitForProcess(proc, 'ffmpeg (video stream)');
    },
    getStderr: () => stderr,
  };
}

/**
 * Mux a video-only MP4 with a mixed WAV into the final output.
 */
export function muxVideoAndAudio({
  ffmpegPath,
  videoPath,
  audioPath,
  outputPath,
}) {
  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-i',
      videoPath,
      '-i',
      audioPath,
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-shortest',
      outputPath,
    ];

    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`ffmpeg (mux) failed: ${stderr.trim()}`));
    });
  });
}
