"use client";

// ─── Desktop Interaction Provider ─────────────────────────────────────────────
// Shared state for native-feeling desktop behavior:
//   - Multi-select of desktop icons (driven by clicks and marquee selection)
//   - The currently-open right-click context menu
//   - The currently-open "Get Info" inspector panel
//
// DesktopSurface writes selection/menu state, DesktopShortcuts renders selection
// and opens the icon menu, and DesktopMenuLayer renders the menu + Info panel.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppId } from "../appMetadata";

export type ContextMenuItem =
  | { type: "separator" }
  | {
      type: "item";
      label: string;
      onSelect: () => void;
      disabled?: boolean;
    };

export interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

interface DesktopContextValue {
  // Selection
  selectedIds: Set<AppId>;
  isSelected: (id: AppId) => boolean;
  selectOnly: (id: AppId) => void;
  setSelection: (ids: AppId[]) => void;
  clearSelection: () => void;

  // Context menu
  menu: ContextMenuState | null;
  openMenu: (menu: ContextMenuState) => void;
  closeMenu: () => void;

  // Get Info panel
  infoAppId: AppId | null;
  openInfo: (id: AppId) => void;
  closeInfo: () => void;
}

const DesktopContext = createContext<DesktopContextValue | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<AppId>>(new Set());
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const [infoAppId, setInfoAppId] = useState<AppId | null>(null);

  const isSelected = useCallback(
    (id: AppId) => selectedIds.has(id),
    [selectedIds]
  );

  const selectOnly = useCallback((id: AppId) => {
    setSelectedIds(new Set([id]));
  }, []);

  const setSelection = useCallback((ids: AppId[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds((prev) => (prev.size === 0 ? prev : new Set()));
  }, []);

  const openMenu = useCallback((next: ContextMenuState) => setMenu(next), []);
  const closeMenu = useCallback(() => setMenu(null), []);

  const openInfo = useCallback((id: AppId) => setInfoAppId(id), []);
  const closeInfo = useCallback(() => setInfoAppId(null), []);

  const value = useMemo<DesktopContextValue>(
    () => ({
      selectedIds,
      isSelected,
      selectOnly,
      setSelection,
      clearSelection,
      menu,
      openMenu,
      closeMenu,
      infoAppId,
      openInfo,
      closeInfo,
    }),
    [
      selectedIds,
      isSelected,
      selectOnly,
      setSelection,
      clearSelection,
      menu,
      openMenu,
      closeMenu,
      infoAppId,
      openInfo,
      closeInfo,
    ]
  );

  return (
    <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
  );
}

export function useDesktop(): DesktopContextValue {
  const ctx = useContext(DesktopContext);
  if (!ctx) {
    throw new Error("useDesktop must be used inside a <DesktopProvider>.");
  }
  return ctx;
}
