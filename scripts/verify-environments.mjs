import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { allHtml, prepareEnvironment } from './prepare-environment.mjs';
import { applySiteMode } from './site-status-lib.mjs';

const root = resolve('dist/scuba-lak/browser');
const manifest = JSON.parse(await readFile(resolve(root, 'site-release.json'), 'utf8'));
const env = manifest.base === '/' ? 'production' : 'qa';
const fixture = await mkdtemp(resolve('tmp/environments-'));
const sha = 'a'.repeat(40);
try {
  await cp(root, fixture, { recursive: true });
  const config = JSON.parse(await readFile(resolve(fixture, 'site-status.json'), 'utf8'));
  config.mode = 'coming-soon';
  await writeFile(resolve(fixture, 'site-status.json'), JSON.stringify(config));
  await assert.rejects(prepareEnvironment(fixture, 'unknown', sha, '123'), /Choose/);
  await assert.rejects(prepareEnvironment(fixture, env, 'main', '123'), /full source commit/);
  await assert.rejects(prepareEnvironment(fixture, env === 'qa' ? 'production' : 'qa', sha, '123'), /Expected deployment base/);
  await prepareEnvironment(fixture, env, sha, '123');
  const metadata = JSON.parse(await readFile(resolve(fixture, 'deployment.json'), 'utf8'));
  assert.equal(metadata.sourceCommit, sha); assert.equal(metadata.qaRunId, '123');
  assert.equal(metadata.environment, env);
  for (const path of await allHtml(fixture)) {
    const html = await readFile(resolve(fixture, path), 'utf8');
    assert.ok(html.includes(`name="scubalak-environment" content="${env}"`));
    assert.doesNotMatch(html, /data-site-gated="true"/);
    if (env === 'qa') assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
  }
  assert.equal(JSON.parse(await readFile(resolve(fixture, 'site-status.json'), 'utf8')).mode, env === 'qa' ? 'live' : 'coming-soon');
  if (env === 'qa') {
    assert.doesNotMatch(await readFile(resolve(fixture, 'sitemap.xml'), 'utf8'), /<loc>/);
    assert.doesNotMatch(await readFile(resolve(fixture, 'robots.txt'), 'utf8'), /Disallow:\s*\//);
    assert.match(await readFile(resolve(fixture, 'index.html'), 'utf8'), /<app-root/);
    assert.match(await readFile(resolve(fixture, 'kadmat-dive-sites/index.html'), 'utf8'), /url=\/ScubaLakKadmat\/kadmat#dive-spots/);
  } else {
    const verification = spawnSync(process.execPath, ['scripts/verify-production-candidate.mjs', fixture, sha, '123'], { encoding: 'utf8' });
    assert.equal(verification.status, 0, verification.stderr);
    const mismatch = spawnSync(process.execPath, ['scripts/verify-production-candidate.mjs', fixture, 'b'.repeat(40), '123'], { encoding: 'utf8' });
    assert.notEqual(mismatch.status, 0, 'A different commit must not be promotable');
    await applySiteMode(fixture, config);
    assert.match(await readFile(resolve(fixture, 'index.html'), 'utf8'), /data-site-gated="true"/);
  }
  const qaWorkflow = await readFile('.github/workflows/deploy-pages.yml', 'utf8');
  const productionWorkflow = await readFile('.github/workflows/deploy-production.yml', 'utf8');
  assert.doesNotMatch(qaWorkflow, /CLOUDFLARE_API_TOKEN|cloudflare\/wrangler-action/);
  assert.match(qaWorkflow, /production-release/);
  assert.match(qaWorkflow, /prepare-environment\.mjs .* qa /);
  assert.doesNotMatch(productionWorkflow.split('permissions:')[0], /\bpush:|workflow_run:/);
  assert.match(productionWorkflow, /name: production/);
  assert.match(productionWorkflow, /default: coming-soon/);
  assert.match(productionWorkflow, /approved_commit/);
  assert.match(productionWorkflow, /run\.head_sha !== process\.env\.APPROVED_COMMIT/);
  assert.match(productionWorkflow, /download-artifact/);
  assert.doesNotMatch(productionWorkflow, /npm ci|npm run build|ng build/);
  const seo = await readFile('src/app/common/services/seo.service.ts', 'utf8');
  assert.match(seo, /scubalak-environment/); assert.match(seo, /noindex, nofollow, noarchive/);
  console.log(`Environment checks passed (${env}): independent availability, noindex QA, production canonicals, source/run identity, manual approval-only production and no QA Cloudflare credentials.`);
} finally { await rm(fixture, { recursive: true, force: true }); }
