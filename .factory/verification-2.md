# Independent verification 2 — PASS

**Date:** 2026-08-28
**Candidate commit:** `0f1f957b3c8f21b4479c134ac40c01b72fa8bb43`
**Candidate URL:** <https://one-sitting-idle.sociobot.in/>
**Verdict:** **PASS** — no P0/P1/P2 defects were found in this independent retest. This report does not modify product code.

The earlier report is `.factory/verification-1.md`; this is a fresh verification
of the repaired candidate, not a restatement of its claims.

## Clean checkout and repository gates

The worktree started clean on the exact requested commit. The committed lockfile
was used.

```text
npm ci             PASS — 59 packages added; npm audit reported 0 vulnerabilities
npm test           PASS — 7/7 Vitest engine tests
npm run build      PASS — tsc --noEmit followed by Vite production build; dist/ exists
npm run test:e2e   PASS — 10/10 Playwright tests (desktop and 390 × 844 mobile)
```

There is no lint script/configuration and no separate typecheck script in this
repository. `tsc --noEmit` is the first, passing stage of the required build.
This is a static browser game, not a library, CLI, or backend, so package
consumer, concurrency, persistence-server, and health-identity checks do not
apply.

## Product acceptance and recovery exercise

The tested product fulfills the researched smallest useful product: an original
finite lighthouse episode with three acts (**Kindle → Bearing → Weather**),
automation, a beam-allocation rule change, recoverable storm pressure, a real
ending with time-to-finish, local/URL saves, no prestige loop, no ads, no IAP,
and no offline earnings.

- The unit suite exercises exact act thresholds (9,000 light, 2,000 bearings,
  900-second storm), all three transitions and ending, non-affordable upgrade
  boundaries, a 60-second delayed tick capped at two seconds, recoverable
  integrity floor/repair, save round-tripping, and semantic invalid-save
  rejection.
- The production-build E2E suite independently opens valid Act II/III/ending
  save states and validates their distinct controls and ending screen. It also
  runs the normal keyboard start/action/local-save path at desktop and 390 px.
- Additional independent browser exercise on the production preview confirmed:
  `Enter` starts the game from the focused cover action; `1` produces `5.0`
  light; `S` writes a clipboard URL containing `#save=`; `?`/Escape opens and
  closes instructions; Space selects the 25% beam radio option; restart cancel
  preserves the save; confirmed restart returns to the fresh cover.
- Fresh live testing of the prior failure payload (`act: 4`, `finished: false`)
  showed the visible **Save not loaded** alert and preserved the prior valid
  local save. The shipped E2E suite additionally verifies broken, invalid,
  and previous-save recovery cases.

## Accessibility, responsive behavior, and browser health

Fresh Chromium checks against the live URL found:

- Desktop: title, `lang="en"`, one `h1`, and one `main`; first Tab reaches the
  skip link with a visible `rgb(232, 184, 50) solid 3px` focus ring. Normal
  keyboard play had no console or page errors.
- Axe WCAG 2 A/AA: **0 serious/critical violations** on both cover and active
  game desktop screens, and **0** on the 390 × 844 mobile cover.
- At 390 px with `prefers-reduced-motion: reduce`, document width equaled the
  390px viewport (no horizontal overflow); the cover action measured 249.9 ×
  58px and active primary action 320 × 58.3px. Computed transition duration
  was `0.00001s` and animation was `none`. No browser errors occurred.
- The live normal-play request set contained only
  `https://one-sitting-idle.sociobot.in`; no analytics, trackers, remote fonts,
  or third-party scripts were requested. Source/bundle inspection found only
  the product's own sitemap origin, not a runtime remote endpoint.

The explicit missing-asset PWA probe intentionally records two browser console
network errors for the expected 503 responses; these are not normal-play page
errors.

## PWA, privacy, response policy, and deployment identity

In a fresh live HTTPS context, the `last-light-v3` service worker became
controller, `registration.update()` had an active worker and no waiting worker,
and offline reload retained the interactive cover. An online and offline fetch
of an intentionally missing `/assets/*.js` each returned plain-text `503`
(`Offline resource unavailable.`), never HTML; this directly retests the
previous module MIME failure.

Live response checks confirmed HSTS, CSP limited to self (`connect-src 'self'`),
`X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and the
camera/microphone/geolocation-denying Permissions Policy. HTML has
`Cache-Control: public, must-revalidate, max-age=30`; hashed JS/CSS have
`public, max-age=31536000, immutable`.

The local first-party privacy and terms pages are present and accurately state
the localStorage/portable-URL model. The fresh browser request audit corroborates
that no game state leaves the origin.

The live deployment matches this exact production build byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `2a176f6a1a52ec82d905c00f9ab5f2e8b1ed02b14861fcc8a7cb5339718f468a` |
| `assets/main-tNyutWzD.js` | `06ad7c95eb8488dcc801e1c88c35ebcbf6d49004c3b214f15256cda49caf7bdb` |
| `assets/style-ton86yi9.css` | `601146788f470f5eaa29ca4348eba9bf2f628cdc4dc7197c66b6daf867796ddc` |
| `sw.js` | `40d410adcc27379b60233a421cbe5f823c2de66267521f88541853a6e062ad12` |
| `privacy/index.html` | `b5b7abba87a66664a8774c73d2baa124f53c5549e3aa73a07640b73be6bbbf7b` |
| `terms/index.html` | `9030b02bbd3d1b6459f40807457af1fa2fddb786c434ef5c3c0948546f6db74b` |
| `assets/lighthouse-notebook-960.avif` | `a06440c52c59f1653bd6d84056ebae145ab93adf50a3d957f02c05ca0f7ffe6e` |

## Performance

Fresh Lighthouse 13.4.1 mobile-defaults audit of the exact production preview:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.0 s |
| Largest Contentful Paint | 1.1 s |
| Total Blocking Time | 80 ms |
| Cumulative Layout Shift | 0.004 |

Budget check: initial JS is 23,305 B (8,712 B gzip), CSS is 17,324 B
(4,731 B gzip), no webfonts ship, and the mobile AVIF is 96,698 B. All are
within the stated static-product budgets.

## Defects and follow-up

No P0, P1, P2, or P3 defect was found. The earlier deployment-only service
worker and semantic-save failures are both reproduced as repaired on the live
candidate. The normal product caveat remains that completion-time suitability
has deterministic coverage but would benefit from external human playtesting;
it is not a release blocker for this verification.
