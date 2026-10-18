import { describe, expect, it } from 'vitest';
import { PROJECT_ROOT, loadCatalogSource, validateCatalog } from '../../scripts/lib/catalog.mjs';

describe('canonical catalog', () => {
  it('contains 92 valid cases and all referenced assets', async () => {
    const catalog = await loadCatalogSource();
    const errors = await validateCatalog(catalog, { rootDir: PROJECT_ROOT });
    expect(errors).toEqual([]);
    expect(catalog.list).toHaveLength(92);
    expect(catalog.categories).toHaveLength(6);
    expect(catalog.list.find((item) => item.cid === 6001)?.href).toBe('cases/pushbox/');
    expect(catalog.categories.find((category) => category.type === 'ai')?.icon).toBe('felab-code');
  });

  it('rejects duplicate ids and unsafe external credentials', async () => {
    const source = await loadCatalogSource();
    const catalog = structuredClone(source);
    catalog.list[1].cid = catalog.list[0].cid;
    catalog.list[2].href = 'https://user:pass@example.com/private';
    const errors = await validateCatalog(catalog, { rootDir: PROJECT_ROOT });
    expect(errors.some((error) => error.includes('duplicate cid'))).toBe(true);
    expect(errors.some((error) => error.includes('must not contain credentials'))).toBe(true);
  });
});
