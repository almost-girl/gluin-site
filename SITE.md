# Gluin Site — Quick Context

*For Ani (and any other agent) — so you don't have to grep around every time.*

## What This Is

**Gluin** — Irish traditional music band in the San Francisco Bay Area. Peter is a band member. This is the band's public-facing website.

## Where It Lives

- **Repo:** `gluin-site/` in the workspace
- **Deployed on:** Cloudflare Pages
- **Wrangler project name:** `gluin-site`
- **Live at:** `gluinmusic.com` (custom domain) + `gluin-site.pages.dev` (both serve the same deployment)

## Tech Stack

- **Frontend:** Single plain HTML file (`index.html`) with embedded CSS + vanilla JS. No framework.
- **Backend:** Cloudflare Functions (`functions/api/[[route]].ts`) — single catch-all route handler
- **Database:** Cloudflare D1 (`gluin-db`, binding `DB`)
- **Admin:** Static admin panel at `admin/index.html`
- **Contact form submissions:** Go to `stcredzero@fastmail.com` (set in wrangler vars)

## Band Members & Roles

| Member | Role | Photo |
|--------|------|-------|
| Shea Gaier | Fiddle & Vocals | `photos/shea.jpg` |
| Ben Wise | Guitar & Vocals | `photos/ben.jpg` |
| Drew Bagdasarian | Bouzouki & Backup Vocals | `photos/drew.jpg` |
| Peter Kwangjun Suk | Bodhrán & Tin Whistle | `photos/peter.jpg` |

**To update a member's role:** Edit the `<p class="role">` line under their `<div class="member-card">` in `index.html`.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | The whole site — HTML, CSS, JS all in one |
| `admin/index.html` | Admin dashboard (gig management, gallery, music links, contact messages) |
| `functions/api/[[route]].ts` | Backend API — handles gigs, gallery, music, contact CRUD |
| `IMAGE-MANIFEST.md` | Catalog of all photos (hero, members, gallery, gig flyers) |
| `wrangler.toml` | Cloudflare deployment config |
| `schema.sql` | D1 database schema |
| `SITE.md` | This file — context for future sessions |

## Photos

- `photos/hero.jpg` — Hero background image
- `photos/about.jpg` — About section band photo
- `photos/shea.jpg`, `ben.jpg`, `drew.jpg`, `peter.jpg` — Member circle portraits (140×140px rendered)
- `photos/gallery-1.jpg` through `gallery-5.jpg` — Gallery images
- `photos/gig-1.png`, `gig-2.png` — Gig flyer images
- `photos/IMG_*.JPG` — Raw source photos from the shoot

Member photos use `object-position` CSS to frame faces correctly. See `IMAGE-MANIFEST.md` for the exact positions for each photo.

## Dynamic Content (loaded via API at page load)

- **Gigs** — from D1 `gigs` table
- **Gallery** — from D1 `gallery` table
- **Music links** — from D1 `music_links` table

These are managed through the admin panel at `/admin/`.

## How to Deploy

```bash
cd gluin-site
npx wrangler pages deploy .
```

This pushes the whole directory to Cloudflare Pages. The `wrangler.toml` has `pages_build_output_dir = "."` so it deploys as-is.

## Contact

- Band email: `gluinmusic@gmail.com`
- Instagram: `@gluinmusic`
- Contact form submissions: `stcredzero@fastmail.com`
