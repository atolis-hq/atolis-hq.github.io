export type Vec2 = {
  x: number;
  y: number;
};

export type ParticleNode = {
  id: number;
  cluster: number;
  size: number;
  label?: string;
  labelFadeStart: number;
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

export type FormationTimeline = {
  clusterStart: number;
  clusterComplete: number;
  edgeStart: number;
  edgeComplete: number;
  stableStart: number;
  stableComplete: number;
  coralStart: number;
  coralComplete: number;
};

const coralThresholdFloor = 0.66;
const coralThresholdRange = 0.26;

const clusterCenters: Vec2[] = [
  { x: -0.52, y: 0.28 },
  { x: 0.18, y: 0.34 },
  { x: 0.52, y: -0.16 },
  { x: -0.18, y: -0.34 }
];

const nodeLabels = [
  'API Endpoint',
  'Integration Event',
  'Domain Model',
  'Read Model',
  'Acceptance Criteria',
  'Command',
  'Documentation',
  'User Story',
  'Milestone',
  'User Journey'
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

function sectionProgress(sectionIndex: number, sectionCount: number): number {
  const maxIndex = Math.max(1, sectionCount - 1);
  return Math.min(1, Math.max(0, sectionIndex / maxIndex));
}

export function resolveFormationTimeline(sectionCount: number): FormationTimeline {
  return {
    clusterStart: sectionProgress(1, sectionCount),
    clusterComplete: sectionProgress(3, sectionCount),
    edgeStart: sectionProgress(1, sectionCount),
    edgeComplete: sectionProgress(4, sectionCount),
    stableStart: sectionProgress(2, sectionCount),
    stableComplete: sectionProgress(sectionCount - 1, sectionCount),
    coralStart: sectionProgress(1, sectionCount),
    coralComplete: sectionProgress(sectionCount - 2, sectionCount)
  };
}

export const defaultFormationTimeline = resolveFormationTimeline(7);

export function createParticleNodes(count: number): ParticleNode[] {
  const labelCount = Math.round(count * 0.2);
  const labelStep = labelCount > 0 ? Math.max(1, Math.round(count / labelCount)) : count + 1;

  return Array.from({ length: count }, (_, index) => {
    const cluster = index % clusterCenters.length;
    const center = clusterCenters[cluster];
    const angle = seeded(index, 5) * Math.PI * 2;
    const radius = 0.08 + seeded(index, 6) * 0.2;
    const labelOrder = Math.floor(index / labelStep);
    const labelled = index % labelStep === 0 && labelOrder < labelCount;

    return {
      id: index,
      cluster,
      size: 0.012 + seeded(index, 4) * 0.012,
      label: labelled ? nodeLabels[labelOrder % nodeLabels.length] : undefined,
      labelFadeStart: labelled ? labelOrder * 0.006 : 0,
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

export function resolveParticleTargets(
  nodes: ParticleNode[],
  progress: number,
  timeline: FormationTimeline = defaultFormationTimeline
): Vec2[] {
  const clusterAmount = smoothstep(timeline.clusterStart, timeline.clusterComplete, progress);
  const stableAmount = smoothstep(timeline.stableStart, timeline.stableComplete, progress);

  return nodes.map((node) => {
    const clusterX = mix(node.origin.x, node.clusterTarget.x, clusterAmount);
    const clusterY = mix(node.origin.y, node.clusterTarget.y, clusterAmount);

    return {
      x: mix(clusterX, node.stableTarget.x, stableAmount),
      y: mix(clusterY, node.stableTarget.y, stableAmount)
    };
  });
}

export function resolveCoralAmount(
  node: ParticleNode,
  progress: number,
  timeline: FormationTimeline = defaultFormationTimeline
): number {
  const interval = Math.max(0.0001, timeline.coralComplete - timeline.coralStart);
  const normalizedThreshold = Math.min(
    1,
    Math.max(0, (node.coralThreshold - coralThresholdFloor) / coralThresholdRange)
  );
  const staggeredThreshold = normalizedThreshold ** 1.25;
  const nodeWindow = Math.max(0.05, interval * 0.22);
  const nodeStart = mix(timeline.coralStart, timeline.coralComplete - nodeWindow, staggeredThreshold);
  const nodeEnd = Math.min(timeline.coralComplete, nodeStart + nodeWindow);
  return smoothstep(nodeStart, nodeEnd, progress);
}

export function resolveEdgeOpacity(
  progress: number,
  timeline: FormationTimeline = defaultFormationTimeline
): number {
  return smoothstep(timeline.edgeStart, timeline.edgeComplete, progress) * (0.28 + getStageBlend(progress).stable * 0.42);
}

export function resolveLabelOpacity(node: ParticleNode, progress: number): number {
  if (!node.label) {
    return 0;
  }

  return 1 - smoothstep(node.labelFadeStart, node.labelFadeStart + 0.055, progress);
}

export function resolveIdleCurrent(progress: number, elapsed: number): number {
  const topInfluence = 1 - smoothstep(0.03, 0.34, progress);
  const slowSwell = 0.5 + Math.sin(elapsed * 0.42 - 1.2) * 0.5;
  const secondarySwell = 0.5 + Math.sin(elapsed * 0.17 + 1.8) * 0.5;
  const currentPulse = 0.72 + slowSwell * 0.58 + secondarySwell * 0.18;
  const baseMotion = 0.006 * (1 - progress * 0.36);

  return baseMotion + topInfluence * 0.016 * currentPulse;
}
