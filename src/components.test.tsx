import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProductVisual } from './components';
import { getProduct } from './products';

describe('ProductVisual', () => {
  it('renders Corum as an architecture explorer surface', () => {
    const product = getProduct('corum');

    if (!product) throw new Error('missing corum product');

    const html = renderToStaticMarkup(<ProductVisual product={product} />);

    expect(html).toContain('Architecture graph');
    expect(html).toContain('Lineage');
    expect(html).toContain('POST: /orders');
    expect(html).toContain('Create Order');
    expect(html).toContain('Order Created');
    expect(html).not.toContain('APIEndpoint');
    expect(html).not.toContain('DomainOperation');
    expect(html).not.toContain('PaymentCaptured');
  });

  it('renders Wake as a control-plane run surface', () => {
    const product = getProduct('wake');

    if (!product) throw new Error('missing wake product');

    const html = renderToStaticMarkup(<ProductVisual product={product} />);

    expect(html).toContain('Run queue');
    expect(html).toContain('Lifecycle');
    expect(html).toContain('PR ready');
  });
});
