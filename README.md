# Bandito and Friends

A JavaScript-based 8-bit animated short series inspired by classic NES games such as Mega Man and DuckTales. This project uses a timeline-driven approach to produce vertical animated content for YouTube Shorts and TikTok.

## Requirements

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm
- [FFmpeg](https://ffmpeg.org/) (required for video export)

### Install FFmpeg (macOS)

```bash
brew install ffmpeg
```

Verify the installation:

```bash
npm run export:check
```

## Installation

```bash
npm install
```

## Development

Start the local dev server:

```bash
npm run dev
```

Open the URL shown in your terminal (typically `http://localhost:5173`).

### Export Episode 1 video

Episode 1 developer controls include an **Export Episode 1 MP4** button.

1. Start the dev server: `npm run dev`
2. Open `http://localhost:5173/?scene=episode`
3. Click **Export Episode 1 MP4**
4. Wait for progress updates (frame rendering, audio mix, encoding)
5. Download the finished file when the export completes

The final MP4 is saved at:

```
exports/episode-1/bandito-and-friends-episode-1.mp4
```

The export includes the complete show timeline: NES title menu, pixel-load transition, series opening, intro title hold, and all of Episode 1. Audio includes title-menu SFX, series opening music, intro theme (continuing through early episode shots), and all episode music/SFX.

### Command-line export

You can also export from the terminal (useful for automation or troubleshooting):

```bash
npm run export:episode1
```

Short 5-second test export:

```bash
npm run export:episode1:test
```

Profile a representative 10-second section:

```bash
npm run export:episode1:profile
```

Validate title menu through episode shot 10:

```bash
npm run export:episode1:opening-test
```

If FFmpeg is missing, `npm run export:check` prints setup instructions.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
  config.js                        Internal stage size (270×480, 9:16 vertical)
  app.js                           PixiJS boot, responsive scaling, dev scene routing
  main.js                          Entry point
  style.css                        Page layout and movie frame styling
  props/ThreatBoard.js             Reusable Threat Board visual component
  props/threatBoardModel.js        Threat Board data shape and status colors
  data/episode-01-shots.js         Episode 1 shot list (timing, camera, dialogue)
  data/episode-01-threat-board.js Episode 1 peaceful assessment data
  episode/EpisodePlayer.js        Reusable data-driven episode player
  episode/camera.js               Camera interpolation helpers
  dev/EpisodeDevControls.js       Development shot review controls
  scenes/                          Intro, crawl, and preview scenes
  dev/sceneParam.js                Development scene query parameter helper
```

The PixiJS stage renders at 270×480 pixels (9:16). The canvas scales up to fill as much of the browser window as possible while staying fully visible, centered, and crisp.

## Meow City Threat Board

Professor SpaghettiO's **Threat Board** is a reusable story prop for displaying Daily Threat Assessment data.

| Item | Location |
|------|----------|
| Visual component | `src/props/ThreatBoard.js` |
| Data model / status colors | `src/props/threatBoardModel.js` |
| Episode-specific entries | `src/data/` (e.g. `episode-01-threat-board.js`) |

### Development preview

Preview the Threat Board without replaying the intro:

```bash
npm run dev
```

Open:

```
http://localhost:5173/?scene=threat-board
http://localhost:5173/?scene=opening
http://localhost:5173/?scene=crawl
http://localhost:5173/?scene=episode
```

The default route at `http://localhost:5173/` plays the full Episode 1 sequence (visual series opening → title → Meet the Team → story).

See `story/episode-01-production.md` and `art/canon/series-opening.md` for shot lists.

**Clickable production runbook:** [`story/order-of-operations.md`](story/order-of-operations.md) — open in the editor middle panel to jump to any shot.

### Future episodes

Provide new threat data by creating a file in `src/data/` and passing it to `createThreatBoard(data)`. Do not hard-code episode content inside the component.
