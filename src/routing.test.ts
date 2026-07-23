import { describe, expect, it } from 'vitest';
import { normalizeHashPath } from './routing';

describe('normalizeHashPath', () => {
  it('returns an empty route for a missing hash', () => {
    expect(normalizeHashPath('')).toBe('');
  });

  it('normalizes GitHub Pages hash routes', () => {
    expect(normalizeHashPath('#/corum')).toBe('corum');
    expect(normalizeHashPath('#wake')).toBe('wake');
    expect(normalizeHashPath('#/')).toBe('');
  });

  it('drops nested trailing slashes for product routes', () => {
    expect(normalizeHashPath('#/corum/')).toBe('corum');
  });
});
