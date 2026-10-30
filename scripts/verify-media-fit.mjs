import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const shell = await readFile('src/app/common/components/dialog-shell/dialog-shell.component.ts', 'utf8');
const viewer = await readFile('src/app/common/components/media-viewer/media-viewer.component.ts', 'utf8');
const header = await readFile('src/app/common/components/site-header/site-header.component.ts', 'utf8');
const styles = await readFile('src/styles.css', 'utf8');
const media = await readFile('src/styles/media.css', 'utf8');
const rule = (css, selector) => {
  const start = css.indexOf(selector + ' {');
  assert.notEqual(start, -1, `Missing layout rule: ${selector}`);
  return css.slice(start + selector.length + 2, css.indexOf('}', start));
};

assert.match(shell, /readonly fitViewport = input\(false\)/, 'Viewport fitting is opt-in; the mobile navigation keeps its normal dialog');
assert.match(shell, /\[class\.dialog--fit-viewport\]="fitViewport\(\)"/);
assert.match(rule(shell, 'dialog.dialog--fit-viewport'), /height: calc\(100dvh - 2rem\); overflow: hidden/);
assert.match(viewer, /<app-dialog-shell \[fitViewport\]="true"/);
assert.doesNotMatch(header, /\[fitViewport\]/);
assert.match(viewer, /class="gallery-lightbox__caption" role="region" tabindex="0"/, 'A long caption stays keyboard-scrollable on short screens');

const panel = rule(styles, '.gallery-lightbox__panel');
assert.match(panel, /display: grid/);
assert.match(panel, /grid-template-rows: auto minmax\(0, 1fr\) auto/);
assert.match(panel, /height: 100%/);
assert.match(rule(styles, '.gallery-lightbox__caption'), /max-height: min\(30dvh, 12rem\); overflow: auto/);
const stage = rule(media, '.media-viewer__stage');
assert.match(stage, /min-height: 0/);
assert.doesNotMatch(stage, /(?:^|;)\s*height:|min-height: (?:16rem|\d+dvh)/, 'Stage takes the real space left by the toolbar and caption, not a separate viewport estimate');
assert.match(rule(media, '.media-viewer__slide'), /display: block/, 'Avoid intrinsic grid tracks expanding the photograph');
const fitted = rule(media, '.media-viewer__slide > img, .media-viewer__slide > video');
for (const declaration of ['position: absolute', 'inset: 0', 'height: 100%', 'max-width: 100%', 'max-height: 100%', 'object-fit: contain', 'object-position: center !important', 'background-size: contain', 'background-repeat: no-repeat']) assert.ok(fitted.includes(declaration), `Media fit requires ${declaration}`);
assert.doesNotMatch(fitted, /object-fit: cover|background-size: cover|transform: scale/);
assert.match(media, /touch-action: pan-y pinch-zoom/);
assert.match(media, /transition: transform 360ms/, 'Keep the existing simultaneous swipe animation');
console.log('Media fit checks passed: viewport-bounded opt-in modal, toolbar/stage/caption grid, keyboard-scrollable long captions, definite non-cropping photo/video bounds and unchanged swipe animation.');
