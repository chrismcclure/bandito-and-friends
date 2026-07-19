# Episode 1 Production — The Sock Monster

Complete shot list, placeholder assets, and replacement workflow for the ~60 second vertical episode.

---

## Overview

| Item | Location |
|------|----------|
| Shot configuration | `src/data/episode-01-shots.js` |
| Episode player | `src/episode/EpisodePlayer.js` |
| Camera helpers | `src/episode/camera.js` |
| Placeholder assets | `public/images/episodes/episode-01/placeholders/` |
| Placeholder generator | `scripts/generate-placeholders.js` |
| Dev controls | `src/dev/EpisodeDevControls.js` |
| Story bible | `story/episode-01-the-sock-monster.md` |

---

## Full Sequence (no repetition)

1. **Series opening** — visual transform ordinary house → Meow City (~11s) — `src/data/series-opening-shots.js`
2. **Main title** — existing title artwork, 2.5s hold (white flash in)
3. **Meet the Team** — shots `03a`–`03d` (10s)
4. **Episode card** — shot `04` (2s)
5. **Story** — shots `05a`–`12c` (41s)
6. **Freeze / closing** — final shots hold on frame

**Legacy scroll crawl** preserved at `/?scene=crawl` (not used in default playback).

**Estimated total runtime:** ~64s

---

## Dev URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:5173/` | Full episode from series opening |
| `http://localhost:5173/?scene=opening` | Series opening only (5 shots) |
| `http://localhost:5173/?scene=crawl` | Legacy scroll crawl prototype |
| `http://localhost:5173/?scene=episode` | Meet the Team → story only |

Use the **Episode 1 Dev Controls** panel (top-right) to play, pause, restart, step shots, loop a shot, or jump by shot number.

Regenerate placeholders:

```bash
npm run generate:placeholders
```

---

## Drop-in workflow (repeat for every new image)

When you send a final still, we:

1. Save it to `public/images/episodes/episode-01/finals/shot-<id>.png` (matches shot list filename)
2. Update `assetPath` + `status: 'final'` for that shot in `src/data/episode-01-shots.js`
3. Mark the row `[x]` in the shot list below
4. Reload — timing, camera, and captions stay as configured

**No need to re-explain each time** — just drop the image and say which shot (or character/scene) it’s for.

| Shot | Final asset | Status |
|------|-------------|--------|
| 03a Bandito | `finals/shot-03a-bandito-leader.png` | Final — *v1 archived as `shot-03a-bandito-leader-v1-superseded.png`* |
| 03b Professor | `finals/shot-03b-professor-brains.png` | Final — *v1 archived as `shot-03b-professor-brains-v1-superseded.png`* |
| 03c Girl Frederick | `finals/shot-03c-girl-frederick-muscle.png` | Final |
| 03d Tortellini | `finals/shot-03d-tortellini-wild-card.png` | Final |

---

## Image Replacement Workflow (detail)

1. Create or generate the final still image at **270×480** (9:16 vertical).
2. Save it to `public/images/episodes/episode-01/finals/` (recommended) or replace the placeholder file directly.
3. Update **one line** in `src/data/episode-01-shots.js` — the shot’s `assetPath` — if the filename or extension changed.
4. Set `status: 'final'` on that shot when approved.
5. Reload the dev server — timing, camera, captions, and transitions stay intact.

**Example:**

```js
{
  id: '03a-bandito-leader',
  assetPath: '/images/episodes/episode-01/finals/shot-03a-bandito-leader.png',
  status: 'final',
  // duration, cameraMovement, dialogue, etc. unchanged
}
```

Camera movement lives in the shot config — **not** in the image file.

---

## Shot List

Status key: `[ ]` placeholder · `[x]` final art approved

### Intro (handled outside episode player)

| Status | ID | File | Duration | Notes |
|--------|----|------|----------|-------|
| [x] | 01 | `shot-01-opening-crawl.svg` | ~14s | Existing crawl scene |
| [x] | 02 | `shot-02-main-title.svg` | 2.5s | Existing title artwork |

### Meet the Team

| Status | ID | File | Duration | Camera | Labels |
|--------|----|------|----------|--------|--------|
| [x] | 03a | `finals/shot-03a-bandito-leader.png` | 2.5s | Push in | BANDITO / THE LEADER |
| [x] | 03b | `finals/shot-03b-professor-brains.png` | 2.5s | Pan right | PROFESSOR SPAGHETTIO / THE BRAINS |
| [x] | 03c | `finals/shot-03c-girl-frederick-muscle.png` | 2.5s | Push in | Titles in artwork |
| [x] | 03d | `finals/shot-03d-tortellini-wild-card.png` | 2.5s | Slow zoom | Titles in artwork |

### Episode Card

| Status | ID | File | Duration | Notes |
|--------|----|------|----------|-------|
| [ ] | 04 | `shot-04-episode-card.svg` | 2.0s | EPISODE 1 / THE SOCK MONSTER |

### Scene 5 — Bandito on Patrol

| Status | ID | File | Duration | Dialogue |
|--------|----|------|----------|----------|
| [x] | 05a | `shot-05a-bandito-patrol.png` | 2.5s | Another peaceful day in Meow City. / Bandito is on patrol. |
| [x] | 05b | `shot-05b-bandito-stops.png` | 2.0s | Bandito is shocked at what he finds on patrol. |

### Scene 6 — Sock Discovery

| Status | ID | File | Duration | Dialogue |
|--------|----|------|----------|----------|
| [x] | 05c | `shot-05c-bandito-finds-sock.png` | 2.5s | Is it a regular sock or could it possibly be... |
| [x] | 06a | `shot-06a-sock-reveal.png` | 3.0s | Sir Sockington... the sock monster. |
| [ ] | 06b | `shot-06b-bandito-shocked.svg` | 1.5s | This is no ordinary object... |
| [ ] | 06c | `shot-06c-bandito-assemble.svg` | 1.5s | Bandito Team, assemble! |

### Scene 7 — Team Arrival

| Status | ID | File | Duration | Dialogue |
|--------|----|------|----------|----------|
| [ ] | 07a | `shot-07a-team-arrives.svg` | 2.0s | — |
| [ ] | 07b | `shot-07b-professor-scans.svg` | 2.0s | My instruments have never detected anything like this. |
| [ ] | 07c | `shot-07c-attack-stances.svg` | 1.5s | — |

### Scene 8 — The Battle

| Status | ID | File | Duration | Dialogue / FX |
|--------|----|------|----------|---------------|
| [ ] | 08a | `shot-08a-bandito-charge.svg` | 1.0s | Speed lines |
| [ ] | 08b | `shot-08b-girl-frederick-leap.svg` | 1.0s | — |
| [ ] | 08c | `shot-08c-professor-device.svg` | 1.0s | Flash in |
| [ ] | 08d | `shot-08d-sock-waiting.svg` | 1.0s | Slow zoom |
| [ ] | 08e | `shot-08e-team-shock.svg` | 1.5s | It's waiting for us to make the first mistake. |

### Scene 9 — Tortellini Running Gag

| Status | ID | File | Duration | Dialogue |
|--------|----|------|----------|----------|
| [ ] | 09a | `shot-09a-tortellini-wall.svg` | 1.0s | — |
| [ ] | 09b | `shot-09b-tortellini-paw.svg` | 1.0s | — |
| [ ] | 09c | `shot-09c-bandito-admires.svg` | 1.5s | Excellent thinking, Tortellini. |

### Scene 10 — Final Attack

| Status | ID | File | Duration | Dialogue / FX |
|--------|----|------|----------|---------------|
| [ ] | 10a | `shot-10a-team-worried.svg` | 1.5s | We may be facing the greatest threat Meow City has ever known. |
| [ ] | 10b | `shot-10b-tortellini-walks.svg` | 1.5s | — |
| [ ] | 10c | `shot-10c-tortellini-squish.svg` | 1.0s | SQUISH + screen shake |
| [ ] | 10d | `shot-10d-monster-defeated.svg` | 1.5s | The monster has been defeated! |
| [ ] | 10e | `shot-10e-team-celebrates.svg` | 1.5s | — |

### Scene 11 — Human Reality

| Status | ID | File | Duration | Dialogue |
|--------|----|------|----------|----------|
| [ ] | 11a | `shot-11a-human-room.svg` | 1.5s | — |
| [ ] | 11b | `shot-11b-human-legs.svg` | 2.0s | Audrey, did you leave your sock in the living room again? |
| [ ] | 11c | `shot-11c-human-picks-sock.svg` | 1.5s | — |

### Scene 12 — Heroic Ending

| Status | ID | File | Duration | Dialogue / Notes |
|--------|----|------|----------|-------------------|
| [ ] | 12a | `shot-12a-heroic-return.svg` | 2.0s | Meow City is safe once again. |
| [ ] | 12b | `shot-12b-freeze-frame.svg` | 2.0s | Freeze at end |
| [ ] | 12c | `shot-12c-closing-card.svg` | 2.0s | BANDITO AND FRIENDS / MEOW CITY IS SAFE |

---

## Music Cues (placeholder — not yet wired to audio)

| Cue | Shots |
|-----|-------|
| `intro-theme` | Meet the Team, episode card |
| `adventure-calm` | 05a–05c |
| `tension-rise` | 06a–06c |
| `battle-prep` | 07a–07c |
| `battle-montage` | 08a–09c |
| `battle-peak` | 10a–10c |
| `victory` | 10d–10e, 12a–12c |
| `reality-shift` | 11a–11c |

Existing intro music plays during the main title only. Story music is labeled for future implementation.

---

## Timing Notes for Future Polish

These shots may need duration tweaks after final art and voice recordings:

- **03d** — Tortellini beat may need +0.5s for comedy landing
- **08 montage** — Battle rhythm may tighten or expand once SFX exist
- **10c SQUISH** — Shake duration tied to landing; adjust with animation
- **11b human dialogue** — May need +0.5s once VO is recorded
- **12b freeze** — Hold may extend for end-card branding
- **Opening crawl** — Currently ~14s; trimming to 6–8s would bring total closer to 60s

---

## Creative Rules (must preserve)

- Cats sincerely believe the sock is dangerous — not a joke, not pretend
- Tortellini accidentally defeats the sock by flopping on it
- Humans see only an ordinary sock on the floor
- Bandito sincerely praises Tortellini’s “tactics”
