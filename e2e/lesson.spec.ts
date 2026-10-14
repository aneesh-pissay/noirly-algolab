import { expect, test, type Page } from '@playwright/test';
import { getLessonQuiz } from '../src/server/quiz/bank';

async function openVisualize(page: Page, path = '/visualizer/array-reverse') {
  await page.goto(path);
  await page.getByRole('tab', { name: /Theory/ }).waitFor();
  // Theory first: its continue button unlocks the visualizer tab.
  await page.getByRole('button', { name: /continue|visualize/i }).first().click();
  await expect(page.getByRole('tab', { name: /Visualize/ })).toHaveAttribute('aria-selected', 'true');
}

function stepCounter(page: Page) {
  return page.getByRole('group', { name: 'Playback controls' }).locator('.matrix-numeral');
}

test('runs the visualizer on custom input', async ({ page }) => {
  await openVisualize(page);
  await page.getByRole('textbox', { name: /^Array/ }).fill('4, 9, 2');
  await page.getByRole('button', { name: 'Run' }).click();
  await expect(page.getByRole('list', { name: 'Array' }).getByRole('listitem')).toHaveCount(3);
  await expect(page.getByText('Your input')).toBeVisible();
});

test('rejects invalid custom input', async ({ page }) => {
  await openVisualize(page);
  await page.getByRole('textbox', { name: /^Array/ }).fill('1, two, 3');
  await page.getByRole('button', { name: 'Run' }).click();
  await expect(page.getByRole('form', { name: 'Custom input' }).getByRole('alert')).toContainText('whole numbers');
});

test('keyboard shortcuts step, reset and switch tabs', async ({ page }) => {
  await openVisualize(page);
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await expect(stepCounter(page)).toHaveText('1');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(stepCounter(page)).toHaveText('3');
  await page.keyboard.press('r');
  await expect(stepCounter(page)).toHaveText('1');
  await page.keyboard.press('1');
  await expect(page.getByRole('tab', { name: /Theory/ })).toHaveAttribute('aria-selected', 'true');
});

test('a shared link restores the input and step', async ({ page }) => {
  await openVisualize(page);
  await page.getByRole('textbox', { name: /^Array/ }).fill('7, 1, 5, 3');
  await page.getByRole('button', { name: 'Run' }).click();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Share this step' }).click();
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(url).toMatch(/step=3/);

  await page.goto(url);
  await expect(page.getByRole('tab', { name: /Visualize/ })).toHaveAttribute('aria-selected', 'true');
  await expect(stepCounter(page)).toHaveText('3');
  await expect(page.getByRole('list', { name: 'Array' }).getByRole('listitem')).toHaveCount(4);
});

test('command palette jumps to a lesson', async ({ page }) => {
  await page.goto('/dashboard');
  await page.keyboard.press('Control+K');
  await page.getByPlaceholder(/Search/).fill('Dijkstra Pattern');
  await page.getByRole('option', { name: /Dijkstra Pattern/ }).click();
  await expect(page).toHaveURL(/\/visualizer\/pat-dijkstra/);
  await expect(page.getByRole('heading', { level: 1, name: 'Dijkstra Pattern' })).toBeVisible();
});

test('old algorithm-id links redirect to the lesson', async ({ page }) => {
  // 'array-insert-element' is an algorithm id; its lesson id is 'array-insert'.
  await page.goto('/visualizer/array-insert-element');
  await expect(page).toHaveURL(/\/visualizer\/array-insert$/);
  await expect(page.getByRole('tab', { name: /Theory/ })).toBeVisible();
});

test('the quiz is graded by the server and completes the lesson', async ({ page }) => {
  const first = '/visualizer/array-traversal';
  await openVisualize(page, first);
  await page.getByRole('button', { name: 'Next step' }).waitFor();
  const total = Number((await page.getByRole('progressbar', { name: 'Visualization progress' }).getAttribute('aria-valuemax')) ?? 0);
  for (let i = 1; i < total; i += 1) await page.keyboard.press('ArrowRight');
  await page.getByRole('button', { name: /Go to quiz/i }).click();

  // The page never receives the answers; the test reads them from the
  // server-side quiz bank.
  const quiz = await page.request.get('/api/quiz/array-traversal');
  expect(JSON.stringify(await quiz.json())).not.toMatch(/correctAnswer|explanation/);
  const questions = getLessonQuiz('array-traversal')!.questions;
  for (const [i, question] of questions.entries()) {
    await page.getByRole('radio', { name: question.options[question.correctAnswer], exact: true }).check({ force: true });
    if (i < questions.length - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Submit answers' }).click();
  await expect(page.getByRole('heading', { name: 'Quiz passed' })).toBeVisible();
  await page.getByRole('button', { name: 'Complete lesson' }).click();
  await expect(page.getByRole('dialog', { name: 'Lesson complete' })).toBeVisible();
});

test('completing a locked lesson is refused', async ({ page }) => {
  await page.goto('/dashboard');
  const response = await page.request.post('/api/progress/complete', {
    headers: { 'X-Noirly-CSRF': '1' },
    data: { lessonId: 'array-histogram', quizScore: 100 },
  });
  expect(response.status()).toBe(403);
});
