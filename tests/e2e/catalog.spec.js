import { expect, test } from '@playwright/test';

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

test('loads the catalog, renders 91 cases, and writes IndexedDB cache', async ({ page }) => {
  /** @type {string[]} */
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText('91');
  await expect(page.locator('#catalog-sections .catalog-section')).toHaveCount(5);
  await expect(page.locator('.catalog-card')).toHaveCount(91);
  await expect.poll(() => readCachedRevision(page)).toMatch(/^[a-f0-9]{12}$/);
  expect(errors).toEqual([]);
});

test('keeps the catalog grid at no more than five columns', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText('91');
  const columns = await page
    .locator('#catalog-sections .catalog-grid')
    .first()
    .evaluate(
      (element) =>
        (
          element.ownerDocument.defaultView?.getComputedStyle(element).gridTemplateColumns ?? ''
        ).split(/\s+/).length,
    );

  expect(columns).toBeLessThanOrEqual(5);
  expect(columns).toBe(isMobile ? 1 : 5);
});

test('filters the in-memory catalog without another network request', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText('91');

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
  await expect(page.locator('#count')).toHaveText('91');
  await page.locator('#search-input').pressSequentially('canvas chart', { delay: 20 });
  await expect(page.locator('#search-input')).toHaveValue('canvas chart');
  await expect(page).toHaveURL(/q=canvas\+chart/);
});

test('uses cache immediately while refreshing the network catalog', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText('91');
  await expect.poll(() => readCachedRevision(page)).toMatch(/^[a-f0-9]{12}$/);

  await page.route('**/assets/mock/list.min.json', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });

  const startedAt = Date.now();
  await page.reload();
  await expect(page.locator('#count')).toHaveText('91');
  expect(Date.now() - startedAt).toBeLessThan(1_500);
  await expect(page.locator('#catalog-status')).toBeHidden();
});

test('keeps the cached catalog searchable when the catalog request fails', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText('91');
  await page.route('**/assets/mock/list.min.json', (route) => route.abort('failed'));
  await page.reload();
  await expect(page.locator('#count')).toHaveText('91');
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

test('rejects arbitrary URL parameters on the confirmation page', async ({ page }) => {
  await page.goto('/link/check/?url=https%3A%2F%2Fexample.com');
  await expect(page.locator('#safe-error')).toContainText('链接参数无效');
});

test('opens and closes the mobile navigation with the keyboard', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only behavior');
  await page.goto('/');
  await expect(page.locator('#count')).toHaveText('91');
  await page.locator('#nav-toggle').click();
  await expect(page.locator('#site-nav')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#nav-exit')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#site-nav')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#nav-toggle')).toBeFocused();
});
