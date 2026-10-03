import { readdir, readFile, writeFile, copyFile } from 'node:fs/promises';
const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) result.push(...await walk(file));
    else if (entry.name === 'index.html') result.push(file);
  }
  return result;
}
const urls = [];
for (const file of await walk(output)) {
  const html = await readFile(file, 'utf8');
  if (/<meta[^>]+name="robots"[^>]+content="noindex/i.test(html)) continue;
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (!canonical) throw new Error(`Missing canonical: ${file}`);
  urls.push(canonical);
}
if (new Set(urls).size !== urls.length) throw new Error('Duplicate canonical URLs in prerendered pages');
const home = new URL('index.html', output);
const html = await readFile(home, 'utf8');
const site = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
if (!site) throw new Error('Homepage canonical is required');
await writeFile(new URL('sitemap.xml', output), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.sort().map(url => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(new URL('robots.txt', output), `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`);
await copyFile(new URL('404/index.html', output), new URL('404.html', output));
console.log(`SEO output: ${urls.length} canonical pages, generated sitemap, robots.txt and noindex 404.`);
