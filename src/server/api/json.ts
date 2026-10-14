import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { PayloadTooLargeError, readLimitedText } from '@/src/server/security/body';

/**
 * Parses a JSON body against a schema. Throws a 4xx `Response` on bad input,
 * so routes pass it through from their catch block like requireUser().
 */
export async function readJsonBody<T>(request: Request, schema: z.ZodType<T>, maxBytes = 16 * 1024): Promise<T> {
  let raw: string;
  try {
    raw = await readLimitedText(request, maxBytes);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) throw NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
    throw error;
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  return parsed.data;
}
