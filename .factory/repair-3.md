# Repair 3 — strict review closure

**Result: PASS**  
**Date:** 2026-09-06 UTC  
**Live URL:** <https://one-sitting-idle.sociobot.in/>  
**Implementation commit:** `33d4f41a2030e0afb57686ea254629f7e4cc852a`  
**Deployment ID:** `880cd33d-abe3-4370-b5d8-e2ac809d2ad8`

The two findings and the untested public claim from `.factory/review-3.md`
are closed. No product behavior, episode scope, storage boundary, or paid
deliverable was removed.

## Review 3 findings

| Finding | Repair | Outcome evidence |
| --- | --- | --- |
| M-04: “No daily rewards” was unregistered. | Added the `daily-rewards` registry entry and one tagged browser test. The test closes the isolated demo, advances the calendar by two days, and reopens it. | The exact saved economy remains unchanged, only the demo save key exists, no reward prompt or control appears, and the next main action adds exactly seven bearings. The declared command passes independently. |
| C-03-R: social descriptions used “lighthouse game.” | Changed Open Graph and Twitter descriptions to **35–50-minute idle game** and added a production-page metadata assertion. The catalog sentence now uses the same term. | The built and live metadata contain the required term and reject “lighthouse game.” The live `index.html` hash matches `dist/index.html`. |

`.factory/claims.json` now has 16 entries and exactly one `@claim:<id>` test
for each entry. The untested public claim count is zero.

## Clean-checkout verification

Clean clone: `/tmp/one-sitting-idle-repair-3-clean.Xp13i4`, detached at the
implementation commit.

```text
npm ci                         PASS — 59 packages, 0 vulnerabilities
npm test                       PASS — 7/7
npm run build                  PASS — dist/ contains Home, Demo, Privacy, Terms, and 404
npm run test:e2e               PASS — 46/46 across desktop and 390 px mobile
```

Every command declared in `.factory/claims.json` was then run separately and
passed: `duration`, `ending`, `mechanics`, `device-save`, `save-link`,
`keyboard-controls`, `no-offline-earnings`, `offline-reload`,
`privacy-no-commerce`, `daily-rewards`, `mobile-layout`, `reduced-motion`,
`demo-isolation`, `storm-duration`, `generated-art`, and `static-artifact`.

Production budgets remain within contract:

- JavaScript: 26,998 B raw / 9,767 B gzip total.
- CSS: 21,101 B raw / 5,549 B gzip.
- Fonts: 0 B.
- Mobile hero AVIF: 96,698 B.

## Cold live verification

- Fresh 1440 × 900 and 390 × 844 contexts saw the job, audience, sample
  action, sample outcome, and three facts before scrolling.
- The one-click sample opened populated Act II data with 940 / 2,000 bearings,
  six bought repairs, eight log entries, and the persistent sample label.
- Play, Reset demo, and Start for real left an existing valid personal save
  byte-for-byte unchanged and removed the demo key on exit.
- Keyboard action and dialog focus worked. The phone had no horizontal
  overflow or visible target below 44 px. Reduced motion removed animation.
- Home, Demo, Privacy, Terms, and the designed 404 had correct titles, one H1,
  and no serious or critical Axe finding. Normal routes had no console or page
  errors. The deliberate unknown-route 404 was classified as expected.
- Only the product origin was requested. A controlled Demo reloaded offline.
- `verify-url.sh` passed title, language, main, image-alt, button-label, and
  console checks.
- Live and local `index.html` share SHA-256
  `0172dad1d610b2061038af9deaa8b23d5e755fbfd3b4fd106f93478726909f9d`.
- Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 0.9 s, TBT 0 ms, CLS 0.

Evidence is in `/work/.evidence/`: `catalog-description.txt`, the phone and
desktop screenshots, the populated desktop sample screenshot, the Lighthouse
JSON, and the `repair-3-verify/` output.

## Earlier history disposition

| Earlier findings | Current disposition |
| --- | --- |
| Verification 1 offline MIME failure | Pass. Built assets are precached, missing assets stay plain-text errors, and the live controlled demo reloads offline. |
| Verification 1 impossible-save crash | Pass. Semantic validation rejects the recorded payload and preserves a valid device save. |
| B-01 through B-04 | Pass. The first screen is plain, the sample is isolated and populated, all claims are registered, and direct Demo plus real 404 routes work. |
| M-01 through M-03 | Pass. Metadata and icons are complete, the shared route skeleton/focus behavior remains covered, and 390 px targets remain at least 44 px. |
| C-01, C-02, C-04 through C-28 | Pass. The plain-word rewrites and single terms documented in `.factory/polish-1.md` remain live and tested. |
| C-03 and C-03-R | Pass. Title, H1, footer, README, catalog, Open Graph, and Twitter use **35–50-minute idle game**. |
| U-01 through U-52 | Pass or removed as recorded in review 2, with U-31's retained daily-reward assertion now covered by `daily-rewards`. |
| M-04 | Pass. The retained public daily-reward claim now has its own registered outcome test. |

This remains a static product. Backend tenant, health, restart, SQLite, and
429 checks do not apply. No checkout or paid offer is live, so no billing offer
metadata is required. The researched future one-time season remains future
scope and was not made free or removed.

## Remaining gaps

None. No current or earlier review finding is deferred.
