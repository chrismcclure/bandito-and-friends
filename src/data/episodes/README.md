# Episodes

Each episode is a config object registered here. The engine reads `ACTIVE_EPISODE` from `src/data/activeEpisode.js`.

| File | Purpose |
|------|---------|
| `episode-01.js` | Episode 1 config (shots, timing, asset paths) |
| `registry.js` | All episodes — add new entries here |
| `episode-template.js` | (future) copy from episode-01.js when adding Episode 2 |

Shot data lives in `src/data/episode-XX-shots.js`. See `story/NEW-EPISODE.md`.
