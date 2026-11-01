function parseRange(value, size) {
  if (value.length > 100) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match || (!match[1] && !match[2])) return null;
  const length = BigInt(size);
  let start, end;
  if (!match[1]) {
    const suffix = BigInt(match[2]);
    if (!suffix) return false;
    start = suffix >= length ? 0n : length - suffix;
    end = length - 1n;
  } else {
    start = BigInt(match[1]);
    end = match[2] ? BigInt(match[2]) : length - 1n;
    if (start >= length || end < start) return false;
    if (end >= length) end = length - 1n;
  }
  return { start: Number(start), end: Number(end) };
}

function fixedLength(body, size) {
  if (typeof FixedLengthStream === 'undefined') return body;
  const stream = new FixedLengthStream(size);
  void body.pipeTo(stream.writable).catch(() => undefined);
  return stream.readable;
}

function sliceStream(body, start, end) {
  const reader = body.getReader();
  let offset = 0;
  return new ReadableStream({
    async pull(controller) {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) { controller.close(); return; }
          const previous = offset;
          offset += value.byteLength;
          if (offset <= start) continue;
          const piece = value.subarray(Math.max(0, start - previous), Math.min(value.byteLength, end + 1 - previous));
          if (piece.byteLength) controller.enqueue(piece);
          if (offset > end) {
            controller.close();
            void reader.cancel().catch(() => undefined);
          }
          return;
        }
      } catch (error) { controller.error(error); }
    },
    cancel(reason) { return reader.cancel(reason); }
  });
}

export function createVideoDelivery(files) {
  return {
    async fetch(request, env) {
      const size = files[new URL(request.url).pathname];
      if (!size || !['GET', 'HEAD'].includes(request.method)) return env.ASSETS.fetch(request);
      const requested = request.method === 'GET' ? request.headers.get('Range') : null;
      const headers = new Headers(request.headers);
      headers.delete('Range');
      headers.delete('If-Range');
      headers.set('Accept-Encoding', 'identity');
      const asset = await env.ASSETS.fetch(new Request(request, { headers }));
      if (asset.status !== 200) return asset;
      const encoding = asset.headers.get('Content-Encoding');
      if (encoding && encoding !== 'identity') return asset;
      const actualSize = asset.headers.get('Content-Length');
      if (actualSize && Number(actualSize) !== size) return asset;
      const outputHeaders = new Headers(asset.headers);
      outputHeaders.set('Accept-Ranges', 'bytes');
      outputHeaders.set('Content-Length', String(size));
      outputHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
      outputHeaders.set('X-Content-Type-Options', 'nosniff');
      const ifRange = request.headers.get('If-Range');
      const validatorMatches = !ifRange || (!ifRange.startsWith('W/') &&
        (ifRange === asset.headers.get('ETag') || ifRange === asset.headers.get('Last-Modified')));
      const range = requested && validatorMatches ? parseRange(requested, size) : null;
      if (range === false) {
        void asset.body?.cancel().catch(() => undefined);
        outputHeaders.set('Content-Range', `bytes */${size}`);
        outputHeaders.set('Content-Length', '0');
        return new Response(null, { status: 416, headers: outputHeaders });
      }
      if (range && asset.body) {
        outputHeaders.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
        outputHeaders.set('Content-Length', String(range.end - range.start + 1));
        return new Response(fixedLength(sliceStream(asset.body, range.start, range.end), range.end - range.start + 1), { status: 206, headers: outputHeaders });
      }
      return new Response(request.method === 'HEAD' ? null : asset.body, { status: 200, headers: outputHeaders });
    }
  };
}
