# Corum Landing Page Design Brief

## Overview

Design a modern, high-end landing page for **Corum**, an open-source software modelling tool.

Corum unifies fragmented software design (APIs, events, domain models, journeys) into a **single, structured system** that is:

* Git-native
* YAML-backed
* Represented as a system-wide graph
* Designed for AI agents with human review

The design should feel:

* Technical and credible (engineer-first)
* Visually impressive but restrained
* Concept-driven (not decorative)
* Clean, minimal, and premium

Avoid gimmicks, illustrations, or anything playful. This is a serious developer tool.

---

## Core Concept

**“From fragmentation to a unified system.”**

The entire page should visually and conceptually follow:

1. Fragmentation (disconnected artefacts)
2. Formation (nodes connecting)
3. Convergence (decisions / quorum)
4. System (stable, interactive model)

---

## Visual Style

### Colour System

* Background gradient: light sandy  teal → deep blue  (Atolis brand)
* gradient is gradual and takes several pages to transition through.
* Primary surface for card overlays: near-black / dark charcoal
* Accent: **coral (used sparingly)**
* Coral is ONLY used for:

  * selected nodes
  * key actions
  * “converged” states
  * highlithted text / headers

Avoid large coral areas. Use glow, not fill.

---

### Design Language

* Abstract graph / node system
* Glassmorphism / layered depth (subtle)
* Soft glow highlights
* Minimal UI chrome
* No literal ocean/coral imagery

---

### Motion Principles

* Slow, intentional, meaningful
* Motion reflects system state:
* drifting = uncertainty
* connecting = understanding
* stable = clarity

The nodes could be positioned in a section of the page, as the page scrolls, they could move into free space, maybe the fee space is left or right or center (bg) depending on layout

---

## Page Structure

---

## 1. Hero Section

### Layout

* Left: text
* Right: abstract animated node system (NOT product UI)

### Copy

**Headline:**
Software design is fragmented. Corum brings it together.

**Subtext:**
Replace scattered artefacts with a structured model that AI can build from—and humans can trust.

**Supporting line (small):**
YAML-backed. Git-native. System-wide graph.

**CTA:**
See how it comes together ↓

---

### Visual Behaviour

* Sparse nodes drifting slowly
* No clear structure
* Subtle motion only
* No UI panels yet

---

## 2. Problem Section

### Copy

**Heading:**
Design is scattered across artefacts.

**Body:**

* APIs, events, diagrams, and documents live separately
* No single view of the system
* High cognitive overhead to piece things together
* Hard to understand what’s in flight
* Impact of changes is unclear
* Validation happens too late

---

### Visual

* Nodes grouped but disconnected
* No edges between clusters
* Slight visual chaos
* approx 15 nodes

---

## 3. Formation / Transition Section

### Purpose

This is the key animated transition.

---

### Behaviour (on scroll)

* Nodes begin connecting
* New nodes appear
* Clusters merge
* Lines form gradually, within clusters first then few lines between 
* Motion reduces over time

---

### Copy

**Heading:**
Bring design into one system.

**Body:**
Everything is modelled together. Relationships are explicit. The system becomes visible.

---

## 4. Capabilities Section

Split into 3 blocks. Each advances the visual.

---

### A. Understand

**Copy:**
See your system as a whole. Trace relationships across APIs, events, and models.

**Visual:**

* Labels appear on nodes (API, Event, Aggregate)
* Graph becomes clearer

---

### B. Manage Change

**Copy:**
Understand impact before building. Track what’s in flight. Propose changes safely.

**Visual:**

* Branch overlay (ghost nodes or alternate paths)

---

### C. Deliver

**Copy:**
Slice work clearly. Validate earlier. Align design and build.

**Visual:**

* Some nodes turn coral (converged / agreed)
* Motion slows further

---

## 5. Demo Section (PRIMARY FOCUS)

### Heading

See the system in action.

**Subtext:**
Explore how design, relationships, and delivery come together in one model.

---

### Layout

Centered interactive panel (this is the first time we show UI)

Simplified UI:

* Left sidebar: node types
  (API, Event, Aggregate, Journey)
* Main panel: graph
* On interaction:

  * YAML panel appears (right on desktop, bottom sheet on mobile)

---

Leave as a placeholder for initial implementation. Eventual design is in [demopanel.md](demopanel.md)

---

### Motion

* Minimal movement (stable system)
* Coral highlights key nodes
* Focus on clarity over animation

---

## 6. Git + YAML Section

### Heading

Own your model. No lock-in.

### Copy

* Stored as clean, readable YAML
* Lives in your Git repository
* Works across branches simultaneously
* Fully versioned and auditable

**Key line:**
Corum understands your repository as a system—not just files.

---

### Visual

* Git branch lines on left
* Unified graph on right

---

## 7. Graph Section

### Heading

A graph of your entire system.

### Copy

* Object-level relationships
* Field-level relationships
* Cross-domain dependencies

**Key line:**
From a single field change to system-wide impact—instantly visible.

---

### Visual

* Highlight one field
* Animate ripple across graph

---

## 8. AI Section

### Heading

Built for AI agents. Designed for human control.

### Copy

* Structured models AI can reason about
* Agents can inspect and update the system
* Humans review, guide, and approve

**Key line:**
AI operates on your system—not loose context.

---

### Note

Do NOT over-emphasise “AI visuals”. Keep this grounded and technical.

---

## 9. CI/CD Section

### Heading

Validate design before it becomes code.

### Copy

* Linting for models
* Schema validation
* Relationship checks
* CI/CD integration

**Key line:**
Catch issues at design time—not in production.

---

---

## Interaction Rules (Global)

* No hover-only interactions (must work on mobile)
* Use tap/click + scroll-driven transitions
* Progressive disclosure (don’t show everything at once)

---

## Mobile Adaptation

* Graph simplified and zoomed, stays in background.
* YAML opens as bottom sheet
* Fewer visible nodes at once
* Maintain same narrative flow

---

## Tone Guidelines

* Precise, technical, confident
* No buzzwords or fluff
* Avoid generic SaaS language
* Let visuals and demo do the work

---

## Deliverables Expected

* Desktop + mobile designs
* Scroll interaction states
* Demo interaction states
* Component system (buttons, panels, graph styles)
* Motion guidelines

---

## Summary

This is not just a landing page.

It should feel like:

> A system forming in front of you—then becoming something you can interact with.

The demo is the payoff. The rest of the page exists to make that moment land.
