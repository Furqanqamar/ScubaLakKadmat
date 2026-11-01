import { readFile, readdir, writeFile } from 'node:fs/promises';

const output = new URL('../dist/scuba-lak/browser/', import.meta.url);
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) { await visit(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = await readFile(file, 'utf8');
    const main = html.match(/<script\b[^>]*src="(main-[\w-]+\.js)"[^>]*type="module"/)?.[1];
    if (!main) continue;
    const preloaded = new Set([...html.matchAll(/<link\b[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g)].map(match => match[1]));
    const seen = new Set();
    const needed = [];
    async function dependencies(name) {
      if (seen.has(name)) return;
      seen.add(name);
      const source = await readFile(new URL(name, output), 'utf8');
      for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*)(['"])(\.\/(?:chunk|main)-[\w-]+\.js)\1/g)) {
        const dependency = match[2].slice(2);
        if (!preloaded.has(dependency)) { preloaded.add(dependency); needed.push(dependency); }
        await dependencies(dependency);
      }
    }
    await dependencies(main);
    html = html.replace('</head>', needed.map(name => `<link rel="modulepreload" href="${name}">`).join('\n') + '\n</head>');
    await writeFile(file, html);
  }
}
await visit(output);
console.log('Startup preloads: initial module dependencies discovered with the document, without preloading other routes.');
