/** Reads a request body with a hard size cap, whatever Content-Length claims. */
export class PayloadTooLargeError extends Error {
  status = 413;
}

export async function readLimitedText(request: Request, maxBytes = 64 * 1024): Promise<string> {
  const size = Number(request.headers.get('content-length'));
  if (Number.isFinite(size) && size > maxBytes) throw new PayloadTooLargeError('Request body is too large');
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) throw new PayloadTooLargeError('Request body is too large');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks).toString('utf8');
}
