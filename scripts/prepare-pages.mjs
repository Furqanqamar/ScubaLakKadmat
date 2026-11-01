import { readdir, readFile, writeFile } from 'node:fs/promises';
const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
async function prepare(directory) {
for (const entry of await readdir(directory, { withFileTypes: true })) {
  const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
  if (entry.isDirectory()) { await prepare(file); continue; }
  if (!/\.(css|html)$/.test(entry.name)) continue;
  // Only absolute public media URLs, never Angular's relative hashed font URLs.
  const css = (await readFile(file, 'utf8')).replace(/url\((['"]?)\/media\//g, 'url($1/ScubaLakKadmat/media/');
  await writeFile(file, css);
}
}
await prepare(output);
