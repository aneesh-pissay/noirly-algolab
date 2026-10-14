import type { CSSProperties } from 'react';
import type { AlgorithmAction } from '@/src/core/engine/types';

/**
 * What a highlighted element is doing in this step. Each state pairs a
 * colour token (globals.css `--viz-*`) with a cue that does not rely on
 * colour: a short label, a symbol, and an outline style.
 */
export interface VizState {
  /** CSS variable for the state colour. */
  color: string;
  /** Read by screen readers and shown as a small tag. */
  label: string;
  /** One-character glyph shown on the element. */
  symbol: string;
  outline: 'solid' | 'dashed' | 'double';
}

const COMPARE: VizState = { color: 'var(--viz-compare)', label: 'comparing', symbol: '?', outline: 'dashed' };
const SWAP: VizState = { color: 'var(--viz-swap)', label: 'swapping', symbol: '⇄', outline: 'double' };
const DONE: VizState = { color: 'var(--viz-done)', label: 'done', symbol: '✓', outline: 'solid' };
const FAIL: VizState = { color: 'var(--viz-fail)', label: 'not found', symbol: '✕', outline: 'dashed' };
const REMOVE: VizState = { color: 'var(--viz-fail)', label: 'removing', symbol: '−', outline: 'dashed' };
const PIVOT: VizState = { color: 'var(--viz-pivot)', label: 'pivot', symbol: '◆', outline: 'double' };
const ACTIVE: VizState = { color: 'var(--viz-active)', label: 'active', symbol: '•', outline: 'solid' };

export function vizStateFor(action: AlgorithmAction): VizState {
  switch (action) {
    case 'compare':
    case 'search':
    case 'search-left':
    case 'search-right':
      return COMPARE;
    case 'swap':
    case 'shift':
    case 'rotate':
    case 'flip':
    case 'flipped':
      return SWAP;
    case 'found':
    case 'place':
    case 'insertion':
    case 'merge':
      return DONE;
    case 'not-found':
      return FAIL;
    case 'delete':
    case 'pop':
    case 'dequeue':
      return REMOVE;
    case 'partition':
    case 'choose':
    case 'find-max':
      return PIVOT;
    default:
      return ACTIVE;
  }
}

/** Inline style for a highlighted cell: tinted fill, coloured outline in the state's style. */
export function vizCellStyle(state: VizState): CSSProperties {
  return {
    borderColor: state.color,
    borderStyle: state.outline,
    borderWidth: state.outline === 'double' ? 4 : 2,
    background: `color-mix(in srgb, ${state.color} 14%, var(--surface))`,
    color: 'var(--text)',
  };
}
