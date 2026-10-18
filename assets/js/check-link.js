// @ts-check

import { fetchCatalog, readCatalogCache } from './catalog-store.js';
import { resolveExternalTarget } from './link-target.js';

const siteRootUrl = new URL('../../', window.location.href);
const catalogUrl = new URL('assets/mock/list.min.json', siteRootUrl);

const targetHost = document.getElementById('target-host');
const targetUrl = document.getElementById('target-url');
const safeContent = document.getElementById('safe-content');
const safeError = document.getElementById('safe-error');
const continueButton = document.getElementById('continue-button');
const backLink = document.getElementById('back-link');
const loading = document.getElementById('safe-loading');

if (backLink instanceof HTMLAnchorElement) {
  backLink.href = siteRootUrl.href;
}

/**
 * @param {number} cid
 * @returns {Promise<import('./catalog-utils.js').CatalogCase | null>}
 */
async function getCatalogItem(cid) {
  const cached = await readCatalogCache();
  const cachedItem = cached?.payload.list.find((item) => item.cid === cid);
  if (cachedItem) {
    return cachedItem;
  }
  const payload = await fetchCatalog(catalogUrl);
  return payload.list.find((item) => item.cid === cid) ?? null;
}

async function initialize() {
  const cidValue = new URLSearchParams(window.location.search).get('cid') ?? '';
  if (!/^\d{4}$/.test(cidValue)) {
    throw new Error('链接参数无效');
  }

  const item = await getCatalogItem(Number(cidValue));
  if (!item) {
    throw new Error('未找到对应案例');
  }
  const target = resolveExternalTarget(item.href, new URL(window.location.href));

  if (targetHost) {
    targetHost.textContent = target.host;
  }
  if (targetUrl) {
    targetUrl.textContent = target.href;
  }
  if (continueButton instanceof HTMLButtonElement) {
    continueButton.disabled = false;
    continueButton.addEventListener('click', () => window.location.assign(target.href));
  }
  if (safeContent) {
    safeContent.hidden = false;
  }
  if (loading) {
    loading.hidden = true;
  }
}

initialize().catch((error) => {
  if (loading) {
    loading.hidden = true;
  }
  if (safeError) {
    safeError.hidden = false;
    safeError.textContent = error instanceof Error ? error.message : '链接校验失败';
  }
});
