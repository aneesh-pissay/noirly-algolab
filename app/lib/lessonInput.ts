/**
 * Custom input for lesson visualizers (spec F1) and shareable links (F6).
 *
 * The engine's generators read different keys (`array`, `target`, `str`,
 * `edges`, `k`, …), so rather than hand-writing a schema per algorithm the
 * panel probes each generator once and offers only the fields that change
 * its output. Every value is validated and size-capped before it reaches a
 * generator.
 */
import { z } from 'zod';
import type { Algorithm, AlgorithmInput, AlgorithmStep } from '@/src/core/engine/types';

export const LIMITS = {
  arrayLength: 16,
  numberAbs: 999,
  stringLength: 32,
  patternLength: 12,
  edges: 24,
  vertex: 15,
  k: 16,
  steps: 5000,
} as const;

const printable = /^[\x20-\x7E]+$/;
const int = (abs: number) => z.number().int().min(-abs).max(abs);

export const LessonInputSchema = z
  .object({
    array: z.array(int(LIMITS.numberAbs)).min(1).max(LIMITS.arrayLength).optional(),
    target: int(9999).optional(),
    k: z.number().int().min(1).max(LIMITS.k).optional(),
    str: z.string().min(1).max(LIMITS.stringLength).regex(printable).optional(),
    text: z.string().min(1).max(LIMITS.stringLength).regex(printable).optional(),
    pattern: z.string().min(1).max(LIMITS.patternLength).regex(printable).optional(),
    edges: z
      .array(z.tuple([z.number().int().min(0).max(LIMITS.vertex), z.number().int().min(0).max(LIMITS.vertex)], int(LIMITS.numberAbs)))
      .min(1)
      .max(LIMITS.edges)
      .optional(),
  })
  .strict();

export type LessonInput = z.infer<typeof LessonInputSchema>;
export type InputField = keyof LessonInput;

export interface InputSpec {
  fields: InputField[];
  /** The generator's own example array is sorted (searches, two pointers): keep custom arrays sorted. */
  sortedArray: boolean;
  /** Sorting lessons: "worst case" is a reversed array. */
  sorting: boolean;
}

// ------------------------------------------------------------------ probing

function safeSteps(algorithm: Algorithm, input: AlgorithmInput): AlgorithmStep[] | null {
  try {
    const steps = algorithm.generateSteps(input);
    return Array.isArray(steps) && steps.length > 0 && steps.length <= LIMITS.steps ? steps : null;
  } catch {
    return null;
  }
}

function fingerprint(steps: AlgorithmStep[] | null): string {
  if (!steps) return 'error';
  try {
    return JSON.stringify(steps.map((s) => [s.action, s.description, s.visualizationData, s.variables]));
  } catch {
    return 'unserializable';
  }
}

/** A field counts when two different values give two different, successful runs. */
function changesOutput(algorithm: Algorithm, base: AlgorithmInput, field: InputField, a: unknown, b: unknown): boolean {
  const first = safeSteps(algorithm, { ...base, [field]: a });
  const second = safeSteps(algorithm, { ...base, [field]: b });
  return Boolean(first && second) && fingerprint(first) !== fingerprint(second);
}

function firstArray(steps: AlgorithmStep[] | null): number[] | null {
  const data = steps?.[0]?.visualizationData ?? {};
  const candidate = data.array ?? data.nums ?? data.values;
  return Array.isArray(candidate) && candidate.every((n) => typeof n === 'number') ? candidate : null;
}

/** Algorithms whose input must be sorted (binary-search family, sorted two-pointer problems). */
const NEEDS_SORTED = /^(searching-(binary|jump|exponential|interpolation|ternary)|recursion-binary-search|bst-convert-sorted-array)$|-sorted$/;

const specCache = new Map<string, InputSpec | null>();

/** Which inputs this algorithm actually uses, or null when none can be set. */
export function detectInputSpec(algorithmId: string, algorithm: Algorithm): InputSpec | null {
  if (specCache.has(algorithmId)) return specCache.get(algorithmId)!;

  const fields: InputField[] = [];
  const arrayA = [11, 22, 33, 44, 55];
  const arrayB = [12, 23, 34, 45, 56, 67];
  if (changesOutput(algorithm, {}, 'array', arrayA, arrayB)) fields.push('array');
  const base: AlgorithmInput = fields.includes('array') ? { array: arrayA } : {};
  if (changesOutput(algorithm, base, 'target', 33, 777)) fields.push('target');
  if (changesOutput(algorithm, base, 'k', 2, 3)) fields.push('k');
  if (changesOutput(algorithm, {}, 'str', 'qzjxk', 'mpwvy')) fields.push('str');
  if (changesOutput(algorithm, {}, 'text', 'qzjxkq', 'mpwvym')) fields.push('text');
  if (changesOutput(algorithm, { text: 'abcabc' }, 'pattern', 'ab', 'bca')) fields.push('pattern');
  if (changesOutput(algorithm, {}, 'edges', [[0, 1], [1, 2], [2, 3]], [[0, 2], [2, 4], [4, 1], [1, 3]])) fields.push('edges');

  // Many examples happen to be sorted; only algorithms that need sorted input
  // keep a custom array sorted (Reverse must not silently sort yours).
  const defaultArray = firstArray(safeSteps(algorithm, {}));
  const sortedArray =
    NEEDS_SORTED.test(algorithmId) &&
    Boolean(defaultArray && defaultArray.every((n, i) => i === 0 || defaultArray[i - 1] <= n));
  const spec = fields.length ? { fields, sortedArray, sorting: algorithm.category === 'sorting' || algorithmId.startsWith('sorting-') } : null;
  specCache.set(algorithmId, spec);
  return spec;
}

// ------------------------------------------------------------------ text fields ↔ input

export type InputDraft = Partial<Record<InputField, string>>;

export function toDraft(input: LessonInput): InputDraft {
  const draft: InputDraft = {};
  if (input.array) draft.array = input.array.join(', ');
  if (input.target !== undefined) draft.target = String(input.target);
  if (input.k !== undefined) draft.k = String(input.k);
  if (input.str) draft.str = input.str;
  if (input.text) draft.text = input.text;
  if (input.pattern) draft.pattern = input.pattern;
  if (input.edges) draft.edges = input.edges.map(([u, v, w]) => (w === undefined ? `${u}-${v}` : `${u}-${v}:${w}`)).join(', ');
  return draft;
}

export type ParseResult = { ok: true; input: LessonInput } | { ok: false; error: string };

function parseInteger(raw: string): number | null {
  return /^-?\d+$/.test(raw.trim()) ? Number(raw.trim()) : null;
}

/** Turns the panel's text fields into a validated input; messages are user-facing. */
export function parseDraft(draft: InputDraft, spec: InputSpec): ParseResult {
  const input: Record<string, unknown> = {};

  if (spec.fields.includes('array') && draft.array?.trim()) {
    const parts = draft.array.split(/[\s,]+/).filter(Boolean);
    const values = parts.map(parseInteger);
    if (values.some((v) => v === null)) return { ok: false, error: 'Array: use whole numbers separated by commas.' };
    if (values.length > LIMITS.arrayLength) return { ok: false, error: `Array: at most ${LIMITS.arrayLength} numbers.` };
    const numbers = values as number[];
    input.array = spec.sortedArray ? [...numbers].sort((a, b) => a - b) : numbers;
  }
  for (const field of ['target', 'k'] as const) {
    if (spec.fields.includes(field) && draft[field]?.trim()) {
      const value = parseInteger(draft[field]!);
      if (value === null) return { ok: false, error: `${field === 'k' ? 'k' : 'Target'}: enter a whole number.` };
      input[field] = value;
    }
  }
  for (const field of ['str', 'text', 'pattern'] as const) {
    if (spec.fields.includes(field) && draft[field]) input[field] = draft[field];
  }
  if (spec.fields.includes('edges') && draft.edges?.trim()) {
    const edges: number[][] = [];
    for (const part of draft.edges.split(/[\s,]+/).filter(Boolean)) {
      const match = /^(\d+)-(\d+)(?::(-?\d+))?$/.exec(part);
      if (!match) return { ok: false, error: 'Edges: write each edge as u-v or u-v:weight, separated by commas.' };
      edges.push(match[3] === undefined ? [Number(match[1]), Number(match[2])] : [Number(match[1]), Number(match[2]), Number(match[3])]);
    }
    input.edges = edges;
  }

  const parsed = LessonInputSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = String(issue?.path[0] ?? 'Input');
    return { ok: false, error: `${field}: ${issue?.message ?? 'invalid value'} (limits: ${LIMITS.arrayLength} numbers within ±${LIMITS.numberAbs}, ${LIMITS.stringLength} characters, vertices 0–${LIMITS.vertex}).` };
  }
  return { ok: true, input: parsed.data };
}

/** Runs a generator on a validated input; null when it fails or explodes in size. */
export function tryRun(algorithm: Algorithm, input: LessonInput): AlgorithmStep[] | null {
  return safeSteps(algorithm, input as AlgorithmInput);
}

// ------------------------------------------------------------------ presets

function randomInt(min: number, max: number, rand: () => number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function randomInput(spec: InputSpec, rand: () => number = Math.random): LessonInput {
  const input: LessonInput = {};
  if (spec.fields.includes('array')) {
    const array = Array.from({ length: randomInt(6, 9, rand) }, () => randomInt(1, 99, rand));
    input.array = spec.sortedArray ? array.sort((a, b) => a - b) : array;
    if (spec.fields.includes('target')) input.target = rand() < 0.75 ? array[randomInt(0, array.length - 1, rand)] : randomInt(1, 99, rand);
  }
  if (spec.fields.includes('k')) input.k = randomInt(2, Math.max(2, Math.min(4, (input.array?.length ?? 4) - 1)), rand);
  const letters = (n: number, alphabet = 'abcdefgh') => Array.from({ length: n }, () => alphabet[randomInt(0, alphabet.length - 1, rand)]).join('');
  if (spec.fields.includes('str')) input.str = letters(randomInt(5, 9, rand));
  if (spec.fields.includes('text')) input.text = letters(randomInt(8, 12, rand), 'abcd');
  if (spec.fields.includes('pattern')) input.pattern = letters(randomInt(2, 3, rand), 'abcd');
  if (spec.fields.includes('edges')) {
    const vertices = randomInt(5, 7, rand);
    const edges: [number, number, ...number[]][] = [];
    for (let v = 1; v < vertices; v += 1) edges.push([randomInt(0, v - 1, rand), v, randomInt(1, 9, rand)]);
    for (let extra = 0; extra < 2; extra += 1) {
      const u = randomInt(0, vertices - 1, rand);
      const v = randomInt(0, vertices - 1, rand);
      if (u !== v) edges.push([u, v, randomInt(1, 9, rand)]);
    }
    input.edges = edges;
  }
  return input;
}

/** The input that makes this algorithm do the most work. */
export function worstCaseInput(spec: InputSpec): LessonInput {
  const input: LessonInput = {};
  if (spec.fields.includes('array')) {
    const ascending = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
    // Unsorted inputs: reversed order. Sorted inputs: keep the order and
    // search for something that is not there.
    input.array = spec.sortedArray ? ascending : [...ascending].reverse();
    if (spec.fields.includes('target')) input.target = spec.sortedArray ? 999 : -1;
  }
  if (spec.fields.includes('k')) input.k = 2;
  if (spec.fields.includes('str')) input.str = 'abcdefghij';
  if (spec.fields.includes('text')) input.text = 'aaaaaaaaab';
  if (spec.fields.includes('pattern')) input.pattern = 'ab';
  if (spec.fields.includes('edges')) input.edges = Array.from({ length: 7 }, (_, i) => [i, i + 1, 1] as [number, number, number]);
  return input;
}

// ------------------------------------------------------------------ shareable links

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeInput(input: LessonInput): string {
  return toBase64Url(JSON.stringify(input));
}

/** Validated input from a `?input=` value, or null if it is missing, too long or invalid. */
export function decodeInput(value: string | null | undefined): LessonInput | null {
  if (!value || value.length > 2048) return null;
  try {
    const parsed = LessonInputSchema.safeParse(JSON.parse(fromBase64Url(value)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** `?step=` is 1-based in the URL (it matches "Step N / M" on screen). */
export function parseStepParam(value: string | null | undefined, totalSteps: number): number | null {
  if (!value || !/^\d{1,5}$/.test(value)) return null;
  const step = Number(value) - 1;
  return step >= 0 && step < totalSteps ? step : null;
}

export function shareUrl(base: string, input: LessonInput | null, stepIndex: number): string {
  const url = new URL(base);
  url.search = '';
  if (input) url.searchParams.set('input', encodeInput(input));
  url.searchParams.set('step', String(stepIndex + 1));
  return url.toString();
}
