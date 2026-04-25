import { describe, expect, it } from 'vitest';
import { focusPocketCount, resolveSectionFocus } from './sectionFocus';

describe('resolveSectionFocus', () => {
  it('starts centered before the section pockets take over', () => {
    const focus = resolveSectionFocus(0, false);

    expect(focus.target.x).toBeCloseTo(0);
    expect(focus.target.y).toBeCloseTo(0);
    expect(focus.zoom).toBeCloseTo(1);
    expect(focus.lock).toBe(0);
  });

  it('moves into section-specific open space as a section becomes primary', () => {
    const early = resolveSectionFocus(0.01, false);
    const problem = resolveSectionFocus(0.05, false);

    expect(Math.abs(problem.target.x)).toBeGreaterThan(Math.abs(early.target.x));
    expect(problem.zoom).toBeGreaterThan(early.zoom);
  });

  it('locks more strongly near the centre of a section than between sections', () => {
    const locked = resolveSectionFocus(0.25, false);
    const shifting = resolveSectionFocus(0.333, false);

    expect(locked.lock).toBeGreaterThan(shifting.lock);
    expect(shifting.velocity).toBeGreaterThan(locked.velocity);
  });

  it('uses smaller offsets and zoom on mobile', () => {
    const desktop = resolveSectionFocus(0.42, false);
    const mobile = resolveSectionFocus(0.42, true);

    expect(Math.abs(mobile.target.x)).toBeLessThan(Math.abs(desktop.target.x));
    expect(mobile.zoom).toBeLessThan(desktop.zoom);
  });

  it('tracks the hero plus the remaining six content sections', () => {
    expect(focusPocketCount).toBe(7);
  });

  it('keeps subtle scroll movement after the graph stabilises', () => {
    const stable = resolveSectionFocus(0.88, false);
    const later = resolveSectionFocus(0.94, false);

    expect(stable.target.x).not.toBeCloseTo(later.target.x);
    expect(later.velocity).toBeGreaterThan(0.08);
    expect(later.lock).toBeLessThan(0.94);
  });
});
