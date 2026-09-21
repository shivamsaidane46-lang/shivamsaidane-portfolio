import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GALAXY_DATA, ACTIVE_GALAXY } from '@/data/universe';
import { useUniverse } from '@/context/UniverseContext';
import type { PlanetData, GalaxyData } from '@/types';

interface Props {
  onReady?: (api: UniverseAPI) => void;
}

/** Public API so HUD / keyboard shortcuts can drive the camera */
export interface UniverseAPI {
  resetToUniverse: () => void;
  zoomToGalaxy: (galaxyId: string) => void;
  selectPlanetById: (planetId: string) => void;
}

// ── Geometry helpers ─────────────────────────────────────────

function createDeepStars(count: number, spread: number, color: number, size: number): THREE.Points {
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(Math.random() * 2 - 1);
    const r     = spread * (0.3 + Math.random() * 0.7);
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geom, new THREE.PointsMaterial({
    color, size, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
}

function buildGalaxySpiral(): THREE.Points {
  const N = 16000;
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(N * 3);
  const colors    = new Float32Array(N * 3);
  const cInner  = new THREE.Color(0x7dd3fc);
  const cMid    = new THREE.Color(0x38bdf8);
  const cOuter  = new THREE.Color(0x1e293b);

  for (let i = 0; i < N; i++) {
    const i3    = i * 3;
    const r     = Math.random() * 110;
    const spin  = r * 0.08;
    const branch = (i % 2) * Math.PI;
    const sc    = r / 50 + 0.3;
    const rnd   = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
    positions[i3]     = Math.cos(branch + spin) * r + rnd() * 6 * sc;
    positions[i3 + 1] = rnd() * 3 * sc;
    positions[i3 + 2] = Math.sin(branch + spin) * r + rnd() * 6 * sc;
    const mixed = cInner.clone();
    if (r < 45) mixed.lerp(cMid, r / 45);
    else         mixed.lerp(cOuter, (r - 45) / 65);
    colors[i3] = mixed.r; colors[i3+1] = mixed.g; colors[i3+2] = mixed.b;
  }
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(geom, new THREE.PointsMaterial({
    size: 1.1, vertexColors: true,
    blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8, depthWrite: false,
  }));
}

/**
 * Build a small glowing particle cluster to represent a forming galaxy node
 * in the COSMOS view. Positioned at the galaxy's world-space coords.
 */
function buildFormingNode(galaxy: GalaxyData): THREE.Group {
  const group = new THREE.Group();
  group.position.set(...galaxy.position);

  // Particle cloud
  const count = 280;
  const pos   = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geom, new THREE.PointsMaterial({
    color: 0x4c5577, size: 1.2, transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  group.add(pts);

  // Core beacon sphere — used for raycasting (userData carries galaxy info)
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(4, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.55 })
  );
  (core.userData as Record<string, unknown>) = { galaxyId: galaxy.id, isGalaxyNode: true };
  group.add(core);

  // Outer halo
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(9, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0x818cf8, transparent: true, opacity: 0.08,
      blending: THREE.AdditiveBlending, side: THREE.BackSide,
    })
  );
  group.add(halo);

  return group;
}

/**
 * Build the clickable node that represents the ACTIVE galaxy in COSMOS view.
 * Placed at the origin (position [0,0,0]) and is always the galaxy spiral.
 */
function buildActiveNode(): THREE.Mesh {
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.90 })
  );
  (core.userData as Record<string, unknown>) = {
    galaxyId: ACTIVE_GALAXY.id,
    isGalaxyNode: true,
  };
  return core;
}

/** Build planet meshes + orbit rings for a galaxy, parented to a group */
function buildPlanets(galaxy: GalaxyData): {
  group: THREE.Group;
  meshes: THREE.Mesh[];
} {
  const group  = new THREE.Group();
  group.position.set(...galaxy.position);
  const meshes: THREE.Mesh[] = [];

  galaxy.planets.forEach((p: PlanetData, idx: number) => {
    // Orbit ring
    const orbitPts: THREE.Vector3[] = [];
    for (let s = 0; s <= 128; s++) {
      const t = (s / 128) * Math.PI * 2;
      orbitPts.push(new THREE.Vector3(Math.cos(t) * p.radius, 0, Math.sin(t) * p.radius));
    }
    const orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(orbitPts),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.12 })
    );
    group.add(orbitLine);

    // Planet sphere
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(p.size, 32, 32),
      new THREE.MeshStandardMaterial({
        color: p.color, roughness: 0.35, metalness: 0.6,
        emissive: p.color, emissiveIntensity: 0.35,
      })
    );
    (planet.userData as Record<string, unknown>) = {
      ...p,
      angle: (idx / galaxy.planets.length) * Math.PI * 2,
      galaxyId: galaxy.id,
    };

    // Halo ring on the planet
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(p.size * 1.35, p.size * 1.5, 32),
      new THREE.MeshBasicMaterial({
        color: p.color, side: THREE.DoubleSide, transparent: true,
        opacity: 0.35, blending: THREE.AdditiveBlending,
      })
    );
    ring.rotation.x = Math.PI / 2;
    planet.add(ring);
    group.add(planet);
    meshes.push(planet);
  });

  return { group, meshes };
}

/**
 * ThreeScene — two-mode 3D scene:
 *
 *   COSMOS mode  — all galaxy nodes visible as positioned clusters.
 *                  Planets hidden. Drag/zoom spans the full universe.
 *                  Clicking a galaxy node triggers zoomToGalaxy().
 *
 *   GALAXY mode  — camera zooms to the selected galaxy's position.
 *                  Planet meshes become visible and orbit.
 *                  Clicking a planet calls focusPlanet().
 *
 * The UniverseAPI exposes imperative handles so HUD buttons and the
 * ⌘K search modal can drive the camera without coupling to Three.js.
 */
export function ThreeScene({ onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoomToGalaxy, focusPlanet, resetToCosmos } = useUniverse();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer / Camera / Scene ─────────────────────────────
    const scene    = new THREE.Scene();
    scene.fog      = new THREE.FogExp2(0x020510, 0.0012);

    const camera   = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000);
    camera.position.set(0, 180, 360);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // ── Lighting ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a1428, 1.8));
    const coreLight = new THREE.PointLight(0x38bdf8, 3.5, 350);
    scene.add(coreLight);
    const accentLight = new THREE.PointLight(0x818cf8, 1.8, 500);
    accentLight.position.set(60, 40, -50);
    scene.add(accentLight);

    // ── Background Stars ──────────────────────────────────────
    scene.add(createDeepStars(2800, 2000, 0xe2e8f0, 1.2));
    scene.add(createDeepStars(3500, 2400, 0x38bdf8, 0.9));

    // ── Active Galaxy — spiral + core + halo (at origin) ─────
    const galaxySpiral = buildGalaxySpiral();
    scene.add(galaxySpiral);

    const activeCoreMesh = buildActiveNode();
    scene.add(activeCoreMesh);

    const activeHaloMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8, transparent: true, opacity: 0.18,
        blending: THREE.AdditiveBlending, side: THREE.BackSide,
      })
    );
    scene.add(activeHaloMesh);

    // ── Forming Galaxy Nodes ──────────────────────────────────
    const formingGroups: THREE.Group[] = [];
    for (const g of GALAXY_DATA) {
      if (g.status !== 'forming') continue;
      const grp = buildFormingNode(g);
      scene.add(grp);
      formingGroups.push(grp);
    }

    // ── Planets for the ACTIVE galaxy ─────────────────────────
    const { group: planetGroup, meshes: planetMeshes } = buildPlanets(ACTIVE_GALAXY);
    scene.add(planetGroup);

    // ── All clickable objects ─────────────────────────────────
    // Galaxy nodes (for COSMOS click)
    const galaxyClickTargets: THREE.Mesh[] = [activeCoreMesh];
    for (const grp of formingGroups) {
      grp.children.forEach(c => {
        if (c instanceof THREE.Mesh && (c.userData as Record<string,unknown>).isGalaxyNode) {
          galaxyClickTargets.push(c);
        }
      });
    }

    // ── Scene mode state ──────────────────────────────────────
    let sceneMode: 'cosmos' | 'galaxy' = 'cosmos';
    let focusedPlanetMesh: THREE.Mesh | null = null;
    let activeGalaxyData: GalaxyData = ACTIVE_GALAXY;

    const orbit = { radius: 360, theta: 0.45, phi: 1.05 };
    const targetLookAt  = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);
    const targetCamPos  = new THREE.Vector3().copy(camera.position);

    const updateCamFromSpherical = (lookAt = targetLookAt) => {
      targetCamPos.set(
        lookAt.x + orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta),
        lookAt.y + orbit.radius * Math.cos(orbit.phi),
        lookAt.z + orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta),
      );
    };

    // ── Public Universe API ───────────────────────────────────
    const api: UniverseAPI = {
      resetToUniverse() {
        sceneMode = 'cosmos';
        focusedPlanetMesh = null;
        activeGalaxyData  = ACTIVE_GALAXY;
        targetLookAt.set(0, 0, 0);
        orbit.radius = 360; orbit.theta = 0.45; orbit.phi = 1.05;
        updateCamFromSpherical();
        resetToCosmos();
      },

      zoomToGalaxy(galaxyId: string) {
        const galaxy = GALAXY_DATA.find(g => g.id === galaxyId);
        if (!galaxy) return;
        focusedPlanetMesh = null;
        activeGalaxyData  = galaxy;
        sceneMode = 'galaxy';

        // Camera zooms to the galaxy's world position
        const [gx, gy, gz] = galaxy.position;
        targetLookAt.set(gx, gy, gz);
        orbit.radius = galaxy.status === 'active' ? 160 : 100;
        orbit.theta  = 0.3;
        orbit.phi    = 0.95;
        updateCamFromSpherical(targetLookAt);
        zoomToGalaxy(galaxy);
      },

      selectPlanetById(planetId: string) {
        const mesh = planetMeshes.find(m => (m.userData as { id?: string }).id === planetId);
        if (!mesh) return;
        const pData  = mesh.userData as PlanetData & { galaxyId: string };
        const galaxy = GALAXY_DATA.find(g => g.id === pData.galaxyId);
        if (!galaxy) return;
        sceneMode = 'galaxy';
        focusedPlanetMesh = mesh;
        activeGalaxyData  = galaxy;
        focusPlanet(pData, galaxy);
      },
    };

    onReady?.(api);

    // ── Pointer / Drag ────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();
    let isDragging  = false;
    let prevPtr     = { x: 0, y: 0 };
    let didDrag     = false;

    const isHudTarget = (e: MouseEvent) =>
      (e.target as Element).closest('header, aside, footer, [data-hud]') !== null;

    const onMouseDown = (e: MouseEvent) => {
      if (isHudTarget(e)) return;
      isDragging = true; didDrag = false;
      prevPtr = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (!isDragging) return;
      const dx = e.clientX - prevPtr.x;
      const dy = e.clientY - prevPtr.y;
      if (Math.hypot(dx, dy) > 3) didDrag = true;
      orbit.theta -= dx * 0.005;
      orbit.phi    = Math.max(0.15, Math.min(Math.PI - 0.15, orbit.phi - dy * 0.005));
      prevPtr = { x: e.clientX, y: e.clientY };
      if (!focusedPlanetMesh) updateCamFromSpherical();
    };
    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      if (isHudTarget(e)) return;
      const minR = sceneMode === 'cosmos' ? 120 : 35;
      const maxR = sceneMode === 'cosmos' ? 700 : 280;
      orbit.radius = Math.max(minR, Math.min(maxR, orbit.radius + e.deltaY * 0.25));
      if (!focusedPlanetMesh) updateCamFromSpherical();
    };

    const onClick = (e: MouseEvent) => {
      if (isHudTarget(e) || didDrag) return;
      raycaster.setFromCamera(pointer, camera);

      if (sceneMode === 'cosmos') {
        // Try clicking a galaxy node
        const hits = raycaster.intersectObjects(galaxyClickTargets, false);
        if (hits.length > 0) {
          const gid = (hits[0].object.userData as { galaxyId?: string }).galaxyId ?? '';
          api.zoomToGalaxy(gid);
        }
      } else {
        // Try clicking a planet
        const hits = raycaster.intersectObjects(planetMeshes, false);
        if (hits.length > 0) {
          const pid = (hits[0].object.userData as { id?: string }).id ?? '';
          api.selectPlanetById(pid);
        }
      }
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    window.addEventListener('wheel',     onWheel, { passive: true });
    window.addEventListener('click',     onClick);
    window.addEventListener('resize',    onResize);

    // ── Render Loop ───────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate spiral + forming nodes
      galaxySpiral.rotation.y = elapsed * 0.025;
      formingGroups.forEach((g, i) => {
        g.rotation.y = elapsed * (i % 2 === 0 ? 0.004 : -0.003);
      });

      // Orbit planets
      for (const mesh of planetMeshes) {
        const ud = mesh.userData as { angle: number; speed: number; radius: number; galaxyId: string };
        ud.angle += ud.speed;
        // Planet position is local to planetGroup (which is at galaxy.position)
        mesh.position.x = Math.cos(ud.angle) * ud.radius;
        mesh.position.z = Math.sin(ud.angle) * ud.radius;
        mesh.rotation.y += 0.015;
      }

      // Galaxy-mode: light tracks active galaxy position
      const [ax, ay, az] = activeGalaxyData.position;
      coreLight.position.set(ax, ay, az);

      // Camera LERP
      if (focusedPlanetMesh) {
        const worldPos = new THREE.Vector3();
        focusedPlanetMesh.getWorldPosition(worldPos);
        targetLookAt.lerp(worldPos, 0.06);
        camera.position.lerp(worldPos.clone().add(new THREE.Vector3(10, 6, 12)), 0.06);
      } else {
        camera.position.lerp(targetCamPos, 0.05);
      }
      currentLookAt.lerp(targetLookAt, 0.06);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
      window.removeEventListener('wheel',     onWheel);
      window.removeEventListener('click',     onClick);
      window.removeEventListener('resize',    onResize);
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        cursor: 'grab',
      }}
    />
  );
}
