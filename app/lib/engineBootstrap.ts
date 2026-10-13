import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { registerAllAlgorithms } from '@/src/core/algorithms';
import {
  registerArrayAlgorithms,
  registerStringAlgorithms,
  registerHashMapAlgorithms,
  registerHashSetAlgorithms,
  registerStackAlgorithms,
  registerQueueAlgorithms,
  registerIntermediateDataStructureAlgorithms,
  registerAdvancedDataStructureAlgorithms,
} from '@/src/core';
import { registerPatternAlgorithms } from '@/app/lib/patternAlgorithms';

let bootstrapped = false;

export function bootstrapVisualizerEngine(): void {
  if (bootstrapped) return;

  registerAllAlgorithms(visualizerEngine);
  registerArrayAlgorithms(visualizerEngine);
  registerStringAlgorithms(visualizerEngine);
  registerHashMapAlgorithms(visualizerEngine);
  registerHashSetAlgorithms(visualizerEngine);
  registerStackAlgorithms(visualizerEngine);
  registerQueueAlgorithms(visualizerEngine);
  registerIntermediateDataStructureAlgorithms(visualizerEngine);
  registerAdvancedDataStructureAlgorithms(visualizerEngine);
  registerPatternAlgorithms(visualizerEngine);

  bootstrapped = true;
}

export function getRegisteredAlgorithmIds(): string[] {
  bootstrapVisualizerEngine();
  return Array.from(visualizerEngine.getAllAlgorithms().keys());
}
