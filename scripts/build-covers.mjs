import { access, mkdir, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PROJECT_ROOT, getThumbnailRelativePath, loadCatalogSource } from './lib/catalog.mjs';

const check = process.argv.includes('--check');

/** @param {string} relativePath */
async function exists(relativePath) {
  try {
    await access(path.join(PROJECT_ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

const catalog = await loadCatalogSource();
if (!Array.isArray(catalog.list)) {
  console.error('Catalog list is missing.');
  process.exitCode = 1;
} else {
  const outputs = new Set();
  const failures = [];

  for (const item of catalog.list) {
    if (typeof item !== 'object' || item === null || typeof item.picUrl !== 'string') {
      continue;
    }
    const sourcePath = item.picUrl.replace(/^\.\//, '');
    const outputPath = getThumbnailRelativePath(sourcePath);
    if (outputs.has(outputPath)) {
      failures.push(`duplicate thumbnail output: ${outputPath}`);
      continue;
    }
    outputs.add(outputPath);

    try {
      if (check) {
        if (!(await exists(outputPath))) {
          failures.push(`missing thumbnail: ${outputPath}`);
          continue;
        }
        const metadata = await sharp(path.join(PROJECT_ROOT, outputPath)).metadata();
        if (metadata.format !== 'webp') {
          failures.push(`not a WebP file: ${outputPath}`);
        }
        if ((metadata.width ?? 0) > 480 || (metadata.height ?? 0) > 300) {
          failures.push(`thumbnail exceeds 480x300: ${outputPath}`);
        }
      } else {
        const outputAbsolute = path.join(PROJECT_ROOT, outputPath);
        await mkdir(path.dirname(outputAbsolute), { recursive: true });
        await sharp(path.join(PROJECT_ROOT, sourcePath))
          .rotate()
          .resize({
            width: 480,
            height: 300,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toFile(outputAbsolute);
      }
    } catch (error) {
      failures.push(
        `${item.cid} ${sourcePath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const thumbnailDirectory = path.join(PROJECT_ROOT, 'assets/img/cover/thumbs');
  /** @type {string[]} */
  let existingFiles = [];
  try {
    existingFiles = (await readdir(thumbnailDirectory, { withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map((entry) => `assets/img/cover/thumbs/${entry.name}`);
  } catch {
    if (check) {
      failures.push('thumbnail directory is missing');
    }
  }

  for (const existingFile of existingFiles) {
    if (outputs.has(existingFile)) {
      continue;
    }
    if (check) {
      failures.push(`unexpected stale thumbnail: ${existingFile}`);
    } else {
      await unlink(path.join(PROJECT_ROOT, existingFile));
    }
  }

  if (failures.length > 0) {
    console.error(failures.map((failure) => `- ${failure}`).join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`${check ? 'Verified' : 'Generated'} ${outputs.size} WebP covers.`);
  }
}
