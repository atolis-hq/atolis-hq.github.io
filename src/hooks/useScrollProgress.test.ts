import { describe, expect, it } from 'vitest';
import { resolveAnchoredScrollProgress } from './useScrollProgress';

describe('resolveAnchoredScrollProgress', () => {
  it('maps exact section anchors to evenly spaced focus progress', () => {
    const anchors = [0, 1000, 2200, 3600];

    expect(resolveAnchoredScrollProgress(anchors, 0)).toBe(0);
    expect(resolveAnchoredScrollProgress(anchors, 1000)).toBeCloseTo(1 / 3);
    expect(resolveAnchoredScrollProgress(anchors, 2200)).toBeCloseTo(2 / 3);
    expect(resolveAnchoredScrollProgress(anchors, 3600)).toBe(1);
  });

  it('interpolates between neighbouring section anchors', () => {
    const anchors = [0, 1000, 2200];

    expect(resolveAnchoredScrollProgress(anchors, 500)).toBeCloseTo(0.25);
    expect(resolveAnchoredScrollProgress(anchors, 1600)).toBeCloseTo(0.75);
  });

  it('clamps before the first and after the last anchor', () => {
    const anchors = [200, 800, 1600];

    expect(resolveAnchoredScrollProgress(anchors, 0)).toBe(0);
    expect(resolveAnchoredScrollProgress(anchors, 2000)).toBe(1);
  });
});
