import { expect, test } from '@playwright/test';

test('renders the shared case viewer in split mode', async ({ page }) => {
  await page.goto('/case/?cid=2010');

  await expect(page.locator('.case-title')).toHaveText('案例预览');
  await expect(page.getByRole('link', { name: '返回案例首页' })).toHaveAttribute('href', '../');
  await expect(page.locator('#case-app')).toHaveAttribute('data-layout', 'split');
  await expect(page.getByRole('button', { name: '同时显示代码和预览' })).toHaveCSS(
    'border-top-width',
    '0px',
  );
  await expect(page.getByRole('button', { name: '分享案例' })).toHaveCSS('border-top-width', '0px');
  await expect(page.locator('.code-panel')).toBeVisible();
  await expect(page.locator('.preview-panel')).toBeVisible();
  await expect(page.locator('#preview-frame')).toHaveAttribute('src', /\/cases\/xqclip\/$/);
  await expect(page.locator('#source-code')).toContainText('<!DOCTYPE html>');
  await expect(page).toHaveURL(/\/case\/\?cid=2010$/);
});

test('returns to the catalog from the case title', async ({ page }) => {
  await page.goto('/case/?cid=2001');
  await page.getByRole('link', { name: '返回案例首页' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4011/');
});

test('switches between code, preview and split layouts without reloading the frame', async ({
  page,
}) => {
  await page.goto('/case/?cid=2001');
  const frame = page.locator('#preview-frame');
  await expect(frame).toHaveAttribute('src', /\/cases\/chart\/$/);
  const initialSource = await frame.getAttribute('src');

  await page.getByRole('button', { name: '仅显示代码' }).click();
  await expect(page.locator('#case-app')).toHaveAttribute('data-layout', 'code');
  await expect(page.locator('.code-panel')).toBeVisible();
  await expect(page.locator('.preview-panel')).toBeHidden();

  await page.getByRole('button', { name: '仅显示预览' }).click();
  await expect(page.locator('#case-app')).toHaveAttribute('data-layout', 'preview');
  await expect(page.locator('.code-panel')).toBeHidden();
  await expect(page.locator('.preview-panel')).toBeVisible();

  await page.getByRole('button', { name: '同时显示代码和预览' }).click();
  await expect(page.locator('#case-app')).toHaveAttribute('data-layout', 'split');
  await expect(page.locator('.code-panel')).toBeVisible();
  await expect(page.locator('.preview-panel')).toBeVisible();
  await expect(frame).toHaveAttribute('src', initialSource ?? '');
});

test('shows HTML, CSS and JS sources and reports unreadable external files', async ({ page }) => {
  await page.goto('/case/?cid=2010');
  await expect(page.locator('#source-code')).toContainText('<!DOCTYPE html>');

  await page.getByRole('tab', { name: 'CSS' }).click();
  await expect(page.locator('#source-code')).toContainText('css/demo.css');
  await expect(page.locator('#source-code')).toContainText('External stylesheet');
  await expect(page.locator('#source-code')).toContainText('clip.min.css');

  await page.getByRole('tab', { name: 'JS' }).click();
  await expect(page.locator('#source-code')).toContainText('js/demo.js');
  await expect(page.locator('#source-code')).toContainText('External script');
  await expect(page.locator('#source-code')).toContainText('clip.min.js');
});

test('shows an empty CSS state for cases with only inline styles', async ({ page }) => {
  await page.goto('/case/?cid=2001');
  await page.getByRole('tab', { name: 'CSS' }).click();
  await expect(page.locator('#source-empty')).toContainText('没有独立 CSS');
});

test('keeps source errors isolated from the live preview', async ({ page }) => {
  await page.route('**/cases/xqclip/css/demo.css', (route) => route.abort('failed'));
  await page.goto('/case/?cid=2010');
  await page.getByRole('tab', { name: 'CSS' }).click();
  await expect(page.locator('#source-code')).toContainText('Unable to load');
  await expect(page.locator('#preview-frame')).toBeVisible();
});

test('opens the share dialog with a QR code and copies the case link', async ({ page }) => {
  await page.goto('/case/?cid=2001');
  await page.getByRole('button', { name: '分享案例' }).click();

  const dialog = page.locator('#share-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#share-url')).toHaveText(/\/case\/\?cid=2001$/);
  const qrHasPixels = await page.locator('#share-qr').evaluate((element) => {
    const canvas = /** @type {HTMLCanvasElement} */ (element);
    const context = canvas.getContext('2d');
    if (!context) {
      return false;
    }
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    return data.some((channel, index) => index % 4 !== 3 && channel < 128);
  });
  expect(qrHasPixels).toBe(true);

  await page.locator('#copy-link').click();
  await expect(page.locator('#copy-feedback')).toContainText('已复制案例链接');
});

test('rejects missing, malformed and non-case ids', async ({ page }) => {
  await page.goto('/case/');
  await expect(page.locator('#case-error')).toBeVisible();
  await expect(page.locator('#case-error-message')).toHaveText('案例参数无效');

  await page.goto('/case/?cid=1001');
  await expect(page.locator('#case-error')).toBeVisible();
  await expect(page.locator('#case-error-message')).toHaveText('该案例不支持统一预览');
});
