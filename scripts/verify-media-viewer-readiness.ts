import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MediaViewerSlideComponent } from '../src/app/common/components/media-viewer/media-viewer-slide.component';

function cell<T>(initial: T) { let value = initial; return Object.assign(() => value, { set: (next: T) => { value = next; } }); }
function harness(image: { complete: boolean; naturalWidth: number } | null) {
  const state = {
    photo: () => image ? { nativeElement: image } : undefined,
    ready: cell(false), failed: cell(false)
  };
  const sync = () => Reflect.apply(
    (MediaViewerSlideComponent.prototype as unknown as { syncImageReadiness(): void }).syncImageReadiness,
    state, []
  );
  return { ...state, sync };
}

const cached = harness({ complete: true, naturalWidth: 1200 });
cached.sync();
assert.equal(cached.ready(), true, 'An already-loaded photo must not wait for another load event');
assert.equal(cached.failed(), false);
cached.sync();
assert.equal(cached.ready(), true, 'Rechecking a reused photo preserves readiness');

const image = { complete: false, naturalWidth: 0 };
const pending = harness(image); pending.sync();
assert.equal(pending.ready(), false, 'A genuinely pending image keeps its loading state');
assert.equal(pending.failed(), false, 'Pending is not an image error');
image.complete = true; image.naturalWidth = 800; pending.sync();
assert.equal(pending.ready(), true, 'The completed image releases the loading overlay');

const broken = harness({ complete: true, naturalWidth: 0 });
broken.ready.set(true); broken.sync();
assert.equal(broken.failed(), true, 'A cached failed request shows an error instead of spinning forever');
assert.equal(broken.ready(), false);

const recovered = harness({ complete: true, naturalWidth: 800 });
recovered.failed.set(true); recovered.sync();
assert.equal(recovered.failed(), false, 'A successful cached image clears stale failure state');
assert.equal(recovered.ready(), true);
const film = harness(null); film.sync();
assert.equal(film.ready(), false, 'Photo readiness must not mark an unready video player ready');
film.ready.set(true); film.sync();
assert.equal(film.ready(), true, 'Image checks leave working video playback alone');

const source = readFileSync('src/app/common/components/media-viewer/media-viewer-slide.component.ts', 'utf8');
const reset = source.match(/effect\(\(\) => \{([^}]+)\}\);/)?.[1];
assert.ok(reset, 'The slide needs an item-change reset');
assert.match(reset, /this\.item\(\)/);
assert.doesNotMatch(reset, /this\.active\(\)/, 'Promoting a loaded neighbour must not reset readiness');
assert.match(source, /afterRenderEffect\(\(\) => \{ this\.item\(\); this\.syncImageReadiness\(\); \}\)/);
assert.match(source, /<img #photo/, 'The cache check must read the actual displayed image');
assert.match(source, /if \(player\) \{[\s\S]*?this\.ready\.set\(false\); this\.failed\.set\(false\);\s*player\.load\(\)/, 'Creating a video player resets poster readiness');
console.log('Viewer readiness checks passed: cached/reused photos, pending loads, cached failures, recovered images, activation-state preservation and independent video readiness.');
