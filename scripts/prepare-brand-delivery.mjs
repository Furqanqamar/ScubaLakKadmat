import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// Preserve the circular PNG masters and all favicons. Only the header/footer
// delivery format changes; -lossless -exact retains every RGBA pixel.
const generated = 'src/app/data/brand-assets.generated.ts';
const assets = JSON.parse(readFileSync(generated, 'utf8').match(/BRAND_ASSETS = ([\s\S]*?) as const;/)[1]);
mkdirSync('tmp/brand-delivery', { recursive: true });
const variants = [];
for (const [width, source] of [[96, assets.favicon96], [192, assets.appIcon192]]) {
  const temporary = `tmp/brand-delivery/${width}.webp`;
  execFileSync('cwebp', ['-quiet', '-lossless', '-exact', '-m', '6', 'public/' + source, '-o', temporary]);
  const bytes = readFileSync(temporary);
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const path = `media/brand/scuba-lak-round-${width}-${hash}.webp`;
  writeFileSync('public/' + path, bytes);
  variants.push({ width, path, bytes: bytes.length, originalBytes: readFileSync('public/' + source).length });
}
assets.logoSrc = variants[0].path;
assets.logoSrcset = variants.map(item => `${item.path} ${item.width}w`).join(', ');
writeFileSync(generated, '// Generated from the supplied restored artwork by prepare-brand-logo.mjs and prepare-brand-delivery.mjs.\nexport const BRAND_ASSETS = ' + JSON.stringify(assets, null, 2) + ' as const;\n');
console.log(JSON.stringify({ encoding: 'lossless exact RGBA', variants }, null, 2));
