import { expect, test } from '@playwright/test';
import { getLessonQuiz } from '../src/server/quiz/bank';

test('predict mode asks before revealing each step', async ({ page }) => {
  await page.goto('/visualizer/sort-bubble');
  await page.getByRole('button', { name: /continue/i }).first().click();
  await page.getByRole('button', { name: /Predict mode off/ }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeDisabled();
  await page.getByRole('button', { name: 'Next step' }).click();
  const panel = page.getByRole('region', { name: 'Predict the next step' });
  await expect(panel).toBeVisible();
  await panel.getByRole('button').first().click();
  await expect(page.getByText(/Predictions \d\/1/)).toBeVisible();
  await page.getByRole('button', { name: 'Show the step' }).click();
  await expect(panel).toBeHidden();
  await expect(page.getByRole('group', { name: 'Playback controls' }).locator('.matrix-numeral')).toHaveText('2');
});

test('compare runs two algorithms on the same input', async ({ page }) => {
  await page.goto('/compare');
  await page.getByRole('tab', { name: 'Searching (sorted array)' }).click();
  await expect(page.getByLabel('Left')).toHaveValue('searching-linear');
  await expect(page.getByLabel('Right')).toHaveValue('searching-binary');
  await page.getByRole('button', { name: 'Worst case' }).click();
  for (let i = 0; i < 6; i += 1) await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.getByRole('heading', { name: 'Binary Search' })).toBeVisible();
  await expect(page.getByText(/finished in \d+ steps/)).toBeVisible();
  await expect(page).toHaveURL(/a=searching-linear&b=searching-binary/);
});

test('missed quiz questions are queued for review', async ({ page }) => {
  await page.goto('/dashboard');
  const quiz = getLessonQuiz('array-traversal')!;
  const answers = quiz.questions.map((q) => ({ questionId: q.id, choiceIndex: (q.correctAnswer + 1) % q.options.length }));
  const submit = await page.request.post('/api/quiz/submit', { headers: { 'X-Noirly-CSRF': '1' }, data: { lessonId: 'array-traversal', answers } });
  expect((await submit.json()).passed).toBe(false);
  const review = await (await page.request.get('/api/review')).json();
  expect(review.total).toBeGreaterThanOrEqual(quiz.questions.length);
  expect(review.dueCount).toBe(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();
  await expect(page.getByText(/next tomorrow/)).toBeVisible();
});

test('progress can be exported as JSON', async ({ page }) => {
  await page.goto('/settings');
  const response = await page.request.get('/api/progress/export');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-disposition']).toMatch(/attachment; filename="noirly-algolab-progress-/);
  const body = await response.json();
  expect(body.app).toBe('Noirly AlgoLab');
  expect(Array.isArray(body.curriculum.completedLessons)).toBe(true);
  await expect(page.getByRole('link', { name: /Download my progress/ })).toHaveAttribute('href', '/api/progress/export');
});

test('the header offers palettes like Noirly Flow, without a search box or app switcher', async ({ page }) => {
  await page.goto('/dashboard');
  const banner = page.getByRole('banner');
  await expect(banner.getByRole('button', { name: 'Open command palette' })).toHaveCount(0);
  await expect(banner.getByRole('button', { name: 'Noirly apps' })).toHaveCount(0);
  await banner.getByRole('button', { name: 'Choose color palette' }).click();
  await page.getByRole('radio', { name: 'Ocean Blue' }).click();
  await banner.getByRole('button', { name: 'Choose color palette' }).click();
  await expect(page.getByRole('radio', { name: 'Ocean Blue' })).toHaveAttribute('aria-checked', 'true');
  // The sidebar search and Ctrl K still open the command palette.
  await expect(page.getByRole('button', { name: 'Search lessons' })).toBeVisible();
});

test('the learning path is staged: Beginner in every track first', async ({ page }) => {
  await page.goto('/learn-path');
  const beginner = page.getByRole('listitem', { name: 'Stage 1: Beginner' });
  const intermediate = page.getByRole('listitem', { name: 'Stage 2: Intermediate' });
  await expect(beginner.getByText('Current stage')).toBeVisible();
  await expect(intermediate.getByText('Unlocks after Beginner')).toBeVisible();
  // Beginner topics of all three tracks are on the same stage.
  for (const topic of ['Arrays', 'Sorting', 'Two Pointers']) await expect(beginner.getByText(topic, { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Full path' })).toHaveAttribute('aria-current', 'page');
  await page.goto('/learn-path?track=algorithms');
  await expect(page.getByRole('button', { name: /^Intermediate/ })).toBeDisabled();
  await expect(page.getByText('Opens after the Beginner core in every track').first()).toBeVisible();
  // Patterns stops at Intermediate: no empty, never-opening Advanced card.
  await page.goto('/learn-path?track=patterns');
  await expect(page.getByRole('button', { name: /^Intermediate/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Advanced/ })).toHaveCount(0);
});
