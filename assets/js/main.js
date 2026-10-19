// @ts-check

import { filterCatalog, getThumbnailPath, normalizeCatalogQuery } from './catalog-utils.js';
import { fetchCatalog, readCatalogCache, writeCatalogCache } from './catalog-store.js';
import { getCaseHref, resolveAssetUrl } from './link-target.js';

/**
 * @typedef {import('./catalog-utils.js').Catalog} Catalog
 * @typedef {import('./catalog-utils.js').CatalogCategory} CatalogCategory
 * @typedef {import('./catalog-utils.js').CatalogCase} CatalogCase
 */

const SITE_ROOT_URL = new URL('../../', import.meta.url);
const CATALOG_URL = new URL('../mock/list.min.json', import.meta.url);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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

const content = getElement('main-content', HTMLElement);
const navList = getElement('nav-list', HTMLUListElement);
const catalogSections = getElement('catalog-sections', HTMLDivElement);
const totalCount = getElement('count', HTMLElement);
const searchInput = getElement('search-input', HTMLInputElement);
const searchClear = getElement('search-clear', HTMLButtonElement);
const statusRegion = getElement('catalog-status', HTMLElement);
const loadingState = getElement('loading-state', HTMLElement);
const errorState = getElement('error-state', HTMLElement);
const errorMessage = getElement('error-message', HTMLElement);
const retryButton = getElement('retry-button', HTMLButtonElement);
const searchSection = getElement('search-section', HTMLElement);
const searchList = getElement('search-list', HTMLUListElement);
const searchCount = getElement('search-count', HTMLElement);
const searchEmpty = getElement('search-empty', HTMLElement);
const navToggle = getElement('nav-toggle', HTMLButtonElement);
const navExit = getElement('nav-exit', HTMLButtonElement);
const navBackdrop = getElement('nav-backdrop', HTMLButtonElement);
const siteNav = getElement('site-nav', HTMLElement);
const goTopButton = getElement('go-top', HTMLButtonElement);
const year = getElement('year', HTMLElement);

/** @type {Catalog | null} */
let currentCatalog = null;
/** @type {IntersectionObserver | null} */
let sectionObserver = null;
/** @type {string} */
let activeCategory = '';

const currentYear = String(new Date().getFullYear());
year.textContent = currentYear;
document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = currentYear;
});

/** @param {string} className */
function createIcon(className) {
  const icon = document.createElement('i');
  icon.className = `felab ${className}`;
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

/**
 * @param {string} message
 * @param {'info' | 'warning' | 'success'} [tone]
 */
function setStatus(message, tone = 'info') {
  statusRegion.textContent = message;
  statusRegion.dataset.tone = tone;
  statusRegion.hidden = message.length === 0;
}

/** @param {boolean} loading */
function setLoading(loading) {
  loadingState.hidden = !loading;
  catalogSections.hidden = loading || searchInput.value.trim().length > 0;
  if (loading) {
    errorState.hidden = true;
  }
}

/** @param {string} message */
function showFatalError(message) {
  errorMessage.textContent = message;
  errorState.hidden = false;
  loadingState.hidden = true;
  catalogSections.hidden = true;
  searchSection.hidden = true;
  setStatus('');
}

/** @param {string} type */
function setActiveCategory(type) {
  if (activeCategory === type) {
    return;
  }
  activeCategory = type;
  for (const button of navList.querySelectorAll('button[data-category]')) {
    const selected = button.getAttribute('data-category') === type;
    button.classList.toggle('is-active', selected);
    if (selected) {
      button.setAttribute('aria-current', 'location');
    } else {
      button.removeAttribute('aria-current');
    }
  }
}

/** @param {CatalogCategory[]} categories */
function renderNavigation(categories) {
  const fragment = document.createDocumentFragment();
  for (const category of categories) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-link';
    button.dataset.category = category.type;
    button.append(createIcon(category.icon), document.createTextNode(category.title));
    button.addEventListener('click', () => {
      document.getElementById(`category-${category.type}`)?.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });
      closeNavigation({ restoreFocus: true });
    });
    item.append(button);
    fragment.append(item);
  }
  navList.replaceChildren(fragment);
  if (categories[0]) {
    setActiveCategory(categories[0].type);
  }
}

/**
 * @param {CatalogCase} item
 * @returns {HTMLLIElement}
 */
function createCard(item) {
  const listItem = document.createElement('li');
  listItem.className = 'catalog-card';

  const anchor = document.createElement('a');
  anchor.className = 'catalog-card-link';
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.title = item.description;
  anchor.href = getCaseHref(item, { siteRootUrl: SITE_ROOT_URL });

  const media = document.createElement('div');
  media.className = 'catalog-card-media';
  const picture = document.createElement('picture');
  const thumbnailPath = getThumbnailPath(item.picUrl);
  if (thumbnailPath) {
    const source = document.createElement('source');
    source.type = 'image/webp';
    source.srcset = resolveAssetUrl(thumbnailPath, SITE_ROOT_URL);
    picture.append(source);
  }
  const image = document.createElement('img');
  image.className = 'catalog-card-cover';
  image.src = resolveAssetUrl(item.picUrl, SITE_ROOT_URL);
  image.alt = item.name;
  image.width = 480;
  image.height = 300;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener(
    'load',
    () => {
      image.classList.add('is-loaded');
      media.classList.add('is-loaded');
    },
    { once: true },
  );
  picture.append(image);
  media.append(picture);

  const body = document.createElement('div');
  body.className = 'catalog-card-body';
  const title = document.createElement('h3');
  title.className = 'catalog-card-title';
  title.textContent = item.name;
  const description = document.createElement('p');
  description.className = 'catalog-card-description';
  description.textContent = item.description;
  const tags = document.createElement('p');
  tags.className = 'catalog-card-tags';
  tags.append(createIcon('felab-tags'), document.createTextNode(item.tags.join(', ')));
  body.append(title, description, tags);
  anchor.append(media, body);
  listItem.append(anchor);
  return listItem;
}

/**
 * @param {CatalogCase[]} items
 * @param {HTMLUListElement} list
 */
function renderCards(items, list) {
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    fragment.append(createCard(item));
  }
  list.replaceChildren(fragment);
}

/** @param {Catalog} catalog */
function renderSections(catalog) {
  const fragment = document.createDocumentFragment();
  for (const category of catalog.categories) {
    const items = catalog.list.filter((item) => item.type === category.type);
    const section = document.createElement('section');
    section.id = `category-${category.type}`;
    section.className = 'catalog-section';
    section.dataset.category = category.type;

    const heading = document.createElement('h2');
    heading.className = 'catalog-section-title';
    heading.append(createIcon(category.icon), document.createTextNode(category.title));
    const count = document.createElement('span');
    count.className = 'catalog-section-count';
    count.textContent = String(items.length);
    heading.append(count);

    const list = document.createElement('ul');
    list.className = 'catalog-grid';
    renderCards(items, list);
    section.append(heading, list);
    fragment.append(section);
  }
  catalogSections.replaceChildren(fragment);
  observeSections();
}

function observeSections() {
  sectionObserver?.disconnect();
  const sections = [...catalogSections.querySelectorAll('.catalog-section')];
  if (sections.length === 0) {
    return;
  }

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const first = visible[0]?.target;
      if (first instanceof HTMLElement && first.dataset.category) {
        setActiveCategory(first.dataset.category);
      }
    },
    {
      root: content,
      rootMargin: '-8% 0px -72% 0px',
      threshold: [0, 0.1, 0.5],
    },
  );
  sections.forEach((section) => sectionObserver?.observe(section));
}

/** @param {Catalog} catalog */
function applyCatalog(catalog) {
  const previousScroll = content.scrollTop;
  const previousQuery = searchInput.value;
  currentCatalog = catalog;
  totalCount.textContent = String(catalog.list.length);
  document.title = `${catalog.name} - 探索新知，展望未来`;
  document.querySelectorAll('[data-site-title]').forEach((element) => {
    element.textContent = catalog.name;
  });

  renderNavigation(catalog.categories);
  renderSections(catalog);
  loadingState.hidden = true;
  errorState.hidden = true;
  searchInput.value = previousQuery;
  updateSearch({ syncUrl: false });
  requestAnimationFrame(() => {
    content.scrollTop = previousScroll;
  });
}

/**
 * @param {{ syncUrl?: boolean }} [options]
 */
function updateSearch({ syncUrl = true } = {}) {
  const query = normalizeCatalogQuery(searchInput.value);
  searchClear.hidden = query.length === 0;

  if (syncUrl) {
    const nextUrl = new URL(window.location.href);
    if (query) {
      nextUrl.searchParams.set('q', query);
    } else {
      nextUrl.searchParams.delete('q');
    }
    window.history.replaceState(null, '', nextUrl);
  }

  if (!currentCatalog) {
    return;
  }

  if (!query) {
    searchSection.hidden = true;
    catalogSections.hidden = false;
    return;
  }

  const results = filterCatalog(currentCatalog, query);
  searchCount.textContent = String(results.length);
  searchEmpty.hidden = results.length !== 0;
  renderCards(results, searchList);
  catalogSections.hidden = true;
  searchSection.hidden = false;
}

/** @param {string} message */
function describeError(message) {
  showFatalError(message || '目录加载失败，请稍后重试。');
}

async function refreshCatalog() {
  setLoading(true);
  try {
    const payload = await fetchCatalog(CATALOG_URL);
    const changed = currentCatalog?.revision !== payload.revision;
    if (changed || !currentCatalog) {
      applyCatalog(payload);
    }
    await writeCatalogCache(payload);
    setStatus(changed ? '目录已更新' : '', 'success');
  } catch (error) {
    if (currentCatalog) {
      setStatus('网络不可用，正在使用本地缓存', 'warning');
    } else {
      describeError(error instanceof Error ? error.message : '');
    }
  } finally {
    if (currentCatalog) {
      setLoading(false);
    }
  }
}

async function initialize() {
  const initialQuery = normalizeCatalogQuery(
    new URL(window.location.href).searchParams.get('q') ?? '',
  );
  searchInput.value = initialQuery;
  searchClear.hidden = initialQuery.length === 0;

  const networkPromise = fetchCatalog(CATALOG_URL).then(
    (payload) => ({ payload, error: null }),
    (error) => ({ payload: null, error }),
  );

  const cached = await readCatalogCache();
  if (cached) {
    applyCatalog(cached.payload);
    setStatus('已读取本地缓存，正在检查更新', 'info');
  }

  const result = await networkPromise;
  if (result.payload) {
    const changed = currentCatalog?.revision !== result.payload.revision;
    if (changed || !currentCatalog) {
      applyCatalog(result.payload);
    }
    await writeCatalogCache(result.payload);
    setStatus(changed ? '目录已更新' : '', 'success');
  } else if (currentCatalog) {
    setStatus('网络不可用，正在使用本地缓存', 'warning');
  } else {
    describeError(result.error instanceof Error ? result.error.message : '');
  }

  if (currentCatalog) {
    setLoading(false);
  }
}

function openNavigation() {
  document.body.classList.add('is-nav-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navBackdrop.hidden = false;
  siteNav.setAttribute('aria-hidden', 'false');
  navExit.focus();
}

function closeNavigation({ restoreFocus = false } = {}) {
  if (!document.body.classList.contains('is-nav-open')) {
    return;
  }
  document.body.classList.remove('is-nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navBackdrop.hidden = true;
  siteNav.setAttribute('aria-hidden', 'true');
  if (restoreFocus) {
    navToggle.focus();
  }
}

navToggle.addEventListener('click', openNavigation);
navExit.addEventListener('click', () => closeNavigation({ restoreFocus: true }));
navBackdrop.addEventListener('click', () => closeNavigation({ restoreFocus: true }));
searchInput.addEventListener('input', () => updateSearch());
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  updateSearch();
  searchInput.focus();
});
retryButton.addEventListener('click', refreshCatalog);

content.addEventListener('scroll', () => {
  goTopButton.hidden = content.scrollTop < 320;
});
goTopButton.addEventListener('click', () => {
  content.scrollTo({
    top: 0,
    behavior: reduceMotion.matches ? 'auto' : 'smooth',
  });
});

document.addEventListener('keydown', (event) => {
  if (!document.body.classList.contains('is-nav-open')) {
    return;
  }
  if (event.key === 'Escape') {
    closeNavigation({ restoreFocus: true });
    return;
  }
  if (event.key !== 'Tab') {
    return;
  }

  const focusable = /** @type {HTMLElement[]} */ (
    [...siteNav.querySelectorAll('a, button')].filter(
      (element) =>
        element instanceof HTMLElement &&
        !(element instanceof HTMLButtonElement && element.disabled),
    )
  );
  if (focusable.length === 0) {
    return;
  }
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.matchMedia('(min-width: 750px)').addEventListener('change', (event) => {
  if (event.matches) {
    closeNavigation();
    siteNav.removeAttribute('aria-hidden');
  } else {
    siteNav.setAttribute('aria-hidden', 'true');
  }
});

if (!window.matchMedia('(min-width: 750px)').matches) {
  siteNav.setAttribute('aria-hidden', 'true');
}

initialize().catch((error) => {
  describeError(error instanceof Error ? error.message : '');
});
