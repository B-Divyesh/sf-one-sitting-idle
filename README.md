# The Last Light

The Last Light is a 35–50-minute idle game for players tired of endless resets.
Restore a lighthouse, guide three cutters home, and keep the tower standing.
The story ends after the storm.

Try the isolated sample: <https://one-sitting-idle.sociobot.in/demo/>

## Product behavior

- Each act adds one task: automate the lamp, aim the beam, then repair storm damage.
- The browser saves progress automatically. Copy a save link to continue on another device.
- Play without a mouse: press `1` for the main action, `2`–`4` for repairs, `S` to copy a save, and `?` for instructions.
- Closing the tab earns nothing. After the first visit, the game reloads without a network connection.
- The game fits a 390 px screen and respects the browser's reduced-motion preference.
- The game loads no third-party scripts or fonts. It has no accounts, analytics, ads, or purchases.

The sample uses `demo:last-light-save-v1`. Resetting or leaving it removes only
sample data. See [.factory/demo.md](.factory/demo.md) for the sandbox contract.

## Run and verify

```bash
npm ci
npm run dev
npm test
npm run test:e2e
npm run test:claims
npm run build
```

Playwright uses the pinned 1.58.2 Chromium. The production build writes the
static site to `dist/`, with `dist/index.html` at its root.

## Architecture and assets

`src/game.ts` calculates game state. `src/main.ts` renders and saves it.
Vitest checks progression, the duration target, and save decoding. Playwright
checks desktop, 390 px, offline, privacy, routing, and accessibility behavior.

The image prompt and generator record are in `assets/src/`. AVIF, WebP, and
JPEG files are in `public/assets/`. The generated illustration is disclosed in
the site footer. The palette, type, spacing, and motion rules are recorded in
`.factory/design.md`.

## Deploy, privacy, and license

Deploy the contents of `dist/` as an Azure Static Web App. Routing, 404 behavior,
security headers, and caching are in `public/staticwebapp.config.json`.

Game progress stays in browser storage or a save link. Read `/privacy/` and
`/terms/` for details. The source is MIT licensed; see `LICENSE`.
