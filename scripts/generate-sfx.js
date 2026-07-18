import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sfxr } from 'jsfxr';
import { INTRO_SFX_PRESETS } from './intro-sfx-presets.js';

const outputDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '../public/audio/sfx',
);

for (const { filename, params } of INTRO_SFX_PRESETS) {
  const outputPath = join(outputDir, filename);
  const { dataURI } = sfxr.toWave(params);
  const base64 = dataURI.split(',')[1];

  writeFileSync(outputPath, Buffer.from(base64, 'base64'));
  console.log(`Generated ${filename}`);
}

console.log(`\nWrote ${INTRO_SFX_PRESETS.length} files to public/audio/sfx/`);
