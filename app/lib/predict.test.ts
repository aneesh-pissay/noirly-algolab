import { describe, expect, it } from 'vitest';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { bootstrapVisualizerEngine } from '@/app/lib/engineBootstrap';
import { buildPrediction } from './predict';

bootstrapVisualizerEngine();

describe('buildPrediction', () => {
  const steps = visualizerEngine.getAlgorithm('sorting-bubble')!.generateSteps({ array: [5, 3, 8, 1, 9] });

  it('asks about the next state when the data changes', () => {
    const swapAt = steps.findIndex((s, i) => i > 0 && JSON.stringify(s.visualizationData.array) !== JSON.stringify(steps[i - 1].visualizationData.array));
    const prediction = buildPrediction(steps, swapAt - 1)!;
    expect(prediction.question).toMatch(/look like after the next step/);
    expect(prediction.options[prediction.correctIndex]).toBe(`[${(steps[swapAt].visualizationData.array as number[]).join(', ')}]`);
  });

  it('asks what happens next otherwise, with distinct options', () => {
    const prediction = buildPrediction(steps, 0)!;
    expect(prediction.options.length).toBeGreaterThanOrEqual(3);
    expect(new Set(prediction.options).size).toBe(prediction.options.length);
    expect(prediction.explanation).toBe(steps[1].description);
  });

  it('has nothing to ask on the last step', () => {
    expect(buildPrediction(steps, steps.length - 1)).toBeNull();
  });
});
