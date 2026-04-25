import { describe, expect, it } from 'vitest';
import {
  createParticleNodes,
  getStageBlend,
  resolveIdleCurrent,
  resolveLabelOpacity,
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

  it('labels roughly 15 percent of nodes with design artefact names', () => {
    const nodes = createParticleNodes(72);
    const labelled = nodes.filter((node) => node.label);
    const labelledIndexes = nodes.flatMap((node, index) => (node.label ? [index] : []));

    expect(labelled).toHaveLength(14);
    expect(labelledIndexes).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]);
    expect(labelled.map((node) => node.label)).toContain('API Endpoint');
    expect(labelled.map((node) => node.label)).toContain('Integration Event');
  });

  it('fades labels away with staggered timing near the top of the page', () => {
    const labelled = createParticleNodes(72).filter((node) => node.label);
    const first = labelled[0];
    const later = labelled[labelled.length - 1];

    expect(resolveLabelOpacity(first, 0)).toBe(1);
    expect(resolveLabelOpacity(first, 0.01)).toBeLessThan(1);
    expect(resolveLabelOpacity(first, 0.08)).toBe(0);
    expect(resolveLabelOpacity(later, 0.05)).toBeGreaterThan(resolveLabelOpacity(first, 0.05));
    for (const node of labelled) {
      expect(resolveLabelOpacity(node, 0.14)).toBe(0);
    }
  });

  it('adds pulsing current motion near the top and calms later in the page', () => {
    const stiller = resolveIdleCurrent(0.02, 0);
    const stronger = resolveIdleCurrent(0.02, 8);
    const later = resolveIdleCurrent(0.62, 8);

    expect(stronger).toBeGreaterThan(stiller);
    expect(later).toBeLessThan(stronger);
    expect(later).toBeGreaterThan(0);
  });
});
