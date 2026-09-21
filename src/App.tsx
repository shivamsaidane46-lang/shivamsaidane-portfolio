import { useState, useCallback, useEffect } from 'react';
import { HeroView } from '@/components/hero/HeroView';
import { AboutSection } from '@/components/hero/AboutSection';
import { UniverseView } from '@/components/universe/UniverseView';
import { useCursor } from '@/hooks/useCursor';
import { useMagnetic } from '@/hooks/useMagnetic';
import type { ViewMode } from '@/types';

/**
 * App — the root application shell.
 *
 * HERO mode  — page scrolls normally: Hero (100vh) then About section below.
 *              The "MY JOURNEY" button scrolls to #about via native anchor.
 *
 * UNIVERSE mode — universe takes over the entire viewport as position:fixed.
 *
 * Cinematic transition: hero fades out and scales up (zoom-into-void feel),
 * then universe fades in.
 */
export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('hero');
  const [transitioning, setTransitioning] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [universeVisible, setUniverseVisible] = useState(false);

  // Global interaction systems
  useCursor();
  useMagnetic();

  // Lock body scroll while Universe is visible
  useEffect(() => {
    if (viewMode === 'universe') {
      document.body.classList.add('universe-active');
    } else {
      document.body.classList.remove('universe-active');
    }
    return () => document.body.classList.remove('universe-active');
  }, [viewMode]);

  const enterUniverse = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);

    // Phase 1: fade hero out (600ms) — scroll to top first for clean transition
    window.scrollTo({ top: 0, behavior: 'instant' });
    setHeroVisible(false);

    // Phase 2: mount + fade universe in after hero is gone
    setTimeout(() => {
      setUniverseVisible(true);
      setViewMode('universe');
      setTransitioning(false);
    }, 700);
  }, [transitioning]);

  const exitUniverse = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);

    // Phase 1: fade universe out
    setUniverseVisible(false);

    // Phase 2: show hero
    setTimeout(() => {
      setViewMode('hero');
      setHeroVisible(true);
      setTransitioning(false);
    }, 700);
  }, [transitioning]);

  return (
    <>
      {/* Global cursor elements — always in DOM */}
      <div id="cursor-aura" className="cursor-aura" />
      <div id="cursor-beacon" className="cursor-beacon" />

      {/* ── HERO MODE — normal scrollable page ─────────────────── */}
      {viewMode === 'hero' && (
        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'scale(1)' : 'scale(1.06)',
            transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'opacity, transform',
          }}
        >
          {/* Hero — full-screen first fold */}
          <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <HeroView onEnterUniverse={enterUniverse} />
          </div>

          {/* About section — directly below hero in document flow */}
          <AboutSection />
        </div>
      )}

      {/* ── UNIVERSE MODE — full-screen fixed overlay ──────────── */}
      {(viewMode === 'universe' || transitioning) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            opacity: universeVisible ? 1 : 0,
            transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'opacity',
          }}
        >
          <UniverseView onExit={exitUniverse} />
        </div>
      )}
    </>
  );
}
