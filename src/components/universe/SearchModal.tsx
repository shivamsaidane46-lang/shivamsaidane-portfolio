import { useEffect, useRef, useState, useCallback } from 'react';
import { useUniverse } from '@/context/UniverseContext';
import { GALAXY_DATA } from '@/data/universe';
import type { UniverseAPI } from './ThreeScene';
import type { GalaxyData, PlanetData } from '@/types';
import styles from './SearchModal.module.css';

interface SearchModalProps {
  universeApi: UniverseAPI | null;
}

interface SearchEntry {
  type: 'galaxy' | 'planet';
  id: string;
  name: string;
  desc: string;
  tag: string;
  galaxy?: GalaxyData;
  planet?: PlanetData;
  dotColor?: string;
}

// Build search index from GALAXY_DATA
function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const g of GALAXY_DATA) {
    const tag = g.status === 'active'
      ? `Active Sector • ${g.planets.length} Planetary Nodes`
      : 'Forming Sector';
    entries.push({
      type: 'galaxy', id: g.id, name: g.title,
      desc: g.desc, tag,
      galaxy: g,
    });
    for (const p of g.planets) {
      entries.push({
        type: 'planet', id: p.id, name: p.name,
        desc: p.subtitle, tag: 'Orbital Node',
        galaxy: g, planet: p,
      });
    }
  }
  return entries;
}

const SEARCH_INDEX = buildIndex();

export function SearchModal({ universeApi }: SearchModalProps) {
  const { state, closeSearch } = useUniverse();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(-1);

  const filtered = query.trim() === ''
    ? SEARCH_INDEX
    : SEARCH_INDEX.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.desc.toLowerCase().includes(query.toLowerCase())
      );

  const actionable = filtered; // All entries are clickable in this index

  const handleSelect = useCallback((entry: SearchEntry) => {
    closeSearch();
    if (entry.type === 'galaxy' && entry.galaxy) {
      universeApi?.zoomToGalaxy(entry.galaxy.id);
    } else if (entry.type === 'planet' && entry.planet) {
      universeApi?.selectPlanetById(entry.planet.id);
    }
  }, [universeApi, closeSearch]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!state.searchOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlighted(h => (h + 1) % actionable.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlighted(h => (h - 1 + actionable.length) % actionable.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = highlighted >= 0 ? highlighted : 0;
        if (actionable[idx]) handleSelect(actionable[idx]);
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.searchOpen, actionable, highlighted, handleSelect, closeSearch]);

  // Focus input on open, reset on close
  useEffect(() => {
    if (state.searchOpen) {
      setQuery('');
      setHighlighted(-1);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [state.searchOpen]);

  if (!state.searchOpen) return null;

  const galaxyEntries = filtered.filter(e => e.type === 'galaxy');
  const planetEntries  = filtered.filter(e => e.type === 'planet');

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal}>
        {/* Search input */}
        <div className={styles.inputRow}>
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" strokeWidth="1.6" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search galaxies, planetary projects, coordinates..."
            value={query}
            onChange={e => { setQuery(e.target.value); setHighlighted(-1); }}
          />
          <div className={styles.inputActions}>
            <kbd className={styles.escKbd}>ESC</kbd>
            <button onClick={closeSearch} className={styles.closeBtn}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          {filtered.length === 0 && (
            <div className={styles.noResults}>NO CELESTIAL COORDINATE MATCHED</div>
          )}

          {/* Galaxies section */}
          {galaxyEntries.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span>Galaxies / Skills</span>
                <span className={styles.sectionMeta}>Spatial Sectors</span>
              </div>
              {galaxyEntries.map((entry) => {
                const globalIdx = filtered.indexOf(entry);
                return (
                  <button
                    key={entry.id}
                    className={`${styles.resultRow} ${globalIdx === highlighted ? styles.resultHighlighted : ''}`}
                    onClick={() => handleSelect(entry)}
                    onMouseEnter={() => setHighlighted(globalIdx)}
                  >
                    <div className={styles.resultLeft}>
                      <span className={entry.galaxy?.status === 'active' ? styles.galaxyDot : styles.galaxyDotForming} />
                      <div>
                        <div className={styles.resultName}>
                          <span>{entry.name}</span>
                          <span className={styles.resultCoords}>{entry.galaxy?.coords}</span>
                        </div>
                        <div className={styles.resultDesc}>{entry.desc}</div>
                      </div>
                    </div>
                    <div className={styles.resultRight}>
                      <span className={entry.galaxy?.status === 'active' ? styles.tagGalaxy : styles.tagForming}>{entry.tag}</span>
                      <span className={styles.resultArrow}>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Planets section */}
          {planetEntries.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span>Projects / Planets</span>
                <span className={styles.sectionMeta}>AI Automation Nodes</span>
              </div>
              {planetEntries.map((entry) => {
                const globalIdx = filtered.indexOf(entry);
                return (
                  <button
                    key={entry.id}
                    className={`${styles.resultRow} ${globalIdx === highlighted ? styles.resultHighlighted : ''}`}
                    onClick={() => handleSelect(entry)}
                    onMouseEnter={() => setHighlighted(globalIdx)}
                  >
                    <div className={styles.resultLeft}>
                      <span className={styles.planetDot} />
                      <div>
                        <div className={styles.resultName}><span>{entry.name}</span></div>
                        <div className={styles.resultDesc}>{entry.desc}</div>
                      </div>
                    </div>
                    <div className={styles.resultRight}>
                      <span className={styles.tagPlanet}>{entry.tag}</span>
                      <span className={styles.resultArrow}>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerKeys}>
            <span><kbd className={styles.kbdSmall}>↑</kbd><kbd className={styles.kbdSmall}>↓</kbd> NAVIGATE</span>
            <span><kbd className={styles.kbdSmall}>↵</kbd> LOCATE NODE</span>
            <span><kbd className={styles.kbdSmall}>ESC</kbd> EXIT</span>
          </div>
          <span className={styles.footerStatus}>SPATIAL INDEX ONLINE</span>
        </div>
      </div>
    </div>
  );
}
