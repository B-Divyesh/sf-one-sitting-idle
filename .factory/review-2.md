# Adversarial first-read review 2 — The Last Light

**Verdict: PASS**  
**Reviewed:** 2026-08-28 UTC  
**Live URL:** <https://one-sitting-idle.sociobot.in/>  
**Repository commit:** 2f18622d0c1c8b41b0ee2fff6eedfb7e1075b3f5

No findings remain. The live product is clear, tryable, and honest in fresh
contexts; all listed claims were tested from a fresh clone.

## Cold first screen

Fresh Chromium contexts had empty cookies, cache, and storage. I did not scroll
before answering.

| Question | 390 × 844 phone | 1440 × 900 desktop |
| --- | --- | --- |
| What does this do? | A 35–50-minute idle game where I restore a lighthouse, guide ships, and survive a storm. | The same finite lighthouse idle game with a story and ending. |
| For whom? | Idle-game fans who want an ending without ads or endless resets. | Idle-game fans who want an ending without ads or endless resets. |
| What should I click first? | **Try it with sample data**; it opens a working Act II lighthouse. | **Try it with sample data**; it opens a working Act II lighthouse. |

The mobile first viewport visibly contains **“Finish a 35–50-minute idle game,”**
**“For idle-game fans who want a clear ending without ads or endless resets,”**
the sample action and outcome, plus **“35–50 minutes,” “Saves only in this
browser,”** and **“Free; no ads or purchases.”** There is no first-screen
blocker.

## Copy audit

Counts split on spaces. This lists every visitor-facing sentence, heading, label,
button, status, and static dialog string on the cold landing document. Repeated
strings use the same count. README commands and paths are code rather than
sentences. No copy exceeds 22 words; no banned marketing word appears. “Idle
game” is the explicitly named audience's genre and is explained by adjacent
copy, so it is not unexplained jargon.

### Landing page

| Location | Exact copy | Words |
| --- | --- | ---: |
| Skip link | Skip to the keeper's log | 5 |
| Wordmark | The Last Light | 3 |
| Navigation | Home; Demo; Privacy; Terms | 1 each |
| H1 | Finish a 35–50-minute idle game | 5 |
| Audience | For idle-game fans who want a clear ending without ads or endless resets. | 12 |
| Sample action | Try it with sample data | 5 |
| Real action | Start a new game | 4 |
| Sample outcome | Opens a working lighthouse midway through Act II. | 8 |
| Facts | 35–50 minutes; Saves only in this browser; Free; no ads or purchases | 2; 5; 5 |
| Cover stamp | LOG 7B · NORTH REACH | 4 |
| Cover label | The keeper's log | 3 |
| Cover heading | The last keeper left the lamp in pieces. | 8 |
| Cover body | Restore the light, guide three cutters home, and keep the tower standing until dawn. | 13 |
| Cover quotation | A proper mechanism should know when its work is done. | 10 |
| Cover citation | margin note, unsigned | 3 |
| How label | Three entries in the log | 5 |
| H2 | How it works | 3 |
| Step | Automate the lamp. | 3 |
| Step | Press the main action, then buy repairs that produce light automatically. | 10 |
| Step | Aim the beam. | 3 |
| Step | Choose how much light searches the sea and how much powers the lamp. | 12 |
| Step | Repair storm damage. | 3 |
| Step | Keep the tower standing until the third act ends at dawn. | 10 |
| Limits label | A finite night | 3 |
| H2 | What the game does not do | 6 |
| Limits | There are no accounts, ads, purchases, daily rewards, or endless resets. | 11 |
| Limits | The browser saves progress automatically. | 5 |
| Limits | Closing the tab earns nothing. | 5 |
| Limits | After the first visit, the game reloads without a network connection. | 11 |
| Footer | Finish a 35–50-minute idle game with no endless resets. | 9 |
| Footer | Built by Param Factory · Build 1.1.0 · Generated illustration | 8 |
| Toolbar | Open instructions; Turn motion off; Turn motion on; Copy save | 2; 3; 3; 2 |
| Instructions label/H2 | Instructions; Reach dawn in three acts | 1; 5 |
| Instructions | Check each act's goal. | 4 |
| Instructions | The goal and progress appear above the main action. | 9 |
| Instructions | Aim the beam, then repair storm damage. | 7 |
| Instructions | Each later act adds one decision. | 6 |
| Keyboard help | 1 performs the main action. | 5 |
| Keyboard help | 2–4 buy the first available repairs. | 6 |
| Keyboard help | S copies a save link. | 5 |
| Keyboard help | ? opens instructions. | 3 |
| Instructions | The device save remembers the state you left. | 8 |
| Dialog actions | Close instructions; Return to the log | 2; 4 |
| Restart label/H2 | Erase this log?; Begin the night again | 3; 4 |
| Restart warning | Your current device save will be replaced. | 7 |
| Restart warning | Copy a save link first if you want to return to it. | 12 |
| Restart actions | Keep current save; Erase and restart | 3; 3 |
| Offline status | Offline.; Your progress remains in this browser. | 1; 6 |
| No-script | The lighthouse mechanism needs JavaScript to run. | 7 |
| No-script recovery | Enable it, then reload this page. | 6 |

The instructions repeat the exact task sentences already counted in “How it
works.” Terminology remains consistent: **35–50-minute idle game**, **main
action**, **repairs**, **instructions**, **device save**, **save link**, **demo**,
and **motion**.

### README

| Location | Exact copy | Words |
| --- | --- | ---: |
| Intro | The Last Light is a 35–50-minute idle game for players tired of endless resets. | 12 |
| Intro | Restore a lighthouse, guide three cutters home, and keep the tower standing. | 12 |
| Intro | The story ends after the storm. | 6 |
| Demo label | Try the isolated sample: | 4 |
| Product behavior | Each act adds one task: automate the lamp, aim the beam, then repair storm damage. | 15 |
| Product behavior | The browser saves progress automatically. | 5 |
| Product behavior | Copy a save link to continue on another device. | 10 |
| Product behavior | Play without a mouse: press 1 for the main action, 2–4 for repairs, S to copy a save, and ? for instructions. | 22 |
| Product behavior | Closing the tab earns nothing. | 5 |
| Product behavior | After the first visit, the game reloads without a network connection. | 11 |
| Product behavior | The game fits a 390 px screen and respects the browser's reduced-motion preference. | 14 |
| Product behavior | The game loads no third-party scripts or fonts. | 8 |
| Product behavior | It has no accounts, analytics, ads, or purchases. | 9 |
| Sandbox | The sample uses demo:last-light-save-v1. | 4 |
| Sandbox | Resetting or leaving it removes only sample data. | 8 |
| Sandbox | See .factory/demo.md for the sandbox contract. | 6 |
| Verification | Playwright uses the pinned 1.58.2 Chromium. | 6 |
| Verification | The production build writes the static site to dist/, with dist/index.html at its root. | 14 |
| Architecture | src/game.ts calculates game state. | 4 |
| Architecture | src/main.ts renders and saves it. | 5 |
| Architecture | Vitest checks progression, the duration target, and save decoding. | 9 |
| Architecture | Playwright checks desktop, 390 px, offline, privacy, routing, and accessibility behavior. | 11 |
| Assets | The image prompt and generator record are in assets/src/. | 9 |
| Assets | AVIF, WebP, and JPEG files are in public/assets/. | 8 |
| Assets | The generated illustration is disclosed in the site footer. | 9 |
| Assets | The palette, type, spacing, and motion rules are recorded in .factory/design.md. | 12 |
| Deploy | Deploy the contents of dist/ as an Azure Static Web App. | 11 |
| Deploy | Routing, 404 behavior, security headers, and caching are in public/staticwebapp.config.json. | 10 |
| Privacy/license | Game progress stays in browser storage or a save link. | 10 |
| Privacy/license | Read /privacy/ and /terms/ for details. | 6 |
| Privacy/license | The source is MIT licensed; see LICENSE. | 7 |

Every public product promise maps to a registry entry: duration, ending,
mechanics, device save, save link, keyboard controls, no offline earnings,
offline reload, privacy/no-commerce, mobile layout, reduced motion, demo
isolation, storm duration, generated art, or static artifact. Build/run
instructions are repository documentation, not user-facing product promises;
their referenced files and commands were independently checked. No unlisted
claim finding remains.

## Demo, sandbox, privacy, and offline

| Check | Result | Evidence |
| --- | --- | --- |
| One-click sample | PASS | The visible home action opens /?demo=1. |
| Product already in use | PASS | The first demo screen is Act II with 3,400 light, about 940 bearings, six repairs, and eight log entries. |
| Banner/actions | PASS | **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for real** persist on the demo. |
| Reset/isolation | PASS | Reset restored the seed while last-light-save-v1 = real-sentinel remained byte-for-byte unchanged. |
| Exit | PASS | Start for real removed the demo key, returned to /, and retained the sentinel. |
| Privacy | PASS | Whole home → demo → reset → exit request audit had only https://one-sitting-idle.sociobot.in. |
| Offline | PASS | After service-worker control, offline /demo/ reload retained title, H1, seeded state, banner, and zero errors. |

## Claims and clean-clone verification

Fresh clone: /tmp/one-sitting-idle-review-2-F000or at the reviewed commit.

- npm ci: PASS (59 packages; zero reported vulnerabilities)
- npm test: PASS (7/7)
- npm run build: PASS (five static documents in dist/)
- npm run test:e2e: PASS (44/44)
- Each listed @claim selector was invoked separately from that clone: PASS.

| Claim id | Result | Claim id | Result |
| --- | --- | --- | --- |
| duration | PASS | ending | PASS |
| mechanics | PASS | device-save | PASS |
| save-link | PASS | keyboard-controls | PASS |
| no-offline-earnings | PASS | offline-reload | PASS |
| privacy-no-commerce | PASS | mobile-layout | PASS |
| reduced-motion | PASS | demo-isolation | PASS |
| storm-duration | PASS | generated-art | PASS |
| static-artifact | PASS | — | — |

The registry parses and all 15 ids have exactly one matching tag. The live
privacy/offline exercises above independently confirm the two most likely
environment-sensitive claims.

## Structure, accessibility, and identity

| Check | Result | Evidence |
| --- | --- | --- |
| Titles and metadata | PASS | /, /demo/, /privacy/, /terms/, and 404 have route-appropriate title, one H1, description, canonical, OG/Twitter, SVG favicon, and touch icon. |
| Designed 404 | PASS | /missing-review-2 returned HTTP 404, **This log page is missing**, and a return link. |
| Direct routes | PASS | All real routes opened directly with their own documents. |
| Back/focus/announcement | PASS | Privacy navigation focused its H1; Back focused home H1 and the live region announced the route. |
| Link crawl | PASS | /, /?demo=1, /demo/, /privacy/, and /terms/ returned 200. |
| Shared skeleton | PASS | Every route has skip link, wordmark home link, consistent nav/footer, Privacy/Terms, Param Factory credit, and build id. |
| Mobile/accessibility | PASS | No mobile horizontal overflow; all visible controls meet 44 px in the claim test; E2E found no serious/critical Axe issue. |
| Browser health | PASS | Fresh live desktop and mobile home loads had zero console/page errors. |
| Identity | PASS | Ruled ivory keeper's notebook, navy desk, rust controls, lamp-yellow focus mark, serif/monospace pairing, and original lighthouse art match the thesis; this is not a generic SaaS template. |

## Earlier finding confirmation

Every earlier finding was checked on current source and live production, rather
than accepted because a previous report called it fixed.

| Earlier id(s) | Current confirmation |
| --- | --- |
| B-01 | Current first viewport supplies the job H1, named audience, sample action/outcome, and facts. |
| B-02 | src/main.ts chooses demo storage before loading; live reset/exit retained a real sentinel. |
| B-03 | Registry and all 15 tagged claim tests exist and passed. |
| B-04 | Separate documents and live unknown-route HTTP 404 are present. |
| M-01 | Required metadata, social image, favicon, and touch icon are live. |
| M-02 | Shared skeleton, landing sections, route focus, and announcement are live. |
| M-03 | 390 px controls pass the 44 px test. |
| C-01 | **Open instructions** is live. |
| C-02 | **Turn motion off/on** is live. |
| C-03 | **35–50-minute idle game** is the consistent public product term. |
| C-04 | **No endless resets** replaced prestige jargon. |
| C-05 | **Automate the lamp** replaced the vague heading. |
| C-06 | Instruction names the main action and automatic light. |
| C-07 | **Check each act's goal** replaced the vague heading. |
| C-08 | **Aim the beam, then repair storm damage** replaced the vague heading. |
| C-09 | ? opens **instructions**. |
| C-10 | **Keep current save** is live. |
| C-11 | Browser-local wording replaced the absolute safety promise. |
| C-12 | README opener is 12 words. |
| C-13 | README says the story ends after the storm. |
| C-14 | README names the three concrete tasks. |
| C-15 | README plainly explains automatic save and save link. |
| C-16 | README gives exact key results. |
| C-17 | README states observable offline reload. |
| C-18 | README says no third-party scripts or fonts. |
| C-19 | The unmeasured runtime-size claim is absent. |
| C-20 | Architecture names the two files directly. |
| C-21 | Vitest description states its checks. |
| C-22 | Playwright description states its checks. |
| C-23 | README gives prompt/generator record location. |
| C-24 | README gives asset location without “optimized.” |
| C-25 | Public copy names the Act III/storm endpoint. |
| C-26 | **Main action** is consistent. |
| C-27 | **Repairs** is consistent. |
| C-28 | **Instructions** is consistent. |
| U-01, U-04, U-05, U-13, U-31 | Covered by duration. |
| U-02, U-06, U-07, U-08, U-18, U-20, U-22, U-32, U-34 | Covered by mechanics, ending, and storm-duration. |
| U-03, U-10, U-11, U-14, U-15, U-16, U-39 | Covered by privacy-no-commerce and ending. |
| U-09, U-28, U-35, U-50 | Covered by device-save and save-link. |
| U-12, U-27, U-36 | Covered by no-offline-earnings. |
| U-17, U-47, U-48 | Covered by generated-art; source and assets exist. |
| U-19, U-23, U-24, U-25, U-26, U-37 | Covered by mechanics, keyboard-controls, and save-link. |
| U-21 | Unsupported “Nothing is hidden or random” wording is removed. |
| U-29 | Unqualified “safe” wording is removed. |
| U-30 | Clear no-script requirement and recovery, not a product-result claim. |
| U-33 | “Real ending” was replaced; ending covers the endpoint. |
| U-38 | Separate mobile, reduced-motion, and offline tests exist. |
| U-40 | README points to records without an unmeasured user-outcome claim. |
| U-41 | static-artifact verifies built documents. |
| U-42 | Config exists and live routing/header checks passed. |
| U-43 | Unmeasured “small” wording is removed. |
| U-44 | Architecture wording is direct and non-promissory. |
| U-45, U-46 | Current test-description statements match passing suites. |
| U-49 | Design record contains the named rules. |
| U-51, U-52 | Legal links resolve; LICENSE contains MIT text. |
| V1-P1 offline | Live controlled offline reload succeeded without a module/MIME error. |
| V1-P1 save recovery | Save invariants reject the prior impossible payload while preserving a valid save. |

## Missed leverage

No finding. This brief calls for a local, finite browser game, not a workflow
that benefits from an AI step. Its implied portability feature is a tested save
link. No decorative AI feature, provider key, import/export, or sync omission
is expected for this product.

## What would make this perfect

Nothing required for this release remains. A future episode should bring its own
isolated sample and claim tests; that is new scope, not an omission here.

