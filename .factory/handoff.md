# Handoff — The Last Light

## What shipped

- A complete, finite three-act incremental story: restore the lamp (**Kindle**),
  allocate its beam and signal the cutters (**Bearing**), then maintain tower
  integrity through a fifteen-minute storm (**Weather**).
- A real ending screen with time-to-finish, hands-on actions, tower condition,
  ending title, copyable result, and replay. There is no prestige or post-ending
  treadmill.
- Deterministic and fair mechanics. Storm damage bottoms out without erasing
  progress; repairs always remain possible. Closing or hiding the tab earns no
  resources.
- Local autosave and compact versioned save-in-URL links. Invalid links explain
  the problem and offer a fresh start. No account or backend is involved.
- Full keyboard path (`1`, `2`–`4`, `S`, `?`), native accessible dialogs,
  visible focus states, named controls and progress, 44px targets, responsive
  390px layout, reduced-motion support, and an optional Still waters control.
- Offline-aware shell with a service worker, an in-product connection state,
  no runtime CDNs, and Azure Static Web Apps security/cache headers.
- Plain-language `/privacy/` and `/terms/` pages, robots/sitemap, README, MIT
  license, source brief, and product-specific design thesis.
- One original generated lighthouse illustration, visually reviewed and shipped
  in responsive AVIF (95/224 KB), WebP (137/290 KB), and JPEG (144 KB). Original
  PNG and exact prompt/deployment sidecars are retained under `assets/src/`.

## Balance

An automated attentive-run model performs the manual action once per second,
buys upgrades as soon as they become affordable, and favors the seaward beam.
It completes in **34:55** with **78%** tower integrity:

- Act I: 10:56
- Act II: 8:59
- Act III: 15:00

Less active play lands later in the advertised 35–50 minute window. The balance
test is committed in `src/game.test.ts` and prevents accidental endless or
too-short tuning.

## Verification performed

All commands were run on 2026-08-27 from `/work/repo`:

```bash
npm install
npm audit --omit=dev --audit-level=high  # 0 vulnerabilities
npm test                                 # 6/6 passed
npm run test:e2e                         # 6/6 desktop + 390px mobile passed
npm run build                            # dist/index.html produced
```

The factory `verify-url.sh` checked a production `vite preview`: HTTP 200,
562ms load, no console/page errors, one H1, English language, main landmark,
all images with alt text, and all buttons named.

Playwright runs Chromium at desktop and 390×844, exercises opening and keyboard
play, local saves, all three chapter interfaces, ending, invalid-save recovery,
and both legal pages. Axe WCAG 2 A/AA found **0 serious or critical issues** on
the cover and active game.

Production Lighthouse mobile results:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.0 s |
| Largest Contentful Paint | 1.1 s |
| Total Blocking Time | 10 ms |
| Cumulative Layout Shift | 0.004 |

Production asset budgets: **22.20 KB JS** (8.36 KB gzip), **17.32 KB CSS**
(4.72 KB gzip), 95 KB mobile AVIF, no webfonts.

## Build and deployment

- Install: `npm install` (or `npm ci`)
- Develop: `npm run dev`
- Unit tests: `npm test`
- Browser/a11y tests: `npx playwright install chromium && npm run test:e2e`
- Required build command: `npm run build`
- Required deploy directory: `./dist` (`dist/index.html` is present)

## Known gaps / next steps

- Timing is protected by deterministic simulation and chapter UI smoke tests,
  but the full 35-minute arc has not yet had an external human playtest. Test
  with 5–10 incremental-game players before changing economy constants.
- Success metrics are intentionally not transmitted. A future opt-in, local-only
  playtest export could aggregate completion timing without adding analytics.
- The brief mentions a one-time season purchase **for later episodes**. This v1
  contains only the promised free episode, so there is nothing honest to sell
  and no billing UI was added. When a real season exists, integrate only through
  the Sociobot billing contract and keep product identifiers configurable.
