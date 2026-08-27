# The Last Light

The Last Light is a complete 35–50 minute incremental story for people who like
automation games but not endless prestige loops, ads, daily rewards, or dark
patterns. Restore a lighthouse, use its beam to guide three cutters home, then
keep the tower standing through a fifteen-minute storm. It has a real ending.

Live: <https://one-sitting-idle.sociobot.in>

## Product behavior

- Three acts with one new mechanic per act: automation, beam allocation, and
  recoverable storm damage.
- Local autosave plus portable, compact save-in-URL links. Closing the tab earns
  nothing; the game intentionally has no offline rewards.
- Complete keyboard path: `1` performs the current action, `2`–`4` buy listed
  upgrades, `S` copies a save, and `?` opens instructions.
- Works at 390 px, respects reduced motion, and caches its shell for offline use.
- No accounts, analytics, ads, purchases, third-party scripts, or runtime CDNs.

See `.factory/brief.json` for the researched problem this solves and `.factory/design.md` for the visual system.

## Develop

```bash
npm install
npm run dev
npm test
npm run test:e2e  # installs/uses a Playwright Chromium browser
npm run build     # output: dist/
```

The deployment artifact is the contents of `dist/`, with `dist/index.html` at
its root. Azure Static Web Apps behavior and cache headers are defined in
`public/staticwebapp.config.json`.

## Architecture

Vite and strict vanilla TypeScript keep the runtime small. `src/game.ts` is the
pure deterministic economy/state engine; `src/main.ts` renders and persists it.
Vitest covers progression, balance and save migration safety. Playwright covers
the 390 px and desktop paths plus serious/critical axe checks.

The generated illustration source and prompt provenance are in `assets/src/`.
Optimized AVIF, WebP and JPEG outputs are in `public/assets/`. See
`.factory/design.md` for the palette, typography, spacing, motion and asset
review notes.

## Privacy and licensing

Game state never leaves the browser. Read `/privacy/` and `/terms/` for the
plain-language policies. The repository source is MIT licensed; see `LICENSE`.
