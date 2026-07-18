import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sfxr } from 'jsfxr';

/** Change this preset to regenerate test-beep.wav with a different sound. */
const PRESET = 'blipSelect';

const outputPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../public/audio/sfx/test-beep.wav',
);

const sound = sfxr.generate(PRESET);
const { dataURI } = sfxr.toWave(sound);
const base64 = dataURI.split(',')[1];

writeFileSync(outputPath, Buffer.from(base64, 'base64'));
console.log(`Generated ${outputPath} using preset "${PRESET}"`);
