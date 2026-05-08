"use client";

// ─── MenuDropdown ──────────────────────────────────────────────────────────────
// Accessible macOS-style dropdown menu built on @radix-ui/react-dropdown-menu.
// Styling uses .glass-chrome for the frosted popover surface.

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MenuItemDef {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  separator?: false;
  onSelect?: () => void;
}

export interface SeparatorDef {
  separator: true;
}

export type MenuEntry = MenuItemDef | SeparatorDef;

export interface MenuDropdownProps {
  /** Trigger label shown in the menu bar */
  trigger: ReactNode;
  /** List of menu items and separators */
  items: MenuEntry[];
  /** Extra class for the trigger button */
  triggerClassName?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MenuDropdown({ trigger, items, triggerClassName }: MenuDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={
            "cursor-default px-1.5 py-0.5 rounded text-[13px] text-label-primary " +
            "hover:bg-[var(--color-control-hover)] " +
            "data-[state=open]:bg-[var(--color-control-hover)] " +
            "outline-none " +
            (triggerClassName ?? "")
          }
        >
          {trigger}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={2}
          className={[
            // Frosted glass popover — matches .glass-chrome token
            "glass-chrome",
            "min-w-[200px] rounded-lg py-1 z-[9999]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.55)]",
            // Radix animation states
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "origin-top-left duration-150",
          ].join(" ")}
        >
          {items.map((item, idx) => {
            if ("separator" in item && item.separator) {
              return (
                <DropdownMenu.Separator
                  key={idx}
                  className="my-1 h-px bg-white/10"
                />
              );
            }

            const def = item as MenuItemDef;
            return (
              <DropdownMenu.Item
                key={idx}
                disabled={def.disabled}
                onSelect={def.onSelect}
                className={[
                  "flex items-center justify-between px-3 py-[3px] text-[13px] rounded-[4px] mx-1",
                  "text-label-primary outline-none cursor-default select-none",
                  "data-[highlighted]:bg-accent data-[highlighted]:text-white",
                  "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
                ].join(" ")}
              >
                <span>{def.label}</span>
                {def.shortcut && (
                  <span className="ml-8 text-[11px] opacity-60">{def.shortcut}</span>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
