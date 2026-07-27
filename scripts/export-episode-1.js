#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { exportEpisode } from '../server/export/exportEpisode.js';
import { checkFfmpeg } from '../server/export/checkFfmpeg.js';

const args = process.argv.slice(2);
const episodeId = args.find((arg) => !arg.startsWith('--')) ?? 'episode-1';
const profile = args.includes('--profile');
const testDurationSec = args.includes('--test') ? 5 : null;
const testId = args.includes('--opening-test')
  ? 'openingThroughShotTen'
  : args.includes('--subtitle-test')
    ? 'subtitleSafeArea'
    : args.includes('--perf-test')
      ? 'performanceSample'
      : null;

async function startExportDevServer() {
  const server = await createServer({
    configFile: fileURLToPath(new URL('../vite.config.js', import.meta.url)),
    server: {
      host: '127.0.0.1',
      port: Number(process.env.PORT ?? 5173),
      strictPort: false,
    },
  });

  await server.listen();

  const address = server.httpServer?.address();
  const port =
    address && typeof address === 'object' ? address.port : Number(process.env.PORT ?? 5173);

  return {
    server,
    baseUrl: `http://127.0.0.1:${port}`,
  };
}

async function main() {
  const ffmpeg = checkFfmpeg();
  if (!ffmpeg.ok) {
    console.error(ffmpeg.error);
    process.exit(1);
  }

  const { server, baseUrl } = await startExportDevServer();

  try {
    const result = await exportEpisode({
      episodeId,
      baseUrl,
      testDurationSec: testId ? null : testDurationSec,
      testId,
      profile,
      onProgress: (progress) => {
        if (progress.currentFrame && progress.totalFrames) {
          const { currentFrame, totalFrames } = progress;
          if (
            profile ||
            currentFrame === 1 ||
            currentFrame === totalFrames ||
            currentFrame % 60 === 0
          ) {
            console.log(`[Export] ${progress.message} (${progress.percent}%)`);
          }
          return;
        }

        console.log(`[Export] ${progress.message} (${progress.percent ?? 0}%)`);
      },
    });

    if (!result.ok) {
      console.error(`[Export] Failed: ${result.error}`);
      process.exit(1);
    }

    console.log(`[Export] Wrote ${result.outputPath}`);
    console.log('[Export] Validation:', result.validation);

    if (result.profile) {
      console.log('[Export] Profile:', result.profile);
    }
  } finally {
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
