import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const directory = resolve(process.argv[2] ?? 'dist/scuba-lak/browser');
const files = {};
for (const folder of ['hero', 'originals']) {
  for (const name of (await readdir(resolve(directory, 'media', folder))).sort()) {
    if (!/-[a-f0-9]{12}\.(mp4|webm)$/.test(name)) continue;
    const path = `/media/${folder}/${name}`;
    files[path] = (await stat(resolve(directory, '.' + path))).size;
  }
}
if (!Object.keys(files).length || Object.keys(files).some(path => path.length > 100)) throw Error('Invalid video delivery routes');
const source = await readFile('services/video-delivery/worker.mjs', 'utf8');
await writeFile(resolve(directory, '_worker.js'), source + `\nexport default createVideoDelivery(${JSON.stringify(files)});\n`);
await writeFile(resolve(directory, '_routes.json'), JSON.stringify({ version: 1, include: Object.keys(files), exclude: [] }, null, 2) + '\n');
console.log(`Video delivery: ${Object.keys(files).length} immutable video routes; other requests remain static.`);
