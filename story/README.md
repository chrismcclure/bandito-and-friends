# Story Folder

This folder is the **source of truth** for Bandito and Friends. Every episode lives here as a screenplay before it becomes animation, sound, or code.

## Principles

- **Story files are authoritative.** Animation, artwork, timing, sound, and implementation may evolve over time, but the story should remain stable once an episode is approved.
- **Reference, don't rewrite.** Future Cursor prompts should reference these story documents rather than redefining scenes from scratch.
- **Small production scenes.** Episodes are divided into short scenes that can be implemented independently.
- **Fast iteration.** Each scene should be short enough to iterate on quickly during development.

## How to Use These Documents

When implementing animation, audio, or code for an episode:

1. Read the episode screenplay first.
2. Identify which **production scene** you are building.
3. Implement only that scene's story beat, dialogue, and notes.
4. Do not change approved story content unless the user explicitly requests a story revision.

## File Naming

```
story/
  README.md
  episode-01-the-sock-monster.md
  episode-02-...md          (future episodes)
```

Each episode file contains an overview, character list, scene structure, detailed scene breakdowns, and production notes for the series.
