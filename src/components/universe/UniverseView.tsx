import { useEffect, useState } from 'react';
import { UniverseProvider, useUniverse } from '@/context/UniverseContext';
import { ThreeScene } from './ThreeScene';
import { HudTop } from './HudTop';
import { HudLeft } from './HudLeft';
import { HudRight } from './HudRight';
import { HudBottom } from './HudBottom';
import { SearchModal } from './SearchModal';
import { BlueprintModal } from './BlueprintModal';
import type { UniverseAPI } from './ThreeScene';
import styles from './UniverseView.module.css';

interface UniverseViewInnerProps {
  onExit: () => void;
}

function UniverseViewInner({ onExit }: UniverseViewInnerProps) {
  const [universeApi, setUniverseApi] = useState<UniverseAPI | null>(null);
  const { openSearch } = useUniverse();

  // Global keyboard shortcut: ⌘K → search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch]);

  return (
    <div className={styles.wrapper}>
      {/* Layer 0: Three.js canvas (full-screen) */}
      <ThreeScene onReady={setUniverseApi} />

      {/* Layer 1: Subtle vignette overlay */}
      <div className={styles.vignette} />

      {/* HUD layers (pointer-events managed per element) */}
      <HudTop universeApi={universeApi} onExit={onExit} />
      <HudLeft universeApi={universeApi} />
      <HudRight universeApi={universeApi} />
      <HudBottom universeApi={universeApi} />

      {/* Modals */}
      <SearchModal universeApi={universeApi} />
      <BlueprintModal />
    </div>
  );
}

interface UniverseViewProps {
  onExit: () => void;
}

/**
 * UniverseView — wraps the inner component in the UniverseProvider
 * so all HUD children can consume context.
 */
export function UniverseView({ onExit }: UniverseViewProps) {
  return (
    <UniverseProvider>
      <UniverseViewInner onExit={onExit} />
    </UniverseProvider>
  );
}
