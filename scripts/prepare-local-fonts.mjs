import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { prepareBrandFont } from './prepare-brand-font.mjs';

// Same approved typefaces, hosted locally to remove third-party connection cost.
const query = 'https://fonts.googleapis.com/css2?family=Inter:wght@400..800&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap';
const css = await fetch(query, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } }).then(r => { if (!r.ok) throw Error(r.status); return r.text(); });
await mkdir('public/fonts', { recursive: true });
const blocks = [...css.matchAll(/\/\* (latin(?:-ext)?) \*\/\s*(@font-face\s*\{[^}]+\})/g)];
if (blocks.length !== 6) throw Error('Expected Latin and extended Latin for all three faces');
let local = '/* Inter/Playfair Display: SIL OFL. Permanent Marker: Apache 2.0. See accompanying licenses. */\n';
for (const [, subset, block] of blocks) {
  const url = block.match(/url\(([^)]+)\)/)[1];
  const bytes = Buffer.from(await fetch(url).then(r => { if (!r.ok) throw Error(r.status); return r.arrayBuffer(); }));
  const family = block.includes("'Inter'") ? 'inter' : 'playfair';
  const style = /font-style: italic/.test(block) ? 'italic' : 'normal';
  const file = `${family}-${style}-${subset}-${createHash('sha256').update(bytes).digest('hex').slice(0, 12)}.woff2`;
  await writeFile('public/fonts/' + file, bytes);
  local += block.replace(url, file).replace(/font-weight: 400 700;/, 'font-weight: 500 600;') + '\n';
}
local += (await prepareBrandFont()).css;
await writeFile('public/fonts/fonts.css', local);
for (const family of ['inter', 'playfairdisplay']) {
  const response = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);
  if (!response.ok) throw Error('Missing font license');
  await writeFile(`public/fonts/${family}-OFL.txt`, await response.text());
}
console.log(local.match(/url\([^)]+\)/g).join('\n'));
