import { expect, test } from '@playwright/test';

test.describe('signed out', () => {
  test('landing offers Noirly Login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Watch them think');
    await expect(page.getByRole('button', { name: 'Noirly Login' }).first()).toBeVisible();
  });

  for (const path of ['/dashboard', '/learn-path', '/visualizer/array-reverse', '/progress', '/settings']) {
    test(`${path} redirects to /login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`/login\\?next=${encodeURIComponent(path)}`));
      await expect(page.getByRole('button', { name: 'Noirly Login' })).toBeVisible();
    });
  }

  test('Noirly Login opens Identity in a popup and waits for it', async ({ page }) => {
    await page.goto('/login?next=%2Fprogress');
    const started = page.context().waitForEvent('request', (r) => r.url().includes('/login/popup?next=%2Fprogress'));
    const popupOpened = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Noirly Login' }).click();
    await started;
    const popup = await popupOpened;
    await expect(page.getByRole('status').filter({ hasText: 'Waiting for Identity' })).toBeVisible();
    await popup.close();
    await expect(page.getByRole('button', { name: 'Noirly Login' })).toBeEnabled();
  });

  test('a finished popup sends the opener on to its next page', async ({ page }) => {
    await page.goto('/login?next=%2Fprivacy');
    await expect(page.getByRole('button', { name: 'Noirly Login' })).toBeVisible();
    // What Identity's redirect lands on after a successful sign-in.
    await page.evaluate(() => window.open('/login/popup-complete?next=%2Fprivacy', 'noirly-identity'));
    await expect(page).toHaveURL(/\/privacy$/);
  });

  test('a refused sign-in in the popup is shown on the page that opened it', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Noirly Login' })).toBeVisible();
    const popupOpened = page.waitForEvent('popup');
    await page.evaluate(() => window.open('/login?error=already_linked', 'noirly-identity'));
    const popup = await popupOpened;
    await popup.waitForEvent('close');
    await expect(page.getByRole('alert').filter({ hasText: 'linked to a different Noirly account' })).toBeVisible();
  });

  test('the Visual Lab stays public', async ({ page }) => {
    await page.goto('/visual-lab');
    await expect(page.getByRole('heading', { name: 'Visual Lab', level: 1 })).toBeVisible();
    await page.getByRole('link', { name: 'Bubble Sort' }).click();
    await expect(page).toHaveURL(/\/visual-lab\/bubble-sort/);
  });

  test('privacy policy is public', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy policy' })).toBeVisible();
  });

  test('API mutations need the CSRF header and a session', async ({ request }) => {
    const noHeader = await request.post('/api/progress/complete', { data: { lessonId: 'array-traversal' } });
    expect(noHeader.status()).toBe(403);
    const noSession = await request.post('/api/progress/complete', {
      data: { lessonId: 'array-traversal' },
      headers: { 'X-Noirly-CSRF': '1' },
    });
    expect(noSession.status()).toBe(401);
  });

  test('pages send a CSP with a nonce', async ({ request }) => {
    const response = await request.get('/');
    expect(response.headers()['content-security-policy']).toMatch(/script-src 'self' 'nonce-/);
    expect(response.headers()['x-frame-options']).toBe('DENY');
  });
});
