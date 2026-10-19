// @ts-check

import { fetchCatalog, readCatalogCache } from './catalog-store.js';
import { loadCaseSource, normalizeCasePageUrl } from './case-source.js';
import { isLocalCaseHref, resolveLocalTarget } from './link-target.js';

/**
 * @typedef {import('./catalog-utils.js').CatalogCase} CatalogCase
 * @typedef {'html' | 'css' | 'js'} SourceTab
 * @typedef {'code' | 'preview' | 'split'} LayoutMode
 * @typedef {Object} QrCode
 * @property {(data: string) => void} addData
 * @property {() => void} make
 * @property {() => number} getModuleCount
 * @property {(row: number, column: number) => boolean} isDark
 * @typedef {(typeNumber: number, errorCorrectionLevel: string) => QrCode} QrFactory
 */

const SITE_ROOT_URL = new URL('../../', import.meta.url);
const CATALOG_URL = new URL('../mock/list.min.json', import.meta.url);
const SUPPORTED_SEARCH_PARAMS = new Set(['cid']);

/**
 * @template {Element} T
 * @param {string} id
 * @param {new () => T} constructor
 * @returns {T}
 */
function getElement(id, constructor) {
  const element = document.getElementById(id);
  if (!(element instanceof constructor)) {
    throw new Error(`Missing required element: #${id}`);
  }
  return element;
}

/**
 * @param {string} selector
 * @returns {HTMLButtonElement[]}
 */
function getButtons(selector) {
  return [...document.querySelectorAll(selector)].filter(
    (element) => element instanceof HTMLButtonElement,
  );
}

const app = getElement('case-app', HTMLElement);
const failureState = getElement('case-error', HTMLElement);
const errorMessage = getElement('case-error-message', HTMLElement);
const homeLink = getElement('case-home-link', HTMLAnchorElement);
const layoutButtons = getButtons('button[data-layout-value]');
const sourceTabs = getButtons('button[data-source-tab]');
const sourceStatus = getElement('source-status', HTMLElement);
const sourceCode = getElement('source-code', HTMLElement);
const lineNumbers = getElement('line-numbers', HTMLElement);
const codeScroll = getElement('code-scroll', HTMLElement);
const sourceEmpty = getElement('source-empty', HTMLElement);
const previewFrame = getElement('preview-frame', HTMLIFrameElement);
const previewShell = getElement('preview-shell', HTMLElement);
const openCaseLink = getElement('open-case-link', HTMLAnchorElement);
const shareButton = getElement('share-button', HTMLButtonElement);
const shareDialog = getElement('share-dialog', HTMLDialogElement);
const shareClose = getElement('share-close', HTMLButtonElement);
const shareUrl = getElement('share-url', HTMLElement);
const shareQr = getElement('share-qr', HTMLCanvasElement);
const copyLinkButton = getElement('copy-link', HTMLButtonElement);
const copyFeedback = getElement('copy-feedback', HTMLElement);

/** @type {CatalogCase | null} */
let currentCase = null;
/** @type {import('./case-source.js').CaseSource | null} */
let currentSource = null;
/** @type {SourceTab} */
let activeSourceTab = 'html';
/** @type {LayoutMode} */
let activeLayout = 'split';
/** @type {string} */
let caseDetailUrl = '';
/** @type {ReturnType<typeof setTimeout> | undefined} */
let copyFeedbackTimer;

const qrWindow = /** @type {Window & { qrcode?: QrFactory }} */ (window);

homeLink.href = SITE_ROOT_URL.href;

/**
 * @param {LayoutMode} layout
 */
function setLayout(layout) {
  activeLayout = layout;
  app.dataset.layout = layout;
  for (const button of layoutButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.layoutValue === layout));
  }
}

/**
 * @param {SourceTab} tab
 */
function setSourceTab(tab) {
  activeSourceTab = tab;
  for (const button of sourceTabs) {
    button.setAttribute('aria-selected', String(button.dataset.sourceTab === tab));
  }
  renderSource();
}

function renderSource() {
  if (!currentSource) {
    sourceCode.textContent = '';
    lineNumbers.textContent = '';
    codeScroll.hidden = true;
    sourceEmpty.hidden = false;
    return;
  }

  const source = currentSource[activeSourceTab];
  sourceCode.textContent = source;
  lineNumbers.textContent = source
    ? Array.from({ length: source.split('\n').length }, (_, index) => index + 1).join('\n')
    : '';
  codeScroll.hidden = source.length === 0;
  sourceEmpty.hidden = source.length > 0;
  sourceEmpty.textContent =
    activeSourceTab === 'css'
      ? '当前案例没有独立 CSS，样式可能直接写在 HTML 中。'
      : activeSourceTab === 'js'
        ? '当前案例没有独立 JS，脚本可能直接写在 HTML 中。'
        : '当前案例没有可展示的 HTML 源码。';
}

/**
 * @param {string} message
 */
function showError(message) {
  app.hidden = true;
  failureState.hidden = false;
  errorMessage.textContent = message;
  shareButton.disabled = true;
}

/**
 * @param {number} cid
 * @returns {Promise<CatalogCase | null>}
 */
async function getCatalogItem(cid) {
  const cached = await readCatalogCache();
  const cachedItem = cached?.payload.list.find((item) => item.cid === cid);
  if (cachedItem) {
    return cachedItem;
  }
  const payload = await fetchCatalog(CATALOG_URL);
  return payload.list.find((item) => item.cid === cid) ?? null;
}

/**
 * @returns {number}
 */
function readCid() {
  const params = new URLSearchParams(window.location.search);
  for (const key of params.keys()) {
    if (!SUPPORTED_SEARCH_PARAMS.has(key)) {
      throw new Error('案例参数无效');
    }
  }
  const cidValue = params.get('cid');
  if (!cidValue || !/^\d{4}$/.test(cidValue)) {
    throw new Error('案例参数无效');
  }
  return Number(cidValue);
}

/**
 * @param {number} cid
 * @returns {string}
 */
function buildCaseDetailUrl(cid) {
  const url = new URL('case/', SITE_ROOT_URL);
  url.searchParams.set('cid', String(cid));
  return url.href;
}

/**
 * @param {string} text
 */
function drawQrCode(text) {
  if (!qrWindow.qrcode) {
    throw new Error('二维码组件未加载');
  }
  const qr = qrWindow.qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const moduleCount = qr.getModuleCount();
  const quietZone = 4;
  const scale = 6;
  const size = (moduleCount + quietZone * 2) * scale;
  const context = shareQr.getContext('2d');
  if (!context) {
    throw new Error('二维码画布不可用');
  }

  shareQr.width = size;
  shareQr.height = size;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);
  context.fillStyle = '#16212b';
  for (let row = 0; row < moduleCount; row += 1) {
    for (let column = 0; column < moduleCount; column += 1) {
      if (qr.isDark(row, column)) {
        context.fillRect((column + quietZone) * scale, (row + quietZone) * scale, scale, scale);
      }
    }
  }
}

/**
 * @param {string} text
 */
async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back for browsers that expose Clipboard API without write permission.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) {
    throw new Error('浏览器不支持自动复制');
  }
}

/**
 * @param {string} message
 * @param {boolean} [isError]
 */
function showCopyFeedback(message, isError = false) {
  globalThis.clearTimeout(copyFeedbackTimer);
  copyFeedback.textContent = message;
  copyFeedback.dataset.tone = isError ? 'error' : 'success';
  copyFeedback.hidden = false;
  copyFeedbackTimer = globalThis.setTimeout(() => {
    copyFeedback.hidden = true;
  }, 1800);
}

/**
 * @param {CatalogCase} item
 */
function renderCase(item) {
  const detailUrl = buildCaseDetailUrl(item.cid);
  const entryUrl = normalizeCasePageUrl(resolveLocalTarget(item.href, SITE_ROOT_URL));

  caseDetailUrl = detailUrl;
  document.title = `${item.name} - 案例预览`;
  window.history.replaceState(null, '', detailUrl);
  shareUrl.textContent = detailUrl;
  previewFrame.title = `${item.name} 预览`;
  previewFrame.src = entryUrl.href;
  openCaseLink.href = entryUrl.href;
  openCaseLink.title = `打开 ${item.name}`;
  shareButton.disabled = false;

  loadCaseSource(entryUrl)
    .then((source) => {
      currentSource = source;
      sourceStatus.textContent = '';
      renderSource();
    })
    .catch((error) => {
      sourceStatus.textContent = '源码读取失败';
      sourceEmpty.textContent =
        error instanceof Error ? error.message : '案例源码暂时无法读取，预览仍可继续使用。';
    });
}

async function initialize() {
  try {
    const cid = readCid();
    const item = await getCatalogItem(cid);
    if (!item) {
      throw new Error('未找到对应案例');
    }
    if (!isLocalCaseHref(item.href)) {
      throw new Error('该案例不支持统一预览');
    }
    currentCase = item;
    renderCase(item);
  } catch (error) {
    showError(error instanceof Error ? error.message : '案例加载失败');
  }
}

for (const button of layoutButtons) {
  button.addEventListener('click', () => {
    const layout = button.dataset.layoutValue;
    if (layout === 'code' || layout === 'preview' || layout === 'split') {
      setLayout(layout);
    }
  });
}

for (const button of sourceTabs) {
  button.addEventListener('click', () => {
    const tab = button.dataset.sourceTab;
    if (tab === 'html' || tab === 'css' || tab === 'js') {
      setSourceTab(tab);
    }
  });
}

previewFrame.addEventListener('load', () => {
  if (previewFrame.src && previewFrame.src !== 'about:blank') {
    previewShell.classList.add('is-ready');
  }
});

shareButton.addEventListener('click', () => {
  if (!currentCase || !caseDetailUrl) {
    return;
  }
  try {
    drawQrCode(caseDetailUrl);
    shareUrl.textContent = caseDetailUrl;
    copyFeedback.hidden = true;
    shareDialog.showModal();
  } catch (error) {
    showCopyFeedback(error instanceof Error ? error.message : '分享内容生成失败', true);
  }
});

shareClose.addEventListener('click', () => shareDialog.close());
shareDialog.addEventListener('click', (event) => {
  if (event.target === shareDialog) {
    shareDialog.close();
  }
});

copyLinkButton.addEventListener('click', () => {
  copyText(caseDetailUrl)
    .then(() => showCopyFeedback('已复制案例链接'))
    .catch((error) => showCopyFeedback(error instanceof Error ? error.message : '复制失败', true));
});

setLayout(activeLayout);
setSourceTab(activeSourceTab);
sourceStatus.textContent = '正在读取源码';

initialize().catch((error) => {
  showError(error instanceof Error ? error.message : '案例加载失败');
});
