# Bandito and Friends

A JavaScript-based 8-bit animated short series inspired by classic NES games such as Mega Man and DuckTales. This project uses a timeline-driven approach to produce vertical animated content for YouTube Shorts and TikTok.

## Requirements

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

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
  data/episode-01-threat-board.js  Episode 1 peaceful assessment data
  scenes/                          Intro and preview scenes
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
```

The default intro remains available at `http://localhost:5173/` with no query parameter.

### Future episodes

Provide new threat data by creating a file in `src/data/` and passing it to `createThreatBoard(data)`. Do not hard-code episode content inside the component.
