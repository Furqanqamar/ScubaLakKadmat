# Website enquiry email

The approved route is Angular contact form → a separate Cloudflare Worker → GoDaddy authenticated SMTP → `hello@scubalak.com`.

The service source lives in `services/enquiry-worker/`. It does not replace the Cloudflare Pages project or switch the website out of coming-soon mode. The Angular endpoint is now configured following real Worker and browser-form delivery tests. A successful webmail test alone is not a successful website-form test.

## Deployment status — 27 October 2026

The Worker is deployed at `https://scubalak-enquiries.furqanqamar510.workers.dev` (working version `52b0e863-b9bb-44df-85e4-d1c36f312a6e`). The owner added `SMTP_PASSWORD` privately; its secret type and configuration readiness were verified without reading its value.

The first send attempts failed at the encrypted connection stage (`ESOCKET`, `CONN`), before authentication. Connecting directly to the named GoDaddy endpoint with `node:tls`, then handing the already-encrypted socket to Nodemailer, resolved the Workers socket-proxy failure. Certificate validation stays enabled; no mailbox-security or DNS changes were needed.

Two clearly labelled tests using the owner's approved test visitor `furqanqamar510@gmail.com` were accepted and received in the `hello@scubalak.com` **Inbox**:

- Direct integration check: `a5c1c767-eab0-452e-9426-48709f7edd23`.
- Actual Angular contact-form submission from `http://localhost:4004/contact`: `d911de98-f213-4e6e-a17b-37c9ea618a74`. The browser displayed its success state and disabled duplicate submission.

The full public website has not been launched or uploaded as part of this email test; its coming-soon mode is preserved. The enabled Angular endpoint will be included in the next approved website deployment.

## Mail settings

- Submission server: `smtpout.secureserver.net`, port `465`, implicit TLS with certificate validation.
- The TLS connection uses the hostname directly and is handed to Nodemailer only after `secureConnect`; no plaintext fallback or disabled certificate checks.
- SMTP login, visible From address and envelope sender: `hello@scubalak.com`.
- Recipient: always `hello@scubalak.com`; the visitor cannot override it.
- Reply-To: the validated visitor email. Replying in webmail addresses the visitor.
- No automatic email is sent to visitors, no attachments are accepted, and no visitor address is used as the From address.

The request carries the four visible fields (name, email, optional phone, plans), existing enquiry context, an invisible honeypot, and elapsed form-open time (not the visitor's wall-clock timestamp). Nothing is sent while the visitor merely fills in the form. An acceptance acknowledgement is returned only after GoDaddy SMTP accepts the fixed business recipient. This is mail-server acceptance, not proof of inbox placement or a booking confirmation.

## Deploy the separate Worker

From the repository root:

```sh
npm --prefix services/enquiry-worker ci
npm --prefix services/enquiry-worker test
npm --prefix services/enquiry-worker run build
```

The dry run creates an inspectable bundle in ignored `tmp/enquiry-worker/` without publishing it. The production dependencies are isolated from Angular; Nodemailer and the SMTP password never enter the browser bundle.

Use Cloudflare's official Wrangler login for deployment. The requested scopes are `account:read`, `user:read`, and `workers_scripts:write` (Wrangler also requests background/offline login access). Use `--use-keyring` so the login is held in the operating system credential store rather than a repository file. The account owner must approve the Cloudflare authorisation screen before deployment. Do not create or paste an API token into chat as an alternative.

If the localhost OAuth callback expires or a stale response is rejected, do not bypass the state checks. Wrangler's supported `login --device --browser=false --use-keyring --scopes account:read user:read workers_scripts:write` flow avoids the callback. Confirm the code from the local CLI only on Cloudflare's official device-verification page and approve only the same scoped permissions. Device authorisation was used for this initial deployment.

After authorisation:

```sh
npm --prefix services/enquiry-worker run deploy
```

This creates/updates only the `scubalak-enquiries` Worker and its three rate-limit bindings. Check the actual returned `workers.dev` URL rather than assuming deployment succeeded. No domain nameservers, MX, SPF, DKIM, DMARC, Pages assets or website availability modes are changed.

## Add the password privately

In Cloudflare → Workers & Pages → `scubalak-enquiries` → Settings → Variables and Secrets:

1. Add a variable of type **Secret** named `SMTP_PASSWORD`.
2. The owner enters the existing GoDaddy mailbox password directly in Cloudflare and saves/deploys it. Do not send it in chat, commit it, copy it to the browser app, or put it in an ordinary plaintext variable.
3. Leave the existing `SMTP_USER` value as `hello@scubalak.com`.

The password gives the Worker authenticated access to the mailbox's SMTP service. Use an app-specific password if GoDaddy/Titan offers one for this mailbox. Do not reset the mailbox password or disable account security merely to enable the integration. If Titan requires third-party email access, the owner must approve that account-security change separately.

Missing password/bindings, the wrong SMTP user, or `SENDING_ENABLED` other than `true` causes the service to fail closed with HTTP 503. `/health` reports configuration readiness only; it does not authenticate to SMTP or send a message.

## Activate and verify the website form

1. Check the deployed `/health` response. It must return HTTP 200 and `{ "ready": true }` after private setup.
2. Verify a clearly labelled API test reaches the business inbox before enabling the browser endpoint. Use only the owner's approved test visitor and non-sensitive text.
3. Set `ENQUIRY_DELIVERY` in `src/app/data/business-config.ts` to endpoint mode with the verified HTTPS Worker URL plus `/enquiries`.
4. Build and preview locally, then submit one clearly labelled test from the actual form using `furqanqamar510@gmail.com`. It should arrive **at `hello@scubalak.com`**, with `hello@scubalak.com` as From and the test user as Reply-To. The production Pages site can stay in coming-soon mode.
5. Confirm both the browser acknowledgement and the actual message in the business inbox. Test failure/data retention and duplicate-click protection with mocks, not by repeatedly sending live mail.
6. Run the main enquiry/SEO checks and the Worker tests. Apply `public/site-status.json` to the built release before any later Pages upload, preserving coming-soon mode unless the owner requests launch.

Neither a code change nor Worker deployment automatically publishes the full website. Do not mark website delivery verified before the real test arrives.

## Safeguards and limits

- Exact-origin CORS allow-list: production site, its Pages origin, the owner's GitHub Pages preview, and `http://localhost:4004` for pre-launch testing. Remove the local origin when no longer needed. CORS is browser protection, not authentication; scripts can spoof an Origin header.
- Server-side field bounds, CRLF/header-injection rejection, JSON-only input and a 12 KB streamed request limit.
- Hidden honeypot and a 2-second minimum/24-hour maximum form age. These are basic bot signals, not a human-verification challenge.
- Cloudflare bindings apply approximate rate limits per edge location: 5 attempts per IP/minute, 3 per email/minute, 20 total valid submissions/minute. Keys are hashed before passing them to the limiters. These are not strict worldwide caps; shared IP users may hit a shared limit. For stronger abuse protection, add Turnstile or a strict Durable Object limit with owner approval.
- No open relay, caller-defined recipient, auto-responder, file access or URL attachment fetching.
- Mail content, visitor fields, IP addresses and SMTP credentials are not logged by application code. Operator diagnostics contain only closed-set error codes, connection phase, reason category and an integer SMTP failure code; arbitrary error messages, stacks and SMTP responses are discarded. Worker invocation logs and traces are disabled; custom error logs are enabled, with query-string redaction. Cloudflare still attaches ordinary invocation metadata to custom events, and hosting/mail providers process normal network/email metadata under their own policies.
- SMTP errors return a generic failure and keep the form data on the page. There are no automatic send retries. An interruption after SMTP accepts a message can leave delivery uncertain; a manual retry can duplicate it. Use the reference/Message-ID to investigate instead of assuming exactly-once delivery.

Emergency disable: set the Worker's `SENDING_ENABLED` variable to `false`. This does not stop normal GoDaddy webmail sending/receiving. To revoke the integration completely, remove its `SMTP_PASSWORD` secret and revoke the Wrangler login in Cloudflare Connected Applications.

## Official references

- [GoDaddy SMTP/IMAP settings](https://www.godaddy.com/en-in/help/use-imap-settings-to-add-my-professional-email-powered-by-titan-to-a-client-32204)
- [Cloudflare TLS support](https://developers.cloudflare.com/workers/runtime-apis/nodejs/tls/)
- [Cloudflare encrypted secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare rate-limit locality and accuracy](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Nodemailer SMTP transport](https://nodemailer.com/smtp)
