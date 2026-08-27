# Handoff — The Last Light

## Repair verification status — **PASS** (2026-08-27)

This repair starts from independently reported candidate
`eb638d5f85e724231b12d88fa68dd713097b844c` (report commit
`bd8f465a26c40a15ca73de3020690e92f6d1d7e0`). Both P1 defects are repaired and
covered by exact production-build browser regressions.

1. The service worker now precaches the built, hashed JS and CSS entrypoints
   discovered from the app document. It only serves the cached HTML shell to a
   navigation request; an uncached asset/module gets a plain-text `503`, never
   HTML. A browser regression reloads the installed app twice while offline,
   verifies the app is still interactive, checks a worker update has no waiting
   worker, and asserts an uncached module response is non-HTML.
2. Save decoding now checks reachable semantic state as well as JSON shape:
   exact field count/types, counters and resource bounds, act-specific
   resources/upgrades, start state, and ending consistency (including the
   reported `act: 4` / `finished: false` payload). Invalid hash saves return to
   the existing `Save not loaded` recovery screen before any storage write; a
   regression confirms a prior valid local save remains byte-for-byte intact.

The repair does not change rates, costs, timings, narrative, or balance.

---

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

All commands were run cleanly on 2026-08-27 from `/work/repo`:

```bash
npm install
npm audit --omit=dev --audit-level=high  # 0 vulnerabilities
npm test                                 # 7/7 passed
npm run test:e2e                         # 10/10 production-build desktop + 390px mobile passed
npm run build                            # dist/index.html produced
```

The production-build Playwright suite checks the title, one H1, keyboard start
and action, local save, no console/page errors in normal play, all story
chapters/ending, legal pages, invalid-save recovery, and both desktop and
390×844 mobile layouts. Its Axe WCAG 2 A/AA checks found **0 serious or
critical issues** on the cover and active game.

The same clean browser run registers the production service worker, confirms an
active controller can check for an update with no waiting worker, then uses
`context.setOffline(true)` for two consecutive reloads. It verifies an
uncached module is a plain-text `503`, eliminating the HTML-module MIME
regression.

A fresh Lighthouse mobile audit of the repaired `vite preview` build reported:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 0.9 s |
| Largest Contentful Paint | 0.9 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0.004 |

Production asset budgets: **23.31 KB JS** (8.73 KB gzip), **17.32 KB CSS**
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
