import { ArrowRight, Check, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Product } from './products';

export function CommandBlock({ command, accent }: { command: string; accent: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    async function fallbackCopy() {
      const textArea = document.createElement('textarea');
      textArea.value = command;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
      } else {
        await fallbackCopy();
      }
    } catch {
      await fallbackCopy();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="command-block" style={{ '--accent': accent } as React.CSSProperties}>
      <code>{command}</code>
      <button type="button" onClick={copyCommand} aria-label={`Copy command: ${command}`}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}

export function ProductVisual({ product }: { product: Product }) {
  if (product.slug === 'corum') {
    return (
      <div className="visual product-surface visual-corum" aria-label="Corum architecture explorer mockup">
        <div className="surface-topbar">
          <span>Architecture graph</span>
          <span>main</span>
        </div>
        <div className="corum-surface-grid">
          <div className="surface-sidebar">
            <span className="surface-label">Components</span>
            <b>orders</b>
            <b>payments</b>
            <b>fulfillment</b>
          </div>
          <div className="surface-canvas">
            <div className="corum-flow">
              <span className="surface-node">POST: /orders</span>
              <span className="flow-arrow" aria-hidden="true">↓</span>
              <span className="surface-node">Create Order</span>
              <span className="flow-arrow" aria-hidden="true">↓</span>
              <span className="surface-node">Order Created</span>
            </div>
          </div>
          <div className="surface-detail">
            <span className="surface-label">Lineage</span>
            <b>Order Created</b>
            <code>orderId -&gt; Order.id</code>
            <code>status -&gt; Order.state</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="visual product-surface visual-wake" aria-label="Wake control-plane run mockup">
      <div className="surface-topbar">
        <span>Run queue</span>
        <span>live</span>
      </div>
      <div className="wake-surface-grid">
        <div className="wake-ticket">
          <span className="surface-label">GitHub Issue</span>
          <b>#482 Add import guardrails</b>
          <small>assigned to wake</small>
        </div>
        <div className="wake-lifecycle">
          <span className="surface-label">Lifecycle</span>
          {['refine', 'plan', 'implement', 'review'].map((stage) => (
            <span className="wake-stage" key={stage}>{stage}</span>
          ))}
        </div>
        <div className="wake-run">
          <span className="surface-label">Agent run</span>
          <b>codex</b>
          <code>workspace ready</code>
          <code>PR ready</code>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card" style={{ '--accent': product.accent } as React.CSSProperties}>
      <div className="product-card-copy">
        <div className="product-identity">
          <img src={product.logo} alt="" className="product-identity-logo" />
          <p className="product-identity-name">{product.name}</p>
        </div>
        <h2>{product.tagline}</h2>
        <p>{product.summary}</p>
        <ul>
          {product.homeBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <CommandBlock command={product.installCommand} accent={product.accent} />
        <div className="button-row">
          <a className="button button-primary" href={`/${product.slug}`}>
            Explore {product.name}
            <ArrowRight size={16} />
          </a>
          <a className="button button-secondary" href={product.githubUrl}>
            GitHub
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
      <ProductVisual product={product} />
    </article>
  );
}
