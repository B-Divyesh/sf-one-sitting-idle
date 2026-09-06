# Review 3 — finish a short idle game with a clear ending

**Verdict: FAIL**  
**Reviewed:** 2026-09-06 UTC  
**Live URL:** <https://one-sitting-idle.sociobot.in/>  
**Implementation candidate:** `c2ec5d5aea77bfe91a180ff26fac6a86f9a606f9`  
**Documentation commit:** `7ffc006804bd77d43f2fa5d797caabb3384d657b`

There are two findings and one untested public claim. The implementation image
is still the candidate: live home references `main-C6xpwx8m.js`,
`navigation-CWbL9z6s.js`, and `style-qkPG99Zg.css`, matching the clean
candidate build. The later commit changes only the previous review and handoff.

## Job, audience, and first action

The job is to finish a 35–50-minute idle game with a clear ending. The audience
is idle-game fans who want no ads or endless resets. The first action is **Try
it with sample data**; it says that it opens a working lighthouse midway through
Act II.

Fresh phone (390 × 844) and desktop (1440 × 900) contexts opened the live home
page at scroll position zero. Both showed the H1, audience sentence, action,
action explanation, and all three facts before scrolling. On the phone the last
fact ended at 498 px. There was no horizontal overflow.

## Findings

### Major M-04 — “No daily rewards” is an unregistered and untested public claim

**Evidence:** The live home page says: “There are no accounts, ads, purchases,
daily rewards, or endless resets.” The same source line is in `index.html:61`.
`.factory/claims.json` has 15 claims, but none names daily rewards. The only
related `@claim:privacy-no-commerce` test checks accounts, ads, analytics,
purchases, third-party requests, cookies, and related UI; it does not test daily
rewards. The ending claim checks no endless reset loop, not daily rewards.

**Why this is a finding:** Visitors can rely on the statement. The claims
contract requires one tagged sandbox test for every such statement. The prior
review's U-31 closure did not separate this assertion from the duration claim.

**Required repair:** Add a `daily-rewards` claim and tagged demo test that proves
there is no daily-reward state, prompt, or timed reward flow, or remove “daily
rewards” from the public copy.

### Minor C-03-R — Social metadata uses a second product term

**Evidence:** `index.html:11` and `index.html:18` publish “Finish a
35–50-minute lighthouse game with a clear ending and no ads.” The documented
single public term, and the current H1, title, README, and footer term, is
“35–50-minute idle game.” This reopens part of earlier copy finding C-03.

**Required repair:** Change both social descriptions to use “35–50-minute idle
game,” then update the copy audit and relevant metadata test.

## Demo, recovery, and privacy

Fresh live phone and desktop checks entered the demo in one click. Each showed
the persistent **Demo — sample data, nothing is saved** banner, Act II
**Bearing**, `940 / 2,000 bearings`, six bought repairs, and eight field-log
entries. Playing changed only `demo:last-light-save-v1`; Reset demo restored the
sample; Start for real removed the demo key.

In a separate live check, a real started-game save stayed byte-for-byte unchanged
through demo play, reset, and exit. An impossible `#save=` URL showed **Save not
loaded** and kept that good real save. Live demo traffic used only
`https://one-sitting-idle.sociobot.in`, emitted no console or page errors, and
had no cookies.

After service-worker control, an offline live demo reload still rendered
**Bearing** and the sample banner with no errors. The product is static; there
is no backend, tenant, health, restart, or rate-limit endpoint to inspect.

## Accessibility, routes, and browser checks

- Live Axe WCAG 2 A/AA scans found zero serious or critical violations on Home,
  Demo, Privacy, Terms, and 404.
- The live phone demo had no horizontal overflow and no visible link or button
  smaller than 44 × 44 px. With reduced motion, the main-action animation was
  `none` and transition duration was `0.00001s`.
- Keyboard `1` changed bearings from 940 to 947; `4` operated its advertised
  repair slot; `?` opened instructions with focus on Close instructions.
- Home, Demo, Privacy, Terms, `404.html`, robots, sitemap, and social image
  returned 200. An unknown URL returned deliberate HTTP 404 and the designed
  missing-page screen. This is expected 404 behavior, not a defect.
- Every checked route had its own title, one H1, and canonical URL. The shared
  privacy and terms pages state browser storage, save-link content, no accounts,
  analytics, ads, purchases, third-party scripts, or third-party fonts.

## Clean checkout and claims

Clean checkout: `/tmp/one-sitting-idle-review-3-bpBYn8` at documentation SHA
`7ffc006`. `npm ci` completed with no vulnerabilities; `npm test` passed 7/7;
`npm run build` passed and produced `dist/`; `npm run test:e2e` passed 44/44.
Every command declared in `.factory/claims.json` was invoked separately. The
Playwright last-run record is `passed` with no failed tests. All 15 registered
claims have exactly one matching `@claim:` tag:

`duration`, `ending`, `mechanics`, `device-save`, `save-link`,
`keyboard-controls`, `no-offline-earnings`, `offline-reload`,
`privacy-no-commerce`, `mobile-layout`, `reduced-motion`, `demo-isolation`,
`storm-duration`, `generated-art`, and `static-artifact`.

This proves the registered claims. It does not remove M-04: the daily-rewards
assertion is not one of them. `untested_claim_count` is therefore **1**.

## Earlier findings and current disposition

| Earlier finding | Current disposition and evidence |
| --- | --- |
| B-01 | Pass. Both fresh first viewports state the job, audience, sample action, outcome, and facts. |
| B-02 | Pass. Fresh populated Act II demo uses `demo:` storage; reset and exit preserved a real sentinel save. |
| B-03 | Partial regression. The registry and all 15 registered command tests pass, but M-04 is a new unregistered public claim. |
| B-04 | Pass. `/demo/` is a real page and unknown live URLs return the styled 404 with status 404. |
| M-01 | Pass. Route-specific canonical, social metadata, favicon, and touch icon are present. |
| M-02 | Pass. Shared header/footer, legal links, route title/H1, and focus behavior are covered by the 44 browser tests and live routes. |
| M-03 | Pass. Live 390 px screen has no overflow or undersized visible controls. |
| C-01, C-05–C-10, C-26–C-28 | Pass. The controls and instructions use Open instructions, main action, repairs, and instructions consistently. |
| C-02 | Pass. The control says Turn motion off/on and reduced-motion behavior is active. |
| C-03 | Regressed in part as C-03-R: OG and Twitter descriptions use “lighthouse game.” Other public copy uses the required idle-game term. |
| C-04, C-11, C-13–C-18, C-25 | Pass. Current copy names no endless resets, browser-local progress, the storm ending, concrete mechanics, offline reload, and no third-party scripts/fonts. |
| C-12, C-19–C-24 | Pass. README opening is short; unsupported size wording is absent; architecture, test, asset, and generator records are direct. |
| U-01, U-04, U-05, U-13 | Pass through `duration`; U-02, U-06–U-08, U-18, U-20, U-22, U-32, U-34 through mechanics, ending, and storm-duration. |
| U-03, U-10–U-16, U-39 | Pass for ads, accounts, purchases, analytics, and endpoint through privacy/ending tests, except M-04 for the retained daily-rewards wording. |
| U-09, U-12, U-17, U-19, U-23–U-30, U-33, U-35–U-38, U-40–U-52 | Pass through the named persistence, offline, generated-art, keyboard, mobile, static-artifact, legal-link, and README checks. U-31 is only partial: duration passes, but its earlier daily-rewards portion is M-04. |
| V1-P1 offline | Pass. Controlled live service-worker demo reloaded offline without a module or MIME error. |
| V1-P1 save recovery | Pass. An impossible save URL recovered without replacing a valid real save. |

## Result

**FAIL.** There are **2 findings** and **1 untested public claim**. No product
code was changed in this review.
