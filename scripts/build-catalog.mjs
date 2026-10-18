import { CatalogValidationError, writeCatalogFiles } from './lib/catalog.mjs';

const check = process.argv.includes('--check');

try {
  const result = await writeCatalogFiles({ check });
  const action = check ? 'Verified' : 'Generated';
  console.log(`${action} catalog ${result.revision} with ${result.count} cases.`);
} catch (error) {
  if (error instanceof CatalogValidationError) {
    console.error(error.message);
  } else {
    console.error(error instanceof Error ? error.message : String(error));
  }
  process.exitCode = 1;
}
