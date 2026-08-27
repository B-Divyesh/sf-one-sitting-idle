# Independent verification — FAIL

**Verifier:** factory verification worker  
**Date:** 2026-08-27  
**Candidate commit:** `eb638d5f85e724231b12d88fa68dd713097b844c`  
**Live URL:** <https://one-sitting-idle.sociobot.in/>  
**Verdict:** **FAIL** — two P1 defects break required recovery/offline behavior. No product source was changed during this audit.

## Scope and build identity

This was run from a clean, detached-content-equivalent checkout at the stated
commit (`git status --short --branch` was clean before report writing), using
the committed lockfile.

```text
npm ci                         PASS — 59 packages, 0 vulnerabilities
npm test                       PASS — 6/6 Vitest tests
npm run build                  PASS — tsc --noEmit + Vite; dist/ produced
npx playwright install chromium
npm run test:e2e               PASS — 6/6 (desktop + 390×844 mobile)
```

There is no lint script or separate typecheck script; the only repository type
check is the `tsc --noEmit` step in `npm run build`. `npm run` exposes only
`dev`, `build`, `preview`, `test`, and `test:e2e`.

The live files are byte-identical to the exact production build:

| File | SHA-256 |
| --- | --- |
| `index.html` | `c62012956d569e9b4e879d1699b162462222dfdc7f9f4f4398859ac33b87d98d` |
| `assets/main-zNjW63iJ.js` | `0e74dd9afb4ffa11131ea91a67b397984490743125e8958eaf1049dbe235a8d3` |
| `assets/style-ton86yi9.css` | `601146788f470f5eaa29ca4348eba9bf2f628cdc4dc7197c66b6daf867796ddc` |
| `sw.js` | `a7f6d5cbb97bc6fccc6c571fadabd46edcca48608cbe241a1f3bc464ee298e83` |
| `privacy/index.html` | `b5b7abba87a66664a8774c73d2baa124f53c5549e3aa73a07640b73be6bbbf7b` |
| `terms/index.html` | `9030b02bbd3d1b6459f40807457af1fa2fddb786c434ef5c3c0948546f6db74b` |

## Release blockers

### P1 — Installed service worker does not support an offline reload

**Reproduction against the exact `dist/` artifact**

1. Run `npm run preview -- --port 4174`.
2. Open the app in a fresh Chromium context, wait for `navigator.serviceWorker.ready`, then reload once so the worker controls the page.
3. Confirm `navigator.serviceWorker.controller` is true and the registered cache is `last-light-v1`.
4. Set the browser offline and reload.

The document title/H1 is served, but the JavaScript module request is not
cached. `sw.js` falls back to cached `/` for that request, returning HTML with
`Content-Type: text/html`; Chromium reports:

```text
Failed to load module script: Expected a JavaScript-or-Wasm module script but
the server responded with a MIME type of "text/html".
```

The game therefore cannot run or recover its local save offline. The update
check itself completed with an active worker and no waiting worker, but that
does not make the offline shell functional. This contradicts the README and
product UI claims that the shell works/caches for offline use.

### P1 — A syntactically valid but semantically impossible save URL crashes instead of recovering

**Reproduction against live deployment**

Open this hash payload (base64url JSON for version 1, `act: 4`,
`finished: false`):

```text
https://one-sitting-idle.sociobot.in/#save=WzEsNCwwLDAsMCwxMDAsMCw1MCxbXSwwLDAsMCxudWxsLGZhbHNlXQ
```

`decodeSave()` accepts it, writes it to `last-light-save-v1`, and rendering
then throws:

```text
Cannot read properties of undefined (reading 'roman')
```

The game area is blank; no `Save not loaded` alert or fresh-start recovery is
shown. This also overwrites a prior local save with the invalid accepted state.
Malformed values that happen to fail numeric/upgrade validation do recover
correctly, so the defect is the missing cross-field state validation.

## Verified passing behavior

- The product does implement the researched smallest useful product: a finite
  three-act lighthouse story with automation, beam allocation, recoverable
  storm pressure, an ending, elapsed completion time, no prestige, no ads, no
  purchases, and no offline earnings.
- The committed Playwright suite passed on desktop and 390×844 mobile. It
  covers normal start/local save, all three chapters/ending, useful legal
  pages, and a basic invalid-save path.
- Independent Chromium checks on both the exact production preview and live
  deployment, in desktop and 390×844/reduced-motion contexts: one H1, title,
  local save after keyboard action, zero console/page errors in normal play,
  no cross-origin requests, and zero axe WCAG 2 A/AA serious/critical
  violations. The first Tab reaches the skip link and shows a 3px solid focus
  outline. Visual review found the 390px cover and action screen readable and
  usable; desktop is likewise intact.
- Keyboard smoke coverage: Tab reaches the skip link and primary button;
  Enter opens the log; `1` performs the primary action; the committed suite
  exercises the action path. Native dialogs and radio controls are present.
- Reduced motion is detected and the stylesheet disables animations and
  transitions. 390px layout stacks the resource panel and content correctly.
- Privacy/outbound inspection: the browser made no third-party requests;
  bundle inspection shows no remote CDNs. State is localStorage/URL only;
  `/privacy/` and `/terms/` are live and accurately describe that model.
- Live security response headers include HSTS, CSP (`default-src 'self'` and
  `connect-src 'self'`), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, and a restrictive Permissions-Policy.
  Hashed JS and CSS have `Cache-Control: public, max-age=31536000, immutable`;
  HTML is `public, must-revalidate, max-age=30`.
- Production sizes are within stated static budgets: 22,196 B JS (8,356 B
  gzip), 17,324 B CSS (4,720 B gzip), no webfonts, and 96,698 B mobile AVIF.
- Live Lighthouse (mobile defaults, Chrome for Testing 151) reported
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s,
  LCP 1.2 s, TBT 30 ms, CLS 0.004.

## Required remediation and retest

1. Precache the built hashed JS/CSS (and required image) in the service worker,
   or return a non-HTML failure for missing asset requests; test a fresh
   controlled context with cache/network disabled followed by offline reload.
2. Make save decoding enforce state invariants (in particular act/finished
   consistency and valid act-specific upgrade/economy relationships) before
   writing localStorage. Treat every invalid relationship as the existing
   recoverable `Save not loaded` path; add an automated test for the payload
   above and assert a previous local save is preserved.
3. Rerun all commands above and independently verify the regenerated live
   asset hashes before declaring PASS.
