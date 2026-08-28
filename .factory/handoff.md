# Handoff — adversarial first-read review 1

## Outcome

**FAIL** for <https://one-sitting-idle.sociobot.in/>. The full evidence and
copy/claims inventories are in `.factory/review-1.md`.

Four release-blocking findings were recorded:

1. The first screen does not identify the intended player or use a job headline.
2. There is no one-click sample demo; `/demo` reads the normal save namespace.
3. `.factory/claims.json` and `@claim:*` tests are absent.
4. Unknown paths return the home page with HTTP 200; there is no designed 404.

The report also records missing social/canonical metadata, inconsistent site
navigation and footer structure, absent route-change focus, sub-44 px mobile
targets, and specific copy issues with proposed rewrites.

## What changed

- Added `.factory/review-1.md`.
- Replaced this handoff with the review-specific result.
- Did not modify product code, configuration, dependencies, or generated assets.

## Verification performed

The live site was checked in fresh 390×844 and 1440×900 Chromium contexts. The
review exercised the normal first click, `/demo`, `/?demo=1`, real-save isolation,
offline reload, same-origin request behavior, legal routes, an unknown route,
link traversal, keyboard focus, route/back focus, mobile target sizes, metadata,
console output, and axe.

A separate clean clone at commit
`ab4fa6ac607186b192886abb501d6c7a73b18e81` produced:

```text
npm ci             PASS
npm test           PASS — 7/7
npm run test:e2e   PASS — 10/10
npm run build      PASS — dist/ produced, 8.73 kB gzip JavaScript
```

`/opt/fleet/lib/verify-url.sh` passed its basic live checks. Live axe scans found
zero violations on the checked routes. Warmed offline reload and same-origin-only
requests passed manual interception, but both remain unlisted claims.

## Known gaps and next steps

The review found no claims registry, so there were no listed claim commands to
run. The passing general tests do not satisfy that contract. Repair work should
start with the isolated seeded demo and claim registry, then first-screen copy and
real 404 routing. After repair, rerun every registered claim from a fresh clone and
repeat this review in clean phone and desktop contexts.
