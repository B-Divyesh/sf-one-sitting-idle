import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('cover starts a keyboard-playable, locally saved game', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page).toHaveTitle(/The Last Light/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('button', { name: /Open the keeper's log/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('cover.png'), fullPage: true });

  const coverAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(coverAxe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);

  await page.getByRole('button', { name: /Open the keeper's log/ }).click();
  await expect(page.getByRole('heading', { name: 'Kindle' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('act-one.png'), fullPage: true });
  await page.keyboard.press('1');
  await expect(page.locator('[data-resource="light"]')).toHaveText('5.0');
  const save = await page.evaluate(() => localStorage.getItem('last-light-save-v1'));
  expect(save).toBeTruthy();

  const gameAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(gameAxe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('later chapters expose their distinct controls and ending', async ({ page }) => {
  const urlFor = (act: 2 | 3 | 4, finished = false) => {
    const packed = [1, act, 5000, act >= 2 ? 900 : 0, act >= 3 ? 20 : 0, 78, act >= 3 ? 360 : 0, 75,
      ['wick', 'weight', 'lens', 'pump'], 1_860_000, 120, 4, 1_777_000_000_000, finished];
    return `/?chapter=${act}#save=${Buffer.from(JSON.stringify(packed)).toString('base64url')}`;
  };

  await page.goto(urlFor(2));
  await expect(page.getByRole('heading', { name: 'Bearing' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Beam allocation' })).toBeVisible();
  await expect(page.getByLabel('75% to sea')).toBeChecked();

  await page.goto(urlFor(3));
  await expect(page.getByRole('heading', { name: 'Weather' })).toBeVisible();
  await expect(page.getByText('Storm passage')).toBeVisible();
  await expect(page.getByRole('button', { name: /Brace the light/ })).toBeVisible();

  await page.goto(urlFor(4, true));
  await expect(page.getByRole('heading', { name: 'The horizon answers.' })).toBeVisible();
  await expect(page.getByText('Time to finish')).toBeVisible();
});

test('legal pages and invalid save state are useful', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms' })).toBeVisible();
  await page.goto('/#save=broken');
  await expect(page.getByRole('alert')).toContainText('Save not loaded');
  await expect(page.getByRole('button', { name: /Open the keeper's log/ })).toBeEnabled();
});
