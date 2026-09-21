import { GALAXY_DATA } from '@/data/universe';
import type { UniverseAPI } from './ThreeScene';
import { useUniverse } from '@/context/UniverseContext';
import styles from './HudLeft.module.css';

interface HudLeftProps {
  universeApi: UniverseAPI | null;
}

export function HudLeft({ universeApi }: HudLeftProps) {
  const { state } = useUniverse();
  const { inspector } = state;

  return (
    <aside className={styles.aside} data-hud="">
      {/* Galaxy sector panel */}
      <div className={styles.sectorPanel}>
        <div className={styles.sectorHeader}>
          <span className={styles.sectorLabel}>GALACTIC SECTORS</span>
          <span className={styles.sectorCount}>{GALAXY_DATA.length} TOTAL</span>
        </div>

        <div className={styles.nodes}>
          {GALAXY_DATA.map((galaxy) => {
            const isActive   = galaxy.status === 'active';
            const isSelected = inspector.activeGalaxy?.id === galaxy.id;

            return (
              <button
                key={galaxy.id}
                className={`${styles.nodeBtn} ${isSelected ? styles.nodeBtnSelected : ''} ${!isActive ? styles.nodeBtnForming : ''}`}
                onClick={() => universeApi?.zoomToGalaxy(galaxy.id)}
              >
                <div className={styles.nodeBtnInner}>
                  <span className={isActive ? styles.nodeDotActive : styles.nodeDotForming} />
                  <span className={styles.nodeName}>{galaxy.title}</span>
                </div>
                <p className={styles.nodeStatus}>
                  {isActive
                    ? `${galaxy.planets.length} Planetary Nodes`
                    : 'FORMING'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Keybind hints */}
      <div className={styles.keybinds}>
        <div className={styles.keybindRow}>
          <span>DRAG</span>
          <span className={styles.keybindVal}>ROTATE</span>
        </div>
        <div className={styles.keybindRow}>
          <span>SCROLL</span>
          <span className={styles.keybindVal}>ZOOM</span>
        </div>
        <div className={styles.keybindRow}>
          <span>CLICK NODE</span>
          <span className={styles.keybindVal}>FOCUS</span>
        </div>
        <div className={styles.keybindRowBorder}>
          <span>SEARCH</span>
          <span className={styles.keybindCyan}>⌘K</span>
        </div>
      </div>
    </aside>
  );
}
