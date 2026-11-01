import { mkdir, writeFile } from 'node:fs/promises';
import { DIVE_ICONS, DIVE_ICON_STYLE } from '../src/app/data/dive-icons';
import type { DiveIconPath } from '../src/app/models/dive-icon.model';

const folder = new URL('../tmp/dive-icon-review/', import.meta.url);
const escape = (value: string): string => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const renderPaths = (art: readonly DiveIconPath[]): string => art.map(path => `<path d="${escape(path.d)}"${path.transform ? ` transform="${escape(path.transform)}"` : ''}/>`).join('');
const draw = (art: readonly DiveIconPath[], x: number, y: number, size: number, color: string): string => `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${DIVE_ICON_STYLE.viewBox}" fill="none" stroke="${color}" stroke-width="${DIVE_ICON_STYLE.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${renderPaths(art)}</svg>`;
await mkdir(folder, { recursive: true });
const tiles: string[] = [];
for (const [index, [name, art]] of Object.entries(DIVE_ICONS).entries()) {
  const column = index % 5, row = Math.floor(index / 5);
  const x = 24 + column * 232, y = 110 + row * 272;
  tiles.push(`<g><rect x="${x}" y="${y}" width="216" height="250" rx="16" fill="white" stroke="#dce4e4"/>${draw(art, x + 44, y + 22, 128, '#10282d')}<text x="${x + 108}" y="${y + 174}" text-anchor="middle" fill="#10282d" font-family="Arial, sans-serif" font-size="14">${name}</text><rect x="${x + 14}" y="${y + 190}" width="188" height="48" rx="10" fill="#10282d"/>${draw(art, x + 90, y + 196, 36, '#b8f2df')}</g>`);
  await writeFile(new URL(`${name}.svg`, folder), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DIVE_ICON_STYLE.viewBox}" width="400" height="400" fill="none" stroke="#10282d" stroke-width="${DIVE_ICON_STYLE.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${renderPaths(art)}</svg>`);
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="946" viewBox="0 0 1200 946"><rect width="1200" height="946" fill="#f4f1e9"/><text x="32" y="48" fill="#10282d" font-family="Arial, sans-serif" font-size="26" font-weight="600">SCUBA LAK · DIVING ICON SYSTEM</text><text x="32" y="78" fill="#627577" font-family="Arial, sans-serif" font-size="14">128 px construction review / 36 px small-size review · consistent 1.8-unit round strokes</text>${tiles.join('')}</svg>`;
await writeFile(new URL('contact-sheet.svg', folder), svg);
console.log(`Rendered ${Object.keys(DIVE_ICONS).length} standalone SVGs and a large/small-size contact sheet in ${folder.pathname}`);
