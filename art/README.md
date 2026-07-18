# Art Folder

This folder is the **permanent visual source of truth** for Bandito and Friends.

## Purpose

Everything needed to keep the series visually consistent lives here — character definitions, style rules, world references, prompt templates, and official reference images.

## Principles

- **Character appearance stays consistent** across every episode. Once a character look is approved, future artwork should match it.
- **Reference these documents** when generating or commissioning images. Do not invent new appearances in one-off prompts.
- **Real animal photographs** in `references/<character>/real/` are the **biological source of truth** — they define markings, proportions, and identifying features.
- **Approved generated artwork** in `references/<character>/official/` becomes the **canonical animation reference** once approved.
- **Four-cats group portrait** in `public/images/characters/bandito-and-friends-group.png` is the **canonical squad reference**. See `references/group-artwork.md`.
- **Title screen artwork** in `public/images/title/` is the **intro composition reference** (background, text, signage). See `references/title-artwork.md`.
- **Canonical sprite sheets** in `art/canon/<character>/` are **approved production gameplay art**. See character folders and `references/<character>/sprite-sheet.md`.
- **Future image generation should preserve both** — stylization follows the official cartoon reference; accuracy follows the real photograph.
- **Official reference images** belong in `references/` — organized by character or location.
- **Prompt templates** belong in `prompts/` — reusable generation prompts per character.
- **Character definitions** belong in `characters/` — written descriptions of each character's visual design.

## Structure

```
art/
  README.md           This file
  style-guide.md      Global visual style rules
  meow-city.md        Setting and environment reference

  characters/         Character visual definitions

  prompts/            Reusable image-generation prompt templates
    bandito/
    professor-spaghettio/
    girl-frederick/
    tortellini/

  canon/              Approved production assets (sprite sheets, opening crawl, etc.)
    bandito/
    professor-spaghettio/
    opening-crawl.md

  references/         Official approved reference images
    group-artwork.md  Four-cats group portrait (canonical squad reference)
    title-artwork.md  Title screen versioning and approval status
    group/
      bandito-and-friends-group.png
    bandito/
      real/           Biological reference photographs
      official/       Approved cartoon / animation references
    professor-spaghettio/
    girl-frederick/
    tortellini/
    meow-city/
```

## Relationship to Other Folders

| Folder | Role |
|--------|------|
| `art/` | Visual source of truth — design, prompts, references |
| `story/` | Narrative source of truth — screenplays and scene intent |
| `public/images/` | Runtime assets served by the application |

When artwork is approved for production, exported files move into `public/images/` following the paths documented in `public/images/README.md`.
