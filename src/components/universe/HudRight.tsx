import { useUniverse } from '@/context/UniverseContext';
import type { UniverseAPI } from './ThreeScene';
import styles from './HudRight.module.css';

// Planet dot colors — derived from Three.js planet colors in universe.ts
const PLANET_COLORS: Record<string, string> = {
  p_content_repurposer:          '#38bdf8',
  p_business_health_digest:      '#818cf8',
  p_onboarding_concierge:        '#22d3ee',
  p_support_triage_sentinel:     '#2dd4bf',
  p_price_inventory_sentinel:    '#a78bfa',
  p_invoice_extraction_pipeline: '#34d399',
};

interface HudRightProps {
  universeApi: UniverseAPI | null;
}

export function HudRight({ universeApi }: HudRightProps) {
  const { state, openBlueprint } = useUniverse();
  const { inspector } = state;
  const { activeGalaxy } = inspector;

  const isForming = activeGalaxy?.status === 'forming';
  const hasActivePlanets = activeGalaxy && activeGalaxy.status === 'active' && activeGalaxy.planets.length > 0;

  return (
    <aside className={styles.aside} data-hud="">
      <div className={styles.panel}>
        {/* Level badge + coords */}
        <div className={styles.header}>
          <span className={styles.badge}>{inspector.badge}</span>
          <span className={styles.coords}>{inspector.coords}</span>
        </div>

        {/* Title + subtitle */}
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>{inspector.title}</h2>
          <p className={styles.subtitle}>{inspector.subtitle}</p>
        </div>

        {/* Description */}
        <p className={styles.desc}>{inspector.desc}</p>

        {/* Forming galaxy — no planets yet */}
        {isForming && (
          <div className={styles.formingNotice}>
            <span className={styles.formingDot} />
            <span className={styles.formingText}>SECTOR FORMING — NO NODES YET</span>
          </div>
        )}

        {/* Planet grid — only for active galaxies with real planets */}
        {hasActivePlanets && (
          <div className={styles.planetSection}>
            <div className={styles.planetSectionHeader}>
              <label className={styles.planetSectionLabel}>
                {activeGalaxy.title} NODES
              </label>
              <span className={styles.planetSectionCount}>{activeGalaxy.planets.length} NODES</span>
            </div>
            <div className={styles.planetGrid}>
              {activeGalaxy.planets.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.planetBtn} ${inspector.focusedPlanet?.id === p.id ? styles.planetBtnActive : ''}`}
                  onClick={() => universeApi?.selectPlanetById(p.id)}
                >
                  <span
                    className={styles.planetDot}
                    style={{ background: PLANET_COLORS[p.id] ?? '#38bdf8' }}
                  />
                  <span className={styles.planetName}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer: status + view project */}
        <div className={styles.footer}>
          <span className={styles.status}>
            {isForming
              ? 'STATUS: FORMING'
              : `STATUS: ${inspector.level === 2 ? 'PROJECT SELECTED' : 'READY'}`}
          </span>
          {inspector.level === 2 && !isForming && (
            <button className={styles.viewBtn} onClick={openBlueprint}>
              <span>VIEW PROJECT</span>
              <span className={styles.viewArrow}>→</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
