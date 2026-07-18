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
  config.js   # Internal stage size (270×480, 9:16 vertical)
  app.js      # PixiJS application setup and responsive scaling
  main.js     # Entry point
  style.css   # Page layout and movie frame styling
```

The PixiJS stage renders at 270×480 pixels (9:16). The canvas scales up to fill as much of the browser window as possible while staying fully visible, centered, and crisp.
