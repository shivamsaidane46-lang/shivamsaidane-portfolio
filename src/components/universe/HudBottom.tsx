import type { UniverseAPI } from './ThreeScene';
import styles from './HudBottom.module.css';

interface HudBottomProps {
  universeApi: UniverseAPI | null;
}

export function HudBottom({ universeApi }: HudBottomProps) {
  return (
    <footer className={styles.footer} data-hud="">
      {/* Camera level buttons */}
      <div className={styles.levelBtns}>
        <button
          className={styles.levelBtn}
          onClick={() => universeApi?.resetToUniverse()}
          title="Level 0: Cosmic Universe View"
        >
          COSMOS
        </button>
        <button
          className={styles.levelBtn}
          onClick={() => universeApi?.zoomToGalaxy('galaxy_ai_automation')}
          title="Level 1: AI Automation Galaxy"
        >
          GALAXY
        </button>
        <button
          className={styles.levelBtn}
          onClick={() => universeApi?.selectPlanetById('p_content_repurposer')}
          title="Level 2: Project Node Focus"
        >
          PROJECT
        </button>
      </div>

      {/* Thesis quote */}
      <div className={styles.quote}>
        ONE MIND{' '}
        <span className={styles.arrow}>→</span>{' '}
        MANY DIRECTIONS{' '}
        <span className={styles.arrow}>→</span>{' '}
        MANY SKILLS{' '}
        <span className={styles.arrow}>→</span>{' '}
        MANY PROJECTS
      </div>

      {/* Signature */}
      <div className={styles.sig}>
        <span>SHIVAM</span>
        <span className={styles.sigSep}>•</span>
        <span className={styles.sigAccent}>POLYMATH</span>
      </div>
    </footer>
  );
}
