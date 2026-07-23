import { describe, expect, it } from 'vitest';
import { getProduct, products } from './products';

describe('products', () => {
  it('defines Corum and Wake as the initial product surface', () => {
    expect(products.map((product) => product.slug)).toEqual(['corum', 'wake']);
  });

  it('keeps required outbound and command metadata for each product', () => {
    for (const product of products) {
      expect(product.installCommand).toBe(`npm install -g @atolis-hq/${product.slug}`);
      expect(product.githubUrl).toBe(`https://github.com/atolis-hq/${product.slug}`);
      expect(product.npmUrl).toContain(`@atolis-hq/${product.slug}`);
      expect(product.docsUrl).toContain(product.slug);
      expect(product.homeBullets.length).toBeGreaterThanOrEqual(3);
      expect(product.capabilities.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('looks up products by slug', () => {
    expect(getProduct('corum')?.name).toBe('Corum');
    expect(getProduct('wake')?.name).toBe('Wake');
    expect(getProduct('missing')).toBeUndefined();
  });
});
