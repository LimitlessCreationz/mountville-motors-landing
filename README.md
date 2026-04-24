# Mountville Motors — Apply Landing Pages (Build 6a)

**Live:** https://mountville-motors-landing.vercel.app
**Eventual domain:** apply.mountvillemotors.com
**Purpose:** Paid-traffic conversion funnel for Mountville Motor Sales
**Stack:** Static HTML + React 18 (CDN) + Vercel serverless
**Lead capture:** Form submission → `/api/lead` → GHL contact upsert + tag → triggers Marty workflow

## Routes

- `/` — homepage
- `/credit-denied` — for "another dealer said no" segment
- `/car-died` — for urgent replacement segment
- `/something-nicer` — for upgrade segment
- `/family` — for family-need segment
- `/contact` — 5-step pre-qualify wizard form
- `/about` — brand story
- `/?canvas=1` — original Claude Designer canvas view (preview only, not for paid traffic)

## Source attribution

Each route maps to a GHL source tag:
- `marty-source-website-home` (default)
- `marty-source-website-credit`
- `marty-source-website-car-died`
- `marty-source-website-upgrade`
- `marty-source-website-family`

## Companion projects

- **Brand site:** [mountville-motors-brand-site](https://github.com/LimitlessCreationz/mountville-motors-brand-site)
- **GHL workflows:** managed in GHL location `fQiT6tA026tzxAjXFopP`

---

*Built with Claude Code via Vercel CLI deploys. Auto-deploys on push to `main`.*
