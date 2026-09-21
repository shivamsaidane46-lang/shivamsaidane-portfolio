import { useEffect } from 'react';

interface MagneticItem {
  el: HTMLElement;
  inner: HTMLElement | null;
  strength: number;
  customRadius: number;
  currX: number;
  currY: number;
  currScale: number;
  targetX: number;
  targetY: number;
  targetScale: number;
  innerCurrX: number;
  innerCurrY: number;
  innerTargetX: number;
  innerTargetY: number;
  active: boolean;
}

/**
 * useMagnetic — spring-physics magnetic attraction engine.
 *
 * Queries all `[data-magnetic]` elements in the DOM and applies
 * a proximity-based pull toward the cursor. Each element can
 * configure its behaviour with:
 *
 *   data-magnetic-strength="0.35"  (default 0.35)
 *   data-magnetic-radius="120"     (overrides size-based auto-radius)
 *
 * The `.magnetic-inner` child element gets a secondary parallax
 * displacement at 35% of the outer pull, for depth effect.
 *
 * No-op on touch/reduced-motion devices.
 */
export function useMagnetic(): void {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(hover: none)').matches;
    if (reducedMotion || coarsePointer) return;

    let mouseX = -9999;
    let mouseY = -9999;
    let rafId  = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    // Collect all magnetic elements (re-collected on each mount)
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-magnetic]')
    );

    const items: MagneticItem[] = elements.map((el) => ({
      el,
      inner: el.querySelector<HTMLElement>('.magnetic-inner'),
      strength:     parseFloat(el.getAttribute('data-magnetic-strength') ?? '0.35'),
      customRadius: parseFloat(el.getAttribute('data-magnetic-radius')   ?? '0'),
      currX: 0, currY: 0, currScale: 1,
      targetX: 0, targetY: 0, targetScale: 1,
      innerCurrX: 0, innerCurrY: 0,
      innerTargetX: 0, innerTargetY: 0,
      active: false,
    }));

    const MAX_DISPLACEMENT = 18;

    const loop = () => {
      for (const item of items) {
        const rect    = item.el.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const dx      = mouseX - centerX;
        const dy      = mouseY - centerY;
        const dist    = Math.hypot(dx, dy);
        const radius  = item.customRadius || Math.max(rect.width, rect.height) * 0.85 + 35;

        if (dist < radius) {
          item.active = true;
          item.el.classList.add('is-magnetic-active');

          const factor = Math.max(0, 1 - dist / radius);
          const pull   = Math.pow(factor, 0.9) * item.strength;

          let tx = dx * pull;
          let ty = dy * pull;
          const mag = Math.hypot(tx, ty);
          if (mag > MAX_DISPLACEMENT) {
            tx = (tx / mag) * MAX_DISPLACEMENT;
            ty = (ty / mag) * MAX_DISPLACEMENT;
          }

          item.targetX     = tx;
          item.targetY     = ty;
          item.targetScale = 1.03;
          item.innerTargetX = tx * 0.35;
          item.innerTargetY = ty * 0.35;
        } else if (item.active) {
          item.targetX = item.targetY = 0;
          item.targetScale = 1;
          item.innerTargetX = item.innerTargetY = 0;

          if (Math.abs(item.currX) < 0.1 && Math.abs(item.currY) < 0.1) {
            item.active = false;
            item.el.classList.remove('is-magnetic-active');
          }
        }

        const lf = item.active ? 0.2 : 0.12;
        item.currX     += (item.targetX     - item.currX)     * lf;
        item.currY     += (item.targetY     - item.currY)     * lf;
        item.currScale += (item.targetScale - item.currScale) * lf;

        item.el.style.transform = `translate3d(${item.currX.toFixed(2)}px, ${item.currY.toFixed(2)}px, 0) scale(${item.currScale.toFixed(3)})`;

        if (item.inner) {
          item.innerCurrX += (item.innerTargetX - item.innerCurrX) * lf;
          item.innerCurrY += (item.innerTargetY - item.innerCurrY) * lf;
          item.inner.style.transform = `translate3d(${item.innerCurrX.toFixed(2)}px, ${item.innerCurrY.toFixed(2)}px, 0)`;
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      // Reset transforms on cleanup
      for (const item of items) {
        item.el.style.transform = '';
        item.el.classList.remove('is-magnetic-active');
        if (item.inner) item.inner.style.transform = '';
      }
    };
  }, []);
}
