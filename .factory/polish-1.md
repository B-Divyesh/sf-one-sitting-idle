# Polish 1 — review finding closure

Reviewed against `2f46555e4b1ad2bcc2afc515c10a029e3a32434a`, the earlier
verification reports, and the release candidate `884eb54d7eba0d2ebc8edf80fc9ec8c182b23934`.
The screenshots named below are captured from the production build at
390×844 after the final repair: `.factory/evidence/polish-1-home-390.png`,
`.factory/evidence/polish-1-demo-390.png`, and
`.factory/evidence/polish-1-404-390.png`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| B-01 | Rewrote the first screen as “Finish a 35–50-minute idle game,” named idle-game fans, placed the sample action, explanation, and three facts above the 390px fold. | `@claim:mobile-layout`; home screenshot; live `/` |
| B-02 | Added the one-click `/?demo=1` and `/demo/` sample with seeded Act II data, `demo:*` keys, banner, reset, and real-game exit. | `@claim:demo-isolation`, `@claim:device-save`; demo screenshot; live `/demo/` |
| B-03 | Added `claims.json` with one tagged Playwright test per published promise and a clean-run claims command. | `npm run test:claims`; all claim commands listed in `claims.json` |
| B-04 | Built separate Home, Demo, Privacy, Terms, and 404 documents; configured a 404 response override and tested direct/reload routes. | `direct routes expose complete metadata and unknown paths remain 404`; live missing-route check |
| M-01 | Added canonical, route-specific Open Graph/Twitter metadata, social image, SVG favicon, and apple touch icon. Query-string demo metadata now changes to the Demo metadata too. | `direct routes expose complete metadata and unknown paths remain 404`; `one-click query demo supplies its own route metadata` |
| M-02 | Added the shared header/footer, landing “How it works” and limits sections, route announcement, and heading focus restoration. | `site navigation focuses and announces the new heading after forward and back`; `every first-party link resolves to a real static page` |
| M-03 | Applied 44px minimum hit areas to header, footer, toolbar, dialog, and demo controls. | `@claim:mobile-layout`; home and demo screenshots |
| C-01 | Renamed “How to play” to “Open instructions.” | `@claim:keyboard-controls`; UI copy audit |
| C-02 | Renamed the motion control to “Turn motion off/on.” | `@claim:reduced-motion`; UI copy audit |
| C-03 | Standardized the product term to “35–50-minute idle game” in the home title, metadata, headline, catalog, footer, and README. | home route metadata test; UI copy audit |
| C-04 | Replaced “No prestige” with “No endless resets.” | `@claim:ending`; UI copy audit |
| C-05 | Replaced “Work the mechanism” with “Automate the lamp.” | instructions smoke path; UI copy audit |
| C-06 | Rewrote the repair instruction around the named main action and automatic light. | instructions smoke path; UI copy audit |
| C-07 | Replaced “Read the margin” with “Check each act's goal.” | instructions smoke path; UI copy audit |
| C-08 | Replaced “Change the rules” with “Aim the beam, then repair storm damage.” | `@claim:mechanics`; UI copy audit |
| C-09 | Replaced “this page” with “instructions.” | `@claim:keyboard-controls`; UI copy audit |
| C-10 | Renamed the restart cancel action “Keep current save.” | restart dialog smoke path; UI copy audit |
| C-11 | Rewrote the offline note as browser-local progress, without an absolute safety promise. | `@claim:offline-reload`; UI copy audit |
| C-12 | Rewrote the README opening to one 12-word audience sentence. | `.factory/copy-audit.md`; README review |
| C-13 | Replaced “real ending” with “The story ends after the storm.” | `@claim:ending`; README review |
| C-14 | Replaced abstract mechanic labels with the three concrete player tasks. | `@claim:mechanics`; README review |
| C-15 | Rewrote storage/link copy in plain language. | `@claim:device-save`, `@claim:save-link`; README review |
| C-16 | Rewrote keyboard help as the exact key/result list. | `@claim:keyboard-controls`; README review |
| C-17 | Rewrote offline copy as a reload outcome. | `@claim:offline-reload`; README review |
| C-18 | Rewrote CDN jargon as “no third-party scripts or fonts.” | `@claim:privacy-no-commerce`; README review |
| C-19 | Removed the unmeasured runtime-size marketing sentence. | README review; build budget output |
| C-20 | Rewrote architecture prose to name the two files and their jobs. | README review |
| C-21 | Rewrote test prose to state the asserted game behavior. | README review; `npm test` |
| C-22 | Rewrote test prose to name desktop/mobile, offline, privacy, routing, and accessibility behavior. | README review; `npm run test:e2e` |
| C-23 | Rewrote provenance copy as a direct file location. | `@claim:generated-art`; README review |
| C-24 | Rewrote asset copy as a direct file location. | `@claim:generated-art`; README review |
| C-25 | Replaced “complete” marketing copy with the Act III endpoint. | `@claim:ending`; UI and README audit |
| C-26 | Uses “main action” for the primary input everywhere. | `@claim:keyboard-controls`; UI copy audit |
| C-27 | Uses “repairs” for purchases everywhere. | `@claim:mechanics`; UI copy audit |
| C-28 | Uses “instructions” for the help dialog everywhere. | `@claim:keyboard-controls`; UI copy audit |
| V1-P1 offline | Precaches the active hashed modules/styles and returns plain 503 for missing assets, never an HTML module fallback. | `@claim:offline-reload`; `missing assets return plain errors online and offline` |
| V1-P1 save recovery | Rejects semantically impossible saves before storage writes and preserves a valid existing save. | `an impossible shared save recovers without replacing a good device save`; `npm test` |

Final production checks are recorded in `.factory/handoff.md`. No review,
verification, or copy finding is deferred.
