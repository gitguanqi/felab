// @ts-check

export const CATALOG_SCHEMA_VERSION = 2;

/**
 * @typedef {Object} CatalogCategory
 * @property {string} type
 * @property {string} title
 * @property {string} icon
 * @property {number} cidPrefix
 */

/**
 * @typedef {Object} CatalogCase
 * @property {number} cid
 * @property {string} name
 * @property {string} description
 * @property {string} href
 * @property {string} picUrl
 * @property {string} type
 * @property {string[]} tags
 * @property {string} create_time
 * @property {string} update_time
 */

/**
 * @typedef {Object} Catalog
 * @property {number} schemaVersion
 * @property {string} revision
 * @property {string} name
 * @property {string} description
 * @property {CatalogCategory[]} categories
 * @property {CatalogCase[]} list
 */

export class CatalogPayloadError extends Error {
  /** @param {string[]} errors */
  constructor(errors) {
    super(`Invalid catalog payload:\n${errors.map((error) => `- ${error}`).join('\n')}`);
    this.name = 'CatalogPayloadError';
    this.errors = errors;
  }
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** @param {unknown} value */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function validateCatalogPayload(value) {
  /** @type {string[]} */
  const errors = [];
  if (!isRecord(value)) {
    return ['payload must be an object'];
  }
  if (value.schemaVersion !== CATALOG_SCHEMA_VERSION) {
    errors.push(`schemaVersion must equal ${CATALOG_SCHEMA_VERSION}`);
  }
  if (typeof value.revision !== 'string' || !/^[a-f0-9]{12}$/.test(value.revision)) {
    errors.push('revision must be a 12-character SHA-256 prefix');
  }
  if (!isNonEmptyString(value.name)) {
    errors.push('name must be a non-empty string');
  }
  if (!isNonEmptyString(value.description)) {
    errors.push('description must be a non-empty string');
  }
  if (!Array.isArray(value.categories) || value.categories.length === 0) {
    errors.push('categories must be a non-empty array');
  }
  if (!Array.isArray(value.list)) {
    errors.push('list must be an array');
  }
  const types = new Set();
  const categories = Array.isArray(value.categories) ? value.categories : [];
  for (const [index, category] of categories.entries()) {
    if (
      !isRecord(category) ||
      !isNonEmptyString(category.type) ||
      !isNonEmptyString(category.title) ||
      !isNonEmptyString(category.icon)
    ) {
      errors.push(`categories[${index}] is invalid`);
      continue;
    }
    if (types.has(category.type)) {
      errors.push(`duplicate category type: ${category.type}`);
    }
    types.add(category.type);
  }

  const cids = new Set();
  const list = Array.isArray(value.list) ? value.list : [];
  for (const [index, item] of list.entries()) {
    if (!isRecord(item)) {
      errors.push(`list[${index}] must be an object`);
      continue;
    }
    const label = Number.isInteger(item.cid) ? `case ${item.cid}` : `list[${index}]`;
    if (!Number.isInteger(item.cid)) {
      errors.push(`${label} cid must be an integer`);
    } else if (cids.has(item.cid)) {
      errors.push(`${label} has a duplicate cid`);
    } else {
      cids.add(item.cid);
    }
    for (const field of [
      'name',
      'description',
      'href',
      'picUrl',
      'type',
      'create_time',
      'update_time',
    ]) {
      if (!isNonEmptyString(item[field])) {
        errors.push(`${label} ${field} must be a non-empty string`);
      }
    }
    if (!types.has(String(item.type))) {
      errors.push(`${label} has an unknown type`);
    }
    const tags = item.tags;
    if (!Array.isArray(tags) || tags.some((tag) => !isNonEmptyString(tag))) {
      errors.push(`${label} tags must be a string array`);
    }
  }

  return errors;
}

/**
 * @param {unknown} value
 * @returns {Catalog}
 */
export function assertCatalogPayload(value) {
  const errors = validateCatalogPayload(value);
  if (errors.length > 0) {
    throw new CatalogPayloadError(errors);
  }
  return /** @type {Catalog} */ (value);
}

/**
 * @param {string} value
 * @returns {string}
 */
export function normalizeCatalogQuery(value) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 80);
}

/**
 * @param {Catalog} catalog
 * @param {string} rawQuery
 * @returns {CatalogCase[]}
 */
export function filterCatalog(catalog, rawQuery) {
  const query = normalizeCatalogQuery(rawQuery).toLowerCase();
  if (!query) {
    return catalog.list;
  }
  return catalog.list.filter((item) => {
    const searchable = [item.name, item.description, ...item.tags].join(' ').toLowerCase();
    return searchable.includes(query);
  });
}

/**
 * @param {string} picturePath
 * @returns {string | null}
 */
export function getThumbnailPath(picturePath) {
  const normalized = picturePath.replace(/^\.\//, '');
  if (!normalized.startsWith('assets/img/cover/') || normalized.includes('..')) {
    return null;
  }
  const slashIndex = normalized.lastIndexOf('/');
  const extensionIndex = normalized.lastIndexOf('.');
  if (slashIndex < 0 || extensionIndex <= slashIndex) {
    return null;
  }
  return `${normalized}.webp`.replace('/cover/', '/cover/thumbs/');
}

/**
 * @param {number} timestamp
 * @returns {string}
 */
export function formatCatalogTime(timestamp) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}
