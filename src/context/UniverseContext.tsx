import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import type {
  UniverseState,
  UniverseAction,
  InspectorData,
  GalaxyData,
  PlanetData,
} from '@/types';
import { GALAXY_DATA } from '@/data/universe';

// ── Initial State ────────────────────────────────────────────
const COSMOS_INSPECTOR: InspectorData = {
  level: 0,
  badge: 'LEVEL 0 // COSMOS OVERVIEW',
  title: 'POLYMATH UNIVERSE',
  subtitle: 'SPATIAL DISCIPLINARY MATRIX',
  desc: 'An interactive multi-scale orbital space mapping projects and workflows across disciplines.',
  coords: '[0, 0, 0]',
  activeGalaxy: GALAXY_DATA[0],
  focusedPlanet: null,
};

const INITIAL_STATE: UniverseState = {
  inspector: COSMOS_INSPECTOR,
  searchOpen: false,
  blueprintOpen: false,
};

// ── Reducer ──────────────────────────────────────────────────
function reducer(state: UniverseState, action: UniverseAction): UniverseState {
  switch (action.type) {
    case 'RESET_TO_COSMOS':
      return { ...state, inspector: COSMOS_INSPECTOR, blueprintOpen: false };

    case 'ZOOM_TO_GALAXY': {
      const g: GalaxyData = action.galaxy;
      return {
        ...state,
        inspector: {
          level: 1,
          badge: 'LEVEL 1 // GALAXY SECTOR',
          title: g.title,
          subtitle: g.subtitle,
          desc: g.desc,
          coords: g.coords,
          activeGalaxy: g,
          focusedPlanet: null,
        },
        blueprintOpen: false,
      };
    }

    case 'FOCUS_PLANET': {
      const p: PlanetData = action.planet;
      const g: GalaxyData = action.galaxy;
      return {
        ...state,
        inspector: {
          level: 2,
          badge: 'LEVEL 2 // PROJECT NODE',
          title: p.name,
          subtitle: p.subtitle,
          desc: p.desc,
          coords: `[ORBIT r=${p.radius}au]`,
          activeGalaxy: g,
          focusedPlanet: p,
        },
      };
    }

    case 'OPEN_SEARCH':
      return { ...state, searchOpen: true };

    case 'CLOSE_SEARCH':
      return { ...state, searchOpen: false };

    case 'OPEN_BLUEPRINT':
      return { ...state, blueprintOpen: true };

    case 'CLOSE_BLUEPRINT':
      return { ...state, blueprintOpen: false };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────
interface UniverseContextValue {
  state: UniverseState;
  dispatch: React.Dispatch<UniverseAction>;
  /** Convenience helpers consumed by HUD components and ThreeScene */
  resetToCosmos: () => void;
  zoomToGalaxy: (galaxy: GalaxyData) => void;
  focusPlanet: (planet: PlanetData, galaxy: GalaxyData) => void;
  openSearch: () => void;
  closeSearch: () => void;
  openBlueprint: () => void;
  closeBlueprint: () => void;
}

const UniverseCtx = createContext<UniverseContextValue | null>(null);

export function UniverseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const resetToCosmos  = useCallback(() => dispatch({ type: 'RESET_TO_COSMOS' }), []);
  const zoomToGalaxy   = useCallback((galaxy: GalaxyData) => dispatch({ type: 'ZOOM_TO_GALAXY', galaxy }), []);
  const focusPlanet    = useCallback((planet: PlanetData, galaxy: GalaxyData) => dispatch({ type: 'FOCUS_PLANET', planet, galaxy }), []);
  const openSearch     = useCallback(() => dispatch({ type: 'OPEN_SEARCH' }), []);
  const closeSearch    = useCallback(() => dispatch({ type: 'CLOSE_SEARCH' }), []);
  const openBlueprint  = useCallback(() => dispatch({ type: 'OPEN_BLUEPRINT' }), []);
  const closeBlueprint = useCallback(() => dispatch({ type: 'CLOSE_BLUEPRINT' }), []);

  const value = useMemo<UniverseContextValue>(() => ({
    state, dispatch,
    resetToCosmos, zoomToGalaxy, focusPlanet,
    openSearch, closeSearch, openBlueprint, closeBlueprint,
  }), [state, dispatch, resetToCosmos, zoomToGalaxy, focusPlanet, openSearch, closeSearch, openBlueprint, closeBlueprint]);

  return <UniverseCtx.Provider value={value}>{children}</UniverseCtx.Provider>;
}

export function useUniverse(): UniverseContextValue {
  const ctx = useContext(UniverseCtx);
  if (!ctx) throw new Error('useUniverse must be used inside <UniverseProvider>');
  return ctx;
}
