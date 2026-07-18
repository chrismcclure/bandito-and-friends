# Series Opening — Canonical Production Asset

Visual opening sequence that replaces the scroll crawl in default playback. Teaches one idea: **humans see an ordinary house; cats see Meow City.**

The legacy Zelda-style crawl is **preserved** — preview at `?scene=crawl`.

---

## Runtime Assets

| Field | Value |
|-------|-------|
| **Scene** | `src/scenes/SeriesOpeningScene.js` |
| **Shot config** | `src/data/series-opening-shots.js` |
| **Opening music** | `src/audio/seriesOpeningMusicScore.js` + `SeriesOpeningMusic.js` |
| **Player** | Reuses `src/episode/EpisodePlayer.js` |
| **Placeholders** | `public/images/series-opening/placeholders/` |
| **Final art** | `public/images/series-opening/finals/` |

---

## Sequence

| Shot | Duration | Caption | Visual |
|------|----------|---------|--------|
| 01 | 2s | An ordinary living room... | **Final** — `finals/shot-01-ordinary-living-room.png` |
| 02 | 2s | ...to humans. | **Final** — split transform v2 (human side, pan) |
| 03 | 2s | But to four brave cats... | **Final** — `finals/shot-03-cat-view-meow-city.png` |
| 04 | 2s | This is Meow City. | **Final** — `finals/shot-04-meow-city-establishing.png` |
| 05 | 3s | And every day... / ...they stand watch. | **Final** — `finals/shot-05-rooftop-watch.png` → white flash |
| — | 2.5s | — | Bandito and Friends title |
| — | — | — | Meet the Team → Episode 1 → story |

**Opening runtime:** ~11 seconds before title flash.

**Opening music:** ~15s layered one-shot cue (arpeggio + bass pulse + melody → resolve). Plays during shots 01–05, fades out when the title appears, then hands off to the existing intro title theme in `IntroMusic.js`.

---

## Dev URLs

| URL | Purpose |
|-----|---------|
| `/` | Full episode (new opening) |
| `/?scene=opening` | Series opening only |
| `/?scene=crawl` | Legacy scroll crawl prototype |

---

## Replacement Workflow

1. Save final still to `public/images/series-opening/finals/shot-XX-<name>.png`
2. Update `assetPath` in `src/data/series-opening-shots.js`
3. Set `status: 'final'`
4. Reload — timing, captions, and camera unchanged

Regenerate placeholders:

```bash
npm run generate:placeholders
```

---

## Creative Rules

- Show the dual reality visually — do not explain imagination
- Shot 01 must feel completely ordinary
- Transformation progresses: ordinary → partial → full Meow City
- Shot 04 is the signature establishing shot for the series
