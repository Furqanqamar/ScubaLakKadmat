import { readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const directory = new URL('../public/media/generated/', import.meta.url);
for (const filename of await readdir(directory)) {
  if (!filename.endsWith('.webp') || /-(480|800)\.webp$/.test(filename)) continue;
  for (const width of [480, 800]) {
    execFileSync('cwebp', ['-quiet', '-q', '86', '-resize', String(width), '0', fileURLToPath(new URL(filename, directory)), '-o', fileURLToPath(new URL(filename.replace('.webp', `-${width}.webp`), directory))]);
  }
}
