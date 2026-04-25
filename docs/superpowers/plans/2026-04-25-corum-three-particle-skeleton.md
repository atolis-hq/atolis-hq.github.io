# Corum Three Particle Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite React TypeScript skeleton where a Three.js particle scene drives the Corum landing page look, scroll mechanics, colour fade, and organic node dynamics.

**Architecture:** React renders the scrollable content shell and placeholder sections. A fixed Three.js canvas renders deterministic organic particles behind the content and receives normalized scroll progress from a small hook. Styling is centralized in CSS so typography, section labels, and background layering can be tuned quickly.

**Tech Stack:** Vite, React, TypeScript, Three.js, Vitest, Playwright.

---

## File Structure

- Create `package.json`: project scripts and dependencies.
- Create `index.html`: Vite root HTML.
- Create `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`: TypeScript and Vite configuration.
- Create `src/main.tsx`: React entrypoint.
- Create `src/App.tsx`: page shell and section placeholders.
- Create `src/styles.css`: global layout, typography, section, and placeholder styles.
- Create `src/hooks/useScrollProgress.ts`: normalized document scroll progress hook.
- Create `src/particle/particleModel.ts`: deterministic node data, section stages, and simulation helpers.
- Create `src/particle/ParticleScene.tsx`: Three.js renderer and animation loop.
- Create `src/particle/particleModel.test.ts`: unit tests for deterministic model behaviour.
- Create `tests/corum-skeleton.spec.ts`: Playwright smoke tests for scrolling and canvas rendering.
- Create `.gitignore`: local build, dependency, and brainstorm artifacts.

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create package metadata and scripts**

Create `package.json`:

```json
{
  "name": "corum-landing-skeleton",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "three": "^0.176.0",
    "vite": "^6.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.176.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create Vite HTML entry**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Corum</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create TypeScript and Vite config**

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "src", "tests"]
}
```

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true
  }
});
```

- [ ] **Step 4: Ignore generated and local files**

Create `.gitignore`:

```gitignore
node_modules/
dist/
test-results/
playwright-report/
.superpowers/
*.log
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

### Task 2: Deterministic Particle Model

**Files:**
- Create: `src/particle/particleModel.ts`
- Create: `src/particle/particleModel.test.ts`

- [ ] **Step 1: Write model tests**

Create `src/particle/particleModel.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  createParticleNodes,
  getStageBlend,
  resolveParticleTargets
} from './particleModel';

describe('particleModel', () => {
  it('creates deterministic nodes for the same count', () => {
    const first = createParticleNodes(8);
    const second = createParticleNodes(8);

    expect(second).toEqual(first);
    expect(first).toHaveLength(8);
  });

  it('keeps initial positions inside normalized scene bounds', () => {
    const nodes = createParticleNodes(24);

    for (const node of nodes) {
      expect(node.origin.x).toBeGreaterThanOrEqual(-1);
      expect(node.origin.x).toBeLessThanOrEqual(1);
      expect(node.origin.y).toBeGreaterThanOrEqual(-1);
      expect(node.origin.y).toBeLessThanOrEqual(1);
    }
  });

  it('maps scroll progress to stable stage blends', () => {
    expect(getStageBlend(0).fragmentation).toBe(1);
    expect(getStageBlend(0.5).connection).toBeGreaterThan(0);
    expect(getStageBlend(1).stable).toBe(1);
  });

  it('tightens nodes toward cluster targets as scroll advances', () => {
    const nodes = createParticleNodes(12);
    const early = resolveParticleTargets(nodes, 0.1);
    const late = resolveParticleTargets(nodes, 0.7);

    const firstNode = nodes[0];
    const earlyDistance = Math.hypot(
      early[0].x - firstNode.clusterTarget.x,
      early[0].y - firstNode.clusterTarget.y
    );
    const lateDistance = Math.hypot(
      late[0].x - firstNode.clusterTarget.x,
      late[0].y - firstNode.clusterTarget.y
    );

    expect(lateDistance).toBeLessThan(earlyDistance);
  });
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- src/particle/particleModel.test.ts`

Expected: FAIL because `src/particle/particleModel.ts` does not exist.

- [ ] **Step 3: Implement deterministic model**

Create `src/particle/particleModel.ts`:

```ts
export type Vec2 = {
  x: number;
  y: number;
};

export type ParticleNode = {
  id: number;
  cluster: number;
  size: number;
  origin: Vec2;
  clusterTarget: Vec2;
  stableTarget: Vec2;
  coralThreshold: number;
};

export type StageBlend = {
  fragmentation: number;
  attraction: number;
  clustering: number;
  connection: number;
  convergence: number;
  stable: number;
};

const clusterCenters: Vec2[] = [
  { x: -0.52, y: 0.28 },
  { x: 0.18, y: 0.34 },
  { x: 0.52, y: -0.16 },
  { x: -0.18, y: -0.34 }
];

function seeded(index: number, salt: number): number {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function createParticleNodes(count: number): ParticleNode[] {
  return Array.from({ length: count }, (_, index) => {
    const cluster = index % clusterCenters.length;
    const center = clusterCenters[cluster];
    const angle = seeded(index, 5) * Math.PI * 2;
    const radius = 0.08 + seeded(index, 6) * 0.2;

    return {
      id: index,
      cluster,
      size: 0.012 + seeded(index, 4) * 0.012,
      origin: {
        x: seeded(index, 1) * 2 - 1,
        y: seeded(index, 2) * 2 - 1
      },
      clusterTarget: {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
      },
      stableTarget: {
        x: center.x * 0.72 + Math.cos(angle) * radius * 0.62,
        y: center.y * 0.72 + Math.sin(angle) * radius * 0.62
      },
      coralThreshold: 0.66 + seeded(index, 7) * 0.26
    };
  });
}

export function getStageBlend(progress: number): StageBlend {
  const p = Math.min(1, Math.max(0, progress));

  return {
    fragmentation: 1 - smoothstep(0.05, 0.2, p),
    attraction: smoothstep(0.08, 0.28, p) * (1 - smoothstep(0.46, 0.6, p)),
    clustering: smoothstep(0.22, 0.44, p) * (1 - smoothstep(0.72, 0.86, p)),
    connection: smoothstep(0.42, 0.62, p),
    convergence: smoothstep(0.6, 0.8, p),
    stable: smoothstep(0.78, 0.94, p)
  };
}

export function resolveParticleTargets(nodes: ParticleNode[], progress: number): Vec2[] {
  const clusterAmount = smoothstep(0.12, 0.56, progress);
  const stableAmount = smoothstep(0.68, 0.94, progress);

  return nodes.map((node) => {
    const clusterX = mix(node.origin.x, node.clusterTarget.x, clusterAmount);
    const clusterY = mix(node.origin.y, node.clusterTarget.y, clusterAmount);

    return {
      x: mix(clusterX, node.stableTarget.x, stableAmount),
      y: mix(clusterY, node.stableTarget.y, stableAmount)
    };
  });
}

export function resolveCoralAmount(node: ParticleNode, progress: number): number {
  return smoothstep(node.coralThreshold, Math.min(1, node.coralThreshold + 0.12), progress);
}

export function resolveEdgeOpacity(progress: number): number {
  return smoothstep(0.42, 0.72, progress) * (0.28 + getStageBlend(progress).stable * 0.42);
}
```

- [ ] **Step 4: Run model tests**

Run: `npm test -- src/particle/particleModel.test.ts`

Expected: PASS for all four tests.

### Task 3: React Shell And Scroll Sections

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/hooks/useScrollProgress.ts`
- Create: `src/styles.css`

- [ ] **Step 1: Create scroll progress hook**

Create `src/hooks/useScrollProgress.ts`:

```ts
import { useEffect, useState } from 'react';

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(maxScroll <= 0 ? 0 : window.scrollY / maxScroll);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}
```

- [ ] **Step 2: Create app entrypoint**

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: Create placeholder page shell**

Create `src/App.tsx`:

```tsx
import { ParticleScene } from './particle/ParticleScene';
import { useScrollProgress } from './hooks/useScrollProgress';

const sections = [
  ['01', 'Problem', 'Design is scattered across artefacts.'],
  ['02', 'Formation', 'Bring design into one system.'],
  ['03', 'Understand', 'See relationships across APIs, events, and models.'],
  ['04', 'Manage Change', 'Track impact before building.'],
  ['05', 'Deliver', 'Converged design becomes buildable work.'],
  ['06', 'Demo', 'See the system in action.'],
  ['07', 'Git + YAML', 'Own your model. No lock-in.'],
  ['08', 'Graph', 'A graph of your entire system.'],
  ['09', 'AI', 'Built for AI agents. Designed for human control.'],
  ['10', 'CI/CD', 'Validate design before it becomes code.']
] as const;

export default function App() {
  const scrollProgress = useScrollProgress();

  return (
    <main className="page">
      <ParticleScene progress={scrollProgress} />
      <section className="section hero-section" aria-labelledby="hero-title">
        <div className="section-copy hero-copy">
          <p className="section-kicker">Corum / system model</p>
          <h1 id="hero-title">Software design is fragmented. Corum brings it together.</h1>
          <p className="hero-subtitle">
            Replace scattered artefacts with a structured model that AI can build from and humans can trust.
          </p>
          <p className="hero-support">YAML-backed. Git-native. System-wide graph.</p>
        </div>
      </section>

      {sections.map(([id, label, heading]) => (
        <section className={`section ${label === 'Demo' ? 'demo-section' : ''}`} key={id}>
          <div className="section-copy">
            <p className="section-kicker">{id} / {label}</p>
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
```

- [ ] **Step 4: Create base styles**

Create `src/styles.css`:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #f4f1e8;
  background: #08131d;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  overflow-x: hidden;
}

button,
input,
textarea,
select {
  font: inherit;
}

.page {
  position: relative;
  min-height: 100vh;
}

.section {
  position: relative;
  z-index: 1;
  min-height: 112vh;
  display: flex;
  align-items: center;
  padding: 12vh clamp(1.25rem, 5vw, 5rem);
}

.section:nth-of-type(2n + 1) {
  justify-content: flex-end;
}

.section-copy {
  width: min(620px, 100%);
}

.hero-section {
  min-height: 120vh;
  align-items: flex-start;
  padding-top: 18vh;
}

.hero-copy {
  width: min(760px, 100%);
}

.section-kicker {
  margin: 0 0 1rem;
  color: rgba(255, 125, 102, 0.9);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
  max-width: 12ch;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
  letter-spacing: 0;
}

h1 {
  font-size: clamp(3.7rem, 8vw, 8.8rem);
  line-height: 0.95;
}

h2 {
  font-size: clamp(2.4rem, 5.5vw, 6rem);
  line-height: 0.98;
}

.hero-subtitle {
  margin: 2rem 0 0;
  max-width: 640px;
  color: rgba(244, 241, 232, 0.78);
  font-size: clamp(1.08rem, 2vw, 1.45rem);
  line-height: 1.55;
}

.hero-support {
  margin: 1.5rem 0 0;
  color: rgba(244, 241, 232, 0.58);
  font-size: 0.92rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-section {
  min-height: 130vh;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
}

.demo-section .section-copy {
  width: min(920px, 100%);
}

.demo-section h2 {
  max-width: 11ch;
}

.demo-placeholder {
  width: min(1040px, 100%);
  min-height: 430px;
  display: grid;
  grid-template-columns: 180px 1fr 240px;
  gap: 1px;
  overflow: hidden;
  border: 1px solid rgba(244, 241, 232, 0.16);
  background: rgba(5, 12, 18, 0.62);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}

.demo-sidebar,
.demo-graph,
.demo-panel {
  background: rgba(9, 20, 30, 0.76);
}

.demo-graph {
  display: grid;
  place-items: center;
  color: rgba(244, 241, 232, 0.48);
  font-size: 0.86rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 760px) {
  .section {
    min-height: 105vh;
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 18vh;
  }

  .section:nth-of-type(2n + 1) {
    justify-content: flex-start;
  }

  h1 {
    font-size: clamp(3.2rem, 16vw, 5.4rem);
  }

  h2 {
    font-size: clamp(2.4rem, 13vw, 4.2rem);
  }

  .demo-placeholder {
    min-height: 520px;
    grid-template-columns: 1fr;
    grid-template-rows: 72px 1fr 150px;
  }
}
```

### Task 4: Three.js Particle Scene

**Files:**
- Create: `src/particle/ParticleScene.tsx`

- [ ] **Step 1: Create Three.js scene component**

Create `src/particle/ParticleScene.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createParticleNodes,
  resolveCoralAmount,
  resolveEdgeOpacity,
  resolveParticleTargets
} from './particleModel';

type ParticleSceneProps = {
  progress: number;
};

type RuntimeNode = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
};

const nodeBase = new THREE.Color('#f4f1e8');
const nodeCoral = new THREE.Color('#ff7d66');
const edgeColor = new THREE.Color('#e8efe8');
const startBg = new THREE.Color('#cfc9b8');
const midBg = new THREE.Color('#6f9998');
const endBg = new THREE.Color('#071522');

function backgroundForProgress(progress: number): THREE.Color {
  if (progress < 0.46) {
    return startBg.clone().lerp(midBg, progress / 0.46);
  }

  return midBg.clone().lerp(endBg, (progress - 0.46) / 0.54);
}

export function ParticleScene({ progress }: ParticleSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.dataset-testid = 'particle-canvas';
    host.appendChild(renderer.domElement);

    const nodeCount = window.innerWidth < 760 ? 42 : 72;
    const nodes = createParticleNodes(nodeCount);
    const runtimeNodes: RuntimeNode[] = [];
    const nodeGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(1, 18, 18);

    for (const node of nodes) {
      const material = new THREE.MeshBasicMaterial({
        color: nodeBase,
        transparent: true,
        opacity: 0.78
      });
      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.set(node.origin.x, node.origin.y, 0);
      mesh.scale.setScalar(node.size);
      nodeGroup.add(mesh);
      runtimeNodes.push({ mesh, velocity: new THREE.Vector3() });
    }

    scene.add(nodeGroup);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: edgeColor,
      transparent: true,
      opacity: 0
    });
    const edgePositions: number[] = [];
    for (let index = 0; index < nodes.length - 1; index += 1) {
      if (nodes[index].cluster === nodes[index + 1].cluster || index % 7 === 0) {
        edgePositions.push(0, 0, 0, 0, 0, 0);
      }
    }
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    scene.add(edges);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      const aspect = width / Math.max(height, 1);

      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resize();
    window.addEventListener('resize', resize);

    let animationFrame = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const currentProgress = progressRef.current;
      const targets = resolveParticleTargets(nodes, currentProgress);
      const damping = 0.86 - currentProgress * 0.2;
      const idleAmount = 0.018 * (1 - currentProgress * 0.72);

      scene.background = backgroundForProgress(currentProgress);

      for (let index = 0; index < runtimeNodes.length; index += 1) {
        const runtime = runtimeNodes[index];
        const node = nodes[index];
        const target = targets[index];
        const idleX = Math.sin(elapsed * 0.28 + node.id * 1.7) * idleAmount;
        const idleY = Math.cos(elapsed * 0.22 + node.id * 1.1) * idleAmount;
        const desiredX = target.x + idleX;
        const desiredY = target.y + idleY;

        runtime.velocity.x += (desiredX - runtime.mesh.position.x) * 0.012;
        runtime.velocity.y += (desiredY - runtime.mesh.position.y) * 0.012;

        for (let otherIndex = index + 1; otherIndex < runtimeNodes.length; otherIndex += 1) {
          const other = runtimeNodes[otherIndex];
          const dx = runtime.mesh.position.x - other.mesh.position.x;
          const dy = runtime.mesh.position.y - other.mesh.position.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq > 0.0001 && distanceSq < 0.006) {
            const force = 0.000012 / distanceSq;
            runtime.velocity.x += dx * force;
            runtime.velocity.y += dy * force;
            other.velocity.x -= dx * force;
            other.velocity.y -= dy * force;
          }
        }

        runtime.velocity.multiplyScalar(damping);
        runtime.mesh.position.add(runtime.velocity);

        const material = runtime.mesh.material as THREE.MeshBasicMaterial;
        material.color.copy(nodeBase).lerp(nodeCoral, resolveCoralAmount(node, currentProgress));
        material.opacity = 0.54 + currentProgress * 0.34;
        runtime.mesh.scale.setScalar(node.size * (1 + resolveCoralAmount(node, currentProgress) * 0.42));
      }

      const positions = edgeGeometry.getAttribute('position') as THREE.BufferAttribute;
      let cursor = 0;
      for (let index = 0; index < nodes.length - 1 && cursor < positions.count; index += 1) {
        if (nodes[index].cluster === nodes[index + 1].cluster || index % 7 === 0) {
          const a = runtimeNodes[index].mesh.position;
          const b = runtimeNodes[index + 1].mesh.position;
          positions.setXYZ(cursor, a.x, a.y, -0.01);
          positions.setXYZ(cursor + 1, b.x, b.y, -0.01);
          cursor += 2;
        }
      }
      positions.needsUpdate = true;
      edgeMaterial.opacity = resolveEdgeOpacity(currentProgress);

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      host.removeChild(renderer.domElement);
      renderer.dispose();
      nodeGeometry.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      for (const runtime of runtimeNodes) {
        (runtime.mesh.material as THREE.Material).dispose();
      }
    };
  }, []);

  return <div ref={hostRef} className="particle-scene" aria-hidden="true" />;
}
```

- [ ] **Step 2: Add particle scene CSS**

Append to `src/styles.css`:

```css
.particle-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.particle-scene canvas {
  width: 100%;
  height: 100%;
  display: block;
}
```

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: TypeScript passes and Vite emits `dist`.

### Task 5: Browser Verification

**Files:**
- Create: `tests/corum-skeleton.spec.ts`

- [ ] **Step 1: Add Playwright test**

Create `tests/corum-skeleton.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('renders the Corum particle skeleton and scroll sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Software design is fragmented/i })).toBeVisible();
  await expect(page.locator('[data-testid="particle-canvas"]')).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.58));
  await expect(page.getByText('See the system in action.')).toBeVisible();

  const canvasBox = await page.locator('[data-testid="particle-canvas"]').boundingBox();
  expect(canvasBox?.width).toBeGreaterThan(300);
  expect(canvasBox?.height).toBeGreaterThan(300);
});
```

- [ ] **Step 2: Install Playwright browser**

Run: `npx playwright install chromium`

Expected: Chromium browser binaries are installed.

- [ ] **Step 3: Run app and execute E2E test**

Run in one terminal: `npm run dev -- --port 5173`

Run in another terminal: `npx playwright test --config=playwright.config.ts`

Expected: test passes.

- [ ] **Step 4: If Playwright config is missing, create it**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
```

- [ ] **Step 5: Re-run E2E test**

Run: `npx playwright test`

Expected: Chromium and mobile Chrome projects pass.

### Task 6: Final Local Verification

**Files:**
- Modify only if verification exposes defects in files created above.

- [ ] **Step 1: Run unit tests**

Run: `npm test`

Expected: all Vitest tests pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: TypeScript and Vite build pass.

- [ ] **Step 3: Run E2E tests**

Run: `npx playwright test`

Expected: both desktop and mobile smoke tests pass.

- [ ] **Step 4: Start local dev server for review**

Run: `npm run dev -- --port 5173`

Expected: app is available at `http://127.0.0.1:5173`.
