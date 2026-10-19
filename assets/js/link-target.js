// @ts-check

/**
 * @typedef {import('./catalog-utils.js').CatalogCase} CatalogCase
 */

const LOCALHOST_SUFFIX = 'localhost';

/** @param {string} pageHostname */
function getMappedHost(pageHostname) {
  if (/^(localhost|127\.0\.0\.1)$/i.test(pageHostname)) {
    return 'guanqi.cn';
  }
  if (/guanqi\.xyz$/i.test(pageHostname)) {
    return 'guanqi.xyz';
  }
  return 'xqgj.cc';
}

/**
 * @param {string} href
 * @returns {boolean}
 */
export function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

/**
 * @param {string} href
 * @returns {boolean}
 */
export function isLocalCaseHref(href) {
  return href.replace(/^\.\//, '').startsWith('cases/');
}

/**
 * @param {string} rawHref
 * @param {URL} pageUrl
 * @returns {URL}
 */
export function resolveExternalTarget(rawHref, pageUrl) {
  if (rawHref.length === 0 || rawHref.length > 2048) {
    throw new Error('外链地址无效');
  }

  let target;
  try {
    target = new URL(rawHref);
  } catch {
    throw new Error('外链地址无效');
  }
  if (!['http:', 'https:'].includes(target.protocol)) {
    throw new Error('仅允许 HTTP 或 HTTPS 外链');
  }
  if (target.username || target.password) {
    throw new Error('外链地址不得包含凭据');
  }

  if (target.hostname.toLowerCase() === LOCALHOST_SUFFIX) {
    target.hostname = getMappedHost(pageUrl.hostname);
  } else if (target.hostname.toLowerCase().endsWith(`.${LOCALHOST_SUFFIX}`)) {
    const subdomain = target.hostname.slice(0, -LOCALHOST_SUFFIX.length);
    target.hostname = `${subdomain}${getMappedHost(pageUrl.hostname)}`;
  }

  return target;
}

/**
 * @param {string} rawHref
 * @param {URL} siteRootUrl
 * @returns {URL}
 */
export function resolveLocalTarget(rawHref, siteRootUrl) {
  const normalized = rawHref.replace(/^\.\//, '');
  if (
    !normalized ||
    normalized.startsWith('/') ||
    normalized.startsWith('\\') ||
    normalized.startsWith('//') ||
    normalized.includes('\\') ||
    /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(normalized)
  ) {
    throw new Error('站内地址必须是安全的相对路径');
  }

  /** @type {string} */
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(normalized.split(/[?#]/, 1)[0]);
  } catch {
    throw new Error('站内地址编码无效');
  }
  if (decodedPath.split('/').some((segment) => segment === '.' || segment === '..')) {
    throw new Error('站内地址不得包含路径穿越');
  }

  const target = new URL(normalized, siteRootUrl);
  if (target.origin !== siteRootUrl.origin || !target.pathname.startsWith(siteRootUrl.pathname)) {
    throw new Error('站内地址超出站点范围');
  }
  return target;
}

/**
 * @param {CatalogCase} item
 * @param {{ siteRootUrl: URL }} context
 * @returns {string}
 */
export function getCaseHref(item, { siteRootUrl }) {
  if (isExternalHref(item.href)) {
    const checkUrl = new URL('link/check/', siteRootUrl);
    checkUrl.searchParams.set('cid', String(item.cid));
    return checkUrl.href;
  }
  if (isLocalCaseHref(item.href)) {
    const detailUrl = new URL('case/', siteRootUrl);
    detailUrl.searchParams.set('cid', String(item.cid));
    return detailUrl.href;
  }
  return resolveLocalTarget(item.href, siteRootUrl).href;
}

/**
 * @param {string} assetPath
 * @param {URL} siteRootUrl
 * @returns {string}
 */
export function resolveAssetUrl(assetPath, siteRootUrl) {
  return resolveLocalTarget(assetPath, siteRootUrl).href;
}
