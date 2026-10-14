import { describe, expect, it } from 'vitest';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { bootstrapVisualizerEngine } from '@/app/lib/engineBootstrap';
import { COMPARE_GROUPS, countersAt, groupOf } from './compare';

bootstrapVisualizerEngine();

describe('compare groups', () => {
  it('only list registered algorithms that run on the group example', () => {
    for (const group of COMPARE_GROUPS) {
      for (const { id } of group.algorithms) {
        const algorithm = visualizerEngine.getAlgorithm(id);
        expect(algorithm, id).toBeDefined();
        expect(algorithm!.generateSteps(group.example).length, id).toBeGreaterThan(1);
      }
    }
  });

  it('finds the group of an algorithm', () => {
    expect(groupOf('sorting-quick')?.id).toBe('sorting');
    expect(groupOf('nope')).toBeUndefined();
  });

  it('shows binary search needing far fewer comparisons than linear search', () => {
    const group = COMPARE_GROUPS.find((g) => g.id === 'searching')!;
    const input = { array: Array.from({ length: 16 }, (_, i) => i * 5), target: 70 };
    const linear = visualizerEngine.getAlgorithm('searching-linear')!.generateSteps(input);
    const binary = visualizerEngine.getAlgorithm('searching-binary')!.generateSteps(input);
    expect(group.algorithms.length).toBeGreaterThan(2);
    expect(countersAt(binary, binary.length).comparisons).toBeLessThan(countersAt(linear, linear.length).comparisons);
  });
});
