import corumLogo from './assets/corum-logo.svg';
import wakeLogo from './assets/wake-logo.svg';

export type ProductSlug = 'corum' | 'wake';

export type Product = {
  slug: ProductSlug;
  name: string;
  logo: string;
  accent: string;
  accentSoft: string;
  tagline: string;
  summary: string;
  installCommand: string;
  githubUrl: string;
  npmUrl: string;
  docsUrl: string;
  homeBullets: string[];
  capabilities: Array<{
    title: string;
    body: string;
  }>;
};

export const products: Product[] = [
  {
    slug: 'corum',
    name: 'Corum',
    logo: corumLogo,
    accent: '#e8614a',
    accentSoft: '#f4a58a',
    tagline: 'Unified system design surface, built for agents and humans.',
    summary:
      'Corum is a Git-native design graph for software architecture. It models components as nodes with typed edges so humans and AI assistants can inspect, reason about, and evolve system design.',
    installCommand: 'npm install -g @atolis-hq/corum',
    githubUrl: 'https://github.com/atolis-hq/corum',
    npmUrl: 'https://www.npmjs.com/package/@atolis-hq/corum',
    docsUrl: 'https://github.com/atolis-hq/corum#readme',
    homeBullets: ['Git-native architecture graph', 'MCP tools for agent access', 'OpenAPI and AsyncAPI imports'],
    capabilities: [
      {
        title: 'Model software as a graph',
        body: 'Represent APIs, events, schemas, domain models, and custom templates as connected design nodes.',
      },
      {
        title: 'Give agents structured context',
        body: 'Expose compact MCP tools for discovery, lineage, search, graph summaries, and controlled mutation workflows.',
      },
      {
        title: 'Track design change before delivery',
        body: 'Use typed edges, branch-aware reads, diffs, and impact analysis to understand what a change touches.',
      },
    ],
  },
  {
    slug: 'wake',
    name: 'Wake',
    logo: wakeLogo,
    accent: '#2dd4bf',
    accentSoft: '#5eead4',
    tagline: 'Autonomous software engineering control plane.',
    summary:
      'Wake watches durable work channels, routes agent activity through explicit lifecycle stages, and keeps execution resumable, inspectable, and attached to the work item.',
    installCommand: 'npm install -g @atolis-hq/wake',
    githubUrl: 'https://github.com/atolis-hq/wake',
    npmUrl: 'https://www.npmjs.com/package/@atolis-hq/wake',
    docsUrl: 'https://github.com/atolis-hq/wake#readme',
    homeBullets: ['Issue-driven autonomous work', 'Runner adapters for local agent CLIs', 'Event-sourced, restart-safe execution'],
    capabilities: [
      {
        title: 'Coordinate work where it starts',
        body: 'Use GitHub Issues as the durable interface for progress, questions, approvals, and pull request outcomes.',
      },
      {
        title: 'Route agents through lifecycle stages',
        body: 'Move work through refinement, planning, implementation, review, and operator intervention with explicit policy.',
      },
      {
        title: 'Keep execution local and resumable',
        body: 'Persist state, logs, runs, workspaces, and sandbox data so long-running engineering work can stop and resume.',
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
