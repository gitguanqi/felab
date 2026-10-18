// @ts-check

import { assertCatalogPayload, CATALOG_SCHEMA_VERSION } from './catalog-utils.js';

/**
 * @typedef {import('./catalog-utils.js').Catalog} Catalog
 */

export const CATALOG_DB_NAME = 'felab';
export const CATALOG_DB_VERSION = 1;
export const CATALOG_STORE_NAME = 'catalog';
export const CATALOG_CACHE_KEY = 'catalog';
export const DEFAULT_FETCH_TIMEOUT_MS = 8_000;

/**
 * @typedef {Object} CatalogCacheRecord
 * @property {string} key
 * @property {number} schemaVersion
 * @property {string} revision
 * @property {Catalog} payload
 * @property {number} fetchedAt
 */

/**
 * @param {IDBFactory | undefined} factory
 * @returns {Promise<IDBDatabase>}
 */
function openCatalogDatabase(factory) {
  return new Promise((resolve, reject) => {
    if (!factory) {
      reject(new Error('IndexedDB is unavailable'));
      return;
    }

    let request;
    try {
      request = factory.open(CATALOG_DB_NAME, CATALOG_DB_VERSION);
    } catch (error) {
      reject(error);
      return;
    }

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(CATALOG_STORE_NAME)) {
        database.createObjectStore(CATALOG_STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB'));
    request.onblocked = () => reject(new Error('IndexedDB upgrade was blocked'));
  });
}

/**
 * @param {IDBDatabase} database
 * @param {IDBTransactionMode} mode
 * @returns {IDBObjectStore}
 */
function getStore(database, mode) {
  return database.transaction(CATALOG_STORE_NAME, mode).objectStore(CATALOG_STORE_NAME);
}

/**
 * @param {unknown} value
 * @returns {value is CatalogCacheRecord}
 */
function isCacheRecord(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    'key' in value &&
    value.key === CATALOG_CACHE_KEY &&
    'schemaVersion' in value &&
    value.schemaVersion === CATALOG_SCHEMA_VERSION &&
    'revision' in value &&
    typeof value.revision === 'string' &&
    'payload' in value &&
    'fetchedAt' in value &&
    typeof value.fetchedAt === 'number'
  );
}

/**
 * @param {{ factory?: IDBFactory }} [options]
 * @returns {Promise<CatalogCacheRecord | null>}
 */
export async function readCatalogCache({ factory = globalThis.indexedDB } = {}) {
  /** @type {IDBDatabase | undefined} */
  let database;
  try {
    database = await openCatalogDatabase(factory);
    const activeDatabase = database;
    const record = await new Promise((resolve, reject) => {
      const request = getStore(activeDatabase, 'readonly').get(CATALOG_CACHE_KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Unable to read catalog cache'));
    });

    if (record === undefined) {
      return null;
    }
    if (!isCacheRecord(record)) {
      await deleteCatalogCache({ factory });
      return null;
    }
    try {
      assertCatalogPayload(record.payload);
    } catch {
      await deleteCatalogCache({ factory });
      return null;
    }
    return record;
  } catch {
    return null;
  } finally {
    database?.close();
  }
}

/**
 * @param {Catalog} payload
 * @param {{ factory?: IDBFactory, now?: number }} [options]
 * @returns {Promise<CatalogCacheRecord | null>}
 */
export async function writeCatalogCache(
  payload,
  { factory = globalThis.indexedDB, now = Date.now() } = {},
) {
  /** @type {IDBDatabase | undefined} */
  let database;
  try {
    database = await openCatalogDatabase(factory);
    const activeDatabase = database;
    /** @type {CatalogCacheRecord} */
    const record = {
      key: CATALOG_CACHE_KEY,
      schemaVersion: payload.schemaVersion,
      revision: payload.revision,
      payload,
      fetchedAt: now,
    };
    await new Promise((resolve, reject) => {
      const request = getStore(activeDatabase, 'readwrite').put(record);
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error ?? new Error('Unable to write catalog cache'));
    });
    return record;
  } catch {
    return null;
  } finally {
    database?.close();
  }
}

/**
 * @param {{ factory?: IDBFactory }} [options]
 * @returns {Promise<void>}
 */
export async function deleteCatalogCache({ factory = globalThis.indexedDB } = {}) {
  /** @type {IDBDatabase | undefined} */
  let database;
  try {
    database = await openCatalogDatabase(factory);
    const activeDatabase = database;
    await new Promise((resolve, reject) => {
      const request = getStore(activeDatabase, 'readwrite').delete(CATALOG_CACHE_KEY);
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error ?? new Error('Unable to delete catalog cache'));
    });
  } catch {
    // Cache cleanup is best effort; network loading remains available.
  } finally {
    database?.close();
  }
}

/**
 * @param {string | URL} url
 * @param {{ fetchImpl?: typeof fetch, timeoutMs?: number }} [options]
 * @returns {Promise<Catalog>}
 */
export async function fetchCatalog(
  url,
  { fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS } = {},
) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`目录请求失败：HTTP ${response.status}`);
    }
    const payload = await response.json();
    return assertCatalogPayload(payload);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('目录请求超时', { cause: error });
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
