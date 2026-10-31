import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// Pass a local JSON map of scene ids to original PNG paths. Originals are never edited.
const sourceFile = process.argv[2];
if (!sourceFile) throw new Error('Usage: node scripts/optimize-generated-images.mjs <source-map.json>');
const sources = JSON.parse(readFileSync(sourceFile, 'utf8'));
const scenes = JSON.parse(readFileSync(new URL('./image-scenes.json', import.meta.url), 'utf8'));
mkdirSync('public/media/generated', { recursive: true });
for (const [id, source] of Object.entries(sources)) {
  if (!(id in scenes) || typeof source !== 'string') throw new Error(`Invalid source: ${id}`);
  const output = `public/media/generated/${id}.webp`;
  if (existsSync(output)) continue;
  const result = spawnSync('cwebp', ['-quiet', '-q', '88', '-m', '6', source, '-o', output], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`Could not optimize ${id}`);
  console.log(output);
}
