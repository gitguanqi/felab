import { describe, expect, it } from 'vitest';
import {
  CatalogPayloadError,
  assertCatalogPayload,
  filterCatalog,
  getThumbnailPath,
  normalizeCatalogQuery,
} from '../../assets/js/catalog-utils.js';

function createCatalog() {
  return {
    schemaVersion: 2,
    revision: '123456789abc',
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
        name: '拖拽组件',
        description: '使用 Pointer Events 实现',
        href: 'cases/drag/',
        picUrl: './assets/img/cover/drag.jpg',
        type: 'js',
        tags: ['drag', '交互'],
        create_time: '2026-01-01',
        update_time: '2026-01-02',
      },
      {
        cid: 4002,
        name: 'Canvas 图表',
        description: '绘制扇形图',
        href: 'cases/chart/',
        picUrl: './assets/img/cover/chart.jpg',
        type: 'js',
        tags: ['canvas', '图表'],
        create_time: '2026-01-01',
        update_time: '2026-01-02',
      },
    ],
  };
}

describe('catalog payload validation', () => {
  it('accepts a valid catalog', () => {
    expect(validateCatalogPayloadFixture()).toEqual([]);
  });

  it('rejects invalid revisions and duplicate ids', () => {
    const catalog = createCatalog();
    catalog.revision = 'bad';
    catalog.list[1].cid = 4001;
    const errors = validateCatalogPayloadFixture(catalog);
    expect(errors.some((error) => error.includes('revision'))).toBe(true);
    expect(errors.some((error) => error.includes('duplicate cid'))).toBe(true);
    expect(() => assertCatalogPayload(catalog)).toThrow(CatalogPayloadError);
  });
});

function validateCatalogPayloadFixture(catalog = createCatalog()) {
  try {
    assertCatalogPayload(catalog);
    return [];
  } catch (error) {
    return error instanceof CatalogPayloadError ? error.errors : [String(error)];
  }
}

describe('catalog filtering', () => {
  it('matches name, description and tags without case sensitivity', () => {
    const catalog = createCatalog();
    expect(filterCatalog(catalog, 'CANVAS').map((item) => item.cid)).toEqual([4002]);
    expect(filterCatalog(catalog, 'pointer').map((item) => item.cid)).toEqual([4001]);
    expect(filterCatalog(catalog, '交互').map((item) => item.cid)).toEqual([4001]);
  });

  it('returns all items for an empty query', () => {
    const catalog = createCatalog();
    expect(filterCatalog(catalog, '   ')).toHaveLength(2);
  });

  it('normalizes and caps search input', () => {
    expect(normalizeCatalogQuery('  canvas   chart  ')).toBe('canvas chart');
    expect(normalizeCatalogQuery('x'.repeat(100))).toHaveLength(80);
  });
});

describe('thumbnail paths', () => {
  it('maps cover images into the generated thumbnail directory', () => {
    expect(getThumbnailPath('./assets/img/cover/chart.jpg')).toBe(
      'assets/img/cover/thumbs/chart.jpg.webp',
    );
  });

  it('rejects unsafe paths', () => {
    expect(getThumbnailPath('../cover/chart.jpg')).toBeNull();
    expect(getThumbnailPath('https://example.com/chart.jpg')).toBeNull();
  });
});
