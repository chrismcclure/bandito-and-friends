# Bandito and Friends — Order of Operations

Click any link to preview that beat in the browser (requires `npm run dev`).

Use **`?shot=N`** links to jump directly to a shot (0-based index). The shot loops until you click Play in dev controls or restart the sequence.

---

## Full episode (recommended first watch)

[▶ Play full Episode 1](http://localhost:5173/)

---

## NES title menu

Config: `src/data/title-menu-timing.js` · Preview mode: `?scene=title-menu`

| Image | Asset | Status |
|-------|-------|--------|
| 1 — PRESS START selected | `public/images/title/title-menu-press-start-selected.png` | **Final** |
| 2 — Run Away selected | `public/images/title/title-menu-run-away-selected.png` | **Final** |

| Step | State | Duration | Audio |
|------|-------|----------|-------|
| 1 | PRESS START selected | 1.05s | — |
| 2 | Run Away selected | 0.525s | Cursor blip (on switch) |
| 3 | PRESS START selected | 0.75s | Cursor blip (on switch) |
| 4 | Start press freeze | 0.125s | — |
| 5 | Start confirmation → white flash | peak at ~0.1s | Start confirmation |
| 6 | Pixel-block hold | 0.5s | — |
| 7 | Pixel-block load reveal | ~0.8s | Intro music at ~70% reveal |

[▶ Preview title menu only](http://localhost:5173/?scene=title-menu)

---

## Series opening — ordinary house → Meow City

Config: `src/data/series-opening-shots.js` · Preview mode: `?scene=opening`

| # | Shot | Caption | Status | Preview |
|---|------|---------|--------|---------|
| 1 | Ordinary living room | An ordinary living room... | Final | [Open shot 0](http://localhost:5173/?scene=opening&shot=0) |
| 2 | Human / transform | ...to humans. | Final | [Open shot 1](http://localhost:5173/?scene=opening&shot=1) |
| 3 | Meow City room | But to four brave cats... | Final | [Open shot 2](http://localhost:5173/?scene=opening&shot=2) |
| 4 | Meow City establishing | This is Meow City. | Final | [Open shot 3](http://localhost:5173/?scene=opening&shot=3) |
| 5 | Rooftop watch | And every day... / ...they stand watch. | Final | [Open shot 4](http://localhost:5173/?scene=opening&shot=4) |

[▶ Play full series opening](http://localhost:5173/?scene=opening)

---

## Title + Meet the Team + Episode card

Title plays after shot 5 white flash — no separate shot link (part of full episode).

Config: `src/data/episode-01-shots.js` · Preview mode: `?scene=episode`

| # | Shot | Label | Status | Preview |
|---|------|-------|--------|---------|
| 6 | Bandito intro | THE LEADER | Final | [Open shot 0](http://localhost:5173/?scene=episode&shot=0) |
| 7 | Professor intro | THE BRAINS | Final | [Open shot 1](http://localhost:5173/?scene=episode&shot=1) |
| 8 | Girl Frederick intro | THE MUSCLE | Final | [Open shot 2](http://localhost:5173/?scene=episode&shot=2) |
| 9 | Tortellini intro | THE WILD CARD | Final | [Open shot 3](http://localhost:5173/?scene=episode&shot=3) |
| 10 | Episode card | EPISODE 1 — THE SOCK MONSTER | Placeholder | [Open shot 4](http://localhost:5173/?scene=episode&shot=4) |

[▶ Play from Meet the Team](http://localhost:5173/?scene=episode)

---

## Episode 1 story — The Sock Monster

| # | Shot ID | Scene | Status | Preview |
|---|---------|-------|--------|---------|
| 11 | 05a | Another peaceful day… / Bandito is on patrol. | Final | [Open shot 5](http://localhost:5173/?scene=episode&shot=5) |
| 12 | 05b | Bandito is shocked at what he finds on patrol. | Final | [Open shot 6](http://localhost:5173/?scene=episode&shot=6) |
| 13 | 05c | Is it a regular sock or could it possibly be... | Final | [Open shot 7](http://localhost:5173/?scene=episode&shot=7) |
| 14 | 06a | Sir Sockington... the sock monster. | Final | [Open shot 8](http://localhost:5173/?scene=episode&shot=8) |
| 15 | 06c | Bandito assemble | Final | [Open shot 9](http://localhost:5173/?scene=episode&shot=9) |
| 16 | 06d | Team hears the call | Final | [Open shot 10](http://localhost:5173/?scene=episode&shot=10) |
| 17 | 07a | Team arrives | Final | [Open shot 11](http://localhost:5173/?scene=episode&shot=11) |
| 18 | 07b | Professor scans | Final | [Open shot 12](http://localhost:5173/?scene=episode&shot=12) |
| 19 | 07c | Attack stances | Final | [Open shot 13](http://localhost:5173/?scene=episode&shot=13) |
| 20 | 08b | Girl Frederick leaps | Final | [Open shot 14](http://localhost:5173/?scene=episode&shot=14) |
| 21 | 08c | Sock monster knockback | Final | [Open shot 15](http://localhost:5173/?scene=episode&shot=15) |
| 22 | 08d | Professor device | Final | [Open shot 16](http://localhost:5173/?scene=episode&shot=16) |
| 23 | 08e | Sock monster deflect | Final | [Open shot 17](http://localhost:5173/?scene=episode&shot=17) |
| 24 | 08g | Bandito shock | Final | [Open shot 18](http://localhost:5173/?scene=episode&shot=18) |
| 25 | 09a | Tortellini has a plan | Final | [Open shot 19](http://localhost:5173/?scene=episode&shot=19) |
| 26 | 09b | Bandito — plan too dangerous | Final | [Open shot 20](http://localhost:5173/?scene=episode&shot=20) |
| 27 | 09c | Tortellini starts to fall | Final | [Open shot 21](http://localhost:5173/?scene=episode&shot=21) |
| 28 | 10a | Giant shadow over sock monster | Final | [Open shot 22](http://localhost:5173/?scene=episode&shot=22) |
| 29 | 10c | Squish | Final | [Open shot 23](http://localhost:5173/?scene=episode&shot=23) |
| 30 | 10e | Celebration | Final | [Open shot 24](http://localhost:5173/?scene=episode&shot=24) |
| 31 | 11a | Human view | Final | [Open shot 25](http://localhost:5173/?scene=episode&shot=25) |
| 32 | 11b | Human over-the-shoulder | Final | [Open shot 26](http://localhost:5173/?scene=episode&shot=26) |
| 33 | 11c | Human grabs the sock | Final | [Open shot 27](http://localhost:5173/?scene=episode&shot=27) |
| 34 | 12a | Heroic celebration | Final | [Open shot 28](http://localhost:5173/?scene=episode&shot=28) |
| 35 | 12b | Celebration freeze frame | Final | [Open shot 29](http://localhost:5173/?scene=episode&shot=29) |
| 36 | 12c | Credits | Final | [Open shot 30](http://localhost:5173/?scene=episode&shot=30) |
| 37 | 12d | Tools we used | Final | [Open shot 31](http://localhost:5173/?scene=episode&shot=31) |
| 38 | 12e | Thanks for watching | Final | [Open shot 32](http://localhost:5173/?scene=episode&shot=32) |

---

## Legacy / utilities

| Link | Purpose |
|------|---------|
| [Legacy scroll crawl](http://localhost:5173/?scene=crawl) | Original Zelda-style prototype |
| [Threat Board preview](http://localhost:5173/?scene=threat-board) | Professor Threat Board component |

---

## Drop-in checklist (final art)

When you approve an image, drop it in chat and we update:

- **Series opening:** `public/images/series-opening/finals/`
- **Episode shots:** `public/images/episodes/episode-01/finals/`

Then mark **Final** in this file and in `story/episode-01-production.md`.

---

## Sequence at a glance

```
0     NES title menu (cursor blips → Start → white flash)
1–5   Series opening (house → transform → Meow City → establishing → watch)
  ↓   White flash
6     Bandito and Friends title
7–10  Meet the Team + Episode card
11–38 Story (patrol → sock → battle → human reveal → victory)
```
