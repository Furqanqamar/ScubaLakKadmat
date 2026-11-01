import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { validateSiteStatus } from '../public/status-pages/status-config.mjs';

export async function htmlPaths(directory, prefix = '') {
  const paths = [];
  for (const entry of await readdir(resolve(directory, prefix), { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) {
      if (!['coming-soon', 'maintenance'].includes(relative)) paths.push(...await htmlPaths(directory, relative + '/'));
    } else if (entry.name.endsWith('.html')) paths.push(relative);
  }
  return paths.sort();
}

export function safeOutputPath(directory, path) {
  const target = resolve(directory, path);
  if (!target.startsWith(resolve(directory) + sep)) throw new Error('Invalid release document path.');
  return target;
}

export async function applySiteMode(directory, config) {
  validateSiteStatus(config);
  const manifest = JSON.parse(await readFile(resolve(directory, 'site-release.json'), 'utf8'));
  if (manifest.version !== 1 || !Array.isArray(manifest.documents) || !manifest.documents.includes('index.html')) throw new Error('Publish a release containing the standalone status pages first.');
  const home = await readFile(resolve(directory, 'index.html'), 'utf8');
  if (home.includes('data-site-gated="true"')) throw new Error('Use the clean release artifact, or the local site:mode command, to restore and switch modes safely.');
  let template;
  if (config.mode !== 'live') {
    template = (await readFile(resolve(directory, config.mode, 'index.html'), 'utf8')).replace('<html ', '<html data-site-gated="true" ');
    if (!template.includes(`data-status-page="${config.mode}"`) || /<app-root\b/.test(template)) throw new Error('Invalid standalone page template.');
    for (const path of manifest.documents) await writeFile(safeOutputPath(directory, path), template);
  }
  await writeFile(resolve(directory, 'site-status.json'), JSON.stringify(config, null, 2) + '\n');
  return { mode: config.mode, documents: manifest.documents.length };
}
