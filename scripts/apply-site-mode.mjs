import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { applySiteMode } from './site-status-lib.mjs';

const args = process.argv.slice(2);
const option = name => args[args.indexOf(name) + 1];
if (!args.includes('--directory') || !args.includes('--config')) throw new Error('Usage: node scripts/apply-site-mode.mjs --directory RELEASE --config CONFIG [--mode live|coming-soon|maintenance]');
const config = JSON.parse(await readFile(resolve(option('--config')), 'utf8'));
if (args.includes('--mode')) config.mode = option('--mode');
console.log(await applySiteMode(resolve(option('--directory')), config));
if (args.includes('--persist-config')) await writeFile(resolve(option('--config')), JSON.stringify(config, null, 2) + '\n');
