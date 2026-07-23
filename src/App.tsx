import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CommandBlock, ProductCard, ProductVisual } from './components';
import atolisLogo from './assets/atolis-logo.svg';
import { getProduct, products } from './products';
import { normalizePathRoute } from './routing';

function usePathRoute() {
  const [path, setPath] = useState(() => normalizePathRoute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalizePathRoute(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return path;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="/" aria-label="Atolis product homepage">
            <span className="brand-mark">
              <img src={atolisLogo} alt="" />
            </span>
            <span>atolis-hq</span>
          </a>
          <nav aria-label="Primary navigation">
            <a href="/corum">Corum</a>
            <a href="/wake">Wake</a>
            <a href="https://github.com/atolis-hq">
              GitHub
              <ExternalLink size={14} />
            </a>
          </nav>
        </div>
      </header>
      <div className="site-shell">
        {children}
        <footer className="site-footer">
          <span>Open-source tools from Atolis.</span>
          <a href="https://github.com/atolis-hq">github.com/atolis-hq</a>
        </footer>
      </div>
    </>
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
            <a className="button button-primary" href="/corum">
              Explore Corum
            </a>
            <a className="button button-secondary" href="/wake">
              Explore Wake
            </a>
          </div>
        </section>

        <section className="product-grid" aria-label="Featured products">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
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
          <a className="button button-primary" href="/">
            Back to products
          </a>
        </main>
      </Shell>
    );
  }

  const sibling = products.find((candidate) => candidate.slug !== product.slug);

  return (
    <Shell>
      <main className={`product-page product-page-${product.slug}`} style={{ '--accent': product.accent } as React.CSSProperties}>
        <section className="product-hero">
          <div>
            <div className="product-identity">
              <img src={product.logo} alt="" className="product-identity-logo" />
              <p className="product-identity-name">{product.name}</p>
            </div>
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
                <a className="button button-secondary" href={`/${sibling.slug}`}>
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
  const path = usePathRoute();
  return path ? <ProductPage slug={path} /> : <HomePage />;
}
