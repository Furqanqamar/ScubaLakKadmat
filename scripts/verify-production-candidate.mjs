import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { allHtml } from './prepare-environment.mjs';

const [directory, commit, runId] = process.argv.slice(2);
assert.match(commit ?? '', /^[a-f0-9]{40}$/); assert.match(runId ?? '', /^\d+$/);
const root = resolve(directory);
const metadata = JSON.parse(await readFile(resolve(root, 'deployment.json'), 'utf8'));
assert.equal(metadata.version, 1); assert.equal(metadata.environment, 'production');
assert.equal(metadata.sourceCommit, commit); assert.equal(metadata.qaRunId, runId); assert.equal(metadata.base, '/');
const manifest = JSON.parse(await readFile(resolve(root, 'site-release.json'), 'utf8'));
assert.equal(manifest.base, '/');
for (const path of await allHtml(root)) {
  const html = await readFile(resolve(root, path), 'utf8');
  assert.match(html, /<base href="\/">/, path);
  assert.match(html, /name="scubalak-environment" content="production"/, path);
  assert.doesNotMatch(html, /data-site-gated="true"|\[QA \/ UAT\]|name="scubalak-environment" content="qa"/, path);
}
assert.match(await readFile(resolve(root, 'sitemap.xml'), 'utf8'), /https:\/\/www\.scubalak\.com\//);
console.log(`Verified production candidate: ${commit}, QA run ${runId}, root deployment base, no QA markers.`);
