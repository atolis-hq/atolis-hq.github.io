import { useScrollProgress } from './hooks/useScrollProgress';
import { ParticleScene } from './particle/ParticleScene';
import { resolveSectionFocus } from './particle/sectionFocus';

const sections = [
  ['01', 'Traditional design', 'Design is scattered across artefacts.'],
  ['02', 'Reimagine', 'Bring design into one system.'],
  ['03', 'Unify', 'See your system as a whole. Trace relationships across APIs, events, and models.'],
  ['04', 'Delivery aware', 'Understand impact before building. Track what’s in flight. Propose changes safely.'],
  ['05', 'AI', 'Built for AI agents. Designed for human control.'],
  ['06', 'Git + YAML', 'Own your model. No lock-in.'],
  ['07', 'Demo', 'See the system in action.'],
  ['08', 'CI/CD', 'Validate design before it becomes code.']
] as const;

export default function App() {
  const scrollProgress = useScrollProgress();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 760 : false;
  const sectionFocus = resolveSectionFocus(scrollProgress, isMobile);

  return (
    <main className="page">
      <ParticleScene focus={sectionFocus} progress={scrollProgress} />
      <section className="section hero-section tone-dark" aria-labelledby="hero-title">
        <div className="section-copy hero-copy">
          <h1 id="hero-title">Software design is fragmented.</h1>
          <h2 className="hero-coral">Corum brings it all together.</h2>
          <p className="hero-subtitle">
            Replace scattered artefacts with a structured model.<br /> One that AI can build from and humans can trust.
          </p>
          <p className="hero-support">Extensible. YAML-backed. Git-native. System-wide graph.</p>
        </div>
      </section>

      {sections.map(([id, label, heading], index) => (
        <section
          className={`section ${index < 3 ? 'tone-dark' : 'tone-light'} ${label === 'Demo' ? 'demo-section' : ''}`}
          key={id}
        >
          <div className="section-copy">
            <p className="section-kicker">
              {id} / {label}
            </p>
            <h2>{heading}</h2>
          </div>
          {label === 'Demo' ? (
            <div className="demo-placeholder" aria-label="Demo placeholder">
              <div className="demo-sidebar" />
              <div className="demo-graph">Stable system placeholder</div>
              <div className="demo-panel" />
            </div>
          ) : null}
        </section>
      ))}
    </main>
  );
}
