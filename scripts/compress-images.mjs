import { randomUUID } from 'node:crypto';
import { readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import sharp from 'sharp';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_IMAGE_DIR = path.join(PROJECT_ROOT, 'assets', 'img');
const JPEG_EXTENSIONS = new Set(['.jpg', '.jpeg']);
const SUPPORTED_EXTENSIONS = new Set([...JPEG_EXTENSIONS, '.png']);

function normalizeQuality(rawQuality = "0.8") {
  const numericQuality = Number(rawQuality);

  if (!Number.isFinite(numericQuality) || numericQuality <= 0) {
    throw new Error('[images] quality must be greater than 0.');
  }

  const percentage =
    numericQuality <= 1 ? numericQuality * 100 : numericQuality;

  if (percentage > 100) {
    throw new Error('[images] quality must be between 0.01-1 or 1-100.');
  }

  return Math.round(percentage);
}

function formatBytes(bytes = 0) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatSavings(before = 0, after = 0) {
  const percentage = ((before - after) / before) * 100;
  return `${percentage.toFixed(1)}%`;
}

// @ts-ignore
async function collectImages(directory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  entries.sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectImages(entryPath)));
      continue;
    }

    if (
      entry.isFile() &&
      SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
    ) {
      files.push(entryPath);
    }
  }

  return files;
}

async function compressImage(filePath = "", quality = 0.8) {
  const extension = path.extname(filePath).toLowerCase();
  const temporaryPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}-${randomUUID()}${extension}`,
  );
  const before = await stat(filePath);

  try {
    const image = sharp(filePath, { failOn: 'error' }).rotate();
    const output = JPEG_EXTENSIONS.has(extension)
      ? image.jpeg({ quality, mozjpeg: true, progressive: true })
      : image.png({
          quality,
          palette: true,
          compressionLevel: 9,
          effort: 7,
        });

    await output.toFile(temporaryPath);
    const after = await stat(temporaryPath);

    if (after.size >= before.size) {
      return { changed: false, before: before.size, after: after.size };
    }

    await rename(temporaryPath, filePath);
    return { changed: true, before: before.size, after: after.size };
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

function printUsage() {
  console.log(
    [
      'Usage: node scripts/compress-images.mjs [directory] [options]',
      '',
      'Options:',
      '  --quality <number>  Compression quality (default: 0.8, also accepts 80)',
      '  --help              Show this help message',
      '',
      `Default directory: ${DEFAULT_IMAGE_DIR}`,
      'Only .jpg, .jpeg, and .png files are processed in place.',
    ].join('\n'),
  );
}

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      quality: { type: 'string', default: '0.8' },
      help: { type: 'boolean' },
    },
    allowPositionals: true,
  });

  if (values.help) {
    printUsage();
    return;
  }

  if (positionals.length > 1) {
    throw new Error('[images] only one image directory can be provided.');
  }

  const directory = path.resolve(positionals[0] ?? DEFAULT_IMAGE_DIR);
  const directoryStat = await stat(directory).catch(() => null);

  if (!directoryStat?.isDirectory()) {
    throw new Error(`[images] directory not found: ${directory}`);
  }

  const quality = normalizeQuality(values.quality);
  const images = await collectImages(directory);
  const failures = [];
  let compressed = 0;
  let skipped = 0;

  console.log(
    `[images] scanning ${directory} with quality ${quality} (${images.length} images)`,
  );

  for (const image of images) {
    const relativePath = path.relative(directory, image);

    try {
      const result = await compressImage(image, quality);

      if (result.changed) {
        compressed += 1;
        console.log(
          `[compressed] ${relativePath}: ${formatBytes(result.before)} -> ${formatBytes(result.after)} (-${formatSavings(result.before, result.after)})`,
        );
      } else {
        skipped += 1;
        console.log(
          `[skipped] ${relativePath}: output was not smaller (${formatBytes(result.after)})`,
        );
      }
    } catch (error) {
      failures.push(relativePath);
      console.error(
        `[failed] ${relativePath}: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  console.log(
    `[images] done: ${compressed} compressed, ${skipped} skipped, ${failures.length} failed`,
  );

  if (failures.length > 0) {
    throw new Error(
      `[images] ${failures.length} image(s) could not be processed.`,
    );
  }
}

function isMainModule() {
  return (
    process.argv[1] &&
    pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
  );
}

if (isMainModule()) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
