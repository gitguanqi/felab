import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it, vi } from 'vitest';
import {
  fetchCatalog,
  readCatalogCache,
  writeCatalogCache,
} from '../../assets/js/catalog-store.js';
import { CatalogPayloadError } from '../../assets/js/catalog-utils.js';

function createCatalog(revision = '123456789abc') {
  return {
    schemaVersion: 2,
    revision,
    name: '前端实验室',
    description: '测试目录',
    categories: [
      {
        type: 'js',
        title: 'JS案例',
        icon: 'felab-code',
        cidPrefix: 4,
      },
    ],
    list: [
      {
        cid: 4001,
        name: '拖拽',
        description: '拖拽组件',
        href: 'cases/drag/',
        picUrl: './assets/img/cover/drag.jpg',
        type: 'js',
        tags: ['drag'],
        create_time: '2026-01-01',
        update_time: '2026-01-02',
      },
    ],
  };
}

describe('IndexedDB catalog cache', () => {
  it('writes and reads a catalog snapshot', async () => {
    const factory = new IDBFactory();
    const payload = createCatalog();
    const record = await writeCatalogCache(payload, {
      factory,
      now: 1_700_000_000_000,
    });
    expect(record?.revision).toBe(payload.revision);

    const cached = await readCatalogCache({ factory });
    expect(cached?.payload).toEqual(payload);
    expect(cached?.fetchedAt).toBe(1_700_000_000_000);
  });

  it('returns null when IndexedDB is unavailable', async () => {
    expect(await readCatalogCache({ factory: undefined })).toBeNull();
  });
});

describe('catalog fetching', () => {
  it('parses a valid response', async () => {
    const payload = createCatalog();
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(payload), { status: 200 }));
    await expect(fetchCatalog('/catalog.json', { fetchImpl })).resolves.toEqual(payload);
  });

  it('rejects malformed payloads', async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(JSON.stringify({ schemaVersion: 2, list: [] }), {
          status: 200,
        }),
    );
    await expect(fetchCatalog('/catalog.json', { fetchImpl })).rejects.toBeInstanceOf(
      CatalogPayloadError,
    );
  });

  it('reports non-successful responses', async () => {
    const fetchImpl = vi.fn(async () => new Response('', { status: 503 }));
    await expect(fetchCatalog('/catalog.json', { fetchImpl })).rejects.toThrow('HTTP 503');
  });
});
