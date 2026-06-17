# Gluin Website — Image Manifest

This document lists every image used on the Gluin website, where it appears, what it shows, and what to consider when picking an alternative. Share this with bandmates so anyone can suggest swaps without needing to look at code or open the site.

---

## Hero Section (top of page — first thing visitors see)

### `photos/hero.jpg`
- **Where it appears:** Full-screen background behind "Gluin" title and tagline
- **What it shows:** The full four-piece band standing in crop rows on a farm, with hills and blue sky in the background. Wide shot — you can see everyone but faces are small.
- **How it's used:** Fills the entire screen; text is overlaid on top (with a dark translucent gradient so words stay readable)
- **Dimensions on screen:** Full viewport width and height (any screen size)
- **What makes a good replacement:** A striking wide shot of the band, ideally landscape orientation. Faces don't need to be large since text overlays the image. Avoid too-busy backgrounds that would make white text hard to read. The current farm field works well — rustic, open sky, clean composition.
- **Current vibe:** Sunny, rustic, Americana/folk

---

## About Section

### `photos/about.jpg`
- **Where it appears:** In the "Bringing the Session Home" section, inline with the band description text
- **What it shows:** The full band seated on hay bales under a tree — posed with instruments
- **How it's used:** Displayed at up to 600px wide, centered in the text column
- **What makes a good replacement:** A clear, well-lit group shot where everyone is visible and the vibe is warm and approachable. Hay-bale setting is very on-brand. A similar seated/posed group photo would work well.
- **Current vibe:** Warm, friendly, casual acoustic session feel

---

## Band Member Photos (Meet the Band section)

Each member photo is displayed as a 140×140 pixel circle (cropped round). The face needs to be centered and clear at this small size.

### `photos/shea.jpg`
- **Who:** Shea Gaier — Fiddle & Vocals
- **What it shows:** Shea in a red dress, standing in a strawberry field, holding fiddle. Bright sunlight, close portrait framing.
- **Notes for alternatives:** Needs to work at 140×140 as a circle crop. Face should be centered. Current image works well — strong color contrast, clear focus.

### `photos/ben.jpg`
- **Who:** Ben Wise — Guitar & Vocals
- **What it shows:** Ben in sunglasses, standing among crop rows, holding acoustic guitar. Mid-distance portrait.
- **Notes for alternatives:** Sunglasses hide eyes, which can feel less personal at small size. A closer portrait without sunglasses might be preferred. Still needs to work as a small circle crop.

### `photos/drew.jpg`
- **Who:** Drew Bagdasarian — Bouzouki and Backup Vocals
- **What it shows:** Drew by hay bales, playing bouzouki. Focused expression, good instrument detail, rural backdrop.
- **Notes for alternatives:** Strong photo. Bouzouki is clearly visible even at small size. Works well.

### `photos/peter.jpg`
- **Who:** Peter Kwangjun Suk — Bodhrán & Tin Whistle
- **What it shows:** Peter standing in strawberry field, holding bodhrán. Calm, earthy portrait in natural light.
- **Notes for alternatives:** Bodhrán is clearly visible. Works well as a small circle crop. If Peter wants to also represent whistle, a photo with both instruments (or just whistle) could be considered.

---

## Gig Flyers (Gigs section)

### `photos/gig-1.png`
- **Where it appears:** Displayed at up to 300px wide in the Gigs section
- **What it actually shows:** A casual pub/restaurant music session — people seated around tables playing instruments. Edison bulbs, leafy garland decor, TVs in background. Looks like a pub session, not a flyer.
- **⚠️ Note:** This file is named "gig-1" but is actually a session photo, not a flyer. If the intent is to show gig flyers/poster art, this should be replaced with an actual promotional flyer image.

### `photos/gig-2.png`
- **Where it appears:** Displayed at up to 300px wide in the Gigs section
- **What it actually shows:** Live performance on stage at the United Irish Cultural Center of San Francisco — banner visible. Multiple musicians playing (guitar, fiddle, flute/whistle, accordion).
- **⚠️ Note:** Also a gig photo rather than a flyer. Works fine as a gig section image, but rename or replace if flyers are the goal.

---

## Gallery (Photos section)

All gallery images display in a responsive grid with 4:3 aspect ratio, roughly 240-400px wide depending on screen size. They fill their containers with `object-fit: cover` (edges may be cropped).

### `photos/gallery-1.jpg`
- **What it shows:** Shea (red dress, fiddle) and two bandmates (guitar, bouzouki) playing in crop rows — trio shot, sunny
- **Vibe:** Performance moment in the field

### `photos/gallery-2.jpg`
- **What it shows:** Ben seated playing guitar, Shea standing behind playing fiddle — duo shot in the field
- **Vibe:** Relaxed, pastoral duet

### `photos/gallery-3.jpg`
- **What it shows:** Close vertical shot of Ben in sunglasses playing guitar among the crops
- **Vibe:** Intimate solo performance moment

### `photos/gallery-4.jpg`
- **What it shows:** Full band posed with instruments around a vintage tractor under shade sails
- **Vibe:** Warm, casual group shot — rural Americana

### `photos/gallery-5.jpg`
- **What it shows:** Four band members facing away from camera, looking out over farm rows toward hills — backs to the lens
- **Vibe:** Expansive, contemplative, cinematic

---

## Summary: Image Roles at a Glance

| File | Section | Role | Subject |
|------|---------|------|---------|
| hero.jpg | Hero | Full-screen background | Full band in field |
| about.jpg | About | Inline photo | Full band on hay bales |
| shea.jpg | Members | Circle portrait | Shea |
| ben.jpg | Members | Circle portrait | Ben |
| drew.jpg | Members | Circle portrait | Drew |
| peter.jpg | Members | Circle portrait | Peter |
| gig-1.png | Gigs | Flyer/session photo | Pub session (not a flyer) |
| gig-2.png | Gigs | Flyer/session photo | UICC stage performance (not a flyer) |
| gallery-1.jpg | Gallery | Grid photo | Trio in field |
| gallery-2.jpg | Gallery | Grid photo | Duo in field |
| gallery-3.jpg | Gallery | Grid photo | Ben solo in field |
| gallery-4.jpg | Gallery | Grid photo | Band with tractor |
| gallery-5.jpg | Gallery | Grid photo | Band backs-to-camera, looking out |

---

## Source Files

These are the raw original photos in the `photos/` folder. They are not used directly by the website but are kept here as source material:

- `IMG_2236.JPG` (998 KB)
- `IMG_2239.JPG` (1.4 MB)
- `IMG_2243.JPG` (1.6 MB)
- `IMG_2247.JPG` (1.3 MB)
- `IMG_2250.JPG` (1.1 MB)
- `IMG_2259.JPG` (1.4 MB)

The web images (hero.jpg, about.jpg, member photos, gallery images) were cropped or resized from these originals.

---

## How to Suggest a Change

For any image you want to replace:
1. Note which file you want to swap (from the table above)
2. Describe what kind of photo should replace it (pose, setting, who's in it)
3. If you have a specific photo in mind, mention which source file it is — Peter or Ani can crop it to fit

---
*Last updated: 2026-06-14*
