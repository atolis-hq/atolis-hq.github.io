# Corum Three Particle Skeleton Design

## Goal

Build a first-pass landing page skeleton for Corum where the Three.js particle system is the primary design artifact. The page should let us evaluate colours, typography, section rhythm, scroll mechanics, and organic node behaviour before detailed content sections are built.

## Scope

This pass includes:

- A Vite, React, and TypeScript app shell.
- A fixed full-viewport Three.js scene behind all page content.
- Scroll-driven background colour fading from light sandy teal into deep blue.
- Placeholder section titles and identifiers for the full landing page narrative.
- Organic particle mechanics: drift, attraction, clustering, edge reveal, convergence, and stabilisation.
- Coral node transitions as the convergence signal.
- A stable demo placeholder section, without detailed demo UI.

This pass excludes:

- Final copy layout beyond the hero and section placeholders.
- Detailed demo panel behaviour from `demopanel.md`.
- Production-ready analytics, forms, routing, CMS, or deployment configuration.
- Final WebGL shader polish.

## Experience Model

The page should feel like a system organising itself into something understandable. The visitor scrolls through a sequence of states:

1. Fragmentation: sparse nodes drift without visible structure.
2. Attraction: nodes begin moving toward invisible cluster centres.
3. Clustering: bounded-context-like groups become visible through node proximity.
4. Connection: soft curved edges fade in after clusters form.
5. Convergence: selected nodes turn coral and pulse subtly.
6. Stable demo: motion calms and the first UI placeholder appears.

The content layer should act as scroll markers and narrative anchors. It should not compete with the particle system.

## Visual Direction

The design should be restrained, technical, and premium. The background transitions gradually across several viewport heights from a light sandy teal state into a deep Atolis blue state. Coral is only used for selected nodes, converged states, key action hints, and sparse highlighted text.

Typography should be confident and minimal:

- Large hero headline with measured line height.
- Small uppercase section identifiers.
- Placeholder headings for each section.
- Limited body text until detailed sections are designed.

The particle scene should avoid rigid diagram behaviour. Clusters are implied only by node movement and density, with no enclosing cluster backgrounds or borders.

## Technical Architecture

Use Vite, React, TypeScript, and Three.js. React owns the page shell, sections, scroll progress, and layout. Three.js owns the fixed visual scene and receives a normalized scroll progress value plus viewport dimensions.

The Three.js scene should use:

- A fixed canvas covering the viewport.
- A deterministic node seed so motion is stable between reloads.
- Lightweight meshes or points for nodes.
- Line geometry for soft edges.
- Per-frame easing rather than abrupt state changes.
- Reduced node counts on small screens.

The first implementation should keep the physics deliberately simple and tunable: target positions are derived from scroll stage and cluster membership, while velocity damping, attraction, repulsion, idle drift, and convergence colour are applied each frame.

## Section Placeholders

Create placeholders for:

- Hero
- Problem
- Formation
- Understand
- Manage Change
- Deliver
- Demo
- Git + YAML
- Graph
- AI
- CI/CD

Each section should have a visible identifier and heading. The demo section should show a centred placeholder panel to mark the eventual UI reveal.

## Interaction And Motion Constraints

- Scroll drives the main transition sequence.
- Idle motion remains slow and subtle.
- Clustering happens before edges are visible.
- Edges fade in gradually.
- Coral appears gradually and remains sparse.
- Motion reduces as the system stabilises.
- No hover-only interactions are required in this pass.
- Mobile should show fewer nodes and simplified framing.

## Testing And Verification

Verify the skeleton by:

- Running the app locally.
- Confirming TypeScript/build succeeds.
- Checking the page scrolls through all placeholder sections.
- Checking the canvas is nonblank on desktop and mobile viewport sizes.
- Checking background colour changes with scroll.
- Checking nodes visibly drift, cluster, connect, and stabilise.

## Open Decision For Later

The final polish may keep the custom Three.js simulation or graduate to shader-based particles if the organic motion needs more density. This skeleton should make that decision easier without requiring it now.
