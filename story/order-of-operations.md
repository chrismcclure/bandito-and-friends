# Bandito and Friends — Order of Operations

Click any link to preview that beat in the browser (requires `npm run dev`).

Use **`?shot=N`** links to jump directly to a shot (0-based index). The shot loops until you click Play in dev controls or restart the sequence.

---

## Full episode (recommended first watch)

[▶ Play full Episode 1](http://localhost:5173/)

---

## Series opening — ordinary house → Meow City

Config: `src/data/series-opening-shots.js` · Preview mode: `?scene=opening`

| # | Shot | Caption | Status | Preview |
|---|------|---------|--------|---------|
| 1 | Ordinary living room | An ordinary living room... | Final | [Open shot 0](http://localhost:5173/?scene=opening&shot=0) |
| 2 | Human / transform | ...to humans. | Final | [Open shot 1](http://localhost:5173/?scene=opening&shot=1) |
| 3 | Meow City room | To four brave cats... | Final | [Open shot 2](http://localhost:5173/?scene=opening&shot=2) |
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
| 11 | 05a | Bandito on patrol | Placeholder | [Open shot 5](http://localhost:5173/?scene=episode&shot=5) |
| 12 | 05b | Bandito stops | Placeholder | [Open shot 6](http://localhost:5173/?scene=episode&shot=6) |
| 13 | 06a | Sock reveal | Placeholder | [Open shot 7](http://localhost:5173/?scene=episode&shot=7) |
| 14 | 06b | Bandito shocked | Placeholder | [Open shot 8](http://localhost:5173/?scene=episode&shot=8) |
| 15 | 06c | Bandito assemble | Placeholder | [Open shot 9](http://localhost:5173/?scene=episode&shot=9) |
| 16 | 07a | Team arrives | Placeholder | [Open shot 10](http://localhost:5173/?scene=episode&shot=10) |
| 17 | 07b | Professor scans | Placeholder | [Open shot 11](http://localhost:5173/?scene=episode&shot=11) |
| 18 | 07c | Attack stances | Placeholder | [Open shot 12](http://localhost:5173/?scene=episode&shot=12) |
| 19 | 08a | Bandito charges | Placeholder | [Open shot 13](http://localhost:5173/?scene=episode&shot=13) |
| 20 | 08b | Girl Frederick leaps | Placeholder | [Open shot 14](http://localhost:5173/?scene=episode&shot=14) |
| 21 | 08c | Professor device | Placeholder | [Open shot 15](http://localhost:5173/?scene=episode&shot=15) |
| 22 | 08d | Sock waiting | Placeholder | [Open shot 16](http://localhost:5173/?scene=episode&shot=16) |
| 23 | 08e | Team shock | Placeholder | [Open shot 17](http://localhost:5173/?scene=episode&shot=17) |
| 24 | 09a | Tortellini — wall | Placeholder | [Open shot 18](http://localhost:5173/?scene=episode&shot=18) |
| 25 | 09b | Tortellini — paw | Placeholder | [Open shot 19](http://localhost:5173/?scene=episode&shot=19) |
| 26 | 09c | Bandito admires | Placeholder | [Open shot 20](http://localhost:5173/?scene=episode&shot=20) |
| 27 | 10a | Greatest threat | Placeholder | [Open shot 21](http://localhost:5173/?scene=episode&shot=21) |
| 28 | 10b | Tortellini walks | Placeholder | [Open shot 22](http://localhost:5173/?scene=episode&shot=22) |
| 29 | 10c | Squish | Placeholder | [Open shot 23](http://localhost:5173/?scene=episode&shot=23) |
| 30 | 10d | Monster defeated | Placeholder | [Open shot 24](http://localhost:5173/?scene=episode&shot=24) |
| 31 | 10e | Celebration | Placeholder | [Open shot 25](http://localhost:5173/?scene=episode&shot=25) |
| 32 | 11a | Human view | Placeholder | [Open shot 26](http://localhost:5173/?scene=episode&shot=26) |
| 33 | 11b | Human legs | Placeholder | [Open shot 27](http://localhost:5173/?scene=episode&shot=27) |
| 34 | 11c | Sock picked up | Placeholder | [Open shot 28](http://localhost:5173/?scene=episode&shot=28) |
| 35 | 12a | Heroic return | Placeholder | [Open shot 29](http://localhost:5173/?scene=episode&shot=29) |
| 36 | 12b | Freeze frame | Placeholder | [Open shot 30](http://localhost:5173/?scene=episode&shot=30) |
| 37 | 12c | Closing card | Placeholder | [Open shot 31](http://localhost:5173/?scene=episode&shot=31) |

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
1–5   Series opening (house → transform → Meow City → establishing → watch)
  ↓   White flash
6     Bandito and Friends title
7–10  Meet the Team + Episode card
11–37 Story (patrol → sock → battle → human reveal → victory)
```
