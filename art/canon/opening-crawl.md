# Opening Crawl — Canonical Production Asset

Reusable opening sequence that plays **before every episode**, immediately before the existing title screen.

---

## Runtime Asset

| Field | Value |
|-------|-------|
| **Scene** | `src/scenes/OpeningCrawlScene.js` |
| **Text** | `src/data/opening-crawl.js` |
| **Music** | `src/audio/OpeningCrawlMusic.js` |
| **Handoff** | Existing title screen at `INTRO_TIMING.TITLE_START` (5.4s) — unchanged |

---

## Sequence Flow

1. **CLICK TO START** overlay
2. **Opening crawl** — scrolling text + gentle NES music (~13–14 seconds)
3. **Fade to black** (~0.5 seconds)
4. **Title screen** — existing `Bandito-and-friends-v2.png` intro (unchanged)
5. Episode-specific intro content continues as before

The three text cards ("IN A QUIET HOUSE…") are skipped when the crawl plays — the crawl replaces that world setup. Title screen and episode titles are untouched.

---

## Presentation Style

Inspired by the **NES Legend of Zelda opening crawl** (presentation only — original wording):

- Vertical 9:16 (`270×480`)
- Text scrolls upward from the bottom
- Pixel monospace font, center-aligned, mobile-first sizing (12px / 22px line height)
- Wide text block (~3–6 words per line) for arm's-length phone reading
- Black background with subtle static stars
- Original **storybook cat adventure** frame border (paw prints, yarn, fish bone, cat ears, tail vines)

---

## World Rules Established

The crawl teaches viewers in three beats:

- Humans see an ordinary house
- Four cats know it as **Meow City**
- They believe they protect it from danger

It does **not** say "imagination" or "pretend." Both realities are stated naturally.

---

## Development Preview

```bash
npm run dev
```

| URL | Purpose |
|-----|---------|
| `http://localhost:5173/` | Full sequence: crawl → title → episode intro |
| `http://localhost:5173/?scene=crawl` | Opening crawl only |

---

## Reuse

Future episodes reference this asset automatically via `runOpeningSequence()` in `src/app.js`. Do not recreate the crawl per episode. Update text only if the series premise changes (rare).
