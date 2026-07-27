/**
 * Generates vertical 9:16 placeholder storyboard cards for Episode 1.
 * Run: npm run generate:placeholders
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(
  __dirname,
  '../public/images/episodes/episode-01/placeholders',
);

const WIDTH = 270;
const HEIGHT = 480;

/** @type {Array<{filename: string, id: string, title: string, description: string, motion: string, duration: number, accent: string}>} */
export const PLACEHOLDER_SPECS = [
  {
    filename: 'shot-01-opening-crawl.svg',
    id: '01',
    title: 'OPENING CRAWL',
    description: 'Existing crawl scene — not loaded by episode player.',
    motion: 'Scroll up',
    duration: 7,
    accent: '#6b4f2a',
  },
  {
    filename: 'shot-02-main-title.svg',
    id: '02',
    title: 'MAIN TITLE',
    description: 'Existing Bandito and Friends title artwork.',
    motion: 'Flash in + hold',
    duration: 2.5,
    accent: '#9a7340',
  },
  {
    filename: 'shot-03a-bandito-leader.svg',
    id: '03A',
    title: 'BANDITO',
    description: 'Confident heroic pose, red scarf, ready to protect Meow City.',
    motion: 'Slow push in',
    duration: 2,
    accent: '#c0392b',
  },
  {
    filename: 'shot-03b-professor-brains.svg',
    id: '03B',
    title: 'PROFESSOR SPAGHETTIO',
    description: 'Beside Threat Board, glasses, wooden pointer.',
    motion: 'Pan board → Professor',
    duration: 2,
    accent: '#8e44ad',
  },
  {
    filename: 'shot-03c-girl-frederick-muscle.svg',
    id: '03C',
    title: 'GIRL FREDERICK',
    description: 'Serious ready-to-pounce fighting stance.',
    motion: 'Quick dramatic push-in',
    duration: 2,
    accent: '#2980b9',
  },
  {
    filename: 'shot-03d-tortellini-wild-card.svg',
    id: '03D',
    title: 'TORTELLINI',
    description: 'Calm stare at wall while team waits for tactical insight.',
    motion: 'Static / very slow zoom',
    duration: 2,
    accent: '#27ae60',
  },
  {
    filename: 'shot-04-episode-card.svg',
    id: '04',
    title: 'EPISODE 1',
    description: 'THE SOCK MONSTER — retro pixel title card.',
    motion: 'Hard cut in',
    duration: 2,
    accent: '#f39c12',
  },
  {
    filename: 'shot-05a-bandito-patrol.svg',
    id: '05A',
    title: 'BANDITO ON PATROL',
    description: 'Wide living room, cat-height view, Bandito patrols Meow City.',
    motion: 'Slow pan following Bandito',
    duration: 2.5,
    accent: '#c0392b',
  },
  {
    filename: 'shot-05b-bandito-stops.svg',
    id: '05B',
    title: 'BANDITO STOPS',
    description: 'Ears rise, eyes narrow — something ahead.',
    motion: 'Pan stops, push to face',
    duration: 1.5,
    accent: '#c0392b',
  },
  {
    filename: 'shot-06a-sock-reveal.svg',
    id: '06A',
    title: 'SOCK REVEAL',
    description: 'Low-angle ordinary sock on floor — mysterious and threatening.',
    motion: 'Slow dramatic zoom',
    duration: 1.5,
    accent: '#7f8c8d',
  },
  {
    filename: 'shot-06b-bandito-shocked.svg',
    id: '06B',
    title: 'BANDITO SHOCKED',
    description: 'Close-up shocked but determined Bandito.',
    motion: 'Slow push',
    duration: 1.5,
    accent: '#c0392b',
  },
  {
    filename: 'shot-06c-bandito-assemble.svg',
    id: '06C',
    title: 'ASSEMBLE',
    description: 'Bandito turns heroically to call reinforcements.',
    motion: 'Quick turn framing',
    duration: 1.5,
    accent: '#c0392b',
  },
  {
    filename: 'shot-07a-team-arrives.svg',
    id: '07A',
    title: 'TEAM ARRIVAL',
    description: 'Professor with scanner, Girl Frederick ready, Tortellini wanders in.',
    motion: 'Quick lateral entries',
    duration: 2,
    accent: '#8e44ad',
  },
  {
    filename: 'shot-07b-professor-scans.svg',
    id: '07B',
    title: 'THREAT SCAN',
    description: 'Homemade scanner reads the sock — improvised and ridiculous.',
    motion: 'Hold + subtle push',
    duration: 2,
    accent: '#8e44ad',
  },
  {
    filename: 'shot-07c-attack-stances.svg',
    id: '07C',
    title: 'ATTACK STANCES',
    description: 'Girl Frederick ready, Bandito watches sock, Tortellini wrong way.',
    motion: 'Static tension hold',
    duration: 1.5,
    accent: '#2980b9',
  },
  {
    filename: 'shot-08a-bandito-charge.svg',
    id: '08A',
    title: 'BANDITO CHARGES',
    description: 'Heroic charge toward the motionless sock.',
    motion: 'Fast push + speed lines',
    duration: 1,
    accent: '#c0392b',
  },
  {
    filename: 'shot-08b-girl-frederick-leap.svg',
    id: '08B',
    title: 'GIRL FREDERICK LEAPS',
    description: 'Exaggerated leap toward the sock.',
    motion: 'Upward move + hard cut',
    duration: 1,
    accent: '#2980b9',
  },
  {
    filename: 'shot-08c-professor-device.svg',
    id: '08C',
    title: 'PROFESSOR DEVICE',
    description: 'Homemade invention sparks at the sock.',
    motion: 'Flash + hold',
    duration: 1,
    accent: '#8e44ad',
  },
  {
    filename: 'shot-08e-team-shock.svg',
    id: '08E',
    title: 'TEAM SHOCK',
    description: 'Heroes interpret stillness as a terrifying strategy.',
    motion: 'Static reaction',
    duration: 1.5,
    accent: '#e67e22',
  },
  {
    filename: 'shot-09a-tortellini-has-a-plan.svg',
    id: '09A',
    title: 'TORTELLINI HAS A PLAN',
    description: 'Tortellini heavy breathing — the team reads it as strategic genius.',
    motion: 'Static comedic hold',
    duration: 1,
    accent: '#27ae60',
  },
  {
    filename: 'shot-09b-bandito-plan-too-dangerous.svg',
    id: '09B',
    title: 'PLAN TOO DANGEROUS',
    description: 'Bandito yells at Tortellini — that plan is too dangerous.',
    motion: 'Static',
    duration: 1,
    accent: '#27ae60',
  },
  {
    filename: 'shot-09c-tortellini-starts-to-fall.svg',
    id: '09C',
    title: 'TORTELLINI FALLS',
    description: 'Tortellini slips and starts to fall — silent beat.',
    motion: 'Slow push',
    duration: 1.5,
    accent: '#c0392b',
  },
  {
    filename: 'shot-10a-giant-shadow-over-sock-monster.svg',
    id: '10A',
    title: 'GIANT SHADOW',
    description: 'Tortellini’s giant shadow looms over terrified Sir Sockington.',
    motion: 'Slow zoom out',
    duration: 1.5,
    accent: '#e74c3c',
  },
  {
    filename: 'shot-10c-tortellini-squish.svg',
    id: '10C',
    title: 'SQUISH',
    description: 'Tortellini flops onto sock. Screen shake.',
    motion: 'Drop + shake',
    duration: 1,
    accent: '#27ae60',
  },
  {
    filename: 'shot-10e-celebration.svg',
    id: '10E',
    title: 'CELEBRATION',
    description: 'Team celebrates victory in Meow City street.',
    motion: 'Gentle push',
    duration: 1.5,
    accent: '#f1c40f',
  },
  {
    filename: 'shot-11a-human-room.svg',
    id: '11A',
    title: 'HUMAN VIEW',
    description: 'Ordinary living room — just a house, just a sock.',
    motion: 'Neutral static',
    duration: 1.5,
    accent: '#95a5a6',
  },
  {
    filename: 'shot-11b-human-over-shoulder.svg',
    id: '11B',
    title: 'OVER THE SHOULDER',
    description: 'Human over-the-shoulder view of the four cats.',
    motion: 'Pan up slightly',
    duration: 2,
    accent: '#95a5a6',
  },
  {
    filename: 'shot-12a-heroic-celebration.svg',
    id: '12A',
    title: 'HEROIC CELEBRATION',
    description: 'Team celebrates on Meow City rooftop — Meow City safe once again.',
    motion: 'Slow push',
    duration: 2,
    accent: '#c0392b',
  },
  {
    filename: 'shot-12b-celebration-freeze-frame.svg',
    id: '12B',
    title: 'CELEBRATION FREEZE',
    description: 'Team jumps and high-fives — freeze on heroic celebration.',
    motion: 'Upward zoom + freeze',
    duration: 2,
    accent: '#f39c12',
  },
  {
    filename: 'shot-12c-credits.svg',
    id: '12C',
    title: 'CREDITS',
    description: 'Chris and Audrey — creators credit in Meow City.',
    motion: 'Static hold',
    duration: 2.5,
    accent: '#2c3e50',
  },
  {
    filename: 'shot-12d-tools-used.svg',
    id: '12D',
    title: 'TOOLS WE USED',
    description: 'How we made this — Cursor, ChatGPT, Composer, JS, GitHub.',
    motion: 'Static hold',
    duration: 2.5,
    accent: '#1abc9c',
  },
  {
    filename: 'shot-12e-thanks-for-watching.svg',
    id: '12E',
    title: 'THANKS FOR WATCHING',
    description: 'Full group shot — thanks for watching, let us know if you want more.',
    motion: 'Static hold',
    duration: 3,
    accent: '#e74c3c',
  },
];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function createPlaceholderSvg(spec, { showFinalPath = false } = {}) {
  const descriptionLines = wrapText(spec.description, 34);
  const lineStartY = 250;
  const lineHeight = 16;

  const descriptionMarkup = descriptionLines
    .map((line, index) => {
      const y = lineStartY + index * lineHeight;
      return `<text x="135" y="${y}" text-anchor="middle" font-family="monospace" font-size="11" fill="#ecf0f1">${escapeXml(line)}</text>`;
    })
    .join('\n  ');

  const finalPathMarkup = showFinalPath && spec.finalAssetPath
    ? `<text x="135" y="430" text-anchor="middle" font-family="monospace" font-size="8" fill="#95a5a6">REPLACE: ${escapeXml(spec.finalAssetPath)}</text>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#1a1a2e"/>
  <rect x="12" y="12" width="${WIDTH - 24}" height="${HEIGHT - 24}" fill="#16213e" stroke="${spec.accent}" stroke-width="3"/>
  <rect x="20" y="20" width="${WIDTH - 40}" height="72" fill="${spec.accent}" opacity="0.25"/>
  <text x="135" y="48" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#f8e898">PLACEHOLDER</text>
  <text x="135" y="68" text-anchor="middle" font-family="monospace" font-size="11" fill="#ffffff">SHOT ${escapeXml(spec.id)}</text>
  <text x="135" y="110" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#ffffff">${escapeXml(spec.title)}</text>
  <text x="24" y="150" font-family="monospace" font-size="10" fill="#bdc3c7">VISUAL:</text>
  ${descriptionMarkup}
  <text x="24" y="340" font-family="monospace" font-size="10" fill="#bdc3c7">CAMERA:</text>
  <text x="24" y="358" font-family="monospace" font-size="11" fill="#ecf0f1">${escapeXml(spec.motion)}</text>
  <text x="24" y="390" font-family="monospace" font-size="10" fill="#bdc3c7">DURATION:</text>
  <text x="24" y="408" font-family="monospace" font-size="11" fill="#ecf0f1">${spec.duration.toFixed(1)}s</text>
  <text x="135" y="450" text-anchor="middle" font-family="monospace" font-size="9" fill="#7f8c8d">${escapeXml(spec.filename)}</text>
  ${finalPathMarkup}
</svg>
`;
}

const SERIES_OPENING_DIR = join(
  __dirname,
  '../public/images/series-opening/placeholders',
);

/** @type {typeof PLACEHOLDER_SPECS} */
export const SERIES_OPENING_SPECS = [
  {
    filename: 'shot-01-ordinary-living-room.svg',
    id: '01',
    title: 'ORDINARY LIVING ROOM',
    description: 'Warm ordinary living room. No cats. No fantasy. No Meow City.',
    motion: 'Static hold',
    duration: 2,
    accent: '#8B7355',
    finalAssetPath: 'public/images/series-opening/finals/shot-01-ordinary-living-room.png',
  },
  {
    filename: 'shot-02-human-view-transform.svg',
    id: '02',
    title: 'HUMAN VIEW',
    description: 'Same camera angle. Room partially transforming into pixel art.',
    motion: 'Static hold',
    duration: 2,
    accent: '#7f8c8d',
    finalAssetPath: 'public/images/series-opening/finals/shot-02-human-view-transform.png',
  },
  {
    filename: 'shot-03-cat-view-meow-city.svg',
    id: '03',
    title: 'CAT VIEW — MEOW CITY',
    description: 'Transformation complete. Rooftops, moon, neon, cat-scale city.',
    motion: 'Slow zoom',
    duration: 2,
    accent: '#6c5ce7',
    finalAssetPath: 'public/images/series-opening/finals/shot-03-cat-view-meow-city.png',
  },
  {
    filename: 'shot-04-meow-city-establishing.svg',
    id: '04',
    title: 'MEOW CITY ESTABLISHING',
    description: 'Wide signature establishing shot of Meow City.',
    motion: 'Slow push in',
    duration: 2,
    accent: '#0984e3',
    finalAssetPath: 'public/images/series-opening/finals/shot-04-meow-city-establishing.png',
  },
  {
    filename: 'shot-05-rooftop-watch.svg',
    id: '05',
    title: 'ROOFTOP WATCH',
    description: 'Slow pan across rooftops. Four hero silhouettes stand watch.',
    motion: 'Pan right → white flash to title',
    duration: 3,
    accent: '#2d3436',
    finalAssetPath: 'public/images/series-opening/finals/shot-05-rooftop-watch.png',
  },
];

mkdirSync(OUTPUT_DIR, { recursive: true });
mkdirSync(SERIES_OPENING_DIR, { recursive: true });

for (const spec of PLACEHOLDER_SPECS) {
  const outputPath = join(OUTPUT_DIR, spec.filename);
  writeFileSync(outputPath, createPlaceholderSvg(spec));
}

for (const spec of SERIES_OPENING_SPECS) {
  const outputPath = join(SERIES_OPENING_DIR, spec.filename);
  writeFileSync(outputPath, createPlaceholderSvg(spec, { showFinalPath: true }));
}

console.log(`Generated ${PLACEHOLDER_SPECS.length} episode placeholders in ${OUTPUT_DIR}`);
console.log(`Generated ${SERIES_OPENING_SPECS.length} series opening placeholders in ${SERIES_OPENING_DIR}`);
