import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { applySiteMode } from './site-status-lib.mjs';

export async function allHtml(directory, prefix = '') {
  const paths = [];
  for (const entry of await readdir(resolve(directory, prefix), { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error('Release must not contain symbolic links.');
    if (entry.isDirectory()) paths.push(...await allHtml(directory, path + '/'));
    else if (entry.name.endsWith('.html')) paths.push(path);
  }
  return paths;
}

export async function prepareEnvironment(directory, environment, commit, runId) {
  if (!['qa', 'production'].includes(environment)) throw new Error('Choose qa or production.');
  if (!/^[a-f0-9]{40}$/.test(commit) || !/^\d+$/.test(runId)) throw new Error('A full source commit and QA run ID are required.');
  const base = environment === 'qa' ? '/ScubaLakKadmat/' : '/';
  const manifest = JSON.parse(await readFile(resolve(directory, 'site-release.json'), 'utf8'));
  if (manifest.base !== base) throw new Error(`Expected deployment base ${base}.`);
  if (await access(resolve(directory, 'CNAME')).then(() => true, () => false)) throw new Error('Do not attach the production domain to the QA host.');
  const config = JSON.parse(await readFile(resolve(directory, 'site-status.json'), 'utf8'));
  // The committed config controls production only. QA always shows the complete app.
  if (environment === 'qa') await applySiteMode(directory, { ...config, mode: 'live' });
  for (const path of await allHtml(directory)) {
    const file = resolve(directory, path);
    let html = await readFile(file, 'utf8');
    if (/<meta\b[^>]+http-equiv="refresh"/i.test(html) && !/<base\b/i.test(html)) {
      html = html.replace('</head>', `<base href="${base}"></head>`);
      if (environment === 'qa') html = html.replace(/(url=|href=")\/(?!\/|ScubaLakKadmat\/)/g, `$1${base}`);
    }
    if (!html.includes(`<base href="${base}">`)) throw new Error(`Wrong base URL: ${path}`);
    if (html.includes('data-site-gated="true"')) throw new Error('Prepare environments from a clean release, before applying production mode.');
    html = html.replace(/<meta\b[^>]*name="scubalak-environment"[^>]*>/gi, '');
    html = html.replace('</head>', `<meta name="scubalak-environment" content="${environment}"></head>`);
    if (environment === 'qa') {
      html = html.replace(/<meta\b[^>]*name="robots"[^>]*>/gi, '');
      html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow, noarchive"></head>');
      html = html.replace(/<title>(?:\[QA \/ UAT\] )?([^<]*)<\/title>/, '<title>[QA / UAT] $1</title>');
    }
    await writeFile(file, html);
  }
  if (environment === 'qa') {
    // Crawlers must be allowed to read the noindex directive; robots disallow alone
    // does not prevent a URL being indexed. No QA pages are advertised in a sitemap.
    await writeFile(resolve(directory, 'robots.txt'), 'User-agent: *\nAllow: /\n# QA/UAT: all HTML pages carry noindex, nofollow, noarchive.\n');
    await writeFile(resolve(directory, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
  }
  const metadata = { version: 1, environment, sourceCommit: commit, qaRunId: runId, base, builtAt: new Date().toISOString() };
  await writeFile(resolve(directory, 'deployment.json'), JSON.stringify(metadata, null, 2) + '\n');
  return metadata;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [directory, environment, commit, runId] = process.argv.slice(2);
  if (!directory) throw new Error('Usage: prepare-environment.mjs DIRECTORY qa|production COMMIT QA_RUN_ID');
  console.log(await prepareEnvironment(resolve(directory), environment, commit, runId));
}
