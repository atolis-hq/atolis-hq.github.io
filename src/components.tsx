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
      <div className="visual visual-corum" aria-label="Corum design graph illustration">
        <div className="graph-line graph-line-a" />
        <div className="graph-line graph-line-b" />
        <div className="graph-line graph-line-c" />
        <div className="graph-node graph-node-large">API</div>
        <div className="graph-node graph-node-event">Event</div>
        <div className="graph-node graph-node-schema">Schema</div>
        <div className="graph-node graph-node-domain">Domain</div>
        <div className="schema-card">
          <span>orders.Schema.Payment</span>
          <code>amount -&gt; settlement.total</code>
          <code>status -&gt; lifecycle.state</code>
        </div>
      </div>
    );
  }

  return (
    <div className="visual visual-wake" aria-label="Wake control-plane workflow illustration">
      <div className="flow-rail" />
      {['Issue', 'Policy', 'Agent', 'Review', 'PR'].map((label, index) => (
        <div className="flow-step" key={label} style={{ '--i': index } as React.CSSProperties}>
          <span>{label}</span>
        </div>
      ))}
      <div className="event-log">
        <code>stage: implement</code>
        <code>runner: codex</code>
        <code>status: awaiting-review</code>
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card" style={{ '--accent': product.accent } as React.CSSProperties}>
      <div className="product-card-copy">
        <img src={product.logo} alt="" className="product-logo" />
        <p className="eyebrow">{product.name}</p>
        <h2>{product.tagline}</h2>
        <p>{product.summary}</p>
        <ul>
          {product.homeBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <CommandBlock command={product.installCommand} accent={product.accent} />
        <div className="button-row">
          <a className="button button-primary" href={`#/${product.slug}`}>
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
