import { spawnSync } from 'node:child_process';

/**
 * @returns {{ ok: true, ffmpegPath: string, ffprobePath: string } | { ok: false, error: string }}
 */
export function checkFfmpeg() {
  const ffmpeg = findBinary('ffmpeg');
  if (!ffmpeg) {
    return {
      ok: false,
      error:
        'FFmpeg is not installed or not available in PATH. Install it with: brew install ffmpeg',
    };
  }

  const ffprobe = findBinary('ffprobe');
  if (!ffprobe) {
    return {
      ok: false,
      error:
        'FFprobe is not installed or not available in PATH. Install FFmpeg with: brew install ffmpeg',
    };
  }

  return { ok: true, ffmpegPath: ffmpeg, ffprobePath: ffprobe };
}

function findBinary(name) {
  const result = spawnSync('which', [name], { encoding: 'utf8' });
  if (result.status !== 0) {
    return null;
  }

  const path = result.stdout.trim();
  return path || null;
}

export function runCommand(binary, args, { label = binary } = {}) {
  const result = spawnSync(binary, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() || result.stdout?.trim() || 'Unknown error';
    throw new Error(`${label} failed: ${stderr}`);
  }

  return result.stdout;
}
