import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// This face is only used for the two fixed brand lines, never page content.
export async function prepareBrandFont() {
  const copy = await readFile('src/app/data/site-copy.ts', 'utf8');
  const brand = copy.match(/brand:\s*\{([\s\S]*?)\n\s*\}/)?.[1];
  const text = ['name', 'tagline'].map(key => {
    const value = brand?.match(new RegExp(`\\b${key}: '([^']+)'`))?.[1];
    if (!value) throw Error(`Missing brand ${key}`);
    return value;
  }).join(' ');
  const query = new URL('https://fonts.googleapis.com/css2');
  query.searchParams.set('family', 'Permanent Marker');
  query.searchParams.set('display', 'swap');
  query.searchParams.set('text', text);
  const response = await fetch(query, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } });
  if (!response.ok) throw Error(`Brand font CSS: ${response.status}`);
  const css = await response.text();
  const url = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1];
  if (!url || new URL(url).hostname !== 'fonts.gstatic.com') throw Error('Expected an official WOFF2 font');
  const fontResponse = await fetch(url);
  if (!fontResponse.ok) throw Error(`Brand font file: ${fontResponse.status}`);
  const bytes = Buffer.from(await fontResponse.arrayBuffer());
  if (bytes.toString('ascii', 0, 4) !== 'wOF2' || bytes.length > 12000) throw Error('Expected a small brand-only WOFF2 subset');
  const file = `permanent-marker-brand-${createHash('sha256').update(bytes).digest('hex').slice(0, 12)}.woff2`;
  const license = await fetch('https://raw.githubusercontent.com/google/fonts/main/apache/permanentmarker/LICENSE.txt');
  if (!license.ok) throw Error('Missing Permanent Marker license');
  await mkdir('public/fonts', { recursive: true });
  await writeFile(`public/fonts/${file}`, bytes);
  await writeFile('public/fonts/permanent-marker-LICENSE.txt', await license.text());
  return { file, bytes: bytes.length, css: css.replace(url, file) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(await prepareBrandFont());
