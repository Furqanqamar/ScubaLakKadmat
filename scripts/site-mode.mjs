import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { applySiteMode, safeOutputPath } from './site-status-lib.mjs';
import { SITE_MODES, validateSiteStatus } from '../public/status-pages/status-config.mjs';

const mode = process.argv[2];
if (!SITE_MODES.includes(mode)) throw new Error('Usage: npm run site:mode -- live|coming-soon|maintenance');
const configPath = resolve('public/site-status.json');
const config = validateSiteStatus({ ...JSON.parse(await readFile(configPath, 'utf8')), mode });
let baseline;
try { baseline = JSON.parse(await readFile('tmp/site-mode-baseline.json', 'utf8')); }
catch { throw new Error('Run npm run build once before using the build-free local mode switch.'); }
const directory = resolve('dist/scuba-lak/browser');
const manifest = JSON.parse(await readFile(resolve(directory, 'site-release.json'), 'utf8'));
if (baseline.directory !== directory || baseline.createdAt !== manifest.createdAt) throw new Error('The local release cache is stale. Run npm run build once to refresh it.');
for (const path of manifest.documents) {
  if (typeof baseline.originals[path] !== 'string') throw new Error(`Missing original HTML: ${path}`);
}
for (const path of manifest.documents) await writeFile(safeOutputPath(directory, path), baseline.originals[path]);
const result = await applySiteMode(directory, config);
await writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
console.log(`Local mode: ${result.mode}. Updated ${result.documents} HTML documents without an Angular rebuild. Refresh the preview. No remote publication was performed.`);
