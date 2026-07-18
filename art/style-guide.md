# Bandito and Friends — Visual Style Guide

This document is the **permanent visual source of truth** for every piece of artwork in the project. All illustrations, sprites, backgrounds, and generated images should follow these rules.

---

# Vision

Bandito and Friends is a heartfelt comedy where ordinary household life is viewed through the imagination of heroic cats.

To the audience, a sock is a sock. To the cats, it is an ancient monster. To the cats, the living room is Meow City — a vast metropolis they have sworn to protect. The series plays this contrast completely straight. The cats are sincere. The adventure is real to them.

The world should feel **adventurous, optimistic, playful, and cinematic**. Every scene should look like it belongs in a Saturday morning cartoon or a classic NES-era adventure — even when nothing dramatic is happening.

Comedy comes from **dramatic presentation**, not exaggerated facial expressions. Characters do not mug for the camera or pull silly faces. They react with grave seriousness to absurd situations. The humor lives in the gap between how the cats see the world and what the audience sees.

---

# Art Style

Bandito and Friends uses a distinctive illustrated look that blends retro animation influences with family-friendly adventure storytelling.

## Core Style

- **Retro Saturday morning cartoon** — bold shapes, clear staging, readable compositions
- **1990s anime inspiration** — dynamic poses, dramatic framing, sincere emotional beats
- **Nintendo-inspired charm** — simple, colorful, approachable, slightly chunky proportions
- **Family friendly** — warm, safe, and inviting for all ages
- **Bright, colorful environments** — saturated but not harsh; rooms feel lived-in and cheerful
- **Soft lighting** — gentle highlights and shadows; no harsh realism
- **Clean silhouettes** — every character and prop reads clearly at a glance
- **Bold readable shapes** — forms are simplified; detail serves clarity, not realism
- **Expressive but simple faces** — emotion through pose and context, not extreme distortion
- **Slightly exaggerated perspective** for dramatic shots — low angles, forced perspective, heroic scale

## Avoid

- Photorealism
- Overly detailed rendering
- Horror styling
- Gritty textures
- Dark, muddy color palettes
- Hyper-detailed fur or fabric simulation
- Modern digital illustration or painted rendering (see **Pixel Art Style**)

---

# Pixel Art Style

**Bandito and Friends is a pixel-art project.**

All official artwork must use **handcrafted retro pixel art** — not modern digital illustration, painted art, or vector rendering. Characters, props, backgrounds, and reference sheets should look like they belong in a classic 16-bit adventure game.

## Inspirations

- SNES
- Game Boy Advance
- Sega Genesis
- Chrono Trigger
- Final Fantasy VI
- Mega Man X
- Pokémon (GBA era)

## Rendering Medium

The goal is **NOT**:

- Photorealism
- Painted digital illustration
- Vector artwork
- Modern Disney rendering

The goal **IS**:

- Retro pixel art designed for animation and sprites

## Required Qualities

All artwork should include:

- **Visible pixels** — individual pixels readable at intended display size
- **Limited color palettes** — restrained, deliberate color choices per asset
- **Strong readable silhouettes** — characters identifiable from outline alone
- **Simple but expressive faces** — emotion through minimal pixel detail
- **Consistent sprite proportions** — fixed head-to-body ratios across all art
- **Clean outlines** — crisp edge definition without blurry gradients
- **Minimal anti-aliasing** — avoid soft blended edges that hide pixel structure
- **Animation-friendly shapes** — forms that read clearly in motion and loop cleanly

## Design Intent

Characters should be designed as if they will **eventually become animated game sprites**. Reference sheets, concept art, and production assets all serve the same pixel-art pipeline.

When generating or commissioning artwork, explicitly request **pixel art**, **sprite art**, or **16-bit retro game art**. Reject outputs that look like modern digital paintings even if the subject matter is correct.

---

# Character Design Philosophy

Characters must always be **immediately recognizable**. A viewer should identify Bandito, Professor SpaghettiO, Girl Frederick, and Tortellini from silhouette alone.

## Every Character Must Have

- A **strong silhouette** — unique outline shape distinct from every other character
- **One or two defining accessories or features** — the visual hook that makes them memorable (a collar, goggles, a scar, a color patch, etc.)
- **Consistent proportions** — head-to-body ratio, limb length, and overall scale stay fixed
- **Consistent colors** — fur color, eye color, accessory color do not drift between images
- **Consistent facial markings** — stripes, patches, and eye shapes remain identical

## What Can Change

- Pose
- Expression (within the simple, sincere range)
- Clothing (only if intentionally added for a specific story beat)
- Lighting
- Camera angle

## What Must Not Change

- Core body proportions
- Fur color and pattern
- Defining accessories
- Facial structure and markings
- Character personality as expressed through design

**Never redesign a character between episodes.**

---

# Animation Feel

Although this document governs artwork, the visual style implies a specific motion language. Static illustrations and animated sequences should share the same energy.

## Intended Feeling

- **Hero poses** — chest out, chin up, paws on hips; characters know they are the protagonists
- **Dramatic camera angles** — low angles for threats, high angles for vulnerability, wide shots for team formations
- **Anime reaction shots** — close-ups on serious faces during absurd moments; held beats, not slapstick
- **Freeze frames** — episode endings and victory moments pause on a composed group shot
- **Dynamic action** — pounces, gadget deploys, and battle strikes have weight and direction
- **Cartoon timing** — snappy entrances, deliberate holds, clean cuts between beats
- **Playful energy** — the world is fun even when the cats are treating it like life or death

Artwork should look like a still frame pulled from an animated sequence — posed, intentional, and ready to move.

---

# Environment Style

Environments are **oversized from the cats' perspective**. Ordinary household locations become epic adventure settings. The cats believe in the scale; the art supports their imagination without winking at the audience.

## Meow City — Household as Metropolis

| Real Location | Cat Interpretation |
|---------------|-------------------|
| Mailbox | Watchtower |
| Fence | City Wall |
| Garage | Fortress |
| Living Room | Downtown |
| Kitchen | Industrial District |
| Backyard | Wilderness |

## Environment Rules

- Furniture and architecture feel **large and monumental** when cats are in frame
- Spaces are **colorful and readable** — clear foreground, midground, background separation
- Props are **simple and iconic** — a sock, a yarn ball, a cardboard box each read instantly
- Lighting supports mood: warm and calm for peace, cool and contrasty for danger
- Everything should feel **believable to the cats**, even when the audience sees a normal room

Backgrounds should not compete with characters. Environments frame the story; characters carry it.

---

# Image Generation Rules

All future image prompts — whether for AI generation, commission briefs, or internal reference — must follow these rules.

## Always

- Use **pixel art** as defined in **Pixel Art Style**
- Preserve existing character appearance
- Preserve art style as defined in this document
- Preserve proportions
- Preserve colors
- Preserve personality as expressed through design and pose
- Treat previous **approved reference images** in `art/references/` as canon
- Match the **four-cats group portrait** at `public/images/characters/bandito-and-friends-group.png` when depicting the squad together

## Never

- Redesign characters unless explicitly instructed by the project owner
- Shift art style toward realism, horror, painted illustration, vector art, or modern Disney-style rendering
- Produce modern digital illustration when pixel art is required
- Introduce new accessories, markings, or color changes without approval
- Generate characters in isolation without checking reference images first

## Prompt Workflow

1. Read this style guide
2. Read the relevant character definition in `art/characters/`
3. Check approved references in `art/references/`
4. Use or adapt prompt templates in `art/prompts/`
5. Generate
6. Compare output against references before approving

---

# Guiding Principle

**Consistency is more important than creating a "better" image.**

A new illustration that looks slightly prettier but changes Bandito's fur color, simplifies Professor SpaghettiO's goggles, or shifts the art style toward realism is not an improvement — it is a mistake. Viewers build trust with characters through repetition. They should immediately recognize every cat in every episode, every scene, and every frame.

When in doubt, match the reference. Protect the silhouette. Honor the design.

The goal is simple: **viewers should instantly know who they are looking at, every time.**
