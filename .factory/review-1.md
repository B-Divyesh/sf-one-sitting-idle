# Adversarial first-read review 1 — The Last Light

**Verdict: FAIL**  
**Reviewed:** 2026-08-28 UTC  
**Live URL:** <https://one-sitting-idle.sociobot.in/>  
**Repository commit reviewed in a clean clone:** `ab4fa6ac607186b192886abb501d6c7a73b18e81`

There are four blocking findings. The site does not identify its audience on the
first screen, has no isolated sample demo, has no claims registry, and serves the
home page with HTTP 200 for unknown routes instead of a designed 404. Passing unit,
browser, accessibility, offline, and build checks do not remove those blockers.

## 1. Cold first screen, before scrolling

Fresh Chromium contexts used 390×844 and 1440×900 viewports with empty cookies,
cache, and local storage.

| Question | 390 px phone | Desktop |
| --- | --- | --- |
| What does this do? | Best inference: it is a 35–50 minute lighthouse-themed “idle story.” “Idle story” does not explain the interaction to a visitor who does not already know the genre. | Best inference: it is a short idle game about restoring a lighthouse and surviving a storm. |
| For whom? | Cannot answer. No audience or player situation is named. | Cannot answer. No audience or player situation is named. |
| What should I click first? | “Open the keeper's log,” partly at the bottom edge of the viewport. | “Open the keeper's log.” |

The exact first-screen copy that fails is the H1 **“The Last Light”**, followed by
**“One lighthouse. One storm. One sitting.”** Neither says what the visitor does or
who the game is for. The phrase **“A one-sitting idle story”** relies on genre jargon.
On the phone, the facts line **“Saves on this device · No account · No ads · No
offline earnings”** is below the initial viewport.

## 2. Findings, ordered by severity

### BLOCKING B-01 — The first screen does not name the audience or use a job headline

**Quote:** “The Last Light”; “One lighthouse. One storm. One sitting.”; “A
one-sitting idle story · 35–50 min.”

**Why this loses a first-time visitor:** the H1 is only the product name. A visitor
can infer theme and duration, but cannot confirm that this is an interactive game
for people who like idle mechanics but want a defined ending. The required “for
whom” answer is absent in both viewports. On mobile, the three product facts are
also below the fold.

**Concrete fix:** use this first-screen copy and keep it visible at 390×844:

- H1: **“Finish an idle story in one sitting”**
- Support: **“For idle-game fans who want a clear ending without ads or endless resets.”**
- Primary action: **“Try it with sample data”**
- Adjacent explanation: **“Opens a working lighthouse midway through Act II.”**
- Facts: **“35–50 minutes” · “Saves only in this browser” · “Free; no ads or purchases”**

Register and test each factual line before publishing it.

### BLOCKING B-02 — There is no demo, and the apparent demo routes use real storage

**Quote/evidence:** neither the mobile nor desktop first screen has **“Try it with
sample data.”** `/demo` and `/?demo=1` render the ordinary cover. After the only
primary action, the product shows **“Act I of III,” “0.0 / 9,000 light,”** and no
sample progress. There is no **“Demo — sample data, nothing is saved”** banner,
**Reset demo**, or **Start for real** action.

The isolation check created a normal save, then opened `/demo`. `/demo` immediately
loaded the same state and exposed the same `last-light-save-v1` local-storage key.
It has no `demo:` namespace. A demo action would therefore mutate the real save.

**Why this loses or misleads a first-time visitor:** the visitor cannot see the
game's value in one click. A route named `/demo` looks isolated but is merely the
home fallback and reads real progress.

**Concrete fix:** make `/demo` a real route seeded with a realistic mid-Act-II
lighthouse, bought repairs, changing rates, and several field-log entries. Persist
only to a `demo:last-light-save-v1` key (or memory), show the required persistent
banner, make **Reset demo** restore the seed, and make **Start for real** discard the
demo namespace. Add a browser test that seeds `last-light-save-v1`, exercises and
resets the demo, then asserts the real value is byte-for-byte unchanged.

### BLOCKING B-03 — The required claims registry is absent; every claim is unlisted

**Quote/evidence:** `.factory/claims.json` does not exist in the working tree or in
the clean clone. `rg "@claim:"` finds no tagged tests. There were therefore zero
listed claim commands to run.

**Why this misleads a first-time visitor:** statements such as **“35–50 min,”
“Saves on this device,” “Works at 390 px,” “caches its shell for offline use,”** and
**“Game state never leaves the browser”** have no contract tying the exact published
wording to an observable sandbox test. Some similar untagged tests pass, but they
can drift without failing a named claim.

**Concrete fix:** add `.factory/claims.json`; give every U-series statement in the
claims table below an entry or remove/rewrite it. Each retained entry needs exactly
one `@claim:<id>` test that starts at `/demo` in a fresh context. At minimum add
tagged tests for duration, ending, device save, save-link round trip, keyboard
controls, reduced motion, offline reload, same-origin-only networking, absent
accounts/ads/purchases, mobile layout, and demo isolation.

### BLOCKING B-04 — Unknown and promised routes are silently rewritten to the home page

**Quote/evidence:** `GET /does-not-exist-review-1` returned HTTP 200, the home title
**“The Last Light — a one-sitting idle game,”** and the home H1. `/demo` behaved the
same way and did not use the required title **“Demo — The Last Light.”**

**Why this loses a first-time visitor:** a mistyped or shared URL gives no error and
no route-specific context. The address bar says `/demo` while the page is not a
demo. This is broken routing, not a useful fallback.

**Concrete fix:** add a product-styled 404 page with a lighthouse/log motif, an H1
such as **“This log page is missing”**, and **“Return to the game.”** Configure the
host so unknown documents return 404. Implement `/demo` separately with its own
title, H1, state, and storage boundary. Add direct-load, reload, and unknown-route
browser tests.

### MAJOR M-01 — Required discovery metadata is incomplete

All checked routes have `lang="en"`, a description, one H1, and an SVG favicon.
However, `/`, `/privacy/`, `/terms/`, `/demo`, and the fallback have no canonical
link, Open Graph fields, Twitter card fields, or 180 px apple-touch icon. There is
no 1200×630 product image. The home title matches the required pattern and is 40
characters; the legal titles are route-specific. The demo title is not.

**Concrete fix:** add route-specific canonical, OG, and Twitter metadata; create a
1200×630 image derived from the existing lighthouse artwork; add a 180 px
apple-touch icon; and assert metadata for every real route in a crawl test.

### MAJOR M-02 — The site skeleton and navigation are inconsistent

**Quote/evidence:** the landing page has no **How it works** section and no explicit
plain-language privacy/limitations section. The home header offers game tools but
no Demo or Privacy link. The legal headers each expose only the other legal page.
Footers use different one-liners and none includes **“Built by Param Factory”** or a
version/build ID. Following the Privacy link leaves focus on `<body>`; going back
also leaves focus on `<body>` rather than the restored H1. Back navigation did
restore the URL and scroll position.

**Why this matters:** visitors and screen-reader users do not get a predictable
route skeleton or a route-change announcement.

**Concrete fix:** use one header/footer structure on every route, including Home,
Demo, Privacy, Terms, factory credit, and build ID. Add the missing landing
sections. On client-side route changes focus the new H1 and announce it in a polite
live region; test focus after forward and back navigation.

### MAJOR M-03 — Several mobile controls miss the 44 px touch-target minimum

At 390 px, **How to play** and **Copy save** measured 38 px high. Footer Privacy
and Terms links measured 13 px high. The wordmark measured 44 px and the primary
button measured 58 px.

**Concrete fix:** give every header and footer control at least a 44×44 px hit area
without relying on text height. Add a 390 px test that checks all visible links and
buttons.

### Copy findings

Each item below is a separate flagged-copy finding and includes a replacement.

| ID | Quote | Why it fails | Proposed rewrite |
| --- | --- | --- | --- |
| C-01 | “How to play” | Button names a topic, not the result of pressing it. | **Open instructions** |
| C-02 | “Still waters: off” | Metaphor hides a motion setting and does not name the button result. | **Turn motion off** / **Turn motion on** |
| C-03 | “one-sitting idle story”; “incremental story”; “automation games”; “browser game” | The same product uses four category names. | Use **35–50-minute idle game** everywhere. |
| C-04 | “No prestige.” | Genre jargon does not explain the outcome. | **No endless resets.** |
| C-05 | “Work the mechanism.” | Heading is vague when heard out of context. | **Automate the lamp.** |
| C-06 | “Use the large action and buy repairs to automate it.” | “Large action” is visual and conflicts with “main/current action.” | **Press the main action, then buy repairs that produce light automatically.** |
| C-07 | “Read the margin.” | Heading is a metaphor, not the task. | **Check each act's goal.** |
| C-08 | “Change the rules.” | Heading does not name what changes. | **Aim the beam, then repair storm damage.** |
| C-09 | “? opens this page.” | A dialog is called a page and elsewhere called instructions. | **? opens instructions.** |
| C-10 | “Keep this night” | Confirmation button does not name the saved result. | **Keep current save** |
| C-11 | “Your log is safe on this device.” | “Safe” is unqualified; browser data can be cleared. | **Your progress remains in this browser while offline.** |
| C-12 | README opening sentence, 27 words | It exceeds 22 words and combines audience, format, exclusions, and marketing language. | **The Last Light is a 35–50-minute idle game for players tired of endless resets.** |
| C-13 | “It has a real ending.” | “Real” is a marketing adjective. | **The story ends after the storm.** |
| C-14 | “automation, beam allocation, and recoverable storm damage” | Abstract mechanic labels require genre knowledge. | **Each act adds one task: automate the lamp, aim the beam, then repair storm damage.** |
| C-15 | “Local autosave plus portable, compact save-in-URL links.” | “Autosave,” “portable,” and “save-in-URL” are compressed jargon; two adjectives make no observable promise. | **The browser saves progress automatically. Copy a save link to continue on another device.** |
| C-16 | “Complete keyboard path” | “Path” is accessibility jargon and “current action” conflicts with “main action.” | **Play without a mouse: press 1 for the main action, 2–4 for repairs, S to copy a save, and ? for instructions.** |
| C-17 | “caches its shell for offline use” | “Caches its shell” is implementation jargon. | **After the first visit, the game reloads without a network connection.** |
| C-18 | “runtime CDNs” | Infrastructure jargon obscures the privacy point. | **The game loads no third-party scripts or fonts.** |
| C-19 | “keep the runtime small” | “Small” is an unmeasured marketing adjective. | **The production JavaScript is 8.73 kB gzip.** Register a size claim test before using the number. |
| C-20 | “pure deterministic economy/state engine” | Dense implementation jargon. | **`src/game.ts` calculates game state; `src/main.ts` renders and saves it.** |
| C-21 | “Vitest covers progression, balance and save migration safety.” | “Covers” and “migration safety” do not say what is asserted. | **Vitest checks progression, the duration target, and save decoding.** |
| C-22 | “serious/critical axe checks” | Tool-specific jargon is not explained. | **Playwright checks desktop and 390 px layouts and reports serious accessibility errors.** |
| C-23 | “prompt provenance” | Specialist wording hides the useful fact. | **The image prompt and generator record are in `assets/src/`.** |
| C-24 | “Optimized AVIF, WebP and JPEG outputs” | “Optimized” is an unmeasured adjective. | **AVIF, WebP, and JPEG files are in `public/assets/`.** |
| C-25 | “complete” in the landing footer and README | A marketing adjective substitutes for the concrete endpoint. | **The story ends after Act III.** |
| C-26 | “large action”; “main action”; “current action” | Three names refer to one control. | Use **main action**. |
| C-27 | “repairs”; “Repairs & arrangements”; “upgrades” | Three names refer to the same purchases. | Use **repairs**. |
| C-28 | “How to play”; “Keeper's instructions”; “instructions”; “this page” | Four names refer to one dialog. | Use **instructions**. |

No attached-skill banned words were found. Only the 27-word README opener exceeds
the 22-word cap.

## 3. Complete copy audit

Counts use whitespace-delimited lexical tokens; punctuation marks and decorative
symbols are not words. Headings, buttons, labels, status messages, and hidden
dialogs are included because a visitor or assistive technology can encounter them.

### Landing page

| Location | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| Skip link | “Skip to the keeper's log” | 5 | — |
| Wordmark | “The Last Light” | 3 | — |
| Button | “How to play” | 3 | C-01, C-28 |
| Button | “Still waters: off” | 3 | C-02 |
| Button | “Copy save” | 2 | — |
| H1 | “The Last Light” | 3 | B-01 |
| Deck | “One lighthouse.” | 2 | — |
| Deck | “One storm.” | 2 | — |
| Deck | “One sitting.” | 2 | — |
| Image stamp | “Log 7B · North Reach” | 4 | — |
| Eyebrow | “A one-sitting idle story · 35–50 min” | 6 | C-03 |
| H2 | “The last keeper left the lamp in pieces.” | 8 | B-01 |
| Body | “Tonight, three cutters are due through the shoals.” | 8 | — |
| Body | “Restore the light, teach it to speak, and keep it burning until dawn.” | 13 | — |
| Quote | “A proper mechanism should know when its work is done.” | 10 | — |
| Attribution | “margin note, unsigned” | 3 | — |
| Primary button | “Open the keeper's log” | 4 | B-02 |
| Fact | “Saves on this device” | 4 | — |
| Fact | “No account” | 2 | — |
| Fact | “No ads” | 2 | — |
| Fact | “No offline earnings” | 3 | — |
| Footer | “A complete 35–50 minute incremental story.” | 6 | C-03, C-25 |
| Footer | “No ads.” | 2 | — |
| Footer | “No purchases.” | 2 | — |
| Footer | “No prestige.” | 2 | C-04 |
| Footer label | “Original generated illustration” | 3 | — |
| Help close label | “Close instructions” | 2 | — |
| Help eyebrow | “Keeper's instructions” | 2 | C-28 |
| Help H2 | “Reach dawn in three acts” | 5 | — |
| Help step heading | “Work the mechanism.” | 3 | C-05 |
| Help step body | “Use the large action and buy repairs to automate it.” | 10 | C-06, C-26 |
| Help step heading | “Read the margin.” | 3 | C-07 |
| Help step body | “Each act states its exact goal.” | 6 | — |
| Help step body | “Nothing is hidden or random.” | 5 | — |
| Help step heading | “Change the rules.” | 3 | C-08 |
| Help step body | “The beam and the storm add one new decision each.” | 10 | — |
| Help keyboard | “1 performs the main action.” | 5 | C-26 |
| Help keyboard | “2–4 buy the first available repairs.” | 6 | C-27 |
| Help keyboard | “S copies a save link.” | 5 | — |
| Help keyboard | “? opens this page.” | 4 | C-09, C-28 |
| Help body | “Closing the tab earns nothing.” | 5 | — |
| Help body | “A local save remembers the exact state you left.” | 9 | C-15 |
| Help button | “Return to the log” | 4 | — |
| Restart eyebrow | “Erase this log?” | 3 | — |
| Restart H2 | “Begin the night again” | 4 | — |
| Restart body | “Your current local save will be replaced.” | 7 | — |
| Restart body | “Copy a save link first if you want to return to it.” | 12 | — |
| Restart button | “Keep this night” | 3 | C-10 |
| Restart button | “Erase and restart” | 3 | — |
| Offline status | “Offline.” | 1 | — |
| Offline status | “Your log is safe on this device.” | 7 | C-11 |
| No-script error | “The lighthouse mechanism needs JavaScript to run.” | 7 | — |
| No-script recovery | “Enable it, then reload this page.” | 6 | — |

### README

| Location | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| H1 | “The Last Light” | 3 | — |
| Intro | “The Last Light is a complete 35–50 minute incremental story for people who like automation games but not endless prestige loops, ads, daily rewards, or dark patterns.” | 27 | C-03, C-12, C-25 |
| Intro | “Restore a lighthouse, use its beam to guide three cutters home, then keep the tower standing through a fifteen-minute storm.” | 20 | — |
| Intro | “It has a real ending.” | 5 | C-13 |
| Heading | “Product behavior” | 2 | — |
| Bullet | “Three acts with one new mechanic per act: automation, beam allocation, and recoverable storm damage.” | 15 | C-14 |
| Bullet | “Local autosave plus portable, compact save-in-URL links.” | 7 | C-15 |
| Bullet | “Closing the tab earns nothing; the game intentionally has no offline rewards.” | 12 | — |
| Bullet | “Complete keyboard path: 1 performs the current action, 2–4 buy listed upgrades, S copies a save, and ? opens instructions.” | 20 | C-16, C-25, C-26, C-27 |
| Bullet | “Works at 390 px, respects reduced motion, and caches its shell for offline use.” | 14 | C-17 |
| Bullet | “No accounts, analytics, ads, purchases, third-party scripts, or runtime CDNs.” | 10 | C-18 |
| Reference | “See .factory/brief.json for the researched problem this solves and .factory/design.md for the visual system.” | 14 | — |
| Heading | “Develop” | 1 | — |
| Deploy | “The deployment artifact is the contents of dist/, with dist/index.html at its root.” | 13 | — |
| Deploy | “Azure Static Web Apps behavior and cache headers are defined in public/staticwebapp.config.json.” | 12 | — |
| Heading | “Architecture” | 1 | — |
| Architecture | “Vite and strict vanilla TypeScript keep the runtime small.” | 9 | C-19 |
| Architecture | “src/game.ts is the pure deterministic economy/state engine; src/main.ts renders and persists it.” | 12 | C-20 |
| Architecture | “Vitest covers progression, balance and save migration safety.” | 8 | C-21 |
| Architecture | “Playwright covers the 390 px and desktop paths plus serious/critical axe checks.” | 12 | C-22 |
| Assets | “The generated illustration source and prompt provenance are in assets/src/.” | 10 | C-23 |
| Assets | “Optimized AVIF, WebP and JPEG outputs are in public/assets/.” | 9 | C-24 |
| Assets | “See .factory/design.md for the palette, typography, spacing, motion and asset review notes.” | 12 | — |
| Heading | “Privacy and licensing” | 3 | — |
| Privacy | “Game state never leaves the browser.” | 6 | — |
| Privacy | “Read /privacy/ and /terms/ for the plain-language policies.” | 8 | — |
| License | “The repository source is MIT licensed; see LICENSE.” | 8 | — |

### Terminology table

| Concept | Terms currently used | Required single term | Finding |
| --- | --- | --- | --- |
| Product format | idle story; incremental story; automation game; browser game | **35–50-minute idle game** | C-03 |
| Primary input | large action; main action; current action | **main action** | C-26 |
| Purchasable automation | repairs; repairs & arrangements; upgrades | **repairs** | C-27 |
| Help surface | How to play; Keeper's instructions; instructions; this page | **instructions** | C-28 |
| Browser persistence | saves on this device; local autosave; local save | **device save** | C-15 |
| Shareable persistence | save-in-URL link; copied save link; save URL; save link | **save link** | C-15 |

## 4. Demo and sandbox results

| Check | Result | Evidence |
| --- | --- | --- |
| One-click sample action on first screen | **FAIL — BLOCKING** | No “Try it with sample data” action exists. |
| Direct demo entry | **FAIL — BLOCKING** | `/demo` and `/?demo=1` render the ordinary cover. |
| Realistic sample already in use after click | **FAIL — BLOCKING** | The click opens Act I at `0.0 / 9,000 light` with no bought repairs. |
| Persistent demo banner | **FAIL — BLOCKING** | No banner is rendered. |
| Reset demo | **FAIL — BLOCKING** | No reset action exists. |
| Start for real | **FAIL — BLOCKING** | No transition action exists. |
| Separate storage namespace | **FAIL — BLOCKING** | `/demo` reads the normal `last-light-save-v1` key. |
| Real data untouched | **FAIL — BLOCKING** | A normal save was visible unchanged as the active `/demo` state; no boundary exists. |
| Offline reload | PASS, but unlisted | After a warm load and active service worker, two offline reloads returned the game shell. |
| Network privacy during observed demo/start flow | PASS, but unlisted | Requests were only same-origin documents, JS, CSS, and the lighthouse image; no XHR/fetch or third-party origin appeared. |

## 5. Claims audit

### Registry and command results

| Check | Result |
| --- | --- |
| `.factory/claims.json` exists and parses | **FAIL — file absent** |
| Listed claim commands | 0 |
| `@claim:<id>` tests | 0 |
| Every listed test run from clean clone | Vacuous: there were no listed tests to run. This does not pass the required registry gate. |
| `npm test` from clean clone | PASS — 7/7 tests |
| `npm run test:e2e` from clean clone | PASS — 10/10 tests, desktop and mobile |
| `npm run build` from clean clone | PASS — `dist/` produced; JS 23.31 kB raw / 8.73 kB gzip |

### Unlisted claim findings

Every row is an unlisted-claim finding because the registry is absent. Duplicate
wording remains listed where a visitor encounters it in a separate surface.

| ID | Surface and exact claim-like sentence | Test or correction required |
| --- | --- | --- |
| U-01 | Meta: “The Last Light is a complete 35–50 minute incremental story.” | Timed deterministic demo completion within the exact published bounds. |
| U-02 | Meta: “Restore a lighthouse, guide the fleet home, and face the storm.” | Demo/state test that exposes all three promised stages. |
| U-03 | Meta: “No ads, no endless grind.” | Network/UI assertion for no ads and completion without a reset loop. |
| U-04 | Landing: “One sitting.” | Same duration/ending test as U-01. |
| U-05 | Landing: “A one-sitting idle story · 35–50 min.” | Exact duration assertion; current untagged unit test allows 34 minutes at its lower bound. |
| U-06 | Landing: “The last keeper left the lamp in pieces.” | Treat as story copy, or confirm the opening state/narrative in the demo. |
| U-07 | Landing: “Tonight, three cutters are due through the shoals.” | Story-state assertion for three cutters. |
| U-08 | Landing: “Restore the light, teach it to speak, and keep it burning until dawn.” | End-to-end chapter and ending assertion. |
| U-09 | Landing: “Saves on this device.” | Fresh-context local-storage persistence test. |
| U-10 | Landing: “No account.” | Assert no authentication gate or account request in the full flow. |
| U-11 | Landing: “No ads.” | Assert no ad UI or ad/network origin in the full flow. |
| U-12 | Landing: “No offline earnings.” | Close/hide and resume test that asserts no elapsed resource gain. |
| U-13 | Footer: “A complete 35–50 minute incremental story.” | Exact duration and ending test. |
| U-14 | Footer: “No ads.” | Same observable assertion as U-11. |
| U-15 | Footer: “No purchases.” | Assert no purchase controls or billing requests in the full flow. |
| U-16 | Footer: “No prestige.” | Replace with plain words, then assert the ending has no reset-for-bonus path. |
| U-17 | Footer: “Original generated illustration.” | Check committed provenance files and shipped asset reference. |
| U-18 | Help: “Reach dawn in three acts.” | End-to-end state progression assertion. |
| U-19 | Help: “Use the large action and buy repairs to automate it.” | Interaction test proving a bought repair produces resources without input. |
| U-20 | Help: “Each act states its exact goal.” | Assert each act renders a numeric goal and progress state. |
| U-21 | Help: “Nothing is hidden or random.” | Remove the absolute wording or define and test deterministic outcomes. |
| U-22 | Help: “The beam and the storm add one new decision each.” | Assert the beam control and storm repair control appear in their acts. |
| U-23 | Help: “1 performs the main action.” | Keyboard result assertion. |
| U-24 | Help: “2–4 buy the first available repairs.” | Keyboard purchase assertions for all advertised keys. |
| U-25 | Help: “S copies a save link.” | Clipboard assertion with a decodable URL. |
| U-26 | Help: “? opens this page.” | Rewrite to “instructions,” then assert dialog visibility and focus. |
| U-27 | Help: “Closing the tab earns nothing.” | Background/close-and-resume resource assertion. |
| U-28 | Help: “A local save remembers the exact state you left.” | Reload and deep-state equality assertion. |
| U-29 | Offline status: “Your log is safe on this device.” | Replace “safe”; test offline availability and document storage-clearing limits. |
| U-30 | No-script: “The lighthouse mechanism needs JavaScript to run.” | No-script response check or treat as a stated requirement. |
| U-31 | README: “The Last Light is a complete 35–50 minute incremental story for people who like automation games but not endless prestige loops, ads, daily rewards, or dark patterns.” | Split/rewrite, then test duration, ending, and each exclusion separately. |
| U-32 | README: “Restore a lighthouse, use its beam to guide three cutters home, then keep the tower standing through a fifteen-minute storm.” | End-to-end chapter test including an asserted 15-minute storm duration. |
| U-33 | README: “It has a real ending.” | Rewrite plainly; assert a terminal ending state. |
| U-34 | README: “Three acts with one new mechanic per act: automation, beam allocation, and recoverable storm damage.” | Assert the three act-specific mechanics and recovery behavior. |
| U-35 | README: “Local autosave plus portable, compact save-in-URL links.” | Persistence, link round-trip, cross-context restore, and maximum-length assertions. |
| U-36 | README: “Closing the tab earns nothing; the game intentionally has no offline rewards.” | Background/close-and-resume assertion. |
| U-37 | README: “Complete keyboard path: 1 performs the current action, 2–4 buy listed upgrades, S copies a save, and ? opens instructions.” | Full keyboard-only flow with clipboard and dialog focus assertions. |
| U-38 | README: “Works at 390 px, respects reduced motion, and caches its shell for offline use.” | Separate 390 px overflow/target, reduced-motion, and offline-reload claim tests. |
| U-39 | README: “No accounts, analytics, ads, purchases, third-party scripts, or runtime CDNs.” | Intercept the entire demo flow; assert same-origin static requests only and no related UI. |
| U-40 | README: “See .factory/brief.json for the researched problem this solves and .factory/design.md for the visual system.” | Repository existence/schema check; avoid “solves” unless user outcome is tested. |
| U-41 | README: “The deployment artifact is the contents of dist/, with dist/index.html at its root.” | Build assertion for `dist/index.html` and documented artifact contents. |
| U-42 | README: “Azure Static Web Apps behavior and cache headers are defined in public/staticwebapp.config.json.” | Config existence and header-response assertion. |
| U-43 | README: “Vite and strict vanilla TypeScript keep the runtime small.” | Replace “small” with a tested byte budget. |
| U-44 | README: “src/game.ts is the pure deterministic economy/state engine; src/main.ts renders and persists it.” | Determinism/state persistence test or factual architecture wording without “pure.” |
| U-45 | README: “Vitest covers progression, balance and save migration safety.” | Name the actual assertions; add migration fixtures if migration safety remains claimed. |
| U-46 | README: “Playwright covers the 390 px and desktop paths plus serious/critical axe checks.” | Tag and assert viewport flows and accessibility scan results. |
| U-47 | README: “The generated illustration source and prompt provenance are in assets/src/.” | Repository asset/provenance existence check. |
| U-48 | README: “Optimized AVIF, WebP and JPEG outputs are in public/assets/.” | Remove “optimized” or assert format dimensions and byte ceilings. |
| U-49 | README: “See .factory/design.md for the palette, typography, spacing, motion and asset review notes.” | Repository-section existence check. |
| U-50 | README: “Game state never leaves the browser.” | Intercept the entire demo and real flow; assert no state-bearing request leaves the browser. |
| U-51 | README: “Read /privacy/ and /terms/ for the plain-language policies.” | Link crawl plus a copy review if “plain-language” remains. |
| U-52 | README: “The repository source is MIT licensed; see LICENSE.” | Assert `LICENSE` exists and contains the MIT text. |

## 6. Structure, routing, accessibility, and identity

| Check | Result | Evidence |
| --- | --- | --- |
| Title pattern | Partial | Home, Privacy, and Terms are route-specific and under 60 characters; Demo is not. |
| One H1 | Partial | Exactly one on every checked page, but home H1 is the product name rather than the job headline. |
| Meta description | PASS | Present on Home, Privacy, Terms; home copy is under 155 characters. |
| Canonical | FAIL | Missing on every checked route. |
| OG/Twitter metadata | FAIL | No fields or 1200×630 image. |
| Favicon | Partial | SVG exists; apple-touch icon is missing. |
| Designed 404 | **FAIL — BLOCKING** | Unknown path returns home with HTTP 200. |
| Deep links | Partial | Privacy and Terms load directly; Demo is a false fallback. |
| Back/scroll | PASS | Browser back restores the home URL and prior scroll position. |
| Route-change focus | FAIL | Active element is `<body>` after Privacy navigation and after Back. |
| Dead-link crawl | PASS | All discovered Home/Privacy/Terms/skip links resolved; no external links were present. |
| Consistent header/footer | FAIL | Navigation and one-liners differ; factory credit and build ID are absent. |
| Standard landing order | FAIL | No sample demo, How it works section, or explicit limitations/privacy section. |
| Visual identity | PASS | The asymmetric ivory log sheet, navy desk, rust controls, serif/monospace pairing, and original lighthouse plate are recognizably product-specific rather than a generic SaaS hero/card layout. |
| Axe serious/critical | PASS | Zero violations on `/`, `/privacy/`, `/terms/`, `/demo`, and the fallback in the 390 px check. |
| Keyboard/focus | PASS with route exception | Skip link is first, controls are reachable, Enter starts the game, and focus uses a visible 3 px yellow outline. Route focus fails as noted above. |
| Touch targets | FAIL | Header buttons are 38 px high; footer links are 13 px high at 390 px. |
| Console | PASS | No console or page errors on checked live routes and first interaction. |
| Runtime JS budget | PASS | Live JS is 23.31 kB raw; clean build reports 8.73 kB gzip. |
| Security headers | PASS | CSP, `nosniff`, no-referrer, Permissions-Policy, and HSTS are present. |
| Robots/sitemap | Partial | Both exist; sitemap lists Home, Privacy, Terms but not the required Demo route. |

The factory `verify-url.sh` check also passed its limited title/lang/main/alt/console
gate: HTTP 200, `lang="en"`, one H1, a main landmark, zero missing alt attributes,
zero unlabeled buttons, and zero console errors. It does not inspect demo isolation,
copy clarity, claims coverage, route semantics, metadata completeness, or touch size.

## 7. Verification record

Clean clone: `/tmp/one-sitting-idle-review-1.oYlbk4` at
`ab4fa6ac607186b192886abb501d6c7a73b18e81`.

```text
npm ci             PASS — 59 packages, 0 vulnerabilities reported by install
npm test           PASS — 7 tests
npm run test:e2e   PASS — 10 tests across desktop and 390 px projects
npm run build      PASS — dist/ produced; JS 23.31 kB raw / 8.73 kB gzip
verify-url.sh live PASS — basic document/console checks
```

No product code was modified during this review.
