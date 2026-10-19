// @ts-check

const DEFAULT_FETCH_TIMEOUT_MS = 10_000;
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;

/**
 * @typedef {Object} CaseSource
 * @property {string} html
 * @property {string} css
 * @property {string} js
 */

/**
 * @param {URL} entryUrl
 * @returns {URL}
 */
export function normalizeCasePageUrl(entryUrl) {
  const pageUrl = new URL(entryUrl.href);
  const lastSegment = pageUrl.pathname.split('/').at(-1) ?? '';
  if (!pageUrl.pathname.endsWith('/') && !lastSegment.includes('.')) {
    pageUrl.pathname += '/';
  }
  pageUrl.hash = '';
  return pageUrl;
}

/**
 * @param {URL} pageUrl
 * @returns {URL}
 */
export function resolveEntryDocumentUrl(pageUrl) {
  const documentUrl = new URL(pageUrl.href);
  const lastSegment = documentUrl.pathname.split('/').at(-1) ?? '';
  if (documentUrl.pathname.endsWith('/')) {
    documentUrl.pathname += 'index.html';
  } else if (!lastSegment.includes('.')) {
    documentUrl.pathname += '/index.html';
  }
  documentUrl.hash = '';
  return documentUrl;
}

/** @param {unknown} error */
function describeError(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {string} text
 * @returns {number}
 */
function getUtf8Length(text) {
  return new TextEncoder().encode(text).byteLength;
}

/**
 * @param {URL} url
 * @param {{ fetchImpl?: typeof fetch, timeoutMs?: number }} options
 * @returns {Promise<string>}
 */
async function fetchText(
  url,
  { fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS },
) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: { Accept: 'text/html,text/css,text/javascript,text/plain,*/*' },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
    if (getUtf8Length(text) > MAX_SOURCE_BYTES) {
      throw new Error('文件超过 2 MB 限制');
    }
    return text;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('读取超时', { cause: error });
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

/**
 * @param {string} label
 * @param {string} url
 * @param {'css' | 'js'} kind
 * @param {unknown} error
 * @returns {string}
 */
function formatLoadFailure(label, url, kind, error) {
  const comment = `${label}: ${url}`;
  const message = describeError(error).replaceAll('*/', '* /');
  return kind === 'css'
    ? `/* Unable to load ${comment}: ${message} */`
    : `// Unable to load ${comment}: ${message}`;
}

/**
 * @param {string} label
 * @param {string} url
 * @param {'css' | 'js'} kind
 * @returns {string}
 */
function formatExternalReference(label, url, kind) {
  return kind === 'css'
    ? `/* External stylesheet: ${label}: ${url} */`
    : `// External script: ${label}: ${url}`;
}

/**
 * @param {Element} element
 * @param {'css' | 'js'} kind
 * @param {URL} entryDocumentUrl
 * @param {{ fetchImpl?: typeof fetch }} options
 * @returns {Promise<string>}
 */
async function collectElementSource(element, kind, entryDocumentUrl, { fetchImpl }) {
  const sourceAttribute = kind === 'css' ? 'href' : 'src';
  const rawReference = element.getAttribute(sourceAttribute)?.trim();
  const label = rawReference || (kind === 'css' ? 'inline style' : 'inline script');
  const inlineSource = element.textContent?.trim() ?? '';

  if (!rawReference) {
    if (!inlineSource) {
      return '';
    }
    return kind === 'css' ? `/* ${label} */\n${inlineSource}` : `// ${label}\n${inlineSource}`;
  }

  let referenceUrl;
  try {
    referenceUrl = new URL(rawReference, entryDocumentUrl);
  } catch {
    return formatLoadFailure(label, rawReference, kind, new Error('URL 无效'));
  }

  if (referenceUrl.origin !== entryDocumentUrl.origin) {
    return formatExternalReference(label, referenceUrl.href, kind);
  }

  try {
    const source = await fetchText(referenceUrl, { fetchImpl });
    return kind === 'css' ? `/* ${label} */\n${source.trim()}` : `// ${label}\n${source.trim()}`;
  } catch (error) {
    return formatLoadFailure(label, referenceUrl.href, kind, error);
  }
}

/**
 * @param {Element} element
 * @param {'css' | 'js'} kind
 * @returns {boolean}
 */
function isSourceElement(element, kind) {
  if (kind === 'css') {
    return (
      element.tagName.toLowerCase() === 'style' ||
      (element.tagName.toLowerCase() === 'link' &&
        Boolean(element.getAttribute('rel')?.split(/\s+/).includes('stylesheet')))
    );
  }
  if (element.tagName.toLowerCase() !== 'script') {
    return false;
  }
  const type = element.getAttribute('type')?.trim().toLowerCase();
  return (
    !type ||
    ['module', 'text/javascript', 'application/javascript', 'text/ecmascript'].includes(type)
  );
}

/**
 * @param {URL} entryUrl
 * @param {{ fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<CaseSource>}
 */
export async function loadCaseSource(entryUrl, { fetchImpl = globalThis.fetch } = {}) {
  const pageUrl = normalizeCasePageUrl(entryUrl);
  const entryDocumentUrl = resolveEntryDocumentUrl(pageUrl);
  const html = await fetchText(entryDocumentUrl, { fetchImpl });
  const document = new DOMParser().parseFromString(html, 'text/html');
  const sourceElements = [...document.querySelectorAll('style, link[rel], script')];

  const cssParts = await Promise.all(
    sourceElements
      .filter((element) => isSourceElement(element, 'css'))
      .map((element) => collectElementSource(element, 'css', entryDocumentUrl, { fetchImpl })),
  );
  const jsParts = await Promise.all(
    sourceElements
      .filter((element) => isSourceElement(element, 'js'))
      .map((element) => collectElementSource(element, 'js', entryDocumentUrl, { fetchImpl })),
  );

  return {
    html,
    css: cssParts.filter(Boolean).join('\n\n'),
    js: jsParts.filter(Boolean).join('\n\n'),
  };
}
