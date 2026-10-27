# Coming soon and maintenance pages

Two independent, responsive HTML pages share the Scuba Lak identity without loading Angular, the main navigation, the gallery, or the homepage video:

- `/coming-soon/`: “Something blue is coming.”
- `/maintenance/`: “A short surface interval.”

The initial published mode is **coming-soon**, selected in `public/site-status.json`. Mode switching does not change domain or email settings.

## Configuration

Edit `public/site-status.json`. Its `mode` is one of `live`, `coming-soon`, or `maintenance`. The same file holds each page's headings, description, labels, note, WhatsApp message, both WhatsApp numbers, and Instagram profile. Text is inserted as plain text, not interpreted as HTML. Keep descriptions short for the intended spacious layout.

There is no invented launch date, progress percentage, countdown, or email-signup backend. “Stay in the loop” opens a prefilled WhatsApp message; the visitor chooses whether to send it. The maintenance page also has a real availability check.

## Local preview: switch without rebuilding

Build once with `npm run build` and run `node scripts/preview-server.mjs`. Then use:

```sh
npm run site:mode -- coming-soon
npm run site:mode -- maintenance
npm run site:mode -- live
```

Refresh the browser after switching. These commands update the config and the already-built HTML without compiling Angular. Original HTML is cached in the ignored `tmp/site-mode-baseline.json` during the build. Returning to Live restores every original document, not a rebuilt approximation. A fresh build refreshes that cache. The normal build intentionally produces a clean release; apply the desired mode afterward when previewing.

## GitHub Pages: a small publish, no application rebuild

GitHub Pages serves immutable deployed files; changing a live file still requires publishing a new Pages artifact. The fast mode workflow reuses an existing clean release instead of reinstalling dependencies or rebuilding the app.

One-time setup: publish the implementation through the normal deployment workflow. That run saves a `site-release` artifact for 90 days. For GitHub's manual Actions button to appear, the new workflow must also exist on the repository's default branch (`main`). No workflow has been executed as part of creating these pages.

After setup, there are two ways to switch:

1. **Actions dropdown:** open **Switch website mode (no rebuild)**, choose the branch currently serving the website, choose `live`, `coming-soon`, or `maintenance`, and run it. The selected mode is saved back to that branch after a successful publish so later full releases keep the choice. Protected branches may require updating the JSON through an approved pull request instead of allowing the bot commit.
2. **Edit one config file:** commit changes to only `public/site-status.json` on the active website branch. This triggers the lightweight workflow and skips the Angular build. If code changes are included in the same push, the normal build handles them and the fast workflow skips to avoid deploying an older release over new code.

The workflow refuses to switch a non-active branch. If the clean artifact has expired, run the normal deployment once to refresh it; the fast workflow reports this rather than attempting an incomplete restoration. No PAT, new account, external configuration service, or public admin switch is required. GitHub's standard scoped workflow token is used.

## What is covered

For a holding mode, all generated HTML documents are replaced with the selected standalone page, including the homepage, existing deep links, legacy redirects, and the custom 404 document. The mode is visible in the very first HTML response, even with JavaScript disabled. Main-site scripts and heavy media are not requested by the holding page. The original URL stays in the browser.

The standalone preview URLs remain available in every mode. The holding page checks its uncached JSON status once per minute while visible; when a new deployment changes mode, a gated page refreshes its original URL. Reload attempts are throttled to avoid loops while CDN caches catch up. Explicit standalone previews never auto-redirect, and contacts remain usable if configuration or artwork fails to load.

The initial cover waits for the small illustration and fonts, with an error/timeout fallback. Reduced-motion preferences disable drift, particles, fades, and transitions. Both numbers are touch-friendly WhatsApp links. No contact forms are submitted by the page itself.

## HTTP status and SEO limitations

Both previews are `noindex` and excluded from the sitemap. The local preview returns HTTP 503 plus `Retry-After: 300` for gated maintenance responses. **GitHub Pages cannot implement custom 503 response headers/statuses:** existing static routes return 200, and unknown routes retain the host's 404 status. Do not treat the visual maintenance page as a true 503 setup on GitHub Pages or leave an indexed production website in this mode for an extended period. For prolonged maintenance, configure a real 503 response with a supported hosting/CDN layer.

This is a presentation/availability switch, not authentication. Existing public assets are still public. No DNS, email records, canonical domain, or business email address is changed.

## Export each page to another static host

```sh
npm run site:export
```

This creates separate, self-contained `output/standalone-status-pages/coming-soon/` and `maintenance/` folders with their illustration variants, logo, CSS, small scripts, and editable JSON. Upload a folder's contents to a static host's root. No Angular build is needed. Online Google Fonts fall back to system fonts if unavailable. An export refuses to overwrite an existing directory; pass a new output path to create another version.

GoDaddy's Websites + Marketing editor is not a generic static-file hosting uploader. These exports are portable to a static host; they do not repair or replace the GoDaddy builder automatically. Domain changes still need the separate approved setup, preserving all mail records.

## Verification

`node scripts/verify-site-status.mjs` checks independent pages, responsive asset budgets, safe copy/contact configuration, reduced motion, first-paint fallbacks, deep links, five mode transitions, the no-build workflow, local HTTP statuses, and byte-exact restoration of all original HTML. Existing website checks are run against the clean release before deployment mode is applied.

## Cloudflare Pages deployment

The custom-domain release uses a root base URL (`/`), unlike the GitHub Pages preview at `/ScubaLakKadmat/`. Build the clean application with `npm run build`, run the checks above, then apply the saved mode with:

```sh
node scripts/apply-site-mode.mjs --directory dist/scuba-lak/browser --config public/site-status.json
```

Upload the **contents** of `dist/scuba-lak/browser/` to the Cloudflare Pages project `scubalak` as a production deployment. Never upload a clean build before applying the selected mode: a clean build contains the full live application.

For later changes on the same local clean-release baseline, use `npm run site:mode -- coming-soon`, `maintenance`, or `live`, then upload the resulting folder again. This restores the cached originals before applying a mode and requires no Angular rebuild. Cloudflare still requires a new deployment to publish a change. The GitHub Actions workflows above publish the separate GitHub Pages preview; they do not publish the Cloudflare production project.

Keep a clean root-base release and its `tmp/site-mode-baseline.json` together for future switches. A fresh build refreshes both. The release manifest covers every generated HTML route and `404.html`; holding modes replace all of them before upload. Preserve existing MX, SPF, DKIM, and DMARC records when connecting the custom domain.
