import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createGzip } from 'node:zlib';
import { createServer } from 'node:http';
import { pipeline } from 'node:stream/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputRoot = resolve(projectRoot, 'dist/scuba-lak/browser');
const port = Number(process.env.PORT ?? 4004);

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.xml': 'application/xml; charset=utf-8'
};

const COMPRESSIBLE_TYPES = new Set([
  'application/javascript',
  'application/json',
  'application/manifest+json',
  'application/xml',
  'image/svg+xml',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain'
]);

const isInsideOutput = (filePath) => filePath === outputRoot || filePath.startsWith(`${outputRoot}/`);

async function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = resolve(outputRoot, `.${normalize(pathname)}`);

  if (!isInsideOutput(requestedPath)) {
    return null;
  }

  try {
    const details = await stat(requestedPath);
    return details.isDirectory() ? join(requestedPath, 'index.html') : requestedPath;
  } catch {
    return url.pathname.includes('.') ? null : join(outputRoot, 'index.html');
  }
}

function isImmutableAsset(filePath) {
  return /-[A-Za-z0-9_-]{8,}\.(?:js|css|woff2?)$/.test(filePath);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let filePath;
  try { filePath = await resolveRequestPath(request.url ?? '/'); }
  catch { response.writeHead(400); response.end('Invalid URL'); return; }
  if (!filePath) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  try {
    await access(filePath);
    const details = await stat(filePath);
    const extension = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] ?? 'application/octet-stream';
    const isHtml = extension === '.html';
    const cacheControl = isHtml
      ? 'public, max-age=0, must-revalidate'
      : isImmutableAsset(filePath)
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate';

    response.setHeader('Content-Type', contentType);
    response.setHeader('Cache-Control', cacheControl);
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Vary', 'Accept-Encoding');
    const etag = `W/"${details.size}-${Math.trunc(details.mtimeMs)}"`;
    response.setHeader('ETag', etag);
    response.setHeader('Last-Modified', details.mtime.toUTCString());
    response.setHeader('Accept-Ranges', 'bytes');
    if (request.headers['if-none-match'] === etag) {
      response.writeHead(304); response.end(); return;
    }

    const range = request.headers.range;
    if (range && request.method === 'GET') {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const start = match?.[1] ? Number(match[1]) : Math.max(0, details.size - Number(match?.[2]));
      const end = match?.[1] && match[2] ? Math.min(Number(match[2]), details.size - 1) : details.size - 1;
      if (!match || (!match[1] && !match[2]) || start > end || start >= details.size) {
        response.writeHead(416, { 'Content-Range': `bytes */${details.size}` }); response.end(); return;
      }
      response.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${details.size}`, 'Content-Length': end - start + 1 });
      await pipeline(createReadStream(filePath, { start, end }), response); return;
    }

    if (request.method === 'HEAD') {
      response.writeHead(200);
      response.end();
      return;
    }

    const canCompress = COMPRESSIBLE_TYPES.has(contentType.split(';')[0]) && /gzip/.test(request.headers['accept-encoding'] ?? '');
    if (canCompress) {
      response.setHeader('Content-Encoding', 'gzip');
      response.writeHead(200);
      await pipeline(createReadStream(filePath), createGzip(), response);
      return;
    }

    response.writeHead(200);
    await pipeline(createReadStream(filePath), response);
  } catch {
    if (response.headersSent) {
      response.destroy();
      return;
    }
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Unable to read the requested resource');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Production preview: http://localhost:${port}/`);
});
