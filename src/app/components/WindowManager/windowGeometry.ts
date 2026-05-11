import { AppPosition, AppSize } from "../appMetadata";

export const MENU_BAR_HEIGHT = 28;
export const DOCK_HEIGHT = 80;
export const DESKTOP_EDGE_PADDING = 16;

export function getCenteredWindowPosition(
  size: AppSize,
  viewportWidth: number,
  viewportHeight: number
): AppPosition {
  const usableHeight = viewportHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;

  return {
    x: Math.max(DESKTOP_EDGE_PADDING, Math.floor((viewportWidth - size.width) / 2)),
    y: Math.max(
      MENU_BAR_HEIGHT + DESKTOP_EDGE_PADDING,
      Math.floor(MENU_BAR_HEIGHT + (usableHeight - size.height) / 2)
    ),
  };
}

export function getCenteredWindowPositionForViewport(
  size: AppSize
): AppPosition {
  if (typeof window === "undefined") {
    return { x: DESKTOP_EDGE_PADDING, y: MENU_BAR_HEIGHT + DESKTOP_EDGE_PADDING };
  }

  return getCenteredWindowPosition(size, window.innerWidth, window.innerHeight);
}
