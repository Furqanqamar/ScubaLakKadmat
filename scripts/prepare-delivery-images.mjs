import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';

// Add sizes from the same orientation-corrected source PNGs, not from a lossy
// thumbnail. Original uploads, existing full-resolution files and video stay intact.
for (const [family, type] of [['original', 'ORIGINAL'], ['additional', 'ADDITIONAL']]) {
  const file = `src/app/data/${family}-image-info.generated.ts`;
  const text = readFileSync(file, 'utf8');
  const start = text.indexOf(' = ') + 3;
  const info = JSON.parse(text.slice(start).trim().replace(/;$/, ''));
  for (const [url, item] of Object.entries(info)) {
    const id = url.match(/\/([^/]+)-\d+-[a-f0-9]+\.webp$/)?.[1];
    const source = `tmp/${family === 'original' ? 'original-media' : 'additional-photos'}/${id}.png`;
    if (!id || !existsSync(source)) throw new Error(`Missing native import: ${source}. Run the original import script first.`);
    const variants = item.srcset.split(', ').map(entry => { const [url, w] = entry.split(' '); return { url, width: parseInt(w) }; });
    for (const width of [640, 704, 1024, 1280, 1600].filter(width => width < item.width && !variants.some(item => item.width === width))) {
      const target = `tmp/${family === 'original' ? 'original-media' : 'additional-photos'}/${id}-${width}-delivery.webp`;
      execFileSync('cwebp', ['-quiet', '-q', '90', '-m', '6', '-sharp_yuv', '-metadata', 'none', '-resize', String(width), '0', source, '-o', target]);
      const bytes = readFileSync(target), hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
      const output = `media/originals/${id}-${width}-${hash}.webp`;
      copyFileSync(target, `public/${output}`);
      variants.push({ url: output, width });
    }
    item.srcset = variants.sort((a, b) => a.width - b.width).map(item => `${item.url} ${item.width}w`).join(', ');
  }
  writeFileSync(file, text.slice(0, start) + JSON.stringify(info, null, 2) + ';\n');
  console.log(`Prepared ${Object.keys(info).length} ${type.toLowerCase()} image sets without changing full-size assets.`);
}
