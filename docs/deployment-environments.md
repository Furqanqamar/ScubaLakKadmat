# QA/UAT and production

## URLs and ownership

| Environment | URL | Updates | Availability |
| --- | --- | --- | --- |
| QA/UAT | https://furqanqamar.github.io/ScubaLakKadmat/ | Successful pushes to `agent/scuba-lak-application` | Full website, independently of production mode |
| Production | https://www.scubalak.com/ | Explicit promotion of a successful, approved QA run | Coming-soon until the owner deliberately selects Live |

GitHub QA is public, not password-protected. Every HTML document has `noindex, nofollow, noarchive`; client-side navigation preserves those directives. Production owns canonical/structured-data URLs. QA does not publish a populated sitemap. These are search-indexing controls, not access control; never add private customer data, credentials or confidential material to this public preview.

The contact form currently uses the same tested mail service and business inbox in both environments. Mark QA enquiries **TEST**; submissions are real emails to `hello@scubalak.com`. No SMTP password is in the website or GitHub Actions.

## Daily QA/UAT workflow

1. Make changes on `agent/scuba-lak-application` and push them.
2. **Deploy QA-UAT to GitHub Pages** builds/tests a root-base production candidate, saves `production-release`, then builds the subpath QA variant and publishes only GitHub Pages.
3. Test the GitHub URL on desktop/mobile, including navigation, gallery, media and contact interactions.
4. Identify the exact tested version in the successful workflow summary or `/ScubaLakKadmat/deployment.json`. Record its full `sourceCommit` and `qaRunId` with QA/UAT approval. The browser title includes `[QA / UAT]`.

The production-ready artifact has the same source commit but a different base URL (`/` rather than `/ScubaLakKadmat/`) and production SEO. Both variants are prepared in one QA run. A later QA update does not change production, and a production promotion can select an older successfully tested run rather than silently selecting the latest code.

## One-time production automation setup

1. Merge the environment-setup pull request to `main` after reviewing it. GitHub requires manually dispatched workflows to exist on the default branch. A merge alone does not deploy production.
2. The repository's `production` environment requires approval by `Furqanqamar` and permits only `main`. The owner can approve their own requested deployment because this is an owner-operated repository. Repository administrators retain GitHub's administrative bypass capability; normal production jobs wait for the required review.
3. The owner creates a narrowly scoped Cloudflare API token with **Account → Cloudflare Pages → Edit** for account `6ea664fc8441a69ac252791ae102198c`. This permits Pages deployment for that account, not SMTP/Worker-secret access. Cloudflare account-level Pages permissions are not limited to a single project, although this workflow fixes the destination to `scubalak`.
4. Store it privately as environment secret `CLOUDFLARE_API_TOKEN` in **Settings → Environments → production**. Do not use a repository-wide secret, paste the token into chat, or commit it. The QA workflow has no Cloudflare credential. Token creation/access approval and private entry remain owner actions.

Until step 4 is completed, production promotion fails closed without uploading anything. Do not start a production run merely to test credentials against the live site.

## Promote an approved version

1. Open **Actions → Promote approved QA release to production → Run workflow**, selecting branch **main**.
2. Enter the successful QA run ID and its full 40-character approved commit. Tick the QA/UAT approval checkbox.
3. Choose production mode. The safe default is **coming-soon**; choose **live** only for a deliberate public launch. **maintenance** is also available.
4. Review the validation summary, then approve the waiting `production` environment job. This is a second, explicit deployment review.
5. The job validates the QA workflow, repository, branch, success status, commit, retained artifact and root-base metadata. It downloads the saved build, applies only the selected production availability mode and uploads it to Cloudflare Pages project `scubalak` with `--branch=main`. There is no application rebuild or GitHub QA deployment.
6. Verify `https://www.scubalak.com/`, the production mode, navigation and `/deployment.json` version. The workflow summary records the selected commit/run/mode.

Do not approve a release whose QA checks or UAT are incomplete. No push, merge, availability-config edit or successful QA run automatically deploys Cloudflare. The production workflow has only `workflow_dispatch`, not push or workflow-run triggers.

## Availability changes and rollback

Re-run promotion with the same approved QA run/commit and a different mode to switch between coming-soon, maintenance and live without rebuilding. The committed config remains a safe coming-soon default; each production deployment has an explicit selected mode.

For code rollback, select a previous successful QA run and its approved commit, subject to the same review. Artifacts are retained for 90 days; expired artifacts require rebuilding and testing a new candidate, or using Cloudflare's existing deployment rollback tools. No DNS, GoDaddy mailbox, MX, SPF, DKIM or DMARC changes are part of this workflow.

## Verification

Existing site checks run against the clean production candidate before QA-only noindex changes. `scripts/verify-environments.mjs` checks independent modes, QA noindex, source/run metadata, deployment bases, manual-only production and absence of Cloudflare credentials from QA. `scripts/verify-production-candidate.mjs` rejects mismatched commits, runs, QA builds and gated/incorrect-base artifacts before promotion.

Official references: [GitHub environment approvals](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments), [Cloudflare Pages CI deployment](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).
