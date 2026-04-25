import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createParticleNodes,
  resolveCoralAmount,
  resolveEdgeOpacity,
  resolveFormationTimeline,
  resolveIdleCurrent,
  resolveLabelOpacity,
  resolveParticleTargets
} from './particleModel';
import { focusPocketCount, type SectionFocus } from './sectionFocus';

type ParticleSceneProps = {
  focus: SectionFocus;
  progress: number;
};

type RuntimeNode = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
};

type LabelOverlay = {
  id: number;
  opacity: number;
  text: string;
  x: number;
  y: number;
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

export function ParticleScene({ focus, progress }: ParticleSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef(focus);
  const progressRef = useRef(progress);
  const [labelOverlays, setLabelOverlays] = useState<LabelOverlay[]>([]);
  let isMobileViewport = typeof window !== 'undefined' ? window.innerWidth < 760 : false;

  useEffect(() => {
    focusRef.current = focus;
    progressRef.current = progress;
  }, [focus, progress]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.dataset.testid = 'particle-canvas';
    host.appendChild(renderer.domElement);

    const nodeCount = window.innerWidth < 760 ? 42 : 72;
    const nodes = createParticleNodes(nodeCount);
    const formationTimeline = resolveFormationTimeline(focusPocketCount);
    const runtimeNodes: RuntimeNode[] = [];
    const sceneRig = new THREE.Group();
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

    sceneRig.add(nodeGroup);

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
    sceneRig.add(edges);
    scene.add(sceneRig);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      const aspect = width / Math.max(height, 1);
      isMobileViewport = window.innerWidth < 760;

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
      const currentFocus = focusRef.current;
      const targets = resolveParticleTargets(nodes, currentProgress, formationTimeline);
      const damping = 0.86 - currentProgress * 0.18 - currentFocus.lock * 0.08;
      const idleAmount = resolveIdleCurrent(currentProgress, elapsed) * (1 - currentFocus.lock * 0.5);
      const rigEase = 0.035 + currentFocus.velocity * 0.105;
      const targetRigPosition = new THREE.Vector3(currentFocus.target.x, currentFocus.target.y, 0);
      const targetRigScale = new THREE.Vector3(currentFocus.zoom, currentFocus.zoom, currentFocus.zoom);

      scene.background = backgroundForProgress(currentProgress);
      sceneRig.position.lerp(targetRigPosition, rigEase);
      sceneRig.scale.lerp(targetRigScale, rigEase);

      for (let index = 0; index < runtimeNodes.length; index += 1) {
        const runtime = runtimeNodes[index];
        const node = nodes[index];
        const target = targets[index];
        const currentX = Math.sin(elapsed * 0.3 + node.id * 1.7);
        const currentY = Math.cos(elapsed * 0.24 + node.id * 1.1);
        const crossCurrent = Math.sin(elapsed * 0.16 + node.cluster * 1.9 + node.id * 0.18);
        const idleX = (currentX + crossCurrent * 0.34) * idleAmount;
        const idleY = (currentY + crossCurrent * 0.22) * idleAmount;
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
        const coralAmount = resolveCoralAmount(node, currentProgress, formationTimeline);
        material.color.copy(nodeBase).lerp(nodeCoral, coralAmount);
        material.opacity = 0.54 + currentProgress * 0.34;
        runtime.mesh.scale.setScalar(node.size * (1 + coralAmount * 0.42));
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
      edgeMaterial.opacity = resolveEdgeOpacity(currentProgress, formationTimeline);

      renderer.render(scene, camera);
      sceneRig.updateMatrixWorld(true);

      const width = renderer.domElement.clientWidth;
      const height = renderer.domElement.clientHeight;
      const projectedLabels: LabelOverlay[] = [];
      const worldPosition = new THREE.Vector3();
      const projectedPosition = new THREE.Vector3();

      if (!isMobileViewport) {
        for (let index = 0; index < runtimeNodes.length; index += 1) {
          const node = nodes[index];
          if (!node.label) {
            continue;
          }

          const opacity = resolveLabelOpacity(node, currentProgress);
          if (opacity <= 0) {
            continue;
          }

          runtimeNodes[index].mesh.getWorldPosition(worldPosition);
          worldPosition.x += node.size * 1.35 * sceneRig.scale.x;
          projectedPosition.copy(worldPosition).project(camera);
          projectedLabels.push({
            id: node.id,
            opacity,
            text: node.label,
            x: (projectedPosition.x * 0.5 + 0.5) * width,
            y: (-projectedPosition.y * 0.5 + 0.5) * height
          });
        }
      }

      setLabelOverlays(projectedLabels);
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

  return (
    <div ref={hostRef} className="particle-scene" aria-hidden="true">
      <div className="particle-labels">
        {labelOverlays.map((label) => (
          <span
            className="particle-label"
            key={label.id}
            style={{
              opacity: label.opacity,
              transform: `translate3d(${label.x}px, ${label.y}px, 0) translateY(-50%)`
            }}
          >
            {label.text}
          </span>
        ))}
      </div>
    </div>
  );
}
