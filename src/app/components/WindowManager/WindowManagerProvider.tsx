"use client";

// ─── WindowManagerProvider ─────────────────────────────────────────────────────
// Provides global window manager state and dispatch via React context.
// Wraps the app tree so any component can open, focus, close, or resize windows.

import React, {
  createContext,
  useEffect,
  useContext,
  useReducer,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  WindowState,
  WindowAction,
  initialWindowState,
  windowReducer,
} from "./windowReducer";

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------

interface WindowManagerContextValue {
  state: WindowState;
  dispatch: React.Dispatch<WindowAction>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
  null
);

WindowManagerContext.displayName = "WindowManagerContext";

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface WindowManagerProviderProps {
  children: ReactNode;
}

export function WindowManagerProvider({ children }: WindowManagerProviderProps) {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState);
  const pathname = usePathname();
  const router = useRouter();
  const focusedWindow = state.openWindows.find(
    (win) => win.id === state.focusedId
  );

  useEffect(() => {
    dispatch({ type: "syncRoute", payload: { route: pathname } });
  }, [pathname]);

  useEffect(() => {
    if (!focusedWindow || focusedWindow.route === pathname) {
      return;
    }

    router.push(focusedWindow.route);
  }, [focusedWindow, pathname, router]);

  return (
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      {children}
    </WindowManagerContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access window manager state and dispatch from any client component.
 * Must be used inside a <WindowManagerProvider>.
 */
export function useWindowManager(): WindowManagerContextValue {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error(
      "useWindowManager must be used inside a <WindowManagerProvider>."
    );
  }
  return ctx;
}
