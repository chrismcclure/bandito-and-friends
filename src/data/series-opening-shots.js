/**
 * Series opening shot list — plays once before every episode.
 *
 * Teaches the audience: humans see an ordinary house, cats see Meow City.
 * Not episode-specific; shared across the whole series.
 */
/** Paths for the series opening (replaces scroll crawl in default playback). */

export const SERIES_OPENING_ASSET_BASE = '/images/series-opening/placeholders';
export const SERIES_OPENING_FINALS_BASE = '/images/series-opening/finals';

/**
 * Visual opening — teaches: humans see an ordinary house; cats see Meow City.
 * Legacy scroll crawl preserved at ?scene=crawl.
 */
export const SERIES_OPENING_SHOTS = [
  {
    id: '01-ordinary-living-room',
    title: 'Ordinary Living Room',
    type: 'image',
    assetPath: `${SERIES_OPENING_FINALS_BASE}/shot-01-ordinary-living-room.png`,
    finalAssetPath: `${SERIES_OPENING_FINALS_BASE}/shot-01-ordinary-living-room.png`,
    duration: 2,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1,
    cameraScaleEnd: 1,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    dialogue: 'An ordinary living room...',
    musicCue: 'opening-warm',
    visualEffect: 'none',
    status: 'final',
    notes: 'Nana’s living room — real reference photo',
  },
  {
    id: '02-human-view',
    title: 'Human View — Partial Transform',
    type: 'image',
    assetPath: `${SERIES_OPENING_FINALS_BASE}/shot-02-human-view-transform.png`,
    finalAssetPath: `${SERIES_OPENING_FINALS_BASE}/shot-02-human-view-transform.png`,
    duration: 2,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'static',
    cameraScaleStart: 1.35,
    cameraScaleEnd: 1.35,
    cameraPositionStart: { x: 100, y: 0 },
    cameraPositionEnd: { x: 100, y: 0 },
    dialogue: '...to humans.',
    musicCue: 'opening-transform',
    visualEffect: 'none',
    status: 'final',
    notes: 'Split transform art — human side (left)',
  },
  {
    id: '03-cat-view',
    title: 'Cat View — Meow City Complete',
    type: 'image',
    assetPath: `${SERIES_OPENING_FINALS_BASE}/shot-03-cat-view-meow-city.png`,
    finalAssetPath: `${SERIES_OPENING_FINALS_BASE}/shot-03-cat-view-meow-city.png`,
    duration: 2,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'slow-zoom',
    cameraScaleStart: 1,
    cameraScaleEnd: 1.06,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    dialogue: 'But to four brave cats...',
    musicCue: 'opening-transform',
    visualEffect: 'none',
    status: 'final',
    notes: 'Full Meow City living room — cat perspective',
  },
  {
    id: '04-meow-city-establishing',
    title: 'Meow City Establishing',
    type: 'image',
    assetPath: `${SERIES_OPENING_FINALS_BASE}/shot-04-meow-city-establishing.png`,
    finalAssetPath: `${SERIES_OPENING_FINALS_BASE}/shot-04-meow-city-establishing.png`,
    duration: 2,
    transitionIn: 'cut',
    transitionOut: 'cut',
    cameraMovement: 'push-in',
    cameraScaleStart: 1,
    cameraScaleEnd: 1.06,
    cameraPositionStart: { x: 0, y: 0 },
    cameraPositionEnd: { x: 0, y: 0 },
    dialogue: 'This is Meow City.',
    musicCue: 'opening-heroic',
    visualEffect: 'none',
    status: 'final',
    notes: 'Wide establishing — signature series skyline shot',
  },
  {
    id: '05-rooftop-watch',
    title: 'Rooftop Watch',
    type: 'image',
    assetPath: `${SERIES_OPENING_FINALS_BASE}/shot-05-rooftop-watch.png`,
    finalAssetPath: `${SERIES_OPENING_FINALS_BASE}/shot-05-rooftop-watch.png`,
    duration: 3,
    transitionIn: 'cut',
    transitionOut: 'flash',
    cameraMovement: 'pan-right',
    cameraScaleStart: 1.08,
    cameraScaleEnd: 1.08,
    cameraPositionStart: { x: -24, y: 0 },
    cameraPositionEnd: { x: 24, y: 0 },
    dialogue: 'And every day...',
    secondaryDialogue: '...they stand watch.',
    secondaryDialogueAt: 1.4,
    musicCue: 'opening-heroic',
    visualEffect: 'none',
    status: 'final',
    notes: 'Rooftop silhouettes — slow pan, flash out to title',
  },
];

export function getSeriesOpeningTotalDuration(shots = SERIES_OPENING_SHOTS) {
  return shots.reduce((total, shot) => total + shot.duration, 0);
}
