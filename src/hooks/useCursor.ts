import { useEffect } from 'react';

/**
 * useCursor — mounts and drives the dual-element custom cursor.
 *
 * `.cursor-beacon`  — tight 8px dot, fast LERP (0.35)
 * `.cursor-aura`    — 380px blurred radial glow, slow LERP (0.12)
 *
 * Hover amplification is triggered by adding `.cursor-hover` to <body>
 * whenever the pointer enters an interactive element.
 *
 * The entire hook is a no-op on touch/reduced-motion devices.
 */
export function useCursor(): void {
  useEffect(() => {
    // Respect user preferences
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(hover: none)').matches;
    if (reducedMotion || coarsePointer) return;

    const aura   = document.getElementById('cursor-aura');
    const beacon = document.getElementById('cursor-beacon');
    if (!aura || !beacon) return;

    let targetX = window.innerWidth  / 2;
    let targetY = window.innerHeight / 2;
    let beaconX = targetX;
    let beaconY = targetY;
    let auraX   = targetX;
    let auraY   = targetY;
    let visible = false;
    let rafId   = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible  = true;
        beaconX  = targetX;
        beaconY  = targetY;
        auraX    = targetX;
        auraY    = targetY;
        aura.style.opacity   = '1';
        beacon.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible = false;
      aura.style.opacity   = '0';
      beacon.style.opacity = '0';
    };

    const onEnter = () => {
      visible = true;
      aura.style.opacity   = '1';
      beacon.style.opacity = '1';
    };

    const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, [data-magnetic]';

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) {
        document.body.classList.add('cursor-hover');
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) {
        document.body.classList.remove('cursor-hover');
      }
    };

    const loop = () => {
      if (visible) {
        // Beacon — tight (fast)
        beaconX += (targetX - beaconX) * 0.35;
        beaconY += (targetY - beaconY) * 0.35;
        beacon.style.transform = `translate3d(${beaconX}px, ${beaconY}px, 0)`;

        // Aura — fluid inertia (slow)
        auraX += (targetX - auraX) * 0.12;
        auraY += (targetY - auraY) * 0.12;
        aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);
}
