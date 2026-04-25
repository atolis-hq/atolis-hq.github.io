# Corum Landing Page — Visual & Motion Refinement (Organic System Behaviour)

## Core Addition

The system should not feel like a rigid graph.

It should feel like:

> **a living system where structure emerges naturally**

Particles/Nodes should:

* drift slightly
* attract and group
* form clusters (bounded contexts)
* stabilise gradually
* turn a shade of coral as they stablilse.

---

## 1. Node Behaviour

### Movement

* Nodes have **very subtle idle motion**
* Slight drift (1–3px range, slow easing)
* No jitter or randomness that feels noisy

### Interaction Between Nodes

Nodes should exhibit:

* **attraction forces** (towards related nodes)
* **repulsion forces** (to avoid overlap)
* **soft clustering behaviour**

Think:

* magnetism
* gravity
* not snapping or rigid alignment

---

## 2. Clustering (Critical Concept)

Clusters represent:

* bounded contexts
* logical groupings (API domain, aggregate, etc.)

### Behaviour

* Nodes **move toward cluster centers**
* Clusters form BEFORE full connections are visible
* Connections (edges) appear AFTER clustering
This creates:

> grouping → then structure
> (not the other way around)

---

### Visual Treatment of Clusters


* clusters are only identified by the groupning of nodes - there are no backgrounds or borders used to define a cluster. 


---

## 3. Formation Sequence (Updated)

### Stage 1 — Fragmentation

* Nodes scattered
* No clusters
* Free movement

---

### Stage 2 — Attraction

* Nodes begin drifting toward invisible centers
* Early clusters form
* Still loosely organised

---

### Stage 3 — Clustering

* Groups become clearer
* Density increases
* Motion reduces

---

### Stage 4 — Connection

* Edges appear between nodes
* Relationships become visible
* Structure overlays clusters

---

### Stage 5 — Convergence

* nodes turn coral as they are agreed (agreement / quorum)
* System stabilises

---

## 4. Shape & Styling

### Nodes

Avoid perfect uniformity.

Use:

* slightly varied sizes (subtle)
* soft edges (not sharp geometric dots)
* faint glow or blur

Optional:

* very slight shape variation (not all perfect circles)

---

### Edges

* Thin, soft lines
* Slight curvature (not rigid straight lines)
* Opacity-based (fade in/out)

---

### Cluster Feel

Clusters should feel like:

* constellations
* cells
* ecosystems

NOT:

* grids
* diagrams
* strict hierarchies

---

## 5. Motion Characteristics

### Timing

* Slow easing (ease-in-out)
* No sudden snaps
* Transitions feel continuous

### Responsiveness

* On scroll:

  * clusters tighten
  * motion reduces
  * clarity increases

---

## 6. Coral (Convergence Signal)

Coral represents:

* agreement
* validated design
* “quorum reached”

### Behaviour

* Nodes turn coral gradually (fade)
* Slight pulse when state changes
* Never overused

---

## 7. Demo Section Contrast

Before demo:

* organic, evolving, slightly fluid

At demo:

* system becomes more structured
* nodes stabilise further
* UI introduces clarity and control

This contrast is important:

> organic system → controlled system


---

## 9. What to Avoid

* Rigid grid layouts
* Perfect symmetry
* Instant snapping into position
* Overly chaotic particle effects
* High-speed motion
* Heavy physics simulation (should feel light, not game-like)

---

## 10. Key Design Principle

If done correctly, the user should feel:

> “This system is organising itself into something understandable.”

Not:

> “This is a diagram being drawn.”

---

## 11. Implementation Hint (for dev handoff)

This behaviour can be achieved using:

* force-directed graph logic (with heavy damping)
* custom easing overlays
* cluster attraction forces
* low-motion animation loops

But visual smoothness is more important than physical accuracy.

Three.js / WebGL particle systems
GSAP ScrollTrigger controlling camera / transforms
Nodes = particles, edges = subtle lines or implied proximity

---

## Final Note

This organic clustering behaviour is a **signature element** of Corum’s identity.

It visually reinforces:

* bounded contexts
* emergent structure
* system thinking

It should feel subtle, intelligent, and intentional—not decorative.
