// ============================================================
// SHARED TYPES — Portfolio Site
// ============================================================

/** Top-level application view mode */
export type ViewMode = 'hero' | 'universe';

/** Zoom level within the Universe view */
export type UniverseLevel = 0 | 1 | 2; // 0=Cosmos, 1=Galaxy, 2=Planet

/**
 * Galaxy population status.
 *   'active'  — live, contains real project planets.
 *   'forming' — declared, no planets yet.
 */
export type GalaxyStatus = 'active' | 'forming';

/** A single project/planet in the 3D universe */
export interface PlanetData {
  id: string;
  name: string;
  /** Full/exact project name as in source material */
  fullName: string;
  subtitle: string;
  /** Short description — only real provided content */
  desc: string;
  /** Orbital radius in Three.js units */
  radius: number;
  /** Orbital speed (radians per frame) */
  speed: number;
  /** Three.js hex color */
  color: number;
  /** Sphere geometry radius */
  size: number;
  /** Path to workflow screenshot served from /public */
  workflowImage?: string;
  /** Rich project detail — sourced exclusively from provided PDFs */
  detail?: ProjectDetail;
}

/** Rich project detail content — all fields are optional and sourced from PDFs only */
export interface ProjectDetail {
  whatItDoes: string;
  problem: string;
  workflowDataFlow: string[];
  architecture?: string[];
  techStack?: string[];
  errorHandling?: string[];
  securityValidation?: string[];
  advantages?: string[];
  results?: string[];
  limitations?: string[];
}


/** A galaxy (skill domain) containing multiple planets */
export interface GalaxyData {
  id: string;
  status: GalaxyStatus;
  title: string;
  subtitle: string;
  desc: string;
  coords: string;
  /** World-space position [x, y, z] in the Three.js scene */
  position: [number, number, number];
  planets: PlanetData[];
}

/** State shown in the right HUD inspector panel */
export interface InspectorData {
  level: UniverseLevel;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  coords: string;
  /** Active galaxy currently shown in the inspector */
  activeGalaxy: GalaxyData | null;
  /** Currently focused planet (null = no planet focused) */
  focusedPlanet: PlanetData | null;
}

/** Actions dispatched to update UniverseContext */
export type UniverseAction =
  | { type: 'RESET_TO_COSMOS' }
  | { type: 'ZOOM_TO_GALAXY'; galaxy: GalaxyData }
  | { type: 'FOCUS_PLANET'; planet: PlanetData; galaxy: GalaxyData }
  | { type: 'OPEN_SEARCH' }
  | { type: 'CLOSE_SEARCH' }
  | { type: 'OPEN_BLUEPRINT' }
  | { type: 'CLOSE_BLUEPRINT' };

/** Full universe UI state */
export interface UniverseState {
  inspector: InspectorData;
  searchOpen: boolean;
  blueprintOpen: boolean;
}
