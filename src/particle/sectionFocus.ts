import type { Vec2 } from './particleModel';

export type SectionFocus = {
  target: Vec2;
  zoom: number;
  lock: number;
  velocity: number;
};

type FocusPocket = {
  x: number;
  y: number;
  zoom: number;
};

const desktopPockets: FocusPocket[] = [
  { x: 0, y: 0, zoom: 1 },
  { x: -0.36, y: 0.2, zoom: 1.14 },
  { x: 0.34, y: -0.18, zoom: 1.2 },
  { x: -0.16, y: -0.24, zoom: 1.25 },
  { x: -0.42, y: 0.1, zoom: 1.22 },
  { x: 0.38, y: -0.06, zoom: 1.19 },
  { x: -0.28, y: 0.2, zoom: 1.17 },
  { x: 0, y: 0, zoom: 1.34 },
  { x: 0.28, y: -0.18, zoom: 1.15 }
];

export const focusPocketCount = desktopPockets.length;

const mobilePockets: FocusPocket[] = desktopPockets.map((pocket) => ({
  x: pocket.x * 0.42,
  y: pocket.y * 0.62,
  zoom: 1 + (pocket.zoom - 1) * 0.58
}));

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

function lockCurve(localProgress: number): number {
  const distanceFromMiddle = Math.abs(localProgress - 0.5) * 2;
  return 1 - smoothstep(0.18, 0.74, distanceFromMiddle);
}

function accelerationCurve(localProgress: number): number {
  const release = smoothstep(0.48, 0.92, localProgress);
  const arrival = 1 - smoothstep(0.08, 0.4, localProgress);
  return Math.max(release, arrival);
}

export function resolveSectionFocus(progress: number, isMobile: boolean): SectionFocus {
  const pockets = isMobile ? mobilePockets : desktopPockets;
  const clamped = clamp01(progress);
  const scaled = clamped * (pockets.length - 1);
  const index = Math.min(pockets.length - 2, Math.floor(scaled));
  const localProgress = scaled - index;
  const easedProgress = smoothstep(0, 1, localProgress);
  const current = pockets[index];
  const next = pockets[index + 1];
  const lock = index === 0 && localProgress < 0.48 ? 0 : lockCurve(localProgress);
  const lateMotion = smoothstep(0.72, 1, clamped) * 0.14;
  const velocity = Math.max(lateMotion, accelerationCurve(localProgress) * (1 - lock * 0.54));
  const lockCeiling = 1 - lateMotion * 0.8;

  return {
    target: {
      x: mix(current.x, next.x, easedProgress),
      y: mix(current.y, next.y, easedProgress)
    },
    zoom: mix(current.zoom, next.zoom, easedProgress),
    lock: Math.min(lock, lockCeiling),
    velocity
  };
}
