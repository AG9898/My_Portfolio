"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

export type WallpaperType = "flow-field" | "tahoe-dawn" | "spooky-smoke" | "gradient-dots";

export type SpookySmokeSettings = {
  smokeColor: string;
};

export type TahoeDawnSettings = {
  backgroundColor: string;
  dawnColor: string;
  glowColor: string;
};

export type FlowFieldSettings = {
  backgroundColor: string;
  lineColor: string;
};

export type GradientDotsSettings = {
  backgroundColor: string;
  dotColor: string;
  rippleColor: string;
};

interface WallpaperContextValue {
  wallpaper: WallpaperType;
  setWallpaper: (wallpaper: WallpaperType) => void;
  tahoeDawnSettings: TahoeDawnSettings;
  setTahoeDawnSettings: (settings: TahoeDawnSettings) => void;
  flowFieldSettings: FlowFieldSettings;
  setFlowFieldSettings: (settings: FlowFieldSettings) => void;
  spookySmokeSettings: SpookySmokeSettings;
  setSpookySmokeSettings: (settings: SpookySmokeSettings) => void;
  gradientDotsSettings: GradientDotsSettings;
  setGradientDotsSettings: (settings: GradientDotsSettings) => void;
}

const DEFAULT_TAHOE_DAWN_SETTINGS: TahoeDawnSettings = {
  backgroundColor: "#0a0a18",
  dawnColor: "#ff5b8a",
  glowColor: "#788cff",
};

const DEFAULT_FLOW_FIELD_SETTINGS: FlowFieldSettings = {
  backgroundColor: "#0a0a0f",
  lineColor: "#7dd3fc",
};

const DEFAULT_SPOOKY_SMOKE_SETTINGS: SpookySmokeSettings = {
  smokeColor: "#a78bfa",
};

const DEFAULT_GRADIENT_DOTS_SETTINGS: GradientDotsSettings = {
  backgroundColor: "#080b14",
  dotColor: "#f8fafc",
  rippleColor: "#38bdf8",
};

const WallpaperContext = createContext<WallpaperContextValue>({
  wallpaper: "flow-field",
  setWallpaper: () => {},
  tahoeDawnSettings: DEFAULT_TAHOE_DAWN_SETTINGS,
  setTahoeDawnSettings: () => {},
  flowFieldSettings: DEFAULT_FLOW_FIELD_SETTINGS,
  setFlowFieldSettings: () => {},
  spookySmokeSettings: DEFAULT_SPOOKY_SMOKE_SETTINGS,
  setSpookySmokeSettings: () => {},
  gradientDotsSettings: DEFAULT_GRADIENT_DOTS_SETTINGS,
  setGradientDotsSettings: () => {},
});

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpaper, setWallpaper] = useState<WallpaperType>("tahoe-dawn");
  const [tahoeDawnSettings, setTahoeDawnSettings] = useState<TahoeDawnSettings>(
    DEFAULT_TAHOE_DAWN_SETTINGS,
  );
  const [flowFieldSettings, setFlowFieldSettings] = useState<FlowFieldSettings>(
    DEFAULT_FLOW_FIELD_SETTINGS,
  );
  const [spookySmokeSettings, setSpookySmokeSettings] = useState<SpookySmokeSettings>(
    DEFAULT_SPOOKY_SMOKE_SETTINGS,
  );
  const [gradientDotsSettings, setGradientDotsSettings] = useState<GradientDotsSettings>(
    DEFAULT_GRADIENT_DOTS_SETTINGS,
  );

  return (
    <WallpaperContext.Provider
      value={{
        wallpaper,
        setWallpaper,
        tahoeDawnSettings,
        setTahoeDawnSettings,
        flowFieldSettings,
        setFlowFieldSettings,
        spookySmokeSettings,
        setSpookySmokeSettings,
        gradientDotsSettings,
        setGradientDotsSettings,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  return useContext(WallpaperContext);
}
