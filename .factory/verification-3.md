# Independent verification 3 — finish a short idle game

**Verdict: FAIL**  
**Date:** 2026-09-06 UTC  
**Live URL:** <https://one-sitting-idle.sociobot.in/>  
**Implementation candidate:** `33d4f41a2030e0afb57686ea254629f7e4cc852a`  
**Documentation SHA reviewed:** `2102141068015bb6cc9d21296c27835b5b24cf18`

The game and every declared claim command pass. One major plain-words contract
finding remains, so this independent verification is **FAIL**. Product source
was not changed during this audit.

## Job, audience, and first action before scrolling

- **Job:** finish a 35–50-minute idle game.
- **Audience:** idle-game fans who want a clear ending without ads or endless
  resets.
- **First action:** **Try it with sample data**; it opens a working lighthouse
  midway through Act II.

Fresh desktop (1440 × 900) and phone (390 × 844) contexts displayed those
items and the three facts—duration, browser-only save, and free/no ads or
purchases—without scrolling.

## Finding

### Major M-05 — Public copy still uses prohibited decorative keeper/log lore

**Evidence:** the fresh live desktop and phone pages, plus direct route review,
show text such as **“The keeper's log,” “Three entries in the log,” “A finite
night,” “Return to the log,” “Skip to the keeper's log,” “Log entry 404 · Torn
from the binding,”** and **“The address points beyond the keeper's chart.”**
The home page also shows the decorative quotation, **“A proper mechanism should
know when its work is done.”**

**Why this fails:** the attached plain-words contract expressly prohibits
metaphor, brand-lore, decorative labels, and sentences that do not tell the
visitor what the product does or what to do. It applies to every page,
including the 404 and legal pages. The current copy audit only checks word
counts and banned marketing words, so it does not catch this contract breach.

**Required repair:** replace these labels, skip-link labels, quotations, and
404 prose with plain names and direct instructions. Keep story events inside
the playable episode where they explain play; remove decorative framing from
navigation, headings, and site chrome. Update the copy audit to check this
rule, then rerun the public-copy and route tests.

## Clean checkout and declared claims

A fresh detached clone at the implementation candidate was created at
`/tmp/one-sitting-idle-verify-3.dUrOIc`. `npm ci` installed 59 packages and
reported 0 vulnerabilities. The documented prerequisites were installed before
test measurement.

| Command | Result |
| --- | --- |
| `npm test` | PASS — 7/7 |
| `npm run build` | PASS — TypeScript check and Vite build; `dist/` produced |
| `npm run test:e2e` | PASS — 46/46 |

Each `test` command in `.factory/claims.json` was run separately from that
clean checkout. All 16 passed: `duration`, `ending`, `mechanics`, `device-save`,
`save-link`, `keyboard-controls`, `no-offline-earnings`, `offline-reload`,
`privacy-no-commerce`, `daily-rewards`, `mobile-layout`, `reduced-motion`,
`demo-isolation`, `storm-duration`, `generated-art`, and `static-artifact`.

**Untested public claims: 0.** The finding above is a copy-contract defect,
not an unregistered factual claim.

## Live checks

- The live `/` SHA-256 is
  `0172dad1d610b2061038af9deaa8b23d5e755fbfd3b4fd106f93478726909f9d`,
  identical to this candidate's `dist/index.html`. The deployed HTML names the
  same `main-C6xpwx8m.js` and `style-qkPG99Zg.css` assets. The later reviewed
  documentation commit therefore does not require a separate product image.
- `verify-url.sh` passed: HTTP 200, title, `lang=en`, one H1, main landmark,
  image alt text, labelled buttons, and no console errors.
- Fresh desktop demo use showed Act II with **940 / 2,000 bearings**, eight log
  entries, and the persistent **“Demo — sample data, nothing is saved”** label.
  Playing, resetting, and choosing **Start for real** left an existing personal
  save byte-for-byte unchanged and removed the demo key.
- A fresh phone had no horizontal overflow (`scrollWidth = 390`) and no visible
  link or button smaller than 44 px. Desktop and phone Axe WCAG 2 A/AA scans
  had zero serious or critical violations. A reduced-motion context produced
  `animation: none` and a `0.00001s` transition.
- Fresh normal play had no console/page errors and requested only
  `https://one-sitting-idle.sociobot.in`. The controlled service worker reloaded
  the interactive Demo offline.
- The first Tab from a fresh home page reached the visible 3 px skip-link focus
  ring. Keyboard main action use worked; the full advertised keyboard mapping,
  dialog focus, and mobile controls are also exercised by the passing dedicated
  claim command.
- An impossible shared save showed **“Save not loaded”** and retained the valid
  existing device save. This confirms recovery for the original semantic-save
  failure.
- `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, `robots.txt`, and
  `sitemap.xml` returned 200. Each real page had its route title and one H1.
  An unknown URL returned the styled missing-page document with HTTP 404; that
  deliberate 404 is expected behavior, not a defect. All first-party page links
  resolved with 200.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, a self-only CSP, and a restrictive
  Permissions Policy. Privacy and terms pages are present and describe the
  local browser/save-link model.

## Earlier findings and current disposition

| Earlier finding | Current disposition |
| --- | --- |
| Verification 1 P1 offline reload | Pass. The controlled live Demo reloads offline and the `offline-reload` claim passes. |
| Verification 1 P1 impossible save | Pass. Live invalid-save recovery preserved a valid save; the recovery browser test passes. |
| B-01 | Pass. Both fresh first screens name the job, audience, first action, outcome, and three facts. |
| B-02 | Pass. The populated Act II sample uses `demo:` storage; reset and exit preserved the real sentinel save. |
| B-03 | Pass. The registry has 16 entries and all 16 exact commands pass independently. |
| B-04 | Pass. Demo is a real page and an unknown URL is a styled HTTP 404. |
| M-01 | Pass. Route-specific canonical/social metadata, SVG favicon, and touch icon are present. |
| M-02 | Pass. Shared skeleton, legal links, titles, H1 focus behavior, and route announcement remain covered by the passing browser suite. |
| M-03 | Pass. Current 390 px checks found no overflow or undersized visible controls. |
| C-01 through C-02 | Pass. **Open instructions** and **Turn motion off/on** remain live. |
| C-03 and C-03-R | Pass. Current live Open Graph and Twitter descriptions use **35–50-minute idle game**, not “lighthouse game.” |
| C-04 through C-28 | Pass as recorded in `.factory/polish-1.md`: concrete terms, direct controls, and the 22-word audit remain in place. M-05 is a separate, newly retained prohibition on decorative lore. |
| U-01 through U-52 | Pass, removed, or covered by the 16 current claim commands as mapped in review 2 and repair 3. U-31's daily-reward portion now passes `daily-rewards`. |
| M-04 | Pass. **No daily rewards** is registered and its two-calendar-day outcome command passes. |

## Evidence

`/work/.evidence/verification-3/` contains the `verify-url.sh` output and fresh
desktop/phone screenshots. The required copies are
`/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.

## Result

**FAIL — 1 finding, 0 untested public claims.** A plain-words repair is needed
before this candidate can be accepted.
