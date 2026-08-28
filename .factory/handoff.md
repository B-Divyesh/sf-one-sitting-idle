# Handoff — perfection loop round 1

## Outcome

**PASS and deployed** at <https://one-sitting-idle.sociobot.in/>. Every blocking and major finding in
`.factory/review-1.md` is repaired. The tested code commits are
`bea726b0d7bb3bc150238f8a6572cb700750ffe3` and
`c62ffe93653648a953781aed4d1e1743ce43a36f`. Deployment used pushed source
commit `8492c702d868f1723bbc51b8970a7b638230e6ab`.

## Review repairs

- B-01: the first screen now says **Finish an idle story in one sitting**,
  names idle-game fans, explains the sample action, and shows three tested
  facts within 390×844.
- B-02: `/?demo=1` and `/demo/` open a working mid-Act-II lighthouse with
  six bought repairs and eight log entries. The persistent banner provides
  **Reset demo** and **Start for real**. Only `demo:*` keys are touched.
- B-03: `.factory/claims.json` lists 15 retained promises. Each ID occurs in
  exactly one `@claim:<id>` test and every listed command passed separately
  in a clean clone.
- B-04: Demo, Privacy, Terms, and 404 are real multipage build entries. Azure
  Static Web Apps rewrites missing documents to the styled `404.html` while
  preserving status 404.
- M-01: every route has a distinct title, description, canonical, Open Graph,
  Twitter card, SVG favicon, and 180px touch icon. The social image is a
  1200×630 crop of the existing original lighthouse art.
- M-02: every route shares Home/Demo/Privacy/Terms links, the factory credit,
  and build ID. The landing adds **How it works** and limitations sections.
  Forward and back navigation focus and announce the page H1.
- M-03: all visible controls and links measure at least 44×44px at 390px.
- C-01–C-28: the reviewed wording was replaced and terminology is unified in
  `.factory/copy-audit.md`. No sentence exceeds 22 words and no banned word
  remains.

The notebook palette, serif/monospace type, asymmetric paper layout, rust
controls, and generated lighthouse plate remain the product's visual system.
`.factory/design.md` records the new social/touch derivatives and provenance.

## Clean-clone evidence

Clean clone: `/tmp/one-sitting-idle-final.9Pyevx` at
`c62ffe93653648a953781aed4d1e1743ce43a36f`.

```text
npm ci             PASS — 59 packages, 0 vulnerabilities
npm test           PASS — 7/7 Vitest tests
npm run build      PASS — dist/index.html and all route documents produced
npm run test:e2e   PASS — 40/40 desktop + 390×844 browser tests
verify-url.sh      PASS — title/lang/H1/main/alt/labels, zero console errors
axe CLI            PASS — 0 violations on Home, Demo, Privacy, Terms, and 404
```

Every command in `.factory/claims.json` was then executed individually
against the clean production preview. All 15 passed: duration, ending,
mechanics, device save, save link, keyboard controls, no offline earnings,
offline reload, network privacy/no commerce, mobile layout, reduced motion,
demo isolation, storm duration, generated-art record, and static artifact.

The browser suite also passed direct/reload routing, 404 status, canonical and
social metadata, focus forward/back, impossible-save recovery, missing-asset
MIME safety, clipboard round-trip, same-origin-only networking, service-worker
control, and repeated offline reload.

Lighthouse 13.4.1 mobile against that clean build:

| Measure | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.9 s |
| LCP | 1.1 s |
| TBT | 0 ms |
| CLS | 0 |

Production budgets:

- JavaScript: 26,590 B raw / 9,696 B gzip total.
- CSS: 21,101 B raw / 5,549 B gzip.
- Fonts: 0 B.
- Mobile hero AVIF: 96,698 B.
- Social image: 240,954 B at 1200×630.

## Run and deploy

```bash
npm ci
npm test
npm run build
npm run test:claims
npm run test:e2e
/opt/fleet/lib/deploy-static.sh one-sitting-idle dist
```

The deployed artifact remains a static Vite/TypeScript site in `dist/`.

## Live deployment evidence

`/opt/fleet/lib/deploy-static.sh one-sitting-idle dist` completed successfully
with Azure deployment ID `a1a616eb-6a54-44f6-a908-aea89cb8f13c`.

- `/`, `/demo`, `/demo/`, `/privacy/`, and `/terms/` return HTTP 200 with their
  route-specific titles.
- `/does-not-exist-round-1` returns HTTP 404 and the designed **This log page is
  missing** page.
- A fresh 390×844 live browser entered `/?demo=1` at Act II. Reset, offline
  reload, and **Start for real** left a sentinel real save byte-for-byte
  unchanged. Exit deleted `demo:last-light-save-v1` only.
- The entire live browser flow requested only
  `https://one-sitting-idle.sociobot.in` and recorded zero console/page errors.
- The live service worker controlled the demo and reloaded **Bearing** offline.
- Live `verify-url.sh` passed. Live axe CLI reported zero violations across
  Home, Demo, Privacy, Terms, and 404.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100, FCP 0.9 s, LCP 0.9 s, TBT 10 ms, CLS 0.
- CSP, `nosniff`, `no-referrer`, Permissions-Policy, HSTS, and immutable hashed
  asset caching are present on production responses.
- Local and live SHA-256 values match for all route HTML, the service worker,
  both JavaScript files, CSS, and the social image. Representative matches:
  `index.html` `15646912…e6267`, `demo/index.html` `fe1a7cfa…96f4d`, and
  `sw.js` `8720a055…c263d`.

## Known gaps

No known blocking or major review finding remains.
