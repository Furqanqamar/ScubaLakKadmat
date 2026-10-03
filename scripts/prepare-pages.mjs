import { readdir, readFile, writeFile, copyFile } from 'node:fs/promises';
const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
for (const filename of await readdir(output)) {
  if (!filename.endsWith('.css')) continue;
  const file = new URL(filename, output);
  // Only absolute public media URLs, never Angular's relative hashed font URLs.
  const css = (await readFile(file, 'utf8')).replace(/url\((['"]?)\/media\//g, 'url($1/ScubaLakKadmat/media/');
  await writeFile(file, css);
}
await copyFile(new URL('index.html', output), new URL('404.html', output));
