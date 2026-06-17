"use client";

// ─── Desktop Menu Layer ───────────────────────────────────────────────────────
// Renders the active context menu and Get Info panel from DesktopProvider state.
// Mounted last in the shell so it stacks above windows, dock, and menu bar.

import ContextMenu from "./ContextMenu";
import GetInfoPanel from "./GetInfoPanel";
import { useDesktop } from "./DesktopProvider";

export default function DesktopMenuLayer() {
  const { menu, closeMenu, infoAppId, closeInfo } = useDesktop();

  return (
    <>
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={menu.items}
          onClose={closeMenu}
        />
      )}
      {infoAppId && <GetInfoPanel appId={infoAppId} onClose={closeInfo} />}
    </>
  );
}
