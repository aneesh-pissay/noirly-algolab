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
