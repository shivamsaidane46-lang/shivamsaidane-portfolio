import { useState } from 'react';
import { WebGLBackground } from './WebGLBackground';
import { HeroAtmosphere } from './HeroAtmosphere';
import { HeroText } from './HeroText';
import { Navbar } from '@/components/layout/Navbar';
import styles from './HeroView.module.css';

interface HeroViewProps {
  onEnterUniverse: () => void;
}

/**
 * HeroView — the full-screen cinematic landing scene.
 * Composites:
 *   • WebGL simplex-noise nebula background (z=0)
 *   • Atmospheric glow blobs + gradient scrims (z=1)
 *   • Fixed Navbar (z=50)
 *   • Centred hero text with CTAs (z=10)
 *   • Bottom telemetry bar (z=10)
 */
export function HeroView({ onEnterUniverse }: HeroViewProps) {
  const [soundscapeActive, setSoundscapeActive] = useState(false);

  return (
    <main className={styles.main}>
      {/* Layer 0: WebGL shader canvas */}
      <WebGLBackground />

      {/* Layer 1: Atmospheric glow overlays */}
      <HeroAtmosphere />

      {/* Fixed navigation header */}
      <Navbar
        soundscapeActive={soundscapeActive}
        onToggleSoundscape={() => setSoundscapeActive(v => !v)}
      />

      {/* Hero content — vertically centred */}
      <div className={styles.centreWrapper}>
        <HeroText onEnterUniverse={onEnterUniverse} />
      </div>

      {/* Bottom telemetry bar */}
      <div className={styles.bottomBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Soundscape toggle pill */}
          <button
            type="button"
            className={styles.soundscapePill}
            data-magnetic=""
            data-magnetic-strength="0.32"
            onClick={() => setSoundscapeActive(v => !v)}
          >
            <span className="magnetic-inner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                className={styles.soundDot}
                style={{ animationPlayState: soundscapeActive ? 'running' : 'paused' }}
              />
            </span>
          </button>
        </div>

        {/* Live indicator dot */}
        <div
          className={styles.liveDot}
          data-magnetic=""
          data-magnetic-strength="0.5"
        />
      </div>
    </main>
  );
}
