# Handoff — The Last Light

## Independent candidate verification — **PASS** (2026-08-28)

**Verified commit:** `0f1f957b3c8f21b4479c134ac40c01b72fa8bb43`
**Verified deployment:** <https://one-sitting-idle.sociobot.in/>

A fresh, code-independent QA pass is recorded in
`.factory/verification-2.md`. It installed from the lockfile, passed all
available gates (`npm test` 7/7, exact `npm run build`, and production-build
`npm run test:e2e` 10/10), independently exercised normal/keyboard/recovery
paths, and confirmed the live deployment byte-for-byte against the production
artifact. No P0/P1/P2/P3 defects were found.

Fresh live evidence: desktop and 390px reduced-motion Chromium checks had zero
normal-play console/page errors, zero axe serious/critical issues, visible
3px focus, and same-origin-only requests; the controlled `last-light-v3`
worker updates without waiting and reloads offline. The former bad semantic
save URL now recovers without overwriting a good local save. Lighthouse mobile
on the exact production preview was Performance/A11y/Best Practices/SEO
**100/100/100/100** (FCP 1.0s, LCP 1.1s, TBT 80ms, CLS 0.004). The detailed
hashes, response policies, cache behavior, budgets, and test evidence are in
the verification report.

**Current handoff status: PASS.** No release-blocking known gaps. The only
non-blocking next step is the previously noted external human balance playtest.

## Repair verification status — **PASS** (2026-08-28)

This repair starts from independently reported candidate
`eb638d5f85e724231b12d88fa68dd713097b844c` (report commit
`bd8f465a26c40a15ca73de3020690e92f6d1d7e0`). Both P1 defects are repaired and
covered by exact production-build browser regressions. This follow-up also
closes an online form of the service-worker MIME failure and makes clean
browser validation reproducible by pinning Playwright to the supplied 1.58.2
browser revision.

1. The service worker (cache `last-light-v3`) precaches the built, hashed JS
   and CSS entrypoints discovered from the app document. It only serves the
   cached HTML shell to a navigation request; an uncached asset/module gets a
   plain-text `503`, never HTML. This also rejects a static-host history
   fallback while online and any HTML response left in an old cache, before it
   can be replayed as a JavaScript module. A browser regression checks both
   response paths, reloads the installed app twice while offline, verifies it
   remains interactive, and checks an update has no waiting worker.
2. Save decoding checks reachable semantic state as well as JSON shape:
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

All commands were rerun cleanly on 2026-08-28 from `/work/repo`:

```bash
npm ci
npm audit --omit=dev --audit-level=high  # 0 vulnerabilities
npm test                                 # 7/7 passed
npm run test:e2e                         # 10/10 production-build desktop + 390px mobile passed
npm run build                            # includes tsc --noEmit; dist/index.html produced
```

The repository has no separate lint configuration; the strict TypeScript
typecheck is the first stage of `npm run build`. This is a static site, so no
package/consumer artifact applies beyond the generated `dist/` directory.

The production-build Playwright suite checks the title, one H1, visible skip
link focus, keyboard start and action, local save, no console/page errors in
normal play, all story chapters/ending, legal pages, invalid-save recovery,
and both desktop and 390×844 mobile layouts. Its Axe WCAG 2 A/AA checks found
**0 serious or critical issues** on the cover and active game.

The same clean browser run registers the production service worker, confirms an
active controller can check for an update with no waiting worker, rejects an
online history-fallback response and a deliberately poisoned old cache entry
for `/assets/*.js`, then uses `context.setOffline(true)` for two consecutive
reloads. Every missing asset response is a plain-text `503`, eliminating the
HTML-module MIME regression in both network states.

A fresh Lighthouse 12.8.2 mobile audit of the repaired `vite preview` build
(`CHROME_PATH` set to the supplied Chromium and `bf-cache` excluded because the
root-run Chrome process closes during that audit) reported:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 0.9 s |
| Largest Contentful Paint | 1.0 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0.004 |

Production asset budgets: **23.31 KB JS** (8.71 KB gzip), **17.32 KB CSS**
(4.73 KB gzip), 95 KB mobile AVIF, no webfonts. No runtime network request
leaves the origin; live header checks confirm HSTS, CSP, `nosniff`,
`Referrer-Policy: no-referrer`, and the restrictive Permissions Policy.

After deployment, a fresh 390×844 Chromium context against
`https://one-sitting-idle.sociobot.in/` installed and controlled the
`last-light-v3` worker, performed an online missing-asset request (`503`,
plain text, non-HTML), reloaded while offline with the game title intact, and
performed the offline missing-asset request (`503`, plain text, non-HTML).
There were no page errors. The live document identity was also checked for its
`lang="en"`, title, and `main` landmark.

## Build and deployment

- Install: `npm ci` (Playwright is pinned to `@playwright/test` 1.58.2 to
  match the supplied Chromium)
- Develop: `npm run dev`
- Unit tests: `npm test`
- Browser/a11y tests: `npx playwright install chromium && npm run test:e2e`
- Required build command: `npm run build`
- Required deploy directory: `./dist` (`dist/index.html` is present)
- Deployed: 2026-08-28 with Azure Static Web Apps CLI 2.0.6 to production app
  `sf-one-sitting-idle` / `nice-stone-043ef630f.7.azurestaticapps.net`; the
  public custom domain now serves `last-light-v3`.

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
