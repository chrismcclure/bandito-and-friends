# Episode Template

Copy this file to `story/episode-XX-short-title.md` when starting a new episode. Replace bracketed placeholders.

---

# Episode [NUMBER]: [TITLE]

## Episode Overview

[One paragraph: what happens, why it's funny or heartfelt, and how it ends. The cats should take something ordinary seriously. Humans remain oblivious.]

---

## Main Characters

Use the series cast unless this episode introduces a guest. Link to `art/characters/` for reference.

| Character | Role in this episode |
|-----------|----------------------|
| Bandito | [e.g. leader on patrol] |
| Professor SpaghettiO | [e.g. scans the threat] |
| Girl Frederick | [e.g. first to attack] |
| Tortellini | [e.g. saves the day accidentally] |

---

## Episode Structure

| Scene | Title | Purpose |
|-------|-------|---------|
| 1 | [Opening beat] | [Establish normal / introduce threat] |
| 2 | [Escalation] | [Team reacts] |
| 3 | [Climax] | [Battle or confrontation] |
| 4 | [Human reveal] | [Optional — reality shift] |
| 5 | [Victory] | [Cats celebrate; freeze frame; credits] |

---

## Scene Details

Repeat this block for each production scene.

### Scene [N]: [TITLE]

**Purpose**

[What this scene must accomplish for the audience.]

**Story Beat**

[What we see and what the cats believe is happening.]

**Dialogue**

- **[Character]:** "[Line]"
- **[Character]:** "[Line]"

**Character Actions**

- [Physical beats, poses, reactions]

**Music Mood**

[Reuse a series cue when possible: `adventure-calm`, `intro-theme`, `team-theme-credits`. Name a new cue only if needed.]

**Sound Effects**

- [List SFX moments]

**Visual Notes**

- [Camera, framing, 9:16 considerations]

---

## Production Notes

- Target runtime: ~[60–90] seconds for episode body (excluding series opening)
- Shot IDs follow `03a`–`12e` pattern or a new scheme documented in `src/data/episode-XX-shots.js`
- Final art: `public/images/episodes/episode-XX/finals/`
- Shot data: `src/data/episode-XX-shots.js`
- Register the episode in `src/data/episodes/registry.js` and set `ACTIVE_EPISODE` in `src/data/activeEpisode.js`
