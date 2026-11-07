import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'src/assets';
const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const DELETE_ORIGINALS = false; // flip to true once you've verified results

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTENSIONS.has(ext)) continue;

  const output = file.slice(0, -ext.length) + '.webp';
  await sharp(file).webp({ quality: 85, alphaQuality: 100 }).toFile(output);

  const before = (await stat(file)).size;
  const after = (await stat(output)).size;
  console.log(`${file}: ${(before / 1024).toFixed(1)}KB -> ${(after / 1024).toFixed(1)}KB`);

  if (DELETE_ORIGINALS) await unlink(file);
}