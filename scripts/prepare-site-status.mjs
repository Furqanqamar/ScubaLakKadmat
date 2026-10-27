import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { htmlPaths } from './site-status-lib.mjs';
import { validateSiteStatus } from '../public/status-pages/status-config.mjs';

const directory = resolve('dist/scuba-lak/browser');
const home = await readFile(resolve(directory, 'index.html'), 'utf8');
const base = home.match(/<base href="([^"]+)"/)?.[1];
if (!base || !/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) throw new Error('A safe root or subfolder base URL is required.');
validateSiteStatus(JSON.parse(await readFile(resolve(directory, 'site-status.json'), 'utf8')));
for (const mode of ['coming-soon', 'maintenance']) {
  const file = resolve(directory, mode, 'index.html');
  await writeFile(file, (await readFile(file, 'utf8')).replace(/<base href="[^"]+">/, `<base href="${base}">`));
}
const documents = await htmlPaths(directory);
const createdAt = new Date().toISOString();
await writeFile(resolve(directory, 'site-release.json'), JSON.stringify({ version: 1, createdAt, base, documents }, null, 2) + '\n');
const originals = {};
for (const path of documents) originals[path] = await readFile(resolve(directory, path), 'utf8');
await mkdir('tmp', { recursive: true });
await writeFile('tmp/site-mode-baseline.json', JSON.stringify({ directory, createdAt, originals }));
console.log(`Standalone pages prepared for ${base}; ${documents.length} original HTML documents cached for build-free local switching.`);
