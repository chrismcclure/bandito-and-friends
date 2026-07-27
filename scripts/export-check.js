#!/usr/bin/env node

import { checkFfmpeg } from '../server/export/checkFfmpeg.js';

const result = checkFfmpeg();

if (result.ok) {
  console.log('FFmpeg is available:');
  console.log(`  ffmpeg:  ${result.ffmpegPath}`);
  console.log(`  ffprobe: ${result.ffprobePath}`);
  process.exit(0);
}

console.error(result.error);
process.exit(1);
