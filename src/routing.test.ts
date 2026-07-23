import { describe, expect, it } from 'vitest';
import { normalizeHashPath, normalizePathRoute } from './routing';

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

describe('normalizePathRoute', () => {
  it('returns an empty route for the homepage', () => {
    expect(normalizePathRoute('/')).toBe('');
    expect(normalizePathRoute('/index.html')).toBe('');
  });

  it('normalizes clean product paths', () => {
    expect(normalizePathRoute('/corum')).toBe('corum');
    expect(normalizePathRoute('/wake/')).toBe('wake');
  });

  it('ignores unknown nested path details', () => {
    expect(normalizePathRoute('/corum/index.html')).toBe('corum');
  });
});
