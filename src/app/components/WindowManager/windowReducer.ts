// ─── Window State Reducer ──────────────────────────────────────────────────────
// Pure reducer for window manager state. No React hooks or side effects.
// All state transitions are deterministic; the WindowManagerProvider
// (V1_006A) will wire this into a useReducer call.

import { AppId, AppPosition, AppSize } from "../appMetadata";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export type SnapState = "none" | "left" | "right";

export interface WindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowEntry {
  /** Matches AppId and uniquely identifies the window (one window per app). */
  id: AppId;
  /** The route path rendered inside this window. */
  route: string;
  /** Current geometry used by react-rnd. */
  geometry: WindowGeometry;
  /** Saved geometry so it can be restored after maximize or snap. */
  restoreGeometry: WindowGeometry;
  minimized: boolean;
  maximized: boolean;
  snapped: SnapState;
}

export interface WindowState {
  openWindows: WindowEntry[];
  focusedId: AppId | null;
  /** Maps AppId → z-index (monotonically increasing counter). */
  zIndexMap: Partial<Record<AppId, number>>;
}

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

export type WindowAction =
  | {
      type: "open";
      payload: {
        id: AppId;
        route: string;
        defaultSize: AppSize;
        defaultPosition: AppPosition;
      };
    }
  | { type: "focus"; payload: { id: AppId } }
  | { type: "close"; payload: { id: AppId } }
  | { type: "minimize"; payload: { id: AppId } }
  | { type: "restore"; payload: { id: AppId } }
  | { type: "maximize"; payload: { id: AppId } }
  | { type: "snapLeft"; payload: { id: AppId; desktopWidth: number; desktopHeight: number } }
  | { type: "snapRight"; payload: { id: AppId; desktopWidth: number; desktopHeight: number } }
  | { type: "drag"; payload: { id: AppId; x: number; y: number } }
  | { type: "resize"; payload: { id: AppId; x: number; y: number; width: number; height: number } }
  | { type: "syncRoute"; payload: { id: AppId; route: string } };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the next z-index: max of all current values + 1. */
function nextZ(zIndexMap: Partial<Record<AppId, number>>): number {
  const values = Object.values(zIndexMap) as number[];
  return values.length === 0 ? 1 : Math.max(...values) + 1;
}

/**
 * Returns the AppId with the highest z-index among the given set of ids,
 * or null if the set is empty.
 */
function highestZ(
  ids: AppId[],
  zIndexMap: Partial<Record<AppId, number>>
): AppId | null {
  if (ids.length === 0) return null;
  return ids.reduce<AppId | null>((best, id) => {
    if (best === null) return id;
    return (zIndexMap[id] ?? 0) > (zIndexMap[best] ?? 0) ? id : best;
  }, null);
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

export const initialWindowState: WindowState = {
  openWindows: [],
  focusedId: null,
  zIndexMap: {},
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function windowReducer(
  state: WindowState,
  action: WindowAction
): WindowState {
  switch (action.type) {
    // ── open ────────────────────────────────────────────────────────────────
    case "open": {
      const { id, route, defaultSize, defaultPosition } = action.payload;
      const existing = state.openWindows.find((w) => w.id === id);

      if (existing) {
        // Already open: focus and restore (do not create a duplicate).
        const z = nextZ(state.zIndexMap);
        const restored = existing.minimized
          ? { ...existing, minimized: false }
          : existing;
        return {
          ...state,
          openWindows: state.openWindows.map((w) =>
            w.id === id ? restored : w
          ),
          focusedId: id,
          zIndexMap: { ...state.zIndexMap, [id]: z },
        };
      }

      // New window.
      const geometry: WindowGeometry = {
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      };
      const entry: WindowEntry = {
        id,
        route,
        geometry,
        restoreGeometry: geometry,
        minimized: false,
        maximized: false,
        snapped: "none",
      };
      const z = nextZ(state.zIndexMap);
      return {
        ...state,
        openWindows: [...state.openWindows, entry],
        focusedId: id,
        zIndexMap: { ...state.zIndexMap, [id]: z },
      };
    }

    // ── focus ────────────────────────────────────────────────────────────────
    case "focus": {
      const { id } = action.payload;
      const exists = state.openWindows.some((w) => w.id === id);
      if (!exists) return state;
      const z = nextZ(state.zIndexMap);
      return {
        ...state,
        focusedId: id,
        zIndexMap: { ...state.zIndexMap, [id]: z },
      };
    }

    // ── close ────────────────────────────────────────────────────────────────
    case "close": {
      const { id } = action.payload;
      const remaining = state.openWindows.filter((w) => w.id !== id);
      const newZMap = { ...state.zIndexMap };
      delete newZMap[id];

      let newFocused = state.focusedId;
      if (state.focusedId === id) {
        // Select next highest z-index window, or null.
        const remainingIds = remaining.map((w) => w.id);
        newFocused = highestZ(remainingIds, newZMap);
      }

      return {
        ...state,
        openWindows: remaining,
        focusedId: newFocused,
        zIndexMap: newZMap,
      };
    }

    // ── minimize ─────────────────────────────────────────────────────────────
    case "minimize": {
      const { id } = action.payload;
      const updated = state.openWindows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      );

      let newFocused = state.focusedId;
      if (state.focusedId === id) {
        const visibleIds = updated
          .filter((w) => !w.minimized)
          .map((w) => w.id);
        newFocused = highestZ(visibleIds, state.zIndexMap);
      }

      return { ...state, openWindows: updated, focusedId: newFocused };
    }

    // ── restore ──────────────────────────────────────────────────────────────
    case "restore": {
      const { id } = action.payload;
      const z = nextZ(state.zIndexMap);
      const updated = state.openWindows.map((w) => {
        if (w.id !== id) return w;
        // If maximized or snapped, restore to restoreGeometry.
        return {
          ...w,
          minimized: false,
          maximized: false,
          snapped: "none" as SnapState,
          geometry: w.maximized || w.snapped !== "none"
            ? w.restoreGeometry
            : w.geometry,
        };
      });
      return {
        ...state,
        openWindows: updated,
        focusedId: id,
        zIndexMap: { ...state.zIndexMap, [id]: z },
      };
    }

    // ── maximize ─────────────────────────────────────────────────────────────
    case "maximize": {
      const { id } = action.payload;
      const win = state.openWindows.find((w) => w.id === id);
      if (!win) return state;

      // Toggle: if already maximized, restore.
      if (win.maximized) {
        return windowReducer(state, { type: "restore", payload: { id } });
      }

      const z = nextZ(state.zIndexMap);
      const updated = state.openWindows.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          maximized: true,
          snapped: "none" as SnapState,
          restoreGeometry: w.geometry,
          // Geometry will be applied by the WindowRenderer using viewport dims.
          // Store a sentinel so the renderer knows to fill the desktop area.
          geometry: { x: 0, y: 0, width: 0, height: 0 },
        };
      });
      return {
        ...state,
        openWindows: updated,
        focusedId: id,
        zIndexMap: { ...state.zIndexMap, [id]: z },
      };
    }

    // ── snapLeft ─────────────────────────────────────────────────────────────
    case "snapLeft": {
      const { id, desktopWidth, desktopHeight } = action.payload;
      const win = state.openWindows.find((w) => w.id === id);
      if (!win) return state;
      const z = nextZ(state.zIndexMap);
      const snappedGeometry: WindowGeometry = {
        x: 0,
        y: 0,
        width: Math.floor(desktopWidth / 2),
        height: desktopHeight,
      };
      const updated = state.openWindows.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          snapped: "left" as SnapState,
          maximized: false,
          restoreGeometry: w.snapped === "none" ? w.geometry : w.restoreGeometry,
          geometry: snappedGeometry,
        };
      });
      return {
        ...state,
        openWindows: updated,
        focusedId: id,
        zIndexMap: { ...state.zIndexMap, [id]: z },
      };
    }

    // ── snapRight ────────────────────────────────────────────────────────────
    case "snapRight": {
      const { id, desktopWidth, desktopHeight } = action.payload;
      const win = state.openWindows.find((w) => w.id === id);
      if (!win) return state;
      const z = nextZ(state.zIndexMap);
      const half = Math.floor(desktopWidth / 2);
      const snappedGeometry: WindowGeometry = {
        x: half,
        y: 0,
        width: desktopWidth - half,
        height: desktopHeight,
      };
      const updated = state.openWindows.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          snapped: "right" as SnapState,
          maximized: false,
          restoreGeometry: w.snapped === "none" ? w.geometry : w.restoreGeometry,
          geometry: snappedGeometry,
        };
      });
      return {
        ...state,
        openWindows: updated,
        focusedId: id,
        zIndexMap: { ...state.zIndexMap, [id]: z },
      };
    }

    // ── drag ─────────────────────────────────────────────────────────────────
    case "drag": {
      const { id, x, y } = action.payload;
      const updated = state.openWindows.map((w) => {
        if (w.id !== id) return w;
        const newGeometry = { ...w.geometry, x, y };
        return {
          ...w,
          geometry: newGeometry,
          restoreGeometry: newGeometry,
          snapped: "none" as SnapState,
          maximized: false,
        };
      });
      return { ...state, openWindows: updated };
    }

    // ── resize ───────────────────────────────────────────────────────────────
    case "resize": {
      const { id, x, y, width, height } = action.payload;
      const updated = state.openWindows.map((w) => {
        if (w.id !== id) return w;
        const newGeometry: WindowGeometry = { x, y, width, height };
        return {
          ...w,
          geometry: newGeometry,
          restoreGeometry: newGeometry,
          snapped: "none" as SnapState,
          maximized: false,
        };
      });
      return { ...state, openWindows: updated };
    }

    // ── syncRoute ────────────────────────────────────────────────────────────
    case "syncRoute": {
      const { id, route } = action.payload;
      const updated = state.openWindows.map((w) =>
        w.id === id ? { ...w, route } : w
      );
      return { ...state, openWindows: updated };
    }

    default:
      return state;
  }
}
