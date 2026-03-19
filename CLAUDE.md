# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment

This repo is **only the WordPress theme** (`/Users/fausto/webs/mycrof/`). WordPress itself lives at `/Users/fausto/webs/wordpress-mycrof/`, which symlinks its `wp-content/themes/mycrof/` here.

**Start the dev server:**
```bash
wp-serve   # alias → php -S localhost:8080 in wordpress-mycrof/
```
- Frontend: http://localhost:8080
- Admin: http://localhost:8080/wp-admin (admin / admin)

**wp-cli** (run from `/Users/fausto/webs/wordpress-mycrof/`):
```bash
wp-mycrof <command>          # alias with 512M memory limit
# examples:
wp-mycrof post list
wp-mycrof cache flush
wp-mycrof option update blogdescription "Uploading talent"
```

MySQL database: `wordpress_mycrof` on `127.0.0.1`, user `root`, no password.

## Theme Architecture

Standard WordPress classic theme. Entry points:

| File | Role |
|---|---|
| `style.css` | Theme header + base styles |
| `functions.php` | Theme setup, `wp_enqueue_scripts` |
| `index.php` | Main loop fallback |
| `header.php` / `footer.php` | Shared shell |
| `js/main.js` | Frontend JS (enqueued in footer) |
| `inc/` | PHP helpers (split from functions.php as it grows) |
| `template-parts/` | Reusable template fragments (`get_template_part()`) |

All functions are prefixed `mycrof_`. Text domain is `mycrof`.

## Brand & Design System

Full brand reference: `MYCROF_brand_identity.md`
Full design system: `stitch/DESIGN.md`
Brand assets (logos, fonts, photos): `identidad mycrof/`

**Core palette:**
```
Primary:    #627DE9   /* Azul vibrante — dominant accent */
Secondary:  #461CBC   /* Púrpura intenso */
Dark:       #282E2F   /* Casi negro — text/shadows, never pure #000 */
Background: #FFFFFF
Gradient:   linear-gradient(135deg, #627DE9, #461CBC)  /* CTAs, switches */
```

**Typography:** Poppins (Google Fonts) — Black for titles, Bold for subtitles, SemiBold for callouts, Regular for body. Secondary display font: Plus Jakarta Sans. Body/labels: Manrope.

**Design rules (from `stitch/DESIGN.md`):**
- No 1px solid borders — use tonal surface shifts or negative space instead.
- No pure `#000000` — always use `#282E2F` for dark values.
- Glassmorphism for floating elements: 70% opacity + `backdrop-blur: 20px`.
- Surface hierarchy: `#F5FAFB` (base) → `surface_container_low` (sections) → `#FFFFFF` (cards).
- Prefer asymmetrical layouts (60/40) over symmetrical grid templates.
- Gradient only on accent elements — never gradient-on-gradient.
