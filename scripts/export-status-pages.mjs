import { access, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateSiteStatus } from '../public/status-pages/status-config.mjs';

const destination = resolve(process.argv[2] ?? 'output/standalone-status-pages');
try { await access(destination); throw new Error(`Choose a new export directory; ${destination} already exists.`); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const config = validateSiteStatus(JSON.parse(await readFile('public/site-status.json', 'utf8')));
for (const mode of ['coming-soon', 'maintenance']) {
  const directory = resolve(destination, mode);
  await mkdir(resolve(directory, 'media/brand'), { recursive: true });
  await mkdir(resolve(directory, 'media/illustrations'), { recursive: true });
  const html = (await readFile(resolve('public', mode, 'index.html'), 'utf8')).replace(`href="${mode}/#main-content"`, 'href="./#main-content"');
  await writeFile(resolve(directory, 'index.html'), html);
  await cp('public/status-pages', resolve(directory, 'status-pages'), { recursive: true });
  await writeFile(resolve(directory, 'site-status.json'), JSON.stringify({ ...config, mode }, null, 2) + '\n');
  for (const name of ['scuba-lak-round-48-a83faf497d79.png', 'scuba-lak-round-96-b09e8b7d2b27.png', 'scuba-lak-round-180-c79982ff43e3.png']) await cp(resolve('public/media/brand', name), resolve(directory, 'media/brand', name));
  const hash = mode === 'coming-soon' ? '9b332d1c1517' : '19069de94e5c';
  for (const width of [800, 1280, 1672]) {
    const name = `${mode}-${width}-${hash}.webp`;
    await cp(resolve('public/media/illustrations', name), resolve(directory, 'media/illustrations', name));
  }
  await writeFile(resolve(directory, 'READ-ME.txt'), 'Standalone Scuba Lak holding page\n\nUpload the CONTENTS of this folder to the root of a static web host. No Angular, npm installation, or application build is required. Serve over HTTP/HTTPS, not by opening the HTML as a local file. Edit site-status.json to change the wording and WhatsApp contacts. All artwork and branding are included; online Google Fonts are optional and fall back to system fonts.\n\nThis is not an upload package for the GoDaddy Websites + Marketing editor, which is a separate website-builder product. Do not change email DNS records when connecting the domain to a static host. For the existing Scuba Lak application, use the documented three-way site-mode switch.\n');
  console.log(directory);
}
