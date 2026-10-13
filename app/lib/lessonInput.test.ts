import { describe, expect, it } from 'vitest';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { bootstrapVisualizerEngine, getRegisteredAlgorithmIds } from '@/app/lib/engineBootstrap';
import { getAllLessons } from '@/app/data/curriculum';
import {
  decodeInput,
  detectInputSpec,
  encodeInput,
  parseDraft,
  parseStepParam,
  randomInput,
  shareUrl,
  tryRun,
  worstCaseInput,
  type InputSpec,
} from './lessonInput';

bootstrapVisualizerEngine();
const algo = (id: string) => visualizerEngine.getAlgorithm(id)!;

describe('detectInputSpec', () => {
  it('finds the inputs a generator really reads', () => {
    expect(detectInputSpec('array-reverse', algo('array-reverse'))?.fields).toContain('array');
    expect(detectInputSpec('string-reverse', algo('string-reverse'))?.fields).toContain('str');
    expect(detectInputSpec('string-count-anagrams', algo('string-count-anagrams'))?.fields).toEqual(expect.arrayContaining(['text', 'pattern']));
    expect(detectInputSpec('array-two-sum-sorted', algo('array-two-sum-sorted'))).toMatchObject({ fields: ['array', 'target'], sortedArray: true });
    expect(detectInputSpec('searching-binary', algo('searching-binary'))?.sortedArray).toBe(true);
    // Its example happens to be sorted, but reversing must keep the learner's order.
    expect(detectInputSpec('array-reverse', algo('array-reverse'))?.sortedArray).toBe(false);
  });

  it('never throws, and most lessons get a custom input', () => {
    const lessons = getAllLessons();
    const withInput = lessons.filter((l) => detectInputSpec(l.algorithmId, algo(l.algorithmId)));
    expect(getRegisteredAlgorithmIds().length).toBeGreaterThan(300);
    expect(withInput.length / lessons.length).toBeGreaterThan(0.5);
  });

  it('presets produce inputs every probed generator accepts', () => {
    for (const lesson of getAllLessons()) {
      const spec = detectInputSpec(lesson.algorithmId, algo(lesson.algorithmId));
      if (!spec) continue;
      let seed = 7;
      const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (const input of [randomInput(spec, rand), worstCaseInput(spec)]) {
        expect(parseDraft(Object.fromEntries(Object.entries(input).map(([k, v]) => [k, Array.isArray(v) ? (k === 'edges' ? (v as number[][]).map((e) => (e.length > 2 ? `${e[0]}-${e[1]}:${e[2]}` : `${e[0]}-${e[1]}`)).join(',') : v.join(',')) : String(v)])), spec).ok, `${lesson.id} ${JSON.stringify(input)}`).toBe(true);
      }
    }
  });
});

describe('parseDraft', () => {
  const spec: InputSpec = { fields: ['array', 'target'], sortedArray: true, sorting: false };

  it('parses and sorts arrays for algorithms that need sorted input', () => {
    expect(parseDraft({ array: '5, 3 9', target: '9' }, spec)).toEqual({ ok: true, input: { array: [3, 5, 9], target: 9 } });
  });

  it('rejects non-numbers, oversized arrays and out-of-range values', () => {
    expect(parseDraft({ array: '1, two' }, spec).ok).toBe(false);
    expect(parseDraft({ array: Array.from({ length: 17 }, (_, i) => i).join(',') }, spec).ok).toBe(false);
    expect(parseDraft({ array: '1000' }, spec).ok).toBe(false);
  });

  it('parses weighted edge lists', () => {
    const graph: InputSpec = { fields: ['edges'], sortedArray: false, sorting: false };
    expect(parseDraft({ edges: '0-1, 1-2:5' }, graph)).toEqual({ ok: true, input: { edges: [[0, 1], [1, 2, 5]] } });
    expect(parseDraft({ edges: '0-99' }, graph).ok).toBe(false);
    expect(parseDraft({ edges: '0->1' }, graph).ok).toBe(false);
  });

  it('caps string length', () => {
    const strings: InputSpec = { fields: ['str'], sortedArray: false, sorting: false };
    expect(parseDraft({ str: 'x'.repeat(33) }, strings).ok).toBe(false);
  });
});

describe('shareable links', () => {
  it('round-trips an input through ?input=', () => {
    const input = { array: [3, -1, 7], target: 6 };
    expect(decodeInput(encodeInput(input))).toEqual(input);
  });

  it('rejects tampered or oversized input', () => {
    expect(decodeInput(encodeInput({ array: [1] }).slice(0, -2) + '!!')).toBeNull();
    expect(decodeInput(Buffer.from(JSON.stringify({ array: [1], evil: true })).toString('base64url'))).toBeNull();
    expect(decodeInput(Buffer.from(JSON.stringify({ array: Array(40).fill(1) })).toString('base64url'))).toBeNull();
    expect(decodeInput('a'.repeat(3000))).toBeNull();
  });

  it('builds 1-based step links and validates ?step=', () => {
    const url = shareUrl('https://algolab.test/visualizer/array-reverse?x=1', { array: [1, 2] }, 4);
    expect(new URL(url).searchParams.get('step')).toBe('5');
    expect(new URL(url).searchParams.has('x')).toBe(false);
    expect(parseStepParam('5', 10)).toBe(4);
    expect(parseStepParam('11', 10)).toBeNull();
    expect(parseStepParam('-1', 10)).toBeNull();
  });

  it('runs a decoded input through the generator', () => {
    const steps = tryRun(algo('array-reverse'), decodeInput(encodeInput({ array: [1, 2, 3] }))!);
    expect(steps?.at(-1)?.visualizationData.array).toEqual([3, 2, 1]);
  });
});
