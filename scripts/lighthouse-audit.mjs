import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const arg = (key, fallback) => process.argv.includes(key) ? process.argv[process.argv.indexOf(key) + 1] : fallback;
const base = arg('--url', 'https://furqanqamar.github.io/ScubaLakKadmat/');
const directory = resolve(arg('--output-dir', 'tmp/lighthouse-after-2026-10-30'));
const runs = Number(arg('--runs', '3'));
if (!/^https?:\/\//.test(base) || !base.endsWith('/') || ![1, 3].includes(runs)) throw Error('Use an http(s) directory URL and --runs 1 or 3');
await mkdir(directory, { recursive: true });
if ((await readdir(directory)).length) throw Error('Use an empty output directory; previous audit evidence must not be overwritten');
const deployment = await fetch(base + 'deployment.json').then(r => r.ok ? r.json() : null).catch(() => null);
const context = { base, started: new Date().toISOString(), lighthouse: '13.6.0', node: process.version, deployment, runs, method: 'Serial isolated cold-client navigation; standard mobile simulation and desktop preset; real media/loader enabled; no form submissions.' };
await writeFile(resolve(directory, 'audit-context.json'), JSON.stringify(context, null, 2));
const results = [];
for (const page of [{ name: 'home', path: '' }, { name: 'lagoon-diving', path: 'experiences/lagoon-diving/' }, { name: 'gallery', path: 'gallery/' }]) for (let run = 1; run <= runs; run++) for (const device of ['mobile', 'desktop']) {
  const id = `${page.name}-${device}-${run}`, prefix = resolve(directory, id);
  const args = ['exec', '--yes', '--package=lighthouse@13.6.0', '--', 'lighthouse', base + page.path, '--only-categories=performance,accessibility,best-practices,seo', '--output=json', '--output=html', `--output-path=${prefix}`, '--chrome-flags=--headless', '--max-wait-for-load=60000', '--quiet', '--no-enable-error-reporting'];
  if (device === 'desktop') args.push('--preset=desktop');
  if (run === 1) args.push('--save-assets');
  console.log(JSON.stringify({ event: 'start', id }));
  const code = await new Promise((done, reject) => { const child = spawn('npm', args, { stdio: 'inherit', env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' } }); child.once('error', reject); child.once('exit', done); });
  if (code !== 0) throw Error(`Lighthouse failed: ${id}`);
  const report = JSON.parse(await readFile(prefix + '.report.json', 'utf8'));
  if (report.runtimeError) throw Error(JSON.stringify(report.runtimeError));
  const metrics = Object.fromEntries(Object.entries({ lcp: 'largest-contentful-paint', cls: 'cumulative-layout-shift', tbt: 'total-blocking-time', bytes: 'total-byte-weight', fcp: 'first-contentful-paint' }).map(([name, key]) => [name, report.audits[key].numericValue]));
  const item = { page: page.name, device, run, id, categories: Object.fromEntries(Object.entries(report.categories).map(([name, item]) => [name, Math.round(item.score * 100)])), metrics, browser: report.environment.hostUserAgent, warnings: report.runWarnings, labelMismatch: report.audits['label-content-name-mismatch']?.score };
  results.push(item); await writeFile(resolve(directory, 'results.json'), JSON.stringify(results, null, 2)); console.log(JSON.stringify({ event: 'complete', ...item }));
}
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const summary = [];
for (const page of ['home', 'lagoon-diving', 'gallery']) for (const device of ['mobile', 'desktop']) {
  const group = results.filter(item => item.page === page && item.device === device);
  summary.push({ page, device, performance: median(group.map(item => item.categories.performance)), range: group.map(item => item.categories.performance), accessibility: median(group.map(item => item.categories.accessibility)), bestPractices: median(group.map(item => item.categories['best-practices'])), seo: median(group.map(item => item.categories.seo)), lcp: median(group.map(item => item.metrics.lcp)), cls: median(group.map(item => item.metrics.cls)), maxCls: Math.max(...group.map(item => item.metrics.cls)), tbt: median(group.map(item => item.metrics.tbt)), bytes: median(group.map(item => item.metrics.bytes)) });
}
await writeFile(resolve(directory, 'summary.json'), JSON.stringify(summary, null, 2));
const after = await fetch(base + 'deployment.json').then(r => r.ok ? r.json() : null).catch(() => null);
await writeFile(resolve(directory, 'deployment-after.json'), JSON.stringify(after, null, 2));
if (deployment && deployment.sourceCommit !== after?.sourceCommit) throw Error('Deployment changed during the audit; do not compare these mixed-build results');
const rows = summary.map(item => `<tr><th>${item.page}</th><td>${item.device}</td><td>${item.performance} (${item.range.join(', ')})</td><td>${item.accessibility}</td><td>${item.bestPractices}</td><td>${item.seo}</td><td>${(item.lcp / 1000).toFixed(2)} s</td><td>${item.cls.toFixed(4)}</td><td>${Math.round(item.tbt)} ms</td><td>${(item.bytes / 1048576).toFixed(2)} MiB</td></tr>`).join('');
await writeFile(resolve(directory, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Scuba Lak — after-change Lighthouse audit</title><style>body{font:16px/1.7 system-ui;margin:40px;color:#10282d;background:#f4f1e9}table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:12px;border-bottom:1px solid #b9c7c1}a{color:#155e54}.scroll{overflow:auto}</style><h1>Scuba Lak — after-change Lighthouse audit</h1><p>Standard mobile simulation and desktop preset, Lighthouse 13.6.0. ${runs} isolated cold-client run(s) per page/profile. Medians, not best-run scores. QA noindex is intentional and lowers SEO. This is laboratory data, not real-user INP or a guarantee of field performance.</p><div class="scroll"><table><tr><th>Page</th><th>Profile</th><th>Performance (runs)</th><th>A11y</th><th>Best practices</th><th>SEO</th><th>LCP</th><th>CLS</th><th>TBT</th><th>Transfer</th></tr>${rows}</table></div><h2>Original reports</h2><ul>${results.map(item => `<li><a href="${item.id}.report.html">${item.id}</a></li>`).join('')}</ul></html>`);
console.log(JSON.stringify({ event: 'finished', directory, summary }));
