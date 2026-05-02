import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('initial page background', () => {
  it('matches the first particle scene background before WebGL renders', () => {
    const styles = readFileSync(resolve(__dirname, 'styles.css'), 'utf8');

    expect(styles).toMatch(/:root\s*{[^}]*background:\s*#cfc9b8;/s);
  });

  it('keeps the particle canvas hidden until the scene is ready', () => {
    const styles = readFileSync(resolve(__dirname, 'styles.css'), 'utf8');

    expect(styles).toMatch(/\.particle-scene canvas\s*{[^}]*opacity:\s*0;/s);
    expect(styles).toMatch(/\.particle-scene\.is-ready canvas\s*{[^}]*opacity:\s*1;/s);
    expect(styles).toMatch(/\.particle-loader\s*{[^}]*opacity:\s*1;/s);
    expect(styles).toMatch(/\.particle-scene\.is-ready \.particle-loader\s*{[^}]*opacity:\s*0;/s);
  });
});
