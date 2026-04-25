import type { CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import { FaGitAlt, FaMarkdown } from 'react-icons/fa6';
import { SiGoogledocs } from 'react-icons/si';
import { SiConfluence, SiGraphql, SiJira, SiMiro, SiNotion, SiOpenapiinitiative } from 'react-icons/si';
import { TbApi, TbSchema } from 'react-icons/tb';
import { CorumModelWindow } from './components/CorumModelWindow';
import { useScrollProgress } from './hooks/useScrollProgress';
import { ParticleScene } from './particle/ParticleScene';
import { resolveSectionFocus } from './particle/sectionFocus';

type DesignToolCard = {
  label: string;
  Icon: IconType;
  x: number;
  y: number;
  spreadX: number;
  spreadY: number;
  delayMs: number;
};

const designToolCards: DesignToolCard[] = [
  { label: 'Confluence', Icon: SiConfluence, x: 22, y: 19, spreadX: -100, spreadY: -100, delayMs: 100 },
  { label: 'Git', Icon: FaGitAlt, x: 64, y: 12, spreadX: 40, spreadY: -90, delayMs: 280 },
  { label: 'Notion', Icon: SiNotion, x: 84, y: 24, spreadX: 80, spreadY: -80, delayMs: 190 },
  { label: 'Markdown', Icon: FaMarkdown, x: 36, y: 33, spreadX: -34, spreadY: -18, delayMs: 360 },
  { label: 'Jira', Icon: SiJira, x: 70, y: 40, spreadX: 34, spreadY: -16, delayMs: 240 },
  { label: 'OpenAPI Spec', Icon: SiOpenapiinitiative, x: 16, y: 48, spreadX: -44, spreadY: 30, delayMs: 420 },
  { label: 'AsyncAPI Spec', Icon: TbApi, x: 48, y: 58, spreadX: -18, spreadY: 46, delayMs: 150 },
  { label: 'GraphQL', Icon: SiGraphql, x: 83, y: 61, spreadX: 42, spreadY: 34, delayMs: 320 },
  { label: 'Miro', Icon: SiMiro, x: 25, y: 76, spreadX: -69, spreadY: 90, delayMs: 260 },
  { label: 'Diagrams', Icon: TbSchema, x: 67, y: 82, spreadX: 46, spreadY: 48, delayMs: 460 },
  { label: 'Google Docs', Icon: SiGoogledocs, x: 44, y: 120, spreadX: 20, spreadY: 22, delayMs: 420 },
];

export default function App() {
  const scrollProgress = useScrollProgress();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 760 : false;
  const sectionFocus = resolveSectionFocus(scrollProgress, isMobile);
  const sectionOneReveal = Math.max(0, Math.min(1, 1 - Math.abs(scrollProgress - 0.2) / 0.17));
  const sectionTwoReveal = Math.max(0, Math.min(1, 1 - Math.abs(scrollProgress - 0.38) / 0.19));
  const sectionTwoDelta = scrollProgress - 0.38;
  const sectionTwoParallax =
    -Math.sign(sectionTwoDelta) * Math.pow(Math.min(Math.abs(sectionTwoDelta) / 0.16, 1), 1.05) * 560;

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
        <div className="section-copy section-copy-wide">
          <p className="section-kicker">01 / Design challenges</p>
          <h2>Great designs lose value across tools and formats.</h2>
          <div className="challenges-layout">
            <div className="challenges-panel">
              <ul className="challenges-list">
                <li>APIs, events, diagrams, and documents live separately</li>
                <li>No single view of the system</li>
                <li>High cognitive overhead to piece things together</li>
                <li>Hard to understand what’s in flight</li>
                <li>Impact of changes is unclear</li>
                <li>Validation happens too late</li>
              </ul>
            </div>
            <div className="tool-card-cluster" aria-label="Design tools and platforms">
              {designToolCards.map((tool) => (
                <article
                  key={tool.label}
                  className="tool-card"
                  style={
                    {
                      '--x': `${tool.x}%`,
                      '--y': `${tool.y}%`,
                      '--spread-x': `${tool.spreadX}px`,
                      '--spread-y': `${tool.spreadY}px`,
                      '--delay': `${tool.delayMs}ms`,
                      '--reveal': sectionOneReveal.toFixed(3),
                    } as CSSProperties
                  }
                >
                  <span className="tool-card-logo" aria-hidden="true">
                    <tool.Icon />
                  </span>
                  <span className="tool-card-label">{tool.label}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section tone-dark" data-focus-section>
        <div className="section-copy section-copy-wide">
          <div className="corum-layout">
            <div className="corum-window-wrap">
              <CorumModelWindow reveal={sectionTwoReveal} parallax={sectionTwoParallax} />
              <p className="corum-window-note">
                Illustrative pseudo-YAML for concept preview, not the exact production source format.
              </p>
            </div>

            <div className="corum-copy">
              <p className="section-kicker">02 / Introducing Corum</p>
              <h2>Every model.<br/> In one place. <br/><span className="coral">Connected.</span></h2>
              <div className="corum-panel">
                <ul className="challenges-list">
                  <li>Every model is represented as structured pseudo-YAML</li>
                  <li>Properties and schema live together in one source of truth</li>
                  <li>Connections between models remain visible at node level</li>
                  <li>Field-level lineage stays explicit without context bloat</li>
                  <li>Design impact can be traced before code is generated</li>
                </ul>
              </div>
            </div>
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
