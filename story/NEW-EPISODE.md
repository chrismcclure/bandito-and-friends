# New Episode Checklist

Use this when creating Episode 2, 3, 4, etc. The engine, export pipeline, series opening, title menu, and Meet the Team structure are already built — you mainly add story, shots, art, and any new music.

---

## 1. Story

- [ ] Copy `story/episode-template.md` → `story/episode-XX-short-title.md`
- [ ] Write the screenplay (overview, scenes, dialogue, music notes)
- [ ] Add a production doc: `story/episode-XX-production.md` (optional but recommended)

---

## 2. Shot data

- [ ] Copy `src/data/episode-template-shots.js` → `src/data/episode-XX-shots.js`
- [ ] Fill in shot list: Meet the Team (03a–03d), episode card, story beats, credits
- [ ] Set asset paths to `public/images/episodes/episode-XX/finals/`
- [ ] Tune `shotDefaults` indices (assemble shot, landscape fit, etc.) if needed

---

## 3. Register the episode

- [ ] Create `src/data/episodes/episode-XX.js` (copy from `episode-01.js`)
- [ ] Add entry to `src/data/episodes/registry.js`
- [ ] Set `ACTIVE_EPISODE` in `src/data/activeEpisode.js` when ready to preview/export

---

## 4. Art

- [ ] Create folders:
  - `public/images/episodes/episode-XX/placeholders/`
  - `public/images/episodes/episode-XX/finals/`
- [ ] Run `npm run generate:placeholders` after adding placeholder entries to the generator script (or copy Episode 1 placeholders as stubs)
- [ ] Drop final stills into `finals/` — update `assetPath` and `status: 'final'` in shot data

---

## 5. Music and SFX

**Reuse when possible** (no new files needed):

| Cue ID | Use for |
|--------|---------|
| `intro-theme` | Meet the Team character intros |
| `adventure-calm` | Calm patrol / setup scenes |
| `team-theme-credits` | Credits, tools, thanks slides |
| `series-opening-music` | Series opening only (already wired) |

**Add only when needed:**

- [ ] New file track → drop WAV in `public/audio/music/`, register in `src/audio/musicLibrary.js` under `EPISODE_FILE_CUES`
- [ ] New procedural score → add `*MusicScore.js` in `src/audio/`, register in `SERIES_PROCEDURAL_CUES` or episode file cues
- [ ] New SFX → drop in `public/audio/sfx/`, register in `src/audio/episodeShotSfx.js`

Reference cue IDs from shot data: `musicCue: 'adventure-calm'`

---

## 6. Preview and export

- [ ] `npm run dev` — full show at `/`
- [ ] `/?scene=episode` — episode-only with dev controls
- [ ] `/?scene=episode&shot=N` — jump to a specific shot
- [ ] Update `story/order-of-operations.md` with preview links (optional)
- [ ] `npm run export:episode1` (or add `export:episodeX` script) for MP4

---

## 7. What you do **not** need to rebuild

- PixiJS episode player (`EpisodePlayer.js`)
- Camera, subtitles, transitions
- NES title menu and series opening
- Full-show timeline and dev controls
- MP4 export pipeline (Playwright + FFmpeg)
- Meet the Team intro scene structure (reuse timing; swap art and labels)

---

## Quick reference

| What | Where |
|------|-------|
| Active episode switch | `src/data/activeEpisode.js` |
| Episode registry | `src/data/episodes/registry.js` |
| Music cue registry | `src/audio/musicLibrary.js` |
| Shot types and helpers | `src/episode/episodeShotHelpers.js` |
| Story source of truth | `story/` |
| Episode 1 reference | `src/data/episode-01-shots.js` |
