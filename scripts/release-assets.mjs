import { copyFile, readdir, readFile, rm, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const textExtensions = /\.(?:html|css|js|mjs|json|webmanifest)$/;
const mediaReference = /media\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|svg|ico|mp4|webm)\b/g;

async function files(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(resolve(directory, prefix), { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Release assets must not be symlinks: ${path}`);
    if (entry.isDirectory()) result.push(...await files(directory, path + '/'));
    else result.push(path);
  }
  return result;
}

export async function referencedMedia(directory) {
  const paths = await files(directory);
  const available = new Set(paths);
  const referenced = new Set();
  for (const path of paths.filter(path => !path.startsWith('media/') && textExtensions.test(path))) {
    const content = await readFile(resolve(directory, path), 'utf8');
    for (const match of content.matchAll(mediaReference)) {
      const asset = match[0];
      if (asset.includes('..')) throw new Error(`Invalid media reference in ${path}`);
      referenced.add(asset);
      // ResponsiveImageDirective derives these candidates for the older artwork.
      if (/^media\/generated\/.+\.webp$/.test(asset) && !/-(?:480|800)\.webp$/.test(asset)) {
        for (const width of [480, 800]) referenced.add(asset.slice(0, -5) + `-${width}.webp`);
      }
    }
  }
  for (const path of referenced) if (!available.has(path)) throw new Error(`Missing release media: ${path}`);
  return { paths, referenced };
}

export async function pruneReleaseMedia(directory) {
  directory = resolve(directory);
  const { paths, referenced } = await referencedMedia(directory);
  const removed = [];
  let retainedBytes = 0;
  for (const path of paths.filter(path => path.startsWith('media/'))) {
    const bytes = (await stat(resolve(directory, path))).size;
    if (referenced.has(path)) retainedBytes += bytes;
    else removed.push({ path, bytes });
  }
  // Never alter the source library or its backups. Only a compiled output tree
  // containing the application's HTML and bundles may be pruned.
  const sourceMedia = resolve('public/media');
  if (directory === sourceMedia || directory.startsWith(sourceMedia + sep)
    || relative(directory, resolve('public')).split(sep)[0] !== '..'
    || !paths.includes('index.html') || !paths.some(path => /^main-[\w-]+\.js$/.test(path))) {
    throw new Error('Choose the compiled browser release, not source files.');
  }
  for (const asset of removed) await rm(resolve(directory, asset.path));
  return { retainedFiles: referenced.size, retainedBytes, removedFiles: removed.length, removedBytes: removed.reduce((sum, item) => sum + item.bytes, 0), removed };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const directory = resolve(process.argv[2] ?? 'dist/scuba-lak/browser');
  const result = await pruneReleaseMedia(directory);
  await copyFile(resolve(directory, '../3rdpartylicenses.txt'), resolve(directory, '3rdpartylicenses.txt'));
  await mkdir(resolve(directory, 'licenses'), { recursive: true });
  await copyFile('node_modules/@fortawesome/fontawesome-free/LICENSE.txt', resolve(directory, 'licenses/fontawesome.txt'));
  await mkdir('tmp', { recursive: true });
  await writeFile('tmp/release-assets.json', JSON.stringify(result, null, 2) + '\n');
  console.log(`Release assets: ${result.retainedFiles} referenced media files; excluded ${result.removedFiles} unused files (${(result.removedBytes / 1048576).toFixed(1)} MB). Source library unchanged.`);
}
