import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync } from 'node:fs';
import { ACT_ONE_GOAL, ACT_TWO_GOAL, STORM_DURATION, UPGRADES, advanceAct, buyUpgrade, canAdvance, decodeSave, demoState, encodeSave, initialState, primaryAction, startGame, tick } from '../../src/game';

const REAL_KEY = 'last-light-save-v1';
const DEMO_KEY = 'demo:last-light-save-v1';

async function loadDemoState(page: Page, encoded: string): Promise<void> {
  await page.goto('/demo/');
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [DEMO_KEY, encoded]);
  await page.reload();
}

test('@claim:duration an attentive run finishes within 35–50 minutes', async ({ page }) => {
  await page.goto('/demo/');
  let state = startGame(initialState());
  for (let second = 0; second < 3600 && !state.finished; second += 1) {
    if (state.act === 1 || state.act === 2 || (state.act === 3 && state.integrity < 76)) state = primaryAction(state);
    for (const repair of UPGRADES.filter((item) => item.act === state.act)) state = buyUpgrade(state, repair.id);
    state = tick(state, 1);
    if (canAdvance(state)) {
      state = advanceAct(state);
      if (state.act === 2) state = { ...state, beamMode: 75 };
    }
  }
  expect(state.finished).toBe(true);
  expect(state.elapsedMs / 60000).toBeGreaterThanOrEqual(35);
  expect(state.elapsedMs / 60000).toBeLessThanOrEqual(50);
});

test('@claim:ending the story reaches a terminal ending after Act III', async ({ page }) => {
  const nearDawn = { ...demoState(), act: 3 as const, light: 500, signals: ACT_TWO_GOAL, supplies: 30, integrity: 72, stormElapsed: STORM_DURATION };
  await loadDemoState(page, encodeSave(nearDawn));
  await page.getByRole('button', { name: /Open the dawn shutters/ }).click();
  await expect(page.getByRole('heading', { name: 'The horizon answers.' })).toBeVisible();
  await expect(page.getByText('The story ends after Act III.')).toBeVisible();
  await expect(page.getByText(/reset for a bonus/i)).toHaveCount(0);
});

test('@claim:mechanics the sample proves automation, beam choice, goals, and recoverable storm damage', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.getByText('940 / 2,000 bearings')).toBeVisible();
  await expect(page.getByRole('group', { name: 'Beam allocation' })).toBeVisible();
  const before = Number((await page.locator('[data-resource="signals"]').textContent())?.replace(',', ''));
  await expect.poll(async () => Number((await page.locator('[data-resource="signals"]').textContent())?.replace(',', ''))).toBeGreaterThan(before);

  const storm = { ...demoState(), act: 3 as const, light: 500, signals: ACT_TWO_GOAL, supplies: 30, integrity: 40, stormElapsed: 300 };
  await loadDemoState(page, encodeSave(storm));
  await expect(page.getByText('Storm passage')).toBeVisible();
  const integrity = Number((await page.locator('[data-resource="integrity"]').textContent())?.replace('%', ''));
  await page.getByRole('button', { name: /Brace the light/ }).click();
  await expect.poll(async () => Number((await page.locator('[data-resource="integrity"]').textContent())?.replace('%', ''))).toBeGreaterThan(integrity);
});

test('@claim:device-save actions persist in the demo browser namespace', async ({ page }) => {
  await page.goto('/demo/');
  const initial = await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY);
  await page.keyboard.press('1');
  const changed = await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY);
  expect(changed).toBeTruthy();
  expect(changed).not.toBe(initial);
  await page.reload();
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toBe(changed);
});

test('@claim:save-link a copied save link restores the exact sample state', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo/');
  await page.keyboard.press('1');
  const saved = await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY);
  await page.getByRole('button', { name: 'Copy save' }).click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).toContain('#save=');
  const linkedState = new URL(link).hash.slice('#save='.length);
  await page.evaluate((key) => localStorage.removeItem(key), DEMO_KEY);
  await page.goto(link);
  await page.reload();
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toBe(linkedState);
  expect(decodeSave(linkedState).signals).toBeGreaterThanOrEqual(decodeSave(saved!).signals);
});

test('@claim:keyboard-controls every advertised keyboard control has an observable result', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo/');
  const before = Number((await page.locator('[data-resource="signals"]').textContent())?.replace(',', ''));
  await page.keyboard.press('1');
  await expect.poll(async () => Number((await page.locator('[data-resource="signals"]').textContent())?.replace(',', ''))).toBeGreaterThan(before);
  await page.keyboard.press('4');
  await expect(page.getByRole('button', { name: /Mark the harbor charts/ })).toBeDisabled();
  await page.keyboard.press('s');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('#save=');
  await page.keyboard.press('?');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close instructions' })).toBeFocused();
});

test('@claim:no-offline-earnings closing and reopening adds no elapsed resources', async ({ page, context }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'requestAnimationFrame', { value: () => 0 });
  });
  await page.goto('/demo/');
  const saved = await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY);
  expect(saved).toBeTruthy();
  await page.close();
  const reopened = await context.newPage();
  await reopened.addInitScript(() => {
    Object.defineProperty(window, 'requestAnimationFrame', { value: () => 0 });
  });
  await reopened.goto('/demo/');
  expect(await reopened.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toBe(saved);
});

test('@claim:offline-reload the installed demo reloads without a network', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Bearing' })).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:privacy-no-commerce the demo uses only same-origin requests and has no account, ad, analytics, or purchase flow', async ({ page }) => {
  const origins = new Set<string>();
  const requestUrls: string[] = [];
  page.on('request', (request) => {
    origins.add(new URL(request.url()).origin);
    requestUrls.push(request.url());
  });
  await page.goto('/demo/');
  await page.keyboard.press('1');
  await page.getByLabel('75% to sea').check({ force: true });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect([...origins]).toEqual([new URL(page.url()).origin]);
  expect(requestUrls.join('\n')).not.toMatch(/analytics|doubleclick|stripe|dodo|login|signup/i);
  expect(await page.context().cookies()).toEqual([]);
  await expect(page.locator('form[action*="login"], form[action*="signup"], [class*="advert"], [id*="purchase"]')).toHaveCount(0);
});

test('@claim:mobile-layout the first screen and every visible control fit a 390 px phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Finish an idle story in one sitting' })).toBeVisible();
  await expect(page.getByText('For idle-game fans who want a clear ending')).toBeVisible();
  await expect(page.getByRole('link', { name: /Try it with sample data/ })).toBeVisible();
  await expect(page.getByText('Opens a working lighthouse midway through Act II.')).toBeVisible();
  await expect(page.getByText('Free; no ads or purchases')).toBeVisible();
  const facts = await page.getByText('Free; no ads or purchases').boundingBox();
  expect(facts && facts.y + facts.height).toBeLessThanOrEqual(844);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  const undersized = await page.locator('a:visible, button:visible').evaluateAll((elements) => elements
    .map((element) => ({ text: element.textContent?.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))
    .filter((box) => box.width < 44 || box.height < 44));
  expect(undersized).toEqual([]);
  await page.goto('/demo/');
  const undersizedDemo = await page.locator('a:visible, button:visible').evaluateAll((elements) => elements
    .map((element) => ({ text: element.textContent?.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))
    .filter((box) => box.width < 44 || box.height < 44));
  expect(undersizedDemo).toEqual([]);
});

test('@claim:reduced-motion reduced-motion preference removes interface movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/');
  await expect(page.locator('body')).toHaveClass(/still-waters/);
  const motion = await page.getByRole('button', { name: /Send a signal/ }).evaluate((element) => {
    const style = getComputedStyle(element);
    return { animation: style.animationName, duration: style.transitionDuration };
  });
  expect(motion.animation).toBe('none');
  expect(parseFloat(motion.duration)).toBeLessThanOrEqual(0.001);
});

test('@claim:demo-isolation reset and exit never change the real save', async ({ page }) => {
  const real = encodeSave({ ...startGame(initialState(), 100), light: 125, elapsedMs: 5000 });
  await page.goto('/');
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [REAL_KEY, real]);
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — The Last Light');
  await expect(page.getByRole('heading', { level: 2, name: 'Bearing' })).toBeVisible();
  await expect(page.locator('.field-log li')).toHaveCount(8);
  expect(await page.evaluate((key) => localStorage.getItem(key), REAL_KEY)).toBe(real);
  await page.keyboard.press('1');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), REAL_KEY)).toBe(real);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate((key) => localStorage.getItem(key), REAL_KEY)).toBe(real);
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toBeNull();
});

test('@claim:storm-duration Act III lasts exactly fifteen in-game minutes', async ({ page }) => {
  await page.goto('/demo/');
  expect(STORM_DURATION).toBe(15 * 60);
  const storm = { ...demoState(), act: 3 as const, supplies: 12, stormElapsed: 0 };
  const after = tick(storm, STORM_DURATION);
  expect(after.stormElapsed).toBe(2);
  let progressed = storm;
  for (let second = 0; second < STORM_DURATION; second += 1) progressed = tick(progressed, 1);
  expect(progressed.stormElapsed).toBe(STORM_DURATION);
});

test('@claim:generated-art the generated illustration disclosure, prompt record, and 1200×630 asset exist', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.getByText(/Generated illustration/)).toBeVisible();
  const response = await page.request.get('/assets/the-last-light-social.jpg');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/jpeg');
  expect(existsSync('assets/src/lighthouse-notebook.prompt.json')).toBe(true);
});

test('@claim:static-artifact every documented route is present in the static build', async ({ page }) => {
  await page.goto('/demo/');
  for (const path of ['dist/index.html', 'dist/demo/index.html', 'dist/privacy/index.html', 'dist/terms/index.html', 'dist/404.html']) {
    expect(existsSync(path), path).toBe(true);
  }
});

test('direct routes expose complete metadata and unknown paths remain 404', async ({ page, request }) => {
  const routes = [
    ['/', 'The Last Light — finish an idle story', 'https://one-sitting-idle.sociobot.in/'],
    ['/demo/', 'Demo — The Last Light', 'https://one-sitting-idle.sociobot.in/demo/'],
    ['/privacy/', 'Privacy — The Last Light', 'https://one-sitting-idle.sociobot.in/privacy/'],
    ['/terms/', 'Terms — The Last Light', 'https://one-sitting-idle.sociobot.in/terms/']
  ];
  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /the-last-light-social\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  }
  const missing = await request.get('/does-not-exist-review-1', { failOnStatusCode: false });
  expect(missing.status()).toBe(404);
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page missing — The Last Light');
  await expect(page.getByRole('heading', { name: 'This log page is missing' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the game' })).toBeVisible();
});

test('site navigation focuses and announces the new heading after forward and back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Privacy page loaded');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Finish an idle story in one sitting' })).toBeFocused();
});

test('all real routes have no serious accessibility errors or browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')), route).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('an impossible shared save recovers without replacing a good device save', async ({ page }) => {
  const good = encodeSave({ ...startGame(initialState(), 100), light: 5, elapsedMs: 1000 });
  await page.goto('/');
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [REAL_KEY, good]);
  const impossible = Buffer.from(JSON.stringify([1, 4, 0, 0, 0, 100, 0, 50, [], 0, 0, 0, null, false])).toString('base64url');
  await page.goto(`/#save=${impossible}`);
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Save not loaded');
  expect(await page.evaluate((key) => localStorage.getItem(key), REAL_KEY)).toBe(good);
});

test('missing assets return plain errors online and offline', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const online = await page.evaluate(async () => {
    const response = await fetch('/assets/missing-module.js');
    return { status: response.status, type: response.headers.get('content-type'), body: await response.text() };
  });
  expect([404, 503]).toContain(online.status);
  expect(online.body).not.toContain('<!doctype html>');
  await context.setOffline(true);
  const offline = await page.evaluate(async () => {
    const response = await fetch('/assets/another-missing-module.js');
    return { status: response.status, type: response.headers.get('content-type'), body: await response.text() };
  });
  expect(offline.status).toBe(503);
  expect(offline.type).toContain('text/plain');
});
