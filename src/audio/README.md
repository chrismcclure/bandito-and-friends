# Audio

Runtime music, SFX, and procedural score modules for Bandito and Friends.

## Layout

| File / folder | Role |
|---------------|------|
| `musicLibrary.js` | Series-wide and episode-specific cue registry |
| `*MusicScore.js` | Procedural chiptune scores — note data rendered to WAV for export or played live |
| `IntroMusic.js`, `SeriesOpeningMusic.js`, etc. | Scene-specific music players (Web Audio) |
| `episodeMusic.js` | Episode shot music system (file loops + procedural cues) |
| `episodeMusicCues.js` | Re-exports from musicLibrary for playback and export |
| `episodeMusicFileLoop.js` | File-based music loop playback |
| `episodeShotSfx.js` | Per-shot sound effects |
| `archive/` | Unused score iterations kept for reference |

## Reusing music across episodes

Series-wide cues (available in any episode shot list):

- `intro-theme` — Meet the Team
- `series-opening-music` — series opening
- `adventure-calm` — calm patrol / setup
- `team-theme-credits` — credits slides

Episode-specific file tracks are registered in `musicLibrary.js` under `EPISODE_FILE_CUES`. Add new entries when an episode needs unique music.

## Public assets

Baked WAV files live under `public/audio/`:

- `music/` — longer tracks (battle themes, victory stinger, living-room reveal)
- `music/archive/` — unused music iterations
- `sfx/` — one-shot cues (menu blips, title reveal, battle stings)

Regenerate procedural WAVs:

```bash
npm run generate:music
npm run generate:sfx
```
