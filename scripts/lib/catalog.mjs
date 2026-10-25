import { createHash } from 'node:crypto';
import { access, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @typedef {import('../../assets/js/catalog-utils.js').Catalog} Catalog
 */

export const PROJECT_ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
export const CATALOG_SOURCE_RELATIVE_PATH = 'assets/mock/list.json';
export const CATALOG_OUTPUT_RELATIVE_PATH = 'assets/mock/list.min.json';
export const CATALOG_SOURCE_PATH = path.join(PROJECT_ROOT, CATALOG_SOURCE_RELATIVE_PATH);
export const CATALOG_OUTPUT_PATH = path.join(PROJECT_ROOT, CATALOG_OUTPUT_RELATIVE_PATH);

const REQUIRED_TOP_LEVEL = ['schemaVersion', 'name', 'description', 'categories', 'list'];
const REQUIRED_CASE_FIELDS = [
  'cid',
  'name',
  'description',
  'href',
  'picUrl',
  'type',
  'tags',
  'create_time',
  'update_time',
];

export class CatalogValidationError extends Error {
  /** @param {string[]} errors */
  constructor(errors) {
    super(`Catalog validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
    this.name = 'CatalogValidationError';
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

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** @param {string} date */
function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

/** @param {string} value */
function isExternalUrl(value) {
  return /^https?:\/\//i.test(value);
}

/** @param {string} value */
function validateExternalUrl(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'must use http or https';
    }
    if (url.username || url.password) {
      return 'must not contain credentials';
    }
    return null;
  } catch {
    return 'must be a valid absolute URL';
  }
}

/** @param {string} value */
function getSafeRelativePath(value) {
  const normalized = value.replace(/^\.\//, '');
  if (
    !normalized ||
    normalized.startsWith('/') ||
    normalized.startsWith('\\') ||
    normalized.startsWith('//') ||
    normalized.includes('\\') ||
    /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(normalized)
  ) {
    return null;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(normalized.split(/[?#]/, 1)[0]);
  } catch {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.some((segment) => segment === '.' || segment === '..')) {
    return null;
  }

  return pathname;
}

/** @param {string} relativePath @param {string} rootDir */
async function existsWithinRoot(relativePath, rootDir) {
  const resolved = path.resolve(rootDir, relativePath);
  const root = path.resolve(rootDir);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    return false;
  }

  try {
    await access(resolved);
    return true;
  } catch {
    return false;
  }
}

/** @param {string} href @param {string} rootDir */
async function validateLocalTarget(href, rootDir) {
  const safePath = getSafeRelativePath(href);
  if (!safePath) {
    return 'must be a safe relative path';
  }

  if (await existsWithinRoot(safePath, rootDir)) {
    return null;
  }

  const directoryIndex = path.join(safePath, 'index.html');
  if (await existsWithinRoot(directoryIndex, rootDir)) {
    return null;
  }

  return `target does not exist: ${href}`;
}

/** @param {string} picUrl @param {string} rootDir */
async function validateCover(picUrl, rootDir) {
  const safePath = getSafeRelativePath(picUrl);
  if (!safePath) {
    return 'must be a safe relative path';
  }
  if (!safePath.startsWith('assets/img/cover/')) {
    return 'must live under assets/img/cover/';
  }
  if (!(await existsWithinRoot(safePath, rootDir))) {
    return `cover does not exist: ${picUrl}`;
  }
  return null;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

/** @param {Catalog} catalog */
export function computeCatalogRevision(catalog) {
  /** @type {Record<string, unknown>} */
  const content = { ...catalog };
  delete content.revision;
  return createHash('sha256').update(stableStringify(content)).digest('hex').slice(0, 12);
}

/**
 * @param {unknown} catalog
 * @param {{ rootDir?: string }} [options]
 * @returns {Promise<string[]>}
 */
export async function validateCatalog(catalog, { rootDir = PROJECT_ROOT } = {}) {
  /** @type {string[]} */
  const errors = [];
  if (!isRecord(catalog)) {
    return ['catalog must be an object'];
  }

  for (const field of REQUIRED_TOP_LEVEL) {
    if (catalog[field] === undefined) {
      errors.push(`missing top-level field: ${field}`);
    }
  }

  if (catalog.schemaVersion !== 2) {
    errors.push('schemaVersion must equal 2');
  }
  if (!isNonEmptyString(catalog.name)) {
    errors.push('name must be a non-empty string');
  }
  if (!isNonEmptyString(catalog.description)) {
    errors.push('description must be a non-empty string');
  }

  if (!Array.isArray(catalog.categories) || catalog.categories.length === 0) {
    errors.push('categories must be a non-empty array');
    return errors;
  }
  if (!Array.isArray(catalog.list)) {
    errors.push('list must be an array');
    return errors;
  }

  /** @type {Map<string, Record<string, unknown>>} */
  const categories = new Map();
  /** @type {Set<number>} */
  const prefixes = new Set();
  for (const [index, category] of catalog.categories.entries()) {
    if (!isRecord(category)) {
      errors.push(`categories[${index}] must be an object`);
      continue;
    }
    const type = category.type;
    const cidPrefix = category.cidPrefix;
    if (!isNonEmptyString(type)) {
      errors.push(`categories[${index}].type must be a non-empty string`);
    }
    if (!isNonEmptyString(category.title)) {
      errors.push(`categories[${index}].title must be a non-empty string`);
    }
    if (!isNonEmptyString(category.icon)) {
      errors.push(`categories[${index}].icon must be a non-empty string`);
    }
    if (
      typeof cidPrefix !== 'number' ||
      !Number.isInteger(cidPrefix) ||
      cidPrefix < 1 ||
      cidPrefix > 9
    ) {
      errors.push(`categories[${index}].cidPrefix must be an integer from 1 to 9`);
    }
    if (isNonEmptyString(type)) {
      if (categories.has(type)) {
        errors.push(`duplicate category type: ${type}`);
      } else {
        categories.set(type, category);
      }
    }
    if (typeof cidPrefix === 'number') {
      if (prefixes.has(cidPrefix)) {
        errors.push(`duplicate category cidPrefix: ${cidPrefix}`);
      } else {
        prefixes.add(cidPrefix);
      }
    }
  }

  /** @type {Set<number>} */
  const cids = new Set();
  /** @type {Set<string>} */
  const hrefs = new Set();
  for (const [index, item] of catalog.list.entries()) {
    if (!isRecord(item)) {
      errors.push(`list[${index}] must be an object`);
      continue;
    }
    const cid = item.cid;
    const label = typeof cid === 'number' ? `case ${cid}` : `list[${index}]`;
    const name = item.name;
    const description = item.description;
    const href = item.href;
    const picUrl = item.picUrl;
    const type = item.type;
    const tags = item.tags;
    const createTime = item.create_time;
    const updateTime = item.update_time;
    for (const field of REQUIRED_CASE_FIELDS) {
      if (item[field] === undefined) {
        errors.push(`${label} missing field: ${field}`);
      }
    }
    if (typeof cid !== 'number' || !Number.isInteger(cid) || cid < 1000 || cid > 9999) {
      errors.push(`${label} cid must be a four-digit positive integer`);
    } else if (cids.has(cid)) {
      errors.push(`${label} has duplicate cid`);
    } else {
      cids.add(cid);
    }

    if (!isNonEmptyString(name) || name.length > 80) {
      errors.push(`${label} name must contain 1-80 characters`);
    }
    if (!isNonEmptyString(description) || description.length > 300) {
      errors.push(`${label} description must contain 1-300 characters`);
    }
    if (!isNonEmptyString(href) || href.length > 2048) {
      errors.push(`${label} href must contain 1-2048 characters`);
    } else if (hrefs.has(href)) {
      errors.push(`${label} has duplicate href`);
    } else {
      hrefs.add(href);
    }
    if (!isNonEmptyString(picUrl) || picUrl.length > 512) {
      errors.push(`${label} picUrl must contain 1-512 characters`);
    }
    if (!isNonEmptyString(type) || !categories.has(type)) {
      errors.push(`${label} type must reference a category`);
    } else if (typeof cid === 'number' && Number.isInteger(cid)) {
      const category = categories.get(type);
      if (!category) {
        errors.push(`${label} type category is missing`);
      } else if (String(cid).startsWith(String(category.cidPrefix)) === false) {
        errors.push(`${label} cid must begin with category prefix ${category.cidPrefix}`);
      }
    }
    if (!Array.isArray(tags) || tags.length === 0 || tags.length > 10) {
      errors.push(`${label} tags must contain 1-10 entries`);
    } else {
      /** @type {Set<string>} */
      const seenTags = new Set();
      for (const tag of tags) {
        if (!isNonEmptyString(tag) || tag.length > 30) {
          errors.push(`${label} has an invalid tag`);
          continue;
        }
        const normalizedTag = tag.trim().toLocaleLowerCase();
        if (seenTags.has(normalizedTag)) {
          errors.push(`${label} has duplicate tag: ${tag}`);
        }
        seenTags.add(normalizedTag);
      }
    }
    if (typeof createTime !== 'string' || !isValidDate(createTime)) {
      errors.push(`${label} create_time must use YYYY-MM-DD`);
    }
    if (typeof updateTime !== 'string' || !isValidDate(updateTime)) {
      errors.push(`${label} update_time must use YYYY-MM-DD`);
    }

    if (isNonEmptyString(href)) {
      if (isExternalUrl(href)) {
        const externalError = validateExternalUrl(href);
        if (externalError) {
          errors.push(`${label} ${externalError}`);
        }
      } else {
        const targetError = await validateLocalTarget(href, rootDir);
        if (targetError) {
          errors.push(`${label} ${targetError}`);
        }
      }
    }

    if (isNonEmptyString(picUrl)) {
      const coverError = await validateCover(picUrl, rootDir);
      if (coverError) {
        errors.push(`${label} ${coverError}`);
      }
    }
  }

  return errors;
}

/** @param {Catalog} catalog */
export function buildCatalogOutput(catalog) {
  const revision = computeCatalogRevision(catalog);
  const output = { ...catalog, revision };
  return {
    catalog: output,
    revision,
    sourceText: `${JSON.stringify(output, null, 2)}\n`,
    minifiedText: `${JSON.stringify(output)}\n`,
  };
}

/**
 * @param {{ rootDir?: string }} [options]
 * @returns {Promise<Catalog>}
 */
export async function loadCatalogSource({ rootDir = PROJECT_ROOT } = {}) {
  const text = await readFile(path.join(rootDir, CATALOG_SOURCE_RELATIVE_PATH), 'utf8');
  return /** @type {Catalog} */ (JSON.parse(text));
}

/**
 * @param {Catalog} catalog
 * @param {string} categoryType
 * @returns {number}
 */
export function getNextCatalogCid(catalog, categoryType) {
  const category = catalog.categories.find((item) => item.type === categoryType);
  if (!category) {
    throw new Error(`Unknown category: ${categoryType}`);
  }

  const prefix = Number(category.cidPrefix);
  const nextNumber =
    catalog.list
      .filter((item) => Number.isInteger(item.cid) && String(item.cid).startsWith(String(prefix)))
      .map((item) => Number(String(item.cid).slice(1)))
      .sort((a, b) => a - b)
      .at(-1) ?? 0;
  return Number(`${prefix}${String(nextNumber + 1).padStart(3, '0')}`);
}

/**
 * @param {{ check?: boolean, rootDir?: string, catalog?: Catalog, list?: Catalog['list'], baseRevision?: string }} [options]
 */
export async function writeCatalogFiles({
  check = false,
  rootDir = PROJECT_ROOT,
  catalog: candidateCatalog,
  list,
  baseRevision,
} = {}) {
  const sourcePath = path.join(rootDir, CATALOG_SOURCE_RELATIVE_PATH);
  const outputPath = path.join(rootDir, CATALOG_OUTPUT_RELATIVE_PATH);
  const sourceText = await readFile(sourcePath, 'utf8');
  const sourceCatalog = /** @type {Catalog} */ (JSON.parse(sourceText));

  if (baseRevision !== undefined) {
    const currentRevision = computeCatalogRevision(sourceCatalog);
    if (baseRevision !== currentRevision) {
      const conflict = new Error('Catalog revision has changed.');
      conflict.name = 'CatalogRevisionConflict';
      throw conflict;
    }
  }

  const catalog =
    candidateCatalog ??
    (list ? /** @type {Catalog} */ ({ ...sourceCatalog, list }) : sourceCatalog);
  const errors = await validateCatalog(catalog, { rootDir });
  if (errors.length > 0) {
    throw new CatalogValidationError(errors);
  }

  const output = buildCatalogOutput(catalog);
  if (check) {
    const currentOutput = await readFile(outputPath, 'utf8');
    const stale = [];
    if (sourceText !== output.sourceText) {
      stale.push('assets/mock/list.json');
    }
    if (currentOutput !== output.minifiedText) {
      stale.push('assets/mock/list.min.json');
    }
    if (stale.length > 0) {
      throw new Error(`Generated catalog is stale: ${stale.join(', ')}. Run pnpm catalog:build.`);
    }
    return { catalog: output.catalog, revision: output.revision, count: catalog.list.length };
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  const nonce = `${process.pid}-${Date.now()}`;
  const sourceTempPath = `${sourcePath}.${nonce}.tmp`;
  const outputTempPath = `${outputPath}.${nonce}.tmp`;
  try {
    await Promise.all([
      writeFile(sourceTempPath, output.sourceText, 'utf8'),
      writeFile(outputTempPath, output.minifiedText, 'utf8'),
    ]);
    await rename(sourceTempPath, sourcePath);
    await rename(outputTempPath, outputPath);
  } finally {
    await Promise.allSettled([unlink(sourceTempPath), unlink(outputTempPath)]);
  }
  return { catalog: output.catalog, revision: output.revision, count: catalog.list.length };
}

/** @param {string} picturePath */
export function getThumbnailRelativePath(picturePath) {
  const safePath = getSafeRelativePath(picturePath);
  if (!safePath) {
    throw new Error(`Unsafe picture path: ${picturePath}`);
  }
  const parsed = path.parse(safePath);
  const sourceExtension = parsed.ext.replace(/^\./, '');
  const filename = sourceExtension
    ? `${parsed.name}.${sourceExtension}.webp`
    : `${parsed.name}.webp`;
  return path.posix.join(parsed.dir, 'thumbs', filename);
}
