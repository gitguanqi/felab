import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { getNextCatalogCid, loadCatalogSource, writeCatalogFiles } from './lib/catalog.mjs';

const readline = createInterface({ input, output });

/** @param {string} question */
async function ask(question) {
  const answer = (await readline.question(question)).trim();
  if (!answer) {
    throw new Error('Input cannot be empty.');
  }
  return answer;
}

try {
  const catalog = await loadCatalogSource();
  const categories = Array.isArray(catalog.categories) ? catalog.categories : [];
  if (categories.length === 0 || !Array.isArray(catalog.list)) {
    throw new Error('Catalog categories or list are missing.');
  }

  console.log('Categories:');
  categories.forEach((category, index) => {
    console.log(`  ${index + 1}. ${category.title} (${category.type})`);
  });
  const categoryIndex = Number(await ask('Choose a category number: ')) - 1;
  const category = categories[categoryIndex];
  if (!category) {
    throw new Error('Unknown category.');
  }

  const names = catalog.list.map((item) => item.name);
  const name = await ask('Case name: ');
  if (names.includes(name)) {
    throw new Error(`A case named "${name}" already exists.`);
  }
  const description = await ask('Description: ');
  const href = await ask('Case URL or relative path: ');
  const picUrlInput = await ask('Cover path (assets/img/cover/name.jpg): ');
  const picUrl = picUrlInput.startsWith('./') ? picUrlInput : `./${picUrlInput}`;
  const tags = (await ask('Tags, comma separated: '))
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const cid = getNextCatalogCid(catalog, category.type);
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  const item = {
    cid,
    name,
    description,
    href,
    picUrl,
    type: category.type,
    tags,
    create_time: today,
    update_time: today,
  };

  catalog.list.push(item);
  const result = await writeCatalogFiles({ catalog });
  console.log(`Added case ${cid}. Catalog revision: ${result.revision}.`);
  console.log('Run pnpm covers:build if the cover is new.');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  readline.close();
}
