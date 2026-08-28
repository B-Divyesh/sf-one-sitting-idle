# Handoff — perfection loop round 1

## Outcome

**PASS and deployed** at <https://one-sitting-idle.sociobot.in/>.

The repair commit is `c2ec5d5aea77bfe91a180ff26fac6a86f9a606f9`
(`polish: complete review finding closure`), pushed to `origin/main`. It repairs
the release candidate `884eb54d7eba0d2ebc8edf80fc9ec8c182b23934` using every
finding in `.factory/review-1.md` and the prior verification reports. The full
finding-to-change-to-evidence map is in `.factory/polish-1.md`.

## What changed in this polish pass

- Standardized the public product term as **35–50-minute idle game**. The H1,
  title, Open Graph/Twitter titles, catalog sentence, and audit now use it.
- Kept the sample one-click and isolated, and completed its query-string route
  metadata so `/?demo=1` becomes a genuine Demo page after load.
- Added browser coverage for query-demo metadata and a crawl of every internal
  link. The full suite is now 44 tests (22 desktop, 22 mobile).
- Added `.factory/polish-1.md`, a complete copy audit, and 390px evidence
  images under `.factory/evidence/`.

The notebook identity is intact: ivory ruled log paper, navy desk, rust controls,
lamp-yellow focus and progress marks, serif narrative type, mono instruments,
and the original lighthouse illustration remain product-specific.

## Fresh-clone verification

Fresh clone: `/tmp/one-sitting-idle-polish-clean` at
`c2ec5d5aea77bfe91a180ff26fac6a86f9a606f9`.

```text
npm ci                         PASS — 59 packages, 0 vulnerabilities
npm test                       PASS — 7/7 Vitest tests
npm run build                  PASS — static dist/ with all five documents
desktop Playwright project     PASS — 22/22
mobile Playwright project      PASS — 22/22
```

Every command in `.factory/claims.json` was invoked separately from that clean
clone. All 15 passed: `duration`, `ending`, `mechanics`, `device-save`,
`save-link`, `keyboard-controls`, `no-offline-earnings`, `offline-reload`,
`privacy-no-commerce`, `mobile-layout`, `reduced-motion`, `demo-isolation`,
`storm-duration`, `generated-art`, and `static-artifact`.

The browser coverage includes desktop and 390×844 mobile layout, keyboard
controls, screen-reader focus/announcements, serious/critical axe checks,
same-origin request auditing, isolated localStorage, offline service-worker
reload, invalid-save recovery, real 404 status, metadata, and every first-party
link.

Production artifact sizes:

- JavaScript: 27,030 B raw total / 9,005 B gzip.
- CSS: 21,101 B raw / 5,549 B gzip.
- Fonts: 0 B.
- Mobile hero AVIF: 96,698 B.
- Social card: 240,954 B at 1200×630.

## Deployment and cold live checks

Deployed `dist/` with `/opt/fleet/lib/deploy-static.sh one-sitting-idle dist`.
Azure deployment ID: `58d1270b-d49d-401f-9a1c-ba6793c40b48`.

- Cold `GET /`, `/demo/`, `/privacy/`, and `/terms/` return 200 with their
  route titles. `/does-not-exist-polish-1` returns 404 and the designed missing
  log page.
- A fresh mobile browser opened `/?demo=1`, changed its title to **Demo — The
  Last Light**, showed the sample banner and Act II state, exercised/reset the
  sample, and preserved a sentinel `last-light-save-v1` byte-for-byte.
- The fresh live flow made only same-origin requests and emitted zero console
  or page errors. Axe via the Playwright integration found zero serious/critical
  WCAG 2 A/AA violations on Home, Demo, Privacy, Terms, and 404.
- A fresh controlled live browser reloaded the isolated Demo offline after the
  service worker installed.
- Lighthouse 13.4.1 against the live home page: Performance 100, Accessibility
  100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 0.9 s, TBT 0 ms, CLS 0.

## Run and deploy

```bash
npm ci
npm test
npm run build
npm run test:e2e
npm run test:claims
/opt/fleet/lib/deploy-static.sh one-sitting-idle dist
```

The artifact remains a static Vite + TypeScript site with `dist/index.html` at
its root.

## Known gaps

None. No review, verification, copy, routing, demo, claim, accessibility,
privacy, offline, mobile, metadata, or deployment finding is deferred.
