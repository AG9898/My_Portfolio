"use client";

// ─── Get Info Panel ───────────────────────────────────────────────────────────
// A floating, draggable inspector that replicates the macOS "Get Info" window:
// a narrow fixed-width panel with a header (icon + name + size/date), a
// collapsible General section of metadata rows, and a Comments box. Content is
// pulled per-icon from desktopInfo.ts — including the easter-egg comment.

import { useState } from "react";
import { Rnd } from "react-rnd";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { AppId } from "../appMetadata";
import { ShortcutFileIcon } from "./DesktopShortcuts";
import { DESKTOP_INFO } from "./desktopInfo";

const PANEL_WIDTH = 290;

interface GetInfoPanelProps {
  appId: AppId;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "2px 0", fontSize: 11 }}>
      <span
        style={{
          flex: "0 0 78px",
          textAlign: "right",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {label}:
      </span>
      <span style={{ color: "rgba(255,255,255,0.9)" }}>{value}</span>
    </div>
  );
}

function Disclosure({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        width: "100%",
        padding: "6px 0",
        background: "none",
        border: "none",
        color: "rgba(255,255,255,0.92)",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {open ? (
        <ChevronDown size={13} aria-hidden="true" />
      ) : (
        <ChevronRight size={13} aria-hidden="true" />
      )}
      {label}
    </button>
  );
}

export default function GetInfoPanel({ appId, onClose }: GetInfoPanelProps) {
  const info = DESKTOP_INFO[appId];
  const [generalOpen, setGeneralOpen] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(true);

  if (!info) return null;

  const defaultX =
    typeof window !== "undefined"
      ? Math.max(24, window.innerWidth / 2 - PANEL_WIDTH / 2)
      : 200;

  return (
    <Rnd
      default={{ x: defaultX, y: 96, width: PANEL_WIDTH, height: "auto" }}
      enableResizing={false}
      dragHandleClassName="info-drag-handle"
      bounds="window"
      style={{ zIndex: 9000 }}
    >
      <div
        data-info-panel
        className="glass-chrome"
        role="dialog"
        aria-label={`${info.name} Info`}
        style={{
          width: PANEL_WIDTH,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
          overflow: "hidden",
          color: "rgba(255,255,255,0.9)",
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Title bar (drag handle) */}
        <div
          className="info-drag-handle"
          style={{
            display: "flex",
            alignItems: "center",
            height: 32,
            padding: "0 10px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            cursor: "default",
            userSelect: "none",
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close info"
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FF5F57",
              border: "0.5px solid rgba(0,0,0,0.2)",
              cursor: "pointer",
              padding: 0,
            }}
          />
          <span
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              marginRight: 12,
            }}
          >
            {info.name} Info
          </span>
        </div>

        <div style={{ padding: 14 }}>
          {/* Header: icon + name + size/date */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 48, height: 52, flexShrink: 0 }}>
              <div style={{ transform: "scale(0.86)", transformOrigin: "top left" }}>
                <ShortcutFileIcon appId={appId} />
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{info.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                {info.size}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                Modified {info.modified}
              </div>
            </div>
          </div>

          <div
            style={{
              height: 1,
              margin: "12px 0 2px",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          {/* General */}
          <Disclosure
            label="General"
            open={generalOpen}
            onToggle={() => setGeneralOpen((v) => !v)}
          />
          {generalOpen && (
            <div style={{ paddingLeft: 17, paddingBottom: 6 }}>
              <InfoRow label="Kind" value={info.kind} />
              <InfoRow label="Size" value={info.bytes} />
              <InfoRow label="Where" value={info.where} />
              <InfoRow label="Created" value={info.created} />
              <InfoRow label="Modified" value={info.modified} />
              <InfoRow label="Version" value={info.version} />
            </div>
          )}

          <div
            style={{
              height: 1,
              margin: "2px 0",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          {/* Comments */}
          <Disclosure
            label="Comments"
            open={commentsOpen}
            onToggle={() => setCommentsOpen((v) => !v)}
          />
          {commentsOpen && (
            <div style={{ paddingLeft: 17, paddingBottom: 2 }}>
              <div
                style={{
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.85)",
                  background: "rgba(0,0,0,0.22)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  padding: "8px 10px",
                }}
              >
                {info.comment}
              </div>
            </div>
          )}
        </div>
      </div>
    </Rnd>
  );
}
