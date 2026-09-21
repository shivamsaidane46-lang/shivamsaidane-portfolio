import { useCallback } from 'react';
import { useUniverse } from '@/context/UniverseContext';
import type { UniverseAPI } from './ThreeScene';
import styles from './HudTop.module.css';

interface HudTopProps {
  universeApi: UniverseAPI | null;
  onExit: () => void;
}

export function HudTop({ universeApi, onExit }: HudTopProps) {
  const { state, openSearch } = useUniverse();
  const { inspector } = state;

  const handleCosmos = useCallback(() => {
    universeApi?.resetToUniverse();
  }, [universeApi]);

  const handleGalaxy = useCallback(() => {
    if (inspector.activeGalaxy) {
      universeApi?.zoomToGalaxy(inspector.activeGalaxy.id);
    }
  }, [universeApi, inspector.activeGalaxy]);

  return (
    <header className={styles.header} data-hud="">
      {/* Brandmark */}
      <div className={styles.brand}>
        <div className={styles.brandDot} />
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>Shivam // Universe</span>
          <span className={styles.brandSub}>SPATIAL MATRIX ONLINE</span>
        </div>
      </div>

      {/* Breadcrumb nav */}
      <nav className={styles.breadcrumb} aria-label="Orbital Hierarchy">
        <button className={styles.bcBtn} onClick={handleCosmos}>
          <span className={styles.bcDotInactive} />
          <span>COSMOS</span>
        </button>
        <span className={styles.bcSep}>/</span>
        <button className={styles.bcBtn} onClick={handleGalaxy}>
          <span className={styles.bcDotActive} />
          <span>{inspector.activeGalaxy?.title ?? 'AI AUTOMATION'}</span>
        </button>
        <span className={styles.bcSep}>/</span>
        <div className={styles.bcCurrent}>
          <span className={styles.bcDotCurrent} />
          <span>{inspector.level === 2 ? inspector.title : 'OVERVIEW'}</span>
        </div>
      </nav>

      {/* Right: search + coords + reset + exit */}
      <div className={styles.right}>
        {/* Search trigger */}
        <button className={styles.searchBtn} onClick={openSearch} title="Search the Universe (⌘K)">
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
          <span className={styles.searchLabel}>SEARCH THE UNIVERSE</span>
          <kbd className={styles.kbd}>⌘K</kbd>
        </button>

        {/* Coordinates */}
        <div className={styles.coords}>
          <span className={styles.coordsLabel}>POS</span>
          <span className={styles.coordsValue}>{inspector.coords}</span>
        </div>

        {/* Reset */}
        <button className={styles.resetBtn} onClick={handleCosmos} title="Reset to Cosmos View">
          <svg className={styles.resetIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
          <span>RESET</span>
        </button>

        {/* Exit */}
        <button className={styles.exitBtn} onClick={onExit}>EXIT</button>
      </div>
    </header>
  );
}
