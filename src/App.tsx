import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CommandBlock, ProductCard, ProductVisual } from './components';
import { getProduct, products } from './products';
import { normalizeHashPath } from './routing';

function useHashPath() {
  const [path, setPath] = useState(() => normalizeHashPath(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setPath(normalizeHashPath(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return path;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#/" aria-label="Atolis product homepage">
          <span className="brand-mark">A</span>
          <span>Atolis</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#/corum">Corum</a>
          <a href="#/wake">Wake</a>
          <a href="https://github.com/atolis-hq">
            GitHub
            <ExternalLink size={14} />
          </a>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <span>Open-source tools from Atolis.</span>
        <a href="https://github.com/atolis-hq">github.com/atolis-hq</a>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <Shell>
      <main>
        <section className="hero">
          <p className="eyebrow">Atolis OSS</p>
          <h1>Open-source tools for agent-ready software design and delivery.</h1>
          <p className="hero-copy">
            Corum helps teams model system architecture as a structured graph. Wake coordinates autonomous engineering
            work through durable, inspectable workflows.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#/corum">
              Explore Corum
            </a>
            <a className="button button-secondary" href="#/wake">
              Explore Wake
            </a>
          </div>
        </section>

        <section className="product-grid" aria-label="Featured products">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </section>

        <section className="future-products">
          <p className="eyebrow">Built to expand</p>
          <h2>A product surface for the next Atolis tools.</h2>
          <p>
            This landing page is structured as a product index. Future projects can join the same metadata model,
            navigation, and page pattern without turning the homepage into a long brochure.
          </p>
        </section>
      </main>
    </Shell>
  );
}

function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);

  if (!product) {
    return (
      <Shell>
        <main className="not-found">
          <h1>Product not found.</h1>
          <a className="button button-primary" href="#/">
            Back to products
          </a>
        </main>
      </Shell>
    );
  }

  const sibling = products.find((candidate) => candidate.slug !== product.slug);

  return (
    <Shell>
      <main className="product-page" style={{ '--accent': product.accent } as React.CSSProperties}>
        <section className="product-hero">
          <div>
            <img src={product.logo} alt="" className="product-logo product-logo-large" />
            <p className="eyebrow">{product.name}</p>
            <h1>{product.tagline}</h1>
            <p>{product.summary}</p>
            <CommandBlock command={product.installCommand} accent={product.accent} />
            <div className="button-row">
              <a className="button button-primary" href={product.githubUrl}>
                GitHub
                <ExternalLink size={15} />
              </a>
              <a className="button button-secondary" href={product.npmUrl}>
                npm
                <ExternalLink size={15} />
              </a>
              <a className="button button-secondary" href={product.docsUrl}>
                Docs
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
          <ProductVisual product={product} />
        </section>

        <section className="capabilities">
          <p className="eyebrow">What it does</p>
          <div className="capability-grid">
            {product.capabilities.map((capability) => (
              <article key={capability.title}>
                <h2>{capability.title}</h2>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="product-next">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Install the package, then keep the README open.</h2>
          </div>
          <div>
            <CommandBlock command={product.installCommand} accent={product.accent} />
            <div className="button-row">
              <a className="button button-primary" href={product.githubUrl}>
                Open repository
              </a>
              {sibling ? (
                <a className="button button-secondary" href={`#/${sibling.slug}`}>
                  View {sibling.name}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}

export default function App() {
  const path = useHashPath();
  return path ? <ProductPage slug={path} /> : <HomePage />;
}
