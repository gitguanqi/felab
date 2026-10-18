import { expect, test } from '@playwright/test';

const EXPECTED_CASE_COUNT = '98';

/** @param {import('@playwright/test').Page} page */
async function readCachedRevision(page) {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const request = globalThis.indexedDB.open('felab', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result;
          const transaction = database.transaction('catalog', 'readonly');
          const getRequest = transaction.objectStore('catalog').get('catalog');
          getRequest.onerror = () => reject(getRequest.error);
          getRequest.onsuccess = () => resolve(getRequest.result?.revision ?? null);
        };
      }),
  );
}

test(`loads the catalog, renders ${EXPECTED_CASE_COUNT} cases, and writes IndexedDB cache`, async ({
  page,
}) => {
  /** @type {string[]} */
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);
  await expect(page.locator('#catalog-sections .catalog-section')).toHaveCount(6);
  await expect(page.locator('.catalog-card')).toHaveCount(Number(EXPECTED_CASE_COUNT));
  await expect(page.locator('.catalog-card-media').first()).toHaveCSS(
    'background-image',
    /linear-gradient/,
  );
  await expect.poll(() => readCachedRevision(page)).toMatch(/^[a-f0-9]{12}$/);
  expect(errors).toEqual([]);
});

test('keeps the catalog grid at no more than four columns', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);
  const columns = await page
    .locator('#catalog-sections .catalog-grid')
    .first()
    .evaluate(
      (element) =>
        (
          element.ownerDocument.defaultView?.getComputedStyle(element).gridTemplateColumns ?? ''
        ).split(/\s+/).length,
    );

  expect(columns).toBeLessThanOrEqual(4);
  expect(columns).toBe(isMobile ? 1 : 4);
});

test('filters the in-memory catalog without another network request', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);

  let catalogRequests = 0;
  page.on('request', (request) => {
    if (request.url().endsWith('/assets/mock/list.min.json')) {
      catalogRequests += 1;
    }
  });

  await page.locator('#search-input').fill('canvas');
  await expect(page.locator('#search-section')).toBeVisible();
  await expect(page.locator('#search-list .catalog-card')).not.toHaveCount(0);
  expect(catalogRequests).toBe(0);
  await expect(page).toHaveURL(/q=canvas/);
});

test('preserves spaces while typing multi-word searches', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);
  await page.locator('#search-input').pressSequentially('canvas chart', { delay: 20 });
  await expect(page.locator('#search-input')).toHaveValue('canvas chart');
  await expect(page).toHaveURL(/q=canvas\+chart/);
});

test('uses cache immediately while refreshing the network catalog', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);
  await expect.poll(() => readCachedRevision(page)).toMatch(/^[a-f0-9]{12}$/);

  await page.route('**/assets/mock/list.min.json', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });

  const startedAt = Date.now();
  await page.reload();
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);
  expect(Date.now() - startedAt).toBeLessThan(1_500);
  await expect(page.locator('#catalog-status')).toBeHidden();
});

test('keeps the cached catalog searchable when the catalog request fails', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);
  await page.route('**/assets/mock/list.min.json', (route) => route.abort('failed'));
  await page.reload();
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);
  await expect(page.locator('#catalog-status')).toContainText('本地缓存');
  await page.locator('#search-input').fill('canvas');
  await expect(page.locator('#search-list .catalog-card')).not.toHaveCount(0);
});

test('validates external links by cid without redirecting automatically', async ({ page }) => {
  await page.goto('/link/check/?cid=2008');
  await expect(page.locator('#safe-content')).toBeVisible();
  await expect(page.locator('#target-host')).toHaveText('codepen.io');
  await expect(page.locator('#continue-button')).toBeEnabled();
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/link\/check\/\?cid=2008$/);
});

test('renders all AI category cases', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#category-ai');
  await expect(section).toBeVisible();
  await expect(section.locator('.catalog-card')).toHaveCount(7);
  await expect(section.locator('.catalog-card-title')).toHaveText([
    '推箱子',
    'CertUtil 哈希工具',
    'Canvas 时钟（新版）',
    '终端四剑客',
    'AI 编程 Agent 图鉴',
    '推箱子 2',
    '霓虹贪吃蛇',
  ]);
  await expect(section.locator('.catalog-card-link').first()).toHaveAttribute(
    'href',
    /\/cases\/pushbox\/$/,
  );
  await expect(section.locator('h2 .felab')).toHaveClass(/felab-code/);
});

test('validates outlink parameters and confirms before navigating', async ({ page }) => {
  await page.route('https://example.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>External target</title>',
    }),
  );

  const outlink = encodeURIComponent('https://example.com/path');
  await page.goto(`/link/check/?outlink=${outlink}`);
  const continueButton = page.locator('#continue-button');
  await expect(page.locator('#safe-content')).toBeVisible();
  await expect(page.locator('#target-host')).toHaveText('example.com');
  await expect(page.locator('#target-url')).toHaveText('https://example.com/path');
  await expect(continueButton).toBeEnabled();
  await expect(continueButton).toHaveCSS('border-top-style', 'solid');
  await expect(continueButton).toHaveCSS('cursor', 'pointer');
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/link\/check\/\?outlink=/);

  await continueButton.hover();
  await continueButton.click();
  await expect(page).toHaveURL('https://example.com/path');
});

test('rejects arbitrary URL parameters on the confirmation page', async ({ page }) => {
  await page.goto('/link/check/?url=https%3A%2F%2Fexample.com');
  await expect(page.locator('#safe-error')).toContainText('链接参数无效');
});

test('rejects conflicting and unsafe outlink parameters', async ({ page }) => {
  const outlink = encodeURIComponent('https://example.com');
  await page.goto(`/link/check/?cid=2008&outlink=${outlink}`);
  await expect(page.locator('#safe-error')).toContainText('链接参数冲突');

  await page.goto('/link/check/?outlink=javascript%3Aalert(1)');
  await expect(page.locator('#safe-error')).toContainText('仅允许 HTTP 或 HTTPS 外链');
});

test('opens and closes the mobile navigation with the keyboard', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only behavior');
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText(EXPECTED_CASE_COUNT);
  await page.locator('#nav-toggle').click();
  await expect(page.locator('#site-nav')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#nav-exit')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#site-nav')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#nav-toggle')).toBeFocused();
});
