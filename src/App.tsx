import { useScrollProgress } from './hooks/useScrollProgress';
import { ParticleScene } from './particle/ParticleScene';
import { resolveSectionFocus } from './particle/sectionFocus';

export default function App() {
  const scrollProgress = useScrollProgress();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 760 : false;
  const sectionFocus = resolveSectionFocus(scrollProgress, isMobile);

  return (
    <main className="page">
      <ParticleScene focus={sectionFocus} progress={scrollProgress} />
      <section className="section hero-section tone-dark" aria-labelledby="hero-title" data-focus-section>
        <div className="section-copy hero-copy">
          <h1 id="hero-title">Software design is fragmented.</h1>
          <h2 className="hero-coral">Corum brings it all together.</h2>
          <p className="hero-subtitle">
            Replace scattered artefacts with a structured model.<br /> One that AI can build from and humans can trust.
          </p>
          <p className="hero-support">Open Source. Git-native. Model anything.</p>
        </div>
      </section>

      <section className="section tone-dark" data-focus-section>
        <div className="section-copy">
          <p className="section-kicker">01 / Design challenges</p>
          <h2>Great designs lose value across tools and formats.</h2>
          <div>
            <ul>
            <li>APIs, events, diagrams, and documents live separately</li>
            <li>No single view of the system</li>
            <li>High cognitive overhead to piece things together</li>
            <li>Hard to understand what’s in flight</li>
            <li>Impact of changes is unclear</li>
            <li>Validation happens too late</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section tone-dark" data-focus-section>
        <div className="section-copy">
          <p className="section-kicker">02 / Introducing Corum</p>
          <h2>Every model.<br/> In one place. <br/><span className="coral">Connected.</span></h2>
          <div>
            <ul>
            <li>Everything is modelled together</li>
            <li>Trace relationships across APIs, events, and models</li>
            <li>Field level lineage</li>
            <li>Understand the impact of changes</li>
            <li>Import OpenApi, AsyncAPI, and other specifications</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section tone-dark" data-focus-section>
        <div className="section-copy">
          <p className="section-kicker">03 / AI First</p>
          <h2>Designed for humans. <br/><span className="coral">Built for agents.</span></h2>
          <div>
            <ul>
            <li>Plugs into any AI Agent</li>
            <li>Spec driven development</li>
            <li>Structured models AI can reason about</li>
            <li>Explicit relationships without context bloat</li>
            <li>Agents can inspect and update the system</li>
            <li>Humans review, guide, and approve</li>          
            </ul>
          </div>
        </div>
      </section>

      <section className="section tone-dark" data-focus-section>
        <div className="section-copy">
          <p className="section-kicker">04 / Evolving design</p>
          <h2>Delivery aware<br/><span className="coral">at every stage.</span></h2>
          <div>
            <ul>
            <li>Designs dont have a single version.</li>
            <li>Track what’s in flight</li>
            <li>Understand the impact of changes</li>
            <li>Validate design before it becomes code</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section tone-dark demo-section" data-focus-section>
        <div className="section-copy">
          <p className="section-kicker">05 / Demo</p>
          <h2>Works the way <span className="coral">your team works.</span></h2>
        </div>
        <div className="demo-placeholder" aria-label="Demo placeholder">
          <div className="demo-sidebar" />
          <div className="demo-graph">Stable system placeholder</div>
          <div className="demo-panel" />
        </div>
      </section>

      <section className="section tone-light" data-focus-section>
        <div className="section-copy">
        <p className="section-kicker">04 / Tools and Customisation</p>
        <h2>Cutomise Corum with <span className="coral">Plugins</span></h2>
        <div>
            <ul>
            <li>Template packs and plugins</li>
            <li>Model anything</li>
            <li>MCP tooling</li>
            <li>Import existing models and specifications</li>
            <li>Designs live in your Git repository</li>
            <li>Zero infrastructure required</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
